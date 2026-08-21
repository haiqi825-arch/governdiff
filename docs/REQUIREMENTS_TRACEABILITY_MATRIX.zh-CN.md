# GovernDiff v0.6 需求追踪矩阵（RTM）

- 基线日期：2026-08-14（Asia/Shanghai）
- 需求源：\`GOVERNDIFF_PRD.md\` 共 67 个 FR、19 个 NFR，合计 86 项
- 范围权威：PRD 0.6 节“v0.6 发布范围裁决”
- 负责人：\`Maintainer\` 为实现与本地门禁；\`Product owner\` 为产品范围/标注；\`Release owner\` 为单独授权后的 hosted/publication 动作

## 状态规则

- \【PASS\】：本窗口已有足够自动化或静态证据；最终报告生成前仍需按依赖关系复跑。
- \【BLOCKED\】：实现可能已有自动化覆盖，但规定的真实 Chrome、最终制品、hosted 或人工证据尚未取得。
- \【NOT TESTED\】：需求包含独立统计/人工验证，本窗口不能以其他测试冒充。
- \【N/A\】：经正式范围裁决延期或移除；不纳入 v0.6 本地技术通过率。

> 本矩阵是活文档。最终门禁、制品哈希和 Chrome 结果会在本轮结束前同步；任何当前 PASS 都不能替代最终受影响门禁复跑。

## 逐项矩阵

| Requirement ID | Release disposition | Implementation | Automated tests | Manual acceptance | Result | Owner | Evidence | Limitation |
|---|---|---|---|---|---|---|---|---|
| FR-001 | included | `cli.py`; `formats.py`; Reviewer report import | `test_multiformat.py`; CLI tests | wheel SOP + Chrome old/new report | PASS | Maintainer | WP-02/WP-05 logs | Reviewer imports a generated report rather than two files directly. |
| FR-002 | included | `formats.py` preflight | `test_multiformat.py`; `test_extended_format_boundaries.py` | invalid-file message review | PASS | Maintainer | WP-05 logs | None |
| FR-003 | included | `models.py:Document.metadata` | schema/report tests | Reviewer metadata inspection | PASS | Maintainer | report JSON | PDF page count; other formats use block/word counts. |
| FR-004 | included | `formats.py` quality preflight | multi-format and boundary tests | warning visibility in Chrome | BLOCKED | Maintainer | WP-05 + WP-01 | Visible Chrome confirmation pending. |
| FR-005 | deferred | v0.7 backlog | N/A | N/A | N/A | Product owner | PRD 0.6 scope decision | No one-click role swap in 0.6. |
| FR-006 | deferred | future URL importer | N/A | N/A | N/A | Product owner | PRD 0.6 scope decision | No network URL import in 0.6. |
| FR-010 | included | `models.py:Block`; format parsers | multi-format tests | evidence label inspection | PASS | Maintainer | WP-05 logs | PDF physical pages; DOCX/HTML paragraph indices. |
| FR-011 | included | `document.py`; `formats.py` | document/multiformat tests | Reviewer section tree | BLOCKED | Maintainer | Python tests + WP-01 | Chrome tree inspection pending. |
| FR-012 | included | text/PDF/DOCX/HTML parsers | document/multiformat tests | long-document evidence sampling | PASS | Maintainer | WP-05 | PDF extraction is line-oriented. |
| FR-013 | included | DOCX/HTML table model | `test_multiformat.py` | table evidence sampling | PASS | Maintainer | WP-05 | PDF visual tables are line text, not cells. |
| FR-014 | included | PDF repeated-furniture; HTML chrome exclusion | `test_multiformat.py` | sample report inspection | PASS | Maintainer | WP-05 | DOCX header/footer parts are excluded by body-only parsing. |
| FR-015 | included | TOC detection/noise findings | multi-format tests | TOC filter inspection | PASS | Maintainer | WP-05 | Heuristic detection. |
| FR-016 | included | content-derived block IDs | document/phase tests | repeat parse comparison | PASS | Maintainer | Python tests | Duplicate occurrences include occurrence order. |
| FR-017 | deferred | OCR intentionally absent | scanned-PDF negative test | N/A | N/A | Product owner | input-format docs | Image-only PDFs fail with guidance. |
| FR-020 | included | alignment engine | `test_checks.py`; benchmark tests | report sampling | PASS | Maintainer | Gold benchmark | None |
| FR-021 | included | alignment/articles engines | phase 1/3 and benchmark tests | ambiguous pair sampling | PASS | Maintainer | Gold benchmark | Deterministic heuristic, human review required. |
| FR-022 | included | move classification | phase 3 tests | moved-card sampling | PASS | Maintainer | Python tests | None |
| FR-023 | included | split/merge alignment | phase 3 tests | Reviewer alignment preview | BLOCKED | Maintainer | Python + browser gate | Real Chrome confirmation pending. |
| FR-024 | included | format-only classification | phase 3/reviewer tests | hide-format action | BLOCKED | Maintainer | Python + browser gate | Real Chrome confirmation pending. |
| FR-025 | included | word diff engine | phase 3 tests | CN/EN evidence view | BLOCKED | Maintainer | Python + browser gate | Real Chrome confirmation pending. |
| FR-026 | included | Reviewer alignment reducer/export | Reviewer domain/browser tests | manual reconnect/export/import | BLOCKED | Maintainer | Reviewer gates | Real Chrome confirmation pending. |
| FR-027 | included | confidence model and filters | confidence/Reviewer tests | low-confidence queue | BLOCKED | Maintainer | Gold + Reviewer gates | Real Chrome confirmation pending. |
| FR-030 | included | finding field/value contract | check/contract tests | field editing inspection | PASS | Maintainer | WP-04 | Rule fields are check-specific, not a general NLP frame. |
| FR-031 | included | modality checks | 15-check bilingual contract | manual report sample | PASS | Maintainer | WP-04 | Heuristic lexicons. |
| FR-032 | included | threshold/temporal extraction | check and temporal tests | manual report sample | PASS | Maintainer | WP-04 | Context-bounded common units. |
| FR-033 | included | `temporal.py` | temporal + 15-check tests | manual report sample | PASS | Maintainer | WP-04 | No natural-language calendar reasoning. |
| FR-034 | included | scope/actor/authority checks | 15-check contract | manual report sample | PASS | Maintainer | WP-04 | Candidate heuristics, not legal entity resolution. |
| FR-035 | included | exception checks | 15-check contract | manual report sample | PASS | Maintainer | WP-04 | Bilingual marker heuristics. |
| FR-036 | included | evidence gate in checks/models | check/schema tests | evidence spot-check | PASS | Maintainer | WP-04/WP-10 | None |
| FR-037 | included | review import/effective values | review tests | Chrome edit/export/reimport | BLOCKED | Maintainer | Python + Reviewer gates | Real Chrome confirmation pending. |
| FR-038 | included | deterministic local engine | full Python suite | zero-egress inspection | PASS | Maintainer | WP-04/WP-07 | Only AI-Off exists in 0.6. |
| FR-040 | included | severity/confidence explanations | confidence/check tests | card inspection | BLOCKED | Maintainer | Python + Reviewer gates | Real Chrome confirmation pending. |
| FR-041 | included | separate severity/confidence fields | confidence/schema/Reviewer tests | filter inspection | BLOCKED | Maintainer | automated gates | Real Chrome confirmation pending. |
| FR-042 | included | actor/scope evidence findings | 15-check tests | evidence sampling | PASS | Maintainer | WP-04 | Candidate labels only. |
| FR-043 | included | report summaries/disclaimer | report tests | wording review | PASS | Maintainer | WP-04/WP-12 | No legal conclusion claim. |
| FR-044 | deferred | future configuration/UI | N/A | N/A | N/A | Product owner | PRD 0.6 scope decision | Check enable/disable exists; custom priority rules do not. |
| FR-050 | included | report summary/section tree; Reviewer | report/Reviewer tests | Chrome dashboard | BLOCKED | Maintainer | Reviewer browser gate | Real Chrome confirmation pending. |
| FR-051 | included | Reviewer evidence comparison | component/browser tests | Chrome card selection | BLOCKED | Maintainer | Reviewer browser gate | Real Chrome confirmation pending. |
| FR-052 | included | Reviewer filters | domain/browser tests | Chrome filter matrix | BLOCKED | Maintainer | Reviewer browser gate | Real Chrome confirmation pending. |
| FR-053 | included | Reviewer search | browser/performance tests | Chrome bilingual search | BLOCKED | Maintainer | Reviewer browser gate | Real Chrome confirmation pending. |
| FR-054 | included | review state contract/reducer | Python + Reviewer tests | Chrome state transitions | BLOCKED | Maintainer | automated gates | Real Chrome confirmation pending. |
| FR-055 | included | review note contract | review import/export tests | Chrome note persistence | BLOCKED | Maintainer | automated gates | Real Chrome confirmation pending. |
| FR-056 | included | batch decisions/hide format | Reviewer tests | Chrome batch workflow | BLOCKED | Maintainer | automated gates | Real Chrome confirmation pending. |
| FR-057 | included | persistent project warnings | component/browser tests | Chrome warning persistence | BLOCKED | Maintainer | automated gates | Real Chrome confirmation pending. |
| FR-060 | included | self-contained HTML renderer | report/security/render tests | offline open | PASS | Maintainer | WP-07/WP-12 | Static report, no live editing. |
| FR-061 | included | Markdown renderer | report/security tests | GitHub rendering review | PASS | Maintainer | WP-07 | External link/image syntax escaped. |
| FR-062 | included | report 1.5 JSON/schema | schema tests | sample validation | PASS | Maintainer | schema validation | None |
| FR-063 | included | shared selection model | phase 5 tests | scope output inspection | PASS | Maintainer | Python tests | None |
| FR-064 | included | report metadata/disclaimer | report/schema tests | all-format sampling | PASS | Maintainer | Python tests | None |
| FR-065 | included | CSV renderer | phase 5/security tests | spreadsheet-safe inspection | PASS | Maintainer | WP-07 | Formula-like cells receive a leading apostrophe. |
| FR-066 | included | redacted selection | phase 5 tests | redacted output inspection | PASS | Maintainer | Python tests | Short bounded evidence remains by design. |
| FR-070 | included | CLI diff output commands | CLI/end-to-end tests | wheel five-minute SOP | BLOCKED | Maintainer | Python gates | Final wheel SOP pending. |
| FR-071 | included | strict v1 config | extended config tests | example config run | PASS | Maintainer | WP-03 | AI-mode setting removed from 0.6 contract. |
| FR-072 | included | stable CLI codes and stderr | CLI/config tests | failure-mode SOP | PASS | Maintainer | WP-03 | 0.6 logs are bounded human-readable stderr, not a JSON log stream. |
| FR-073 | publication-only | `action.yml`; action scripts | local action tests | real PR Job Summary | BLOCKED | Release owner | local tests only | No remote; hosted run requires release-stage authorization. |
| FR-074 | publication-only | Action gate outputs/config | action/config tests | real PR pass/fail runs | BLOCKED | Release owner | local tests only | No remote; hosted evidence pending. |
| FR-075 | deferred | future result cache | N/A | N/A | N/A | Product owner | PRD scope decision | No cross-run cache. |
| FR-076 | included | stable fingerprint algorithms | check/phase tests | repeat-run comparison | PASS | Maintainer | WP-09 | Semantic edits intentionally change IDs. |
| FR-077 | included | waiver loader/diagnostics | waiver tests | wheel waiver SOP | PASS | Maintainer | Python tests | Requires repository review discipline outside tool. |
| FR-078 | included | CLI subcommands | CLI/phase tests | wheel command matrix | BLOCKED | Maintainer | Python gates | Final wheel SOP pending. |
| FR-079 | deferred | local Reviewer generates waiver | Reviewer tests | N/A for PR direct UI | N/A | Product owner | PRD scope decision | Direct PR-page confirm/reject is deferred. |
| FR-080 | included | local files, IndexedDB, loopback | session/persistence tests | Chrome storage inspection | BLOCKED | Maintainer | automated gates | Real Chrome storage inspection pending. |
| FR-081 | included | fixed AI-Off/local-only wording | zero-egress and UI tests | Chrome local-only notice | BLOCKED | Maintainer | automated gates | Only AI-Off exists; no selectable AI mode. |
| FR-082 | included | no outbound content path | zero-egress/security tests | network panel check | BLOCKED | Maintainer | automated gates | Real Chrome network-panel confirmation pending. |
| FR-083 | included | clear local project/session cleanup | persistence/session/browser tests | Chrome delete/recovery | BLOCKED | Maintainer | automated gates | Source files are never copied into project storage. |
| FR-084 | included | no telemetry SDK or endpoint | source/network audit | Chrome network panel | BLOCKED | Maintainer | automated audit | Real Chrome network-panel confirmation pending. |
| FR-085 | included | no AI/API-key ingestion; redaction | security/log tests | secret-output review | PASS | Maintainer | WP-07 | API provider configuration is absent in 0.6. |
| NFR-001 | included | deterministic engine | phase 7 benchmark | 100-page benchmark | BLOCKED | Maintainer | previous design only | Must rerun after final changes. |
| NFR-002 | included | deterministic engine | performance benchmark | 30-page benchmark | BLOCKED | Maintainer | pending | Current-window measurement pending. |
| NFR-003 | included | virtualized Reviewer | performance/browser gates | visible Chrome interaction | BLOCKED | Maintainer | p95 automated PASS | Real Chrome confirmation pending. |
| NFR-004 | included | `MAX_FILE_BYTES`; `MAX_PAGES` | 299/300/301 and 24.9/25.0/25.1 tests | message inspection | PASS | Maintainer | WP-05 | Limits use binary 25 MiB. |
| NFR-010 | included | format parsers | multi-format/20-corpus runs | annotated extraction audit | NOT TESTED | Product owner | seed fixtures only | No sufficiently sized public annotated extraction Gold set. |
| NFR-011 | included | alignment engine | 30-case Gold benchmark | benchmark review | PASS | Maintainer | Gold clause pairing F1 100% | Seed benchmark, not production claim. |
| NFR-012 | included | evidence locations | format/schema tests | sample location audit | NOT TESTED | Product owner | fixture spot checks | No statistically sufficient annotated location set. |
| NFR-013 | included | temporal/check engine | Gold + 15-check contracts | blind label review | NOT TESTED | Product owner | contract positives/negatives | Exact contract tests are not an unbiased recall study. |
| NFR-014 | included | finding evidence gate | check/schema tests | report audit | PASS | Maintainer | Python tests | None |
| NFR-020 | included | local deterministic path | zero-egress tests | Chrome network panel | BLOCKED | Maintainer | automated audit | Real Chrome confirmation pending. |
| NFR-021 | included | bounded diagnostics/redaction | security/log tests | failure-log review | PASS | Maintainer | WP-07 | User-provided paths can appear in explicit CLI errors where necessary. |
| NFR-022 | included | local output/loopback only | session/security tests | workflow observation | PASS | Maintainer | WP-07 | No automatic public URL. |
| NFR-023 | removed | Remote AI absent | N/A | N/A | N/A | Product owner | PRD scope decision | Re-enters scope only with a separate privacy design. |
| NFR-024 | included | release/audit scripts | audit commands | review scan reports | BLOCKED | Maintainer | pending | Final dependency/SBOM/artifact scans pending. |
| NFR-030 | included | wheel quick start/example | packaged smoke | timed clean-install path | BLOCKED | Maintainer | pending | Final wheel not yet rebuilt. |
| NFR-031 | included | icons/text/status labels | component/axe/browser tests | Chrome high-contrast/grayscale | BLOCKED | Maintainer | axe automated PASS | Manual visual confirmation pending. |
| NFR-032 | included | keyboard/focus handling | component/browser tests | Chrome keyboard-only flow | BLOCKED | Maintainer | browser automated PASS | Manual Chrome confirmation pending. |
| NFR-033 | included | responsive evidence CSS | browser fixture tests | Chrome CN/EN zoom/viewport | BLOCKED | Maintainer | automated layouts PASS | Manual Chrome confirmation pending. |
| NFR-034 | included | `InputIssue`; config diagnostics | error-contract tests | message review | PASS | Maintainer | WP-03/WP-05 | Some third-party exception details are appended after the standard guidance. |

## 完整性核对

- FR：67/67
- NFR：19/19
- 合计：86/86

最终结果解释：Local Alpha Candidate 需另见最终验收报告；Public Beta 还要求真实用户、真实 hosted 矩阵及 publication-only 授权动作，不能仅凭本地 PASS 判定 Go。
