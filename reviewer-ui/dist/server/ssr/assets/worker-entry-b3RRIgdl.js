import { a as getLayoutSegmentContext, c as __commonJSMin, d as __toCommonJS, f as __toESM, i as require_jsx_runtime, l as __esmMin, n as ParallelSlot, o as usePathname, r as Slot, s as require_react, t as Children, u as __exportAll } from "../index.js";
//#region app/components/reviewer-icon.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function ReviewerIcon({ name }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: {
			upload: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 15v4h14v-4" })] }),
			download: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 4v12m0 0l4.5-4.5M12 16l-4.5-4.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 20h14" })] }),
			search: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "10.5",
				cy: "10.5",
				r: "6.5"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M15.5 15.5L21 21" })] }),
			arrow: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 12h14m-5-5l5 5-5 5" }) }),
			check: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 12.5l4.2 4L19 7" })
		}[name]
	});
}
//#endregion
//#region app/i18n.tsx
var en = {
	"app.skip": "Skip to evidence review",
	"brand.reviewer": "Reviewer",
	"command.documents": "Compared documents",
	"command.open": "Open project",
	"command.openShort": "Open",
	"command.openAria": "Open GovernDiff report JSON",
	"command.save": "Save state",
	"command.saveShort": "Save",
	"command.import": "Import review",
	"command.importShort": "Import",
	"command.importAria": "Import GovernDiff review JSON",
	"command.export": "Export",
	"command.exportShort": "Export",
	"command.more": "More operations",
	"command.local": "Local-only review",
	"command.localDetail": "Policy text and decisions stay in this browser.",
	"command.shortcuts": "J/K navigate · 0–4 decide",
	"command.delete": "Clear local project",
	"command.language": "Interface language",
	"language.en": "EN",
	"language.zh-CN": "中文",
	"state.unreviewed": "unreviewed",
	"state.confirmed": "confirmed",
	"state.rejected": "rejected",
	"state.modified": "modified",
	"state.waived": "waived",
	"confidence.all": "all",
	"confidence.high": "high",
	"confidence.medium": "medium",
	"confidence.low": "low",
	"status.restoring": "Restoring",
	"status.saving": "Saving",
	"status.saveFailed": "Save failed",
	"status.unsaved": "Unsaved changes",
	"status.saved": "Saved",
	"status.exported": "Exported",
	"status.notExported": "Not exported",
	"status.mismatch": "Import does not match this report",
	"status.corrupt": "Damaged record isolated",
	"status.savedAt": "Saved {time}",
	"status.undo": "Undo {label}",
	"status.restore": "Restore deleted project",
	"summary.breaking": "Breaking",
	"summary.unreviewed": "Unreviewed",
	"summary.lowConfidence": "Low confidence",
	"summary.conflicts": "Conflicts",
	"summary.queueProgress": "Queue progress",
	"summary.reportProgress": "Report progress",
	"summary.warnings": "{count} quality warning(s)",
	"summary.noWarnings": "No quality warnings",
	"summary.audit": "Deterministic audit",
	"summary.schema": "Schema {version}",
	"summary.quality": "Quality review",
	"summary.qualityClear": "No parser, scan, low-confidence alignment, or mapping conflict warnings.",
	"tabs.queue": "Queue",
	"tabs.evidence": "Evidence",
	"tabs.decision": "Decision",
	"tabs.aria": "Review workspace",
	"queue.title": "Review queue",
	"queue.visible": "{count} visible",
	"queue.progress": "{reviewed}/{total} reviewed",
	"queue.search": "Search changes",
	"queue.searchPlaceholder": "Search clauses, checks, IDs…",
	"queue.documentMode": "Document mode",
	"queue.riskMode": "Risk queue",
	"queue.sort": "Sort",
	"queue.sort.document": "Document order",
	"queue.sort.risk": "Breaking · severity · confidence · unreviewed",
	"queue.sort.unreviewed": "Unreviewed first",
	"queue.filtersBatch": "Filters & batch",
	"queue.activeCount": "{count} active",
	"queue.allChanges": "All changes",
	"queue.confidence": "Confidence",
	"queue.risk": "Risk",
	"queue.type": "Type",
	"queue.all": "all",
	"queue.breakingOnly": "Breaking only",
	"queue.unreviewedOnly": "Unreviewed only",
	"queue.hideFormat": "Hide format-only",
	"queue.chapter": "Chapter filter",
	"queue.allChapters": "All chapters",
	"queue.clearAll": "Clear all filters",
	"queue.activeFilters": "Active filters",
	"queue.removeFilter": "Remove {label} filter",
	"queue.savedViews": "Saved local views",
	"queue.viewName": "View name",
	"queue.viewPlaceholder": "e.g. High-confidence Breaking",
	"queue.saveView": "Save current view",
	"queue.duplicateView": "Saving the same name updates that local view.",
	"queue.applyView": "Apply saved view",
	"queue.chooseView": "Choose a view…",
	"queue.deleteView": "Delete view",
	"queue.noViews": "No saved views yet",
	"queue.selection": "{selected} selected · {visible} visible",
	"queue.selectVisible": "Select all visible",
	"queue.clearSelection": "Clear selection",
	"queue.batchScope": "Batch scope: manual selection from the current visible set",
	"queue.confirmSelected": "Confirm selected",
	"queue.rejectSelected": "Reject selected",
	"queue.empty": "No changes match these filters.",
	"queue.results": "Review queue with {count} changes",
	"queue.selectForBatch": "Select {id} for batch review",
	"queue.openChange": "Open change {position} of {total}: {summary} ({id})",
	"evidence.title": "Evidence & findings",
	"evidence.none": "No change selected",
	"evidence.confidence": "Confidence",
	"evidence.mapping": "Article mapping",
	"evidence.mappingCandidates": "Article mapping candidates",
	"evidence.margin": "competition margin {score}",
	"evidence.rank": "rank {rank} · {count} evidence",
	"evidence.temporal": "Structured temporal changes",
	"evidence.findings": "Findings",
	"evidence.machineValues": "Machine values retained:",
	"evidence.reviewedOld": "Reviewed old value",
	"evidence.reviewedNew": "Reviewed new value",
	"evidence.modified": "Human modified · machine value preserved",
	"evidence.select": "Select a change from the review queue to inspect its evidence.",
	"evidence.beforeAfter": "Before and after evidence",
	"evidence.before": "Before",
	"evidence.after": "After",
	"evidence.blockCount": "{count} block(s)",
	"evidence.block": "Block {index}",
	"evidence.context": "Block context",
	"evidence.stableId": "Stable ID",
	"evidence.section": "Section",
	"evidence.location": "Location",
	"evidence.type": "Type",
	"evidence.table": "Table",
	"evidence.noArticle": "No article",
	"evidence.noPrevious": "No predecessor was aligned to this clause.",
	"evidence.noCurrent": "This clause is absent from the new policy.",
	"evidence.emphasis": "Change emphasis",
	"content.expand": "Show full text",
	"content.collapse": "Hide full text",
	"alignment.title": "Clause alignment",
	"alignment.edit": "Edit alignment",
	"alignment.unlink": "Unlink match",
	"alignment.previous": "Previous",
	"alignment.current": "Current",
	"alignment.searchPrevious": "Search previous blocks",
	"alignment.searchCurrent": "Search current blocks",
	"alignment.selected": "{count} selected",
	"alignment.original": "Original automatic match",
	"alignment.proposedOld": "New previous block set",
	"alignment.proposedNew": "New current block set",
	"alignment.impact": "Impact",
	"alignment.impactDetail": "Relink keeps the machine fingerprint and original block IDs in the audit record; only the human override changes.",
	"alignment.preview": "Review relink preview",
	"alignment.apply": "Apply relink",
	"alignment.cancel": "Cancel",
	"alignment.empty": "No blocks match this search.",
	"decision.title": "Decision",
	"decision.aria": "Reviewer decision",
	"decision.waiverAria": "Waiver details",
	"command.commandsAria": "Project commands",
	"status.aria": "Local project status",
	"summary.aria": "Collapsed audit summary",
	"decision.confirmed": "Confirm",
	"decision.rejected": "Reject",
	"decision.modified": "Mark modified",
	"decision.waived": "Waive",
	"decision.andNext": "{label} and next",
	"decision.nextShort": "+ next",
	"decision.advanceHint": "Decision buttons save immediately. Use the primary action to continue through the current queue.",
	"decision.note": "Review note",
	"decision.notePlaceholder": "Add rationale, decision ID, or follow-up…",
	"decision.waiveFlow": "Waive flow",
	"decision.documentException": "Document the exception",
	"decision.approver": "Approver",
	"decision.approverPlaceholder": "name or team",
	"decision.expires": "Expires",
	"decision.generateWaiver": "Generate waiver file",
	"decision.reset": "Reset to unreviewed (0)",
	"decision.privacy": "Saved locally. Export the portable review log to re-import it with the CLI.",
	"decision.select": "Select a change before deciding.",
	"dialog.kicker": "Confirm local change",
	"dialog.cancel": "Cancel",
	"open.title": "Open a GovernDiff project",
	"open.detail": "Drop a report.json from the CLI or GitHub Action. The complete report 1.5 schema is checked before anything is stored locally.",
	"warning.title": "Local project warning.",
	"notice.saved": "Project saved as one local transaction.",
	"notice.corruptRestored": "A damaged local project was isolated; the latest valid project was restored.",
	"error.corrupt": "A damaged local project was isolated. Open a validated report or restore a deleted project.",
	"error.sample": "Sample report could not be loaded.",
	"error.recovery": "Local project recovery failed.",
	"notice.undo": "Undid {label}.",
	"notice.selectBatch": "Select one or more changes first.",
	"notice.batch": "{count} visible selected change(s) marked {state}.",
	"dialog.batchTitle": "{action} selected changes?",
	"dialog.batchDetail": "This will update {count} selected change(s) from the current visible set. You can undo the batch afterward.",
	"notice.fieldEdit": "Human edit saved for {field}; the machine value is retained.",
	"notice.sameReport": "This old/new report pair is already open; current work was kept.",
	"dialog.openTitle": "Open a different report pair?",
	"dialog.openUnexported": "Current unexported review work will be saved locally before the new report is opened.",
	"dialog.openSaved": "The current project will be saved locally before the new report is opened.",
	"dialog.openConfirm": "Save and open report",
	"error.invalidReport": "Invalid JSON report.",
	"dialog.importTitle": "Replace the current review data?",
	"dialog.importUnexported": "The imported file will replace current unexported decisions, edits, and alignments. You can undo the import afterward.",
	"dialog.importSaved": "The imported file will replace current decisions, edits, and alignments. You can undo the import afterward.",
	"dialog.importConfirm": "Import review",
	"error.invalidReview": "Invalid review JSON.",
	"notice.exported": "Portable review exported; later changes will be marked unexported.",
	"notice.imported": "Review decisions imported and saved locally.",
	"notice.deleted": "Local project deleted; the recovery record is available for seven days.",
	"notice.waiver": "{count} waiver entry or entries generated.",
	"dialog.deleteTitle": "Delete this local project?",
	"dialog.deleteDetail": "The current project will be removed from active storage. One complete recovery record will remain available for seven days.",
	"dialog.deleteConfirm": "Delete project",
	"notice.noRecovery": "No recoverable project remains.",
	"notice.restored": "Deleted project restored.",
	"dialog.restoreTitle": "Restore the deleted project?",
	"dialog.restoreDetail": "The current project will be saved locally, then the recovery record will become the active project.",
	"dialog.restoreConfirm": "Save and restore",
	"alignment.choose": "Choose at least one previous and one current block before saving a relink.",
	"alignment.confirmTitle": "Apply this manual relink?",
	"alignment.confirmDetail": "The audit record will use {oldCount} previous and {newCount} current block(s). You can undo the relink afterward.",
	"alignment.saved": "Manual alignment saved locally and included in review export.",
	"alignment.unlinkTitle": "Unlink the automatic match?",
	"alignment.unlinkDetail": "The original block IDs will remain in the audit log. You can undo this alignment change afterward.",
	"alignment.unlinked": "Automatic match unlinked; original block IDs remain in the audit log.",
	"warning.scan": "{side}: suspected scanned input; OCR was not run.",
	"warning.low": "{count} low-confidence alignment(s) require human review.",
	"warning.conflicts": "{count} article mapping conflict(s) remain unresolved.",
	"view.invalid": "Use a view name between 1 and 40 characters.",
	"view.saved": "Saved local view “{name}”.",
	"view.applied": "Applied local view “{name}”.",
	"view.deleted": "Deleted local view “{name}”."
};
var zh = {
	...en,
	"app.skip": "跳到证据审阅",
	"brand.reviewer": "审阅器",
	"command.documents": "对比文档",
	"command.open": "打开项目",
	"command.openShort": "打开",
	"command.openAria": "打开 GovernDiff 报告 JSON",
	"command.save": "保存状态",
	"command.saveShort": "保存",
	"command.import": "导入审阅",
	"command.importShort": "导入",
	"command.importAria": "导入 GovernDiff 审阅 JSON",
	"command.export": "导出",
	"command.exportShort": "导出",
	"command.more": "更多操作",
	"command.local": "仅本地审阅",
	"command.localDetail": "政策正文与审阅决定只保存在此浏览器中。",
	"command.shortcuts": "J/K 切换 · 0–4 决定",
	"command.delete": "删除本地项目",
	"command.language": "界面语言",
	"status.restoring": "正在恢复",
	"state.unreviewed": "未审阅",
	"state.confirmed": "已确认",
	"state.rejected": "已驳回",
	"state.modified": "已修改",
	"state.waived": "已豁免",
	"confidence.all": "全部",
	"confidence.high": "高",
	"confidence.medium": "中",
	"confidence.low": "低",
	"status.saving": "正在保存",
	"status.saveFailed": "保存失败",
	"status.unsaved": "有未保存更改",
	"status.saved": "已保存",
	"status.exported": "已导出",
	"status.notExported": "尚未导出",
	"status.mismatch": "导入内容与当前报告不匹配",
	"status.corrupt": "损坏记录已隔离",
	"status.savedAt": "保存于 {time}",
	"status.undo": "撤销：{label}",
	"status.restore": "恢复已删除项目",
	"summary.breaking": "Breaking",
	"summary.unreviewed": "未审阅",
	"summary.lowConfidence": "低置信度",
	"summary.conflicts": "冲突",
	"summary.queueProgress": "当前队列",
	"summary.reportProgress": "全报告",
	"summary.warnings": "{count} 条质量警告",
	"summary.noWarnings": "无质量警告",
	"summary.audit": "确定性审计",
	"summary.schema": "Schema {version}",
	"summary.quality": "质量复核",
	"summary.qualityClear": "没有解析、扫描件、低置信度对齐或条号映射冲突警告。",
	"tabs.queue": "队列",
	"tabs.evidence": "证据",
	"tabs.decision": "决定",
	"tabs.aria": "审阅工作区",
	"queue.title": "审阅队列",
	"queue.visible": "可见 {count} 项",
	"queue.progress": "已审 {reviewed}/{total}",
	"queue.search": "搜索变化",
	"queue.searchPlaceholder": "搜索条款、检查项或 ID…",
	"queue.documentMode": "文档模式",
	"queue.riskMode": "风险队列",
	"queue.sort": "排序",
	"queue.sort.document": "原文顺序",
	"queue.sort.risk": "Breaking · 严重度 · 置信度 · 未审阅",
	"queue.sort.unreviewed": "未审阅优先",
	"queue.filtersBatch": "筛选与批量操作",
	"queue.activeCount": "{count} 项生效",
	"queue.allChanges": "全部变化",
	"queue.confidence": "置信度",
	"queue.risk": "风险",
	"queue.type": "类型",
	"queue.all": "全部",
	"queue.breakingOnly": "仅 Breaking",
	"queue.unreviewedOnly": "仅未审阅",
	"queue.hideFormat": "隐藏仅格式变化",
	"queue.chapter": "章节筛选",
	"queue.allChapters": "全部章节",
	"queue.clearAll": "清除全部筛选",
	"queue.activeFilters": "活跃筛选",
	"queue.removeFilter": "移除{label}筛选",
	"queue.savedViews": "本地保存视图",
	"queue.viewName": "视图名称",
	"queue.viewPlaceholder": "例如：高置信度 Breaking",
	"queue.saveView": "保存当前视图",
	"queue.duplicateView": "使用相同名称保存时，将更新该本地视图。",
	"queue.applyView": "应用保存视图",
	"queue.chooseView": "选择视图…",
	"queue.deleteView": "删除视图",
	"queue.noViews": "暂无保存视图",
	"queue.selection": "已选 {selected} 项 · 可见 {visible} 项",
	"queue.selectVisible": "全选当前可见项",
	"queue.clearSelection": "清空选择",
	"queue.batchScope": "批量范围：当前可见集合中的手动选择项",
	"queue.confirmSelected": "确认所选项",
	"queue.rejectSelected": "驳回所选项",
	"queue.empty": "没有符合当前筛选的变化。",
	"queue.results": "包含 {count} 项变化的审阅队列",
	"queue.selectForBatch": "选择 {id} 进行批量审阅",
	"queue.openChange": "打开第 {position} 项，共 {total} 项：{summary}（{id}）",
	"evidence.title": "证据与 Findings",
	"evidence.none": "未选择变化",
	"evidence.confidence": "置信度",
	"evidence.mapping": "条号映射",
	"evidence.mappingCandidates": "条号映射候选",
	"evidence.margin": "竞争差距 {score}",
	"evidence.rank": "排名 {rank} · {count} 条证据",
	"evidence.temporal": "结构化时间变化",
	"evidence.findings": "Findings",
	"evidence.machineValues": "保留的机器原值：",
	"evidence.reviewedOld": "人工复核旧值",
	"evidence.reviewedNew": "人工复核新值",
	"evidence.modified": "人工已修改 · 机器原值保留",
	"evidence.select": "从审阅队列选择一项变化以查看证据。",
	"evidence.beforeAfter": "前后版本证据",
	"evidence.before": "旧版",
	"evidence.after": "新版",
	"evidence.blockCount": "{count} 个文本块",
	"evidence.block": "文本块 {index}",
	"evidence.context": "文本块上下文",
	"evidence.stableId": "稳定 ID",
	"evidence.section": "章节",
	"evidence.location": "位置",
	"evidence.type": "类型",
	"evidence.table": "表格",
	"evidence.noArticle": "无条号",
	"evidence.noPrevious": "没有与此条款对齐的旧版文本块。",
	"evidence.noCurrent": "新版政策中不存在此条款。",
	"evidence.emphasis": "变化重点",
	"content.expand": "展开完整内容",
	"content.collapse": "收起完整内容",
	"alignment.title": "条款对齐",
	"alignment.edit": "编辑对齐",
	"alignment.unlink": "解除匹配",
	"alignment.previous": "旧版",
	"alignment.current": "新版",
	"alignment.searchPrevious": "搜索旧版文本块",
	"alignment.searchCurrent": "搜索新版文本块",
	"alignment.selected": "已选 {count} 项",
	"alignment.original": "原自动匹配",
	"alignment.proposedOld": "新的旧版文本块集合",
	"alignment.proposedNew": "新的新版文本块集合",
	"alignment.impact": "影响",
	"alignment.impactDetail": "重连会保留机器 fingerprint 和原始文本块 ID；只有人工覆盖记录会改变。",
	"alignment.preview": "查看重连预览",
	"alignment.apply": "应用重连",
	"alignment.cancel": "取消",
	"alignment.empty": "没有匹配搜索条件的文本块。",
	"decision.title": "决定",
	"decision.aria": "审阅决定",
	"decision.waiverAria": "豁免详情",
	"command.commandsAria": "项目命令",
	"status.aria": "本地项目状态",
	"summary.aria": "折叠审计摘要",
	"decision.confirmed": "确认",
	"decision.rejected": "驳回",
	"decision.modified": "标记为已修改",
	"decision.waived": "豁免",
	"decision.andNext": "{label}并进入下一项",
	"decision.nextShort": "并下一项",
	"decision.advanceHint": "选择决定后会立即保存；使用主按钮继续审阅当前队列。",
	"decision.note": "审阅备注",
	"decision.notePlaceholder": "添加理由、决定编号或后续事项…",
	"decision.waiveFlow": "豁免流程",
	"decision.documentException": "记录例外依据",
	"decision.approver": "批准人",
	"decision.approverPlaceholder": "姓名或团队",
	"decision.expires": "到期日",
	"decision.generateWaiver": "生成豁免文件",
	"decision.reset": "重置为未审阅（0）",
	"decision.privacy": "已保存在本地。导出便携审阅日志后可由 CLI 重新导入。",
	"decision.select": "请先选择一项变化。",
	"dialog.kicker": "确认本地更改",
	"dialog.cancel": "取消",
	"open.title": "打开 GovernDiff 项目",
	"open.detail": "拖入 CLI 或 GitHub Action 生成的 report.json。完整 report 1.5 schema 校验通过后才会写入本地。",
	"warning.title": "本地项目警告。",
	"notice.saved": "项目已作为一个本地事务保存。",
	"notice.corruptRestored": "损坏的本地项目已隔离，并恢复了最近的有效项目。",
	"error.corrupt": "损坏的本地项目已隔离。请打开通过校验的报告或恢复已删除项目。",
	"error.sample": "无法加载示例报告。",
	"error.recovery": "本地项目恢复失败。",
	"notice.undo": "已撤销：{label}。",
	"notice.selectBatch": "请先选择一项或多项变化。",
	"notice.batch": "已将当前可见集合中所选的 {count} 项标记为 {state}。",
	"dialog.batchTitle": "{action}所选变化？",
	"dialog.batchDetail": "将更新当前可见集合中所选的 {count} 项变化，之后可以撤销整批操作。",
	"notice.fieldEdit": "已保存 {field} 的人工修改，机器原值仍被保留。",
	"notice.sameReport": "当前已打开同一组新旧报告，现有工作未被替换。",
	"dialog.openTitle": "打开另一组报告？",
	"dialog.openUnexported": "打开新报告前，会先在本地保存当前尚未导出的审阅工作。",
	"dialog.openSaved": "打开新报告前，会先在本地保存当前项目。",
	"dialog.openConfirm": "保存并打开报告",
	"error.invalidReport": "无效的报告 JSON。",
	"dialog.importTitle": "替换当前审阅数据？",
	"dialog.importUnexported": "导入文件将替换当前尚未导出的决定、编辑和对齐记录；之后可以撤销导入。",
	"dialog.importSaved": "导入文件将替换当前决定、编辑和对齐记录；之后可以撤销导入。",
	"dialog.importConfirm": "导入审阅",
	"error.invalidReview": "无效的审阅 JSON。",
	"notice.exported": "便携审阅已导出，后续更改将重新标记为尚未导出。",
	"notice.imported": "审阅决定已导入并保存在本地。",
	"notice.deleted": "本地项目已删除，恢复记录将在七天内可用。",
	"notice.waiver": "已生成 {count} 条豁免记录。",
	"dialog.deleteTitle": "删除此本地项目？",
	"dialog.deleteDetail": "当前项目将从活动存储中移除，并保留一份七天内可恢复的完整记录。",
	"dialog.deleteConfirm": "删除项目",
	"notice.noRecovery": "没有可恢复的项目。",
	"notice.restored": "已恢复删除的项目。",
	"dialog.restoreTitle": "恢复已删除项目？",
	"dialog.restoreDetail": "将先在本地保存当前项目，再把恢复记录设为活动项目。",
	"dialog.restoreConfirm": "保存并恢复",
	"alignment.choose": "保存重连前，请至少选择一个旧版文本块和一个新版文本块。",
	"alignment.confirmTitle": "应用此人工重连？",
	"alignment.confirmDetail": "审计记录将使用 {oldCount} 个旧版文本块和 {newCount} 个新版文本块；之后可以撤销重连。",
	"alignment.saved": "人工对齐已保存在本地，并会进入审阅导出。",
	"alignment.unlinkTitle": "解除自动匹配？",
	"alignment.unlinkDetail": "原始文本块 ID 将继续保留在审计记录中，之后可以撤销本次对齐更改。",
	"alignment.unlinked": "自动匹配已解除，原始文本块 ID 仍保留在审计记录中。",
	"warning.scan": "{side}：疑似扫描件，未运行 OCR。",
	"warning.low": "{count} 项低置信度对齐需要人工复核。",
	"warning.conflicts": "仍有 {count} 项条号映射冲突未解决。",
	"view.invalid": "视图名称长度应为 1–40 个字符。",
	"view.saved": "已保存本地视图“{name}”。",
	"view.applied": "已应用本地视图“{name}”。",
	"view.deleted": "已删除本地视图“{name}”。"
};
function createTranslator(language) {
	const messages = language === "zh-CN" ? zh : en;
	return (key, values = {}) => Object.entries(values).reduce((message, [name, value]) => message.replaceAll(`{${name}}`, String(value)), messages[key]);
}
var I18nContext = (0, import_react.createContext)({
	language: "en",
	t: createTranslator("en")
});
function I18nProvider({ language, children }) {
	const value = (0, import_react.useMemo)(() => ({
		language,
		t: createTranslator(language)
	}), [language]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nContext.Provider, {
		value,
		children
	});
}
function useI18n() {
	return (0, import_react.useContext)(I18nContext);
}
//#endregion
//#region app/components/command-bar.tsx
function documentLabel(report, side) {
	const document = side === "old" ? report?.old_document : report?.new_document;
	return document?.source_name ?? document?.path ?? `${side}-policy`;
}
function CommandBar({ report, sessionMode, onOpenReport, onSaveState, onImportReview, onExportReview, onClearProject, onLanguageChange }) {
	const { language, t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "command-bar",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "brand-lockup",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "brand-mark",
					children: "GD"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "GovernDiff" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("brand.reviewer") })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "document-route",
				"aria-label": t("command.documents"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: documentLabel(report, "old") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewerIcon, { name: "arrow" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: documentLabel(report, "new") })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "command-actions",
				"aria-label": t("command.commandsAria"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: `button ${report ? "button-secondary" : "button-primary"} file-control ${sessionMode ? "disabled" : ""}`,
						"aria-disabled": sessionMode,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewerIcon, { name: "upload" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "command-label-full",
								children: t("command.open")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "command-label-short",
								children: t("command.openShort")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": t("command.openAria"),
								type: "file",
								accept: "application/json,.json",
								disabled: sessionMode,
								onChange: (event) => {
									const file = event.target.files?.[0];
									event.target.value = "";
									onOpenReport(file);
								}
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "button button-secondary",
						"aria-label": t("command.save"),
						onClick: onSaveState,
						disabled: !report,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "command-label-full",
							children: t("command.save")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "command-label-short",
							children: t("command.saveShort")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: `button button-secondary file-control ${!report ? "disabled" : ""}`,
						"aria-disabled": !report,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "command-label-full",
								children: t("command.import")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "command-label-short",
								children: t("command.importShort")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": t("command.importAria"),
								type: "file",
								accept: "application/json,.json",
								disabled: !report,
								onChange: (event) => {
									const file = event.target.files?.[0];
									event.target.value = "";
									onImportReview(file);
								}
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "button button-secondary export-control",
						"aria-label": t("command.export"),
						onClick: onExportReview,
						disabled: !report,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewerIcon, { name: "download" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "command-label-full",
								children: t("command.export")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "command-label-short",
								children: t("command.exportShort")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "language-switch",
						role: "group",
						"aria-label": t("command.language"),
						children: ["en", "zh-CN"].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": language === option,
							onClick: () => onLanguageChange(option),
							children: t(`language.${option}`)
						}, option))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "command-menu",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
							className: "button button-secondary",
							"aria-label": t("command.more"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "more-label",
								children: t("command.more")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "more-glyph",
								"aria-hidden": "true",
								children: "•••"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "command-menu-popover",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("command.local") }), t("command.localDetail")] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "shortcut-copy",
									children: t("command.shortcuts")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "menu-danger",
									onClick: onClearProject,
									disabled: !report || sessionMode,
									children: t("command.delete")
								})
							]
						})]
					})
				]
			})
		]
	});
}
//#endregion
//#region app/components/alignment-repair.tsx
function blockLocation(block) {
	if (block.page_start != null) return `p. ${block.page_start}`;
	if (block.paragraph_start != null) return `¶ ${block.paragraph_start}`;
	return `L${block.line_start}`;
}
function matches(block, query) {
	const term = query.trim().toLocaleLowerCase();
	if (!term) return true;
	return [
		block.block_id,
		block.section_label,
		...block.section ?? [],
		block.text
	].join(" ").toLocaleLowerCase().includes(term);
}
function BlockPicker({ side, blocks, selected, onToggle }) {
	const { t } = useI18n();
	const [query, setQuery] = (0, import_react.useState)("");
	const visible = (0, import_react.useMemo)(() => blocks.filter((block) => matches(block, query)), [blocks, query]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "alignment-picker",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: side === "old" ? t("alignment.previous") : t("alignment.current") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("alignment.selected", { count: selected.length }) })] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "search",
				value: query,
				"aria-label": side === "old" ? t("alignment.searchPrevious") : t("alignment.searchCurrent"),
				placeholder: side === "old" ? t("alignment.searchPrevious") : t("alignment.searchCurrent"),
				onChange: (event) => setQuery(event.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "alignment-block-list",
				children: [visible.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: selected.includes(block.block_id) ? "selected" : "",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: selected.includes(block.block_id),
						onChange: (event) => onToggle(block.block_id, event.target.checked)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: block.section_label || "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
							block.block_id,
							" · ",
							blockLocation(block)
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: block.text.slice(0, 180) })
					] })]
				}, block.block_id)), !visible.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "empty-state",
					children: t("alignment.empty")
				})]
			})
		]
	});
}
function PreviewList({ title, ids, blocks }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: title }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ids.length }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: ids.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [blocks.find((block) => block.block_id === id)?.section_label ?? id, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: id })] }, id)) })
	] });
}
function AlignmentRepair({ change, oldBlocks, newBlocks, initialOldIds, initialNewIds, onApply, onCancel }) {
	const { t } = useI18n();
	const [oldIds, setOldIds] = (0, import_react.useState)(initialOldIds);
	const [newIds, setNewIds] = (0, import_react.useState)(initialNewIds);
	const [preview, setPreview] = (0, import_react.useState)(false);
	const machineOldIds = (change.old_blocks ?? [change.old_block]).filter(Boolean).map((block) => block.block_id);
	const machineNewIds = (change.new_blocks ?? [change.new_block]).filter(Boolean).map((block) => block.block_id);
	const toggle = (setter, id, checked) => setter((current) => checked ? Array.from(/* @__PURE__ */ new Set([...current, id])) : current.filter((item) => item !== id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "alignment-form",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "alignment-pickers",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockPicker, {
					side: "old",
					blocks: oldBlocks,
					selected: oldIds,
					onToggle: (id, checked) => toggle(setOldIds, id, checked)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockPicker, {
					side: "new",
					blocks: newBlocks,
					selected: newIds,
					onToggle: (id, checked) => toggle(setNewIds, id, checked)
				})]
			}),
			preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "alignment-preview",
				"aria-label": t("alignment.preview"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewList, {
						title: t("alignment.original"),
						ids: [...machineOldIds, ...machineNewIds],
						blocks: [...oldBlocks, ...newBlocks]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewList, {
						title: t("alignment.proposedOld"),
						ids: oldIds,
						blocks: oldBlocks
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewList, {
						title: t("alignment.proposedNew"),
						ids: newIds,
						blocks: newBlocks
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "alignment-impact",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("alignment.impact") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("alignment.impactDetail") })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "alignment-actions",
				children: [!preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "button button-primary",
					disabled: !oldIds.length || !newIds.length,
					onClick: () => setPreview(true),
					children: t("alignment.preview")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "button button-primary",
					disabled: !oldIds.length || !newIds.length,
					onClick: () => onApply(oldIds, newIds),
					children: t("alignment.apply")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "button button-secondary",
					onClick: onCancel,
					children: t("alignment.cancel")
				})]
			})
		]
	});
}
//#endregion
//#region app/components/collapsible-content.tsx
function CollapsibleContent({ children, text, className = "", threshold = 220, alwaysVisible = false }) {
	const { t } = useI18n();
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const long = !alwaysVisible && (text?.length ?? 0) > threshold;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `collapsible-content ${long && !expanded ? "is-collapsed" : ""} ${className}`.trim(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: children ?? text }), long && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setExpanded((current) => !current),
			children: expanded ? t("content.collapse") : t("content.expand")
		})]
	});
}
//#endregion
//#region app/components/confirmation-dialog.tsx
function ConfirmationDialog({ title, detail, confirmLabel, destructive = false, onConfirm, onCancel }) {
	const { t } = useI18n();
	const cancelRef = (0, import_react.useRef)(null);
	const dialogRef = (0, import_react.useRef)(null);
	const returnFocusRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		returnFocusRef.current = document.activeElement;
		cancelRef.current?.focus();
		return () => returnFocusRef.current?.focus();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "dialog-backdrop",
		onMouseDown: onCancel,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "confirmation-dialog",
			role: "alertdialog",
			"aria-modal": "true",
			"aria-labelledby": "confirmation-title",
			"aria-describedby": "confirmation-detail",
			ref: dialogRef,
			onMouseDown: (event) => event.stopPropagation(),
			onKeyDown: (event) => {
				if (event.key === "Escape") {
					event.preventDefault();
					onCancel();
				}
				if (event.key === "Tab") {
					const focusable = Array.from(dialogRef.current?.querySelectorAll("button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])") ?? []);
					if (!focusable.length) return;
					const first = focusable[0];
					const last = focusable.at(-1);
					if (event.shiftKey && document.activeElement === first) {
						event.preventDefault();
						last.focus();
					} else if (!event.shiftKey && document.activeElement === last) {
						event.preventDefault();
						first.focus();
					}
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("dialog.kicker") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "confirmation-title",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					id: "confirmation-detail",
					children: detail
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					ref: cancelRef,
					className: "button button-secondary",
					onClick: onCancel,
					children: t("dialog.cancel")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: `button ${destructive ? "button-danger" : "button-primary"}`,
					onClick: onConfirm,
					children: confirmLabel
				})] })
			]
		})
	});
}
//#endregion
//#region app/reviewer-model.mjs
/** @typedef {import("./reviewer-types").Block} Block */
/** @typedef {import("./reviewer-types").Decisions} Decisions */
/** @typedef {import("./reviewer-types").PolicyChange} PolicyChange */
/** @typedef {import("./reviewer-types").ReviewerFilters} ReviewerFilters */
/** @typedef {import("./reviewer-types").ReviewState} ReviewState */
/** @type {Record<string, ReviewState>} */
var LEGACY_STATES = {
	accepted: "confirmed",
	"false-positive": "rejected"
};
/** @param {unknown} value @returns {ReviewState} */
function normalizeState(value) {
	if (!value) return "unreviewed";
	if (typeof value !== "string") return "unreviewed";
	const normalized = LEGACY_STATES[value] ?? value;
	return [
		"unreviewed",
		"confirmed",
		"rejected",
		"modified",
		"waived"
	].includes(normalized) ? normalized : "unreviewed";
}
/** @param {string[] | null | undefined} path */
function sectionKey(path) {
	return (path ?? []).join("");
}
/**
* @param {PolicyChange[]} changes
* @param {ReviewerFilters} filters
* @param {Decisions} decisions
* @returns {PolicyChange[]}
*/
function filterChanges(changes, filters, decisions = {}) {
	const { query = "", confidence = "all", changeType = "all", sectionFilter = "", breakingOnly = false, unreviewedOnly = false, hideFormatOnly = false } = filters;
	const term = query.trim().toLocaleLowerCase();
	return changes.filter((change) => {
		if (change.change_type === "unchanged") return false;
		if (hideFormatOnly && change.change_type === "format_only") return false;
		if (confidence !== "all" && change.confidence_level !== confidence) return false;
		if (changeType !== "all" && change.change_type !== changeType) return false;
		const key = sectionKey(change.section_path);
		if (sectionFilter && key !== sectionFilter && !key.startsWith(`${sectionFilter}\u001f`)) return false;
		if (breakingOnly && !change.findings.some((finding) => finding.breaking && !finding.waived)) return false;
		if (unreviewedOnly && normalizeState(decisions[change.fingerprint]?.state ?? change.review?.state) !== "unreviewed") return false;
		if (!term) return true;
		return [
			change.fingerprint,
			change.section,
			change.old_article,
			change.new_article,
			change.old_block?.text,
			change.new_block?.text,
			...change.findings.flatMap((finding) => [
				finding.check_id,
				finding.field,
				finding.summary
			])
		].filter(Boolean).join(" ").toLocaleLowerCase().includes(term);
	});
}
var SEVERITY_RANK = {
	critical: 5,
	blocker: 5,
	high: 4,
	warning: 3,
	medium: 3,
	low: 2,
	info: 1
};
/** @param {PolicyChange} change */
function hasBreaking(change) {
	return change.findings.some((finding) => finding.breaking && !finding.waived);
}
/**
* Stable queue ordering. The original report index is the final tie breaker.
* @param {PolicyChange[]} changes
* @param {ReviewerFilters["sortBy"]} sortBy
* @param {Decisions} decisions
* @returns {PolicyChange[]}
*/
function sortChanges(changes, sortBy = "document", decisions = {}) {
	const indexed = changes.map((change, index) => ({
		change,
		index
	}));
	if (sortBy === "document") return indexed.map(({ change }) => change);
	return indexed.sort((left, right) => {
		const leftState = normalizeState(decisions[left.change.fingerprint]?.state ?? left.change.review?.state);
		const rightState = normalizeState(decisions[right.change.fingerprint]?.state ?? right.change.review?.state);
		const unreviewedDelta = Number(rightState === "unreviewed") - Number(leftState === "unreviewed");
		if (sortBy === "unreviewed" && unreviewedDelta) return unreviewedDelta;
		if (sortBy === "risk") {
			const breakingDelta = Number(hasBreaking(right.change)) - Number(hasBreaking(left.change));
			if (breakingDelta) return breakingDelta;
			const severityDelta = (SEVERITY_RANK[right.change.severity?.toLocaleLowerCase()] ?? 0) - (SEVERITY_RANK[left.change.severity?.toLocaleLowerCase()] ?? 0);
			if (severityDelta) return severityDelta;
			const confidenceDelta = right.change.confidence_score - left.change.confidence_score;
			if (confidenceDelta) return confidenceDelta;
			if (unreviewedDelta) return unreviewedDelta;
		}
		return left.index - right.index;
	}).map(({ change }) => change);
}
/**
* @param {PolicyChange[]} changes
* @param {ReviewerFilters} filters
* @param {Decisions} decisions
*/
function buildReviewQueue(changes, filters, decisions = {}) {
	return sortChanges(filterChanges(changes, filters, decisions), filters.sortBy, decisions);
}
/**
* Returns the item that occupied the next queue position before a decision.
* The queue is complete when the current item was last.
* @param {PolicyChange[]} currentQueue
* @param {string} currentFingerprint
*/
function nextQueueFingerprint(currentQueue, currentFingerprint) {
	const index = currentQueue.findIndex((change) => change.fingerprint === currentFingerprint);
	if (index < 0) return currentQueue[0]?.fingerprint ?? "";
	return currentQueue[index + 1]?.fingerprint ?? "";
}
/**
* @param {PolicyChange[]} visibleChanges
* @param {string} selectedId
* @param {PolicyChange[]} allChanges
* @returns {PolicyChange | null}
*/
function selectChange(visibleChanges, selectedId, allChanges) {
	return visibleChanges.find((item) => item.fingerprint === selectedId) ?? visibleChanges[0] ?? allChanges.find((item) => item.fingerprint === selectedId) ?? null;
}
/**
* @param {Array<Block | null | undefined>} blocks
* @returns {Block[]}
*/
function uniqueBlocks(blocks) {
	const result = /* @__PURE__ */ new Map();
	blocks.forEach((block) => {
		if (block) result.set(block.block_id, block);
	});
	return Array.from(result.values()).sort((a, b) => a.line_start - b.line_start);
}
//#endregion
//#region app/components/change-list.tsx
function confidenceClass(level) {
	return `confidence confidence-${level}`;
}
function formatScore(value) {
	return Number.isFinite(value) ? value.toFixed(2) : "—";
}
function ChangeList({ changes, selectedId, batchIds, decisions, onSelect, onToggleBatch }) {
	const { t } = useI18n();
	const scrollRef = (0, import_react.useRef)(null);
	const [viewport, setViewport] = (0, import_react.useState)({
		scrollTop: 0,
		height: 720
	});
	const rowHeight = 112;
	const overscan = 6;
	const virtualized = changes.length > 200;
	const start = virtualized ? Math.max(0, Math.floor(viewport.scrollTop / rowHeight) - overscan) : 0;
	const end = virtualized ? Math.min(changes.length, Math.ceil((viewport.scrollTop + viewport.height) / rowHeight) + overscan) : changes.length;
	const visibleChanges = (0, import_react.useMemo)(() => changes.slice(start, end), [
		changes,
		end,
		start
	]);
	(0, import_react.useEffect)(() => {
		const container = scrollRef.current;
		if (!container) return;
		const measure = () => setViewport((current) => ({
			scrollTop: container.scrollTop,
			height: container.clientHeight || current.height
		}));
		measure();
		const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
		observer?.observe(container);
		return () => observer?.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		const container = scrollRef.current;
		if (!container || !virtualized) return;
		const index = changes.findIndex((change) => change.fingerprint === selectedId);
		if (index < 0) return;
		const top = index * rowHeight;
		const bottom = top + rowHeight;
		if (top < container.scrollTop) container.scrollTop = top;
		else if (bottom > container.scrollTop + container.clientHeight) container.scrollTop = bottom - container.clientHeight;
	}, [
		changes,
		selectedId,
		virtualized
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-label": t("queue.results", { count: changes.length }),
		className: "change-list",
		"data-rendered-count": visibleChanges.length,
		"data-total-count": changes.length,
		onScroll: (event) => setViewport({
			scrollTop: event.currentTarget.scrollTop,
			height: event.currentTarget.clientHeight
		}),
		ref: scrollRef,
		role: "list",
		tabIndex: 0,
		children: [
			virtualized && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				style: { height: start * rowHeight }
			}),
			visibleChanges.map((change, offset) => {
				const state = normalizeState(decisions[change.fingerprint]?.state ?? change.review?.state);
				const selected = selectedId === change.fingerprint;
				const index = start + offset;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `change-card-shell ${selected ? "selected" : ""}`,
					role: "listitem",
					"aria-posinset": index + 1,
					"aria-setsize": changes.length,
					id: `change-option-${change.fingerprint}`,
					style: virtualized ? { minHeight: rowHeight } : void 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "batch-check",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							"aria-label": t("queue.selectForBatch", { id: change.fingerprint }),
							type: "checkbox",
							checked: batchIds.includes(change.fingerprint),
							onChange: (event) => onToggleBatch(change.fingerprint, event.target.checked)
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "change-card",
						"aria-label": t("queue.openChange", {
							position: index + 1,
							total: changes.length,
							summary: change.findings[0]?.summary ?? `${change.change_type} clause`,
							id: change.fingerprint
						}),
						"aria-current": selected ? "true" : void 0,
						tabIndex: selected ? 0 : -1,
						onClick: () => onSelect(change.fingerprint),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "change-card-top",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: confidenceClass(change.confidence_level),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("queue.confidence") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
										t(`confidence.${change.confidence_level}`),
										" ",
										formatScore(change.confidence_score)
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `severity severity-${change.severity}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("queue.risk") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: change.severity })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: change.findings[0]?.summary ?? `${change.change_type} clause` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "change-section",
								children: change.section
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "change-card-bottom",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: change.fingerprint }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `review-state review-${state}`,
									children: t(`state.${state}`)
								})]
							})
						]
					})]
				}, change.fingerprint);
			}),
			virtualized && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				style: { height: (changes.length - end) * rowHeight }
			}),
			!changes.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "empty-state",
				children: t("queue.empty")
			})
		]
	});
}
//#endregion
//#region app/components/decision-panel.tsx
var decisions = [
	[
		"confirmed",
		"1",
		"decision.confirmed"
	],
	[
		"rejected",
		"2",
		"decision.rejected"
	],
	[
		"modified",
		"3",
		"decision.modified"
	],
	[
		"waived",
		"4",
		"decision.waived"
	]
];
function DecisionPanel({ state, note, approver, waiverExpiry, onDecision, onNote, onApprover, onWaiverExpiry, onGenerateWaiver, onDecisionAndNext }) {
	const { t } = useI18n();
	const advanceState = state === "unreviewed" ? "confirmed" : state;
	const advanceDecision = decisions.find(([value]) => value === advanceState) ?? decisions[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "decision-card",
		"aria-label": t("decision.aria"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pane-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("decision.title") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t(`state.${state}`) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `review-state review-${state}`,
					children: t(`state.${state}`)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "decision-stack",
				children: decisions.map(([value, shortcut, labelKey]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					"aria-pressed": state === value,
					className: state === value ? `active decision-${value}` : `decision-${value}`,
					onClick: () => onDecision(value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "keycap",
							children: shortcut
						}),
						t(labelKey),
						state === value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewerIcon, { name: "check" })
					]
				}, value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "decision-advance",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "button button-primary",
					"aria-label": t("decision.andNext", { label: t(advanceDecision[2]) }),
					onClick: () => onDecisionAndNext(advanceState),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("decision.andNext", { label: t(advanceDecision[2]) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewerIcon, { name: "arrow" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t("decision.advanceHint") })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "note-field",
				children: [t("decision.note"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: note,
					onChange: (event) => onNote(event.target.value),
					placeholder: t("decision.notePlaceholder")
				})]
			}),
			state === "waived" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "waiver-flow",
				"aria-label": t("decision.waiverAria"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("decision.waiveFlow") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("decision.documentException") })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [t("decision.approver"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: approver,
						onChange: (event) => onApprover(event.target.value),
						placeholder: t("decision.approverPlaceholder")
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [t("decision.expires"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						inputMode: "numeric",
						pattern: "\\d{4}-\\d{2}-\\d{2}",
						placeholder: "YYYY-MM-DD",
						value: waiverExpiry,
						onChange: (event) => onWaiverExpiry(event.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "button button-primary",
						onClick: onGenerateWaiver,
						children: t("decision.generateWaiver")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "reset-review",
				onClick: () => onDecision("unreviewed"),
				children: t("decision.reset")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "privacy-note",
				children: t("decision.privacy")
			})
		]
	});
}
//#endregion
//#region app/components/word-evidence.tsx
function WordEvidence({ change, side }) {
	const operations = change.word_diff ?? [];
	if (!operations.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: side === "old" ? change.old_block?.text : change.new_block?.text });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: operations.map((operation, index) => {
		const text = side === "old" ? operation.old_text : operation.new_text;
		if (!text) return null;
		const visible = operation.operation === "equal" ? "equal" : side === "old" ? operation.operation === "insert" ? "hidden" : "delete" : operation.operation === "delete" ? "hidden" : "insert";
		if (visible === "hidden") return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
			"aria-label": visible === "delete" ? "deleted text" : visible === "insert" ? "inserted text" : void 0,
			className: `word-diff word-${visible}`,
			children: text
		}, `${operation.operation}-${index}`);
	}) });
}
//#endregion
//#region app/components/evidence-comparison.tsx
function changeBlocks(change, side) {
	const multiple = side === "old" ? change.old_blocks : change.new_blocks;
	const single = side === "old" ? change.old_block : change.new_block;
	const values = multiple?.length ? multiple : single ? [single] : [];
	const seen = /* @__PURE__ */ new Set();
	return values.filter((block) => {
		if (!block || seen.has(block.block_id)) return false;
		seen.add(block.block_id);
		return true;
	});
}
function pageLabel(block) {
	if (block.page_start != null) return block.page_end != null && block.page_end !== block.page_start ? `Pages ${block.page_start}–${block.page_end}` : `Page ${block.page_start}`;
	if (block.paragraph_start != null) return block.paragraph_end != null && block.paragraph_end !== block.paragraph_start ? `Paragraphs ${block.paragraph_start}–${block.paragraph_end}` : `Paragraph ${block.paragraph_start}`;
	return block.line_end !== block.line_start ? `Lines ${block.line_start}–${block.line_end}` : `Line ${block.line_start}`;
}
function BlockEvidence({ block, index }) {
	const { t } = useI18n();
	const section = block.section?.length ? block.section.join(" › ") : block.section_label || "Unsectioned";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "evidence-block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("evidence.block", { index: index + 1 }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: block.evidence_label ?? pageLabel(block) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "block-location",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: section }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: pageLabel(block) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContent, {
				className: "evidence-block-copy",
				text: block.text,
				threshold: 560
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "block-context",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: t("evidence.context") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: t("evidence.stableId") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: block.block_id })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: t("evidence.section") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: section })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: t("evidence.location") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: pageLabel(block) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: t("evidence.type") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: block.block_type ?? "text" })] }),
					block.table_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: t("evidence.table") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
						block.table_id,
						" · row ",
						block.table_row ?? "—",
						" · column ",
						block.table_column ?? "—"
					] })] })
				] })]
			})
		]
	});
}
function EvidenceSide({ change, side }) {
	const { t } = useI18n();
	const blocks = changeBlocks(change, side);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `evidence-side evidence-${side === "old" ? "before" : "after"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "evidence-side-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: side === "old" ? t("evidence.before") : t("evidence.after") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("evidence.blockCount", { count: blocks.length }) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: side === "old" ? change.old_article ?? t("evidence.noArticle") : change.new_article ?? t("evidence.noArticle") })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "evidence-block-list",
				children: blocks.length ? blocks.map((block, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockEvidence, {
					block,
					index
				}, block.block_id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "evidence-empty",
					children: side === "old" ? t("evidence.noPrevious") : t("evidence.noCurrent")
				})
			}),
			!!change.word_diff?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "word-diff-summary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("evidence.emphasis") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordEvidence, {
					change,
					side
				}) })]
			})
		]
	});
}
function EvidenceComparison({ change }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "evidence-comparison",
		"aria-label": t("evidence.beforeAfter"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceSide, {
			change,
			side: "old"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceSide, {
			change,
			side: "new"
		})]
	});
}
//#endregion
//#region app/components/project-status.tsx
function ProjectStatus({ saveStatus, dirty, exportStatus, integrityStatus, updatedAt, hasRecovery, undoLabel, onRestore, onUndo }) {
	const { t } = useI18n();
	const saveLabel = saveStatus === "restoring" ? t("status.restoring") : saveStatus === "saving" ? t("status.saving") : saveStatus === "error" ? t("status.saveFailed") : dirty ? t("status.unsaved") : t("status.saved");
	const saveTone = saveStatus === "error" ? "error" : dirty ? "warning" : "success";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "project-status",
		"aria-label": t("status.aria"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "project-status-items",
			role: "status",
			"aria-live": "polite",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "project-status-chip",
					"data-tone": saveTone,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { "aria-hidden": "true" }), saveLabel]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "project-status-chip",
					"data-tone": exportStatus.state === "exported" ? "success" : "warning",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { "aria-hidden": "true" }), exportStatus.state === "exported" ? t("status.exported") : t("status.notExported")]
				}),
				integrityStatus === "identity-mismatch" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "project-status-chip",
					"data-tone": "error",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { "aria-hidden": "true" }), t("status.mismatch")]
				}),
				integrityStatus === "corrupt" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "project-status-chip",
					"data-tone": "error",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { "aria-hidden": "true" }), t("status.corrupt")]
				}),
				updatedAt && saveStatus === "saved" && !dirty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t("status.savedAt", { time: new Date(updatedAt).toLocaleTimeString() }) })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "project-status-actions",
			children: [undoLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onUndo,
				children: t("status.undo", { label: undoLabel })
			}), hasRecovery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "restore-project",
				onClick: onRestore,
				children: t("status.restore")
			})]
		})]
	});
}
//#endregion
//#region app/components/section-tree.tsx
function SectionTree({ nodes, selected, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: nodes.map((node) => {
		const key = sectionKey(node.path);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "section-branch",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				"aria-pressed": selected === key,
				className: selected === key ? "active" : "",
				onClick: () => onSelect(node.path),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: node.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: node.change_count })]
			}), !!node.children?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "section-children",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTree, {
					nodes: node.children,
					selected,
					onSelect
				})
			})]
		}, node.section_id);
	}) });
}
//#endregion
//#region app/components/review-queue.tsx
var changeTypes = [
	"added",
	"removed",
	"modified",
	"split",
	"merged",
	"moved",
	"format_only"
];
function activeFilterCount(filters) {
	return [
		filters.query,
		filters.confidence !== "all",
		filters.changeType !== "all",
		filters.sectionFilter,
		filters.breakingOnly,
		filters.unreviewedOnly,
		filters.hideFormatOnly
	].filter(Boolean).length;
}
function ReviewQueue({ report, changes, filters, selectedId, batchIds, decisions, savedViews, mobileActive, onFilterChange, onResetFilters, onApplyFilters, onSaveView, onApplyView, onDeleteView, onSelect, onToggleBatch, onSelectVisible, onClearSelection, onBatchDecision }) {
	const { t } = useI18n();
	const [viewName, setViewName] = (0, import_react.useState)("");
	const [selectedViewId, setSelectedViewId] = (0, import_react.useState)("");
	const count = activeFilterCount(filters);
	const queueReviewed = changes.filter((change) => normalizeState(decisions[change.fingerprint]?.state ?? change.review?.state) !== "unreviewed").length;
	const chips = [];
	if (filters.query) chips.push({
		key: "query",
		label: `“${filters.query}”`,
		reset: ""
	});
	if (filters.confidence !== "all") chips.push({
		key: "confidence",
		label: `${t("queue.confidence")}: ${t(`confidence.${filters.confidence}`)}`,
		reset: "all"
	});
	if (filters.changeType !== "all") chips.push({
		key: "changeType",
		label: `${t("queue.type")}: ${filters.changeType}`,
		reset: "all"
	});
	if (filters.sectionFilter) chips.push({
		key: "sectionFilter",
		label: `${t("queue.chapter")}: ${filters.sectionFilter.split("").at(-1)}`,
		reset: ""
	});
	if (filters.breakingOnly) chips.push({
		key: "breakingOnly",
		label: t("queue.breakingOnly"),
		reset: false
	});
	if (filters.unreviewedOnly) chips.push({
		key: "unreviewedOnly",
		label: t("queue.unreviewedOnly"),
		reset: false
	});
	if (filters.hideFormatOnly) chips.push({
		key: "hideFormatOnly",
		label: t("queue.hideFormat"),
		reset: false
	});
	function applyQuickView(kind) {
		onApplyFilters({
			...filters,
			query: "",
			confidence: kind === "breaking" ? "high" : "low",
			changeType: "all",
			sectionFilter: "",
			breakingOnly: kind === "breaking",
			unreviewedOnly: kind === "low",
			hideFormatOnly: false,
			sortBy: kind === "breaking" ? "risk" : "unreviewed"
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "workspace-pane queue-pane",
		id: "mobile-panel-queue",
		role: "tabpanel",
		"aria-labelledby": "mobile-tab-queue",
		"data-mobile-active": mobileActive,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pane-heading queue-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("queue.title") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("queue.visible", { count: changes.length }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t("queue.progress", {
						reviewed: queueReviewed,
						total: changes.length
					}) })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: report.summary.total_changes })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "queue-mode",
				role: "group",
				"aria-label": t("queue.sort"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-pressed": filters.sortBy === "document",
					onClick: () => onFilterChange("sortBy", "document"),
					children: t("queue.documentMode")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-pressed": filters.sortBy === "risk",
					onClick: () => onFilterChange("sortBy", "risk"),
					children: t("queue.riskMode")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "queue-search",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewerIcon, { name: "search" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: t("queue.search")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: filters.query,
						onChange: (event) => onFilterChange("query", event.target.value),
						placeholder: t("queue.searchPlaceholder")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "queue-sort",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("queue.sort") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: filters.sortBy,
					onChange: (event) => onFilterChange("sortBy", event.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "document",
							children: t("queue.sort.document")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "risk",
							children: t("queue.sort.risk")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "unreviewed",
							children: t("queue.sort.unreviewed")
						})
					]
				})]
			}),
			chips.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "active-filter-bar",
				"aria-label": t("queue.activeFilters"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: chips.map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					title: t("queue.removeFilter", { label: chip.label }),
					onClick: () => onFilterChange(chip.key, chip.reset),
					children: [chip.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: "×"
					})]
				}, chip.key)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "clear-all-filters",
					onClick: onResetFilters,
					children: t("queue.clearAll")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "queue-controls",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("queue.filtersBatch") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: count ? t("queue.activeCount", { count }) : t("queue.allChanges") })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "queue-controls-body",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: t("queue.confidence") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "segment",
							children: [
								"all",
								"high",
								"medium",
								"low"
							].map((level) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": filters.confidence === level,
								className: filters.confidence === level ? "active" : "",
								onClick: () => onFilterChange("confidence", level),
								children: t(`confidence.${level}`)
							}, level))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "select-filter",
							children: [t("queue.type"), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.changeType,
								onChange: (event) => onFilterChange("changeType", event.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: t("queue.all")
								}), changeTypes.map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: type }, type))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "queue-checks",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: filters.breakingOnly,
									onChange: (event) => onFilterChange("breakingOnly", event.target.checked)
								}), t("queue.breakingOnly")] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: filters.unreviewedOnly,
									onChange: (event) => onFilterChange("unreviewedOnly", event.target.checked)
								}), t("queue.unreviewedOnly")] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: filters.hideFormatOnly,
									onChange: (event) => onFilterChange("hideFormatOnly", event.target.checked)
								}), t("queue.hideFormat")] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							className: "chapter-filter",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: t("queue.chapter") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "section-list",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: !filters.sectionFilter ? "active" : "",
									"aria-pressed": !filters.sectionFilter,
									onClick: () => onFilterChange("sectionFilter", ""),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("queue.allChapters") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: report.summary.total_changes })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTree, {
									nodes: report.section_tree ?? [],
									selected: filters.sectionFilter,
									onSelect: (path) => onFilterChange("sectionFilter", sectionKey(path))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "reset-filters",
							onClick: onResetFilters,
							children: t("queue.clearAll")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "saved-views",
							"aria-label": t("queue.savedViews"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "saved-view-heading",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("queue.savedViews") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "quick-views",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => applyQuickView("breaking"),
											children: "High-confidence Breaking"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => applyQuickView("low"),
											children: "Low-confidence review"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("queue.viewName") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: viewName,
									maxLength: 40,
									placeholder: t("queue.viewPlaceholder"),
									onChange: (event) => setViewName(event.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "button button-secondary",
									onClick: () => {
										if (onSaveView(viewName)) setViewName("");
									},
									children: t("queue.saveView")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t("queue.duplicateView") }),
								savedViews.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "saved-view-apply",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("queue.applyView") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: selectedViewId,
											onChange: (event) => setSelectedViewId(event.target.value),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: t("queue.chooseView")
											}), savedViews.map((view) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: view.id,
												children: view.name
											}, view.id))]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											disabled: !selectedViewId,
											onClick: () => onApplyView(selectedViewId),
											children: t("queue.applyView")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "menu-danger",
											disabled: !selectedViewId,
											onClick: () => onDeleteView(selectedViewId),
											children: t("queue.deleteView")
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t("queue.noViews") })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "batch-actions",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("queue.selection", {
									selected: batchIds.length,
									visible: changes.length
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("queue.batchScope") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "button button-secondary",
									onClick: onSelectVisible,
									children: t("queue.selectVisible")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "button button-secondary",
									onClick: onClearSelection,
									children: t("queue.clearSelection")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "button button-secondary",
									onClick: () => onBatchDecision("confirmed"),
									children: t("queue.confirmSelected")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "button button-secondary",
									onClick: () => onBatchDecision("rejected"),
									children: t("queue.rejectSelected")
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeList, {
				changes,
				selectedId,
				batchIds,
				decisions,
				onSelect,
				onToggleBatch
			})
		]
	});
}
//#endregion
//#region app/components/review-summary.tsx
function SummaryMetric({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "summary-metric",
		"data-tone": tone,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: value }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
	});
}
function ReviewSummary({ report, warnings, reviewedCount, lowConfidenceCount, mappingConflicts, queueTotal, queueReviewed }) {
	const { t } = useI18n();
	const total = report.summary.total_changes;
	const unreviewed = Math.max(0, total - reviewedCount);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "review-summary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "summary-metrics",
			"aria-label": t("summary.aria"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryMetric, {
					label: t("summary.breaking"),
					value: report.summary.breaking_findings,
					tone: "danger"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryMetric, {
					label: t("summary.unreviewed"),
					value: unreviewed,
					tone: "neutral"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryMetric, {
					label: t("summary.lowConfidence"),
					value: lowConfidenceCount,
					tone: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryMetric, {
					label: t("summary.conflicts"),
					value: mappingConflicts,
					tone: "conflict"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryMetric, {
					label: t("summary.queueProgress"),
					value: `${queueReviewed}/${queueTotal}`,
					tone: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryMetric, {
					label: t("summary.reportProgress"),
					value: `${reviewedCount}/${total}`,
					tone: "success"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "summary-toggle",
			children: [warnings.length ? t("summary.warnings", { count: warnings.length }) : t("summary.noWarnings"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				children: "⌄"
			})]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "summary-expanded",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("summary.audit") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("summary.schema", { version: report.schema_version }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: new Date(report.generated_at).toLocaleString() })
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "quality-summary",
				role: warnings.length ? "alert" : "status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("summary.quality") }), warnings.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: warnings.map((warning) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: warning }, warning)) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("summary.qualityClear") })]
			})]
		})]
	});
}
//#endregion
//#region node_modules/ajv/dist/compile/codegen/code.js
var require_code$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
	var _CodeOrName = class {};
	exports._CodeOrName = _CodeOrName;
	exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
	var Name = class extends _CodeOrName {
		constructor(s) {
			super();
			if (!exports.IDENTIFIER.test(s)) throw new Error("CodeGen: name must be a valid identifier");
			this.str = s;
		}
		toString() {
			return this.str;
		}
		emptyStr() {
			return false;
		}
		get names() {
			return { [this.str]: 1 };
		}
	};
	exports.Name = Name;
	var _Code = class extends _CodeOrName {
		constructor(code) {
			super();
			this._items = typeof code === "string" ? [code] : code;
		}
		toString() {
			return this.str;
		}
		emptyStr() {
			if (this._items.length > 1) return false;
			const item = this._items[0];
			return item === "" || item === "\"\"";
		}
		get str() {
			var _a;
			return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
		}
		get names() {
			var _a;
			return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
				if (c instanceof Name) names[c.str] = (names[c.str] || 0) + 1;
				return names;
			}, {});
		}
	};
	exports._Code = _Code;
	exports.nil = new _Code("");
	function _(strs, ...args) {
		const code = [strs[0]];
		let i = 0;
		while (i < args.length) {
			addCodeArg(code, args[i]);
			code.push(strs[++i]);
		}
		return new _Code(code);
	}
	exports._ = _;
	var plus = new _Code("+");
	function str(strs, ...args) {
		const expr = [safeStringify(strs[0])];
		let i = 0;
		while (i < args.length) {
			expr.push(plus);
			addCodeArg(expr, args[i]);
			expr.push(plus, safeStringify(strs[++i]));
		}
		optimize(expr);
		return new _Code(expr);
	}
	exports.str = str;
	function addCodeArg(code, arg) {
		if (arg instanceof _Code) code.push(...arg._items);
		else if (arg instanceof Name) code.push(arg);
		else code.push(interpolate(arg));
	}
	exports.addCodeArg = addCodeArg;
	function optimize(expr) {
		let i = 1;
		while (i < expr.length - 1) {
			if (expr[i] === plus) {
				const res = mergeExprItems(expr[i - 1], expr[i + 1]);
				if (res !== void 0) {
					expr.splice(i - 1, 3, res);
					continue;
				}
				expr[i++] = "+";
			}
			i++;
		}
	}
	function mergeExprItems(a, b) {
		if (b === "\"\"") return a;
		if (a === "\"\"") return b;
		if (typeof a == "string") {
			if (b instanceof Name || a[a.length - 1] !== "\"") return;
			if (typeof b != "string") return `${a.slice(0, -1)}${b}"`;
			if (b[0] === "\"") return a.slice(0, -1) + b.slice(1);
			return;
		}
		if (typeof b == "string" && b[0] === "\"" && !(a instanceof Name)) return `"${a}${b.slice(1)}`;
	}
	function strConcat(c1, c2) {
		return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
	}
	exports.strConcat = strConcat;
	function interpolate(x) {
		return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
	}
	function stringify(x) {
		return new _Code(safeStringify(x));
	}
	exports.stringify = stringify;
	function safeStringify(x) {
		return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
	}
	exports.safeStringify = safeStringify;
	function getProperty(key) {
		return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
	}
	exports.getProperty = getProperty;
	function getEsmExportName(key) {
		if (typeof key == "string" && exports.IDENTIFIER.test(key)) return new _Code(`${key}`);
		throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
	}
	exports.getEsmExportName = getEsmExportName;
	function regexpCode(rx) {
		return new _Code(rx.toString());
	}
	exports.regexpCode = regexpCode;
}));
//#endregion
//#region node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
	var code_1 = require_code$1();
	var ValueError = class extends Error {
		constructor(name) {
			super(`CodeGen: "code" for ${name} not defined`);
			this.value = name.value;
		}
	};
	var UsedValueState;
	(function(UsedValueState) {
		UsedValueState[UsedValueState["Started"] = 0] = "Started";
		UsedValueState[UsedValueState["Completed"] = 1] = "Completed";
	})(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
	exports.varKinds = {
		const: new code_1.Name("const"),
		let: new code_1.Name("let"),
		var: new code_1.Name("var")
	};
	var Scope = class {
		constructor({ prefixes, parent } = {}) {
			this._names = {};
			this._prefixes = prefixes;
			this._parent = parent;
		}
		toName(nameOrPrefix) {
			return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
		}
		name(prefix) {
			return new code_1.Name(this._newName(prefix));
		}
		_newName(prefix) {
			const ng = this._names[prefix] || this._nameGroup(prefix);
			return `${prefix}${ng.index++}`;
		}
		_nameGroup(prefix) {
			var _a, _b;
			if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
			return this._names[prefix] = {
				prefix,
				index: 0
			};
		}
	};
	exports.Scope = Scope;
	var ValueScopeName = class extends code_1.Name {
		constructor(prefix, nameStr) {
			super(nameStr);
			this.prefix = prefix;
		}
		setValue(value, { property, itemIndex }) {
			this.value = value;
			this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
		}
	};
	exports.ValueScopeName = ValueScopeName;
	var line = (0, code_1._)`\n`;
	var ValueScope = class extends Scope {
		constructor(opts) {
			super(opts);
			this._values = {};
			this._scope = opts.scope;
			this.opts = {
				...opts,
				_n: opts.lines ? line : code_1.nil
			};
		}
		get() {
			return this._scope;
		}
		name(prefix) {
			return new ValueScopeName(prefix, this._newName(prefix));
		}
		value(nameOrPrefix, value) {
			var _a;
			if (value.ref === void 0) throw new Error("CodeGen: ref must be passed in value");
			const name = this.toName(nameOrPrefix);
			const { prefix } = name;
			const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
			let vs = this._values[prefix];
			if (vs) {
				const _name = vs.get(valueKey);
				if (_name) return _name;
			} else vs = this._values[prefix] = /* @__PURE__ */ new Map();
			vs.set(valueKey, name);
			const s = this._scope[prefix] || (this._scope[prefix] = []);
			const itemIndex = s.length;
			s[itemIndex] = value.ref;
			name.setValue(value, {
				property: prefix,
				itemIndex
			});
			return name;
		}
		getValue(prefix, keyOrRef) {
			const vs = this._values[prefix];
			if (!vs) return;
			return vs.get(keyOrRef);
		}
		scopeRefs(scopeName, values = this._values) {
			return this._reduceValues(values, (name) => {
				if (name.scopePath === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
				return (0, code_1._)`${scopeName}${name.scopePath}`;
			});
		}
		scopeCode(values = this._values, usedValues, getCode) {
			return this._reduceValues(values, (name) => {
				if (name.value === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
				return name.value.code;
			}, usedValues, getCode);
		}
		_reduceValues(values, valueCode, usedValues = {}, getCode) {
			let code = code_1.nil;
			for (const prefix in values) {
				const vs = values[prefix];
				if (!vs) continue;
				const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
				vs.forEach((name) => {
					if (nameSet.has(name)) return;
					nameSet.set(name, UsedValueState.Started);
					let c = valueCode(name);
					if (c) {
						const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
						code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
					} else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) code = (0, code_1._)`${code}${c}${this.opts._n}`;
					else throw new ValueError(name);
					nameSet.set(name, UsedValueState.Completed);
				});
			}
			return code;
		}
	};
	exports.ValueScope = ValueScope;
}));
//#endregion
//#region node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
	var code_1 = require_code$1();
	var scope_1 = require_scope();
	var code_2 = require_code$1();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return code_2._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return code_2.str;
		}
	});
	Object.defineProperty(exports, "strConcat", {
		enumerable: true,
		get: function() {
			return code_2.strConcat;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return code_2.nil;
		}
	});
	Object.defineProperty(exports, "getProperty", {
		enumerable: true,
		get: function() {
			return code_2.getProperty;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return code_2.stringify;
		}
	});
	Object.defineProperty(exports, "regexpCode", {
		enumerable: true,
		get: function() {
			return code_2.regexpCode;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return code_2.Name;
		}
	});
	var scope_2 = require_scope();
	Object.defineProperty(exports, "Scope", {
		enumerable: true,
		get: function() {
			return scope_2.Scope;
		}
	});
	Object.defineProperty(exports, "ValueScope", {
		enumerable: true,
		get: function() {
			return scope_2.ValueScope;
		}
	});
	Object.defineProperty(exports, "ValueScopeName", {
		enumerable: true,
		get: function() {
			return scope_2.ValueScopeName;
		}
	});
	Object.defineProperty(exports, "varKinds", {
		enumerable: true,
		get: function() {
			return scope_2.varKinds;
		}
	});
	exports.operators = {
		GT: new code_1._Code(">"),
		GTE: new code_1._Code(">="),
		LT: new code_1._Code("<"),
		LTE: new code_1._Code("<="),
		EQ: new code_1._Code("==="),
		NEQ: new code_1._Code("!=="),
		NOT: new code_1._Code("!"),
		OR: new code_1._Code("||"),
		AND: new code_1._Code("&&"),
		ADD: new code_1._Code("+")
	};
	var Node = class {
		optimizeNodes() {
			return this;
		}
		optimizeNames(_names, _constants) {
			return this;
		}
	};
	var Def = class extends Node {
		constructor(varKind, name, rhs) {
			super();
			this.varKind = varKind;
			this.name = name;
			this.rhs = rhs;
		}
		render({ es5, _n }) {
			const varKind = es5 ? scope_1.varKinds.var : this.varKind;
			const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
			return `${varKind} ${this.name}${rhs};` + _n;
		}
		optimizeNames(names, constants) {
			if (!names[this.name.str]) return;
			if (this.rhs) this.rhs = optimizeExpr(this.rhs, names, constants);
			return this;
		}
		get names() {
			return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
		}
	};
	var Assign = class extends Node {
		constructor(lhs, rhs, sideEffects) {
			super();
			this.lhs = lhs;
			this.rhs = rhs;
			this.sideEffects = sideEffects;
		}
		render({ _n }) {
			return `${this.lhs} = ${this.rhs};` + _n;
		}
		optimizeNames(names, constants) {
			if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects) return;
			this.rhs = optimizeExpr(this.rhs, names, constants);
			return this;
		}
		get names() {
			return addExprNames(this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names }, this.rhs);
		}
	};
	var AssignOp = class extends Assign {
		constructor(lhs, op, rhs, sideEffects) {
			super(lhs, rhs, sideEffects);
			this.op = op;
		}
		render({ _n }) {
			return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
		}
	};
	var Label = class extends Node {
		constructor(label) {
			super();
			this.label = label;
			this.names = {};
		}
		render({ _n }) {
			return `${this.label}:` + _n;
		}
	};
	var Break = class extends Node {
		constructor(label) {
			super();
			this.label = label;
			this.names = {};
		}
		render({ _n }) {
			return `break${this.label ? ` ${this.label}` : ""};` + _n;
		}
	};
	var Throw = class extends Node {
		constructor(error) {
			super();
			this.error = error;
		}
		render({ _n }) {
			return `throw ${this.error};` + _n;
		}
		get names() {
			return this.error.names;
		}
	};
	var AnyCode = class extends Node {
		constructor(code) {
			super();
			this.code = code;
		}
		render({ _n }) {
			return `${this.code};` + _n;
		}
		optimizeNodes() {
			return `${this.code}` ? this : void 0;
		}
		optimizeNames(names, constants) {
			this.code = optimizeExpr(this.code, names, constants);
			return this;
		}
		get names() {
			return this.code instanceof code_1._CodeOrName ? this.code.names : {};
		}
	};
	var ParentNode = class extends Node {
		constructor(nodes = []) {
			super();
			this.nodes = nodes;
		}
		render(opts) {
			return this.nodes.reduce((code, n) => code + n.render(opts), "");
		}
		optimizeNodes() {
			const { nodes } = this;
			let i = nodes.length;
			while (i--) {
				const n = nodes[i].optimizeNodes();
				if (Array.isArray(n)) nodes.splice(i, 1, ...n);
				else if (n) nodes[i] = n;
				else nodes.splice(i, 1);
			}
			return nodes.length > 0 ? this : void 0;
		}
		optimizeNames(names, constants) {
			const { nodes } = this;
			let i = nodes.length;
			while (i--) {
				const n = nodes[i];
				if (n.optimizeNames(names, constants)) continue;
				subtractNames(names, n.names);
				nodes.splice(i, 1);
			}
			return nodes.length > 0 ? this : void 0;
		}
		get names() {
			return this.nodes.reduce((names, n) => addNames(names, n.names), {});
		}
	};
	var BlockNode = class extends ParentNode {
		render(opts) {
			return "{" + opts._n + super.render(opts) + "}" + opts._n;
		}
	};
	var Root = class extends ParentNode {};
	var Else = class extends BlockNode {};
	Else.kind = "else";
	var If = class If extends BlockNode {
		constructor(condition, nodes) {
			super(nodes);
			this.condition = condition;
		}
		render(opts) {
			let code = `if(${this.condition})` + super.render(opts);
			if (this.else) code += "else " + this.else.render(opts);
			return code;
		}
		optimizeNodes() {
			super.optimizeNodes();
			const cond = this.condition;
			if (cond === true) return this.nodes;
			let e = this.else;
			if (e) {
				const ns = e.optimizeNodes();
				e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
			}
			if (e) {
				if (cond === false) return e instanceof If ? e : e.nodes;
				if (this.nodes.length) return this;
				return new If(not(cond), e instanceof If ? [e] : e.nodes);
			}
			if (cond === false || !this.nodes.length) return void 0;
			return this;
		}
		optimizeNames(names, constants) {
			var _a;
			this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
			if (!(super.optimizeNames(names, constants) || this.else)) return;
			this.condition = optimizeExpr(this.condition, names, constants);
			return this;
		}
		get names() {
			const names = super.names;
			addExprNames(names, this.condition);
			if (this.else) addNames(names, this.else.names);
			return names;
		}
	};
	If.kind = "if";
	var For = class extends BlockNode {};
	For.kind = "for";
	var ForLoop = class extends For {
		constructor(iteration) {
			super();
			this.iteration = iteration;
		}
		render(opts) {
			return `for(${this.iteration})` + super.render(opts);
		}
		optimizeNames(names, constants) {
			if (!super.optimizeNames(names, constants)) return;
			this.iteration = optimizeExpr(this.iteration, names, constants);
			return this;
		}
		get names() {
			return addNames(super.names, this.iteration.names);
		}
	};
	var ForRange = class extends For {
		constructor(varKind, name, from, to) {
			super();
			this.varKind = varKind;
			this.name = name;
			this.from = from;
			this.to = to;
		}
		render(opts) {
			const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
			const { name, from, to } = this;
			return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
		}
		get names() {
			return addExprNames(addExprNames(super.names, this.from), this.to);
		}
	};
	var ForIter = class extends For {
		constructor(loop, varKind, name, iterable) {
			super();
			this.loop = loop;
			this.varKind = varKind;
			this.name = name;
			this.iterable = iterable;
		}
		render(opts) {
			return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
		}
		optimizeNames(names, constants) {
			if (!super.optimizeNames(names, constants)) return;
			this.iterable = optimizeExpr(this.iterable, names, constants);
			return this;
		}
		get names() {
			return addNames(super.names, this.iterable.names);
		}
	};
	var Func = class extends BlockNode {
		constructor(name, args, async) {
			super();
			this.name = name;
			this.args = args;
			this.async = async;
		}
		render(opts) {
			return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(opts);
		}
	};
	Func.kind = "func";
	var Return = class extends ParentNode {
		render(opts) {
			return "return " + super.render(opts);
		}
	};
	Return.kind = "return";
	var Try = class extends BlockNode {
		render(opts) {
			let code = "try" + super.render(opts);
			if (this.catch) code += this.catch.render(opts);
			if (this.finally) code += this.finally.render(opts);
			return code;
		}
		optimizeNodes() {
			var _a, _b;
			super.optimizeNodes();
			(_a = this.catch) === null || _a === void 0 || _a.optimizeNodes();
			(_b = this.finally) === null || _b === void 0 || _b.optimizeNodes();
			return this;
		}
		optimizeNames(names, constants) {
			var _a, _b;
			super.optimizeNames(names, constants);
			(_a = this.catch) === null || _a === void 0 || _a.optimizeNames(names, constants);
			(_b = this.finally) === null || _b === void 0 || _b.optimizeNames(names, constants);
			return this;
		}
		get names() {
			const names = super.names;
			if (this.catch) addNames(names, this.catch.names);
			if (this.finally) addNames(names, this.finally.names);
			return names;
		}
	};
	var Catch = class extends BlockNode {
		constructor(error) {
			super();
			this.error = error;
		}
		render(opts) {
			return `catch(${this.error})` + super.render(opts);
		}
	};
	Catch.kind = "catch";
	var Finally = class extends BlockNode {
		render(opts) {
			return "finally" + super.render(opts);
		}
	};
	Finally.kind = "finally";
	var CodeGen = class {
		constructor(extScope, opts = {}) {
			this._values = {};
			this._blockStarts = [];
			this._constants = {};
			this.opts = {
				...opts,
				_n: opts.lines ? "\n" : ""
			};
			this._extScope = extScope;
			this._scope = new scope_1.Scope({ parent: extScope });
			this._nodes = [new Root()];
		}
		toString() {
			return this._root.render(this.opts);
		}
		name(prefix) {
			return this._scope.name(prefix);
		}
		scopeName(prefix) {
			return this._extScope.name(prefix);
		}
		scopeValue(prefixOrName, value) {
			const name = this._extScope.value(prefixOrName, value);
			(this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set())).add(name);
			return name;
		}
		getScopeValue(prefix, keyOrRef) {
			return this._extScope.getValue(prefix, keyOrRef);
		}
		scopeRefs(scopeName) {
			return this._extScope.scopeRefs(scopeName, this._values);
		}
		scopeCode() {
			return this._extScope.scopeCode(this._values);
		}
		_def(varKind, nameOrPrefix, rhs, constant) {
			const name = this._scope.toName(nameOrPrefix);
			if (rhs !== void 0 && constant) this._constants[name.str] = rhs;
			this._leafNode(new Def(varKind, name, rhs));
			return name;
		}
		const(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
		}
		let(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
		}
		var(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
		}
		assign(lhs, rhs, sideEffects) {
			return this._leafNode(new Assign(lhs, rhs, sideEffects));
		}
		add(lhs, rhs) {
			return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
		}
		code(c) {
			if (typeof c == "function") c();
			else if (c !== code_1.nil) this._leafNode(new AnyCode(c));
			return this;
		}
		object(...keyValues) {
			const code = ["{"];
			for (const [key, value] of keyValues) {
				if (code.length > 1) code.push(",");
				code.push(key);
				if (key !== value || this.opts.es5) {
					code.push(":");
					(0, code_1.addCodeArg)(code, value);
				}
			}
			code.push("}");
			return new code_1._Code(code);
		}
		if(condition, thenBody, elseBody) {
			this._blockNode(new If(condition));
			if (thenBody && elseBody) this.code(thenBody).else().code(elseBody).endIf();
			else if (thenBody) this.code(thenBody).endIf();
			else if (elseBody) throw new Error("CodeGen: \"else\" body without \"then\" body");
			return this;
		}
		elseIf(condition) {
			return this._elseNode(new If(condition));
		}
		else() {
			return this._elseNode(new Else());
		}
		endIf() {
			return this._endBlockNode(If, Else);
		}
		_for(node, forBody) {
			this._blockNode(node);
			if (forBody) this.code(forBody).endFor();
			return this;
		}
		for(iteration, forBody) {
			return this._for(new ForLoop(iteration), forBody);
		}
		forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
			const name = this._scope.toName(nameOrPrefix);
			return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
		}
		forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
			const name = this._scope.toName(nameOrPrefix);
			if (this.opts.es5) {
				const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
				return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
					this.var(name, (0, code_1._)`${arr}[${i}]`);
					forBody(name);
				});
			}
			return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
		}
		forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
			if (this.opts.ownProperties) return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
			const name = this._scope.toName(nameOrPrefix);
			return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
		}
		endFor() {
			return this._endBlockNode(For);
		}
		label(label) {
			return this._leafNode(new Label(label));
		}
		break(label) {
			return this._leafNode(new Break(label));
		}
		return(value) {
			const node = new Return();
			this._blockNode(node);
			this.code(value);
			if (node.nodes.length !== 1) throw new Error("CodeGen: \"return\" should have one node");
			return this._endBlockNode(Return);
		}
		try(tryBody, catchCode, finallyCode) {
			if (!catchCode && !finallyCode) throw new Error("CodeGen: \"try\" without \"catch\" and \"finally\"");
			const node = new Try();
			this._blockNode(node);
			this.code(tryBody);
			if (catchCode) {
				const error = this.name("e");
				this._currNode = node.catch = new Catch(error);
				catchCode(error);
			}
			if (finallyCode) {
				this._currNode = node.finally = new Finally();
				this.code(finallyCode);
			}
			return this._endBlockNode(Catch, Finally);
		}
		throw(error) {
			return this._leafNode(new Throw(error));
		}
		block(body, nodeCount) {
			this._blockStarts.push(this._nodes.length);
			if (body) this.code(body).endBlock(nodeCount);
			return this;
		}
		endBlock(nodeCount) {
			const len = this._blockStarts.pop();
			if (len === void 0) throw new Error("CodeGen: not in self-balancing block");
			const toClose = this._nodes.length - len;
			if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
			this._nodes.length = len;
			return this;
		}
		func(name, args = code_1.nil, async, funcBody) {
			this._blockNode(new Func(name, args, async));
			if (funcBody) this.code(funcBody).endFunc();
			return this;
		}
		endFunc() {
			return this._endBlockNode(Func);
		}
		optimize(n = 1) {
			while (n-- > 0) {
				this._root.optimizeNodes();
				this._root.optimizeNames(this._root.names, this._constants);
			}
		}
		_leafNode(node) {
			this._currNode.nodes.push(node);
			return this;
		}
		_blockNode(node) {
			this._currNode.nodes.push(node);
			this._nodes.push(node);
		}
		_endBlockNode(N1, N2) {
			const n = this._currNode;
			if (n instanceof N1 || N2 && n instanceof N2) {
				this._nodes.pop();
				return this;
			}
			throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
		}
		_elseNode(node) {
			const n = this._currNode;
			if (!(n instanceof If)) throw new Error("CodeGen: \"else\" without \"if\"");
			this._currNode = n.else = node;
			return this;
		}
		get _root() {
			return this._nodes[0];
		}
		get _currNode() {
			const ns = this._nodes;
			return ns[ns.length - 1];
		}
		set _currNode(node) {
			const ns = this._nodes;
			ns[ns.length - 1] = node;
		}
	};
	exports.CodeGen = CodeGen;
	function addNames(names, from) {
		for (const n in from) names[n] = (names[n] || 0) + (from[n] || 0);
		return names;
	}
	function addExprNames(names, from) {
		return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
	}
	function optimizeExpr(expr, names, constants) {
		if (expr instanceof code_1.Name) return replaceName(expr);
		if (!canOptimize(expr)) return expr;
		return new code_1._Code(expr._items.reduce((items, c) => {
			if (c instanceof code_1.Name) c = replaceName(c);
			if (c instanceof code_1._Code) items.push(...c._items);
			else items.push(c);
			return items;
		}, []));
		function replaceName(n) {
			const c = constants[n.str];
			if (c === void 0 || names[n.str] !== 1) return n;
			delete names[n.str];
			return c;
		}
		function canOptimize(e) {
			return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
		}
	}
	function subtractNames(names, from) {
		for (const n in from) names[n] = (names[n] || 0) - (from[n] || 0);
	}
	function not(x) {
		return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
	}
	exports.not = not;
	var andCode = mappend(exports.operators.AND);
	function and(...args) {
		return args.reduce(andCode);
	}
	exports.and = and;
	var orCode = mappend(exports.operators.OR);
	function or(...args) {
		return args.reduce(orCode);
	}
	exports.or = or;
	function mappend(op) {
		return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
	}
	function par(x) {
		return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
	var codegen_1 = require_codegen();
	var code_1 = require_code$1();
	function toHash(arr) {
		const hash = {};
		for (const item of arr) hash[item] = true;
		return hash;
	}
	exports.toHash = toHash;
	function alwaysValidSchema(it, schema) {
		if (typeof schema == "boolean") return schema;
		if (Object.keys(schema).length === 0) return true;
		checkUnknownRules(it, schema);
		return !schemaHasRules(schema, it.self.RULES.all);
	}
	exports.alwaysValidSchema = alwaysValidSchema;
	function checkUnknownRules(it, schema = it.schema) {
		const { opts, self } = it;
		if (!opts.strictSchema) return;
		if (typeof schema === "boolean") return;
		const rules = self.RULES.keywords;
		for (const key in schema) if (!rules[key]) checkStrictMode(it, `unknown keyword: "${key}"`);
	}
	exports.checkUnknownRules = checkUnknownRules;
	function schemaHasRules(schema, rules) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (rules[key]) return true;
		return false;
	}
	exports.schemaHasRules = schemaHasRules;
	function schemaHasRulesButRef(schema, RULES) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (key !== "$ref" && RULES.all[key]) return true;
		return false;
	}
	exports.schemaHasRulesButRef = schemaHasRulesButRef;
	function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
		if (!$data) {
			if (typeof schema == "number" || typeof schema == "boolean") return schema;
			if (typeof schema == "string") return (0, codegen_1._)`${schema}`;
		}
		return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
	}
	exports.schemaRefOrVal = schemaRefOrVal;
	function unescapeFragment(str) {
		return unescapeJsonPointer(decodeURIComponent(str));
	}
	exports.unescapeFragment = unescapeFragment;
	function escapeFragment(str) {
		return encodeURIComponent(escapeJsonPointer(str));
	}
	exports.escapeFragment = escapeFragment;
	function escapeJsonPointer(str) {
		if (typeof str == "number") return `${str}`;
		return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
	exports.escapeJsonPointer = escapeJsonPointer;
	function unescapeJsonPointer(str) {
		return str.replace(/~1/g, "/").replace(/~0/g, "~");
	}
	exports.unescapeJsonPointer = unescapeJsonPointer;
	function eachItem(xs, f) {
		if (Array.isArray(xs)) for (const x of xs) f(x);
		else f(xs);
	}
	exports.eachItem = eachItem;
	function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
		return (gen, from, to, toName) => {
			const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
			return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
		};
	}
	exports.mergeEvaluated = {
		props: makeMergeEvaluated({
			mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
				gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
			}),
			mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
				if (from === true) gen.assign(to, true);
				else {
					gen.assign(to, (0, codegen_1._)`${to} || {}`);
					setEvaluated(gen, to, from);
				}
			}),
			mergeValues: (from, to) => from === true ? true : {
				...from,
				...to
			},
			resultToName: evaluatedPropsToName
		}),
		items: makeMergeEvaluated({
			mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
			mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
			mergeValues: (from, to) => from === true ? true : Math.max(from, to),
			resultToName: (gen, items) => gen.var("items", items)
		})
	};
	function evaluatedPropsToName(gen, ps) {
		if (ps === true) return gen.var("props", true);
		const props = gen.var("props", (0, codegen_1._)`{}`);
		if (ps !== void 0) setEvaluated(gen, props, ps);
		return props;
	}
	exports.evaluatedPropsToName = evaluatedPropsToName;
	function setEvaluated(gen, props, ps) {
		Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
	}
	exports.setEvaluated = setEvaluated;
	var snippets = {};
	function useFunc(gen, f) {
		return gen.scopeValue("func", {
			ref: f,
			code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
		});
	}
	exports.useFunc = useFunc;
	var Type;
	(function(Type) {
		Type[Type["Num"] = 0] = "Num";
		Type[Type["Str"] = 1] = "Str";
	})(Type || (exports.Type = Type = {}));
	function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
		if (dataProp instanceof codegen_1.Name) {
			const isNumber = dataPropType === Type.Num;
			return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
		}
		return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
	}
	exports.getErrorPath = getErrorPath;
	function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
		if (!mode) return;
		msg = `strict mode: ${msg}`;
		if (mode === true) throw new Error(msg);
		it.self.logger.warn(msg);
	}
	exports.checkStrictMode = checkStrictMode;
}));
//#endregion
//#region node_modules/ajv/dist/compile/names.js
var require_names = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		data: new codegen_1.Name("data"),
		valCxt: new codegen_1.Name("valCxt"),
		instancePath: new codegen_1.Name("instancePath"),
		parentData: new codegen_1.Name("parentData"),
		parentDataProperty: new codegen_1.Name("parentDataProperty"),
		rootData: new codegen_1.Name("rootData"),
		dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
		vErrors: new codegen_1.Name("vErrors"),
		errors: new codegen_1.Name("errors"),
		this: new codegen_1.Name("this"),
		self: new codegen_1.Name("self"),
		scope: new codegen_1.Name("scope"),
		json: new codegen_1.Name("json"),
		jsonPos: new codegen_1.Name("jsonPos"),
		jsonLen: new codegen_1.Name("jsonLen"),
		jsonPart: new codegen_1.Name("jsonPart")
	};
}));
//#endregion
//#region node_modules/ajv/dist/compile/errors.js
var require_errors = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var names_1 = require_names();
	exports.keywordError = { message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation` };
	exports.keyword$DataError = { message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)` };
	function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
		const { it } = cxt;
		const { gen, compositeRule, allErrors } = it;
		const errObj = errorObjectCode(cxt, error, errorPaths);
		if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) addError(gen, errObj);
		else returnErrors(it, (0, codegen_1._)`[${errObj}]`);
	}
	exports.reportError = reportError;
	function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
		const { it } = cxt;
		const { gen, compositeRule, allErrors } = it;
		addError(gen, errorObjectCode(cxt, error, errorPaths));
		if (!(compositeRule || allErrors)) returnErrors(it, names_1.default.vErrors);
	}
	exports.reportExtraError = reportExtraError;
	function resetErrorsCount(gen, errsCount) {
		gen.assign(names_1.default.errors, errsCount);
		gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
	}
	exports.resetErrorsCount = resetErrorsCount;
	function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
		/* istanbul ignore if */
		if (errsCount === void 0) throw new Error("ajv implementation error");
		const err = gen.name("err");
		gen.forRange("i", errsCount, names_1.default.errors, (i) => {
			gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
			gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
			gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
			if (it.opts.verbose) {
				gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
				gen.assign((0, codegen_1._)`${err}.data`, data);
			}
		});
	}
	exports.extendErrors = extendErrors;
	function addError(gen, errObj) {
		const err = gen.const("err", errObj);
		gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
		gen.code((0, codegen_1._)`${names_1.default.errors}++`);
	}
	function returnErrors(it, errs) {
		const { gen, validateName, schemaEnv } = it;
		if (schemaEnv.$async) gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
			gen.return(false);
		}
	}
	var E = {
		keyword: new codegen_1.Name("keyword"),
		schemaPath: new codegen_1.Name("schemaPath"),
		params: new codegen_1.Name("params"),
		propertyName: new codegen_1.Name("propertyName"),
		message: new codegen_1.Name("message"),
		schema: new codegen_1.Name("schema"),
		parentSchema: new codegen_1.Name("parentSchema")
	};
	function errorObjectCode(cxt, error, errorPaths) {
		const { createErrors } = cxt.it;
		if (createErrors === false) return (0, codegen_1._)`{}`;
		return errorObject(cxt, error, errorPaths);
	}
	function errorObject(cxt, error, errorPaths = {}) {
		const { gen, it } = cxt;
		const keyValues = [errorInstancePath(it, errorPaths), errorSchemaPath(cxt, errorPaths)];
		extraErrorProps(cxt, error, keyValues);
		return gen.object(...keyValues);
	}
	function errorInstancePath({ errorPath }, { instancePath }) {
		const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
		return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
	}
	function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
		let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
		if (schemaPath) schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
		return [E.schemaPath, schPath];
	}
	function extraErrorProps(cxt, { params, message }, keyValues) {
		const { keyword, data, schemaValue, it } = cxt;
		const { opts, propertyName, topSchemaRef, schemaPath } = it;
		keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
		if (opts.messages) keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
		if (opts.verbose) keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
		if (propertyName) keyValues.push([E.propertyName, propertyName]);
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
	var errors_1 = require_errors();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var boolError = { message: "boolean schema is false" };
	function topBoolOrEmptySchema(it) {
		const { gen, schema, validateName } = it;
		if (schema === false) falseSchemaError(it, false);
		else if (typeof schema == "object" && schema.$async === true) gen.return(names_1.default.data);
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, null);
			gen.return(true);
		}
	}
	exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
	function boolOrEmptySchema(it, valid) {
		const { gen, schema } = it;
		if (schema === false) {
			gen.var(valid, false);
			falseSchemaError(it);
		} else gen.var(valid, true);
	}
	exports.boolOrEmptySchema = boolOrEmptySchema;
	function falseSchemaError(it, overrideAllErrors) {
		const { gen, data } = it;
		const cxt = {
			gen,
			keyword: "false schema",
			data,
			schema: false,
			schemaCode: false,
			schemaValue: false,
			params: {},
			it
		};
		(0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/rules.js
var require_rules = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getRules = exports.isJSONType = void 0;
	var jsonTypes = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null",
		"object",
		"array"
	]);
	function isJSONType(x) {
		return typeof x == "string" && jsonTypes.has(x);
	}
	exports.isJSONType = isJSONType;
	function getRules() {
		const groups = {
			number: {
				type: "number",
				rules: []
			},
			string: {
				type: "string",
				rules: []
			},
			array: {
				type: "array",
				rules: []
			},
			object: {
				type: "object",
				rules: []
			}
		};
		return {
			types: {
				...groups,
				integer: true,
				boolean: true,
				null: true
			},
			rules: [
				{ rules: [] },
				groups.number,
				groups.string,
				groups.array,
				groups.object
			],
			post: { rules: [] },
			all: {},
			keywords: {}
		};
	}
	exports.getRules = getRules;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
	function schemaHasRulesForType({ schema, self }, type) {
		const group = self.RULES.types[type];
		return group && group !== true && shouldUseGroup(schema, group);
	}
	exports.schemaHasRulesForType = schemaHasRulesForType;
	function shouldUseGroup(schema, group) {
		return group.rules.some((rule) => shouldUseRule(schema, rule));
	}
	exports.shouldUseGroup = shouldUseGroup;
	function shouldUseRule(schema, rule) {
		var _a;
		return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
	}
	exports.shouldUseRule = shouldUseRule;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
	var rules_1 = require_rules();
	var applicability_1 = require_applicability();
	var errors_1 = require_errors();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var DataType;
	(function(DataType) {
		DataType[DataType["Correct"] = 0] = "Correct";
		DataType[DataType["Wrong"] = 1] = "Wrong";
	})(DataType || (exports.DataType = DataType = {}));
	function getSchemaTypes(schema) {
		const types = getJSONTypes(schema.type);
		if (types.includes("null")) {
			if (schema.nullable === false) throw new Error("type: null contradicts nullable: false");
		} else {
			if (!types.length && schema.nullable !== void 0) throw new Error("\"nullable\" cannot be used without \"type\"");
			if (schema.nullable === true) types.push("null");
		}
		return types;
	}
	exports.getSchemaTypes = getSchemaTypes;
	function getJSONTypes(ts) {
		const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
		if (types.every(rules_1.isJSONType)) return types;
		throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
	}
	exports.getJSONTypes = getJSONTypes;
	function coerceAndCheckDataType(it, types) {
		const { gen, data, opts } = it;
		const coerceTo = coerceToTypes(types, opts.coerceTypes);
		const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
		if (checkTypes) {
			const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
			gen.if(wrongType, () => {
				if (coerceTo.length) coerceData(it, types, coerceTo);
				else reportTypeError(it);
			});
		}
		return checkTypes;
	}
	exports.coerceAndCheckDataType = coerceAndCheckDataType;
	var COERCIBLE = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null"
	]);
	function coerceToTypes(types, coerceTypes) {
		return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
	}
	function coerceData(it, types, coerceTo) {
		const { gen, data, opts } = it;
		const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
		const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
		if (opts.coerceTypes === "array") gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
		gen.if((0, codegen_1._)`${coerced} !== undefined`);
		for (const t of coerceTo) if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") coerceSpecificType(t);
		gen.else();
		reportTypeError(it);
		gen.endIf();
		gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
			gen.assign(data, coerced);
			assignParentData(it, coerced);
		});
		function coerceSpecificType(t) {
			switch (t) {
				case "string":
					gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
					return;
				case "number":
					gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
					return;
				case "integer":
					gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
					return;
				case "boolean":
					gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
					return;
				case "null":
					gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
					gen.assign(coerced, null);
					return;
				case "array": gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
			}
		}
	}
	function assignParentData({ gen, parentData, parentDataProperty }, expr) {
		gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
	}
	function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
		const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
		let cond;
		switch (dataType) {
			case "null": return (0, codegen_1._)`${data} ${EQ} null`;
			case "array":
				cond = (0, codegen_1._)`Array.isArray(${data})`;
				break;
			case "object":
				cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
				break;
			case "integer":
				cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
				break;
			case "number":
				cond = numCond();
				break;
			default: return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
		}
		return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
		function numCond(_cond = codegen_1.nil) {
			return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
		}
	}
	exports.checkDataType = checkDataType;
	function checkDataTypes(dataTypes, data, strictNums, correct) {
		if (dataTypes.length === 1) return checkDataType(dataTypes[0], data, strictNums, correct);
		let cond;
		const types = (0, util_1.toHash)(dataTypes);
		if (types.array && types.object) {
			const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
			cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
			delete types.null;
			delete types.array;
			delete types.object;
		} else cond = codegen_1.nil;
		if (types.number) delete types.integer;
		for (const t in types) cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
		return cond;
	}
	exports.checkDataTypes = checkDataTypes;
	var typeError = {
		message: ({ schema }) => `must be ${schema}`,
		params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
	};
	function reportTypeError(it) {
		const cxt = getTypeErrorContext(it);
		(0, errors_1.reportError)(cxt, typeError);
	}
	exports.reportTypeError = reportTypeError;
	function getTypeErrorContext(it) {
		const { gen, data, schema } = it;
		const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
		return {
			gen,
			keyword: "type",
			data,
			schema: schema.type,
			schemaCode,
			schemaValue: schemaCode,
			parentSchema: schema,
			params: {},
			it
		};
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.assignDefaults = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	function assignDefaults(it, ty) {
		const { properties, items } = it.schema;
		if (ty === "object" && properties) for (const key in properties) assignDefault(it, key, properties[key].default);
		else if (ty === "array" && Array.isArray(items)) items.forEach((sch, i) => assignDefault(it, i, sch.default));
	}
	exports.assignDefaults = assignDefaults;
	function assignDefault(it, prop, defaultValue) {
		const { gen, compositeRule, data, opts } = it;
		if (defaultValue === void 0) return;
		const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
		if (compositeRule) {
			(0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
			return;
		}
		let condition = (0, codegen_1._)`${childData} === undefined`;
		if (opts.useDefaults === "empty") condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
		gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
	}
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/code.js
var require_code = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var names_1 = require_names();
	var util_2 = require_util();
	function checkReportMissingProp(cxt, prop) {
		const { gen, data, it } = cxt;
		gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
			cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
			cxt.error();
		});
	}
	exports.checkReportMissingProp = checkReportMissingProp;
	function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
		return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
	}
	exports.checkMissingProp = checkMissingProp;
	function reportMissingProp(cxt, missing) {
		cxt.setParams({ missingProperty: missing }, true);
		cxt.error();
	}
	exports.reportMissingProp = reportMissingProp;
	function hasPropFunc(gen) {
		return gen.scopeValue("func", {
			ref: Object.prototype.hasOwnProperty,
			code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
		});
	}
	exports.hasPropFunc = hasPropFunc;
	function isOwnProperty(gen, data, property) {
		return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
	}
	exports.isOwnProperty = isOwnProperty;
	function propertyInData(gen, data, property, ownProperties) {
		const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
		return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
	}
	exports.propertyInData = propertyInData;
	function noPropertyInData(gen, data, property, ownProperties) {
		const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
		return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
	}
	exports.noPropertyInData = noPropertyInData;
	function allSchemaProperties(schemaMap) {
		return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
	}
	exports.allSchemaProperties = allSchemaProperties;
	function schemaProperties(it, schemaMap) {
		return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
	}
	exports.schemaProperties = schemaProperties;
	function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
		const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
		const valCxt = [
			[names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
			[names_1.default.parentData, it.parentData],
			[names_1.default.parentDataProperty, it.parentDataProperty],
			[names_1.default.rootData, names_1.default.rootData]
		];
		if (it.opts.dynamicRef) valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
		const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
		return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
	}
	exports.callValidateCode = callValidateCode;
	var newRegExp = (0, codegen_1._)`new RegExp`;
	function usePattern({ gen, it: { opts } }, pattern) {
		const u = opts.unicodeRegExp ? "u" : "";
		const { regExp } = opts.code;
		const rx = regExp(pattern, u);
		return gen.scopeValue("pattern", {
			key: rx.toString(),
			ref: rx,
			code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
		});
	}
	exports.usePattern = usePattern;
	function validateArray(cxt) {
		const { gen, data, keyword, it } = cxt;
		const valid = gen.name("valid");
		if (it.allErrors) {
			const validArr = gen.let("valid", true);
			validateItems(() => gen.assign(validArr, false));
			return validArr;
		}
		gen.var(valid, true);
		validateItems(() => gen.break());
		return valid;
		function validateItems(notValid) {
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			gen.forRange("i", 0, len, (i) => {
				cxt.subschema({
					keyword,
					dataProp: i,
					dataPropType: util_1.Type.Num
				}, valid);
				gen.if((0, codegen_1.not)(valid), notValid);
			});
		}
	}
	exports.validateArray = validateArray;
	function validateUnion(cxt) {
		const { gen, schema, keyword, it } = cxt;
		/* istanbul ignore if */
		if (!Array.isArray(schema)) throw new Error("ajv implementation error");
		if (schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch)) && !it.opts.unevaluated) return;
		const valid = gen.let("valid", false);
		const schValid = gen.name("_valid");
		gen.block(() => schema.forEach((_sch, i) => {
			const schCxt = cxt.subschema({
				keyword,
				schemaProp: i,
				compositeRule: true
			}, schValid);
			gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
			if (!cxt.mergeValidEvaluated(schCxt, schValid)) gen.if((0, codegen_1.not)(valid));
		}));
		cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
	}
	exports.validateUnion = validateUnion;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var code_1 = require_code();
	var errors_1 = require_errors();
	function macroKeywordCode(cxt, def) {
		const { gen, keyword, schema, parentSchema, it } = cxt;
		const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
		const schemaRef = useKeyword(gen, keyword, macroSchema);
		if (it.opts.validateSchema !== false) it.self.validateSchema(macroSchema, true);
		const valid = gen.name("valid");
		cxt.subschema({
			schema: macroSchema,
			schemaPath: codegen_1.nil,
			errSchemaPath: `${it.errSchemaPath}/${keyword}`,
			topSchemaRef: schemaRef,
			compositeRule: true
		}, valid);
		cxt.pass(valid, () => cxt.error(true));
	}
	exports.macroKeywordCode = macroKeywordCode;
	function funcKeywordCode(cxt, def) {
		var _a;
		const { gen, keyword, schema, parentSchema, $data, it } = cxt;
		checkAsyncKeyword(it, def);
		const validateRef = useKeyword(gen, keyword, !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate);
		const valid = gen.let("valid");
		cxt.block$data(valid, validateKeyword);
		cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
		function validateKeyword() {
			if (def.errors === false) {
				assignValid();
				if (def.modifying) modifyData(cxt);
				reportErrs(() => cxt.error());
			} else {
				const ruleErrs = def.async ? validateAsync() : validateSync();
				if (def.modifying) modifyData(cxt);
				reportErrs(() => addErrs(cxt, ruleErrs));
			}
		}
		function validateAsync() {
			const ruleErrs = gen.let("ruleErrs", null);
			gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
			return ruleErrs;
		}
		function validateSync() {
			const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
			gen.assign(validateErrs, null);
			assignValid(codegen_1.nil);
			return validateErrs;
		}
		function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
			const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
			const passSchema = !("compile" in def && !$data || def.schema === false);
			gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
		}
		function reportErrs(errors) {
			var _a;
			gen.if((0, codegen_1.not)((_a = def.valid) !== null && _a !== void 0 ? _a : valid), errors);
		}
	}
	exports.funcKeywordCode = funcKeywordCode;
	function modifyData(cxt) {
		const { gen, data, it } = cxt;
		gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
	}
	function addErrs(cxt, errs) {
		const { gen } = cxt;
		gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
			gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
			(0, errors_1.extendErrors)(cxt);
		}, () => cxt.error());
	}
	function checkAsyncKeyword({ schemaEnv }, def) {
		if (def.async && !schemaEnv.$async) throw new Error("async keyword in sync schema");
	}
	function useKeyword(gen, keyword, result) {
		if (result === void 0) throw new Error(`keyword "${keyword}" failed to compile`);
		return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : {
			ref: result,
			code: (0, codegen_1.stringify)(result)
		});
	}
	function validSchemaType(schema, schemaType, allowUndefined = false) {
		return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
	}
	exports.validSchemaType = validSchemaType;
	function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
		/* istanbul ignore if */
		if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) throw new Error("ajv implementation error");
		const deps = def.dependencies;
		if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
		if (def.validateSchema) {
			if (!def.validateSchema(schema[keyword])) {
				const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
				if (opts.validateSchema === "log") self.logger.error(msg);
				else throw new Error(msg);
			}
		}
	}
	exports.validateKeywordUsage = validateKeywordUsage;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
		if (keyword !== void 0 && schema !== void 0) throw new Error("both \"keyword\" and \"schema\" passed, only one allowed");
		if (keyword !== void 0) {
			const sch = it.schema[keyword];
			return schemaProp === void 0 ? {
				schema: sch,
				schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
				errSchemaPath: `${it.errSchemaPath}/${keyword}`
			} : {
				schema: sch[schemaProp],
				schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
				errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
			};
		}
		if (schema !== void 0) {
			if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) throw new Error("\"schemaPath\", \"errSchemaPath\" and \"topSchemaRef\" are required with \"schema\"");
			return {
				schema,
				schemaPath,
				topSchemaRef,
				errSchemaPath
			};
		}
		throw new Error("either \"keyword\" or \"schema\" must be passed");
	}
	exports.getSubschema = getSubschema;
	function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
		if (data !== void 0 && dataProp !== void 0) throw new Error("both \"data\" and \"dataProp\" passed, only one allowed");
		const { gen } = it;
		if (dataProp !== void 0) {
			const { errorPath, dataPathArr, opts } = it;
			dataContextProps(gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true));
			subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
			subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
			subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
		}
		if (data !== void 0) {
			dataContextProps(data instanceof codegen_1.Name ? data : gen.let("data", data, true));
			if (propertyName !== void 0) subschema.propertyName = propertyName;
		}
		if (dataTypes) subschema.dataTypes = dataTypes;
		function dataContextProps(_nextData) {
			subschema.data = _nextData;
			subschema.dataLevel = it.dataLevel + 1;
			subschema.dataTypes = [];
			it.definedProperties = /* @__PURE__ */ new Set();
			subschema.parentData = it.data;
			subschema.dataNames = [...it.dataNames, _nextData];
		}
	}
	exports.extendSubschemaData = extendSubschemaData;
	function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
		if (compositeRule !== void 0) subschema.compositeRule = compositeRule;
		if (createErrors !== void 0) subschema.createErrors = createErrors;
		if (allErrors !== void 0) subschema.allErrors = allErrors;
		subschema.jtdDiscriminator = jtdDiscriminator;
		subschema.jtdMetadata = jtdMetadata;
	}
	exports.extendSubschemaMode = extendSubschemaMode;
}));
//#endregion
//#region node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function equal(a, b) {
		if (a === b) return true;
		if (a && b && typeof a == "object" && typeof b == "object") {
			if (a.constructor !== b.constructor) return false;
			var length, i, keys;
			if (Array.isArray(a)) {
				length = a.length;
				if (length != b.length) return false;
				for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;
				return true;
			}
			if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
			if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
			if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
			keys = Object.keys(a);
			length = keys.length;
			if (length !== Object.keys(b).length) return false;
			for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
			for (i = length; i-- !== 0;) {
				var key = keys[i];
				if (!equal(a[key], b[key])) return false;
			}
			return true;
		}
		return a !== a && b !== b;
	};
}));
//#endregion
//#region node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var traverse = module.exports = function(schema, opts, cb) {
		if (typeof opts == "function") {
			cb = opts;
			opts = {};
		}
		cb = opts.cb || cb;
		var pre = typeof cb == "function" ? cb : cb.pre || function() {};
		var post = cb.post || function() {};
		_traverse(opts, pre, post, schema, "", schema);
	};
	traverse.keywords = {
		additionalItems: true,
		items: true,
		contains: true,
		additionalProperties: true,
		propertyNames: true,
		not: true,
		if: true,
		then: true,
		else: true
	};
	traverse.arrayKeywords = {
		items: true,
		allOf: true,
		anyOf: true,
		oneOf: true
	};
	traverse.propsKeywords = {
		$defs: true,
		definitions: true,
		properties: true,
		patternProperties: true,
		dependencies: true
	};
	traverse.skipKeywords = {
		default: true,
		enum: true,
		const: true,
		required: true,
		maximum: true,
		minimum: true,
		exclusiveMaximum: true,
		exclusiveMinimum: true,
		multipleOf: true,
		maxLength: true,
		minLength: true,
		pattern: true,
		format: true,
		maxItems: true,
		minItems: true,
		uniqueItems: true,
		maxProperties: true,
		minProperties: true
	};
	function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
		if (schema && typeof schema == "object" && !Array.isArray(schema)) {
			pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
			for (var key in schema) {
				var sch = schema[key];
				if (Array.isArray(sch)) {
					if (key in traverse.arrayKeywords) for (var i = 0; i < sch.length; i++) _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
				} else if (key in traverse.propsKeywords) {
					if (sch && typeof sch == "object") for (var prop in sch) _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
				} else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
			}
			post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
		}
	}
	function escapeJsonPtr(str) {
		return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/resolve.js
var require_resolve = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
	var util_1 = require_util();
	var equal = require_fast_deep_equal();
	var traverse = require_json_schema_traverse();
	var SIMPLE_INLINED = /* @__PURE__ */ new Set([
		"type",
		"format",
		"pattern",
		"maxLength",
		"minLength",
		"maxProperties",
		"minProperties",
		"maxItems",
		"minItems",
		"maximum",
		"minimum",
		"uniqueItems",
		"multipleOf",
		"required",
		"enum",
		"const"
	]);
	function inlineRef(schema, limit = true) {
		if (typeof schema == "boolean") return true;
		if (limit === true) return !hasRef(schema);
		if (!limit) return false;
		return countKeys(schema) <= limit;
	}
	exports.inlineRef = inlineRef;
	var REF_KEYWORDS = /* @__PURE__ */ new Set([
		"$ref",
		"$recursiveRef",
		"$recursiveAnchor",
		"$dynamicRef",
		"$dynamicAnchor"
	]);
	function hasRef(schema) {
		for (const key in schema) {
			if (REF_KEYWORDS.has(key)) return true;
			const sch = schema[key];
			if (Array.isArray(sch) && sch.some(hasRef)) return true;
			if (typeof sch == "object" && hasRef(sch)) return true;
		}
		return false;
	}
	function countKeys(schema) {
		let count = 0;
		for (const key in schema) {
			if (key === "$ref") return Infinity;
			count++;
			if (SIMPLE_INLINED.has(key)) continue;
			if (typeof schema[key] == "object") (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
			if (count === Infinity) return Infinity;
		}
		return count;
	}
	function getFullPath(resolver, id = "", normalize) {
		if (normalize !== false) id = normalizeId(id);
		return _getFullPath(resolver, resolver.parse(id));
	}
	exports.getFullPath = getFullPath;
	function _getFullPath(resolver, p) {
		return resolver.serialize(p).split("#")[0] + "#";
	}
	exports._getFullPath = _getFullPath;
	var TRAILING_SLASH_HASH = /#\/?$/;
	function normalizeId(id) {
		return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
	}
	exports.normalizeId = normalizeId;
	function resolveUrl(resolver, baseId, id) {
		id = normalizeId(id);
		return resolver.resolve(baseId, id);
	}
	exports.resolveUrl = resolveUrl;
	var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
	function getSchemaRefs(schema, baseId) {
		if (typeof schema == "boolean") return {};
		const { schemaId, uriResolver } = this.opts;
		const schId = normalizeId(schema[schemaId] || baseId);
		const baseIds = { "": schId };
		const pathPrefix = getFullPath(uriResolver, schId, false);
		const localRefs = {};
		const schemaRefs = /* @__PURE__ */ new Set();
		traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
			if (parentJsonPtr === void 0) return;
			const fullPath = pathPrefix + jsonPtr;
			let innerBaseId = baseIds[parentJsonPtr];
			if (typeof sch[schemaId] == "string") innerBaseId = addRef.call(this, sch[schemaId]);
			addAnchor.call(this, sch.$anchor);
			addAnchor.call(this, sch.$dynamicAnchor);
			baseIds[jsonPtr] = innerBaseId;
			function addRef(ref) {
				const _resolve = this.opts.uriResolver.resolve;
				ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
				if (schemaRefs.has(ref)) throw ambiguos(ref);
				schemaRefs.add(ref);
				let schOrRef = this.refs[ref];
				if (typeof schOrRef == "string") schOrRef = this.refs[schOrRef];
				if (typeof schOrRef == "object") checkAmbiguosRef(sch, schOrRef.schema, ref);
				else if (ref !== normalizeId(fullPath)) {
					if (ref[0] === "#") {
						checkAmbiguosRef(sch, localRefs[ref], ref);
						localRefs[ref] = sch;
					} else this.refs[ref] = fullPath;
				}
				return ref;
			}
			function addAnchor(anchor) {
				if (typeof anchor == "string") {
					if (!ANCHOR.test(anchor)) throw new Error(`invalid anchor "${anchor}"`);
					addRef.call(this, `#${anchor}`);
				}
			}
		});
		return localRefs;
		function checkAmbiguosRef(sch1, sch2, ref) {
			if (sch2 !== void 0 && !equal(sch1, sch2)) throw ambiguos(ref);
		}
		function ambiguos(ref) {
			return /* @__PURE__ */ new Error(`reference "${ref}" resolves to more than one schema`);
		}
	}
	exports.getSchemaRefs = getSchemaRefs;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/index.js
var require_validate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
	var boolSchema_1 = require_boolSchema();
	var dataType_1 = require_dataType();
	var applicability_1 = require_applicability();
	var dataType_2 = require_dataType();
	var defaults_1 = require_defaults();
	var keyword_1 = require_keyword();
	var subschema_1 = require_subschema();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var resolve_1 = require_resolve();
	var util_1 = require_util();
	var errors_1 = require_errors();
	function validateFunctionCode(it) {
		if (isSchemaObj(it)) {
			checkKeywords(it);
			if (schemaCxtHasRules(it)) {
				topSchemaObjCode(it);
				return;
			}
		}
		validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
	}
	exports.validateFunctionCode = validateFunctionCode;
	function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
		if (opts.code.es5) gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
			gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
			destructureValCxtES5(gen, opts);
			gen.code(body);
		});
		else gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
	}
	function destructureValCxt(opts) {
		return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
	}
	function destructureValCxtES5(gen, opts) {
		gen.if(names_1.default.valCxt, () => {
			gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
			gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
			gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
			gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
			if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
		}, () => {
			gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
			gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
			gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
			gen.var(names_1.default.rootData, names_1.default.data);
			if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
		});
	}
	function topSchemaObjCode(it) {
		const { schema, opts, gen } = it;
		validateFunction(it, () => {
			if (opts.$comment && schema.$comment) commentKeyword(it);
			checkNoDefault(it);
			gen.let(names_1.default.vErrors, null);
			gen.let(names_1.default.errors, 0);
			if (opts.unevaluated) resetEvaluated(it);
			typeAndKeywords(it);
			returnResults(it);
		});
	}
	function resetEvaluated(it) {
		const { gen, validateName } = it;
		it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
		gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
		gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
	}
	function funcSourceUrl(schema, opts) {
		const schId = typeof schema == "object" && schema[opts.schemaId];
		return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
	}
	function subschemaCode(it, valid) {
		if (isSchemaObj(it)) {
			checkKeywords(it);
			if (schemaCxtHasRules(it)) {
				subSchemaObjCode(it, valid);
				return;
			}
		}
		(0, boolSchema_1.boolOrEmptySchema)(it, valid);
	}
	function schemaCxtHasRules({ schema, self }) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (self.RULES.all[key]) return true;
		return false;
	}
	function isSchemaObj(it) {
		return typeof it.schema != "boolean";
	}
	function subSchemaObjCode(it, valid) {
		const { schema, gen, opts } = it;
		if (opts.$comment && schema.$comment) commentKeyword(it);
		updateContext(it);
		checkAsyncSchema(it);
		const errsCount = gen.const("_errs", names_1.default.errors);
		typeAndKeywords(it, errsCount);
		gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
	}
	function checkKeywords(it) {
		(0, util_1.checkUnknownRules)(it);
		checkRefsAndKeywords(it);
	}
	function typeAndKeywords(it, errsCount) {
		if (it.opts.jtd) return schemaKeywords(it, [], false, errsCount);
		const types = (0, dataType_1.getSchemaTypes)(it.schema);
		schemaKeywords(it, types, !(0, dataType_1.coerceAndCheckDataType)(it, types), errsCount);
	}
	function checkRefsAndKeywords(it) {
		const { schema, errSchemaPath, opts, self } = it;
		if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
	}
	function checkNoDefault(it) {
		const { schema, opts } = it;
		if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
	}
	function updateContext(it) {
		const schId = it.schema[it.opts.schemaId];
		if (schId) it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
	}
	function checkAsyncSchema(it) {
		if (it.schema.$async && !it.schemaEnv.$async) throw new Error("async schema in sync schema");
	}
	function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
		const msg = schema.$comment;
		if (opts.$comment === true) gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
		else if (typeof opts.$comment == "function") {
			const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
			const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
			gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
		}
	}
	function returnResults(it) {
		const { gen, schemaEnv, validateName, ValidationError, opts } = it;
		if (schemaEnv.$async) gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
			if (opts.unevaluated) assignEvaluated(it);
			gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
		}
	}
	function assignEvaluated({ gen, evaluated, props, items }) {
		if (props instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.props`, props);
		if (items instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.items`, items);
	}
	function schemaKeywords(it, types, typeErrors, errsCount) {
		const { gen, schema, data, allErrors, opts, self } = it;
		const { RULES } = self;
		if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
			gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
			return;
		}
		if (!opts.jtd) checkStrictTypes(it, types);
		gen.block(() => {
			for (const group of RULES.rules) groupKeywords(group);
			groupKeywords(RULES.post);
		});
		function groupKeywords(group) {
			if (!(0, applicability_1.shouldUseGroup)(schema, group)) return;
			if (group.type) {
				gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
				iterateKeywords(it, group);
				if (types.length === 1 && types[0] === group.type && typeErrors) {
					gen.else();
					(0, dataType_2.reportTypeError)(it);
				}
				gen.endIf();
			} else iterateKeywords(it, group);
			if (!allErrors) gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
		}
	}
	function iterateKeywords(it, group) {
		const { gen, schema, opts: { useDefaults } } = it;
		if (useDefaults) (0, defaults_1.assignDefaults)(it, group.type);
		gen.block(() => {
			for (const rule of group.rules) if ((0, applicability_1.shouldUseRule)(schema, rule)) keywordCode(it, rule.keyword, rule.definition, group.type);
		});
	}
	function checkStrictTypes(it, types) {
		if (it.schemaEnv.meta || !it.opts.strictTypes) return;
		checkContextTypes(it, types);
		if (!it.opts.allowUnionTypes) checkMultipleTypes(it, types);
		checkKeywordTypes(it, it.dataTypes);
	}
	function checkContextTypes(it, types) {
		if (!types.length) return;
		if (!it.dataTypes.length) {
			it.dataTypes = types;
			return;
		}
		types.forEach((t) => {
			if (!includesType(it.dataTypes, t)) strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
		});
		narrowSchemaTypes(it, types);
	}
	function checkMultipleTypes(it, ts) {
		if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) strictTypesError(it, "use allowUnionTypes to allow union type keyword");
	}
	function checkKeywordTypes(it, ts) {
		const rules = it.self.RULES.all;
		for (const keyword in rules) {
			const rule = rules[keyword];
			if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
				const { type } = rule.definition;
				if (type.length && !type.some((t) => hasApplicableType(ts, t))) strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
			}
		}
	}
	function hasApplicableType(schTs, kwdT) {
		return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
	}
	function includesType(ts, t) {
		return ts.includes(t) || t === "integer" && ts.includes("number");
	}
	function narrowSchemaTypes(it, withTypes) {
		const ts = [];
		for (const t of it.dataTypes) if (includesType(withTypes, t)) ts.push(t);
		else if (withTypes.includes("integer") && t === "number") ts.push("integer");
		it.dataTypes = ts;
	}
	function strictTypesError(it, msg) {
		const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
		msg += ` at "${schemaPath}" (strictTypes)`;
		(0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
	}
	var KeywordCxt = class {
		constructor(it, def, keyword) {
			(0, keyword_1.validateKeywordUsage)(it, def, keyword);
			this.gen = it.gen;
			this.allErrors = it.allErrors;
			this.keyword = keyword;
			this.data = it.data;
			this.schema = it.schema[keyword];
			this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
			this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
			this.schemaType = def.schemaType;
			this.parentSchema = it.schema;
			this.params = {};
			this.it = it;
			this.def = def;
			if (this.$data) this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
			else {
				this.schemaCode = this.schemaValue;
				if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
			}
			if ("code" in def ? def.trackErrors : def.errors !== false) this.errsCount = it.gen.const("_errs", names_1.default.errors);
		}
		result(condition, successAction, failAction) {
			this.failResult((0, codegen_1.not)(condition), successAction, failAction);
		}
		failResult(condition, successAction, failAction) {
			this.gen.if(condition);
			if (failAction) failAction();
			else this.error();
			if (successAction) {
				this.gen.else();
				successAction();
				if (this.allErrors) this.gen.endIf();
			} else if (this.allErrors) this.gen.endIf();
			else this.gen.else();
		}
		pass(condition, failAction) {
			this.failResult((0, codegen_1.not)(condition), void 0, failAction);
		}
		fail(condition) {
			if (condition === void 0) {
				this.error();
				if (!this.allErrors) this.gen.if(false);
				return;
			}
			this.gen.if(condition);
			this.error();
			if (this.allErrors) this.gen.endIf();
			else this.gen.else();
		}
		fail$data(condition) {
			if (!this.$data) return this.fail(condition);
			const { schemaCode } = this;
			this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
		}
		error(append, errorParams, errorPaths) {
			if (errorParams) {
				this.setParams(errorParams);
				this._error(append, errorPaths);
				this.setParams({});
				return;
			}
			this._error(append, errorPaths);
		}
		_error(append, errorPaths) {
			(append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
		}
		$dataError() {
			(0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
		}
		reset() {
			if (this.errsCount === void 0) throw new Error("add \"trackErrors\" to keyword definition");
			(0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
		}
		ok(cond) {
			if (!this.allErrors) this.gen.if(cond);
		}
		setParams(obj, assign) {
			if (assign) Object.assign(this.params, obj);
			else this.params = obj;
		}
		block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
			this.gen.block(() => {
				this.check$data(valid, $dataValid);
				codeBlock();
			});
		}
		check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
			if (!this.$data) return;
			const { gen, schemaCode, schemaType, def } = this;
			gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
			if (valid !== codegen_1.nil) gen.assign(valid, true);
			if (schemaType.length || def.validateSchema) {
				gen.elseIf(this.invalid$data());
				this.$dataError();
				if (valid !== codegen_1.nil) gen.assign(valid, false);
			}
			gen.else();
		}
		invalid$data() {
			const { gen, schemaCode, schemaType, def, it } = this;
			return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
			function wrong$DataType() {
				if (schemaType.length) {
					/* istanbul ignore if */
					if (!(schemaCode instanceof codegen_1.Name)) throw new Error("ajv implementation error");
					const st = Array.isArray(schemaType) ? schemaType : [schemaType];
					return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
				}
				return codegen_1.nil;
			}
			function invalid$DataSchema() {
				if (def.validateSchema) {
					const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
					return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
				}
				return codegen_1.nil;
			}
		}
		subschema(appl, valid) {
			const subschema = (0, subschema_1.getSubschema)(this.it, appl);
			(0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
			(0, subschema_1.extendSubschemaMode)(subschema, appl);
			const nextContext = {
				...this.it,
				...subschema,
				items: void 0,
				props: void 0
			};
			subschemaCode(nextContext, valid);
			return nextContext;
		}
		mergeEvaluated(schemaCxt, toName) {
			const { it, gen } = this;
			if (!it.opts.unevaluated) return;
			if (it.props !== true && schemaCxt.props !== void 0) it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
			if (it.items !== true && schemaCxt.items !== void 0) it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
		}
		mergeValidEvaluated(schemaCxt, valid) {
			const { it, gen } = this;
			if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
				gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
				return true;
			}
		}
	};
	exports.KeywordCxt = KeywordCxt;
	function keywordCode(it, keyword, def, ruleType) {
		const cxt = new KeywordCxt(it, def, keyword);
		if ("code" in def) def.code(cxt, ruleType);
		else if (cxt.$data && def.validate) (0, keyword_1.funcKeywordCode)(cxt, def);
		else if ("macro" in def) (0, keyword_1.macroKeywordCode)(cxt, def);
		else if (def.compile || def.validate) (0, keyword_1.funcKeywordCode)(cxt, def);
	}
	var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
	var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
	function getData($data, { dataLevel, dataNames, dataPathArr }) {
		let jsonPointer;
		let data;
		if ($data === "") return names_1.default.rootData;
		if ($data[0] === "/") {
			if (!JSON_POINTER.test($data)) throw new Error(`Invalid JSON-pointer: ${$data}`);
			jsonPointer = $data;
			data = names_1.default.rootData;
		} else {
			const matches = RELATIVE_JSON_POINTER.exec($data);
			if (!matches) throw new Error(`Invalid JSON-pointer: ${$data}`);
			const up = +matches[1];
			jsonPointer = matches[2];
			if (jsonPointer === "#") {
				if (up >= dataLevel) throw new Error(errorMsg("property/index", up));
				return dataPathArr[dataLevel - up];
			}
			if (up > dataLevel) throw new Error(errorMsg("data", up));
			data = dataNames[dataLevel - up];
			if (!jsonPointer) return data;
		}
		let expr = data;
		const segments = jsonPointer.split("/");
		for (const segment of segments) if (segment) {
			data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
			expr = (0, codegen_1._)`${expr} && ${data}`;
		}
		return expr;
		function errorMsg(pointerType, up) {
			return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
		}
	}
	exports.getData = getData;
}));
//#endregion
//#region node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var ValidationError = class extends Error {
		constructor(errors) {
			super("validation failed");
			this.errors = errors;
			this.ajv = this.validation = true;
		}
	};
	exports.default = ValidationError;
}));
//#endregion
//#region node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var resolve_1 = require_resolve();
	var MissingRefError = class extends Error {
		constructor(resolver, baseId, ref, msg) {
			super(msg || `can't resolve reference ${ref} from id ${baseId}`);
			this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
			this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
		}
	};
	exports.default = MissingRefError;
}));
//#endregion
//#region node_modules/ajv/dist/compile/index.js
var require_compile = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
	var codegen_1 = require_codegen();
	var validation_error_1 = require_validation_error();
	var names_1 = require_names();
	var resolve_1 = require_resolve();
	var util_1 = require_util();
	var validate_1 = require_validate();
	var SchemaEnv = class {
		constructor(env) {
			var _a;
			this.refs = {};
			this.dynamicAnchors = {};
			let schema;
			if (typeof env.schema == "object") schema = env.schema;
			this.schema = env.schema;
			this.schemaId = env.schemaId;
			this.root = env.root || this;
			this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
			this.schemaPath = env.schemaPath;
			this.localRefs = env.localRefs;
			this.meta = env.meta;
			this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
			this.refs = {};
		}
	};
	exports.SchemaEnv = SchemaEnv;
	function compileSchema(sch) {
		const _sch = getCompilingSchema.call(this, sch);
		if (_sch) return _sch;
		const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
		const { es5, lines } = this.opts.code;
		const { ownProperties } = this.opts;
		const gen = new codegen_1.CodeGen(this.scope, {
			es5,
			lines,
			ownProperties
		});
		let _ValidationError;
		if (sch.$async) _ValidationError = gen.scopeValue("Error", {
			ref: validation_error_1.default,
			code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
		});
		const validateName = gen.scopeName("validate");
		sch.validateName = validateName;
		const schemaCxt = {
			gen,
			allErrors: this.opts.allErrors,
			data: names_1.default.data,
			parentData: names_1.default.parentData,
			parentDataProperty: names_1.default.parentDataProperty,
			dataNames: [names_1.default.data],
			dataPathArr: [codegen_1.nil],
			dataLevel: 0,
			dataTypes: [],
			definedProperties: /* @__PURE__ */ new Set(),
			topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? {
				ref: sch.schema,
				code: (0, codegen_1.stringify)(sch.schema)
			} : { ref: sch.schema }),
			validateName,
			ValidationError: _ValidationError,
			schema: sch.schema,
			schemaEnv: sch,
			rootId,
			baseId: sch.baseId || rootId,
			schemaPath: codegen_1.nil,
			errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
			errorPath: (0, codegen_1._)`""`,
			opts: this.opts,
			self: this
		};
		let sourceCode;
		try {
			this._compilations.add(sch);
			(0, validate_1.validateFunctionCode)(schemaCxt);
			gen.optimize(this.opts.code.optimize);
			const validateCode = gen.toString();
			sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
			if (this.opts.code.process) sourceCode = this.opts.code.process(sourceCode, sch);
			const validate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode)(this, this.scope.get());
			this.scope.value(validateName, { ref: validate });
			validate.errors = null;
			validate.schema = sch.schema;
			validate.schemaEnv = sch;
			if (sch.$async) validate.$async = true;
			if (this.opts.code.source === true) validate.source = {
				validateName,
				validateCode,
				scopeValues: gen._values
			};
			if (this.opts.unevaluated) {
				const { props, items } = schemaCxt;
				validate.evaluated = {
					props: props instanceof codegen_1.Name ? void 0 : props,
					items: items instanceof codegen_1.Name ? void 0 : items,
					dynamicProps: props instanceof codegen_1.Name,
					dynamicItems: items instanceof codegen_1.Name
				};
				if (validate.source) validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
			}
			sch.validate = validate;
			return sch;
		} catch (e) {
			delete sch.validate;
			delete sch.validateName;
			if (sourceCode) this.logger.error("Error compiling schema, function code:", sourceCode);
			throw e;
		} finally {
			this._compilations.delete(sch);
		}
	}
	exports.compileSchema = compileSchema;
	function resolveRef(root, baseId, ref) {
		var _a;
		ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
		const schOrFunc = root.refs[ref];
		if (schOrFunc) return schOrFunc;
		let _sch = resolve.call(this, root, ref);
		if (_sch === void 0) {
			const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
			const { schemaId } = this.opts;
			if (schema) _sch = new SchemaEnv({
				schema,
				schemaId,
				root,
				baseId
			});
		}
		if (_sch === void 0) return;
		return root.refs[ref] = inlineOrCompile.call(this, _sch);
	}
	exports.resolveRef = resolveRef;
	function inlineOrCompile(sch) {
		if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs)) return sch.schema;
		return sch.validate ? sch : compileSchema.call(this, sch);
	}
	function getCompilingSchema(schEnv) {
		for (const sch of this._compilations) if (sameSchemaEnv(sch, schEnv)) return sch;
	}
	exports.getCompilingSchema = getCompilingSchema;
	function sameSchemaEnv(s1, s2) {
		return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
	}
	function resolve(root, ref) {
		let sch;
		while (typeof (sch = this.refs[ref]) == "string") ref = sch;
		return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
	}
	function resolveSchema(root, ref) {
		const p = this.opts.uriResolver.parse(ref);
		const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
		let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
		if (Object.keys(root.schema).length > 0 && refPath === baseId) return getJsonPointer.call(this, p, root);
		const id = (0, resolve_1.normalizeId)(refPath);
		const schOrRef = this.refs[id] || this.schemas[id];
		if (typeof schOrRef == "string") {
			const sch = resolveSchema.call(this, root, schOrRef);
			if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object") return;
			return getJsonPointer.call(this, p, sch);
		}
		if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object") return;
		if (!schOrRef.validate) compileSchema.call(this, schOrRef);
		if (id === (0, resolve_1.normalizeId)(ref)) {
			const { schema } = schOrRef;
			const { schemaId } = this.opts;
			const schId = schema[schemaId];
			if (schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
			return new SchemaEnv({
				schema,
				schemaId,
				root,
				baseId
			});
		}
		return getJsonPointer.call(this, p, schOrRef);
	}
	exports.resolveSchema = resolveSchema;
	var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
		"properties",
		"patternProperties",
		"enum",
		"dependencies",
		"definitions"
	]);
	function getJsonPointer(parsedRef, { baseId, schema, root }) {
		var _a;
		if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/") return;
		for (const part of parsedRef.fragment.slice(1).split("/")) {
			if (typeof schema === "boolean") return;
			const partSchema = schema[(0, util_1.unescapeFragment)(part)];
			if (partSchema === void 0) return;
			schema = partSchema;
			const schId = typeof schema === "object" && schema[this.opts.schemaId];
			if (!PREVENT_SCOPE_CHANGE.has(part) && schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
		}
		let env;
		if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
			const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
			env = resolveSchema.call(this, root, $ref);
		}
		const { schemaId } = this.opts;
		env = env || new SchemaEnv({
			schema,
			schemaId,
			root,
			baseId
		});
		if (env.schema !== env.root.schema) return env;
	}
}));
//#endregion
//#region node_modules/ajv/dist/refs/data.json
var data_exports = /* @__PURE__ */ __exportAll({
	$id: () => $id$11,
	additionalProperties: () => false,
	default: () => data_default,
	description: () => description$1,
	properties: () => properties$11,
	required: () => required$2,
	type: () => type$11
}), $id$11, description$1, type$11, required$2, properties$11, data_default;
var init_data = __esmMin(() => {
	$id$11 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#";
	description$1 = "Meta-schema for $data reference (JSON AnySchema extension proposal)";
	type$11 = "object";
	required$2 = ["$data"];
	properties$11 = { "$data": {
		"type": "string",
		"anyOf": [{ "format": "relative-json-pointer" }, { "format": "json-pointer" }]
	} };
	data_default = {
		$id: $id$11,
		description: description$1,
		type: type$11,
		required: required$2,
		properties: properties$11,
		additionalProperties: false
	};
});
//#endregion
//#region node_modules/fast-uri/lib/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {(value: string) => boolean} */
	var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
	/** @type {(value: string) => boolean} */
	var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
	/** @type {(value: string) => boolean} */
	var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
	/** @type {(value: string) => boolean} */
	var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
	/** @type {(value: string) => boolean} */
	var isPathCharacter = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
	/**
	* @param {Array<string>} input
	* @returns {string}
	*/
	function stringArrayToHexStripped(input) {
		let acc = "";
		let code = 0;
		let i = 0;
		for (i = 0; i < input.length; i++) {
			code = input[i].charCodeAt(0);
			if (code === 48) continue;
			if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) return "";
			acc += input[i];
			break;
		}
		for (i += 1; i < input.length; i++) {
			code = input[i].charCodeAt(0);
			if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) return "";
			acc += input[i];
		}
		return acc;
	}
	/**
	* @typedef {Object} GetIPV6Result
	* @property {boolean} error - Indicates if there was an error parsing the IPv6 address.
	* @property {string} address - The parsed IPv6 address.
	* @property {string} [zone] - The zone identifier, if present.
	*/
	/**
	* @param {string} value
	* @returns {boolean}
	*/
	var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
	/**
	* @param {Array<string>} buffer
	* @returns {boolean}
	*/
	function consumeIsZone(buffer) {
		buffer.length = 0;
		return true;
	}
	/**
	* @param {Array<string>} buffer
	* @param {Array<string>} address
	* @param {GetIPV6Result} output
	* @returns {boolean}
	*/
	function consumeHextets(buffer, address, output) {
		if (buffer.length) {
			const hex = stringArrayToHexStripped(buffer);
			if (hex !== "") address.push(hex);
			else {
				output.error = true;
				return false;
			}
			buffer.length = 0;
		}
		return true;
	}
	/**
	* @param {string} input
	* @returns {GetIPV6Result}
	*/
	function getIPV6(input) {
		let tokenCount = 0;
		const output = {
			error: false,
			address: "",
			zone: ""
		};
		/** @type {Array<string>} */
		const address = [];
		/** @type {Array<string>} */
		const buffer = [];
		let endipv6Encountered = false;
		let endIpv6 = false;
		let consume = consumeHextets;
		for (let i = 0; i < input.length; i++) {
			const cursor = input[i];
			if (cursor === "[" || cursor === "]") continue;
			if (cursor === ":") {
				if (endipv6Encountered === true) endIpv6 = true;
				if (!consume(buffer, address, output)) break;
				if (++tokenCount > 7) {
					output.error = true;
					break;
				}
				if (i > 0 && input[i - 1] === ":") endipv6Encountered = true;
				address.push(":");
				continue;
			} else if (cursor === "%") {
				if (!consume(buffer, address, output)) break;
				consume = consumeIsZone;
			} else {
				buffer.push(cursor);
				continue;
			}
		}
		if (buffer.length) {
			if (consume === consumeIsZone) output.zone = buffer.join("");
			else if (endIpv6) address.push(buffer.join(""));
			else address.push(stringArrayToHexStripped(buffer));
		}
		output.address = address.join("");
		return output;
	}
	/**
	* @typedef {Object} NormalizeIPv6Result
	* @property {string} host - The normalized host.
	* @property {string} [escapedHost] - The escaped host.
	* @property {boolean} isIPV6 - Indicates if the host is an IPv6 address.
	*/
	/**
	* @param {string} host
	* @returns {NormalizeIPv6Result}
	*/
	function normalizeIPv6(host) {
		if (findToken(host, ":") < 2) return {
			host,
			isIPV6: false
		};
		const ipv6 = getIPV6(host);
		if (!ipv6.error) {
			let newHost = ipv6.address;
			let escapedHost = ipv6.address;
			if (ipv6.zone) {
				newHost += "%" + ipv6.zone;
				escapedHost += "%25" + ipv6.zone;
			}
			return {
				host: newHost,
				isIPV6: true,
				escapedHost
			};
		} else return {
			host,
			isIPV6: false
		};
	}
	/**
	* @param {string} str
	* @param {string} token
	* @returns {number}
	*/
	function findToken(str, token) {
		let ind = 0;
		for (let i = 0; i < str.length; i++) if (str[i] === token) ind++;
		return ind;
	}
	/**
	* @param {string} path
	* @returns {string}
	*
	* @see https://datatracker.ietf.org/doc/html/rfc3986#section-5.2.4
	*/
	function removeDotSegments(path) {
		let input = path;
		const output = [];
		let nextSlash = -1;
		let len = 0;
		while (len = input.length) {
			if (len === 1) {
				if (input === ".") break;
				else if (input === "/") {
					output.push("/");
					break;
				} else {
					output.push(input);
					break;
				}
			} else if (len === 2) {
				if (input[0] === ".") {
					if (input[1] === ".") break;
					else if (input[1] === "/") {
						input = input.slice(2);
						continue;
					}
				} else if (input[0] === "/") {
					if (input[1] === "." || input[1] === "/") {
						output.push("/");
						break;
					}
				}
			} else if (len === 3) {
				if (input === "/..") {
					if (output.length !== 0) output.pop();
					output.push("/");
					break;
				}
			}
			if (input[0] === ".") {
				if (input[1] === ".") {
					if (input[2] === "/") {
						input = input.slice(3);
						continue;
					}
				} else if (input[1] === "/") {
					input = input.slice(2);
					continue;
				}
			} else if (input[0] === "/") {
				if (input[1] === ".") {
					if (input[2] === "/") {
						input = input.slice(2);
						continue;
					} else if (input[2] === ".") {
						if (input[3] === "/") {
							input = input.slice(3);
							if (output.length !== 0) output.pop();
							continue;
						}
					}
				}
			}
			if ((nextSlash = input.indexOf("/", 1)) === -1) {
				output.push(input);
				break;
			} else {
				output.push(input.slice(0, nextSlash));
				input = input.slice(nextSlash);
			}
		}
		return output.join("");
	}
	/**
	* Re-escape RFC 3986 gen-delims that must not appear literally in the host.
	* After the URI regex parses, these characters cannot be literal in the host
	* field, so any that appear after decoding came from percent-encoding and
	* must be restored to prevent authority structure changes.
	*
	* @param {string} host
	* @param {boolean} isIP - true for IPv4/IPv6 hosts (skip colon re-escaping)
	* @returns {string}
	*/
	var HOST_DELIMS = {
		"@": "%40",
		"/": "%2F",
		"?": "%3F",
		"#": "%23",
		":": "%3A"
	};
	var HOST_DELIM_RE = /[@/?#:]/g;
	var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
	function reescapeHostDelimiters(host, isIP) {
		const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
		re.lastIndex = 0;
		return host.replace(re, (ch) => HOST_DELIMS[ch]);
	}
	/**
	* Normalizes percent escapes and optionally decodes only unreserved ASCII bytes.
	* Reserved delimiters such as `%2F` and `%2E` stay escaped.
	*
	* @param {string} input
	* @param {boolean} [decodeUnreserved=false]
	* @returns {string}
	*/
	function normalizePercentEncoding(input, decodeUnreserved = false) {
		if (input.indexOf("%") === -1) return input;
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (decodeUnreserved && isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			output += input[i];
		}
		return output;
	}
	/**
	* Normalizes path data without turning reserved escapes into live path syntax.
	* Valid escapes are uppercased, raw unsafe characters are escaped, and only
	* unreserved bytes that are not `.` are decoded.
	*
	* @param {string} input
	* @returns {string}
	*/
	function normalizePathEncoding(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (decoded !== "." && isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			if (isPathCharacter(input[i])) output += input[i];
			else output += escape(input[i]);
		}
		return output;
	}
	/**
	* Escapes a component while preserving existing valid percent escapes.
	*
	* @param {string} input
	* @returns {string}
	*/
	function escapePreservingEscapes(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					output += "%" + hex.toUpperCase();
					i += 2;
					continue;
				}
			}
			output += escape(input[i]);
		}
		return output;
	}
	/**
	* @param {import('../types/index').URIComponent} component
	* @returns {string|undefined}
	*/
	function recomposeAuthority(component) {
		const uriTokens = [];
		if (component.userinfo !== void 0) {
			uriTokens.push(component.userinfo);
			uriTokens.push("@");
		}
		if (component.host !== void 0) {
			let host = unescape(component.host);
			if (!isIPv4(host)) {
				const ipV6res = normalizeIPv6(host);
				if (ipV6res.isIPV6 === true) host = `[${ipV6res.escapedHost}]`;
				else host = reescapeHostDelimiters(host, false);
			}
			uriTokens.push(host);
		}
		if (typeof component.port === "number" || typeof component.port === "string") {
			uriTokens.push(":");
			uriTokens.push(String(component.port));
		}
		return uriTokens.length ? uriTokens.join("") : void 0;
	}
	module.exports = {
		nonSimpleDomain,
		recomposeAuthority,
		reescapeHostDelimiters,
		normalizePercentEncoding,
		normalizePathEncoding,
		escapePreservingEscapes,
		removeDotSegments,
		isIPv4,
		isUUID,
		normalizeIPv6,
		stringArrayToHexStripped
	};
}));
//#endregion
//#region node_modules/fast-uri/lib/schemes.js
var require_schemes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { isUUID } = require_utils();
	var URN_REG = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
	var supportedSchemeNames = [
		"http",
		"https",
		"ws",
		"wss",
		"urn",
		"urn:uuid"
	];
	/** @typedef {supportedSchemeNames[number]} SchemeName */
	/**
	* @param {string} name
	* @returns {name is SchemeName}
	*/
	function isValidSchemeName(name) {
		return supportedSchemeNames.indexOf(name) !== -1;
	}
	/**
	* @callback SchemeFn
	* @param {import('../types/index').URIComponent} component
	* @param {import('../types/index').Options} options
	* @returns {import('../types/index').URIComponent}
	*/
	/**
	* @typedef {Object} SchemeHandler
	* @property {SchemeName} scheme - The scheme name.
	* @property {boolean} [domainHost] - Indicates if the scheme supports domain hosts.
	* @property {SchemeFn} parse - Function to parse the URI component for this scheme.
	* @property {SchemeFn} serialize - Function to serialize the URI component for this scheme.
	* @property {boolean} [skipNormalize] - Indicates if normalization should be skipped for this scheme.
	* @property {boolean} [absolutePath] - Indicates if the scheme uses absolute paths.
	* @property {boolean} [unicodeSupport] - Indicates if the scheme supports Unicode.
	*/
	/**
	* @param {import('../types/index').URIComponent} wsComponent
	* @returns {boolean}
	*/
	function wsIsSecure(wsComponent) {
		if (wsComponent.secure === true) return true;
		else if (wsComponent.secure === false) return false;
		else if (wsComponent.scheme) return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
		else return false;
	}
	/** @type {SchemeFn} */
	function httpParse(component) {
		if (!component.host) component.error = component.error || "HTTP URIs must have a host.";
		return component;
	}
	/** @type {SchemeFn} */
	function httpSerialize(component) {
		const secure = String(component.scheme).toLowerCase() === "https";
		if (component.port === (secure ? 443 : 80) || component.port === "") component.port = void 0;
		if (!component.path) component.path = "/";
		return component;
	}
	/** @type {SchemeFn} */
	function wsParse(wsComponent) {
		wsComponent.secure = wsIsSecure(wsComponent);
		wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
		wsComponent.path = void 0;
		wsComponent.query = void 0;
		return wsComponent;
	}
	/** @type {SchemeFn} */
	function wsSerialize(wsComponent) {
		if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") wsComponent.port = void 0;
		if (typeof wsComponent.secure === "boolean") {
			wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
			wsComponent.secure = void 0;
		}
		if (wsComponent.resourceName) {
			const [path, query] = wsComponent.resourceName.split("?");
			wsComponent.path = path && path !== "/" ? path : void 0;
			wsComponent.query = query;
			wsComponent.resourceName = void 0;
		}
		wsComponent.fragment = void 0;
		return wsComponent;
	}
	/** @type {SchemeFn} */
	function urnParse(urnComponent, options) {
		if (!urnComponent.path) {
			urnComponent.error = "URN can not be parsed";
			return urnComponent;
		}
		const matches = urnComponent.path.match(URN_REG);
		if (matches) {
			const scheme = options.scheme || urnComponent.scheme || "urn";
			urnComponent.nid = matches[1].toLowerCase();
			urnComponent.nss = matches[2];
			const schemeHandler = getSchemeHandler(`${scheme}:${options.nid || urnComponent.nid}`);
			urnComponent.path = void 0;
			if (schemeHandler) urnComponent = schemeHandler.parse(urnComponent, options);
		} else urnComponent.error = urnComponent.error || "URN can not be parsed.";
		return urnComponent;
	}
	/** @type {SchemeFn} */
	function urnSerialize(urnComponent, options) {
		if (urnComponent.nid === void 0) throw new Error("URN without nid cannot be serialized");
		const scheme = options.scheme || urnComponent.scheme || "urn";
		const nid = urnComponent.nid.toLowerCase();
		const schemeHandler = getSchemeHandler(`${scheme}:${options.nid || nid}`);
		if (schemeHandler) urnComponent = schemeHandler.serialize(urnComponent, options);
		const uriComponent = urnComponent;
		const nss = urnComponent.nss;
		uriComponent.path = `${nid || options.nid}:${nss}`;
		options.skipEscape = true;
		return uriComponent;
	}
	/** @type {SchemeFn} */
	function urnuuidParse(urnComponent, options) {
		const uuidComponent = urnComponent;
		uuidComponent.uuid = uuidComponent.nss;
		uuidComponent.nss = void 0;
		if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) uuidComponent.error = uuidComponent.error || "UUID is not valid.";
		return uuidComponent;
	}
	/** @type {SchemeFn} */
	function urnuuidSerialize(uuidComponent) {
		const urnComponent = uuidComponent;
		urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
		return urnComponent;
	}
	var http = {
		scheme: "http",
		domainHost: true,
		parse: httpParse,
		serialize: httpSerialize
	};
	var https = {
		scheme: "https",
		domainHost: http.domainHost,
		parse: httpParse,
		serialize: httpSerialize
	};
	var ws = {
		scheme: "ws",
		domainHost: true,
		parse: wsParse,
		serialize: wsSerialize
	};
	var SCHEMES = {
		http,
		https,
		ws,
		wss: {
			scheme: "wss",
			domainHost: ws.domainHost,
			parse: ws.parse,
			serialize: ws.serialize
		},
		urn: {
			scheme: "urn",
			parse: urnParse,
			serialize: urnSerialize,
			skipNormalize: true
		},
		"urn:uuid": {
			scheme: "urn:uuid",
			parse: urnuuidParse,
			serialize: urnuuidSerialize,
			skipNormalize: true
		}
	};
	Object.setPrototypeOf(SCHEMES, null);
	/**
	* @param {string|undefined} scheme
	* @returns {SchemeHandler|undefined}
	*/
	function getSchemeHandler(scheme) {
		return scheme && (SCHEMES[scheme] || SCHEMES[scheme.toLowerCase()]) || void 0;
	}
	module.exports = {
		wsIsSecure,
		SCHEMES,
		isValidSchemeName,
		getSchemeHandler
	};
}));
//#endregion
//#region node_modules/fast-uri/index.js
var require_fast_uri = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, escapePreservingEscapes, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
	var { SCHEMES, getSchemeHandler } = require_schemes();
	/**
	* @template {import('./types/index').URIComponent|string} T
	* @param {T} uri
	* @param {import('./types/index').Options} [options]
	* @returns {T}
	*/
	function normalize(uri, options) {
		if (typeof uri === "string") uri = normalizeString(uri, options);
		else if (typeof uri === "object") uri = parse(serialize(uri, options), options);
		return uri;
	}
	/**
	* @param {string} baseURI
	* @param {string} relativeURI
	* @param {import('./types/index').Options} [options]
	* @returns {string}
	*/
	function resolve(baseURI, relativeURI, options) {
		const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
		const { parsed: baseParsed, malformedAuthorityOrPort: baseMalformed } = parseWithStatus(baseURI, schemelessOptions);
		const { parsed: relativeParsed, malformedAuthorityOrPort: relativeMalformed } = parseWithStatus(relativeURI, schemelessOptions);
		if (baseMalformed || relativeMalformed) throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
		const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
		schemelessOptions.skipEscape = true;
		return serialize(resolved, schemelessOptions);
	}
	/**
	* @param {import ('./types/index').URIComponent} base
	* @param {import ('./types/index').URIComponent} relative
	* @param {import('./types/index').Options} [options]
	* @param {boolean} [skipNormalization=false]
	* @returns {import ('./types/index').URIComponent}
	*/
	function resolveComponent(base, relative, options, skipNormalization) {
		/** @type {import('./types/index').URIComponent} */
		const target = {};
		if (!skipNormalization) {
			base = parse(serialize(base, options), options);
			relative = parse(serialize(relative, options), options);
		}
		options = options || {};
		if (!options.tolerant && relative.scheme) {
			target.scheme = relative.scheme;
			target.userinfo = relative.userinfo;
			target.host = relative.host;
			target.port = relative.port;
			target.path = removeDotSegments(relative.path || "");
			target.query = relative.query;
		} else {
			if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
				target.userinfo = relative.userinfo;
				target.host = relative.host;
				target.port = relative.port;
				target.path = removeDotSegments(relative.path || "");
				target.query = relative.query;
			} else {
				if (!relative.path) {
					target.path = base.path;
					if (relative.query !== void 0) target.query = relative.query;
					else target.query = base.query;
				} else {
					if (relative.path[0] === "/") target.path = removeDotSegments(relative.path);
					else {
						if ((base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0) && !base.path) target.path = "/" + relative.path;
						else if (!base.path) target.path = relative.path;
						else target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
						target.path = removeDotSegments(target.path);
					}
					target.query = relative.query;
				}
				target.userinfo = base.userinfo;
				target.host = base.host;
				target.port = base.port;
			}
			target.scheme = base.scheme;
		}
		target.fragment = relative.fragment;
		return target;
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uriA
	* @param {import ('./types/index').URIComponent|string} uriB
	* @param {import ('./types/index').Options} options
	* @returns {boolean}
	*/
	function equal(uriA, uriB, options) {
		const normalizedA = normalizeComparableURI(uriA, options);
		const normalizedB = normalizeComparableURI(uriB, options);
		return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA.toLowerCase() === normalizedB.toLowerCase();
	}
	/**
	* @param {Readonly<import('./types/index').URIComponent>} cmpts
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function serialize(cmpts, opts) {
		const component = {
			host: cmpts.host,
			scheme: cmpts.scheme,
			userinfo: cmpts.userinfo,
			port: cmpts.port,
			path: cmpts.path,
			query: cmpts.query,
			nid: cmpts.nid,
			nss: cmpts.nss,
			uuid: cmpts.uuid,
			fragment: cmpts.fragment,
			reference: cmpts.reference,
			resourceName: cmpts.resourceName,
			secure: cmpts.secure,
			error: ""
		};
		const options = Object.assign({}, opts);
		const uriTokens = [];
		const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
		if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
		if (component.path !== void 0) {
			if (!options.skipEscape) {
				component.path = escapePreservingEscapes(component.path);
				if (component.scheme !== void 0) component.path = component.path.split("%3A").join(":");
			} else component.path = normalizePercentEncoding(component.path);
		}
		if (options.reference !== "suffix" && component.scheme) uriTokens.push(component.scheme, ":");
		const authority = recomposeAuthority(component);
		if (authority !== void 0) {
			if (options.reference !== "suffix") uriTokens.push("//");
			uriTokens.push(authority);
			if (component.path && component.path[0] !== "/") uriTokens.push("/");
		}
		if (component.path !== void 0) {
			let s = component.path;
			if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) s = removeDotSegments(s);
			if (authority === void 0 && s[0] === "/" && s[1] === "/") s = "/%2F" + s.slice(2);
			uriTokens.push(s);
		}
		if (component.query !== void 0) uriTokens.push("?", component.query);
		if (component.fragment !== void 0) uriTokens.push("#", component.fragment);
		return uriTokens.join("");
	}
	var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
	var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
	var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
	/**
	* @param {import('./types/index').URIComponent} parsed
	* @param {RegExpMatchArray} matches
	* @returns {string|undefined}
	*/
	function getParseError(parsed, matches) {
		if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") return "URI path must start with \"/\" when authority is present.";
		if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) return "URI port is malformed.";
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ parsed: import('./types/index').URIComponent, malformedAuthorityOrPort: boolean }}
	*/
	function parseWithStatus(uri, opts) {
		const options = Object.assign({}, opts);
		/** @type {import('./types/index').URIComponent} */
		const parsed = {
			scheme: void 0,
			userinfo: void 0,
			host: "",
			port: void 0,
			path: "",
			query: void 0,
			fragment: void 0
		};
		let malformedAuthorityOrPort = false;
		let isIP = false;
		if (options.reference === "suffix") {
			if (options.scheme) uri = options.scheme + ":" + uri;
			else uri = "//" + uri;
		}
		const authorityMatch = uri.match(AUTHORITY_PREFIX);
		if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
			parsed.error = "URI authority must not contain a literal backslash.";
			malformedAuthorityOrPort = true;
		}
		const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
		if (introducerMatch !== null) {
			const region = introducerMatch[1];
			const normalizedRegion = region.replace(/[\t\n\r]/g, "");
			if (normalizedRegion.length >= 2) {
				if (normalizedRegion.slice(0, 2) !== "//") {
					parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
					malformedAuthorityOrPort = true;
				} else if (region.length !== normalizedRegion.length) {
					parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
					malformedAuthorityOrPort = true;
				}
			}
		}
		const matches = uri.match(URI_PARSE);
		if (matches) {
			parsed.scheme = matches[1];
			parsed.userinfo = matches[3];
			parsed.host = matches[4];
			parsed.port = parseInt(matches[5], 10);
			parsed.path = matches[6] || "";
			parsed.query = matches[7];
			parsed.fragment = matches[8];
			if (isNaN(parsed.port)) parsed.port = matches[5];
			const parseError = getParseError(parsed, matches);
			if (parseError !== void 0) {
				parsed.error = parsed.error || parseError;
				malformedAuthorityOrPort = true;
			}
			if (parsed.host) {
				if (isIPv4(parsed.host) === false) {
					const ipv6result = normalizeIPv6(parsed.host);
					parsed.host = ipv6result.host.toLowerCase();
					isIP = ipv6result.isIPV6;
				} else isIP = true;
			}
			if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) parsed.reference = "same-document";
			else if (parsed.scheme === void 0) parsed.reference = "relative";
			else if (parsed.fragment === void 0) parsed.reference = "absolute";
			else parsed.reference = "uri";
			if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
			const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
			if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
				if (parsed.host && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) try {
					parsed.host = new URL("http://" + parsed.host).hostname;
				} catch (e) {
					parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
				}
			}
			if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
				if (uri.indexOf("%") !== -1) {
					if (parsed.scheme !== void 0) parsed.scheme = unescape(parsed.scheme);
					if (parsed.host !== void 0) parsed.host = reescapeHostDelimiters(unescape(parsed.host), isIP);
				}
				if (parsed.path) parsed.path = normalizePathEncoding(parsed.path);
				if (parsed.fragment) try {
					parsed.fragment = encodeURI(decodeURIComponent(parsed.fragment));
				} catch {
					parsed.error = parsed.error || "URI malformed";
				}
			}
			if (schemeHandler && schemeHandler.parse) schemeHandler.parse(parsed, options);
		} else parsed.error = parsed.error || "URI can not be parsed.";
		return {
			parsed,
			malformedAuthorityOrPort
		};
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns
	*/
	function parse(uri, opts) {
		return parseWithStatus(uri, opts).parsed;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function normalizeString(uri, opts) {
		return normalizeStringWithStatus(uri, opts).normalized;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ normalized: string, malformedAuthorityOrPort: boolean }}
	*/
	function normalizeStringWithStatus(uri, opts) {
		const { parsed, malformedAuthorityOrPort } = parseWithStatus(uri, opts);
		return {
			normalized: malformedAuthorityOrPort ? uri : serialize(parsed, opts),
			malformedAuthorityOrPort
		};
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string|undefined}
	*/
	function normalizeComparableURI(uri, opts) {
		if (typeof uri === "string") {
			const { normalized, malformedAuthorityOrPort } = normalizeStringWithStatus(uri, opts);
			return malformedAuthorityOrPort ? void 0 : normalized;
		}
		if (typeof uri === "object") return serialize(uri, opts);
	}
	var fastUri = {
		SCHEMES,
		normalize,
		resolve,
		resolveComponent,
		equal,
		serialize,
		parse
	};
	module.exports = fastUri;
	module.exports.default = fastUri;
	module.exports.fastUri = fastUri;
}));
//#endregion
//#region node_modules/ajv/dist/runtime/uri.js
var require_uri = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var uri = require_fast_uri();
	uri.code = "require(\"ajv/dist/runtime/uri\").default";
	exports.default = uri;
}));
//#endregion
//#region node_modules/ajv/dist/core.js
var require_core$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
	var validate_1 = require_validate();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error();
	var ref_error_1 = require_ref_error();
	var rules_1 = require_rules();
	var compile_1 = require_compile();
	var codegen_2 = require_codegen();
	var resolve_1 = require_resolve();
	var dataType_1 = require_dataType();
	var util_1 = require_util();
	var $dataRefSchema = (init_data(), __toCommonJS(data_exports).default);
	var uri_1 = require_uri();
	var defaultRegExp = (str, flags) => new RegExp(str, flags);
	defaultRegExp.code = "new RegExp";
	var META_IGNORE_OPTIONS = [
		"removeAdditional",
		"useDefaults",
		"coerceTypes"
	];
	var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
		"validate",
		"serialize",
		"parse",
		"wrapper",
		"root",
		"schema",
		"keyword",
		"pattern",
		"formats",
		"validate$data",
		"func",
		"obj",
		"Error"
	]);
	var removedOptions = {
		errorDataPath: "",
		format: "`validateFormats: false` can be used instead.",
		nullable: "\"nullable\" keyword is supported by default.",
		jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
		extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
		missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
		processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
		sourceCode: "Use option `code: {source: true}`",
		strictDefaults: "It is default now, see option `strict`.",
		strictKeywords: "It is default now, see option `strict`.",
		uniqueItems: "\"uniqueItems\" keyword is always validated.",
		unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
		cache: "Map is used as cache, schema object as key.",
		serialize: "Map is used as cache, schema object as key.",
		ajvErrors: "It is default now."
	};
	var deprecatedOptions = {
		ignoreKeywordsWithRef: "",
		jsPropertySyntax: "",
		unicode: "\"minLength\"/\"maxLength\" account for unicode characters by default."
	};
	var MAX_EXPRESSION = 200;
	function requiredOptions(o) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
		const s = o.strict;
		const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
		const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
		const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
		const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
		return {
			strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
			strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
			strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
			strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
			strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
			code: o.code ? {
				...o.code,
				optimize,
				regExp
			} : {
				optimize,
				regExp
			},
			loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
			loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
			meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
			messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
			inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
			schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
			addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
			validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
			validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
			unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
			int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
			uriResolver
		};
	}
	var Ajv = class {
		constructor(opts = {}) {
			this.schemas = {};
			this.refs = {};
			this.formats = Object.create(null);
			this._compilations = /* @__PURE__ */ new Set();
			this._loading = {};
			this._cache = /* @__PURE__ */ new Map();
			opts = this.opts = {
				...opts,
				...requiredOptions(opts)
			};
			const { es5, lines } = this.opts.code;
			this.scope = new codegen_2.ValueScope({
				scope: {},
				prefixes: EXT_SCOPE_NAMES,
				es5,
				lines
			});
			this.logger = getLogger(opts.logger);
			const formatOpt = opts.validateFormats;
			opts.validateFormats = false;
			this.RULES = (0, rules_1.getRules)();
			checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
			checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
			this._metaOpts = getMetaSchemaOptions.call(this);
			if (opts.formats) addInitialFormats.call(this);
			this._addVocabularies();
			this._addDefaultMetaSchema();
			if (opts.keywords) addInitialKeywords.call(this, opts.keywords);
			if (typeof opts.meta == "object") this.addMetaSchema(opts.meta);
			addInitialSchemas.call(this);
			opts.validateFormats = formatOpt;
		}
		_addVocabularies() {
			this.addKeyword("$async");
		}
		_addDefaultMetaSchema() {
			const { $data, meta, schemaId } = this.opts;
			let _dataRefSchema = $dataRefSchema;
			if (schemaId === "id") {
				_dataRefSchema = { ...$dataRefSchema };
				_dataRefSchema.id = _dataRefSchema.$id;
				delete _dataRefSchema.$id;
			}
			if (meta && $data) this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
		}
		defaultMeta() {
			const { meta, schemaId } = this.opts;
			return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
		}
		validate(schemaKeyRef, data) {
			let v;
			if (typeof schemaKeyRef == "string") {
				v = this.getSchema(schemaKeyRef);
				if (!v) throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
			} else v = this.compile(schemaKeyRef);
			const valid = v(data);
			if (!("$async" in v)) this.errors = v.errors;
			return valid;
		}
		compile(schema, _meta) {
			const sch = this._addSchema(schema, _meta);
			return sch.validate || this._compileSchemaEnv(sch);
		}
		compileAsync(schema, meta) {
			if (typeof this.opts.loadSchema != "function") throw new Error("options.loadSchema should be a function");
			const { loadSchema } = this.opts;
			return runCompileAsync.call(this, schema, meta);
			async function runCompileAsync(_schema, _meta) {
				await loadMetaSchema.call(this, _schema.$schema);
				const sch = this._addSchema(_schema, _meta);
				return sch.validate || _compileAsync.call(this, sch);
			}
			async function loadMetaSchema($ref) {
				if ($ref && !this.getSchema($ref)) await runCompileAsync.call(this, { $ref }, true);
			}
			async function _compileAsync(sch) {
				try {
					return this._compileSchemaEnv(sch);
				} catch (e) {
					if (!(e instanceof ref_error_1.default)) throw e;
					checkLoaded.call(this, e);
					await loadMissingSchema.call(this, e.missingSchema);
					return _compileAsync.call(this, sch);
				}
			}
			function checkLoaded({ missingSchema: ref, missingRef }) {
				if (this.refs[ref]) throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
			}
			async function loadMissingSchema(ref) {
				const _schema = await _loadSchema.call(this, ref);
				if (!this.refs[ref]) await loadMetaSchema.call(this, _schema.$schema);
				if (!this.refs[ref]) this.addSchema(_schema, ref, meta);
			}
			async function _loadSchema(ref) {
				const p = this._loading[ref];
				if (p) return p;
				try {
					return await (this._loading[ref] = loadSchema(ref));
				} finally {
					delete this._loading[ref];
				}
			}
		}
		addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
			if (Array.isArray(schema)) {
				for (const sch of schema) this.addSchema(sch, void 0, _meta, _validateSchema);
				return this;
			}
			let id;
			if (typeof schema === "object") {
				const { schemaId } = this.opts;
				id = schema[schemaId];
				if (id !== void 0 && typeof id != "string") throw new Error(`schema ${schemaId} must be string`);
			}
			key = (0, resolve_1.normalizeId)(key || id);
			this._checkUnique(key);
			this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
			return this;
		}
		addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
			this.addSchema(schema, key, true, _validateSchema);
			return this;
		}
		validateSchema(schema, throwOrLogError) {
			if (typeof schema == "boolean") return true;
			let $schema;
			$schema = schema.$schema;
			if ($schema !== void 0 && typeof $schema != "string") throw new Error("$schema must be a string");
			$schema = $schema || this.opts.defaultMeta || this.defaultMeta();
			if (!$schema) {
				this.logger.warn("meta-schema not available");
				this.errors = null;
				return true;
			}
			const valid = this.validate($schema, schema);
			if (!valid && throwOrLogError) {
				const message = "schema is invalid: " + this.errorsText();
				if (this.opts.validateSchema === "log") this.logger.error(message);
				else throw new Error(message);
			}
			return valid;
		}
		getSchema(keyRef) {
			let sch;
			while (typeof (sch = getSchEnv.call(this, keyRef)) == "string") keyRef = sch;
			if (sch === void 0) {
				const { schemaId } = this.opts;
				const root = new compile_1.SchemaEnv({
					schema: {},
					schemaId
				});
				sch = compile_1.resolveSchema.call(this, root, keyRef);
				if (!sch) return;
				this.refs[keyRef] = sch;
			}
			return sch.validate || this._compileSchemaEnv(sch);
		}
		removeSchema(schemaKeyRef) {
			if (schemaKeyRef instanceof RegExp) {
				this._removeAllSchemas(this.schemas, schemaKeyRef);
				this._removeAllSchemas(this.refs, schemaKeyRef);
				return this;
			}
			switch (typeof schemaKeyRef) {
				case "undefined":
					this._removeAllSchemas(this.schemas);
					this._removeAllSchemas(this.refs);
					this._cache.clear();
					return this;
				case "string": {
					const sch = getSchEnv.call(this, schemaKeyRef);
					if (typeof sch == "object") this._cache.delete(sch.schema);
					delete this.schemas[schemaKeyRef];
					delete this.refs[schemaKeyRef];
					return this;
				}
				case "object": {
					const cacheKey = schemaKeyRef;
					this._cache.delete(cacheKey);
					let id = schemaKeyRef[this.opts.schemaId];
					if (id) {
						id = (0, resolve_1.normalizeId)(id);
						delete this.schemas[id];
						delete this.refs[id];
					}
					return this;
				}
				default: throw new Error("ajv.removeSchema: invalid parameter");
			}
		}
		addVocabulary(definitions) {
			for (const def of definitions) this.addKeyword(def);
			return this;
		}
		addKeyword(kwdOrDef, def) {
			let keyword;
			if (typeof kwdOrDef == "string") {
				keyword = kwdOrDef;
				if (typeof def == "object") {
					this.logger.warn("these parameters are deprecated, see docs for addKeyword");
					def.keyword = keyword;
				}
			} else if (typeof kwdOrDef == "object" && def === void 0) {
				def = kwdOrDef;
				keyword = def.keyword;
				if (Array.isArray(keyword) && !keyword.length) throw new Error("addKeywords: keyword must be string or non-empty array");
			} else throw new Error("invalid addKeywords parameters");
			checkKeyword.call(this, keyword, def);
			if (!def) {
				(0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
				return this;
			}
			keywordMetaschema.call(this, def);
			const definition = {
				...def,
				type: (0, dataType_1.getJSONTypes)(def.type),
				schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
			};
			(0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
			return this;
		}
		getKeyword(keyword) {
			const rule = this.RULES.all[keyword];
			return typeof rule == "object" ? rule.definition : !!rule;
		}
		removeKeyword(keyword) {
			const { RULES } = this;
			delete RULES.keywords[keyword];
			delete RULES.all[keyword];
			for (const group of RULES.rules) {
				const i = group.rules.findIndex((rule) => rule.keyword === keyword);
				if (i >= 0) group.rules.splice(i, 1);
			}
			return this;
		}
		addFormat(name, format) {
			if (typeof format == "string") format = new RegExp(format);
			this.formats[name] = format;
			return this;
		}
		errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
			if (!errors || errors.length === 0) return "No errors";
			return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
		}
		$dataMetaSchema(metaSchema, keywordsJsonPointers) {
			const rules = this.RULES.all;
			metaSchema = JSON.parse(JSON.stringify(metaSchema));
			for (const jsonPointer of keywordsJsonPointers) {
				const segments = jsonPointer.split("/").slice(1);
				let keywords = metaSchema;
				for (const seg of segments) keywords = keywords[seg];
				for (const key in rules) {
					const rule = rules[key];
					if (typeof rule != "object") continue;
					const { $data } = rule.definition;
					const schema = keywords[key];
					if ($data && schema) keywords[key] = schemaOrData(schema);
				}
			}
			return metaSchema;
		}
		_removeAllSchemas(schemas, regex) {
			for (const keyRef in schemas) {
				const sch = schemas[keyRef];
				if (!regex || regex.test(keyRef)) {
					if (typeof sch == "string") delete schemas[keyRef];
					else if (sch && !sch.meta) {
						this._cache.delete(sch.schema);
						delete schemas[keyRef];
					}
				}
			}
		}
		_addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
			let id;
			const { schemaId } = this.opts;
			if (typeof schema == "object") id = schema[schemaId];
			else if (this.opts.jtd) throw new Error("schema must be object");
			else if (typeof schema != "boolean") throw new Error("schema must be object or boolean");
			let sch = this._cache.get(schema);
			if (sch !== void 0) return sch;
			baseId = (0, resolve_1.normalizeId)(id || baseId);
			const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
			sch = new compile_1.SchemaEnv({
				schema,
				schemaId,
				meta,
				baseId,
				localRefs
			});
			this._cache.set(sch.schema, sch);
			if (addSchema && !baseId.startsWith("#")) {
				if (baseId) this._checkUnique(baseId);
				this.refs[baseId] = sch;
			}
			if (validateSchema) this.validateSchema(schema, true);
			return sch;
		}
		_checkUnique(id) {
			if (this.schemas[id] || this.refs[id]) throw new Error(`schema with key or id "${id}" already exists`);
		}
		_compileSchemaEnv(sch) {
			if (sch.meta) this._compileMetaSchema(sch);
			else compile_1.compileSchema.call(this, sch);
			/* istanbul ignore if */
			if (!sch.validate) throw new Error("ajv implementation error");
			return sch.validate;
		}
		_compileMetaSchema(sch) {
			const currentOpts = this.opts;
			this.opts = this._metaOpts;
			try {
				compile_1.compileSchema.call(this, sch);
			} finally {
				this.opts = currentOpts;
			}
		}
	};
	Ajv.ValidationError = validation_error_1.default;
	Ajv.MissingRefError = ref_error_1.default;
	exports.default = Ajv;
	function checkOptions(checkOpts, options, msg, log = "error") {
		for (const key in checkOpts) {
			const opt = key;
			if (opt in options) this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
		}
	}
	function getSchEnv(keyRef) {
		keyRef = (0, resolve_1.normalizeId)(keyRef);
		return this.schemas[keyRef] || this.refs[keyRef];
	}
	function addInitialSchemas() {
		const optsSchemas = this.opts.schemas;
		if (!optsSchemas) return;
		if (Array.isArray(optsSchemas)) this.addSchema(optsSchemas);
		else for (const key in optsSchemas) this.addSchema(optsSchemas[key], key);
	}
	function addInitialFormats() {
		for (const name in this.opts.formats) {
			const format = this.opts.formats[name];
			if (format) this.addFormat(name, format);
		}
	}
	function addInitialKeywords(defs) {
		if (Array.isArray(defs)) {
			this.addVocabulary(defs);
			return;
		}
		this.logger.warn("keywords option as map is deprecated, pass array");
		for (const keyword in defs) {
			const def = defs[keyword];
			if (!def.keyword) def.keyword = keyword;
			this.addKeyword(def);
		}
	}
	function getMetaSchemaOptions() {
		const metaOpts = { ...this.opts };
		for (const opt of META_IGNORE_OPTIONS) delete metaOpts[opt];
		return metaOpts;
	}
	var noLogs = {
		log() {},
		warn() {},
		error() {}
	};
	function getLogger(logger) {
		if (logger === false) return noLogs;
		if (logger === void 0) return console;
		if (logger.log && logger.warn && logger.error) return logger;
		throw new Error("logger must implement log, warn and error methods");
	}
	var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
	function checkKeyword(keyword, def) {
		const { RULES } = this;
		(0, util_1.eachItem)(keyword, (kwd) => {
			if (RULES.keywords[kwd]) throw new Error(`Keyword ${kwd} is already defined`);
			if (!KEYWORD_NAME.test(kwd)) throw new Error(`Keyword ${kwd} has invalid name`);
		});
		if (!def) return;
		if (def.$data && !("code" in def || "validate" in def)) throw new Error("$data keyword must have \"code\" or \"validate\" function");
	}
	function addRule(keyword, definition, dataType) {
		var _a;
		const post = definition === null || definition === void 0 ? void 0 : definition.post;
		if (dataType && post) throw new Error("keyword with \"post\" flag cannot have \"type\"");
		const { RULES } = this;
		let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
		if (!ruleGroup) {
			ruleGroup = {
				type: dataType,
				rules: []
			};
			RULES.rules.push(ruleGroup);
		}
		RULES.keywords[keyword] = true;
		if (!definition) return;
		const rule = {
			keyword,
			definition: {
				...definition,
				type: (0, dataType_1.getJSONTypes)(definition.type),
				schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
			}
		};
		if (definition.before) addBeforeRule.call(this, ruleGroup, rule, definition.before);
		else ruleGroup.rules.push(rule);
		RULES.all[keyword] = rule;
		(_a = definition.implements) === null || _a === void 0 || _a.forEach((kwd) => this.addKeyword(kwd));
	}
	function addBeforeRule(ruleGroup, rule, before) {
		const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
		if (i >= 0) ruleGroup.rules.splice(i, 0, rule);
		else {
			ruleGroup.rules.push(rule);
			this.logger.warn(`rule ${before} is not defined`);
		}
	}
	function keywordMetaschema(def) {
		let { metaSchema } = def;
		if (metaSchema === void 0) return;
		if (def.$data && this.opts.$data) metaSchema = schemaOrData(metaSchema);
		def.validateSchema = this.compile(metaSchema, true);
	}
	var $dataRef = { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" };
	function schemaOrData(schema) {
		return { anyOf: [schema, $dataRef] };
	}
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/core/id.js
var require_id = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "id",
		code() {
			throw new Error("NOT SUPPORTED: keyword \"id\", use \"$id\" for schema ID");
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.callRef = exports.getValidate = void 0;
	var ref_error_1 = require_ref_error();
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var compile_1 = require_compile();
	var util_1 = require_util();
	var def = {
		keyword: "$ref",
		schemaType: "string",
		code(cxt) {
			const { gen, schema: $ref, it } = cxt;
			const { baseId, schemaEnv: env, validateName, opts, self } = it;
			const { root } = env;
			if (($ref === "#" || $ref === "#/") && baseId === root.baseId) return callRootRef();
			const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
			if (schOrEnv === void 0) throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
			if (schOrEnv instanceof compile_1.SchemaEnv) return callValidate(schOrEnv);
			return inlineRefSchema(schOrEnv);
			function callRootRef() {
				if (env === root) return callRef(cxt, validateName, env, env.$async);
				const rootName = gen.scopeValue("root", { ref: root });
				return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
			}
			function callValidate(sch) {
				callRef(cxt, getValidate(cxt, sch), sch, sch.$async);
			}
			function inlineRefSchema(sch) {
				const schName = gen.scopeValue("schema", opts.code.source === true ? {
					ref: sch,
					code: (0, codegen_1.stringify)(sch)
				} : { ref: sch });
				const valid = gen.name("valid");
				const schCxt = cxt.subschema({
					schema: sch,
					dataTypes: [],
					schemaPath: codegen_1.nil,
					topSchemaRef: schName,
					errSchemaPath: $ref
				}, valid);
				cxt.mergeEvaluated(schCxt);
				cxt.ok(valid);
			}
		}
	};
	function getValidate(cxt, sch) {
		const { gen } = cxt;
		return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
	}
	exports.getValidate = getValidate;
	function callRef(cxt, v, sch, $async) {
		const { gen, it } = cxt;
		const { allErrors, schemaEnv: env, opts } = it;
		const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
		if ($async) callAsyncRef();
		else callSyncRef();
		function callAsyncRef() {
			if (!env.$async) throw new Error("async schema referenced by sync schema");
			const valid = gen.let("valid");
			gen.try(() => {
				gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
				addEvaluatedFrom(v);
				if (!allErrors) gen.assign(valid, true);
			}, (e) => {
				gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
				addErrorsFrom(e);
				if (!allErrors) gen.assign(valid, false);
			});
			cxt.ok(valid);
		}
		function callSyncRef() {
			cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
		}
		function addErrorsFrom(source) {
			const errs = (0, codegen_1._)`${source}.errors`;
			gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
			gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
		}
		function addEvaluatedFrom(source) {
			var _a;
			if (!it.opts.unevaluated) return;
			const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
			if (it.props !== true) {
				if (schEvaluated && !schEvaluated.dynamicProps) {
					if (schEvaluated.props !== void 0) it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
				} else {
					const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
					it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
				}
			}
			if (it.items !== true) {
				if (schEvaluated && !schEvaluated.dynamicItems) {
					if (schEvaluated.items !== void 0) it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
				} else {
					const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
					it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
				}
			}
		}
	}
	exports.callRef = callRef;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/core/index.js
var require_core = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var id_1 = require_id();
	var ref_1 = require_ref();
	exports.default = [
		"$schema",
		"$id",
		"$defs",
		"$vocabulary",
		{ keyword: "$comment" },
		"definitions",
		id_1.default,
		ref_1.default
	];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var ops = codegen_1.operators;
	var KWDs = {
		maximum: {
			okStr: "<=",
			ok: ops.LTE,
			fail: ops.GT
		},
		minimum: {
			okStr: ">=",
			ok: ops.GTE,
			fail: ops.LT
		},
		exclusiveMaximum: {
			okStr: "<",
			ok: ops.LT,
			fail: ops.GTE
		},
		exclusiveMinimum: {
			okStr: ">",
			ok: ops.GT,
			fail: ops.LTE
		}
	};
	exports.default = {
		keyword: Object.keys(KWDs),
		type: "number",
		schemaType: "number",
		$data: true,
		error: {
			message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
			params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "multipleOf",
		type: "number",
		schemaType: "number",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
			params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, schemaCode, it } = cxt;
			const prec = it.opts.multipleOfPrecision;
			const res = gen.let("res");
			const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
			cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function ucs2length(str) {
		const len = str.length;
		let length = 0;
		let pos = 0;
		let value;
		while (pos < len) {
			length++;
			value = str.charCodeAt(pos++);
			if (value >= 55296 && value <= 56319 && pos < len) {
				value = str.charCodeAt(pos);
				if ((value & 64512) === 56320) pos++;
			}
		}
		return length;
	}
	exports.default = ucs2length;
	ucs2length.code = "require(\"ajv/dist/runtime/ucs2length\").default";
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var ucs2length_1 = require_ucs2length();
	exports.default = {
		keyword: ["maxLength", "minLength"],
		type: "string",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxLength" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode, it } = cxt;
			const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
			const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
			cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var util_1 = require_util();
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "pattern",
		type: "string",
		schemaType: "string",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
			params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			const u = it.opts.unicodeRegExp ? "u" : "";
			if ($data) {
				const { regExp } = it.opts.code;
				const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
				const valid = gen.let("valid");
				gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
				cxt.fail$data((0, codegen_1._)`!${valid}`);
			} else {
				const regExp = (0, code_1.usePattern)(cxt, schema);
				cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: ["maxProperties", "minProperties"],
		type: "object",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxProperties" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
			cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "required",
		type: "object",
		schemaType: "array",
		$data: true,
		error: {
			message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
			params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
		},
		code(cxt) {
			const { gen, schema, schemaCode, data, $data, it } = cxt;
			const { opts } = it;
			if (!$data && schema.length === 0) return;
			const useLoop = schema.length >= opts.loopRequired;
			if (it.allErrors) allErrorsMode();
			else exitOnErrorMode();
			if (opts.strictRequired) {
				const props = cxt.parentSchema.properties;
				const { definedProperties } = cxt.it;
				for (const requiredKey of schema) if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
					const msg = `required property "${requiredKey}" is not defined at "${it.schemaEnv.baseId + it.errSchemaPath}" (strictRequired)`;
					(0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
				}
			}
			function allErrorsMode() {
				if (useLoop || $data) cxt.block$data(codegen_1.nil, loopAllRequired);
				else for (const prop of schema) (0, code_1.checkReportMissingProp)(cxt, prop);
			}
			function exitOnErrorMode() {
				const missing = gen.let("missing");
				if (useLoop || $data) {
					const valid = gen.let("valid", true);
					cxt.block$data(valid, () => loopUntilMissing(missing, valid));
					cxt.ok(valid);
				} else {
					gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
					(0, code_1.reportMissingProp)(cxt, missing);
					gen.else();
				}
			}
			function loopAllRequired() {
				gen.forOf("prop", schemaCode, (prop) => {
					cxt.setParams({ missingProperty: prop });
					gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
				});
			}
			function loopUntilMissing(missing, valid) {
				cxt.setParams({ missingProperty: missing });
				gen.forOf(missing, schemaCode, () => {
					gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
					gen.if((0, codegen_1.not)(valid), () => {
						cxt.error();
						gen.break();
					});
				}, codegen_1.nil);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: ["maxItems", "minItems"],
		type: "array",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxItems" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
			cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/runtime/equal.js
var require_equal = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var equal = require_fast_deep_equal();
	equal.code = "require(\"ajv/dist/runtime/equal\").default";
	exports.default = equal;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dataType_1 = require_dataType();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "uniqueItems",
		type: "array",
		schemaType: "boolean",
		$data: true,
		error: {
			message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
			params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
			if (!$data && !schema) return;
			const valid = gen.let("valid");
			const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
			cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
			cxt.ok(valid);
			function validateUniqueItems() {
				const i = gen.let("i", (0, codegen_1._)`${data}.length`);
				const j = gen.let("j");
				cxt.setParams({
					i,
					j
				});
				gen.assign(valid, true);
				gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
			}
			function canOptimize() {
				return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
			}
			function loopN(i, j) {
				const item = gen.name("item");
				const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
				const indices = gen.const("indices", (0, codegen_1._)`{}`);
				gen.for((0, codegen_1._)`;${i}--;`, () => {
					gen.let(item, (0, codegen_1._)`${data}[${i}]`);
					gen.if(wrongType, (0, codegen_1._)`continue`);
					if (itemTypes.length > 1) gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
					gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
						gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
						cxt.error();
						gen.assign(valid, false).break();
					}).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
				});
			}
			function loopN2(i, j) {
				const eql = (0, util_1.useFunc)(gen, equal_1.default);
				const outer = gen.name("outer");
				gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
					cxt.error();
					gen.assign(valid, false).break(outer);
				})));
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "const",
		$data: true,
		error: {
			message: "must be equal to constant",
			params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schemaCode, schema } = cxt;
			if ($data || schema && typeof schema == "object") cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
			else cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "enum",
		schemaType: "array",
		$data: true,
		error: {
			message: "must be equal to one of the allowed values",
			params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			if (!$data && schema.length === 0) throw new Error("enum must have non-empty array");
			const useLoop = schema.length >= it.opts.loopEnum;
			let eql;
			const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
			let valid;
			if (useLoop || $data) {
				valid = gen.let("valid");
				cxt.block$data(valid, loopEnum);
			} else {
				/* istanbul ignore if */
				if (!Array.isArray(schema)) throw new Error("ajv implementation error");
				const vSchema = gen.const("vSchema", schemaCode);
				valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
			}
			cxt.pass(valid);
			function loopEnum() {
				gen.assign(valid, false);
				gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
			}
			function equalCode(vSchema, i) {
				const sch = schema[i];
				return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var limitNumber_1 = require_limitNumber();
	var multipleOf_1 = require_multipleOf();
	var limitLength_1 = require_limitLength();
	var pattern_1 = require_pattern();
	var limitProperties_1 = require_limitProperties();
	var required_1 = require_required();
	var limitItems_1 = require_limitItems();
	var uniqueItems_1 = require_uniqueItems();
	var const_1 = require_const();
	var enum_1 = require_enum();
	exports.default = [
		limitNumber_1.default,
		multipleOf_1.default,
		limitLength_1.default,
		pattern_1.default,
		limitProperties_1.default,
		required_1.default,
		limitItems_1.default,
		uniqueItems_1.default,
		{
			keyword: "type",
			schemaType: ["string", "array"]
		},
		{
			keyword: "nullable",
			schemaType: "boolean"
		},
		const_1.default,
		enum_1.default
	];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateAdditionalItems = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var def = {
		keyword: "additionalItems",
		type: "array",
		schemaType: ["boolean", "object"],
		before: "uniqueItems",
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { parentSchema, it } = cxt;
			const { items } = parentSchema;
			if (!Array.isArray(items)) {
				(0, util_1.checkStrictMode)(it, "\"additionalItems\" is ignored when \"items\" is not an array of schemas");
				return;
			}
			validateAdditionalItems(cxt, items);
		}
	};
	function validateAdditionalItems(cxt, items) {
		const { gen, schema, data, keyword, it } = cxt;
		it.items = true;
		const len = gen.const("len", (0, codegen_1._)`${data}.length`);
		if (schema === false) {
			cxt.setParams({ len: items.length });
			cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
		} else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
			const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
			gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
			cxt.ok(valid);
		}
		function validateItems(valid) {
			gen.forRange("i", items.length, len, (i) => {
				cxt.subschema({
					keyword,
					dataProp: i,
					dataPropType: util_1.Type.Num
				}, valid);
				if (!it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
			});
		}
	}
	exports.validateAdditionalItems = validateAdditionalItems;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateTuple = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	var def = {
		keyword: "items",
		type: "array",
		schemaType: [
			"object",
			"array",
			"boolean"
		],
		before: "uniqueItems",
		code(cxt) {
			const { schema, it } = cxt;
			if (Array.isArray(schema)) return validateTuple(cxt, "additionalItems", schema);
			it.items = true;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			cxt.ok((0, code_1.validateArray)(cxt));
		}
	};
	function validateTuple(cxt, extraItems, schArr = cxt.schema) {
		const { gen, parentSchema, data, keyword, it } = cxt;
		checkStrictTuple(parentSchema);
		if (it.opts.unevaluated && schArr.length && it.items !== true) it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
		const valid = gen.name("valid");
		const len = gen.const("len", (0, codegen_1._)`${data}.length`);
		schArr.forEach((sch, i) => {
			if ((0, util_1.alwaysValidSchema)(it, sch)) return;
			gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
				keyword,
				schemaProp: i,
				dataProp: i
			}, valid));
			cxt.ok(valid);
		});
		function checkStrictTuple(sch) {
			const { opts, errSchemaPath } = it;
			const l = schArr.length;
			const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
			if (opts.strictTuples && !fullTuple) {
				const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
				(0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
			}
		}
	}
	exports.validateTuple = validateTuple;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var items_1 = require_items();
	exports.default = {
		keyword: "prefixItems",
		type: "array",
		schemaType: ["array"],
		before: "uniqueItems",
		code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	var additionalItems_1 = require_additionalItems();
	exports.default = {
		keyword: "items",
		type: "array",
		schemaType: ["object", "boolean"],
		before: "uniqueItems",
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { schema, parentSchema, it } = cxt;
			const { prefixItems } = parentSchema;
			it.items = true;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			if (prefixItems) (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
			else cxt.ok((0, code_1.validateArray)(cxt));
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "contains",
		type: "array",
		schemaType: ["object", "boolean"],
		before: "uniqueItems",
		trackErrors: true,
		error: {
			message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
			params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, data, it } = cxt;
			let min;
			let max;
			const { minContains, maxContains } = parentSchema;
			if (it.opts.next) {
				min = minContains === void 0 ? 1 : minContains;
				max = maxContains;
			} else min = 1;
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			cxt.setParams({
				min,
				max
			});
			if (max === void 0 && min === 0) {
				(0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
				return;
			}
			if (max !== void 0 && min > max) {
				(0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
				cxt.fail();
				return;
			}
			if ((0, util_1.alwaysValidSchema)(it, schema)) {
				let cond = (0, codegen_1._)`${len} >= ${min}`;
				if (max !== void 0) cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
				cxt.pass(cond);
				return;
			}
			it.items = true;
			const valid = gen.name("valid");
			if (max === void 0 && min === 1) validateItems(valid, () => gen.if(valid, () => gen.break()));
			else if (min === 0) {
				gen.let(valid, true);
				if (max !== void 0) gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
			} else {
				gen.let(valid, false);
				validateItemsWithCount();
			}
			cxt.result(valid, () => cxt.reset());
			function validateItemsWithCount() {
				const schValid = gen.name("_valid");
				const count = gen.let("count", 0);
				validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
			}
			function validateItems(_valid, block) {
				gen.forRange("i", 0, len, (i) => {
					cxt.subschema({
						keyword: "contains",
						dataProp: i,
						dataPropType: util_1.Type.Num,
						compositeRule: true
					}, _valid);
					block();
				});
			}
			function checkLimits(count) {
				gen.code((0, codegen_1._)`${count}++`);
				if (max === void 0) gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
				else {
					gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
					if (min === 1) gen.assign(valid, true);
					else gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	exports.error = {
		message: ({ params: { property, depsCount, deps } }) => {
			const property_ies = depsCount === 1 ? "property" : "properties";
			return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
		},
		params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
	};
	var def = {
		keyword: "dependencies",
		type: "object",
		schemaType: "object",
		error: exports.error,
		code(cxt) {
			const [propDeps, schDeps] = splitDependencies(cxt);
			validatePropertyDeps(cxt, propDeps);
			validateSchemaDeps(cxt, schDeps);
		}
	};
	function splitDependencies({ schema }) {
		const propertyDeps = {};
		const schemaDeps = {};
		for (const key in schema) {
			if (key === "__proto__") continue;
			const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
			deps[key] = schema[key];
		}
		return [propertyDeps, schemaDeps];
	}
	function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
		const { gen, data, it } = cxt;
		if (Object.keys(propertyDeps).length === 0) return;
		const missing = gen.let("missing");
		for (const prop in propertyDeps) {
			const deps = propertyDeps[prop];
			if (deps.length === 0) continue;
			const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
			cxt.setParams({
				property: prop,
				depsCount: deps.length,
				deps: deps.join(", ")
			});
			if (it.allErrors) gen.if(hasProperty, () => {
				for (const depProp of deps) (0, code_1.checkReportMissingProp)(cxt, depProp);
			});
			else {
				gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
				(0, code_1.reportMissingProp)(cxt, missing);
				gen.else();
			}
		}
	}
	exports.validatePropertyDeps = validatePropertyDeps;
	function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
		const { gen, data, keyword, it } = cxt;
		const valid = gen.name("valid");
		for (const prop in schemaDeps) {
			if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop])) continue;
			gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties), () => {
				const schCxt = cxt.subschema({
					keyword,
					schemaProp: prop
				}, valid);
				cxt.mergeValidEvaluated(schCxt, valid);
			}, () => gen.var(valid, true));
			cxt.ok(valid);
		}
	}
	exports.validateSchemaDeps = validateSchemaDeps;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "propertyNames",
		type: "object",
		schemaType: ["object", "boolean"],
		error: {
			message: "property name must be valid",
			params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
		},
		code(cxt) {
			const { gen, schema, data, it } = cxt;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			const valid = gen.name("valid");
			gen.forIn("key", data, (key) => {
				cxt.setParams({ propertyName: key });
				cxt.subschema({
					keyword: "propertyNames",
					data: key,
					dataTypes: ["string"],
					propertyName: key,
					compositeRule: true
				}, valid);
				gen.if((0, codegen_1.not)(valid), () => {
					cxt.error(true);
					if (!it.allErrors) gen.break();
				});
			});
			cxt.ok(valid);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var util_1 = require_util();
	exports.default = {
		keyword: "additionalProperties",
		type: ["object"],
		schemaType: ["boolean", "object"],
		allowUndefined: true,
		trackErrors: true,
		error: {
			message: "must NOT have additional properties",
			params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, data, errsCount, it } = cxt;
			/* istanbul ignore if */
			if (!errsCount) throw new Error("ajv implementation error");
			const { allErrors, opts } = it;
			it.props = true;
			if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema)) return;
			const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
			const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
			checkAdditionalProperties();
			cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
			function checkAdditionalProperties() {
				gen.forIn("key", data, (key) => {
					if (!props.length && !patProps.length) additionalPropertyCode(key);
					else gen.if(isAdditional(key), () => additionalPropertyCode(key));
				});
			}
			function isAdditional(key) {
				let definedProp;
				if (props.length > 8) {
					const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
					definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
				} else if (props.length) definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
				else definedProp = codegen_1.nil;
				if (patProps.length) definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
				return (0, codegen_1.not)(definedProp);
			}
			function deleteAdditional(key) {
				gen.code((0, codegen_1._)`delete ${data}[${key}]`);
			}
			function additionalPropertyCode(key) {
				if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
					deleteAdditional(key);
					return;
				}
				if (schema === false) {
					cxt.setParams({ additionalProperty: key });
					cxt.error();
					if (!allErrors) gen.break();
					return;
				}
				if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
					const valid = gen.name("valid");
					if (opts.removeAdditional === "failing") {
						applyAdditionalSchema(key, valid, false);
						gen.if((0, codegen_1.not)(valid), () => {
							cxt.reset();
							deleteAdditional(key);
						});
					} else {
						applyAdditionalSchema(key, valid);
						if (!allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
					}
				}
			}
			function applyAdditionalSchema(key, valid, errors) {
				const subschema = {
					keyword: "additionalProperties",
					dataProp: key,
					dataPropType: util_1.Type.Str
				};
				if (errors === false) Object.assign(subschema, {
					compositeRule: true,
					createErrors: false,
					allErrors: false
				});
				cxt.subschema(subschema, valid);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var validate_1 = require_validate();
	var code_1 = require_code();
	var util_1 = require_util();
	var additionalProperties_1 = require_additionalProperties();
	exports.default = {
		keyword: "properties",
		type: "object",
		schemaType: "object",
		code(cxt) {
			const { gen, schema, parentSchema, data, it } = cxt;
			if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
			const allProps = (0, code_1.allSchemaProperties)(schema);
			for (const prop of allProps) it.definedProperties.add(prop);
			if (it.opts.unevaluated && allProps.length && it.props !== true) it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
			const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
			if (properties.length === 0) return;
			const valid = gen.name("valid");
			for (const prop of properties) {
				if (hasDefault(prop)) applyPropertySchema(prop);
				else {
					gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
					applyPropertySchema(prop);
					if (!it.allErrors) gen.else().var(valid, true);
					gen.endIf();
				}
				cxt.it.definedProperties.add(prop);
				cxt.ok(valid);
			}
			function hasDefault(prop) {
				return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
			}
			function applyPropertySchema(prop) {
				cxt.subschema({
					keyword: "properties",
					schemaProp: prop,
					dataProp: prop
				}, valid);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var util_2 = require_util();
	exports.default = {
		keyword: "patternProperties",
		type: "object",
		schemaType: "object",
		code(cxt) {
			const { gen, schema, data, parentSchema, it } = cxt;
			const { opts } = it;
			const patterns = (0, code_1.allSchemaProperties)(schema);
			const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
			if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) return;
			const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
			const valid = gen.name("valid");
			if (it.props !== true && !(it.props instanceof codegen_1.Name)) it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
			const { props } = it;
			validatePatternProperties();
			function validatePatternProperties() {
				for (const pat of patterns) {
					if (checkProperties) checkMatchingProperties(pat);
					if (it.allErrors) validateProperties(pat);
					else {
						gen.var(valid, true);
						validateProperties(pat);
						gen.if(valid);
					}
				}
			}
			function checkMatchingProperties(pat) {
				for (const prop in checkProperties) if (new RegExp(pat).test(prop)) (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
			}
			function validateProperties(pat) {
				gen.forIn("key", data, (key) => {
					gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
						const alwaysValid = alwaysValidPatterns.includes(pat);
						if (!alwaysValid) cxt.subschema({
							keyword: "patternProperties",
							schemaProp: pat,
							dataProp: key,
							dataPropType: util_2.Type.Str
						}, valid);
						if (it.opts.unevaluated && props !== true) gen.assign((0, codegen_1._)`${props}[${key}]`, true);
						else if (!alwaysValid && !it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
					});
				});
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: "not",
		schemaType: ["object", "boolean"],
		trackErrors: true,
		code(cxt) {
			const { gen, schema, it } = cxt;
			if ((0, util_1.alwaysValidSchema)(it, schema)) {
				cxt.fail();
				return;
			}
			const valid = gen.name("valid");
			cxt.subschema({
				keyword: "not",
				compositeRule: true,
				createErrors: false,
				allErrors: false
			}, valid);
			cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
		},
		error: { message: "must NOT be valid" }
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "anyOf",
		schemaType: "array",
		trackErrors: true,
		code: require_code().validateUnion,
		error: { message: "must match a schema in anyOf" }
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "oneOf",
		schemaType: "array",
		trackErrors: true,
		error: {
			message: "must match exactly one schema in oneOf",
			params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, it } = cxt;
			/* istanbul ignore if */
			if (!Array.isArray(schema)) throw new Error("ajv implementation error");
			if (it.opts.discriminator && parentSchema.discriminator) return;
			const schArr = schema;
			const valid = gen.let("valid", false);
			const passing = gen.let("passing", null);
			const schValid = gen.name("_valid");
			cxt.setParams({ passing });
			gen.block(validateOneOf);
			cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
			function validateOneOf() {
				schArr.forEach((sch, i) => {
					let schCxt;
					if ((0, util_1.alwaysValidSchema)(it, sch)) gen.var(schValid, true);
					else schCxt = cxt.subschema({
						keyword: "oneOf",
						schemaProp: i,
						compositeRule: true
					}, schValid);
					if (i > 0) gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
					gen.if(schValid, () => {
						gen.assign(valid, true);
						gen.assign(passing, i);
						if (schCxt) cxt.mergeEvaluated(schCxt, codegen_1.Name);
					});
				});
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: "allOf",
		schemaType: "array",
		code(cxt) {
			const { gen, schema, it } = cxt;
			/* istanbul ignore if */
			if (!Array.isArray(schema)) throw new Error("ajv implementation error");
			const valid = gen.name("valid");
			schema.forEach((sch, i) => {
				if ((0, util_1.alwaysValidSchema)(it, sch)) return;
				const schCxt = cxt.subschema({
					keyword: "allOf",
					schemaProp: i
				}, valid);
				cxt.ok(valid);
				cxt.mergeEvaluated(schCxt);
			});
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var def = {
		keyword: "if",
		schemaType: ["object", "boolean"],
		trackErrors: true,
		error: {
			message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
			params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
		},
		code(cxt) {
			const { gen, parentSchema, it } = cxt;
			if (parentSchema.then === void 0 && parentSchema.else === void 0) (0, util_1.checkStrictMode)(it, "\"if\" without \"then\" and \"else\" is ignored");
			const hasThen = hasSchema(it, "then");
			const hasElse = hasSchema(it, "else");
			if (!hasThen && !hasElse) return;
			const valid = gen.let("valid", true);
			const schValid = gen.name("_valid");
			validateIf();
			cxt.reset();
			if (hasThen && hasElse) {
				const ifClause = gen.let("ifClause");
				cxt.setParams({ ifClause });
				gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
			} else if (hasThen) gen.if(schValid, validateClause("then"));
			else gen.if((0, codegen_1.not)(schValid), validateClause("else"));
			cxt.pass(valid, () => cxt.error(true));
			function validateIf() {
				const schCxt = cxt.subschema({
					keyword: "if",
					compositeRule: true,
					createErrors: false,
					allErrors: false
				}, schValid);
				cxt.mergeEvaluated(schCxt);
			}
			function validateClause(keyword, ifClause) {
				return () => {
					const schCxt = cxt.subschema({ keyword }, schValid);
					gen.assign(valid, schValid);
					cxt.mergeValidEvaluated(schCxt, valid);
					if (ifClause) gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
					else cxt.setParams({ ifClause: keyword });
				};
			}
		}
	};
	function hasSchema(it, keyword) {
		const schema = it.schema[keyword];
		return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
	}
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: ["then", "else"],
		schemaType: ["object", "boolean"],
		code({ keyword, parentSchema, it }) {
			if (parentSchema.if === void 0) (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var additionalItems_1 = require_additionalItems();
	var prefixItems_1 = require_prefixItems();
	var items_1 = require_items();
	var items2020_1 = require_items2020();
	var contains_1 = require_contains();
	var dependencies_1 = require_dependencies();
	var propertyNames_1 = require_propertyNames();
	var additionalProperties_1 = require_additionalProperties();
	var properties_1 = require_properties();
	var patternProperties_1 = require_patternProperties();
	var not_1 = require_not();
	var anyOf_1 = require_anyOf();
	var oneOf_1 = require_oneOf();
	var allOf_1 = require_allOf();
	var if_1 = require_if();
	var thenElse_1 = require_thenElse();
	function getApplicator(draft2020 = false) {
		const applicator = [
			not_1.default,
			anyOf_1.default,
			oneOf_1.default,
			allOf_1.default,
			if_1.default,
			thenElse_1.default,
			propertyNames_1.default,
			additionalProperties_1.default,
			dependencies_1.default,
			properties_1.default,
			patternProperties_1.default
		];
		if (draft2020) applicator.push(prefixItems_1.default, items2020_1.default);
		else applicator.push(additionalItems_1.default, items_1.default);
		applicator.push(contains_1.default);
		return applicator;
	}
	exports.default = getApplicator;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js
var require_dynamicAnchor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.dynamicAnchor = void 0;
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var compile_1 = require_compile();
	var ref_1 = require_ref();
	var def = {
		keyword: "$dynamicAnchor",
		schemaType: "string",
		code: (cxt) => dynamicAnchor(cxt, cxt.schema)
	};
	function dynamicAnchor(cxt, anchor) {
		const { gen, it } = cxt;
		it.schemaEnv.root.dynamicAnchors[anchor] = true;
		const v = (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`;
		const validate = it.errSchemaPath === "#" ? it.validateName : _getValidate(cxt);
		gen.if((0, codegen_1._)`!${v}`, () => gen.assign(v, validate));
	}
	exports.dynamicAnchor = dynamicAnchor;
	function _getValidate(cxt) {
		const { schemaEnv, schema, self } = cxt.it;
		const { root, baseId, localRefs, meta } = schemaEnv.root;
		const { schemaId } = self.opts;
		const sch = new compile_1.SchemaEnv({
			schema,
			schemaId,
			root,
			baseId,
			localRefs,
			meta
		});
		compile_1.compileSchema.call(self, sch);
		return (0, ref_1.getValidate)(cxt, sch);
	}
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js
var require_dynamicRef = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.dynamicRef = void 0;
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var ref_1 = require_ref();
	var def = {
		keyword: "$dynamicRef",
		schemaType: "string",
		code: (cxt) => dynamicRef(cxt, cxt.schema)
	};
	function dynamicRef(cxt, ref) {
		const { gen, keyword, it } = cxt;
		if (ref[0] !== "#") throw new Error(`"${keyword}" only supports hash fragment reference`);
		const anchor = ref.slice(1);
		if (it.allErrors) _dynamicRef();
		else {
			const valid = gen.let("valid", false);
			_dynamicRef(valid);
			cxt.ok(valid);
		}
		function _dynamicRef(valid) {
			if (it.schemaEnv.root.dynamicAnchors[anchor]) {
				const v = gen.let("_v", (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`);
				gen.if(v, _callRef(v, valid), _callRef(it.validateName, valid));
			} else _callRef(it.validateName, valid)();
		}
		function _callRef(validate, valid) {
			return valid ? () => gen.block(() => {
				(0, ref_1.callRef)(cxt, validate);
				gen.let(valid, true);
			}) : () => (0, ref_1.callRef)(cxt, validate);
		}
	}
	exports.dynamicRef = dynamicRef;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js
var require_recursiveAnchor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dynamicAnchor_1 = require_dynamicAnchor();
	var util_1 = require_util();
	exports.default = {
		keyword: "$recursiveAnchor",
		schemaType: "boolean",
		code(cxt) {
			if (cxt.schema) (0, dynamicAnchor_1.dynamicAnchor)(cxt, "");
			else (0, util_1.checkStrictMode)(cxt.it, "$recursiveAnchor: false is ignored");
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js
var require_recursiveRef = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dynamicRef_1 = require_dynamicRef();
	exports.default = {
		keyword: "$recursiveRef",
		schemaType: "string",
		code: (cxt) => (0, dynamicRef_1.dynamicRef)(cxt, cxt.schema)
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/dynamic/index.js
var require_dynamic = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dynamicAnchor_1 = require_dynamicAnchor();
	var dynamicRef_1 = require_dynamicRef();
	var recursiveAnchor_1 = require_recursiveAnchor();
	var recursiveRef_1 = require_recursiveRef();
	exports.default = [
		dynamicAnchor_1.default,
		dynamicRef_1.default,
		recursiveAnchor_1.default,
		recursiveRef_1.default
	];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/dependentRequired.js
var require_dependentRequired = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dependencies_1 = require_dependencies();
	exports.default = {
		keyword: "dependentRequired",
		type: "object",
		schemaType: "object",
		error: dependencies_1.error,
		code: (cxt) => (0, dependencies_1.validatePropertyDeps)(cxt)
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js
var require_dependentSchemas = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dependencies_1 = require_dependencies();
	exports.default = {
		keyword: "dependentSchemas",
		type: "object",
		schemaType: "object",
		code: (cxt) => (0, dependencies_1.validateSchemaDeps)(cxt)
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/limitContains.js
var require_limitContains = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: ["maxContains", "minContains"],
		type: "array",
		schemaType: "number",
		code({ keyword, parentSchema, it }) {
			if (parentSchema.contains === void 0) (0, util_1.checkStrictMode)(it, `"${keyword}" without "contains" is ignored`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/next.js
var require_next = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dependentRequired_1 = require_dependentRequired();
	var dependentSchemas_1 = require_dependentSchemas();
	var limitContains_1 = require_limitContains();
	exports.default = [
		dependentRequired_1.default,
		dependentSchemas_1.default,
		limitContains_1.default
	];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js
var require_unevaluatedProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var names_1 = require_names();
	exports.default = {
		keyword: "unevaluatedProperties",
		type: "object",
		schemaType: ["boolean", "object"],
		trackErrors: true,
		error: {
			message: "must NOT have unevaluated properties",
			params: ({ params }) => (0, codegen_1._)`{unevaluatedProperty: ${params.unevaluatedProperty}}`
		},
		code(cxt) {
			const { gen, schema, data, errsCount, it } = cxt;
			/* istanbul ignore if */
			if (!errsCount) throw new Error("ajv implementation error");
			const { allErrors, props } = it;
			if (props instanceof codegen_1.Name) gen.if((0, codegen_1._)`${props} !== true`, () => gen.forIn("key", data, (key) => gen.if(unevaluatedDynamic(props, key), () => unevaluatedPropCode(key))));
			else if (props !== true) gen.forIn("key", data, (key) => props === void 0 ? unevaluatedPropCode(key) : gen.if(unevaluatedStatic(props, key), () => unevaluatedPropCode(key)));
			it.props = true;
			cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
			function unevaluatedPropCode(key) {
				if (schema === false) {
					cxt.setParams({ unevaluatedProperty: key });
					cxt.error();
					if (!allErrors) gen.break();
					return;
				}
				if (!(0, util_1.alwaysValidSchema)(it, schema)) {
					const valid = gen.name("valid");
					cxt.subschema({
						keyword: "unevaluatedProperties",
						dataProp: key,
						dataPropType: util_1.Type.Str
					}, valid);
					if (!allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
				}
			}
			function unevaluatedDynamic(evaluatedProps, key) {
				return (0, codegen_1._)`!${evaluatedProps} || !${evaluatedProps}[${key}]`;
			}
			function unevaluatedStatic(evaluatedProps, key) {
				const ps = [];
				for (const p in evaluatedProps) if (evaluatedProps[p] === true) ps.push((0, codegen_1._)`${key} !== ${p}`);
				return (0, codegen_1.and)(...ps);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js
var require_unevaluatedItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "unevaluatedItems",
		type: "array",
		schemaType: ["boolean", "object"],
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { gen, schema, data, it } = cxt;
			const items = it.items || 0;
			if (items === true) return;
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			if (schema === false) {
				cxt.setParams({ len: items });
				cxt.fail((0, codegen_1._)`${len} > ${items}`);
			} else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
				const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items}`);
				gen.if((0, codegen_1.not)(valid), () => validateItems(valid, items));
				cxt.ok(valid);
			}
			it.items = true;
			function validateItems(valid, from) {
				gen.forRange("i", from, len, (i) => {
					cxt.subschema({
						keyword: "unevaluatedItems",
						dataProp: i,
						dataPropType: util_1.Type.Num
					}, valid);
					if (!it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
				});
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/unevaluated/index.js
var require_unevaluated = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var unevaluatedProperties_1 = require_unevaluatedProperties();
	var unevaluatedItems_1 = require_unevaluatedItems();
	exports.default = [unevaluatedProperties_1.default, unevaluatedItems_1.default];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/format/format.js
var require_format$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "format",
		type: ["number", "string"],
		schemaType: "string",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
			params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
		},
		code(cxt, ruleType) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			const { opts, errSchemaPath, schemaEnv, self } = it;
			if (!opts.validateFormats) return;
			if ($data) validate$DataFormat();
			else validateFormat();
			function validate$DataFormat() {
				const fmts = gen.scopeValue("formats", {
					ref: self.formats,
					code: opts.code.formats
				});
				const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
				const fType = gen.let("fType");
				const format = gen.let("format");
				gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
				cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
				function unknownFmt() {
					if (opts.strictSchema === false) return codegen_1.nil;
					return (0, codegen_1._)`${schemaCode} && !${format}`;
				}
				function invalidFmt() {
					const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
					const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
					return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
				}
			}
			function validateFormat() {
				const formatDef = self.formats[schema];
				if (!formatDef) {
					unknownFormat();
					return;
				}
				if (formatDef === true) return;
				const [fmtType, format, fmtRef] = getFormat(formatDef);
				if (fmtType === ruleType) cxt.pass(validCondition());
				function unknownFormat() {
					if (opts.strictSchema === false) {
						self.logger.warn(unknownMsg());
						return;
					}
					throw new Error(unknownMsg());
					function unknownMsg() {
						return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
					}
				}
				function getFormat(fmtDef) {
					const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
					const fmt = gen.scopeValue("formats", {
						key: schema,
						ref: fmtDef,
						code
					});
					if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) return [
						fmtDef.type || "string",
						fmtDef.validate,
						(0, codegen_1._)`${fmt}.validate`
					];
					return [
						"string",
						fmtDef,
						fmt
					];
				}
				function validCondition() {
					if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
						if (!schemaEnv.$async) throw new Error("async format in sync schema");
						return (0, codegen_1._)`await ${fmtRef}(${data})`;
					}
					return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/format/index.js
var require_format = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = [require_format$1().default];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.contentVocabulary = exports.metadataVocabulary = void 0;
	exports.metadataVocabulary = [
		"title",
		"description",
		"default",
		"deprecated",
		"readOnly",
		"writeOnly",
		"examples"
	];
	exports.contentVocabulary = [
		"contentMediaType",
		"contentEncoding",
		"contentSchema"
	];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/draft2020.js
var require_draft2020 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = require_core();
	var validation_1 = require_validation();
	var applicator_1 = require_applicator();
	var dynamic_1 = require_dynamic();
	var next_1 = require_next();
	var unevaluated_1 = require_unevaluated();
	var format_1 = require_format();
	var metadata_1 = require_metadata();
	exports.default = [
		dynamic_1.default,
		core_1.default,
		validation_1.default,
		(0, applicator_1.default)(true),
		format_1.default,
		metadata_1.metadataVocabulary,
		metadata_1.contentVocabulary,
		next_1.default,
		unevaluated_1.default
	];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DiscrError = void 0;
	var DiscrError;
	(function(DiscrError) {
		DiscrError["Tag"] = "tag";
		DiscrError["Mapping"] = "mapping";
	})(DiscrError || (exports.DiscrError = DiscrError = {}));
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var types_1 = require_types();
	var compile_1 = require_compile();
	var ref_error_1 = require_ref_error();
	var util_1 = require_util();
	exports.default = {
		keyword: "discriminator",
		type: "object",
		schemaType: "object",
		error: {
			message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
			params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
		},
		code(cxt) {
			const { gen, data, schema, parentSchema, it } = cxt;
			const { oneOf } = parentSchema;
			if (!it.opts.discriminator) throw new Error("discriminator: requires discriminator option");
			const tagName = schema.propertyName;
			if (typeof tagName != "string") throw new Error("discriminator: requires propertyName");
			if (schema.mapping) throw new Error("discriminator: mapping is not supported");
			if (!oneOf) throw new Error("discriminator: requires oneOf keyword");
			const valid = gen.let("valid", false);
			const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
			gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, {
				discrError: types_1.DiscrError.Tag,
				tag,
				tagName
			}));
			cxt.ok(valid);
			function validateMapping() {
				const mapping = getMapping();
				gen.if(false);
				for (const tagValue in mapping) {
					gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
					gen.assign(valid, applyTagSchema(mapping[tagValue]));
				}
				gen.else();
				cxt.error(false, {
					discrError: types_1.DiscrError.Mapping,
					tag,
					tagName
				});
				gen.endIf();
			}
			function applyTagSchema(schemaProp) {
				const _valid = gen.name("valid");
				const schCxt = cxt.subschema({
					keyword: "oneOf",
					schemaProp
				}, _valid);
				cxt.mergeEvaluated(schCxt, codegen_1.Name);
				return _valid;
			}
			function getMapping() {
				var _a;
				const oneOfMapping = {};
				const topRequired = hasRequired(parentSchema);
				let tagRequired = true;
				for (let i = 0; i < oneOf.length; i++) {
					let sch = oneOf[i];
					if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
						const ref = sch.$ref;
						sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
						if (sch instanceof compile_1.SchemaEnv) sch = sch.schema;
						if (sch === void 0) throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
					}
					const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
					if (typeof propSch != "object") throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
					tagRequired = tagRequired && (topRequired || hasRequired(sch));
					addMappings(propSch, i);
				}
				if (!tagRequired) throw new Error(`discriminator: "${tagName}" must be required`);
				return oneOfMapping;
				function hasRequired({ required }) {
					return Array.isArray(required) && required.includes(tagName);
				}
				function addMappings(sch, i) {
					if (sch.const) addMapping(sch.const, i);
					else if (sch.enum) for (const tagValue of sch.enum) addMapping(tagValue, i);
					else throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
				}
				function addMapping(tagValue, i) {
					if (typeof tagValue != "string" || tagValue in oneOfMapping) throw new Error(`discriminator: "${tagName}" values must be unique strings`);
					oneOfMapping[tagValue] = i;
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/refs/json-schema-2020-12/schema.json
var schema_exports = /* @__PURE__ */ __exportAll({
	$comment: () => $comment,
	$dynamicAnchor: () => $dynamicAnchor$7,
	$id: () => $id$10,
	$schema: () => $schema$10,
	$vocabulary: () => $vocabulary$7,
	allOf: () => allOf,
	default: () => schema_default,
	properties: () => properties$10,
	title: () => title$10,
	type: () => type$10
});
var $schema$10, $id$10, $vocabulary$7, $dynamicAnchor$7, title$10, allOf, type$10, $comment, properties$10, schema_default;
var init_schema = __esmMin(() => {
	$schema$10 = "https://json-schema.org/draft/2020-12/schema";
	$id$10 = "https://json-schema.org/draft/2020-12/schema";
	$vocabulary$7 = {
		"https://json-schema.org/draft/2020-12/vocab/core": true,
		"https://json-schema.org/draft/2020-12/vocab/applicator": true,
		"https://json-schema.org/draft/2020-12/vocab/unevaluated": true,
		"https://json-schema.org/draft/2020-12/vocab/validation": true,
		"https://json-schema.org/draft/2020-12/vocab/meta-data": true,
		"https://json-schema.org/draft/2020-12/vocab/format-annotation": true,
		"https://json-schema.org/draft/2020-12/vocab/content": true
	};
	$dynamicAnchor$7 = "meta";
	title$10 = "Core and Validation specifications meta-schema";
	allOf = [
		{ "$ref": "meta/core" },
		{ "$ref": "meta/applicator" },
		{ "$ref": "meta/unevaluated" },
		{ "$ref": "meta/validation" },
		{ "$ref": "meta/meta-data" },
		{ "$ref": "meta/format-annotation" },
		{ "$ref": "meta/content" }
	];
	type$10 = ["object", "boolean"];
	$comment = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.";
	properties$10 = {
		"definitions": {
			"$comment": "\"definitions\" has been replaced by \"$defs\".",
			"type": "object",
			"additionalProperties": { "$dynamicRef": "#meta" },
			"deprecated": true,
			"default": {}
		},
		"dependencies": {
			"$comment": "\"dependencies\" has been split and replaced by \"dependentSchemas\" and \"dependentRequired\" in order to serve their differing semantics.",
			"type": "object",
			"additionalProperties": { "anyOf": [{ "$dynamicRef": "#meta" }, { "$ref": "meta/validation#/$defs/stringArray" }] },
			"deprecated": true,
			"default": {}
		},
		"$recursiveAnchor": {
			"$comment": "\"$recursiveAnchor\" has been replaced by \"$dynamicAnchor\".",
			"$ref": "meta/core#/$defs/anchorString",
			"deprecated": true
		},
		"$recursiveRef": {
			"$comment": "\"$recursiveRef\" has been replaced by \"$dynamicRef\".",
			"$ref": "meta/core#/$defs/uriReferenceString",
			"deprecated": true
		}
	};
	schema_default = {
		$schema: $schema$10,
		$id: $id$10,
		$vocabulary: $vocabulary$7,
		$dynamicAnchor: $dynamicAnchor$7,
		title: title$10,
		allOf,
		type: type$10,
		$comment,
		properties: properties$10
	};
});
//#endregion
//#region node_modules/ajv/dist/refs/json-schema-2020-12/meta/applicator.json
var applicator_exports = /* @__PURE__ */ __exportAll({
	$defs: () => $defs$4,
	$dynamicAnchor: () => $dynamicAnchor$6,
	$id: () => $id$9,
	$schema: () => $schema$9,
	$vocabulary: () => $vocabulary$6,
	default: () => applicator_default,
	properties: () => properties$9,
	title: () => title$9,
	type: () => type$9
});
var $schema$9, $id$9, $vocabulary$6, $dynamicAnchor$6, title$9, type$9, properties$9, $defs$4, applicator_default;
var init_applicator = __esmMin(() => {
	$schema$9 = "https://json-schema.org/draft/2020-12/schema";
	$id$9 = "https://json-schema.org/draft/2020-12/meta/applicator";
	$vocabulary$6 = { "https://json-schema.org/draft/2020-12/vocab/applicator": true };
	$dynamicAnchor$6 = "meta";
	title$9 = "Applicator vocabulary meta-schema";
	type$9 = ["object", "boolean"];
	properties$9 = {
		"prefixItems": { "$ref": "#/$defs/schemaArray" },
		"items": { "$dynamicRef": "#meta" },
		"contains": { "$dynamicRef": "#meta" },
		"additionalProperties": { "$dynamicRef": "#meta" },
		"properties": {
			"type": "object",
			"additionalProperties": { "$dynamicRef": "#meta" },
			"default": {}
		},
		"patternProperties": {
			"type": "object",
			"additionalProperties": { "$dynamicRef": "#meta" },
			"propertyNames": { "format": "regex" },
			"default": {}
		},
		"dependentSchemas": {
			"type": "object",
			"additionalProperties": { "$dynamicRef": "#meta" },
			"default": {}
		},
		"propertyNames": { "$dynamicRef": "#meta" },
		"if": { "$dynamicRef": "#meta" },
		"then": { "$dynamicRef": "#meta" },
		"else": { "$dynamicRef": "#meta" },
		"allOf": { "$ref": "#/$defs/schemaArray" },
		"anyOf": { "$ref": "#/$defs/schemaArray" },
		"oneOf": { "$ref": "#/$defs/schemaArray" },
		"not": { "$dynamicRef": "#meta" }
	};
	$defs$4 = { "schemaArray": {
		"type": "array",
		"minItems": 1,
		"items": { "$dynamicRef": "#meta" }
	} };
	applicator_default = {
		$schema: $schema$9,
		$id: $id$9,
		$vocabulary: $vocabulary$6,
		$dynamicAnchor: $dynamicAnchor$6,
		title: title$9,
		type: type$9,
		properties: properties$9,
		$defs: $defs$4
	};
});
//#endregion
//#region node_modules/ajv/dist/refs/json-schema-2020-12/meta/unevaluated.json
var unevaluated_exports = /* @__PURE__ */ __exportAll({
	$dynamicAnchor: () => $dynamicAnchor$5,
	$id: () => $id$8,
	$schema: () => $schema$8,
	$vocabulary: () => $vocabulary$5,
	default: () => unevaluated_default,
	properties: () => properties$8,
	title: () => title$8,
	type: () => type$8
});
var $schema$8, $id$8, $vocabulary$5, $dynamicAnchor$5, title$8, type$8, properties$8, unevaluated_default;
var init_unevaluated = __esmMin(() => {
	$schema$8 = "https://json-schema.org/draft/2020-12/schema";
	$id$8 = "https://json-schema.org/draft/2020-12/meta/unevaluated";
	$vocabulary$5 = { "https://json-schema.org/draft/2020-12/vocab/unevaluated": true };
	$dynamicAnchor$5 = "meta";
	title$8 = "Unevaluated applicator vocabulary meta-schema";
	type$8 = ["object", "boolean"];
	properties$8 = {
		"unevaluatedItems": { "$dynamicRef": "#meta" },
		"unevaluatedProperties": { "$dynamicRef": "#meta" }
	};
	unevaluated_default = {
		$schema: $schema$8,
		$id: $id$8,
		$vocabulary: $vocabulary$5,
		$dynamicAnchor: $dynamicAnchor$5,
		title: title$8,
		type: type$8,
		properties: properties$8
	};
});
//#endregion
//#region node_modules/ajv/dist/refs/json-schema-2020-12/meta/content.json
var content_exports = /* @__PURE__ */ __exportAll({
	$dynamicAnchor: () => $dynamicAnchor$4,
	$id: () => $id$7,
	$schema: () => $schema$7,
	$vocabulary: () => $vocabulary$4,
	default: () => content_default,
	properties: () => properties$7,
	title: () => title$7,
	type: () => type$7
});
var $schema$7, $id$7, $vocabulary$4, $dynamicAnchor$4, title$7, type$7, properties$7, content_default;
var init_content = __esmMin(() => {
	$schema$7 = "https://json-schema.org/draft/2020-12/schema";
	$id$7 = "https://json-schema.org/draft/2020-12/meta/content";
	$vocabulary$4 = { "https://json-schema.org/draft/2020-12/vocab/content": true };
	$dynamicAnchor$4 = "meta";
	title$7 = "Content vocabulary meta-schema";
	type$7 = ["object", "boolean"];
	properties$7 = {
		"contentEncoding": { "type": "string" },
		"contentMediaType": { "type": "string" },
		"contentSchema": { "$dynamicRef": "#meta" }
	};
	content_default = {
		$schema: $schema$7,
		$id: $id$7,
		$vocabulary: $vocabulary$4,
		$dynamicAnchor: $dynamicAnchor$4,
		title: title$7,
		type: type$7,
		properties: properties$7
	};
});
//#endregion
//#region node_modules/ajv/dist/refs/json-schema-2020-12/meta/core.json
var core_exports = /* @__PURE__ */ __exportAll({
	$defs: () => $defs$3,
	$dynamicAnchor: () => $dynamicAnchor$3,
	$id: () => $id$6,
	$schema: () => $schema$6,
	$vocabulary: () => $vocabulary$3,
	default: () => core_default,
	properties: () => properties$6,
	title: () => title$6,
	type: () => type$6
});
var $schema$6, $id$6, $vocabulary$3, $dynamicAnchor$3, title$6, type$6, properties$6, $defs$3, core_default;
var init_core = __esmMin(() => {
	$schema$6 = "https://json-schema.org/draft/2020-12/schema";
	$id$6 = "https://json-schema.org/draft/2020-12/meta/core";
	$vocabulary$3 = { "https://json-schema.org/draft/2020-12/vocab/core": true };
	$dynamicAnchor$3 = "meta";
	title$6 = "Core vocabulary meta-schema";
	type$6 = ["object", "boolean"];
	properties$6 = {
		"$id": {
			"$ref": "#/$defs/uriReferenceString",
			"$comment": "Non-empty fragments not allowed.",
			"pattern": "^[^#]*#?$"
		},
		"$schema": { "$ref": "#/$defs/uriString" },
		"$ref": { "$ref": "#/$defs/uriReferenceString" },
		"$anchor": { "$ref": "#/$defs/anchorString" },
		"$dynamicRef": { "$ref": "#/$defs/uriReferenceString" },
		"$dynamicAnchor": { "$ref": "#/$defs/anchorString" },
		"$vocabulary": {
			"type": "object",
			"propertyNames": { "$ref": "#/$defs/uriString" },
			"additionalProperties": { "type": "boolean" }
		},
		"$comment": { "type": "string" },
		"$defs": {
			"type": "object",
			"additionalProperties": { "$dynamicRef": "#meta" }
		}
	};
	$defs$3 = {
		"anchorString": {
			"type": "string",
			"pattern": "^[A-Za-z_][-A-Za-z0-9._]*$"
		},
		"uriString": {
			"type": "string",
			"format": "uri"
		},
		"uriReferenceString": {
			"type": "string",
			"format": "uri-reference"
		}
	};
	core_default = {
		$schema: $schema$6,
		$id: $id$6,
		$vocabulary: $vocabulary$3,
		$dynamicAnchor: $dynamicAnchor$3,
		title: title$6,
		type: type$6,
		properties: properties$6,
		$defs: $defs$3
	};
});
//#endregion
//#region node_modules/ajv/dist/refs/json-schema-2020-12/meta/format-annotation.json
var format_annotation_exports = /* @__PURE__ */ __exportAll({
	$dynamicAnchor: () => $dynamicAnchor$2,
	$id: () => $id$5,
	$schema: () => $schema$5,
	$vocabulary: () => $vocabulary$2,
	default: () => format_annotation_default,
	properties: () => properties$5,
	title: () => title$5,
	type: () => type$5
});
var $schema$5, $id$5, $vocabulary$2, $dynamicAnchor$2, title$5, type$5, properties$5, format_annotation_default;
var init_format_annotation = __esmMin(() => {
	$schema$5 = "https://json-schema.org/draft/2020-12/schema";
	$id$5 = "https://json-schema.org/draft/2020-12/meta/format-annotation";
	$vocabulary$2 = { "https://json-schema.org/draft/2020-12/vocab/format-annotation": true };
	$dynamicAnchor$2 = "meta";
	title$5 = "Format vocabulary meta-schema for annotation results";
	type$5 = ["object", "boolean"];
	properties$5 = { "format": { "type": "string" } };
	format_annotation_default = {
		$schema: $schema$5,
		$id: $id$5,
		$vocabulary: $vocabulary$2,
		$dynamicAnchor: $dynamicAnchor$2,
		title: title$5,
		type: type$5,
		properties: properties$5
	};
});
//#endregion
//#region node_modules/ajv/dist/refs/json-schema-2020-12/meta/meta-data.json
var meta_data_exports = /* @__PURE__ */ __exportAll({
	$dynamicAnchor: () => $dynamicAnchor$1,
	$id: () => $id$4,
	$schema: () => $schema$4,
	$vocabulary: () => $vocabulary$1,
	default: () => meta_data_default,
	properties: () => properties$4,
	title: () => title$4,
	type: () => type$4
});
var $schema$4, $id$4, $vocabulary$1, $dynamicAnchor$1, title$4, type$4, properties$4, meta_data_default;
var init_meta_data = __esmMin(() => {
	$schema$4 = "https://json-schema.org/draft/2020-12/schema";
	$id$4 = "https://json-schema.org/draft/2020-12/meta/meta-data";
	$vocabulary$1 = { "https://json-schema.org/draft/2020-12/vocab/meta-data": true };
	$dynamicAnchor$1 = "meta";
	title$4 = "Meta-data vocabulary meta-schema";
	type$4 = ["object", "boolean"];
	properties$4 = {
		"title": { "type": "string" },
		"description": { "type": "string" },
		"default": true,
		"deprecated": {
			"type": "boolean",
			"default": false
		},
		"readOnly": {
			"type": "boolean",
			"default": false
		},
		"writeOnly": {
			"type": "boolean",
			"default": false
		},
		"examples": {
			"type": "array",
			"items": true
		}
	};
	meta_data_default = {
		$schema: $schema$4,
		$id: $id$4,
		$vocabulary: $vocabulary$1,
		$dynamicAnchor: $dynamicAnchor$1,
		title: title$4,
		type: type$4,
		properties: properties$4
	};
});
//#endregion
//#region node_modules/ajv/dist/refs/json-schema-2020-12/meta/validation.json
var validation_exports = /* @__PURE__ */ __exportAll({
	$defs: () => $defs$2,
	$dynamicAnchor: () => $dynamicAnchor,
	$id: () => $id$3,
	$schema: () => $schema$3,
	$vocabulary: () => $vocabulary,
	default: () => validation_default,
	properties: () => properties$3,
	title: () => title$3,
	type: () => type$3
});
var $schema$3, $id$3, $vocabulary, $dynamicAnchor, title$3, type$3, properties$3, $defs$2, validation_default;
var init_validation = __esmMin(() => {
	$schema$3 = "https://json-schema.org/draft/2020-12/schema";
	$id$3 = "https://json-schema.org/draft/2020-12/meta/validation";
	$vocabulary = { "https://json-schema.org/draft/2020-12/vocab/validation": true };
	$dynamicAnchor = "meta";
	title$3 = "Validation vocabulary meta-schema";
	type$3 = ["object", "boolean"];
	properties$3 = {
		"type": { "anyOf": [{ "$ref": "#/$defs/simpleTypes" }, {
			"type": "array",
			"items": { "$ref": "#/$defs/simpleTypes" },
			"minItems": 1,
			"uniqueItems": true
		}] },
		"const": true,
		"enum": {
			"type": "array",
			"items": true
		},
		"multipleOf": {
			"type": "number",
			"exclusiveMinimum": 0
		},
		"maximum": { "type": "number" },
		"exclusiveMaximum": { "type": "number" },
		"minimum": { "type": "number" },
		"exclusiveMinimum": { "type": "number" },
		"maxLength": { "$ref": "#/$defs/nonNegativeInteger" },
		"minLength": { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
		"pattern": {
			"type": "string",
			"format": "regex"
		},
		"maxItems": { "$ref": "#/$defs/nonNegativeInteger" },
		"minItems": { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
		"uniqueItems": {
			"type": "boolean",
			"default": false
		},
		"maxContains": { "$ref": "#/$defs/nonNegativeInteger" },
		"minContains": {
			"$ref": "#/$defs/nonNegativeInteger",
			"default": 1
		},
		"maxProperties": { "$ref": "#/$defs/nonNegativeInteger" },
		"minProperties": { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
		"required": { "$ref": "#/$defs/stringArray" },
		"dependentRequired": {
			"type": "object",
			"additionalProperties": { "$ref": "#/$defs/stringArray" }
		}
	};
	$defs$2 = {
		"nonNegativeInteger": {
			"type": "integer",
			"minimum": 0
		},
		"nonNegativeIntegerDefault0": {
			"$ref": "#/$defs/nonNegativeInteger",
			"default": 0
		},
		"simpleTypes": { "enum": [
			"array",
			"boolean",
			"integer",
			"null",
			"number",
			"object",
			"string"
		] },
		"stringArray": {
			"type": "array",
			"items": { "type": "string" },
			"uniqueItems": true,
			"default": []
		}
	};
	validation_default = {
		$schema: $schema$3,
		$id: $id$3,
		$vocabulary,
		$dynamicAnchor,
		title: title$3,
		type: type$3,
		properties: properties$3,
		$defs: $defs$2
	};
});
//#endregion
//#region node_modules/ajv/dist/refs/json-schema-2020-12/index.js
var require_json_schema_2020_12 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var metaSchema = (init_schema(), __toCommonJS(schema_exports).default);
	var applicator = (init_applicator(), __toCommonJS(applicator_exports).default);
	var unevaluated = (init_unevaluated(), __toCommonJS(unevaluated_exports).default);
	var content = (init_content(), __toCommonJS(content_exports).default);
	var core = (init_core(), __toCommonJS(core_exports).default);
	var format = (init_format_annotation(), __toCommonJS(format_annotation_exports).default);
	var metadata = (init_meta_data(), __toCommonJS(meta_data_exports).default);
	var validation = (init_validation(), __toCommonJS(validation_exports).default);
	var META_SUPPORT_DATA = ["/properties"];
	function addMetaSchema2020($data) {
		[
			metaSchema,
			applicator,
			unevaluated,
			content,
			core,
			with$data(this, format),
			metadata,
			with$data(this, validation)
		].forEach((sch) => this.addMetaSchema(sch, void 0, false));
		return this;
		function with$data(ajv, sch) {
			return $data ? ajv.$dataMetaSchema(sch, META_SUPPORT_DATA) : sch;
		}
	}
	exports.default = addMetaSchema2020;
}));
//#endregion
//#region node_modules/ajv/dist/2020.js
var require__2020 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv2020 = void 0;
	var core_1 = require_core$1();
	var draft2020_1 = require_draft2020();
	var discriminator_1 = require_discriminator();
	var json_schema_2020_12_1 = require_json_schema_2020_12();
	var META_SCHEMA_ID = "https://json-schema.org/draft/2020-12/schema";
	var Ajv2020 = class extends core_1.default {
		constructor(opts = {}) {
			super({
				...opts,
				dynamicRef: true,
				next: true,
				unevaluated: true
			});
		}
		_addVocabularies() {
			super._addVocabularies();
			draft2020_1.default.forEach((v) => this.addVocabulary(v));
			if (this.opts.discriminator) this.addKeyword(discriminator_1.default);
		}
		_addDefaultMetaSchema() {
			super._addDefaultMetaSchema();
			const { $data, meta } = this.opts;
			if (!meta) return;
			json_schema_2020_12_1.default.call(this, $data);
			this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
		}
		defaultMeta() {
			return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
		}
	};
	exports.Ajv2020 = Ajv2020;
	module.exports = exports = Ajv2020;
	module.exports.Ajv2020 = Ajv2020;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Ajv2020;
	var validate_1 = require_validate();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error();
	Object.defineProperty(exports, "ValidationError", {
		enumerable: true,
		get: function() {
			return validation_error_1.default;
		}
	});
	var ref_error_1 = require_ref_error();
	Object.defineProperty(exports, "MissingRefError", {
		enumerable: true,
		get: function() {
			return ref_error_1.default;
		}
	});
}));
//#endregion
//#region node_modules/ajv-formats/dist/formats.js
var require_formats = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
	function fmtDef(validate, compare) {
		return {
			validate,
			compare
		};
	}
	exports.fullFormats = {
		date: fmtDef(date, compareDate),
		time: fmtDef(getTime(true), compareTime),
		"date-time": fmtDef(getDateTime(true), compareDateTime),
		"iso-time": fmtDef(getTime(), compareIsoTime),
		"iso-date-time": fmtDef(getDateTime(), compareIsoDateTime),
		duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
		uri,
		"uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
		"uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
		url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
		email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
		hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
		ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
		ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
		regex,
		uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
		"json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
		"json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
		"relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
		byte,
		int32: {
			type: "number",
			validate: validateInt32
		},
		int64: {
			type: "number",
			validate: validateInt64
		},
		float: {
			type: "number",
			validate: validateNumber
		},
		double: {
			type: "number",
			validate: validateNumber
		},
		password: true,
		binary: true
	};
	exports.fastFormats = {
		...exports.fullFormats,
		date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
		time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
		"date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
		"iso-time": fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
		"iso-date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoDateTime),
		uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
		"uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
		email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
	};
	exports.formatNames = Object.keys(exports.fullFormats);
	function isLeapYear(year) {
		return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	}
	var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
	var DAYS = [
		0,
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	];
	function date(str) {
		const matches = DATE.exec(str);
		if (!matches) return false;
		const year = +matches[1];
		const month = +matches[2];
		const day = +matches[3];
		return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
	}
	function compareDate(d1, d2) {
		if (!(d1 && d2)) return void 0;
		if (d1 > d2) return 1;
		if (d1 < d2) return -1;
		return 0;
	}
	var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
	function getTime(strictTimeZone) {
		return function time(str) {
			const matches = TIME.exec(str);
			if (!matches) return false;
			const hr = +matches[1];
			const min = +matches[2];
			const sec = +matches[3];
			const tz = matches[4];
			const tzSign = matches[5] === "-" ? -1 : 1;
			const tzH = +(matches[6] || 0);
			const tzM = +(matches[7] || 0);
			if (tzH > 23 || tzM > 59 || strictTimeZone && !tz) return false;
			if (hr <= 23 && min <= 59 && sec < 60) return true;
			const utcMin = min - tzM * tzSign;
			const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
			return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
		};
	}
	function compareTime(s1, s2) {
		if (!(s1 && s2)) return void 0;
		const t1 = (/* @__PURE__ */ new Date("2020-01-01T" + s1)).valueOf();
		const t2 = (/* @__PURE__ */ new Date("2020-01-01T" + s2)).valueOf();
		if (!(t1 && t2)) return void 0;
		return t1 - t2;
	}
	function compareIsoTime(t1, t2) {
		if (!(t1 && t2)) return void 0;
		const a1 = TIME.exec(t1);
		const a2 = TIME.exec(t2);
		if (!(a1 && a2)) return void 0;
		t1 = a1[1] + a1[2] + a1[3];
		t2 = a2[1] + a2[2] + a2[3];
		if (t1 > t2) return 1;
		if (t1 < t2) return -1;
		return 0;
	}
	var DATE_TIME_SEPARATOR = /t|\s/i;
	function getDateTime(strictTimeZone) {
		const time = getTime(strictTimeZone);
		return function date_time(str) {
			const dateTime = str.split(DATE_TIME_SEPARATOR);
			return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1]);
		};
	}
	function compareDateTime(dt1, dt2) {
		if (!(dt1 && dt2)) return void 0;
		const d1 = new Date(dt1).valueOf();
		const d2 = new Date(dt2).valueOf();
		if (!(d1 && d2)) return void 0;
		return d1 - d2;
	}
	function compareIsoDateTime(dt1, dt2) {
		if (!(dt1 && dt2)) return void 0;
		const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
		const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
		const res = compareDate(d1, d2);
		if (res === void 0) return void 0;
		return res || compareTime(t1, t2);
	}
	var NOT_URI_FRAGMENT = /\/|:/;
	var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
	function uri(str) {
		return NOT_URI_FRAGMENT.test(str) && URI.test(str);
	}
	var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
	function byte(str) {
		BYTE.lastIndex = 0;
		return BYTE.test(str);
	}
	var MIN_INT32 = -(2 ** 31);
	var MAX_INT32 = 2 ** 31 - 1;
	function validateInt32(value) {
		return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
	}
	function validateInt64(value) {
		return Number.isInteger(value);
	}
	function validateNumber() {
		return true;
	}
	var Z_ANCHOR = /[^\\]\\Z/;
	function regex(str) {
		if (Z_ANCHOR.test(str)) return false;
		try {
			new RegExp(str);
			return true;
		} catch (e) {
			return false;
		}
	}
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = require_core();
	var validation_1 = require_validation();
	var applicator_1 = require_applicator();
	var format_1 = require_format();
	var metadata_1 = require_metadata();
	exports.default = [
		core_1.default,
		validation_1.default,
		(0, applicator_1.default)(),
		format_1.default,
		metadata_1.metadataVocabulary,
		metadata_1.contentVocabulary
	];
}));
//#endregion
//#region node_modules/ajv/dist/refs/json-schema-draft-07.json
var json_schema_draft_07_exports = /* @__PURE__ */ __exportAll({
	$id: () => $id$2,
	$schema: () => $schema$2,
	default: () => json_schema_draft_07_default,
	definitions: () => definitions,
	properties: () => properties$2,
	title: () => title$2,
	type: () => type$2
});
var $schema$2, $id$2, title$2, definitions, type$2, properties$2, json_schema_draft_07_default;
var init_json_schema_draft_07 = __esmMin(() => {
	$schema$2 = "http://json-schema.org/draft-07/schema#";
	$id$2 = "http://json-schema.org/draft-07/schema#";
	title$2 = "Core schema meta-schema";
	definitions = {
		"schemaArray": {
			"type": "array",
			"minItems": 1,
			"items": { "$ref": "#" }
		},
		"nonNegativeInteger": {
			"type": "integer",
			"minimum": 0
		},
		"nonNegativeIntegerDefault0": { "allOf": [{ "$ref": "#/definitions/nonNegativeInteger" }, { "default": 0 }] },
		"simpleTypes": { "enum": [
			"array",
			"boolean",
			"integer",
			"null",
			"number",
			"object",
			"string"
		] },
		"stringArray": {
			"type": "array",
			"items": { "type": "string" },
			"uniqueItems": true,
			"default": []
		}
	};
	type$2 = ["object", "boolean"];
	properties$2 = {
		"$id": {
			"type": "string",
			"format": "uri-reference"
		},
		"$schema": {
			"type": "string",
			"format": "uri"
		},
		"$ref": {
			"type": "string",
			"format": "uri-reference"
		},
		"$comment": { "type": "string" },
		"title": { "type": "string" },
		"description": { "type": "string" },
		"default": true,
		"readOnly": {
			"type": "boolean",
			"default": false
		},
		"examples": {
			"type": "array",
			"items": true
		},
		"multipleOf": {
			"type": "number",
			"exclusiveMinimum": 0
		},
		"maximum": { "type": "number" },
		"exclusiveMaximum": { "type": "number" },
		"minimum": { "type": "number" },
		"exclusiveMinimum": { "type": "number" },
		"maxLength": { "$ref": "#/definitions/nonNegativeInteger" },
		"minLength": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"pattern": {
			"type": "string",
			"format": "regex"
		},
		"additionalItems": { "$ref": "#" },
		"items": {
			"anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/schemaArray" }],
			"default": true
		},
		"maxItems": { "$ref": "#/definitions/nonNegativeInteger" },
		"minItems": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"uniqueItems": {
			"type": "boolean",
			"default": false
		},
		"contains": { "$ref": "#" },
		"maxProperties": { "$ref": "#/definitions/nonNegativeInteger" },
		"minProperties": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"required": { "$ref": "#/definitions/stringArray" },
		"additionalProperties": { "$ref": "#" },
		"definitions": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"default": {}
		},
		"properties": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"default": {}
		},
		"patternProperties": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"propertyNames": { "format": "regex" },
			"default": {}
		},
		"dependencies": {
			"type": "object",
			"additionalProperties": { "anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/stringArray" }] }
		},
		"propertyNames": { "$ref": "#" },
		"const": true,
		"enum": {
			"type": "array",
			"items": true,
			"minItems": 1,
			"uniqueItems": true
		},
		"type": { "anyOf": [{ "$ref": "#/definitions/simpleTypes" }, {
			"type": "array",
			"items": { "$ref": "#/definitions/simpleTypes" },
			"minItems": 1,
			"uniqueItems": true
		}] },
		"format": { "type": "string" },
		"contentMediaType": { "type": "string" },
		"contentEncoding": { "type": "string" },
		"if": { "$ref": "#" },
		"then": { "$ref": "#" },
		"else": { "$ref": "#" },
		"allOf": { "$ref": "#/definitions/schemaArray" },
		"anyOf": { "$ref": "#/definitions/schemaArray" },
		"oneOf": { "$ref": "#/definitions/schemaArray" },
		"not": { "$ref": "#" }
	};
	json_schema_draft_07_default = {
		$schema: $schema$2,
		$id: $id$2,
		title: title$2,
		definitions,
		type: type$2,
		properties: properties$2,
		"default": true
	};
});
//#endregion
//#region node_modules/ajv/dist/ajv.js
var require_ajv = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
	var core_1 = require_core$1();
	var draft7_1 = require_draft7();
	var discriminator_1 = require_discriminator();
	var draft7MetaSchema = (init_json_schema_draft_07(), __toCommonJS(json_schema_draft_07_exports).default);
	var META_SUPPORT_DATA = ["/properties"];
	var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
	var Ajv = class extends core_1.default {
		_addVocabularies() {
			super._addVocabularies();
			draft7_1.default.forEach((v) => this.addVocabulary(v));
			if (this.opts.discriminator) this.addKeyword(discriminator_1.default);
		}
		_addDefaultMetaSchema() {
			super._addDefaultMetaSchema();
			if (!this.opts.meta) return;
			const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
			this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
			this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
		}
		defaultMeta() {
			return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
		}
	};
	exports.Ajv = Ajv;
	module.exports = exports = Ajv;
	module.exports.Ajv = Ajv;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Ajv;
	var validate_1 = require_validate();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error();
	Object.defineProperty(exports, "ValidationError", {
		enumerable: true,
		get: function() {
			return validation_error_1.default;
		}
	});
	var ref_error_1 = require_ref_error();
	Object.defineProperty(exports, "MissingRefError", {
		enumerable: true,
		get: function() {
			return ref_error_1.default;
		}
	});
}));
//#endregion
//#region node_modules/ajv-formats/dist/limit.js
var require_limit = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.formatLimitDefinition = void 0;
	var ajv_1 = require_ajv();
	var codegen_1 = require_codegen();
	var ops = codegen_1.operators;
	var KWDs = {
		formatMaximum: {
			okStr: "<=",
			ok: ops.LTE,
			fail: ops.GT
		},
		formatMinimum: {
			okStr: ">=",
			ok: ops.GTE,
			fail: ops.LT
		},
		formatExclusiveMaximum: {
			okStr: "<",
			ok: ops.LT,
			fail: ops.GTE
		},
		formatExclusiveMinimum: {
			okStr: ">",
			ok: ops.GT,
			fail: ops.LTE
		}
	};
	exports.formatLimitDefinition = {
		keyword: Object.keys(KWDs),
		type: "string",
		schemaType: "string",
		$data: true,
		error: {
			message: ({ keyword, schemaCode }) => (0, codegen_1.str)`should be ${KWDs[keyword].okStr} ${schemaCode}`,
			params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, schemaCode, keyword, it } = cxt;
			const { opts, self } = it;
			if (!opts.validateFormats) return;
			const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
			if (fCxt.$data) validate$DataFormat();
			else validateFormat();
			function validate$DataFormat() {
				const fmts = gen.scopeValue("formats", {
					ref: self.formats,
					code: opts.code.formats
				});
				const fmt = gen.const("fmt", (0, codegen_1._)`${fmts}[${fCxt.schemaCode}]`);
				cxt.fail$data((0, codegen_1.or)((0, codegen_1._)`typeof ${fmt} != "object"`, (0, codegen_1._)`${fmt} instanceof RegExp`, (0, codegen_1._)`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
			}
			function validateFormat() {
				const format = fCxt.schema;
				const fmtDef = self.formats[format];
				if (!fmtDef || fmtDef === true) return;
				if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
				const fmt = gen.scopeValue("formats", {
					key: format,
					ref: fmtDef,
					code: opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(format)}` : void 0
				});
				cxt.fail$data(compareCode(fmt));
			}
			function compareCode(fmt) {
				return (0, codegen_1._)`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
			}
		},
		dependencies: ["format"]
	};
	var formatLimitPlugin = (ajv) => {
		ajv.addKeyword(exports.formatLimitDefinition);
		return ajv;
	};
	exports.default = formatLimitPlugin;
}));
//#endregion
//#region node_modules/ajv-formats/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var formats_1 = require_formats();
	var limit_1 = require_limit();
	var codegen_1 = require_codegen();
	var fullName = new codegen_1.Name("fullFormats");
	var fastName = new codegen_1.Name("fastFormats");
	var formatsPlugin = (ajv, opts = { keywords: true }) => {
		if (Array.isArray(opts)) {
			addFormats(ajv, opts, formats_1.fullFormats, fullName);
			return ajv;
		}
		const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
		addFormats(ajv, opts.formats || formats_1.formatNames, formats, exportName);
		if (opts.keywords) (0, limit_1.default)(ajv);
		return ajv;
	};
	formatsPlugin.get = (name, mode = "full") => {
		const f = (mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats)[name];
		if (!f) throw new Error(`Unknown format "${name}"`);
		return f;
	};
	function addFormats(ajv, list, fs, exportName) {
		var _a;
		var _b;
		(_a = (_b = ajv.opts.code).formats) !== null && _a !== void 0 || (_b.formats = (0, codegen_1._)`require("ajv-formats/dist/formats").${exportName}`);
		for (const f of list) ajv.addFormat(f, fs[f]);
	}
	module.exports = exports = formatsPlugin;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = formatsPlugin;
}));
//#endregion
//#region ../schema/report.schema.json
var import__2020 = /* @__PURE__ */ __toESM(require__2020(), 1);
var import_dist = /* @__PURE__ */ __toESM(require_dist(), 1);
var report_schema_default = {
	$schema: "https://json-schema.org/draft/2020-12/schema",
	$id: "https://governdiff.dev/schema/report/1.5.json",
	title: "GovernDiff analysis report",
	description: "Public report contract for GovernDiff 0.6.x.",
	type: "object",
	required: [
		"schema_version",
		"generator",
		"generated_at",
		"disclaimer",
		"selection",
		"redacted",
		"review_import",
		"waiver_diagnostics",
		"old_document",
		"new_document",
		"summary",
		"unfiltered_summary",
		"article_mappings",
		"section_tree",
		"changes"
	],
	properties: {
		"schema_version": { "const": "1.5" },
		"generator": {
			"type": "string",
			"pattern": "^governdiff/[0-9]+\\.[0-9]+\\.[0-9]+$"
		},
		"generated_at": {
			"type": "string",
			"format": "date-time"
		},
		"disclaimer": {
			"type": "string",
			"minLength": 40
		},
		"selection": { "$ref": "#/$defs/selection" },
		"redacted": { "type": "boolean" },
		"review_import": { "type": ["object", "null"] },
		"waiver_diagnostics": {
			"type": "array",
			"items": { "$ref": "#/$defs/diagnostic" }
		},
		"old_document": { "$ref": "#/$defs/document" },
		"new_document": { "$ref": "#/$defs/document" },
		"summary": { "$ref": "#/$defs/summary" },
		"unfiltered_summary": { "$ref": "#/$defs/summary" },
		"article_mappings": {
			"type": "array",
			"items": { "type": "object" }
		},
		"section_tree": {
			"type": "array",
			"items": { "type": "object" }
		},
		"changes": {
			"type": "array",
			"items": { "$ref": "#/$defs/change" }
		}
	},
	$defs: {
		"sha256": {
			"type": "string",
			"pattern": "^[a-fA-F0-9]{64}$"
		},
		"reviewState": { "enum": [
			"unreviewed",
			"confirmed",
			"rejected",
			"modified",
			"waived"
		] },
		"nullableString": { "type": ["string", "null"] },
		"selection": {
			"type": "object",
			"required": [
				"scope",
				"minimum_confidence",
				"filters",
				"selected_change_count",
				"selected_finding_count"
			],
			"properties": {
				"scope": { "enum": [
					"all",
					"breaking",
					"confirmed",
					"unreviewed",
					"filtered"
				] },
				"minimum_confidence": { "enum": [
					"low",
					"medium",
					"high"
				] },
				"filters": {
					"type": "object",
					"properties": {
						"change_types": { "$ref": "#/$defs/stringArray" },
						"checks": { "$ref": "#/$defs/stringArray" },
						"severities": { "$ref": "#/$defs/stringArray" },
						"confidence_levels": { "$ref": "#/$defs/stringArray" },
						"review_states": { "$ref": "#/$defs/stringArray" },
						"sections": { "$ref": "#/$defs/stringArray" },
						"visible_change_fingerprints": { "$ref": "#/$defs/stringArray" },
						"visible_finding_fingerprints": { "$ref": "#/$defs/stringArray" }
					},
					"additionalProperties": false
				},
				"selected_change_count": {
					"type": "integer",
					"minimum": 0
				},
				"selected_finding_count": {
					"type": "integer",
					"minimum": 0
				}
			},
			"additionalProperties": false
		},
		"stringArray": {
			"type": "array",
			"items": { "type": "string" },
			"uniqueItems": true
		},
		"diagnostic": {
			"type": "object",
			"required": [
				"code",
				"severity",
				"message"
			],
			"properties": {
				"code": {
					"type": "string",
					"minLength": 1
				},
				"severity": { "enum": [
					"info",
					"warning",
					"error"
				] },
				"message": {
					"type": "string",
					"minLength": 1
				},
				"fingerprint": { "type": "string" },
				"expires_at": { "type": "string" }
			},
			"additionalProperties": true
		},
		"document": {
			"type": "object",
			"required": [
				"sha256",
				"language",
				"format",
				"imported_at",
				"block_count",
				"word_count",
				"table_count",
				"preflight"
			],
			"properties": {
				"path": { "type": "string" },
				"source_name": { "type": "string" },
				"sha256": { "$ref": "#/$defs/sha256" },
				"language": { "type": "string" },
				"format": { "type": "string" },
				"imported_at": {
					"type": "string",
					"format": "date-time"
				},
				"block_count": {
					"type": "integer",
					"minimum": 0
				},
				"word_count": {
					"type": "integer",
					"minimum": 0
				},
				"table_count": {
					"type": "integer",
					"minimum": 0
				},
				"section_tree": { "type": "array" },
				"tables": { "type": "array" },
				"preflight": { "type": ["object", "null"] }
			},
			"anyOf": [{ "required": ["path"] }, { "required": ["source_name"] }],
			"additionalProperties": false
		},
		"summary": {
			"type": "object",
			"required": [
				"total_changes",
				"change_types",
				"findings",
				"active_findings",
				"breaking_findings",
				"high_confidence_breaking_findings",
				"review_states",
				"confidence",
				"article_mappings",
				"renumbered_article_mappings",
				"article_mapping_conflicts",
				"highest_severity"
			],
			"properties": {
				"total_changes": {
					"type": "integer",
					"minimum": 0
				},
				"change_types": { "type": "object" },
				"findings": {
					"type": "integer",
					"minimum": 0
				},
				"active_findings": {
					"type": "integer",
					"minimum": 0
				},
				"breaking_findings": {
					"type": "integer",
					"minimum": 0
				},
				"high_confidence_breaking_findings": {
					"type": "integer",
					"minimum": 0
				},
				"review_states": { "type": "object" },
				"confidence": { "type": "object" },
				"article_mappings": {
					"type": "integer",
					"minimum": 0
				},
				"renumbered_article_mappings": {
					"type": "integer",
					"minimum": 0
				},
				"article_mapping_conflicts": {
					"type": "integer",
					"minimum": 0
				},
				"highest_severity": { "enum": [
					"info",
					"low",
					"medium",
					"high",
					"critical"
				] }
			},
			"additionalProperties": false
		},
		"block": {
			"type": ["object", "null"],
			"properties": {
				"block_id": { "type": "string" },
				"section": {
					"type": "array",
					"items": { "type": "string" }
				},
				"text": { "type": "string" },
				"normalized_text": { "type": "string" },
				"comparison_text": { "type": "string" },
				"ordinal": { "type": "integer" },
				"line_start": { "type": "integer" },
				"line_end": { "type": "integer" },
				"block_type": { "type": "string" },
				"page_start": { "type": ["integer", "null"] },
				"page_end": { "type": ["integer", "null"] },
				"paragraph_start": { "type": ["integer", "null"] },
				"paragraph_end": { "type": ["integer", "null"] },
				"char_start": { "type": ["integer", "null"] },
				"char_end": { "type": ["integer", "null"] },
				"list_level": { "type": ["integer", "null"] },
				"table_id": { "type": ["string", "null"] },
				"table_row": { "type": ["integer", "null"] },
				"table_column": { "type": ["integer", "null"] },
				"is_noise": { "type": "boolean" },
				"section_label": { "type": "string" },
				"evidence_label": { "type": "string" }
			},
			"additionalProperties": false
		},
		"finding": {
			"type": "object",
			"required": [
				"fingerprint",
				"check_id",
				"severity",
				"breaking",
				"summary",
				"field",
				"old_value",
				"new_value",
				"old_evidence",
				"new_evidence",
				"explanation",
				"confidence_score",
				"confidence_level",
				"confidence_reasons",
				"waived",
				"waiver_reason",
				"waiver_approver",
				"waiver_created_at",
				"waiver_expires_at",
				"review_state",
				"review_note",
				"review_updated_at",
				"reviewed_old_value",
				"reviewed_new_value",
				"field_modified",
				"machine_values",
				"reviewed_values",
				"effective_values",
				"active"
			],
			"properties": {
				"fingerprint": {
					"type": "string",
					"pattern": "^GVD-[A-Z0-9]+$"
				},
				"check_id": { "type": "string" },
				"severity": { "enum": [
					"info",
					"low",
					"medium",
					"high",
					"critical"
				] },
				"breaking": { "type": "boolean" },
				"summary": { "type": "string" },
				"field": { "type": "string" },
				"old_value": { "$ref": "#/$defs/nullableString" },
				"new_value": { "$ref": "#/$defs/nullableString" },
				"old_evidence": { "$ref": "#/$defs/nullableString" },
				"new_evidence": { "$ref": "#/$defs/nullableString" },
				"explanation": { "type": "string" },
				"confidence_score": {
					"type": "number",
					"minimum": 0,
					"maximum": 1
				},
				"confidence_level": { "enum": [
					"low",
					"medium",
					"high"
				] },
				"confidence_reasons": { "$ref": "#/$defs/stringArray" },
				"waived": { "type": "boolean" },
				"waiver_reason": { "$ref": "#/$defs/nullableString" },
				"waiver_approver": { "$ref": "#/$defs/nullableString" },
				"waiver_created_at": { "$ref": "#/$defs/nullableString" },
				"waiver_expires_at": { "$ref": "#/$defs/nullableString" },
				"review_state": { "$ref": "#/$defs/reviewState" },
				"review_note": { "$ref": "#/$defs/nullableString" },
				"review_updated_at": { "$ref": "#/$defs/nullableString" },
				"reviewed_old_value": { "$ref": "#/$defs/nullableString" },
				"reviewed_new_value": { "$ref": "#/$defs/nullableString" },
				"field_modified": { "type": "boolean" },
				"machine_values": { "$ref": "#/$defs/valuePair" },
				"reviewed_values": { "anyOf": [{ "$ref": "#/$defs/valuePair" }, { "type": "null" }] },
				"effective_values": { "$ref": "#/$defs/valuePair" },
				"active": { "type": "boolean" }
			},
			"additionalProperties": false
		},
		"valuePair": {
			"type": "object",
			"required": ["old", "new"],
			"properties": {
				"old": { "$ref": "#/$defs/nullableString" },
				"new": { "$ref": "#/$defs/nullableString" }
			},
			"additionalProperties": false
		},
		"change": {
			"type": "object",
			"required": [
				"fingerprint",
				"change_type",
				"similarity",
				"severity",
				"section",
				"section_path",
				"section_id",
				"old_article",
				"new_article",
				"article_mapping",
				"confidence_score",
				"confidence_level",
				"confidence_reasons",
				"alignment_status",
				"review",
				"old_block",
				"new_block",
				"old_blocks",
				"new_blocks",
				"word_diff",
				"temporal_changes",
				"findings"
			],
			"properties": {
				"fingerprint": {
					"type": "string",
					"pattern": "^GVC-[A-Z0-9]+$"
				},
				"change_type": { "enum": [
					"added",
					"removed",
					"modified",
					"split",
					"merged",
					"moved",
					"format_only",
					"unchanged"
				] },
				"similarity": {
					"type": "number",
					"minimum": 0,
					"maximum": 1
				},
				"severity": { "enum": [
					"info",
					"low",
					"medium",
					"high",
					"critical"
				] },
				"section": { "type": "string" },
				"section_path": {
					"type": "array",
					"items": { "type": "string" }
				},
				"section_id": { "type": "string" },
				"old_article": { "$ref": "#/$defs/nullableString" },
				"new_article": { "$ref": "#/$defs/nullableString" },
				"article_mapping": { "type": ["object", "null"] },
				"confidence_score": {
					"type": "number",
					"minimum": 0,
					"maximum": 1
				},
				"confidence_level": { "enum": [
					"low",
					"medium",
					"high"
				] },
				"confidence_reasons": { "$ref": "#/$defs/stringArray" },
				"alignment_status": { "type": "string" },
				"review": {
					"type": "object",
					"required": [
						"state",
						"note",
						"updated_at"
					],
					"properties": {
						"state": { "$ref": "#/$defs/reviewState" },
						"note": { "$ref": "#/$defs/nullableString" },
						"updated_at": { "$ref": "#/$defs/nullableString" }
					},
					"additionalProperties": false
				},
				"old_block": { "$ref": "#/$defs/block" },
				"new_block": { "$ref": "#/$defs/block" },
				"old_blocks": {
					"type": "array",
					"items": { "$ref": "#/$defs/block" }
				},
				"new_blocks": {
					"type": "array",
					"items": { "$ref": "#/$defs/block" }
				},
				"word_diff": {
					"type": "array",
					"items": { "type": "object" }
				},
				"temporal_changes": {
					"type": "array",
					"items": { "type": "object" }
				},
				"findings": {
					"type": "array",
					"items": { "$ref": "#/$defs/finding" }
				}
			},
			"additionalProperties": false
		}
	},
	additionalProperties: false
};
var review_schema_default = {
	$schema: "https://json-schema.org/draft/2020-12/schema",
	$id: "https://governdiff.dev/schema/review/1.1.json",
	title: "GovernDiff portable review",
	type: "object",
	required: [
		"schema_version",
		"report",
		"exported_at",
		"decisions",
		"field_edits",
		"alignment_overrides"
	],
	properties: {
		"schema_version": { "const": "governdiff-review/1.1" },
		"report": {
			"type": "object",
			"required": [
				"old_sha256",
				"new_sha256",
				"generated_at"
			],
			"properties": {
				"old_sha256": { "$ref": "#/$defs/sha256" },
				"new_sha256": { "$ref": "#/$defs/sha256" },
				"generated_at": {
					"type": "string",
					"format": "date-time"
				}
			},
			"additionalProperties": false
		},
		"exported_at": {
			"type": "string",
			"format": "date-time"
		},
		"decisions": {
			"type": "array",
			"items": {
				"type": "object",
				"required": [
					"change_fingerprint",
					"state",
					"note",
					"updated_at"
				],
				"properties": {
					"change_fingerprint": { "$ref": "#/$defs/changeFingerprint" },
					"state": { "$ref": "#/$defs/reviewState" },
					"note": { "type": "string" },
					"updated_at": {
						"type": "string",
						"format": "date-time"
					}
				},
				"additionalProperties": false
			}
		},
		"field_edits": {
			"type": "array",
			"items": {
				"type": "object",
				"required": [
					"change_fingerprint",
					"finding_fingerprint",
					"field",
					"machine_old_value",
					"machine_new_value",
					"reviewed_old_value",
					"reviewed_new_value",
					"updated_at"
				],
				"properties": {
					"change_fingerprint": { "$ref": "#/$defs/changeFingerprint" },
					"finding_fingerprint": { "$ref": "#/$defs/findingFingerprint" },
					"field": {
						"type": "string",
						"minLength": 1
					},
					"machine_old_value": { "type": ["string", "null"] },
					"machine_new_value": { "type": ["string", "null"] },
					"reviewed_old_value": { "type": ["string", "null"] },
					"reviewed_new_value": { "type": ["string", "null"] },
					"updated_at": {
						"type": "string",
						"format": "date-time"
					}
				},
				"additionalProperties": false
			}
		},
		"alignment_overrides": {
			"type": "array",
			"items": {
				"type": "object",
				"required": [
					"action",
					"original_change_fingerprint",
					"old_block_ids",
					"new_block_ids"
				],
				"properties": {
					"action": { "enum": ["unlink", "relink"] },
					"original_change_fingerprint": { "$ref": "#/$defs/changeFingerprint" },
					"old_block_ids": {
						"type": "array",
						"items": { "type": "string" },
						"uniqueItems": true
					},
					"new_block_ids": {
						"type": "array",
						"items": { "type": "string" },
						"uniqueItems": true
					},
					"updated_at": {
						"type": "string",
						"format": "date-time"
					},
					"updatedAt": {
						"type": "string",
						"format": "date-time"
					}
				},
				"additionalProperties": false
			}
		},
		"filters": {
			"type": "object",
			"properties": { "visible_change_fingerprints": {
				"type": "array",
				"items": { "$ref": "#/$defs/changeFingerprint" },
				"uniqueItems": true
			} },
			"additionalProperties": false
		}
	},
	$defs: {
		"reviewState": { "enum": [
			"unreviewed",
			"confirmed",
			"rejected",
			"modified",
			"waived"
		] },
		"sha256": {
			"type": "string",
			"pattern": "^[a-fA-F0-9]{64}$"
		},
		"changeFingerprint": {
			"type": "string",
			"pattern": "^GVC-[A-Z0-9]+$"
		},
		"findingFingerprint": {
			"type": "string",
			"pattern": "^GVD-[A-Z0-9]+$"
		}
	},
	additionalProperties: false
};
//#endregion
//#region app/report-import.ts
function isRecord$1(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
var reportValidator;
var reviewValidator;
function validators() {
	if (!reportValidator || !reviewValidator) {
		const schemaValidator = (0, import_dist.default)(new import__2020.default({
			allErrors: true,
			strict: false,
			verbose: false
		}));
		reportValidator = schemaValidator.compile(report_schema_default);
		reviewValidator = schemaValidator.compile(review_schema_default);
	}
	return {
		report: reportValidator,
		review: reviewValidator
	};
}
function validationIssues(errors = []) {
	return errors.map((error) => {
		const missing = error.keyword === "required" && typeof error.params.missingProperty === "string" ? `/${error.params.missingProperty}` : "";
		return {
			path: `${error.instancePath || "/"}${missing}`.replace("//", "/"),
			message: error.message ?? "is invalid",
			keyword: error.keyword
		};
	});
}
function issuePreview(issues) {
	const preview = issues.slice(0, 6).map((issue) => `${issue.path}: ${issue.message}`).join("; ");
	const remaining = Math.max(0, issues.length - 6);
	return `${preview}${remaining ? `; plus ${remaining} more issue(s)` : ""}`;
}
var ReportValidationError = class extends Error {
	constructor(errors = []) {
		const issues = validationIssues(errors);
		super(`Report 1.5 validation failed. ${issuePreview(issues)}. Regenerate the JSON with GovernDiff 0.6.x and try again.`);
		this.name = "ReportValidationError";
		this.issues = issues;
	}
};
var ReviewValidationError = class extends Error {
	constructor(errors = []) {
		const issues = validationIssues(errors);
		super(`Review 1.1 validation failed. ${issuePreview(issues)}. Export a fresh review JSON from the current GovernDiff Reviewer and try again.`);
		this.name = "ReviewValidationError";
		this.issues = issues;
	}
};
var ReviewIdentityMismatchError = class extends Error {
	constructor() {
		super("The imported review belongs to a different old/new report pair. Open its matching report or export a review for the current project.");
		this.name = "ReviewIdentityMismatchError";
	}
};
function parseReport(value) {
	const { report } = validators();
	if (!report(value)) throw new ReportValidationError(report.errors ?? []);
	return value;
}
async function readJsonFile(file) {
	try {
		return JSON.parse(await file.text());
	} catch {
		throw new Error("Invalid JSON file.");
	}
}
function parseDecision(value) {
	if (!isRecord$1(value)) throw new Error("Review decision entries must be objects.");
	return {
		state: normalizeState(value.state),
		note: typeof value.note === "string" ? value.note : "",
		updatedAt: typeof value.updated_at === "string" ? value.updated_at : typeof value.updatedAt === "string" ? value.updatedAt : ""
	};
}
function parseReviewImport(value, report) {
	if (!isRecord$1(value)) throw new Error("Invalid review JSON.");
	if (value.schema_version !== "governdiff-review/1.0" && value.schema_version !== "governdiff-review/1.1") throw new Error("Unsupported review schema version.");
	const { review } = validators();
	if (value.schema_version === "governdiff-review/1.1" && !review(value)) throw new ReviewValidationError(review.errors ?? []);
	const reportIdentity = isRecord$1(value.report) ? value.report : {};
	if (reportIdentity.old_sha256 !== report.old_document.sha256 || reportIdentity.new_sha256 !== report.new_document.sha256) throw new ReviewIdentityMismatchError();
	return {
		decisions: Array.isArray(value.decisions) ? Object.fromEntries(value.decisions.map((item) => {
			if (!isRecord$1(item) || typeof item.change_fingerprint !== "string") throw new Error("Review decision is missing change_fingerprint.");
			return [item.change_fingerprint, parseDecision(item)];
		})) : isRecord$1(value.decisions) ? Object.fromEntries(Object.entries(value.decisions).map(([key, item]) => [key, parseDecision(item)])) : {},
		fieldEdits: Array.isArray(value.field_edits) ? Object.fromEntries(value.field_edits.map((item) => {
			if (!isRecord$1(item) || typeof item.finding_fingerprint !== "string") throw new Error("Field edit is missing finding_fingerprint.");
			return [item.finding_fingerprint, item];
		})) : {},
		alignmentOverrides: Array.isArray(value.alignment_overrides) ? Object.fromEntries(value.alignment_overrides.map((item) => {
			if (!isRecord$1(item) || typeof item.original_change_fingerprint !== "string") throw new Error("Alignment override is missing original_change_fingerprint.");
			const updatedAt = typeof item.updated_at === "string" ? item.updated_at : typeof item.updatedAt === "string" ? item.updatedAt : "";
			return [item.original_change_fingerprint, {
				...item,
				updatedAt
			}];
		})) : {}
	};
}
//#endregion
//#region app/reviewer-reducer.ts
var defaultFilters = {
	query: "",
	confidence: "all",
	changeType: "all",
	sectionFilter: "",
	breakingOnly: false,
	unreviewedOnly: false,
	hideFormatOnly: false,
	sortBy: "document"
};
var initialReviewerState = {
	report: null,
	loadError: "",
	notice: "",
	filters: defaultFilters,
	savedViews: [],
	interfaceLanguage: "en",
	selectedId: "",
	batchIds: [],
	decisions: {},
	fieldEdits: {},
	alignmentOverrides: {},
	projectId: "",
	projectCreatedAt: "",
	projectUpdatedAt: "",
	projectRevision: 0,
	savedRevision: 0,
	exportStatus: {
		state: "unexported",
		last_exported_at: null,
		exported_revision: null
	}
};
function changed(state, patch) {
	return {
		...state,
		...patch,
		projectRevision: state.projectRevision + 1,
		exportStatus: {
			...state.exportStatus,
			state: "unexported"
		}
	};
}
function preferenceChanged(state, patch) {
	return {
		...state,
		...patch,
		projectRevision: state.projectRevision + 1
	};
}
function reviewerReducer(state, action) {
	switch (action.type) {
		case "load-project": return {
			...initialReviewerState,
			report: action.project.report,
			selectedId: action.project.report.changes.find((item) => item.change_type !== "unchanged")?.fingerprint ?? "",
			filters: action.project.filters,
			savedViews: action.project.saved_views,
			interfaceLanguage: action.project.interface_language,
			decisions: action.project.decisions,
			fieldEdits: action.project.field_edits,
			alignmentOverrides: action.project.alignment_overrides,
			projectId: action.project.id,
			projectCreatedAt: action.project.created_at,
			projectUpdatedAt: action.project.updated_at,
			projectRevision: action.project.revision,
			savedRevision: action.persisted ? action.project.revision : Math.max(0, action.project.revision - 1),
			exportStatus: action.project.export_status
		};
		case "set-load-error": return {
			...state,
			loadError: action.message
		};
		case "set-notice": return {
			...state,
			notice: action.message
		};
		case "set-filter": return changed(state, {
			filters: {
				...state.filters,
				[action.name]: action.value
			},
			batchIds: []
		});
		case "apply-filters": return changed(state, {
			filters: action.filters,
			batchIds: []
		});
		case "reset-filters": return changed(state, {
			filters: {
				...defaultFilters,
				sortBy: state.filters.sortBy
			},
			batchIds: []
		});
		case "set-saved-views": return preferenceChanged(state, { savedViews: action.savedViews });
		case "set-interface-language": return preferenceChanged(state, { interfaceLanguage: action.language });
		case "select-change": return {
			...state,
			selectedId: action.fingerprint
		};
		case "toggle-batch": return {
			...state,
			batchIds: action.selected ? Array.from(/* @__PURE__ */ new Set([...state.batchIds, action.fingerprint])) : state.batchIds.filter((item) => item !== action.fingerprint)
		};
		case "set-batch": return {
			...state,
			batchIds: Array.from(new Set(action.fingerprints))
		};
		case "set-decisions": return changed(state, { decisions: action.decisions });
		case "set-decision": return changed(state, { decisions: {
			...state.decisions,
			[action.fingerprint]: action.decision
		} });
		case "set-field-edit": return changed(state, { fieldEdits: {
			...state.fieldEdits,
			[action.fingerprint]: action.edit
		} });
		case "set-alignment": return changed(state, { alignmentOverrides: {
			...state.alignmentOverrides,
			[action.fingerprint]: action.alignment
		} });
		case "import-review": return changed(state, {
			loadError: "",
			notice: "",
			decisions: action.review.decisions,
			fieldEdits: action.review.fieldEdits,
			alignmentOverrides: action.review.alignmentOverrides
		});
		case "restore-review-data": return changed(state, {
			decisions: action.snapshot.decisions,
			fieldEdits: action.snapshot.fieldEdits,
			alignmentOverrides: action.snapshot.alignmentOverrides,
			filters: action.snapshot.filters,
			savedViews: action.snapshot.savedViews
		});
		case "mark-saved": return {
			...state,
			loadError: "",
			savedRevision: Math.max(state.savedRevision, action.revision),
			projectUpdatedAt: action.updatedAt
		};
		case "mark-exported": {
			const revision = state.projectRevision + 1;
			return {
				...state,
				projectRevision: revision,
				exportStatus: {
					state: "exported",
					last_exported_at: action.exportedAt,
					exported_revision: revision
				}
			};
		}
		case "clear-project": return { ...initialReviewerState };
		default: return state;
	}
}
//#endregion
//#region app/persistence.ts
var PROJECT_SCHEMA_VERSION = "governdiff-project/1.1";
var PROJECT_DATABASE_NAME = "governdiff-reviewer";
var RECOVERY_TTL_MS = 6048e5;
var ACTIVE_PROJECT_KEY = "active-project";
var LAST_DELETED_PROJECT_KEY = "last-deleted-project";
var ProjectStorageError = class extends Error {
	constructor(code, message) {
		super(message);
		this.name = "ProjectStorageError";
		this.code = code;
	}
};
var ProjectCorruptionError = class extends ProjectStorageError {
	constructor() {
		super("corrupt", "A local project record is damaged or incompatible and was isolated from active work.");
		this.name = "ProjectCorruptionError";
	}
};
var projectDatabaseFactory = null;
var projectDatabasePromise = null;
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function storageError(error) {
	if (error instanceof ProjectStorageError) return error;
	if (error instanceof DOMException && error.name === "QuotaExceededError") return new ProjectStorageError("quota", "Local storage is full. The last saved project is still available; free browser storage and retry.");
	if (error instanceof DOMException && [
		"InvalidStateError",
		"NotSupportedError",
		"SecurityError"
	].includes(error.name)) return new ProjectStorageError("unavailable", "Secure local project storage is unavailable in this browser context.");
	return new ProjectStorageError("transaction", "The local project transaction did not complete. The last saved version was retained.");
}
function activeFactory() {
	const factory = projectDatabaseFactory ?? globalThis.indexedDB;
	if (!factory) throw new ProjectStorageError("unavailable", "Secure local project storage is unavailable in this browser context.");
	return factory;
}
function requestResult(request) {
	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}
function transactionComplete(transaction) {
	return new Promise((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = () => reject(transaction.error);
		transaction.onabort = () => reject(transaction.error);
	});
}
function openProjectDatabase() {
	if (projectDatabasePromise) return projectDatabasePromise;
	const opening = new Promise((resolve, reject) => {
		let request;
		try {
			request = activeFactory().open(PROJECT_DATABASE_NAME, 1);
		} catch (error) {
			reject(storageError(error));
			return;
		}
		request.onupgradeneeded = () => {
			const database = request.result;
			if (!database.objectStoreNames.contains("projects")) database.createObjectStore("projects", { keyPath: "id" });
			if (!database.objectStoreNames.contains("meta")) database.createObjectStore("meta", { keyPath: "key" });
			if (!database.objectStoreNames.contains("trash")) database.createObjectStore("trash", { keyPath: "id" });
			if (!database.objectStoreNames.contains("quarantine")) database.createObjectStore("quarantine", { keyPath: "id" });
		};
		request.onsuccess = () => {
			const database = request.result;
			database.onversionchange = () => database.close();
			resolve(database);
		};
		request.onerror = () => reject(storageError(request.error));
		request.onblocked = () => reject(new ProjectStorageError("unavailable", "Local project storage is busy in another window. Close the other window and retry."));
	}).catch((error) => {
		projectDatabasePromise = null;
		throw storageError(error);
	});
	projectDatabasePromise = opening;
	return opening;
}
function projectIdForReport(report) {
	return `governdiff:${report.old_document.sha256}:${report.new_document.sha256}`;
}
function reportIdentityMatches(left, right) {
	return left.old_document.sha256 === right.old_document.sha256 && left.new_document.sha256 === right.new_document.sha256;
}
function normalizedFilters(value) {
	if (!isRecord(value)) return { ...defaultFilters };
	const confidence = [
		"all",
		"high",
		"medium",
		"low"
	].includes(String(value.confidence)) ? value.confidence : "all";
	return {
		query: typeof value.query === "string" ? value.query : "",
		confidence,
		changeType: typeof value.changeType === "string" ? value.changeType : "all",
		sectionFilter: typeof value.sectionFilter === "string" ? value.sectionFilter : "",
		breakingOnly: value.breakingOnly === true,
		unreviewedOnly: value.unreviewedOnly === true,
		hideFormatOnly: value.hideFormatOnly === true,
		sortBy: [
			"document",
			"risk",
			"unreviewed"
		].includes(String(value.sortBy)) ? value.sortBy : "document"
	};
}
function normalizedSavedViews(value) {
	if (value === void 0) return [];
	if (!Array.isArray(value)) throw new ProjectCorruptionError();
	const ids = /* @__PURE__ */ new Set();
	const names = /* @__PURE__ */ new Set();
	return value.map((item) => {
		if (!isRecord(item)) throw new ProjectCorruptionError();
		const id = typeof item.id === "string" ? item.id : "";
		const name = typeof item.name === "string" ? item.name.trim() : "";
		const normalizedName = name.toLocaleLowerCase();
		if (!id || !name || name.length > 40 || ids.has(id) || names.has(normalizedName)) throw new ProjectCorruptionError();
		ids.add(id);
		names.add(normalizedName);
		const createdAt = validTimestamp(item.created_at, "1970-01-01T00:00:00.000Z");
		return {
			id,
			name,
			filters: normalizedFilters(item.filters),
			created_at: createdAt,
			updated_at: validTimestamp(item.updated_at, createdAt)
		};
	});
}
function normalizedLanguage(value) {
	return value === "zh-CN" ? "zh-CN" : "en";
}
function normalizedDecisions(value) {
	if (!isRecord(value)) throw new ProjectCorruptionError();
	return Object.fromEntries(Object.entries(value).map(([fingerprint, item]) => {
		if (!isRecord(item)) throw new ProjectCorruptionError();
		return [fingerprint, {
			state: normalizeState(item.state),
			note: typeof item.note === "string" ? item.note : "",
			updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : typeof item.updated_at === "string" ? item.updated_at : ""
		}];
	}));
}
function normalizedRecord(value) {
	if (!isRecord(value)) throw new ProjectCorruptionError();
	if (Object.values(value).some((item) => !isRecord(item))) throw new ProjectCorruptionError();
	return value;
}
function normalizedExportStatus(value, revision, legacyExportedAt) {
	if (isRecord(value)) {
		const state = value.state === "exported" ? "exported" : "unexported";
		const exportedRevision = Number.isInteger(value.exported_revision) && Number(value.exported_revision) >= 0 ? Number(value.exported_revision) : null;
		return {
			state,
			last_exported_at: typeof value.last_exported_at === "string" ? value.last_exported_at : null,
			exported_revision: state === "exported" ? exportedRevision : null
		};
	}
	if (typeof legacyExportedAt === "string") return {
		state: "exported",
		last_exported_at: legacyExportedAt,
		exported_revision: revision
	};
	return {
		state: "unexported",
		last_exported_at: null,
		exported_revision: null
	};
}
function validTimestamp(value, fallback) {
	if (typeof value === "string" && Number.isFinite(Date.parse(value))) return value;
	return fallback;
}
function migrateProjectRecord(value) {
	if (!isRecord(value)) throw new ProjectCorruptionError();
	const version = value.schema_version;
	if (version !== "governdiff-project/1.1" && version !== "governdiff-project/1.0" && version !== "governdiff-project/0.9" && version !== void 0) throw new ProjectCorruptionError();
	if (version === "governdiff-project/1.1") {
		if ([
			"id",
			"report_identity",
			"report",
			"decisions",
			"field_edits",
			"alignment_overrides",
			"filters",
			"saved_views",
			"interface_language",
			"export_status",
			"revision",
			"created_at",
			"updated_at"
		].some((key) => !Object.hasOwn(value, key))) throw new ProjectCorruptionError();
		if (!Number.isInteger(value.revision) || Number(value.revision) < 1 || typeof value.created_at !== "string" || !Number.isFinite(Date.parse(value.created_at)) || typeof value.updated_at !== "string" || !Number.isFinite(Date.parse(value.updated_at)) || !isRecord(value.export_status) || !isRecord(value.filters) || !Array.isArray(value.saved_views) || !["en", "zh-CN"].includes(String(value.interface_language)) || !["unexported", "exported"].includes(String(value.export_status.state))) throw new ProjectCorruptionError();
		if (value.export_status.state === "exported" && (!Number.isInteger(value.export_status.exported_revision) || Number(value.export_status.exported_revision) < 1 || typeof value.export_status.last_exported_at !== "string" || !Number.isFinite(Date.parse(value.export_status.last_exported_at)))) throw new ProjectCorruptionError();
	}
	let report;
	try {
		report = parseReport(value.report);
	} catch {
		throw new ProjectCorruptionError();
	}
	const expectedId = projectIdForReport(report);
	if (version === "governdiff-project/1.1") {
		if (value.id !== expectedId || !isRecord(value.report_identity)) throw new ProjectCorruptionError();
		if (value.report_identity.old_sha256 !== report.old_document.sha256 || value.report_identity.new_sha256 !== report.new_document.sha256) throw new ProjectCorruptionError();
	}
	const revision = Number.isInteger(value.revision) && Number(value.revision) >= 1 ? Number(value.revision) : 1;
	const fallbackTime = report.generated_at;
	const createdAt = validTimestamp(value.created_at ?? value.createdAt, fallbackTime);
	const updatedAt = validTimestamp(value.updated_at ?? value.updatedAt, createdAt);
	const decisions = normalizedDecisions(value.decisions ?? {});
	const fieldEdits = normalizedRecord(value.field_edits ?? value.fieldEdits ?? {});
	const alignmentOverrides = normalizedRecord(value.alignment_overrides ?? value.alignmentOverrides ?? {});
	return {
		id: expectedId,
		schema_version: PROJECT_SCHEMA_VERSION,
		report_identity: {
			old_sha256: report.old_document.sha256,
			new_sha256: report.new_document.sha256
		},
		report,
		decisions,
		field_edits: fieldEdits,
		alignment_overrides: alignmentOverrides,
		filters: normalizedFilters(value.filters),
		saved_views: normalizedSavedViews(value.saved_views),
		interface_language: normalizedLanguage(value.interface_language),
		export_status: normalizedExportStatus(value.export_status ?? value.exportStatus, revision, value.exported_at ?? value.exportedAt),
		revision,
		created_at: createdAt,
		updated_at: updatedAt
	};
}
function createProject({ report, decisions = {}, fieldEdits = {}, alignmentOverrides = {}, filters = defaultFilters, savedViews = [], interfaceLanguage = "en", exportStatus, revision = 1, createdAt, updatedAt }) {
	const now = updatedAt ?? (/* @__PURE__ */ new Date()).toISOString();
	return {
		id: projectIdForReport(report),
		schema_version: PROJECT_SCHEMA_VERSION,
		report_identity: {
			old_sha256: report.old_document.sha256,
			new_sha256: report.new_document.sha256
		},
		report,
		decisions,
		field_edits: fieldEdits,
		alignment_overrides: alignmentOverrides,
		filters: { ...filters },
		saved_views: normalizedSavedViews(savedViews),
		interface_language: normalizedLanguage(interfaceLanguage),
		export_status: exportStatus ?? {
			state: "unexported",
			last_exported_at: null,
			exported_revision: null
		},
		revision: Math.max(1, revision),
		created_at: createdAt ?? now,
		updated_at: now
	};
}
async function quarantineRecord(database, value, id) {
	const transaction = database.transaction([
		"projects",
		"meta",
		"quarantine"
	], "readwrite");
	const complete = transactionComplete(transaction);
	transaction.objectStore("quarantine").put({
		id: `corrupt:${id}`,
		detected_at: (/* @__PURE__ */ new Date()).toISOString(),
		reason_code: "invalid-project-record",
		value
	});
	transaction.objectStore("projects").delete(id);
	transaction.objectStore("meta").delete(ACTIVE_PROJECT_KEY);
	await complete;
}
function projectRevisionPayload(project) {
	return JSON.stringify({
		report_identity: project.report_identity,
		decisions: project.decisions,
		field_edits: project.field_edits,
		alignment_overrides: project.alignment_overrides,
		filters: project.filters,
		saved_views: project.saved_views,
		interface_language: project.interface_language,
		export_status: project.export_status
	});
}
async function setActiveProject(database, project, enforceRevision = false) {
	const transaction = database.transaction(["projects", "meta"], "readwrite");
	const complete = transactionComplete(transaction);
	const projects = transaction.objectStore("projects");
	if (enforceRevision) {
		const existingValue = await requestResult(projects.get(project.id));
		if (existingValue !== void 0) {
			let existing;
			try {
				existing = migrateProjectRecord(existingValue);
			} catch {
				transaction.abort();
				await complete.catch(() => void 0);
				throw new ProjectCorruptionError();
			}
			const staleRevision = project.revision < existing.revision;
			const divergentSameRevision = project.revision === existing.revision && projectRevisionPayload(project) !== projectRevisionPayload(existing);
			if (staleRevision || divergentSameRevision) {
				transaction.abort();
				await complete.catch(() => void 0);
				throw new ProjectStorageError("conflict", "This project changed in another tab. The newer saved version was retained; reload it before applying this edit again.");
			}
		}
	}
	projects.put(project);
	transaction.objectStore("meta").put({
		key: ACTIVE_PROJECT_KEY,
		project_id: project.id
	});
	await complete;
}
async function saveProject(project) {
	const normalized = migrateProjectRecord(project);
	try {
		await setActiveProject(await openProjectDatabase(), normalized, true);
		return normalized;
	} catch (error) {
		throw storageError(error);
	}
}
async function loadProjectForReport(report) {
	const database = await openProjectDatabase();
	const transaction = database.transaction("projects", "readonly");
	const complete = transactionComplete(transaction);
	const value = await requestResult(transaction.objectStore("projects").get(projectIdForReport(report)));
	await complete;
	if (value === void 0) return null;
	try {
		return migrateProjectRecord(value);
	} catch {
		await quarantineRecord(database, value, projectIdForReport(report));
		throw new ProjectCorruptionError();
	}
}
async function loadActiveProject() {
	const database = await openProjectDatabase();
	const transaction = database.transaction(["projects", "meta"], "readonly");
	const complete = transactionComplete(transaction);
	const activeRecord = await requestResult(transaction.objectStore("meta").get(ACTIVE_PROJECT_KEY));
	const allProjects = await requestResult(transaction.objectStore("projects").getAll());
	await complete;
	const activeId = isRecord(activeRecord) ? activeRecord.project_id : void 0;
	const ordered = [...allProjects].sort((left, right) => {
		const leftActive = isRecord(left) && left.id === activeId ? 1 : 0;
		const rightActive = isRecord(right) && right.id === activeId ? 1 : 0;
		if (leftActive !== rightActive) return rightActive - leftActive;
		const leftTime = isRecord(left) ? String(left.updated_at ?? "") : "";
		return (isRecord(right) ? String(right.updated_at ?? "") : "").localeCompare(leftTime);
	});
	let corruptionDetected = false;
	for (const value of ordered) {
		const candidateId = isRecord(value) && typeof value.id === "string" ? value.id : `unknown-${Date.now()}`;
		try {
			const project = migrateProjectRecord(value);
			if (!(isRecord(value) ? value.schema_version === "governdiff-project/1.1" : false) || activeId !== project.id) await setActiveProject(database, project);
			return {
				project,
				corruptionDetected
			};
		} catch {
			corruptionDetected = true;
			await quarantineRecord(database, value, candidateId);
		}
	}
	return {
		project: null,
		corruptionDetected
	};
}
async function deleteProjectWithRecovery(project, deletedAt = (/* @__PURE__ */ new Date()).toISOString()) {
	const normalized = migrateProjectRecord(project);
	const record = {
		id: LAST_DELETED_PROJECT_KEY,
		schema_version: "governdiff-project-deletion/1.0",
		project: normalized,
		deleted_at: deletedAt,
		expires_at: new Date(Date.parse(deletedAt) + RECOVERY_TTL_MS).toISOString()
	};
	try {
		const transaction = (await openProjectDatabase()).transaction([
			"projects",
			"meta",
			"trash"
		], "readwrite");
		const complete = transactionComplete(transaction);
		transaction.objectStore("trash").put(record);
		transaction.objectStore("projects").delete(normalized.id);
		transaction.objectStore("meta").delete(ACTIVE_PROJECT_KEY);
		await complete;
		return record;
	} catch (error) {
		throw storageError(error);
	}
}
async function quarantineDeletionRecord(database, value) {
	const transaction = database.transaction(["trash", "quarantine"], "readwrite");
	const complete = transactionComplete(transaction);
	transaction.objectStore("quarantine").put({
		id: `corrupt-deletion:${Date.now()}`,
		detected_at: (/* @__PURE__ */ new Date()).toISOString(),
		reason_code: "invalid-deletion-record",
		value
	});
	transaction.objectStore("trash").delete(LAST_DELETED_PROJECT_KEY);
	await complete;
}
async function loadDeletionRecord() {
	const database = await openProjectDatabase();
	const transaction = database.transaction("trash", "readonly");
	const complete = transactionComplete(transaction);
	const value = await requestResult(transaction.objectStore("trash").get(LAST_DELETED_PROJECT_KEY));
	await complete;
	if (value === void 0) return null;
	if (!isRecord(value) || value.schema_version !== "governdiff-project-deletion/1.0") {
		await quarantineDeletionRecord(database, value);
		return null;
	}
	if (typeof value.expires_at !== "string" || !Number.isFinite(Date.parse(value.expires_at)) || Date.parse(value.expires_at) <= Date.now()) {
		const clearTransaction = database.transaction("trash", "readwrite");
		const complete = transactionComplete(clearTransaction);
		clearTransaction.objectStore("trash").delete(LAST_DELETED_PROJECT_KEY);
		await complete;
		return null;
	}
	try {
		return {
			id: LAST_DELETED_PROJECT_KEY,
			schema_version: "governdiff-project-deletion/1.0",
			project: migrateProjectRecord(value.project),
			deleted_at: typeof value.deleted_at === "string" ? value.deleted_at : value.expires_at,
			expires_at: value.expires_at
		};
	} catch {
		await quarantineDeletionRecord(database, value);
		return null;
	}
}
async function restoreDeletedProject() {
	const record = await loadDeletionRecord();
	if (!record) return null;
	try {
		const transaction = (await openProjectDatabase()).transaction([
			"projects",
			"meta",
			"trash"
		], "readwrite");
		const complete = transactionComplete(transaction);
		transaction.objectStore("projects").put(record.project);
		transaction.objectStore("meta").put({
			key: ACTIVE_PROJECT_KEY,
			project_id: record.project.id
		});
		transaction.objectStore("trash").delete(LAST_DELETED_PROJECT_KEY);
		await complete;
		return record.project;
	} catch (error) {
		throw storageError(error);
	}
}
function reviewStorageKeys(report) {
	const base = `governdiff-review:${report.old_document.sha256}:${report.new_document.sha256}`;
	return {
		decisions: base,
		fields: `${base}:fields`,
		alignments: `${base}:alignments`
	};
}
function parseLegacy(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function readLegacyStoredReview(report) {
	const keys = reviewStorageKeys(report);
	const found = Object.values(keys).some((key) => localStorage.getItem(key) !== null);
	const decisions = parseLegacy(keys.decisions, {});
	return {
		found,
		decisions: Object.fromEntries(Object.entries(decisions).filter(([, item]) => isRecord(item)).map(([key, item]) => [key, {
			...item,
			state: normalizeState(item.state)
		}])),
		fieldEdits: parseLegacy(keys.fields, {}),
		alignmentOverrides: parseLegacy(keys.alignments, {})
	};
}
function clearLegacyStoredReview(report) {
	const keys = reviewStorageKeys(report);
	Object.values(keys).forEach((key) => localStorage.removeItem(key));
}
//#endregion
//#region app/review-export.ts
function buildReviewExport(report, decisions, fieldEdits, alignmentOverrides, visibleChanges, exportedAt = (/* @__PURE__ */ new Date()).toISOString()) {
	return {
		schema_version: "governdiff-review/1.1",
		report: {
			old_sha256: report.old_document.sha256,
			new_sha256: report.new_document.sha256,
			generated_at: report.generated_at
		},
		exported_at: exportedAt,
		decisions: Object.entries(decisions).map(([change_fingerprint, item]) => ({
			change_fingerprint,
			state: item.state,
			note: item.note,
			updated_at: item.updatedAt
		})),
		field_edits: Object.values(fieldEdits),
		alignment_overrides: Object.values(alignmentOverrides).map((item) => ({
			...item,
			updated_at: item.updatedAt
		})),
		filters: { visible_change_fingerprints: visibleChanges.map((change) => change.fingerprint) }
	};
}
function buildWaiverExport(report, decisions, approver, expiry) {
	const waived = report.changes.filter((change) => decisions[change.fingerprint]?.state === "waived");
	if (!waived.length) throw new Error("Mark at least one change as waived first.");
	if (!approver.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(expiry)) throw new Error("Approver and an expiry date in YYYY-MM-DD format are required for waiver entries.");
	const entries = waived.flatMap((change) => change.findings.map((finding) => ({
		finding,
		decision: decisions[change.fingerprint]
	})));
	const lines = ["schema_version: governdiff-waiver/1.0", "waivers:"];
	entries.forEach(({ finding, decision }) => lines.push(`  - fingerprint: ${JSON.stringify(finding.fingerprint)}`, `    reason: ${JSON.stringify(decision.note || "Reviewer-approved exception")}`, `    approved_by: ${JSON.stringify(approver.trim())}`, `    created_at: ${JSON.stringify(decision.updatedAt)}`, `    expires_at: ${JSON.stringify(expiry)}`));
	return {
		content: `${lines.join("\n")}\n`,
		entryCount: entries.length
	};
}
function downloadText(name, content, type) {
	const link = document.createElement("a");
	link.href = URL.createObjectURL(new Blob([content], { type }));
	link.download = name;
	link.click();
	window.setTimeout(() => URL.revokeObjectURL(link.href), 0);
}
//#endregion
//#region app/reviewer-workspace.tsx
var AUTOSAVE_DELAY_MS = 350;
function ReviewerWorkspace() {
	const [state, dispatch] = (0, import_react.useReducer)(reviewerReducer, initialReviewerState);
	const { report, loadError, notice, filters, savedViews, interfaceLanguage, selectedId, batchIds, decisions, fieldEdits, alignmentOverrides, projectUpdatedAt, projectRevision, savedRevision, exportStatus } = state;
	const [alignmentEditorOpen, setAlignmentEditorOpen] = (0, import_react.useState)(false);
	const [alignmentNotice, setAlignmentNotice] = (0, import_react.useState)("");
	const [approver, setApprover] = (0, import_react.useState)("");
	const [waiverExpiry, setWaiverExpiry] = (0, import_react.useState)("");
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [mobilePane, setMobilePane] = (0, import_react.useState)("queue");
	const [saveStatus, setSaveStatus] = (0, import_react.useState)("restoring");
	const [integrityStatus, setIntegrityStatus] = (0, import_react.useState)("ready");
	const [deletionRecord, setDeletionRecord] = (0, import_react.useState)(null);
	const [confirmation, setConfirmation] = (0, import_react.useState)(null);
	const [undoStack, setUndoStack] = (0, import_react.useState)([]);
	const [sessionMode, setSessionMode] = (0, import_react.useState)(false);
	const stateRef = (0, import_react.useRef)(state);
	const sessionModeRef = (0, import_react.useRef)(false);
	const evidenceFocusRef = (0, import_react.useRef)(null);
	const autosaveTimerRef = (0, import_react.useRef)(null);
	const saveQueueRef = (0, import_react.useRef)(Promise.resolve());
	const legacyMigrationProjectRef = (0, import_react.useRef)(null);
	stateRef.current = state;
	const t = (0, import_react.useMemo)(() => createTranslator(interfaceLanguage), [interfaceLanguage]);
	const mobilePanes = [
		{
			id: "queue",
			label: t("tabs.queue")
		},
		{
			id: "evidence",
			label: t("tabs.evidence")
		},
		{
			id: "decision",
			label: t("tabs.decision")
		}
	];
	(0, import_react.useLayoutEffect)(() => {
		document.documentElement.lang = interfaceLanguage;
	}, [interfaceLanguage]);
	const persistProjectSnapshot = (0, import_react.useCallback)(async (snapshot = stateRef.current, manual = false) => {
		if (!snapshot.report) return false;
		if (autosaveTimerRef.current) {
			clearTimeout(autosaveTimerRef.current);
			autosaveTimerRef.current = null;
		}
		const project = createProject({
			report: snapshot.report,
			decisions: snapshot.decisions,
			fieldEdits: snapshot.fieldEdits,
			alignmentOverrides: snapshot.alignmentOverrides,
			filters: snapshot.filters,
			savedViews: snapshot.savedViews,
			interfaceLanguage: snapshot.interfaceLanguage,
			exportStatus: snapshot.exportStatus,
			revision: snapshot.projectRevision,
			createdAt: snapshot.projectCreatedAt,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		setSaveStatus("saving");
		const operation = saveQueueRef.current.catch(() => void 0).then(async () => {
			if (!sessionModeRef.current) return saveProject(project);
			const review = buildReviewExport(snapshot.report, snapshot.decisions, snapshot.fieldEdits, snapshot.alignmentOverrides, snapshot.report.changes);
			if (!(await fetch("/api/review-session/state", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					review,
					workspace: {
						filters: snapshot.filters,
						saved_views: snapshot.savedViews,
						interface_language: snapshot.interfaceLanguage,
						selected_fingerprint: snapshot.selectedId
					}
				})
			})).ok) throw new Error("The local review session could not be saved.");
			return project;
		});
		saveQueueRef.current = operation.then(() => void 0).catch(() => void 0);
		try {
			const savedProject = await operation;
			dispatch({
				type: "mark-saved",
				revision: savedProject.revision,
				updatedAt: savedProject.updated_at
			});
			if (legacyMigrationProjectRef.current === savedProject.id) {
				clearLegacyStoredReview(savedProject.report);
				legacyMigrationProjectRef.current = null;
			}
			setSaveStatus(stateRef.current.projectRevision > savedProject.revision ? "saving" : "saved");
			if (manual) dispatch({
				type: "set-notice",
				message: createTranslator(stateRef.current.interfaceLanguage)("notice.saved")
			});
			return true;
		} catch (error) {
			setSaveStatus("error");
			dispatch({
				type: "set-load-error",
				message: error instanceof Error ? error.message : "The local project could not be saved."
			});
			return false;
		}
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const initialT = createTranslator("en");
		async function restoreOrLoadSample() {
			setSaveStatus("restoring");
			try {
				const sessionResponse = await fetch("/api/review-session", { cache: "no-store" });
				if (sessionResponse.ok && String(sessionResponse.headers.get("content-type")).includes("application/json")) {
					const candidate = await sessionResponse.json();
					if (candidate.schema_version === "governdiff-review-session/1.0") {
						const sessionReport = parseReport(candidate.report);
						const imported = candidate.review ? parseReviewImport(candidate.review, sessionReport) : {
							decisions: {},
							fieldEdits: {},
							alignmentOverrides: {}
						};
						const workspace = candidate.workspace ?? null;
						const language = workspace?.interface_language ?? (candidate.language === "zh" ? "zh-CN" : "en");
						const project = createProject({
							report: sessionReport,
							decisions: imported.decisions,
							fieldEdits: imported.fieldEdits,
							alignmentOverrides: imported.alignmentOverrides,
							filters: workspace?.filters,
							savedViews: workspace?.saved_views,
							interfaceLanguage: language
						});
						if (cancelled) return;
						sessionModeRef.current = true;
						setSessionMode(true);
						dispatch({
							type: "load-project",
							project,
							persisted: true
						});
						if (workspace?.selected_fingerprint && sessionReport.changes.some((change) => change.fingerprint === workspace.selected_fingerprint)) dispatch({
							type: "select-change",
							fingerprint: workspace.selected_fingerprint
						});
						setSaveStatus("saved");
						setIntegrityStatus("ready");
						return;
					}
				}
				const [loaded, deleted] = await Promise.all([loadActiveProject(), loadDeletionRecord()]);
				if (cancelled) return;
				setDeletionRecord(deleted);
				if (loaded.project) {
					dispatch({
						type: "load-project",
						project: loaded.project,
						persisted: true
					});
					setSaveStatus("saved");
					if (loaded.corruptionDetected) {
						setIntegrityStatus("corrupt");
						dispatch({
							type: "set-notice",
							message: createTranslator(loaded.project.interface_language)("notice.corruptRestored")
						});
					}
					return;
				}
				if (loaded.corruptionDetected) {
					setIntegrityStatus("corrupt");
					setSaveStatus("error");
					dispatch({
						type: "set-load-error",
						message: initialT("error.corrupt")
					});
					return;
				}
				if (deleted) {
					setSaveStatus("saved");
					return;
				}
				const response = await fetch("/sample-report.json");
				if (!response.ok) throw new Error(initialT("error.sample"));
				await activateReport(parseReport(await response.json()));
			} catch (error) {
				if (cancelled) return;
				setSaveStatus("error");
				dispatch({
					type: "set-load-error",
					message: error instanceof Error ? error.message : initialT("error.recovery")
				});
			}
		}
		restoreOrLoadSample();
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!sessionMode) return;
		const heartbeat = () => {
			fetch("/api/review-session/heartbeat", { method: "POST" }).catch(() => void 0);
		};
		heartbeat();
		const timer = window.setInterval(heartbeat, 5e3);
		return () => window.clearInterval(timer);
	}, [sessionMode]);
	(0, import_react.useEffect)(() => {
		if (!report || projectRevision <= savedRevision) return;
		if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
		autosaveTimerRef.current = setTimeout(() => {
			autosaveTimerRef.current = null;
			persistProjectSnapshot();
		}, AUTOSAVE_DELAY_MS);
		return () => {
			if (autosaveTimerRef.current) {
				clearTimeout(autosaveTimerRef.current);
				autosaveTimerRef.current = null;
			}
		};
	}, [
		persistProjectSnapshot,
		projectRevision,
		report,
		savedRevision
	]);
	const changes = (0, import_react.useMemo)(() => buildReviewQueue(report?.changes ?? [], filters, decisions), [
		report,
		filters,
		decisions
	]);
	const progressQueue = (0, import_react.useMemo)(() => buildReviewQueue(report?.changes ?? [], {
		...filters,
		unreviewedOnly: false
	}, decisions), [
		report,
		filters,
		decisions
	]);
	const selected = selectChange(changes, selectedId, report?.changes ?? []);
	const dirty = projectRevision > savedRevision;
	const hasReviewWork = Object.keys(decisions).length > 0 || Object.keys(fieldEdits).length > 0 || Object.keys(alignmentOverrides).length > 0;
	const hasUnexportedWork = hasReviewWork && (dirty || exportStatus.state === "unexported");
	(0, import_react.useEffect)(() => {
		if (!hasUnexportedWork) return;
		const protectNavigation = (event) => {
			event.preventDefault();
			event.returnValue = "";
		};
		window.addEventListener("beforeunload", protectNavigation);
		return () => window.removeEventListener("beforeunload", protectNavigation);
	}, [hasUnexportedWork]);
	const warnings = (0, import_react.useMemo)(() => {
		if (!report) return [];
		const values = [];
		["old", "new"].forEach((side) => {
			const document = side === "old" ? report.old_document : report.new_document;
			(document.preflight?.issues ?? []).forEach((issue) => values.push(`${side.toUpperCase()} ${issue.code}: ${issue.reason} Impact: ${issue.impact} Next: ${issue.next_step}`));
			if (document.preflight?.suspected_scanned && !(document.preflight.issues ?? []).some((issue) => issue.code.includes("SCAN"))) values.push(t("warning.scan", { side: side.toUpperCase() }));
		});
		const low = report.changes.filter((change) => change.change_type !== "unchanged" && change.confidence_level === "low").length;
		const conflicts = report.article_mappings.filter((mapping) => (mapping.status ?? "unique") !== "unique").length;
		if (low) values.push(t("warning.low", { count: low }));
		if (conflicts) values.push(t("warning.conflicts", { count: conflicts }));
		return values;
	}, [report, t]);
	(0, import_react.useEffect)(() => {
		const handler = (event) => {
			if (event.target?.matches("input, textarea, select")) return;
			const index = changes.findIndex((item) => item.fingerprint === selected?.fingerprint);
			if (event.key.toLowerCase() === "j" && changes[index + 1]) dispatch({
				type: "select-change",
				fingerprint: changes[index + 1].fingerprint
			});
			if (event.key.toLowerCase() === "k" && changes[index - 1]) dispatch({
				type: "select-change",
				fingerprint: changes[index - 1].fingerprint
			});
			const nextState = {
				"0": "unreviewed",
				"1": "confirmed",
				"2": "rejected",
				"3": "modified",
				"4": "waived"
			}[event.key];
			if (nextState && selected) setDecision(selected.fingerprint, nextState);
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	});
	async function activateReport(data) {
		const storedProject = await loadProjectForReport(data);
		if (storedProject) {
			dispatch({
				type: "load-project",
				project: storedProject,
				persisted: true
			});
			setSaveStatus("saved");
		} else {
			const legacy = readLegacyStoredReview(data);
			const project = createProject({
				report: data,
				decisions: legacy.decisions,
				fieldEdits: legacy.fieldEdits,
				alignmentOverrides: legacy.alignmentOverrides
			});
			if (legacy.found) legacyMigrationProjectRef.current = project.id;
			dispatch({
				type: "load-project",
				project,
				persisted: false
			});
			setSaveStatus("saving");
		}
		setIntegrityStatus("ready");
		setUndoStack([]);
		setMobilePane("queue");
	}
	function currentReviewSnapshot() {
		const current = stateRef.current;
		return {
			decisions: current.decisions,
			fieldEdits: current.fieldEdits,
			alignmentOverrides: current.alignmentOverrides,
			filters: current.filters,
			savedViews: current.savedViews
		};
	}
	function pushUndo(key, label) {
		const entry = {
			key,
			label,
			snapshot: currentReviewSnapshot()
		};
		setUndoStack((current) => {
			if (current.at(-1)?.key === key) return current;
			return [...current, entry].slice(-10);
		});
	}
	function undoLastChange() {
		const entry = undoStack.at(-1);
		if (!entry) return;
		dispatch({
			type: "restore-review-data",
			snapshot: entry.snapshot
		});
		dispatch({
			type: "set-notice",
			message: t("notice.undo", { label: entry.label })
		});
		setUndoStack((current) => current.slice(0, -1));
	}
	function setDecision(fingerprint, reviewState, note, undoKey = `decision:${fingerprint}`, undoLabel = "review decision", recordUndo = true) {
		if (recordUndo) pushUndo(undoKey, undoLabel);
		dispatch({
			type: "set-decision",
			fingerprint,
			decision: {
				state: reviewState,
				note: note ?? decisions[fingerprint]?.note ?? "",
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			}
		});
	}
	function applyBatchDecision(reviewState) {
		const visible = new Set(changes.map((change) => change.fingerprint));
		const scopedIds = batchIds.filter((fingerprint) => visible.has(fingerprint));
		if (!scopedIds.length) {
			dispatch({
				type: "set-notice",
				message: t("notice.selectBatch")
			});
			return;
		}
		pushUndo(`batch:${Date.now()}`, `batch ${reviewState}`);
		const updatedAt = (/* @__PURE__ */ new Date()).toISOString();
		const nextDecisions = {
			...decisions,
			...Object.fromEntries(scopedIds.map((fingerprint) => {
				const hasFieldEdit = Object.values(fieldEdits).some((edit) => edit.change_fingerprint === fingerprint);
				return [fingerprint, {
					state: reviewState === "confirmed" && hasFieldEdit ? "modified" : reviewState,
					note: decisions[fingerprint]?.note ?? "",
					updatedAt
				}];
			}))
		};
		dispatch({
			type: "set-decisions",
			decisions: nextDecisions
		});
		dispatch({
			type: "set-notice",
			message: t("notice.batch", {
				count: scopedIds.length,
				state: reviewState
			})
		});
	}
	function setBatchDecision(reviewState) {
		if (!batchIds.length) {
			dispatch({
				type: "set-notice",
				message: t("notice.selectBatch")
			});
			return;
		}
		setConfirmation({
			title: t("dialog.batchTitle", { action: reviewState === "confirmed" ? t("decision.confirmed") : t("decision.rejected") }),
			detail: t("dialog.batchDetail", { count: batchIds.length }),
			confirmLabel: reviewState === "confirmed" ? t("queue.confirmSelected") : t("queue.rejectSelected"),
			onConfirm: () => applyBatchDecision(reviewState)
		});
	}
	function updateField(change, finding, side, value) {
		pushUndo(`field:${finding.fingerprint}`, `${finding.field} field edit`);
		const existing = fieldEdits[finding.fingerprint];
		dispatch({
			type: "set-field-edit",
			fingerprint: finding.fingerprint,
			edit: {
				change_fingerprint: change.fingerprint,
				finding_fingerprint: finding.fingerprint,
				field: finding.field,
				machine_old_value: finding.old_value,
				machine_new_value: finding.new_value,
				reviewed_old_value: side === "old" ? value || null : existing?.reviewed_old_value ?? finding.old_value,
				reviewed_new_value: side === "new" ? value || null : existing?.reviewed_new_value ?? finding.new_value,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}
		});
		setDecision(change.fingerprint, "modified", void 0, `field:${finding.fingerprint}`, `${finding.field} field edit`, false);
		dispatch({
			type: "set-notice",
			message: t("notice.fieldEdit", { field: finding.field })
		});
	}
	async function readReportFile(file) {
		if (!file) return;
		try {
			const data = parseReport(await readJsonFile(file));
			if (report && reportIdentityMatches(report, data)) {
				dispatch({
					type: "set-notice",
					message: t("notice.sameReport")
				});
				return;
			}
			if (report) setConfirmation({
				title: t("dialog.openTitle"),
				detail: hasReviewWork && exportStatus.state === "unexported" ? t("dialog.openUnexported") : t("dialog.openSaved"),
				confirmLabel: t("dialog.openConfirm"),
				onConfirm: async () => {
					if (await persistProjectSnapshot(stateRef.current)) await activateReport(data);
				}
			});
			else await activateReport(data);
		} catch (error) {
			if (error instanceof ProjectCorruptionError) setIntegrityStatus("corrupt");
			dispatch({
				type: "set-load-error",
				message: error instanceof Error ? error.message : t("error.invalidReport")
			});
		}
	}
	async function importReviewFile(file) {
		if (!file || !report) return;
		try {
			const review = parseReviewImport(await readJsonFile(file), report);
			setIntegrityStatus("ready");
			const applyImport = () => {
				pushUndo(`import:${Date.now()}`, "review import");
				dispatch({
					type: "import-review",
					review
				});
				dispatch({
					type: "set-notice",
					message: t("notice.imported")
				});
			};
			if (hasReviewWork) setConfirmation({
				title: t("dialog.importTitle"),
				detail: exportStatus.state === "unexported" ? t("dialog.importUnexported") : t("dialog.importSaved"),
				confirmLabel: t("dialog.importConfirm"),
				onConfirm: applyImport
			});
			else applyImport();
		} catch (error) {
			if (error instanceof ReviewIdentityMismatchError) setIntegrityStatus("identity-mismatch");
			dispatch({
				type: "set-load-error",
				message: error instanceof Error ? error.message : t("error.invalidReview")
			});
		}
	}
	function saveState() {
		if (!report) return;
		persistProjectSnapshot(stateRef.current, true);
	}
	async function exportReview() {
		if (!report) return;
		const exportedAt = (/* @__PURE__ */ new Date()).toISOString();
		const payload = buildReviewExport(report, decisions, fieldEdits, alignmentOverrides, changes, exportedAt);
		if (sessionModeRef.current) try {
			if (!(await fetch("/api/review-session/export", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(payload)
			})).ok) throw new Error("The local review session did not accept the export.");
		} catch (error) {
			dispatch({
				type: "set-load-error",
				message: error instanceof Error ? error.message : "Review export failed."
			});
			return;
		}
		else downloadText("governdiff-review.json", JSON.stringify(payload, null, 2), "application/json");
		dispatch({
			type: "mark-exported",
			exportedAt
		});
		dispatch({
			type: "set-notice",
			message: t("notice.exported")
		});
	}
	function exportWaivers() {
		if (!report) return;
		try {
			const waiver = buildWaiverExport(report, decisions, approver, waiverExpiry);
			downloadText(".governdiff-waivers.yml", waiver.content, "application/yaml");
			dispatch({
				type: "set-notice",
				message: t("notice.waiver", { count: waiver.entryCount })
			});
		} catch (error) {
			dispatch({
				type: "set-notice",
				message: error instanceof Error ? error.message : "Unable to generate waivers."
			});
		}
	}
	async function deleteCurrentProject() {
		const current = stateRef.current;
		if (!current.report) return;
		if (autosaveTimerRef.current) {
			clearTimeout(autosaveTimerRef.current);
			autosaveTimerRef.current = null;
		}
		await saveQueueRef.current.catch(() => void 0);
		const project = createProject({
			report: current.report,
			decisions: current.decisions,
			fieldEdits: current.fieldEdits,
			alignmentOverrides: current.alignmentOverrides,
			filters: current.filters,
			savedViews: current.savedViews,
			interfaceLanguage: current.interfaceLanguage,
			exportStatus: current.exportStatus,
			revision: current.projectRevision,
			createdAt: current.projectCreatedAt,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		try {
			const deleted = await deleteProjectWithRecovery(project);
			setDeletionRecord(deleted);
			dispatch({ type: "clear-project" });
			dispatch({
				type: "set-notice",
				message: t("notice.deleted")
			});
			setSaveStatus("saved");
			setIntegrityStatus("ready");
			setUndoStack([]);
			setMobilePane("queue");
		} catch (error) {
			setSaveStatus("error");
			dispatch({
				type: "set-load-error",
				message: error instanceof Error ? error.message : "The local project was not deleted."
			});
		}
	}
	function clearLocalProject() {
		if (!report) return;
		setConfirmation({
			title: t("dialog.deleteTitle"),
			detail: t("dialog.deleteDetail"),
			confirmLabel: t("dialog.deleteConfirm"),
			destructive: true,
			onConfirm: deleteCurrentProject
		});
	}
	async function restoreRecoveryRecord() {
		if (report) {
			if (!await persistProjectSnapshot(stateRef.current)) return;
		}
		try {
			const restored = await restoreDeletedProject();
			if (!restored) {
				setDeletionRecord(null);
				dispatch({
					type: "set-notice",
					message: t("notice.noRecovery")
				});
				return;
			}
			dispatch({
				type: "load-project",
				project: restored,
				persisted: true
			});
			setDeletionRecord(null);
			setSaveStatus("saved");
			setIntegrityStatus("ready");
			setUndoStack([]);
			setMobilePane("queue");
			dispatch({
				type: "set-notice",
				message: t("notice.restored")
			});
		} catch (error) {
			setSaveStatus("error");
			dispatch({
				type: "set-load-error",
				message: error instanceof Error ? error.message : "The deleted project was not restored."
			});
		}
	}
	function requestRecovery() {
		if (report) setConfirmation({
			title: t("dialog.restoreTitle"),
			detail: t("dialog.restoreDetail"),
			confirmLabel: t("dialog.restoreConfirm"),
			onConfirm: restoreRecoveryRecord
		});
		else restoreRecoveryRecord();
	}
	function onDrop(event) {
		event.preventDefault();
		setIsDragging(false);
		readReportFile(event.dataTransfer.files?.[0]);
	}
	const oldBlocks = (0, import_react.useMemo)(() => report ? uniqueBlocks([...report.old_document.blocks ?? [], ...report.changes.flatMap((change) => change.old_blocks ?? [change.old_block])]) : [], [report]);
	const newBlocks = (0, import_react.useMemo)(() => report ? uniqueBlocks([...report.new_document.blocks ?? [], ...report.changes.flatMap((change) => change.new_blocks ?? [change.new_block])]) : [], [report]);
	function beginAlignmentEdit() {
		setAlignmentEditorOpen(true);
		setAlignmentNotice("");
	}
	function saveAlignment(change, oldBlockIds, newBlockIds) {
		if (!oldBlockIds.length || !newBlockIds.length) {
			setAlignmentNotice(t("alignment.choose"));
			return;
		}
		setConfirmation({
			title: t("alignment.confirmTitle"),
			detail: t("alignment.confirmDetail", {
				oldCount: oldBlockIds.length,
				newCount: newBlockIds.length
			}),
			confirmLabel: t("alignment.apply"),
			onConfirm: () => {
				pushUndo(`alignment:${Date.now()}`, "manual relink");
				dispatch({
					type: "set-alignment",
					fingerprint: change.fingerprint,
					alignment: {
						action: "relink",
						original_change_fingerprint: change.fingerprint,
						old_block_ids: oldBlockIds,
						new_block_ids: newBlockIds,
						updatedAt: (/* @__PURE__ */ new Date()).toISOString()
					}
				});
				setAlignmentEditorOpen(false);
				setAlignmentNotice(t("alignment.saved"));
			}
		});
	}
	function unlinkAlignment(change) {
		setConfirmation({
			title: t("alignment.unlinkTitle"),
			detail: t("alignment.unlinkDetail"),
			confirmLabel: t("alignment.unlink"),
			destructive: true,
			onConfirm: () => {
				pushUndo(`alignment:${Date.now()}`, "alignment unlink");
				dispatch({
					type: "set-alignment",
					fingerprint: change.fingerprint,
					alignment: {
						action: "unlink",
						original_change_fingerprint: change.fingerprint,
						old_block_ids: (change.old_blocks ?? [change.old_block]).filter(Boolean).map((block) => block.block_id),
						new_block_ids: (change.new_blocks ?? [change.new_block]).filter(Boolean).map((block) => block.block_id),
						updatedAt: (/* @__PURE__ */ new Date()).toISOString()
					}
				});
				setAlignmentEditorOpen(false);
				setAlignmentNotice(t("alignment.unlinked"));
			}
		});
	}
	function updateFilter(name, value) {
		dispatch({
			type: "set-filter",
			name,
			value
		});
	}
	function saveView(name) {
		const trimmed = name.trim();
		if (!trimmed || trimmed.length > 40) {
			dispatch({
				type: "set-notice",
				message: t("view.invalid")
			});
			return false;
		}
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const duplicate = savedViews.find((view) => view.name.toLocaleLowerCase() === trimmed.toLocaleLowerCase());
		const next = duplicate ? savedViews.map((view) => view.id === duplicate.id ? {
			...view,
			name: trimmed,
			filters: { ...filters },
			updated_at: now
		} : view) : [...savedViews, {
			id: `view-${Date.now().toString(36)}`,
			name: trimmed,
			filters: { ...filters },
			created_at: now,
			updated_at: now
		}];
		dispatch({
			type: "set-saved-views",
			savedViews: next
		});
		dispatch({
			type: "set-notice",
			message: t("view.saved", { name: trimmed })
		});
		return true;
	}
	function applyView(id) {
		const view = savedViews.find((item) => item.id === id);
		if (!view) return;
		dispatch({
			type: "apply-filters",
			filters: { ...view.filters }
		});
		dispatch({
			type: "set-notice",
			message: t("view.applied", { name: view.name })
		});
	}
	function deleteView(id) {
		const view = savedViews.find((item) => item.id === id);
		if (!view) return;
		setConfirmation({
			title: interfaceLanguage === "zh-CN" ? `删除保存视图“${view.name}”？` : `Delete saved view “${view.name}”?`,
			detail: interfaceLanguage === "zh-CN" ? "只会删除本地保存的筛选与排序，不会删除任何审阅决定。" : "Only the locally saved filters and sort will be deleted; review decisions are not affected.",
			confirmLabel: interfaceLanguage === "zh-CN" ? "删除视图" : "Delete view",
			destructive: true,
			onConfirm: () => {
				dispatch({
					type: "set-saved-views",
					savedViews: savedViews.filter((item) => item.id !== id)
				});
				dispatch({
					type: "set-notice",
					message: t("view.deleted", { name: view.name })
				});
			}
		});
	}
	function decideAndNext(reviewState) {
		if (!selected) return;
		const nextFingerprint = nextQueueFingerprint(changes, selected.fingerprint);
		setDecision(selected.fingerprint, reviewState);
		if (nextFingerprint) {
			dispatch({
				type: "select-change",
				fingerprint: nextFingerprint
			});
			setMobilePane("evidence");
			window.requestAnimationFrame(() => evidenceFocusRef.current?.focus());
		} else setMobilePane("queue");
	}
	function selectFromQueue(fingerprint) {
		dispatch({
			type: "select-change",
			fingerprint
		});
		setMobilePane("evidence");
	}
	const reviewedCount = (0, import_react.useMemo)(() => report ? report.changes.filter((change) => normalizeState(decisions[change.fingerprint]?.state ?? change.review?.state) !== "unreviewed").length : 0, [decisions, report]);
	const lowConfidenceCount = (0, import_react.useMemo)(() => report ? report.changes.filter((change) => change.change_type !== "unchanged" && change.confidence_level === "low").length : 0, [report]);
	const mappingConflicts = (0, import_react.useMemo)(() => report ? report.article_mappings.filter((mapping) => (mapping.status ?? "unique") !== "unique").length : 0, [report]);
	const selectedReviewState = selected ? normalizeState(decisions[selected.fingerprint]?.state ?? selected.review?.state) : "unreviewed";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, {
		language: interfaceLanguage,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "app-shell",
			id: "review-main",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "skip-link",
					href: "#change-review",
					children: t("app.skip")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandBar, {
					report,
					sessionMode,
					onOpenReport: (file) => void readReportFile(file),
					onSaveState: saveState,
					onImportReview: (file) => void importReviewFile(file),
					onExportReview: exportReview,
					onClearProject: clearLocalProject,
					onLanguageChange: (language) => dispatch({
						type: "set-interface-language",
						language
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectStatus, {
					saveStatus,
					dirty,
					exportStatus,
					integrityStatus,
					updatedAt: projectUpdatedAt,
					hasRecovery: Boolean(deletionRecord),
					undoLabel: undoStack.at(-1)?.label,
					onRestore: requestRecovery,
					onUndo: undoLastChange
				}),
				confirmation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmationDialog, {
					title: confirmation.title,
					detail: confirmation.detail,
					confirmLabel: confirmation.confirmLabel,
					destructive: confirmation.destructive,
					onCancel: () => setConfirmation(null),
					onConfirm: () => {
						const action = confirmation.onConfirm;
						setConfirmation(null);
						action();
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sr-only",
					"aria-live": "polite",
					children: notice
				}),
				notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "notice-banner",
					role: "status",
					children: notice
				}),
				loadError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "error-banner",
					role: "alert",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("warning.title") }),
						" ",
						loadError
					]
				}),
				!report ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `drop-zone ${isDragging ? "dragging" : ""}`,
					onDragOver: (event) => {
						event.preventDefault();
						setIsDragging(true);
					},
					onDragLeave: () => setIsDragging(false),
					onDrop,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "drop-icon",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewerIcon, { name: "upload" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: t("open.title") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("open.detail") })
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewSummary, {
						report,
						warnings,
						reviewedCount,
						lowConfidenceCount,
						mappingConflicts,
						queueTotal: progressQueue.length,
						queueReviewed: progressQueue.filter((change) => normalizeState(decisions[change.fingerprint]?.state ?? change.review?.state) !== "unreviewed").length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mobile-workspace-tabs",
						role: "tablist",
						"aria-label": t("tabs.aria"),
						children: mobilePanes.map((pane) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							id: `mobile-tab-${pane.id}`,
							role: "tab",
							"aria-selected": mobilePane === pane.id,
							"aria-controls": `mobile-panel-${pane.id}`,
							"aria-label": pane.label,
							onClick: () => setMobilePane(pane.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pane.label }), pane.id !== "queue" && selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
								className: "mobile-tab-progress",
								"aria-hidden": "true",
								children: [
									Math.max(1, changes.findIndex((change) => change.fingerprint === selected.fingerprint) + 1),
									"/",
									Math.max(1, changes.length)
								]
							})]
						}, pane.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "review-workspace",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewQueue, {
								report,
								changes,
								filters,
								selectedId: selected?.fingerprint ?? selectedId,
								batchIds,
								decisions,
								savedViews,
								mobileActive: mobilePane === "queue",
								onFilterChange: updateFilter,
								onResetFilters: () => dispatch({ type: "reset-filters" }),
								onApplyFilters: (nextFilters) => dispatch({
									type: "apply-filters",
									filters: nextFilters
								}),
								onSaveView: saveView,
								onApplyView: applyView,
								onDeleteView: deleteView,
								onSelect: selectFromQueue,
								onToggleBatch: (fingerprint, checked) => dispatch({
									type: "toggle-batch",
									fingerprint,
									selected: checked
								}),
								onBatchDecision: setBatchDecision,
								onSelectVisible: () => dispatch({
									type: "set-batch",
									fingerprints: changes.map((change) => change.fingerprint)
								}),
								onClearSelection: () => dispatch({
									type: "set-batch",
									fingerprints: []
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "workspace-pane evidence-pane",
								id: "mobile-panel-evidence",
								role: "tabpanel",
								"aria-labelledby": "mobile-tab-evidence",
								"data-mobile-active": mobilePane === "evidence",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pane-heading evidence-pane-heading",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("evidence.title") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selected ? selected.section : t("evidence.none") })] }), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: confidenceClass(selected.confidence_level),
										children: [
											t(`confidence.${selected.confidence_level}`),
											" ",
											formatScore(selected.confidence_score)
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "evidence-scroll",
									id: "change-review",
									tabIndex: -1,
									ref: evidenceFocusRef,
									children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
											className: "review-heading",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "eyebrow",
													children: [
														selected.change_type,
														" · ",
														selected.fingerprint
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContent, {
													text: selected.findings[0]?.summary ?? selected.section,
													threshold: 180,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: selected.findings[0]?.summary ?? selected.section })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selected.section })
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "score-seal",
												"aria-label": `${t("evidence.confidence")} ${formatScore(selected.confidence_score)}`,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("evidence.confidence") }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatScore(selected.confidence_score) }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t(`confidence.${selected.confidence_level}`) })
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceComparison, { change: selected }),
										selected.article_mapping && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
											className: `mapping-candidates mapping-${selected.article_mapping.status ?? "unique"}`,
											"aria-label": t("evidence.mappingCandidates"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("evidence.mapping") }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: selected.article_mapping.status ?? "unique" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t("evidence.margin", { score: formatScore(selected.article_mapping.competition_margin ?? 1) }) })
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: (selected.article_mapping.candidates ?? []).map((candidate) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: candidate.new_article }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatScore(candidate.competition_score) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t("evidence.rank", {
													rank: candidate.rank,
													count: candidate.evidence_count
												}) })
											] }, candidate.new_key)) })]
										}),
										!!selected.temporal_changes?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
											className: "temporal-strip",
											"aria-label": t("evidence.temporal"),
											children: selected.temporal_changes.map((temporal, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: temporal.kind.replace("_", " ") }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
													temporal.old_normalized ?? "∅",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewerIcon, { name: "arrow" }),
													" ",
													temporal.new_normalized ?? "∅"
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: temporal.direction })
											] }, `${temporal.kind}-${index}`))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
											className: "alignment-editor",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "alignment-heading",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("alignment.title") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: alignmentOverrides[selected.fingerprint]?.action ?? selected.alignment_status ?? "automatic" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "button button-secondary",
														onClick: beginAlignmentEdit,
														children: t("alignment.edit")
													}), selected.old_block && selected.new_block && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "button button-danger",
														onClick: () => unlinkAlignment(selected),
														children: t("alignment.unlink")
													})] })]
												}),
												alignmentEditorOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlignmentRepair, {
													change: selected,
													oldBlocks,
													newBlocks,
													initialOldIds: alignmentOverrides[selected.fingerprint]?.old_block_ids ?? (selected.old_blocks ?? [selected.old_block]).filter(Boolean).map((block) => block.block_id),
													initialNewIds: alignmentOverrides[selected.fingerprint]?.new_block_ids ?? (selected.new_blocks ?? [selected.new_block]).filter(Boolean).map((block) => block.block_id),
													onApply: (oldIds, newIds) => saveAlignment(selected, oldIds, newIds),
													onCancel: () => setAlignmentEditorOpen(false)
												}),
												alignmentNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "alignment-notice",
													role: "status",
													children: alignmentNotice
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
											className: "findings-panel",
											"aria-label": t("evidence.findings"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "section-title",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("evidence.findings") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: selected.findings.length })]
											}), selected.findings.map((finding) => {
												const edit = fieldEdits[finding.fingerprint];
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
													className: "finding",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "finding-header",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: [
																finding.check_id,
																" · ",
																finding.field
															] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: confidenceClass(finding.confidence_level),
																children: [
																	t(`confidence.${finding.confidence_level}`),
																	" ",
																	formatScore(finding.confidence_score)
																]
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContent, {
															text: finding.summary,
															threshold: 180,
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: finding.summary })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContent, {
															text: finding.explanation,
															threshold: 240
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "field-editor",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: t("evidence.machineValues") }),
																	" ",
																	finding.old_value ?? "∅",
																	" ",
																	"→ ",
																	finding.new_value ?? "∅"
																] }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [t("evidence.reviewedOld"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																	value: edit?.reviewed_old_value ?? finding.old_value ?? "",
																	onChange: (event) => updateField(selected, finding, "old", event.target.value)
																})] }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [t("evidence.reviewedNew"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																	value: edit?.reviewed_new_value ?? finding.new_value ?? "",
																	onChange: (event) => updateField(selected, finding, "new", event.target.value)
																})] }),
																edit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "modified-label",
																	children: t("evidence.modified")
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContent, {
															text: finding.confidence_reasons.join(" "),
															threshold: 220,
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: finding.confidence_reasons.map((reason) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: reason }, reason)) })
														})
													]
												}, finding.fingerprint);
											})]
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "empty-state large",
										children: t("evidence.select")
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
								className: "workspace-pane decision-pane",
								id: "mobile-panel-decision",
								role: "tabpanel",
								"aria-labelledby": "mobile-tab-decision",
								"data-mobile-active": mobilePane === "decision",
								children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecisionPanel, {
									state: selectedReviewState,
									note: decisions[selected.fingerprint]?.note ?? selected.review?.note ?? "",
									approver,
									waiverExpiry,
									onDecision: (nextState) => setDecision(selected.fingerprint, nextState, void 0, `decision:${selected.fingerprint}`, "review decision"),
									onNote: (note) => setDecision(selected.fingerprint, selectedReviewState, note, `note:${selected.fingerprint}`, "review note"),
									onApprover: setApprover,
									onWaiverExpiry: setWaiverExpiry,
									onGenerateWaiver: exportWaivers,
									onDecisionAndNext: decideAndNext
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "empty-state",
									children: t("decision.select")
								})
							})
						]
					})
				] })
			]
		})
	});
}
//#endregion
//#region node_modules/vinext/dist/shims/error-boundary.js
/**
* Generic ErrorBoundary used to wrap route segments with error.tsx.
* This must be a client component since error boundaries use
* componentDidCatch / getDerivedStateFromError.
*/
var ErrorBoundaryInner = class extends import_react.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			previousPathname: props.pathname
		};
	}
	static getDerivedStateFromProps(props, state) {
		if (props.pathname !== state.previousPathname && state.error) return {
			error: null,
			previousPathname: props.pathname
		};
		return {
			error: state.error,
			previousPathname: props.pathname
		};
	}
	static getDerivedStateFromError(error) {
		if (error && typeof error === "object" && "digest" in error) {
			const digest = String(error.digest);
			if (digest === "NEXT_NOT_FOUND" || digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;") || digest.startsWith("NEXT_REDIRECT;")) throw error;
		}
		return { error };
	}
	reset = () => {
		this.setState({ error: null });
	};
	render() {
		if (this.state.error) {
			const FallbackComponent = this.props.fallback;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackComponent, {
				error: this.state.error,
				reset: this.reset
			});
		}
		return this.props.children;
	}
};
function ErrorBoundary({ fallback, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundaryInner, {
		pathname: usePathname(),
		fallback,
		children
	});
}
/**
* Inner class component that catches notFound() errors and renders the
* not-found.tsx fallback. Resets when the pathname changes (client navigation)
* so a previous notFound() doesn't permanently stick.
*
* The ErrorBoundary above re-throws notFound errors so they propagate up to this
* boundary. This must be placed above the ErrorBoundary in the component tree.
*/
var NotFoundBoundaryInner = class extends import_react.Component {
	constructor(props) {
		super(props);
		this.state = {
			notFound: false,
			previousPathname: props.pathname
		};
	}
	static getDerivedStateFromProps(props, state) {
		if (props.pathname !== state.previousPathname && state.notFound) return {
			notFound: false,
			previousPathname: props.pathname
		};
		return {
			notFound: state.notFound,
			previousPathname: props.pathname
		};
	}
	static getDerivedStateFromError(error) {
		if (error && typeof error === "object" && "digest" in error) {
			const digest = String(error.digest);
			if (digest === "NEXT_NOT_FOUND" || digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;404")) return { notFound: true };
		}
		throw error;
	}
	render() {
		if (this.state.notFound) return this.props.fallback;
		return this.props.children;
	}
};
/**
* Wrapper that reads the current pathname and passes it to the inner class
* component. This enables automatic reset on client-side navigation.
*/
function NotFoundBoundary({ fallback, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFoundBoundaryInner, {
		pathname: usePathname(),
		fallback,
		children
	});
}
//#endregion
//#region node_modules/vinext/dist/shims/layout-segment-context.js
/**
* Layout segment context provider.
*
* Must be "use client" so that Vite's RSC bundler renders this component in
* the SSR/browser environment where React.createContext is available. The RSC
* entry imports and renders LayoutSegmentProvider directly, but because of the
* "use client" boundary the actual execution happens on the SSR/client side
* where the context can be created and consumed by useSelectedLayoutSegment(s).
*
* Without "use client", this runs in the RSC environment where
* React.createContext is undefined, getLayoutSegmentContext() returns null,
* the provider becomes a no-op, and useSelectedLayoutSegments always returns [].
*
* The context is shared with navigation.ts via getLayoutSegmentContext()
* to avoid creating separate contexts in different modules.
*/
/**
* Wraps children with the layout segment context.
*
* Each layout in the App Router tree wraps its children with this provider,
* passing a map of parallel route key to segment path. The "children" key is
* always present (the default parallel route). Named parallel slots at this
* layout level add their own keys.
*
* Components inside the provider call useSelectedLayoutSegments(parallelRoutesKey)
* to read the segments for a specific parallel route.
*/
function LayoutSegmentProvider({ segmentMap, children }) {
	const ctx = getLayoutSegmentContext();
	if (!ctx) return children;
	return (0, import_react.createElement)(ctx.Provider, { value: segmentMap }, children);
}
//#endregion
//#region \0virtual:vite-rsc/client-references/group/facade:\0virtual:cloudflare/worker-entry
var export_cc78faf55494 = { default: ReviewerWorkspace };
var export_593f344dc510 = {
	ErrorBoundary,
	NotFoundBoundary
};
var export_15c18cfaeeff = { LayoutSegmentProvider };
var export_8c0f216c4604 = {
	Children,
	ParallelSlot,
	Slot
};
//#endregion
export { export_15c18cfaeeff, export_593f344dc510, export_8c0f216c4604, export_cc78faf55494 };
