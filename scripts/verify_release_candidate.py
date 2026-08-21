"""Build and smoke-test local Phase 8 wheel/sdist release candidates."""

from __future__ import annotations

import argparse
import base64
import csv
import hashlib
import http.cookiejar
import io
import json
import os
import re
import subprocess
import sys
import tarfile
import tempfile
import time
import urllib.request
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DATE_EPOCH = "1704067200"
REQUIRED_WHEEL_ASSETS = {
    "governdiff/_reviewer/scripts/review-session.mjs",
    "governdiff/_reviewer/dist/server/index.js",
    "governdiff/_reviewer/THIRD_PARTY_NOTICES.md",
}


def _run(
    command: list[str],
    *,
    cwd: Path = ROOT,
    environment: dict[str, str] | None = None,
) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=cwd,
        env=environment,
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _wheel_inventory(path: Path) -> tuple[set[str], bool]:
    with zipfile.ZipFile(path) as archive:
        names = set(archive.namelist())
    forbidden = any(
        "/.openai/" in name
        or name.endswith("/.openai/hosting.json")
        or "/node_modules/" in name
        for name in names
    )
    return names, forbidden


def _verify_wheel_record(path: Path) -> bool:
    """Verify every hashed/size-bearing entry in the wheel RECORD."""

    with zipfile.ZipFile(path) as archive:
        record_names = [name for name in archive.namelist() if name.endswith(".dist-info/RECORD")]
        if len(record_names) != 1:
            return False
        rows = list(csv.reader(io.StringIO(archive.read(record_names[0]).decode("utf-8"))))
        known = set(archive.namelist())
        for name, digest_field, size_field in rows:
            if name not in known:
                return False
            if not digest_field and not size_field:
                if name != record_names[0]:
                    return False
                continue
            if not digest_field.startswith("sha256=") or not size_field.isdigit():
                return False
            payload = archive.read(name)
            digest = base64.urlsafe_b64encode(hashlib.sha256(payload).digest()).rstrip(b"=").decode("ascii")
            if digest_field != f"sha256={digest}" or int(size_field) != len(payload):
                return False
    return True


def _smoke_installed_reviewer(python: Path, work: Path) -> dict[str, object]:
    old = work / "old.md"
    new = work / "new.md"
    output = work / "reviewed"
    old.write_text(
        "# Incident response\n\nVendors may report incidents within 72 hours.\n",
        encoding="utf-8",
    )
    new.write_text(
        "# Incident response\n\nVendors must report incidents within 24 hours.\n",
        encoding="utf-8",
    )
    process = subprocess.Popen(
        [
            str(python),
            "-u",
            "-m",
            "governdiff",
            "review",
            str(old),
            str(new),
            "--output-dir",
            str(output),
            "--no-open",
            "--session-timeout",
            "60",
        ],
        cwd=work,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
    )
    assert process.stdout is not None
    assert process.stderr is not None
    url = ""
    transcript: list[str] = []
    deadline = time.monotonic() + 25
    while time.monotonic() < deadline:
        line = process.stdout.readline()
        if line:
            transcript.append(line.rstrip())
            match = re.search(r"ready at (http://127\.0\.0\.1:\d+/)", line)
            if match:
                url = match.group(1)
                break
        elif process.poll() is not None:
            break
        else:
            time.sleep(0.05)
    if not url:
        process.terminate()
        process.wait(timeout=5)
        raise RuntimeError(
            "Installed Reviewer did not start: "
            + " | ".join(transcript + [process.stderr.read().strip()])
        )

    cookie_jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(cookie_jar)
    )
    request = urllib.request.Request(url, headers={"Accept": "text/html"})
    with opener.open(request, timeout=10) as response:
        if response.status != 200:
            raise RuntimeError("Installed Reviewer navigation failed")
    with opener.open(f"{url}api/review-session", timeout=10) as response:
        session = json.loads(response.read())
    report = session["report"]
    review = {
        "schema_version": "governdiff-review/1.1",
        "report": {
            "old_sha256": report["old_document"]["sha256"],
            "new_sha256": report["new_document"]["sha256"],
            "generated_at": report["generated_at"],
        },
        "exported_at": "2026-08-13T00:00:00Z",
        "decisions": [],
        "field_edits": [],
        "alignment_overrides": [],
        "filters": {"visible_change_fingerprints": []},
    }
    export = urllib.request.Request(
        f"{url}api/review-session/export",
        data=json.dumps(review).encode("utf-8"),
        method="POST",
        headers={"Content-Type": "application/json", "Origin": url.rstrip("/")},
    )
    with opener.open(export, timeout=10) as response:
        if not json.loads(response.read())["accepted"]:
            raise RuntimeError("Installed Reviewer export was rejected")
    stdout, stderr = process.communicate(input="\n", timeout=20)
    transcript.extend(stdout.splitlines())
    if process.returncode != 0:
        raise RuntimeError(
            f"Installed Reviewer exited {process.returncode}: {stderr.strip()}"
        )
    expected = {
        "governdiff-final.json",
        "governdiff-final.md",
        "governdiff-final.html",
        "governdiff-final.csv",
    }
    outputs = {path.name for path in output.iterdir()}
    return {
        "loopback_only": url.startswith("http://127.0.0.1:"),
        "report_schema": report["schema_version"],
        "final_reports": sorted(expected & outputs),
        "passed": process.returncode == 0 and expected <= outputs,
    }


def verify(output_directory: Path) -> dict[str, object]:
    output_directory = output_directory.resolve()
    if output_directory.exists() and any(output_directory.iterdir()):
        raise ValueError(f"Release output is not empty: {output_directory}")
    output_directory.mkdir(parents=True, exist_ok=True)
    environment = os.environ.copy()
    environment.update(
        {
            "SOURCE_DATE_EPOCH": SOURCE_DATE_EPOCH,
            "PYTHONHASHSEED": "0",
            "PYTHONDONTWRITEBYTECODE": "1",
            "PIP_DISABLE_PIP_VERSION_CHECK": "1",
        }
    )
    with tempfile.TemporaryDirectory(prefix="governdiff-release-") as temporary:
        work = Path(temporary)
        wheel_a = work / "wheel-from-tree"
        wheel_b = work / "wheel-from-sdist"
        sdist_out = work / "sdist-a"
        sdist_out_b = work / "sdist-b"
        for path in (wheel_a, wheel_b, sdist_out, sdist_out_b):
            path.mkdir()
        _run(
            [
                sys.executable,
                "-m",
                "pip",
                "wheel",
                ".",
                "--no-deps",
                "--no-build-isolation",
                "--wheel-dir",
                str(wheel_a),
            ],
            environment=environment,
        )
        _run(
            [
                sys.executable,
                "-c",
                "import setuptools.build_meta as b; b.build_sdist(r'"
                + str(sdist_out)
                + "')",
            ],
            environment=environment,
        )
        sdist = next(sdist_out.glob("governdiff-*.tar.gz"))
        _run(
            [
                sys.executable,
                "-c",
                "import setuptools.build_meta as b; b.build_sdist(r'"
                + str(sdist_out_b)
                + "')",
            ],
            environment=environment,
        )
        sdist_b = next(sdist_out_b.glob("governdiff-*.tar.gz"))
        sdists_byte_identical = _sha256(sdist) == _sha256(sdist_b)
        with tarfile.open(sdist, "r:gz") as archive:
            sdist_names = set(archive.getnames())
        sdist_prefix = next(iter(sdist_names)).split("/", 1)[0]
        required_sdist = {
            f"{sdist_prefix}/reviewer-ui/scripts/review-session.mjs",
            f"{sdist_prefix}/reviewer-ui/dist/server/index.js",
            f"{sdist_prefix}/reviewer-ui/THIRD_PARTY_NOTICES.md",
        }
        sdist_forbidden = any(
            "/.openai/" in name
            or "/node_modules/" in name
            or "/tests/policy_corpus/" in name
            or "/tests/expansion_corpus/" in name
            for name in sdist_names
        )
        unpacked = work / "sdist-unpacked"
        unpacked.mkdir()
        with tarfile.open(sdist, "r:gz") as archive:
            archive.extractall(unpacked, filter="data")
        sdist_root = unpacked / sdist_prefix
        _run(
            [
                sys.executable,
                "-m",
                "pip",
                "wheel",
                ".",
                "--no-deps",
                "--no-build-isolation",
                "--wheel-dir",
                str(wheel_b),
            ],
            cwd=sdist_root,
            environment=environment,
        )
        direct_wheel = next(wheel_a.glob("governdiff-*.whl"))
        rebuilt_wheel = next(wheel_b.glob("governdiff-*.whl"))
        direct_names, direct_forbidden = _wheel_inventory(direct_wheel)
        rebuilt_names, rebuilt_forbidden = _wheel_inventory(rebuilt_wheel)
        direct_record_valid = _verify_wheel_record(direct_wheel)
        rebuilt_record_valid = _verify_wheel_record(rebuilt_wheel)
        tree_and_sdist_wheels_byte_identical = _sha256(direct_wheel) == _sha256(rebuilt_wheel)

        clean = work / "clean-environment"
        _run([sys.executable, "-m", "venv", str(clean)], environment=environment)
        clean_python = clean / (
            "Scripts/python.exe" if os.name == "nt" else "bin/python"
        )
        _run(
            [
                str(clean_python),
                "-m",
                "pip",
                "install",
                "--no-deps",
                str(rebuilt_wheel),
            ],
            environment=environment,
        )
        version = _run(
            [str(clean_python), "-m", "governdiff", "--version"],
            cwd=work,
            environment=environment,
        ).stdout.strip()
        installed_root = _run(
            [
                str(clean_python),
                "-c",
                "from governdiff.review_session import _reviewer_root; print(_reviewer_root())",
            ],
            cwd=work,
            environment=environment,
        ).stdout.strip()
        reviewer_smoke = _smoke_installed_reviewer(clean_python, work)

        final_wheel = output_directory / rebuilt_wheel.name
        final_sdist = output_directory / sdist.name
        final_wheel.write_bytes(rebuilt_wheel.read_bytes())
        final_sdist.write_bytes(sdist.read_bytes())
        wheel_assets_ok = REQUIRED_WHEEL_ASSETS <= direct_names
        sdist_assets_ok = required_sdist <= sdist_names
        passed = all(
            (
                wheel_assets_ok,
                REQUIRED_WHEEL_ASSETS <= rebuilt_names,
                sdist_assets_ok,
                not direct_forbidden,
                not rebuilt_forbidden,
                not sdist_forbidden,
                direct_record_valid,
                rebuilt_record_valid,
                tree_and_sdist_wheels_byte_identical,
                sdists_byte_identical,
                reviewer_smoke["passed"],
                "_reviewer" in installed_root,
            )
        )
        return {
            "schema_version": "governdiff-release-candidate/1.0",
            "source_date_epoch": SOURCE_DATE_EPOCH,
            "version": version,
            "wheel": {
                "file": final_wheel.name,
                "bytes": final_wheel.stat().st_size,
                "sha256": _sha256(final_wheel),
                "reviewer_assets": wheel_assets_ok,
                "record_valid": rebuilt_record_valid,
                "forbidden_release_paths": direct_forbidden,
            },
            "sdist": {
                "file": final_sdist.name,
                "bytes": final_sdist.stat().st_size,
                "sha256": _sha256(final_sdist),
                "reviewer_assets": sdist_assets_ok,
                "forbidden_release_paths": sdist_forbidden,
                "two_builds_byte_identical": sdists_byte_identical,
            },
            "tree_and_sdist_wheels_byte_identical": tree_and_sdist_wheels_byte_identical,
            "installed_reviewer_root": installed_root,
            "installed_reviewer_smoke": reviewer_smoke,
            "passed": passed,
        }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", default="release-candidate")
    parser.add_argument("--result", default="")
    args = parser.parse_args(argv)
    try:
        result = verify(ROOT / args.output_dir)
    except Exception as error:  # noqa: BLE001
        result = {
            "schema_version": "governdiff-release-candidate/1.0",
            "error_type": error.__class__.__name__,
            "error": str(error),
            "passed": False,
        }
    rendered = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.result:
        target = ROOT / args.result
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
