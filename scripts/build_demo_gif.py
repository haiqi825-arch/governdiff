"""Assemble the checked-in public Reviewer screenshots into a demo GIF."""

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "docs" / "assets"
FRAMES = [
    ("reviewer-queue.png", "1  Prioritize the review queue"),
    ("reviewer-evidence.png", "2  Compare evidence and findings"),
    ("reviewer-decision.png", "3  Record a local decision"),
]


def main() -> int:
    images: list[Image.Image] = []
    for name, caption in FRAMES:
        source = Image.open(ASSETS / name).convert("RGB")
        frame = Image.new("RGB", (source.width, source.height + 64), "#101828")
        frame.paste(source, (0, 64))
        draw = ImageDraw.Draw(frame)
        draw.text((28, 22), caption, fill="#f9fafb", stroke_width=0)
        images.append(frame)
    images[0].save(
        ASSETS / "reviewer-demo.gif",
        save_all=True,
        append_images=images[1:],
        duration=[1600, 2200, 1800],
        loop=0,
        optimize=True,
    )
    print("docs/assets/reviewer-demo.gif")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
