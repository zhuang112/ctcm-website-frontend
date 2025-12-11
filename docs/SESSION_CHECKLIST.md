# SESSION_CHECKLIST

> 版本：2025-12-12
> 提醒：協作流程單一真相為 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`；本檔僅為行動檢查表，詳細規則請見 workflow 檔。
---
---

## 開工前
- 今天的重點（一句話）：________________
- `git pull` 是否最新？（main 為準）
- 有需要先問 ChatGPT 的規則 / 架構嗎？

## 與 ChatGPT 協作時
- 需要更新哪些 docs？哪些 T 任務要新增 / 調整？
- ChatGPT 給的內容，是否已貼回 repo（spec / 文件）？
- 有無 RAW 連結或 snapshot 要讓 ChatGPT 讀取？

## 與 Codex / Agent 協作時
- 是否將 ChatGPT 的短指令原樣貼給 Codex？
- Codex 回報摘要是否貼回 ChatGPT 讓其 review？
- 若有調整 zh-CN pipeline / JSON，是否在收尾前跑過 `npm run check:zh-cn`？

## 收工前
- 是否已 `git add` / `commit` / `push` 本輪變更？
- `PROJECT_TODO.md` / `PROJECT_STATUS.md` 是否同步更新？
- `Windsurf_ChatGPT_NOTES.md` 是否記錄 commit hash 與本輪重點？
