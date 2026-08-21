from __future__ import annotations

import http.cookiejar
import json
import shutil
import socket
import subprocess
import tempfile
import time
import unittest
import urllib.error
import urllib.request
from pathlib import Path
from unittest.mock import patch

from governdiff.cli import FINAL_REPORTS, build_parser, main
from governdiff.review_session import create_session_directory


ROOT = Path(__file__).resolve().parents[1]
REVIEWER = ROOT / "reviewer-ui"


class PhaseSevenFiveCliTests(unittest.TestCase):
    def test_review_parser_exposes_local_loop_options(self) -> None:
        args = build_parser().parse_args([
            "review",
            "old.pdf",
            "new.pdf",
            "--port",
            "9123",
            "--language",
            "zh",
            "--config",
            "policy.yml",
            "--review",
            "review.json",
            "--output-dir",
            "out",
            "--no-open",
            "--redacted",
            "--keep-session",
        ])
        self.assertEqual(args.command, "review")
        self.assertEqual(args.port, 9123)
        self.assertEqual(args.language, "zh")
        self.assertTrue(args.no_open)
        self.assertTrue(args.redacted)
        self.assertTrue(args.keep_session)

    def test_review_command_reapplies_export_and_writes_four_formats(self) -> None:
        captured_session: list[Path] = []

        def exported_review(report_payload, **kwargs):
            captured_session.append(kwargs["session_directory"])
            changed = next(
                item
                for item in report_payload["changes"]
                if item["change_type"] != "unchanged"
            )
            return {
                "schema_version": "governdiff-review/1.1",
                "report": {
                    "old_sha256": report_payload["old_document"]["sha256"],
                    "new_sha256": report_payload["new_document"]["sha256"],
                    "generated_at": report_payload["generated_at"],
                },
                "exported_at": "2026-08-12T00:00:00Z",
                "decisions": [
                    {
                        "change_fingerprint": changed["fingerprint"],
                        "state": "confirmed",
                        "note": "reviewed locally",
                        "updated_at": "2026-08-12T00:00:00Z",
                    }
                ],
                "field_edits": [],
                "alignment_overrides": [],
                "filters": {"visible_change_fingerprints": [changed["fingerprint"]]},
            }

        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            old = root / "old.md"
            new = root / "new.md"
            output = root / "final"
            old.write_text("# Rule\n\nMembers may file within 30 days.\n", encoding="utf-8")
            new.write_text("# Rule\n\nMembers must file within 10 days.\n", encoding="utf-8")
            with patch("governdiff.cli.run_local_reviewer", side_effect=exported_review):
                self.assertEqual(
                    main([
                        "review",
                        str(old),
                        str(new),
                        "--output-dir",
                        str(output),
                        "--no-open",
                    ]),
                    0,
                )
            self.assertEqual(
                {path.name for path in output.iterdir()},
                set(FINAL_REPORTS.values()),
            )
            report = json.loads((output / FINAL_REPORTS["json"]).read_text(encoding="utf-8"))
            self.assertEqual(report["summary"]["review_states"]["confirmed"], 1)
            self.assertEqual(report["review_import"]["decisions_applied"], 1)
            self.assertTrue(captured_session)
            self.assertFalse(captured_session[0].exists())

    def test_error_and_interrupt_paths_stop_and_remove_the_session(self) -> None:
        for failure in (RuntimeError("session failed"), KeyboardInterrupt()):
            session = create_session_directory()
            with tempfile.TemporaryDirectory() as temporary:
                root = Path(temporary)
                old = root / "old.md"
                new = root / "new.md"
                old.write_text("# Rule\n\nMembers may file.\n", encoding="utf-8")
                new.write_text("# Rule\n\nMembers must file.\n", encoding="utf-8")
                with (
                    patch("governdiff.cli.create_session_directory", return_value=session),
                    patch("governdiff.cli.run_local_reviewer", side_effect=failure),
                    self.assertRaises(SystemExit) as stopped,
                ):
                    main([
                        "review",
                        str(old),
                        str(new),
                        "--output-dir",
                        str(root / "output"),
                        "--no-open",
                    ])
                self.assertIn(stopped.exception.code, {1, 130})
                self.assertFalse(session.exists())


@unittest.skipUnless(
    shutil.which("node") and (REVIEWER / "dist" / "server" / "index.js").is_file(),
    "Node.js and a built Reviewer are required",
)
class PhaseSevenFiveLoopbackServerTests(unittest.TestCase):
    def test_session_is_cookie_protected_same_origin_and_exports_atomically(self) -> None:
        session = Path(tempfile.mkdtemp(prefix="governdiff-session-test-"))
        process: subprocess.Popen[str] | None = None
        try:
            report = json.loads(
                (REVIEWER / "public" / "sample-report.json").read_text(encoding="utf-8")
            )
            report_file = session / "report.json"
            report_file.write_text(json.dumps(report), encoding="utf-8")
            token = "test-" + "x" * 60
            bootstrap = {
                "token": token,
                "port": 0,
                "session_dir": str(session),
                "report_file": str(report_file),
                "language": "en",
                "heartbeat_timeout_ms": 60_000,
            }
            process = subprocess.Popen(
                [shutil.which("node") or "node", str(REVIEWER / "scripts" / "review-session.mjs")],
                cwd=REVIEWER,
                stdin=subprocess.PIPE,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.PIPE,
                text=True,
                encoding="utf-8",
            )
            assert process.stdin is not None
            process.stdin.write(json.dumps(bootstrap))
            process.stdin.close()

            status_file = session / "session-status.json"
            deadline = time.monotonic() + 20
            status = None
            while time.monotonic() < deadline:
                if status_file.exists():
                    try:
                        status = json.loads(status_file.read_text(encoding="utf-8"))
                    except json.JSONDecodeError:
                        status = None
                    if status and status.get("event") == "ready":
                        break
                if process.poll() is not None:
                    self.fail(process.stderr.read() if process.stderr else "server exited")
                time.sleep(0.1)
            self.assertIsNotNone(status)
            self.assertEqual(status["host"], "127.0.0.1")
            base = f"http://127.0.0.1:{status['port']}"

            cookie_jar = http.cookiejar.CookieJar()
            opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookie_jar))
            with opener.open(
                urllib.request.Request(f"{base}/", headers={"Accept": "text/html"}),
                timeout=10,
            ) as response:
                self.assertEqual(response.status, 200)
                initial_html = response.read().decode("utf-8", errors="replace")
                self.assertIn("default-src 'self'", response.headers["Content-Security-Policy"])
                self.assertEqual(response.headers["Cache-Control"], "no-store")
                self.assertEqual(response.headers["X-Content-Type-Options"], "nosniff")
                self.assertTrue(response.headers["Content-Type"].startswith("text/html"))
                issued_cookie = response.headers["Set-Cookie"]
                self.assertIn("HttpOnly", issued_cookie)
                self.assertIn("SameSite=Strict", issued_cookie)
                self.assertNotIn("Access-Control-Allow-Origin", response.headers)
                self.assertNotIn(token, initial_html)
                self.assertNotIn(token, response.geturl())
            self.assertTrue(any(cookie.value == token for cookie in cookie_jar))
            cookie = next(cookie for cookie in cookie_jar if cookie.value == token)
            self.assertNotIn(token, base)
            self.assertNotIn(token, json.dumps(status))

            with socket.socket(socket.AF_INET6, socket.SOCK_STREAM) as ipv6_socket:
                ipv6_socket.settimeout(1)
                self.assertNotEqual(ipv6_socket.connect_ex(("::1", status["port"])), 0)

            wrong_host = urllib.request.Request(
                f"{base}/",
                headers={
                    "Accept": "text/html",
                    "Host": f"localhost:{status['port']}",
                    "Cookie": f"{cookie.name}={token}",
                },
            )
            with self.assertRaises(urllib.error.HTTPError) as rejected_host:
                urllib.request.urlopen(wrong_host, timeout=10)
            self.assertEqual(rejected_host.exception.code, 421)

            wrong_cookie = urllib.request.Request(
                f"{base}/api/review-session",
                headers={"Cookie": f"{cookie.name}=wrong-session-token"},
            )
            with self.assertRaises(urllib.error.HTTPError) as rejected_cookie:
                urllib.request.urlopen(wrong_cookie, timeout=10)
            self.assertEqual(rejected_cookie.exception.code, 401)

            another_session_cookie = urllib.request.Request(
                f"{base}/api/review-session",
                headers={"Cookie": "governdiff_other_session=unrelated-token"},
            )
            with self.assertRaises(urllib.error.HTTPError) as rejected_other_session:
                urllib.request.urlopen(another_session_cookie, timeout=10)
            self.assertEqual(rejected_other_session.exception.code, 401)

            with self.assertRaises(urllib.error.HTTPError) as unauthenticated:
                urllib.request.urlopen(f"{base}/api/review-session", timeout=10)
            self.assertEqual(unauthenticated.exception.code, 401)

            with opener.open(f"{base}/api/review-session", timeout=10) as response:
                session_payload = json.loads(response.read())
            self.assertEqual(session_payload["report"]["schema_version"], "1.5")

            review = {
                "schema_version": "governdiff-review/1.1",
                "report": {
                    "old_sha256": report["old_document"]["sha256"],
                    "new_sha256": report["new_document"]["sha256"],
                    "generated_at": report["generated_at"],
                },
                "exported_at": "2026-08-12T00:00:00Z",
                "decisions": [],
                "field_edits": [],
                "alignment_overrides": [],
                "filters": {"visible_change_fingerprints": []},
            }
            cross_origin = urllib.request.Request(
                f"{base}/api/review-session/export",
                data=json.dumps(review).encode(),
                method="POST",
                headers={"Content-Type": "application/json", "Origin": "http://evil.invalid"},
            )
            with self.assertRaises(urllib.error.HTTPError) as rejected:
                opener.open(cross_origin, timeout=10)
            self.assertEqual(rejected.exception.code, 403)

            missing_origin = urllib.request.Request(
                f"{base}/api/review-session/export",
                data=json.dumps(review).encode(),
                method="POST",
                headers={"Content-Type": "application/json"},
            )
            with self.assertRaises(urllib.error.HTTPError) as rejected_missing:
                opener.open(missing_origin, timeout=10)
            self.assertEqual(rejected_missing.exception.code, 403)

            null_origin = urllib.request.Request(
                f"{base}/api/review-session/export",
                data=json.dumps(review).encode(),
                method="POST",
                headers={"Content-Type": "application/json", "Origin": "null"},
            )
            with self.assertRaises(urllib.error.HTTPError) as rejected_null:
                opener.open(null_origin, timeout=10)
            self.assertEqual(rejected_null.exception.code, 403)

            wrong_content_type = urllib.request.Request(
                f"{base}/api/review-session/state",
                data=b"{}",
                method="POST",
                headers={"Content-Type": "text/plain", "Origin": base},
            )
            with self.assertRaises(urllib.error.HTTPError) as rejected_type:
                opener.open(wrong_content_type, timeout=10)
            self.assertEqual(rejected_type.exception.code, 415)

            oversized_body = urllib.request.Request(
                f"{base}/api/review-session/state",
                data=b"{" + (b"x" * (20 * 1024 * 1024 + 1)) + b"}",
                method="POST",
                headers={"Content-Type": "application/json", "Origin": base},
            )
            with self.assertRaises(urllib.error.HTTPError) as rejected_oversized:
                opener.open(oversized_body, timeout=30)
            self.assertEqual(rejected_oversized.exception.code, 413)

            disallowed_method = urllib.request.Request(
                f"{base}/api/review-session",
                data=b"",
                method="PUT",
                headers={"Origin": base},
            )
            with self.assertRaises(urllib.error.HTTPError) as rejected_method:
                opener.open(disallowed_method, timeout=10)
            self.assertEqual(rejected_method.exception.code, 405)

            traversal = urllib.request.Request(
                f"{base}/..%2f..%2fpackage.json",
                headers={"Cookie": f"{cookie.name}={token}"},
            )
            with self.assertRaises(urllib.error.HTTPError) as rejected_traversal:
                opener.open(traversal, timeout=10)
            self.assertEqual(rejected_traversal.exception.code, 404)
            body = rejected_traversal.exception.read().decode("utf-8", errors="replace")
            self.assertNotIn('"name": "governdiff-reviewer"', body)
            self.assertNotIn("vinext", body)

            export = urllib.request.Request(
                f"{base}/api/review-session/export",
                data=json.dumps(review).encode(),
                method="POST",
                headers={"Content-Type": "application/json", "Origin": base},
            )
            with opener.open(export, timeout=10) as response:
                self.assertTrue(json.loads(response.read())["accepted"])
            exported_status = json.loads(
                (session / "session-status.json").read_text(encoding="utf-8")
            )
            self.assertEqual(exported_status["event"], "review-exported")
            self.assertEqual(exported_status["outbound_network_attempts"], 0)
            self.assertEqual(
                json.loads((session / "review.json").read_text(encoding="utf-8"))["schema_version"],
                "governdiff-review/1.1",
            )
        finally:
            if process and process.poll() is None:
                process.terminate()
                process.wait(timeout=5)
            if process and process.stderr:
                process.stderr.close()
            shutil.rmtree(session, ignore_errors=True)

    def test_two_reviewer_sessions_use_distinct_loopback_ports_and_cookies(self) -> None:
        report = json.loads(
            (REVIEWER / "public" / "sample-report.json").read_text(encoding="utf-8")
        )
        sessions: list[Path] = []
        processes: list[subprocess.Popen[str]] = []
        statuses: list[dict[str, object]] = []
        try:
            for index in range(2):
                session = Path(tempfile.mkdtemp(prefix=f"governdiff-concurrent-{index}-"))
                sessions.append(session)
                report_file = session / "report.json"
                report_file.write_text(json.dumps(report), encoding="utf-8")
                process = subprocess.Popen(
                    [shutil.which("node") or "node", str(REVIEWER / "scripts" / "review-session.mjs")],
                    cwd=REVIEWER,
                    stdin=subprocess.PIPE,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.PIPE,
                    text=True,
                    encoding="utf-8",
                )
                processes.append(process)
                assert process.stdin is not None
                process.stdin.write(json.dumps({
                    "token": f"concurrent-{index}-" + (str(index) * 64),
                    "port": 0,
                    "session_dir": str(session),
                    "report_file": str(report_file),
                    "language": "en",
                    "heartbeat_timeout_ms": 60_000,
                }))
                process.stdin.close()

            for session, process in zip(sessions, processes, strict=True):
                status_file = session / "session-status.json"
                deadline = time.monotonic() + 20
                status = None
                while time.monotonic() < deadline:
                    if status_file.exists():
                        try:
                            status = json.loads(status_file.read_text(encoding="utf-8"))
                        except json.JSONDecodeError:
                            status = None
                        if status and status.get("event") == "ready":
                            break
                    if process.poll() is not None:
                        self.fail(process.stderr.read() if process.stderr else "server exited")
                    time.sleep(0.1)
                self.assertIsNotNone(status)
                statuses.append(status)

            ports = [int(status["port"]) for status in statuses]
            self.assertEqual(len(set(ports)), 2)
            cookie_names: list[str] = []
            for port in ports:
                opener = urllib.request.build_opener(
                    urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar())
                )
                with opener.open(
                    urllib.request.Request(
                        f"http://127.0.0.1:{port}/",
                        headers={"Accept": "text/html"},
                    ),
                    timeout=10,
                ) as response:
                    cookie_names.append(response.headers["Set-Cookie"].split("=", 1)[0])
                with opener.open(f"http://127.0.0.1:{port}/api/review-session", timeout=10) as response:
                    self.assertEqual(json.loads(response.read())["report"]["schema_version"], "1.5")
            self.assertEqual(len(set(cookie_names)), 2)
        finally:
            for process in processes:
                if process.poll() is None:
                    process.terminate()
                    process.wait(timeout=5)
                if process.stderr:
                    process.stderr.close()
            for session in sessions:
                shutil.rmtree(session, ignore_errors=True)


if __name__ == "__main__":
    unittest.main()
