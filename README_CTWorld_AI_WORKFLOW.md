# CTWorld AI 協作工作流（ChatGPT × GitHub × Windsurf）

這個資料夾是專門給「ctworld.org 轉型 headless / 匯入 WordPress」專案使用的 AI 協作工作流文件。

目標：
- 儘量讓 ChatGPT、你、Windsurf 分工清楚。
- 減少你手動解釋同一件事的次數。
- 讓大部分重複型的 coding / refactor 工作交給 Windsurf。
- 讓架構、規則、流程都集中在 `docs/*.md`，成為單一真相來源。

建議使用方式（第一次）：
1. 把整個 ZIP 解壓到你要用的 repo 根目錄。
2. 檢查 `docs/` 底下的文件，先快速看一遍：
   - `WORKFLOW_CHATGPT_GITHUB_WINDSURF.md`
   - `TOOLS_ROLES_AND_BOUNDARIES.md`
   - `PROJECT_TODO_TEMPLATE.md`
3. 視需要調整內容（專案名稱、資料夾結構等），再 `git add` ＋ `commit`。

之後每次要開新任務，只要遵守這幾個原則：
- 所有規則 → 寫進 `docs/*.md`（由 ChatGPT 協助）。
- 所有技術任務 → 寫進 `PROJECT_TODO.md`。
- 所有 code 實作 → 優先交給 Windsurf，照 TODO 做。
- 你只需要決定方向、檢查結果、在我和 Windsurf 之間傳遞最少量的訊息即可。
