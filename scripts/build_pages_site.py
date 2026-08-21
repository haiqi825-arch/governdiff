"""Build the dependency-free GovernDiff GitHub Pages artifact."""

from __future__ import annotations

import argparse
import html
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SITE_SOURCE = ROOT / "site"

ASSETS = {
    "docs/assets/governdiff-social-preview-v2.png": "assets/social-preview.png",
    "docs/assets/governdiff-producthunt-thumbnail.png": "assets/icon.png",
    "docs/assets/reviewer-evidence.png": "assets/reviewer-evidence.png",
    "docs/assets/reviewer-demo.gif": "assets/reviewer-demo.gif",
    "docs/assets/demo-incident-deadline.html": "demo/incident-deadline.html",
    "docs/assets/demo-access-scope.html": "demo/access-scope.html",
    "docs/assets/demo-exception-authority.html": "demo/exception-authority.html",
}


def build(output: Path, repository_url: str, site_url: str) -> None:
    output = output.resolve()
    if output.exists():
        raise RuntimeError(f"refusing to overwrite existing output: {output}")
    output.mkdir(parents=True)

    for source in SITE_SOURCE.rglob("*"):
        if source.is_file():
            relative = source.relative_to(SITE_SOURCE)
            destination = output / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)

    for source_name, destination_name in ASSETS.items():
        source = ROOT / source_name
        if not source.is_file():
            raise RuntimeError(f"required Pages asset is missing: {source_name}")
        destination = output / destination_name
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)

    repository = repository_url.rstrip("/") if repository_url else "#quickstart"
    origin = site_url.rstrip("/") if site_url else "."
    replacements = {
        "{{REPOSITORY_URL}}": html.escape(repository, quote=True),
        "{{SITE_URL}}": html.escape(origin, quote=True),
        "{{SOCIAL_IMAGE_URL}}": html.escape(
            f"{origin}/assets/social-preview.png", quote=True
        ),
    }
    index = output / "index.html"
    rendered = index.read_text(encoding="utf-8")
    for token, value in replacements.items():
        rendered = rendered.replace(token, value)
    if "{{" in rendered or "}}" in rendered:
        raise RuntimeError("unresolved template token in Pages index")
    index.write_text(rendered, encoding="utf-8")

    (output / ".nojekyll").write_text("", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "_site")
    parser.add_argument("--repository-url", default="")
    parser.add_argument("--site-url", default="")
    args = parser.parse_args()
    try:
        build(args.output, args.repository_url, args.site_url)
    except (OSError, RuntimeError) as error:
        parser.error(str(error))
    files = sorted(path for path in args.output.rglob("*") if path.is_file())
    print(f"built GitHub Pages artifact: {len(files)} files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
