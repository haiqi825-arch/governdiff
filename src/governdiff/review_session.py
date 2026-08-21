"""Secure loopback lifecycle for the interactive local Reviewer."""

from __future__ import annotations

import json
import os
import secrets
import shutil
import subprocess
import tempfile
import time
import webbrowser
from collections.abc import Mapping
from pathlib import Path
from typing import Any


SESSION_PREFIX = "governdiff-review-"
STATUS_FILE = "session-status.json"
EXPORTED_REVIEW_FILE = "review.json"


def create_session_directory() -> Path:
    directory = Path(tempfile.mkdtemp(prefix=SESSION_PREFIX)).resolve()
    try:
        directory.chmod(0o700)
    except OSError:
        pass
    return directory


def _write_private_json(path: Path, value: Mapping[str, Any]) -> None:
    temporary = path.with_name(f".{path.name}.{secrets.token_hex(8)}.tmp")
    temporary.write_text(
        json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    try:
        temporary.chmod(0o600)
    except OSError:
        pass
    temporary.replace(path)


def _reviewer_root() -> Path:
    configured = os.environ.get("GOVERNDIFF_REVIEWER_ROOT")
    candidates = [
        Path(configured).resolve() if configured else None,
        Path(__file__).resolve().parent / "_reviewer",
        Path(__file__).resolve().parents[2] / "reviewer-ui",
        Path(sys_prefix()).resolve() / "share" / "governdiff" / "reviewer-ui",
    ]
    for candidate in candidates:
        if candidate and (candidate / "scripts" / "review-session.mjs").is_file():
            if (candidate / "dist" / "server" / "index.js").is_file():
                return candidate
    raise RuntimeError(
        "Local Reviewer assets are unavailable; reinstall a release wheel or run "
        "`npm run build` in reviewer-ui before starting review"
    )


def sys_prefix() -> str:
    # Kept behind a function so installed-layout discovery can be tested without
    # mutating interpreter globals.
    import sys

    return sys.prefix


def _node_executable() -> str:
    node = shutil.which("node")
    if not node:
        raise RuntimeError("Node.js is required to start the local Reviewer")
    return node


def _read_status(path: Path) -> dict[str, Any] | None:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        return None
    return value if isinstance(value, dict) else None


def _stop_process(process: subprocess.Popen[str] | None) -> None:
    if process is None or process.poll() is not None:
        return
    process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait(timeout=5)


def run_local_reviewer(
    report_payload: Mapping[str, Any],
    *,
    session_directory: Path,
    initial_review: Mapping[str, Any] | None = None,
    port: int = 0,
    language: str = "en",
    no_open: bool = False,
    session_timeout_seconds: int = 43_200,
) -> dict[str, Any]:
    """Run one Reviewer session and return its exported review mapping."""

    if port < 0 or port > 65_535:
        raise ValueError("Reviewer port must be between 0 and 65535")
    if session_timeout_seconds < 10:
        raise ValueError("Reviewer session timeout must be at least 10 seconds")
    directory = session_directory.resolve()
    if not directory.is_dir():
        raise ValueError("Reviewer session directory is unavailable")

    report_file = directory / "report.json"
    initial_review_file = directory / "initial-review.json"
    _write_private_json(report_file, report_payload)
    if initial_review is not None:
        _write_private_json(initial_review_file, initial_review)

    reviewer_root = _reviewer_root()
    script = reviewer_root / "scripts" / "review-session.mjs"
    bootstrap = {
        "token": secrets.token_urlsafe(48),
        "port": port,
        "session_dir": str(directory),
        "report_file": str(report_file),
        "initial_review_file": str(initial_review_file) if initial_review else None,
        "language": "zh" if language == "zh" else "en",
        "heartbeat_timeout_ms": 30_000,
    }
    creation_flags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
    process: subprocess.Popen[str] | None = None
    started = time.monotonic()
    status_file = directory / STATUS_FILE
    try:
        process = subprocess.Popen(
            [_node_executable(), str(script)],
            cwd=reviewer_root,
            stdin=subprocess.PIPE,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            text=True,
            encoding="utf-8",
            creationflags=creation_flags,
        )
        assert process.stdin is not None
        process.stdin.write(json.dumps(bootstrap, ensure_ascii=False))
        process.stdin.close()

        ready: dict[str, Any] | None = None
        while time.monotonic() - started < 20:
            if process.poll() is not None:
                raise RuntimeError("Local Reviewer failed to start")
            status = _read_status(status_file)
            if status and status.get("event") == "ready":
                ready = status
                break
            time.sleep(0.1)
        if ready is None:
            raise RuntimeError("Local Reviewer did not become ready")
        actual_port = int(ready.get("port", 0))
        if ready.get("host") != "127.0.0.1" or not 0 < actual_port <= 65_535:
            raise RuntimeError("Local Reviewer reported an invalid loopback endpoint")

        url = f"http://127.0.0.1:{actual_port}/"
        print(f"GovernDiff Reviewer ready at {url}")
        if no_open:
            print("Open the loopback URL in a browser, review the queue, then export the review.")
        else:
            opened = webbrowser.open(url, new=2)
            if not opened:
                print("The browser did not open automatically; use the loopback URL above.")

        deadline = started + session_timeout_seconds
        while time.monotonic() < deadline:
            status = _read_status(status_file)
            if status and int(status.get("outbound_network_attempts", 0)):
                raise RuntimeError("Reviewer blocked an outbound network attempt")
            if status and status.get("event") == "review-exported":
                exported = json.loads(
                    (directory / EXPORTED_REVIEW_FILE).read_text(encoding="utf-8")
                )
                if not isinstance(exported, dict):
                    raise ValueError("Exported review JSON must contain an object")
                return exported
            if status and status.get("event") == "browser-closed":
                raise RuntimeError("Reviewer browser closed before the review was exported")
            if process.poll() is not None:
                raise RuntimeError("Local Reviewer stopped before the review was exported")
            time.sleep(0.2)
        raise RuntimeError("Local Reviewer session timed out before export")
    finally:
        _stop_process(process)


def securely_remove_session(directory: Path) -> None:
    """Remove only a session directory created in the system temp root."""

    resolved = directory.resolve()
    temp_root = Path(tempfile.gettempdir()).resolve()
    if resolved.parent != temp_root or not resolved.name.startswith(SESSION_PREFIX):
        raise ValueError("Refusing to clean an unrecognized Reviewer session directory")
    if resolved.exists():
        shutil.rmtree(resolved)


def retain_session(directory: Path, output_directory: Path) -> str:
    output_directory.mkdir(parents=True, exist_ok=True)
    name = f".governdiff-session-{secrets.token_hex(4)}"
    target = (output_directory / name).resolve()
    if target.parent != output_directory.resolve():
        raise ValueError("Invalid retained session destination")
    shutil.move(str(directory.resolve()), str(target))
    return name
