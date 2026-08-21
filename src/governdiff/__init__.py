"""GovernDiff: policy diff and breaking-change detection."""

from .document import preflight_document
from .engine import analyze_document_versions, analyze_documents, analyze_texts
from .report import ReportSelection
from .review import apply_review, load_review

__all__ = [
    "ReportSelection",
    "analyze_document_versions",
    "analyze_documents",
    "analyze_texts",
    "apply_review",
    "load_review",
    "preflight_document",
]
__version__ = "0.6.0"
