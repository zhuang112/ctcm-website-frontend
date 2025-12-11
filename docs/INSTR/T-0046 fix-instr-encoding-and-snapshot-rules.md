# T-0046 fix-instr-encoding-and-snapshot-rules

本次任務：確認關鍵 docs 為 UTF-8，並補強 snapshot 規則。

## 目標
- 確認並修正以下檔案為 UTF-8、不可有亂碼或「�」：
  - `docs/INSTR/INSTR-T-0018-meta-instr-and-status-structure.md`
  - `docs/INSTR/README.md`
  - `docs/PROJECT_TODO.md`
- 在 workflow 補充 docs snapshot / ZIP 的使用規則：
  - snapshot 不是單一真相，只是給 ChatGPT 的備援；真相以 GitHub/main + notes 為準。
  - 檔名建議包含 T 編號與日期，例如 `ctworld-docs-T-0007-2025-12-10-v1.zip`。
  - RAW 可讀優先 RAW；RAW 無法讀時才用 snapshot 或請使用者上傳本機檔。
- 在 PROJECT_TODO + notes 登記並標記 T-0046 完成。

## 步驟摘要
1) 檢查上述 3 個檔案的 UTF-8，必要時用 git 歷史還原正常內容。  
2) 在 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 補充 snapshot 規則（定位、檔名建議、使用順序）。  
3) 在 `docs/PROJECT_TODO.md` 新增 T-0046 條目並標記完成。  
4) 在 `docs/Windsurf_ChatGPT_NOTES.md` 新增 T-0046 小節（記錄檢查檔案、workflow 補充內容、未跑 test/build）。  
5) 收尾：`git add` 相關檔案 → `git commit -m "T-0046: fix INSTR encoding and snapshot rules"` → `git push origin main`。  
6) 回報時附上：完成說明、三檔 UTF-8 OK、snapshot 規則補充內容、最後 commit hash、給 ChatGPT 上傳的檔案清單。
