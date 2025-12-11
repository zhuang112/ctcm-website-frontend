# AI 協作總結

> 版本：2025-12-12
> 提醒：完整協作流程與安全規則以 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 為單一真相；本檔僅為角色互動摘要。
---
---

## 專案協作總覽

- 目標：將 ctworld.org 內容導向 Headless WordPress + React（長期可能採 Next.js），並用 AnyContent schema 管理內容。
- 分工：使用者決策與橋接，ChatGPT 寫規則與 docs，Codex 在本機 repo 改檔、測試、commit + push。
- 真相來源：GitHub main 分支。未 push 的本機修改不視為有效。

---

## 三個角色與分工

- 你（使用者）
  - 決定做什麼、優先順序、何時開始/結束任務。
  - 在 ChatGPT / Codex 之間轉貼指令與回報摘要。
  - 可執行安全指令（git pull / add / commit / push / npm scripts）。

- ChatGPT（規則設計＋文件機器＋架構師）
  - 撰寫與維護 docs、規劃 T 任務、提供短指令給 Codex。
  - 依 GitHub RAW 連結或最新 snapshot 讀檔，review Codex 回報。
  - 不直接動你的本機檔案或跑 git。

- 實作 Agent（目前主要是 Codex）
  - 在本機 repo 改檔、跑必要測試、git add/commit/push。
  - 遵守 docs 規格與 ChatGPT 指令；高風險操作需請求 allow。
  - 在 `Windsurf_ChatGPT_NOTES.md` 記錄任務摘要與 commit hash。

---

## 流程：T 任務的生命週期

1) 需求與規格：ChatGPT 在 `PROJECT_TODO.md` 補齊任務背景、目標、檔案範圍、驗收方式。  
2) 執行：使用者把短指令貼給 Codex，Codex 依 spec 改檔並跑測試。  
3) 回報：Codex 在 `Windsurf_ChatGPT_NOTES.md` 紀錄修改與測試結果，產生 commit + push。  
4) 檢視：使用者將回報摘要貼回 ChatGPT，必要時調整 spec 或開新任務。  
5) 同步：`PROJECT_TODO.md` / `PROJECT_STATUS.md` 需對齊最新實作與狀態。

---

## 真相來源與資料流

- GitHub main = 單一真相；所有有效變更需 commit + push。
- docs snapshot（`npm run snapshot:docs -- --task ...`）僅作例外備援，非主要資訊來源。
- `Windsurf_ChatGPT_NOTES.md`：任務交接與 commit hash 記錄；有疑問一律寫在這裡。
- 其他資料流：
  - 本機 ↔ GitHub：透過 git 操作。
  - ChatGPT 讀檔：優先使用 RAW 連結；若無法連線，再使用最新 snapshot 或使用者貼文。

---

## 未來擴充

- 若更換或增加實作 Agent（雲端 / 其他工具），沿用同一流程：docs 為準、GitHub main 為準、notes 紀錄交接。
- 若新增分支或 fork，需在 workflow 檔更新 RAW base 與分支名稱。
