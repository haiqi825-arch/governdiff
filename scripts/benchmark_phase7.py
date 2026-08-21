"""Generate and compare a deterministic 100-page digital-text PDF pair."""

from __future__ import annotations

import argparse
import json
import os
import platform
import sys
import tempfile
import time
import tracemalloc
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from governdiff import analyze_documents  # noqa: E402
from governdiff.report import render_json  # noqa: E402


@contextmanager
def limited_cpu_affinity(maximum_cores: int):
    """Temporarily limit the benchmark process to at most N logical CPUs."""

    state: dict[str, object] = {
        "requested_logical_cores": maximum_cores,
        "applied": False,
        "effective_logical_cores": None,
    }
    if sys.platform == "win32":
        import ctypes

        kernel32 = ctypes.windll.kernel32
        kernel32.GetCurrentProcess.restype = ctypes.c_void_p
        kernel32.GetProcessAffinityMask.argtypes = (
            ctypes.c_void_p,
            ctypes.POINTER(ctypes.c_size_t),
            ctypes.POINTER(ctypes.c_size_t),
        )
        kernel32.GetProcessAffinityMask.restype = ctypes.c_bool
        kernel32.SetProcessAffinityMask.argtypes = (ctypes.c_void_p, ctypes.c_size_t)
        kernel32.SetProcessAffinityMask.restype = ctypes.c_bool
        process = kernel32.GetCurrentProcess()
        original = ctypes.c_size_t()
        system = ctypes.c_size_t()
        if kernel32.GetProcessAffinityMask(process, ctypes.byref(original), ctypes.byref(system)):
            bits = [index for index in range(ctypes.sizeof(original) * 8) if original.value & (1 << index)]
            selected = bits[:maximum_cores]
            mask = sum(1 << index for index in selected)
            if selected and kernel32.SetProcessAffinityMask(process, ctypes.c_size_t(mask)):
                state.update(applied=True, effective_logical_cores=len(selected))
                try:
                    yield state
                finally:
                    kernel32.SetProcessAffinityMask(process, original)
                return
    elif hasattr(os, "sched_getaffinity") and hasattr(os, "sched_setaffinity"):
        original_set = os.sched_getaffinity(0)
        selected_set = set(sorted(original_set)[:maximum_cores])
        if selected_set:
            os.sched_setaffinity(0, selected_set)
            state.update(applied=True, effective_logical_cores=len(selected_set))
            try:
                yield state
            finally:
                os.sched_setaffinity(0, original_set)
            return
    yield state


def _pdf_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def build_benchmark_pdf(path: Path, pages: int, *, changed: bool) -> None:
    from pypdf import PdfWriter
    from pypdf.generic import DecodedStreamObject, DictionaryObject, NameObject

    writer = PdfWriter()
    font = DictionaryObject({
        NameObject("/Type"): NameObject("/Font"),
        NameObject("/Subtype"): NameObject("/Type1"),
        NameObject("/BaseFont"): NameObject("/Helvetica"),
    })
    font_reference = writer._add_object(font)
    for page_number in range(1, pages + 1):
        page = writer.add_blank_page(width=612, height=792)
        page[NameObject("/Resources")] = DictionaryObject({
            NameObject("/Font"): DictionaryObject({NameObject("/F1"): font_reference})
        })
        substantive_change = changed and page_number % 10 == 0
        modal = "must" if substantive_change else "may"
        days = 10 if substantive_change else 30
        lines = (
            "GovernDiff 100-page performance fixture",
            f"Section {page_number} Benchmark clause",
            f"All members {modal} submit benchmark record {page_number} within {days} days.",
            f"Evidence identifier P7-{page_number:03d} remains attached to the decision.",
            f"Page {page_number} of {pages}",
        )
        content = ["BT", "/F1 10 Tf", "16 TL", "72 760 Td"]
        for index, line in enumerate(lines):
            if index:
                content.append("T*")
            content.append(f"({_pdf_escape(line)}) Tj")
        content.append("ET")
        stream = DecodedStreamObject()
        stream.set_data("\n".join(content).encode("ascii"))
        page[NameObject("/Contents")] = writer._add_object(stream)
    with path.open("wb") as handle:
        writer.write(handle)


def benchmark(pages: int, threshold_seconds: float) -> dict[str, object]:
    with tempfile.TemporaryDirectory(prefix="governdiff-phase7-performance-") as directory:
        root = Path(directory)
        old_path = root / "old.pdf"
        new_path = root / "new.pdf"
        build_benchmark_pdf(old_path, pages, changed=False)
        build_benchmark_pdf(new_path, pages, changed=True)
        with limited_cpu_affinity(4) as affinity:
            tracemalloc.start()
            started = time.perf_counter()
            report = analyze_documents(old_path, new_path)
            rendered = render_json(report)
            elapsed = time.perf_counter() - started
            _, peak_memory = tracemalloc.get_traced_memory()
            tracemalloc.stop()
        old_pages = report.old_document.preflight.page_count if report.old_document.preflight else None
        new_pages = report.new_document.preflight.page_count if report.new_document.preflight else None
        result = {
            "schema_version": "governdiff-performance/1.0",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "target": {
                "pages_per_document": pages,
                "cpu_cores": 4,
                "memory_gib": 8,
                "maximum_seconds": threshold_seconds,
            },
            "machine": {
                "platform": platform.platform(),
                "machine": platform.machine(),
                "processor": platform.processor(),
                "logical_cpu_count": os.cpu_count(),
                "benchmark_affinity": affinity,
                "python": platform.python_version(),
            },
            "result": {
                "old_page_count": old_pages,
                "new_page_count": new_pages,
                "elapsed_seconds": round(elapsed, 4),
                "changes": report.summary()["total_changes"],
                "findings": report.summary()["findings"],
                "rendered_json_bytes": len(rendered.encode("utf-8")),
                "peak_traced_memory_mib": round(peak_memory / (1024 * 1024), 3),
            },
            "passed": (
                old_pages == pages
                and new_pages == pages
                and elapsed <= threshold_seconds
                and peak_memory <= 8 * 1024 * 1024 * 1024
                and affinity["effective_logical_cores"] is not None
                and affinity["effective_logical_cores"] <= 4
            ),
        }
    return result


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pages", type=int, default=100)
    parser.add_argument("--threshold-seconds", type=float, default=90.0)
    parser.add_argument("--output", default="")
    parser.add_argument("--strict", action="store_true")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if args.pages < 1 or args.pages > 300:
        raise SystemExit("pages must be between 1 and 300")
    result = benchmark(args.pages, args.threshold_seconds)
    value = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(value, encoding="utf-8")
    print(value, end="")
    return 1 if args.strict and not result["passed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
