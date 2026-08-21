# Security policy

## Supported versions

Until the first public release, security fixes are prepared against the current
main development line. After publication, this table must be updated with the
supported release series and end-of-support dates.

## Reporting a vulnerability

Do not open a public issue for a vulnerability or include policy documents,
review notes, access tokens, or exploit details in public channels. Use the
repository host's private security-advisory mechanism after the public remote is
created. Before then, contact the maintainer through the private channel that
provided the source tree.

Please include the affected version or commit, platform, minimal reproduction,
impact, and whether the issue can cause data disclosure, code execution, remote
network access, or integrity loss. A maintainer should acknowledge a complete
report within three business days and provide a remediation status within seven
business days. These are response targets, not a bug-bounty promise.

## Product security boundary

- Analysis is deterministic and local. AI-off operation must not create network
  traffic.
- Reviewer sessions bind only to `127.0.0.1`, use an unpredictable HttpOnly
  SameSite cookie, reject cross-origin requests, and remove temporary session
  data by default.
- The Reviewer requires a local Node.js runtime. The Python wheel contains the
  built application and session server; it does not download executable code.
- GovernDiff findings are review cues, not legal advice or compliance decisions.
- Image-only PDF OCR, remote storage, accounts, public telemetry, and hosted
  document processing are outside the current supported boundary.

Current local controls, public-demo conditions, dependency checks, and
publication stop points are recorded in
[`docs/PUBLIC_DEMO_READINESS.md`](docs/PUBLIC_DEMO_READINESS.md) and
[`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md). Hosted security scans
and a public advisory endpoint are not claimed until they have actually run or
been configured for the approved repository.
