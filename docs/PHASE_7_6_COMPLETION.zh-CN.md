# GovernDiff Phase 7.6 结项：真实浏览器验收与总回归门禁

结项日期：2026-08-13
优先级：P0/P1
发布状态：仅本地；未配置 remote、未 push、未部署、未发布

## 1. 结论

Phase 7.6 已完成。Reviewer 的验收现分为两层：原有 Node 领域模型基准继续作为快速回归门；新增真实 Chrome 门禁测量 React 更新、DOM、布局与双 `requestAnimationFrame` 后的绘制稳定点。5,000 条变化通过有界窗口渲染，首次只挂载 13 张变化卡和 494 个 DOM 节点。

本机最终证据中，搜索、筛选、变化卡切换、连续决定 100 条和长列表滚动的 P95 均低于 200 ms；axe-core serious/critical 为 0，控制台错误为 0。NEXT-090–094 全部完成，Phase 8 的前置阻塞已解除，但本阶段没有执行任何 Phase 8 发布动作。

## 2. 工作项与结果

| ID | 结果 | 主要证据 |
|---|---|---|
| NEXT-090 | 完成 | `scripts/browser-gate.mjs` 使用真实 Chrome，等待 DOM 数量稳定并在双 rAF 后测量 React/DOM/layout/paint；`benchmark/PHASE_7_6_BROWSER.json` 保存机器可读证据。 |
| NEXT-091 | 完成 | 5,000 条规范 report 1.5 夹具由脚本确定性生成；超过 200 条时启用可访问窗口列表，首屏 13 卡/494 DOM；全部交互 P95 < 200 ms。 |
| NEXT-092 | 完成 | 覆盖搜索、筛选、变化卡切换、100 条连续决定、滚动、split/merge 多 block、alignment preview、刷新恢复、Undo、Review identity mismatch、坏报告 schema、窄屏三面板和本地 session Export。 |
| NEXT-093 | 完成 | axe-core 4.11.4 serious/critical 0；覆盖 J/K、数字决定、决定后焦点、skip link、dialog 初始焦点/循环/恢复、虚拟列表位置与名称。 |
| NEXT-094 | 完成 | Python、schema、零外联、Gold/Phase 3、Reviewer、npm audit、双构建复现、100 页及扩展语料总回归全部通过。 |

## 3. 两层门禁

### 领域模型门禁

`npm run test:performance` 保留为快速、无浏览器的 5,000 条变化回归。本次结果：search 8.905 ms、filter 1.652 ms、switch card 0.042 ms（P95）。它只用于快速定位模型层回归，不再作为最终 UI 验收证据。

### 浏览器门禁

`npm run test:browser` 会先构建确定性 5,000 条夹具，再以本机安装的 Chrome 运行真实页面。测试同时检查总变化数与实际挂载卡片数，避免用全量 DOM 隐藏性能问题。最终结果：

| 工作负载 | P95 | 门槛 |
|---|---:|---:|
| 5,000 条冷启动首次稳定渲染 | 539.293 ms | 5,000 ms |
| 搜索输入到稳定结果 | 81.4 ms | 200 ms |
| 筛选切换 | 82.6 ms | 200 ms |
| 变化卡切换 | 84.0 ms | 200 ms |
| 连续 Confirm and next 100 条 | 99.3 ms | 200 ms |
| 长列表滚动 | 48.3 ms | 200 ms |

冷启动是独立的首屏预算；200 ms 硬门槛用于用户可见交互。具体样本、最大值、运行环境和全部 acceptance 布尔值见 `benchmark/PHASE_7_6_BROWSER.json`。

## 4. 可访问性与视觉修正

- 窗口列表使用 `list/listitem` 语义，按钮名称包含当前位置、总数、摘要与稳定 fingerprint；
- 卡片选择后自动滚入窗口，当前项保留 roving tab stop 和 `aria-current`；
- 确认对话框支持 Escape、Tab/Shift+Tab 循环及关闭后焦点恢复；
- 对辅助文字、ID、严重度和未审阅标签做最小颜色加深，没有重写现有布局或视觉风格；
- axe-core 4.11.4：0 个 serious/critical，最终 0 个 violation；键盘和读屏路径断言全部通过。

## 5. 总回归证据

| 门禁 | 结果 |
|---|---|
| Python 全量 | 93/93 通过 |
| Reviewer 组件/领域/持久化/session | 33/33 通过 |
| Reviewer typecheck、lint、生产构建、SSR/静态契约 | 通过 |
| 真实 Chrome E2E | 全部 acceptance 为 true；axe 0；console error 0 |
| Schema | 示例与实时 CLI 等价报告全部通过 |
| AI-off 零外联 | 5 对、5 格式、0 network events |
| Gold / Phase 3 | 全部严格门槛通过；Phase 3 为 7/7 |
| 100 页复杂基准 | 0.8648 s，峰值 3.964 MiB，严格门槛通过 |
| Python 双构建 | wheel SHA-256 完全一致，干净安装 smoke 通过 |
| Reviewer 双构建 | 27 个规范化文件 byte-identical |
| 扩展语料 | 6 对、5 格式；519 changes、391 findings；6/6 review smoke |
| npm audit（moderate 及以上） | 0 漏洞 |
| 应用内可见浏览器抽查 | 桌面与 390×844 窄屏 DOM、三面板 tabs 和读屏名称通过 |

## 6. 复现

```powershell
cd reviewer-ui
npm test
npm run test:performance
npm run test:reproducible
npm audit --audit-level=moderate

cd ..
$env:PYTHONPATH = (Resolve-Path src).Path
python -m unittest discover -s tests -q
python scripts/validate_schemas.py
python scripts/verify_zero_egress.py
python scripts/evaluate_gold_benchmark.py --strict
python scripts/evaluate_phase3_benchmark.py --strict
python scripts/benchmark_phase7.py --strict
python scripts/verify_reproducible_builds.py
python scripts/build_expansion_corpus.py
python scripts/audit_expansion_corpus.py
```

## 7. 保留边界

- 没有实现 OCR、远程存储、公共遥测或公网 Reviewer；
- 没有创建 remote、commit、push、tag、发布包或部署；
- Playwright 仅驱动本机已安装 Chrome，测试服务器只监听随机 `127.0.0.1` 端口；
- Phase 8 现在可以排期，但其发布文档、PyPI 制品和公开示例仍未开始。
