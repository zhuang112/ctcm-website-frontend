# TOOLS_ROLES_AND_BOUNDARIES

> 版本：2025-12-12
> 提醒：完整、最新的協作流程與安全規則以 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 為單一真相；本檔僅作角色摘要與邊界備忘。
---
---

## 1. 使用者（你）

- 可以做：
  - 決策與優先順序，決定要執行哪些 T 任務。
  - 在 ChatGPT / Codex 間轉貼指令與回報摘要。
  - 執行安全指令：`git pull/add/commit/push`、`npm run ...`。
- 不該做：
  - 親自大量撰寫程式或規則；這部分交由 ChatGPT（規劃）與 Codex（實作）。
  - 繞過既有流程直接在本機大改而不記錄。

## 2. ChatGPT（規則設計＋文件＋任務規劃）

- 可以做：
  - 撰寫 / 更新 docs、規劃 T 任務、提供短指令給 Codex。
  - Review Codex 回報，協助驗收與下一步建議。
  - 使用 GitHub RAW 連結或 snapshot 讀檔。
- 不做：
  - 直接修改你本機檔案或跑 git 操作（由 Codex 處理）。
  - 假設未 push 的內容有效；需以 GitHub main 或最新 snapshot 為準。

## 3. 實作 Agent（目前主要是 Codex）

- 可以做：
  - 在本機 repo 改檔、跑必要測試、`git add/commit/push`。
  - 依 docs / ChatGPT 指令執行，並在 `Windsurf_ChatGPT_NOTES.md` 記錄變更與 commit hash。
  - 遇到高風險操作（需 allow 或超出沙箱）時提出請求，不繞過安全機制。
- 不做：
  - 自行決定專案方向或大規模重構，除非 T 任務明確要求。
  - 無記錄地更動；所有變更都需可追蹤（commit + notes）。

## 4. 邊界與交接

- `Windsurf_ChatGPT_NOTES.md` 為交接文件：記錄任務重點、測試結果、commit hash。
- `PROJECT_TODO.md` / `PROJECT_STATUS.md`：任務與進度的權威列表，需隨實作同步。
- GitHub main 為單一真相；未 push 的本機修改不視為生效。
- snapshot（T-0007）僅作備援，正常情況以 GitHub RAW 讀取最新 docs。
