"""Setuptools hook that embeds the built local Reviewer in release wheels."""

from __future__ import annotations

import gzip
import os
import shutil
import tarfile
from pathlib import Path

from setuptools import setup
from setuptools.command.build_py import build_py
from setuptools.command.sdist import sdist


ROOT = Path(__file__).resolve().parent
REVIEWER = ROOT / "reviewer-ui"


class BuildWithReviewer(build_py):
    """Copy prebuilt Reviewer assets into the platform-independent wheel."""

    def run(self) -> None:
        server = REVIEWER / "dist" / "server" / "index.js"
        client = REVIEWER / "dist" / "client"
        session_script = REVIEWER / "scripts" / "review-session.mjs"
        notices = REVIEWER / "THIRD_PARTY_NOTICES.md"
        missing = [
            str(path.relative_to(ROOT))
            for path in (server, client, session_script, notices)
            if not path.exists()
        ]
        if missing:
            raise RuntimeError(
                "Reviewer release assets are missing: "
                + ", ".join(missing)
                + ". Run `npm ci` and `npm run build` in reviewer-ui first."
            )

        super().run()
        target = Path(self.build_lib) / "governdiff" / "_reviewer"
        # build_py may reuse build/lib between invocations. Remove only this
        # generated staging directory so renamed Vite bundles cannot survive
        # into a later wheel.
        if target.exists():
            shutil.rmtree(target)
        shutil.copytree(
            REVIEWER / "dist",
            target / "dist",
            dirs_exist_ok=True,
            ignore=shutil.ignore_patterns(".openai"),
        )
        (target / "scripts").mkdir(parents=True, exist_ok=True)
        shutil.copy2(session_script, target / "scripts" / session_script.name)
        shutil.copy2(notices, target / notices.name)


class DeterministicSdist(sdist):
    """Create byte-reproducible gztar archives when SOURCE_DATE_EPOCH is set."""

    def make_archive(
        self,
        base_name: str | os.PathLike[str],
        format: str,
        root_dir: str | os.PathLike[str] | bytes | os.PathLike[bytes] | None = None,
        base_dir: str | None = None,
        owner: str | None = None,
        group: str | None = None,
    ) -> str:
        epoch_value = os.environ.get("SOURCE_DATE_EPOCH")
        if format != "gztar" or not epoch_value or root_dir is not None or not base_dir:
            return super().make_archive(base_name, format, root_dir, base_dir, owner, group)

        epoch = int(epoch_value)
        archive_name = f"{base_name}.tar.gz"
        Path(archive_name).parent.mkdir(parents=True, exist_ok=True)
        source = Path(base_dir)

        def normalize(info: tarfile.TarInfo) -> tarfile.TarInfo:
            info.mtime = epoch
            info.uid = 0
            info.gid = 0
            info.uname = ""
            info.gname = ""
            info.mode = 0o755 if info.isdir() else 0o644
            return info

        with Path(archive_name).open("wb") as raw:
            with gzip.GzipFile(filename="", mode="wb", fileobj=raw, mtime=epoch) as compressed:
                with tarfile.open(fileobj=compressed, mode="w", format=tarfile.PAX_FORMAT) as archive:
                    paths = [source, *sorted(source.rglob("*"), key=lambda item: item.as_posix())]
                    for path in paths:
                        archive.add(path, arcname=path.as_posix(), recursive=False, filter=normalize)
        return archive_name


setup(cmdclass={"build_py": BuildWithReviewer, "sdist": DeterministicSdist})
