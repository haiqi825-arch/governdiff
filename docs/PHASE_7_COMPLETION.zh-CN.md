# GovernDiff Phase 7 结项记录

日期：2026-08-11
范围：隐私、性能与供应链质量门
版本：`governdiff/0.6.0`、report schema `1.5`

## 结论

Phase 7 的工作区实现与本地自动化验收已完成。AI Off 核心流程具有独立的零外联
证明；CLI 与 Action 的默认运行日志不再输出正文、文件名、绝对路径或密钥；100 页
与 Reviewer 交互性能都有可重复的严格门槛；Python 包和 Reviewer 都能从锁定输入连续
构建两次并复现；三平台安装、依赖审计、CodeQL 和发布产物扫描已成为必须通过的 CI
工作流。

当前工作区仍没有初始 commit 和远端，因此没有伪造 GitHub-hosted workflow URL。
Windows 本机已实际执行安装/CLI/报告 smoke；macOS 和 Linux 的执行定义在
`.github/workflows/quality-gates.yml`，首次真实 hosted 运行证据只能在 Phase 8 建立远端
历史后产生。这是外部执行证据边界，不是用“跳过”或“允许失败”掩盖门禁。

## 工作项验收

| ID | 结果 | 实现与证据 |
|---|---|---|
| NEXT-060 | 完成 | `scripts/verify_zero_egress.py` 在 Python audit hook 下阻断 socket/http/urllib，对 PDF、DOCX、HTML、Markdown、TXT 五类文档执行比较和四格式渲染；结果为 5 对、0 次网络事件。 |
| NEXT-061 | 完成 | `src/governdiff/privacy.py` 集中处理路径、文档名和密钥脱敏；CLI 异常与 Action 异常共用；Action annotation 默认只输出 check、置信度、fingerprint 和 artifact 提示，详细文件/行号/摘要必须显式启用。 |
| NEXT-062 | 完成 | `scripts/benchmark_phase7.py` 生成两份各 100 页数字文本 PDF；本机限制为 4 个逻辑 CPU 后，用时 1.2115 秒，峰值追踪内存 3.959 MiB，阈值 90 秒/8 GiB。证据：`benchmark/PHASE_7_PERFORMANCE.json`。 |
| NEXT-063 | 完成 | Reviewer 搜索、筛选与变化卡选择抽为 `reviewer-model.mjs`；5000 条变化、40 次迭代的 P95 分别为 5.806、0.959、0.098 ms，均小于 200 ms。证据：`benchmark/PHASE_7_UI_PERFORMANCE.json`。 |
| NEXT-064 | 工作区完成 | CI 矩阵覆盖 `windows-latest / macos-latest / ubuntu-latest`，每个平台从包安装后执行 CLI 并验证 JSON/HTML 报告；Windows 本机 smoke 已通过。远端尚不存在，hosted 三平台 run URL 待 Phase 8。 |
| NEXT-065 | 完成 | Dependabot 覆盖 pip/npm/GitHub Actions；CodeQL v4 覆盖 Python 与 JavaScript/TypeScript；pip-audit 2.10.1 实测 0 个已知漏洞；npm 高危阈值实测通过，剩余 4 个中危仅位于 `drizzle-kit -> @esbuild-kit -> esbuild` 开发链；Anchore v7 扫描实际组装的 wheel 和 Reviewer dist，并上传 SARIF。 |
| NEXT-066 | 完成 | Python wheel 两次构建 SHA-256 完全一致，并在全新 venv 安装运行；Reviewer 锁文件根依赖均为精确版本，两次构建除必须轮换的密码学密钥外规范化文件逐字节一致。 |

## 隐私边界

- 报告 artifact 为审阅证据，按产品设计保留文件身份与正文；它不属于运行日志。
- 默认 annotation 和异常日志不包含文件名、绝对路径、正文或密钥。
- `include-annotation-details: true` 是显式的仓库级选择，启用后 annotation 可包含路径、
  行号和 finding 摘要。
- AI Off 检查在导入引擎前安装 audit hook；发生任意受监控网络调用都会立即失败，
  而不是只统计或依赖 mock。

## 供应链处置

在线 npm 审计最初发现 16 个高危项。Reviewer 已升级 Next、React、Vite、Cloudflare
工具链，并将 Vinext 固定到与当前 React/Vite 兼容且不引入漏洞 `image-size` 的
`0.0.45`。升级后 lint、生产构建、4 项 UI 契约/性能测试和双构建复现均通过；高危
门槛为 0。未使用 `npm audit fix --force` 将 `drizzle-kit` 强制降级到不兼容版本，
剩余中危开发链由 Dependabot 与每次 CI 审计持续跟踪。

当前 GitHub Actions 主版本按 2026-08 官方契约使用 checkout/setup-python/setup-node
v6、upload-artifact v7、CodeQL v4 和 Anchore scan-action v7。

## 自动化结果

- Phase 7 Python 专项：7/7 通过。
- Reviewer：lint 通过；生产构建通过；4/4 UI 契约与性能测试通过。
- AI Off：五种格式，0 个网络事件。
- Python 依赖：0 个已知漏洞。
- npm：0 个 high/critical，4 个仅开发链 moderate；`--audit-level=high` 退出码为 0。
- Python wheel：两次 SHA-256
  `e2b543acd4b87743c594a4c748959712a0d0126a73dd4a5c381b5a505cf2997f`。
- Reviewer：28 个发布文件，规范化 manifest SHA-256
  `1fb3df57b2648dda91a1a5b856bf2422993352c1f4aed8c5b317d55e99e31061`。

## 关键文件

- `src/governdiff/privacy.py`
- `scripts/verify_zero_egress.py`
- `scripts/benchmark_phase7.py`
- `scripts/platform_smoke.py`
- `scripts/verify_reproducible_builds.py`
- `reviewer-ui/app/reviewer-model.mjs`
- `reviewer-ui/scripts/benchmark-ui.mjs`
- `reviewer-ui/scripts/verify-reproducible-build.mjs`
- `tests/test_phase7.py`
- `.github/dependabot.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/quality-gates.yml`
- `benchmark/PHASE_7_*.json`

## 复验命令

```powershell
$python = (Get-Command python).Source
$env:PYTHONPATH = "src"
& $python -m unittest tests.test_phase7 -v
& $python scripts/verify_zero_egress.py
& $python scripts/benchmark_phase7.py --strict
& $python scripts/verify_reproducible_builds.py

Set-Location reviewer-ui
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" test
& "C:\Program Files\nodejs\npm.cmd" run test:reproducible
& "C:\Program Files\nodejs\npm.cmd" audit --audit-level=high
```

## 后续阶段边界

Phase 8 才负责建立正式 Git 历史与远端、生成 hosted run URL、发布包和稳定 tag。Phase 7
没有擅自创建 commit、推送远端或发布制品；OCR 仍明确不在范围内。
