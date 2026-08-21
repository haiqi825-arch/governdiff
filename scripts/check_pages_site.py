"""Validate the built GovernDiff GitHub Pages artifact without network access."""

from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


TOKEN_PATTERN = re.compile(r"\{\{[^{}]+\}\}")
WINDOWS_PATH_PATTERN = re.compile(r"(?<![A-Za-z])[A-Za-z]:[\\/]")
CSS_URL_PATTERN = re.compile(r"url\(\s*(['\"]?)(.*?)\1\s*\)", re.IGNORECASE)
EXTERNAL_SCHEMES = {"http", "https", "mailto", "tel", "data"}


class PageParser(HTMLParser):
    """Collect the small set of facts required for a static-site integrity check."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: set[str] = set()
        self.links: list[str] = []
        self.resources: list[str] = []
        self.images = 0
        self.images_without_alt = 0
        self.counts = {name: 0 for name in ("header", "nav", "main", "footer", "h1")}
        self.meta_names: set[str] = set()
        self.meta_properties: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        element_id = attributes.get("id")
        if element_id:
            self.ids.add(element_id)
        if tag in self.counts:
            self.counts[tag] += 1
        if tag == "a" and attributes.get("href"):
            self.links.append(attributes["href"] or "")
        if tag in {"img", "script", "source", "video", "audio"} and attributes.get("src"):
            self.resources.append(attributes["src"] or "")
        if tag == "link" and attributes.get("href"):
            self.resources.append(attributes["href"] or "")
        if tag == "img":
            self.images += 1
            if "alt" not in attributes or attributes.get("alt") is None:
                self.images_without_alt += 1
        if tag == "meta":
            if attributes.get("name"):
                self.meta_names.add(attributes["name"] or "")
            if attributes.get("property"):
                self.meta_properties.add(attributes["property"] or "")


def parse_page(path: Path) -> tuple[str, PageParser]:
    text = path.read_text(encoding="utf-8")
    parser = PageParser()
    parser.feed(text)
    return text, parser


def local_target(site: Path, source: Path, reference: str) -> tuple[Path | None, str]:
    parsed = urlsplit(reference)
    if parsed.scheme.lower() in EXTERNAL_SCHEMES or parsed.netloc:
        return None, parsed.fragment
    decoded = unquote(parsed.path)
    if decoded.startswith("/"):
        target = site / decoded.lstrip("/")
    elif decoded:
        target = source.parent / decoded
    else:
        target = source
    return target.resolve(), parsed.fragment


def check_reference(
    site: Path,
    source: Path,
    reference: str,
    ids_by_page: dict[Path, set[str]],
    errors: list[str],
) -> None:
    target, fragment = local_target(site, source, reference)
    if target is None:
        return
    try:
        target.relative_to(site.resolve())
    except ValueError:
        errors.append(f"reference escapes site root: {source.name}: {reference}")
        return
    if target.is_dir():
        target = target / "index.html"
    if not target.is_file():
        errors.append(f"missing local target: {source.name}: {reference}")
        return
    if fragment and target.suffix.lower() in {".html", ".htm"}:
        if target not in ids_by_page:
            _, target_parser = parse_page(target)
            ids_by_page[target] = target_parser.ids
        if fragment not in ids_by_page[target]:
            errors.append(f"missing anchor: {source.name}: {reference}")


def validate(site: Path) -> dict[str, object]:
    site = site.resolve()
    errors: list[str] = []
    index = site / "index.html"
    if not index.is_file():
        return {"schema": "governdiff-pages-check/1.0", "errors": ["missing index.html"]}

    html_files = sorted(site.rglob("*.html"))
    ids_by_page: dict[Path, set[str]] = {}
    parsed_pages: dict[Path, tuple[str, PageParser]] = {}
    for page in html_files:
        text, parser = parse_page(page)
        parsed_pages[page.resolve()] = (text, parser)
        ids_by_page[page.resolve()] = parser.ids
        if TOKEN_PATTERN.search(text):
            errors.append(f"unresolved template token: {page.relative_to(site)}")
        if WINDOWS_PATH_PATTERN.search(text):
            errors.append(f"absolute Windows path leaked: {page.relative_to(site)}")

    index_text, index_parser = parsed_pages[index.resolve()]
    for tag in ("header", "nav", "main", "footer"):
        if index_parser.counts[tag] < 1:
            errors.append(f"missing semantic element: {tag}")
    if index_parser.counts["h1"] != 1:
        errors.append(f"expected exactly one h1, found {index_parser.counts['h1']}")
    if index_parser.images_without_alt:
        errors.append(f"images without alt: {index_parser.images_without_alt}")

    required_meta_names = {"description", "viewport", "twitter:card", "twitter:image"}
    required_meta_properties = {"og:title", "og:description", "og:image"}
    missing_names = sorted(required_meta_names - index_parser.meta_names)
    missing_properties = sorted(required_meta_properties - index_parser.meta_properties)
    if missing_names:
        errors.append(f"missing named metadata: {', '.join(missing_names)}")
    if missing_properties:
        errors.append(f"missing Open Graph metadata: {', '.join(missing_properties)}")

    for page, (_, parser) in parsed_pages.items():
        for reference in parser.links + parser.resources:
            check_reference(site, page, reference, ids_by_page, errors)

    css_files = sorted(site.rglob("*.css"))
    for css in css_files:
        text = css.read_text(encoding="utf-8")
        if "@import" in text.lower():
            errors.append(f"CSS import is not allowed: {css.relative_to(site)}")
        if WINDOWS_PATH_PATTERN.search(text):
            errors.append(f"absolute Windows path leaked: {css.relative_to(site)}")
        for _, reference in CSS_URL_PATTERN.findall(text):
            parsed = urlsplit(reference.strip())
            if parsed.scheme or parsed.netloc:
                errors.append(f"external CSS resource: {css.relative_to(site)}: {reference}")
            else:
                check_reference(site, css, reference, ids_by_page, errors)

    demo_files = sorted((site / "demo").glob("*.html")) if (site / "demo").is_dir() else []
    if len(demo_files) != 3:
        errors.append(f"expected 3 synthetic demos, found {len(demo_files)}")
    for demo in demo_files:
        text, parser = parsed_pages[demo.resolve()]
        if parser.resources:
            errors.append(f"demo is not self-contained: {demo.relative_to(site)}")
        if re.search(r"https?://", text, re.IGNORECASE):
            errors.append(f"demo contains an external URL: {demo.relative_to(site)}")

    required_files = {
        ".nojekyll",
        "assets/icon.png",
        "assets/reviewer-evidence.png",
        "assets/reviewer-demo.gif",
        "assets/social-preview.png",
        "robots.txt",
        "styles.css",
    }
    for relative in sorted(required_files):
        if not (site / relative).is_file():
            errors.append(f"missing required file: {relative}")

    return {
        "schema": "governdiff-pages-check/1.0",
        "site": str(site),
        "html_files": len(html_files),
        "css_files": len(css_files),
        "local_images": index_parser.images,
        "synthetic_demos": len(demo_files),
        "index_bytes": len(index_text.encode("utf-8")),
        "errors": errors,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", type=Path, required=True)
    args = parser.parse_args()
    result = validate(args.site)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if result["errors"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
