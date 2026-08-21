"""Check local documentation links, anchors, assets, and publication hygiene."""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parents[1]
ROOT_PUBLIC = [
    "README.md",
    "CONTRIBUTING.md",
    "SECURITY.md",
    "CHANGELOG.md",
    "ROADMAP.md",
    "GOVERNDIFF_PRD.md",
]
DOC_PUBLIC = [
    "ACTION_RELEASE_POLICY.md",
    "CORPUS_LICENSE_AUDIT.md",
    "INPUT_FORMATS.md",
    "PUBLIC_DEMO_READINESS.md",
    "RELEASE_CHECKLIST.md",
]
LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
HEADING_RE = re.compile(r"^#{1,6}\s+(.+?)\s*$", re.MULTILINE)
WINDOWS_PATH_RE = re.compile(
    r"(?i)(?<![a-z])(?:[a-z]:[\\/]|/users/[^/]+/|/home/[^/]+/)"
)


def _slug(text: str) -> str:
    text = re.sub(r"\s+#+\s*$", "", text.strip().casefold())
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"[`*_~]", "", text)
    kept = "".join(
        character
        for character in text
        if not unicodedata.category(character).startswith("P") or character in "-_"
    )
    return re.sub(r"\s+", "-", kept)


def _anchors(path: Path) -> set[str]:
    counts: Counter[str] = Counter()
    anchors: set[str] = set()
    for heading in HEADING_RE.findall(path.read_text(encoding="utf-8")):
        base = _slug(heading)
        suffix = counts[base]
        counts[base] += 1
        anchors.add(base if suffix == 0 else f"{base}-{suffix}")
    return anchors


def _markdown_files() -> list[Path]:
    files = [ROOT / name for name in ROOT_PUBLIC]
    files.extend(sorted((ROOT / "docs").glob("*.md")))
    files.extend(sorted((ROOT / "examples" / "public-cases").rglob("*.md")))
    return [path for path in files if path.is_file()]


def check() -> dict[str, object]:
    errors: list[str] = []
    external_urls: set[str] = set()
    checked_links = 0
    checked_anchors = 0
    files = _markdown_files()

    for source in files:
        text = source.read_text(encoding="utf-8")
        for raw_target in LINK_RE.findall(text):
            target = raw_target.strip()
            if target.startswith("<") and target.endswith(">"):
                target = target[1:-1]
            if " \"" in target:
                target = target.split(" \"", 1)[0]
            if target.startswith(("https://", "http://")):
                external_urls.add(target)
                continue
            if target.startswith(("mailto:", "data:")):
                continue
            checked_links += 1
            path_part, separator, fragment = target.partition("#")
            destination = source if not path_part else source.parent / unquote(path_part)
            if not destination.exists():
                errors.append(f"{source.relative_to(ROOT)}: missing target {target}")
                continue
            if separator and fragment:
                if not destination.is_file() or destination.suffix.casefold() != ".md":
                    errors.append(f"{source.relative_to(ROOT)}: anchor on non-Markdown target {target}")
                    continue
                checked_anchors += 1
                if unquote(fragment).casefold() not in _anchors(destination):
                    errors.append(f"{source.relative_to(ROOT)}: missing anchor {target}")

    publication_files = [ROOT / name for name in ROOT_PUBLIC]
    publication_files.extend(ROOT / "docs" / name for name in DOC_PUBLIC)
    publication_files.extend((ROOT / "examples" / "public-cases").rglob("*"))
    local_path_hits: list[str] = []
    for path in publication_files:
        if path.is_file() and path.suffix.casefold() in {".md", ".json", ".yml", ".yaml"}:
            for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
                if WINDOWS_PATH_RE.search(line):
                    local_path_hits.append(f"{path.relative_to(ROOT)}:{line_number}")
    if local_path_hits:
        errors.extend(f"local absolute path: {hit}" for hit in local_path_hits)

    result = {
        "schema_version": "governdiff-documentation-check/1.0",
        "markdown_files": len(files),
        "local_links_and_assets": checked_links,
        "anchors": checked_anchors,
        "external_urls_declared": len(external_urls),
        "publication_files_with_local_paths": local_path_hits,
        "errors": errors,
        "passed": not errors,
    }
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output")
    args = parser.parse_args()
    result = check()
    rendered = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered, encoding="utf-8", newline="\n")
    print(rendered, end="")
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
