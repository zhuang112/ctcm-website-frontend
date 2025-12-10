
# INSTR：更新 ChatGPT ↔ 實作 Agent 溝通規則（禁止 citation 標記）

下列內容可整段貼給 Codex，請它更新 workflow 與 notes，避免再出現 `::contentReference[oaicite:0]{index=0}` 這類 citation 標記被貼進指令或 repo。

```text
你現在是這個專案的主要實作 Agent。

目標：
針對 ChatGPT ↔ 實作 Agent 的溝通，再補兩條正式規則：
1. 給實作 Agent 的指令 code block 中，不得出現 citation / 內部標記（例如 ::contentReference[...]）。
2. 若 ChatGPT 在 review 時發現實作有問題，需要可以「要求修正」並把原則寫回 workflow。

本次只改 docs，不動程式碼。

================================
【步驟一】更新 WORKFLOW_CHATGPT_GITHUB_AGENT（3.6 小節下補規則）
================================

1. 打開 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`。

2. 找到「3.6 ChatGPT ↔ 實作 Agent 的溝通格式（code block＋notes）」這一小節，在既有條列後面加上兩點（或等價文字）：

   - ChatGPT 在產生給實作 Agent 的指令時：
     - 指令內容一律置於單一 code block 中。
     - code block 內禁止出現 citation / 內部標記，例如：
       - `::contentReference[...]`
       - `oaicite:0` 或類似字樣
     - 若 ChatGPT 需要引用外部資料，只能在 code block 外面說明，避免把引用標記帶進指令。

   - ChatGPT 在 review 實作結果時：
     - 若發現實作或文件有明顯問題（邏輯錯誤、違反 workflow、安全風險…）：
       - 應直接在回覆中說明問題點。
       - 另提供一段「修正用的 code block 指令」，讓實作 Agent 可直接依指令修正。
       - 若屬於通用性的原則問題，應再開一個 docs 任務（或更新本檔），把新原則寫進 workflow 或 TOOLS_ROLES_AND_BOUNDARIES。

3. 儲存 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`。

================================
【步驟二】更新 notes：記錄這次規則補充
================================

1. 打開 `docs/Windsurf_ChatGPT_NOTES.md`。

2. 在 2025-12-12 的任務區塊中（可加在 T-0014 或 T-0016 附近），新增一小段說明本次補充：

   - ChatGPT ↔ 實作 Agent 溝通規則更新：
     - code block 內禁止出現 citation / 內部標記（`::contentReference[...]` 等），避免被誤貼進 repo。
     - ChatGPT 在 review 實作時，若發現問題需主動要求修正，並視情況更新 workflow 以避免同類錯誤重複發生。

3. 加上「變更檔案（含 RAW 連結）」區塊，例如：

   ```markdown
   變更檔案（含 RAW 連結）：

   - docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
     RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md

   - docs/Windsurf_ChatGPT_NOTES.md  
     RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
   ```

================================
【步驟三】依 workflow 收尾（git + push + 極簡回報）
================================

1. `git status` 確認本次只改：
   - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`
   - `docs/Windsurf_ChatGPT_NOTES.md`

2. 執行：

   ```bash
   git add docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md docs/Windsurf_ChatGPT_NOTES.md
   git commit -m "Docs: refine ChatGPT↔Agent communication rules (no citations in code blocks)"
   git push origin main
   ```

3. 回覆給使用者時，用極簡格式，例如：

   - 已更新：3.6 溝通規則（禁止 code block 中的 citation / 內部標記；規定 ChatGPT 要主動要求修正並更新 workflow）。
   - 請看 `docs/Windsurf_ChatGPT_NOTES.md` 中 2025-12-12 任務：溝通規則補充小節（含 RAW 連結）。
   - 最後 commit hash：<hash>。
```
