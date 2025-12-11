# INSTR-TEMPLATE

> 用途：建立新的 INSTR 文件時的骨架，方便 ChatGPT / Codex / 你快速接力。全檔一律 UTF-8 + LF。  
> 規定：每一個 T 任務都要有對應 `docs/INSTR/INSTR-T-xxxx-<slug>.md`，未建立 INSTR 不開工。

```text
指定實作 Agent：本次負責人（目前預設 Codex）
任務代號：T-xxxx <任務名稱>
```

## 重點
1. <重點 1>
2. <重點 2>
3. 明確列出允許修改的檔案與必跑測試；若為 docs-only，註記「未跑 test/build」。
4. （必要時）提醒同步 PROJECT_TODO / notes。

---

## 需修改 / 新增的檔案
1. <檔案或目錄>
2. <檔案或目錄>

---

## 步驟 / 驗收
1. <步驟 1，含預期結果>
2. <步驟 2，含測試或檢查>
3. <步驟 3，若需要更新 docs/PROJECT_TODO.md 或 docs/Windsurf_ChatGPT_NOTES.md>

---

## 更新 PROJECT_TODO（必要時）
1. 開啟 `docs/PROJECT_TODO.md`。
2. 新增 / 更新 T-xxxx 小節（目標、狀態、驗收）。

---

## 更新 notes（含 RAW 連結）
1. 開啟 `docs/Windsurf_ChatGPT_NOTES.md`。
2. 在最新日期區塊下新增「T-xxxx <任務名稱>」小節，記錄：
   - 修改檔案與重點。
   - 執行的測試 / 指令與結果（若 docs-only，註記未跑 test/build）。
   - 最後 commit hash。
   - 變更檔案（含 RAW 連結）：
     ```markdown
     變更檔案（含 RAW 連結）：
     - <檔案 1>
       RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/<檔案 1>
     - <檔案 2>
       RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/<檔案 2>
     ```

---

## 給 ChatGPT review 的檔案列表（務必列出）
- 將「本次需要 ChatGPT review 的檔案」以清單列出，方便 ChatGPT 直接開 RAW 連結檢視。
- 禁用 citation / contentReference 標記，不要在指令中出現 `::contentReference[...]`、`oaicite` 等。
- 若涉及 schema / pipeline / rules，請提醒 ChatGPT 要先看哪些 docs。

---

## 收尾（git + push）
1. `git status` 確認變更。
2. `git add ...` / `git commit -m "T-xxxx: <摘要>"` / `git push origin main`。
3. 回報時附上 commit hash，並指向 notes 小節。
