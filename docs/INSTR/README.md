# INSTR/README

此目錄存放「操作指引」檔（INSTR）。用途：給 ChatGPT / 實作 Agent（目前為 Codex）快速對齊單一任務的具體步驟。

## 命名規則
- 檔名格式：`INSTR-T-xxxx-<slug>.md`
  - `xxxx` 為 T 任務編號；若為跨任務通用規則，可暫用 `0000` 作為編號。
  - `<slug>` 為簡短描述（kebab-case）。

## 使用方式
1. ChatGPT 回應時，給使用者一段可直接貼給 Agent 的 code block，並指到對應的 INSTR 檔。
2. Agent 執行：
   - 打開該 INSTR 檔，照步驟修改指定檔案範圍。
   - 依 workflow：更新 `PROJECT_TODO` / `PROJECT_STATUS`（如 INSTR 要求）、更新 `Windsurf_ChatGPT_NOTES.md`、`git add/commit/push`。
3. 若新增 INSTR：
   - 依 Template 建檔（`INSTR-TEMPLATE.md`）。
   - 放在本目錄，以命名規則保存。
   - 在 notes 加上 RAW 連結。

## 現有 INSTR 一覽（常更新）
- `INSTR-T-0000-update-workflow-full-access-rules.md`
- `INSTR-T-0000-fix-communication-rules-no-citations.md`
- `INSTR-T-0016-zh-cn-health-check-tool-todo.md`
- `INSTR-T-0017-html-to-markdown-rules-cleanup.md`
- `INSTR-T-0018-meta-instr-and-status-structure.md`
- `INSTR-T-0083-zhTW-to-zhCN-pipeline-docs-unify-and-qa-reports.md`
