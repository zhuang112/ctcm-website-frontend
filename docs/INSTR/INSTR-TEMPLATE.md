# INSTR-TEMPLATE

> 範例模板：建立新的 INSTR 檔時複製本段並替換內容。

```text
指定執行者：實作 Agent（目前為 Codex）
任務：*T-xxxx <簡短描述>*
```

## 目標
1. <目標 1>
2. <目標 2>
3.（如需）更新 TODO / STATUS / notes 等文件。

---

## 要修改 / 參考的檔案
1. <檔案路徑與用途>
2. <檔案路徑與用途>

---

## 操作步驟
1. <步驟 1，列出允許修改範圍>
2. <步驟 2，提醒驗收點或測試指令>
3. <步驟 3，如需更新 docs/PROJECT_TODO.md 或 docs/Windsurf_ChatGPT_NOTES.md>

---

## 更新 PROJECT_TODO（如適用）
1. 打開 `docs/PROJECT_TODO.md`。
2. 更新/新增 T-xxxx 條目（狀態、目標、驗收）。

---

## 更新 notes（必填 RAW 連結）
1. 打開 `docs/Windsurf_ChatGPT_NOTES.md`。
2. 在對應日期下新增「T-xxxx <簡短描述>」小節，記錄：
   - 修改檔案清單。
   - 變更摘要與測試結果（若有）。
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

## 收尾（git + push）
1. `git status` 確認變更檔案。
2. `git add ...` / `git commit -m "T-xxxx: <訊息>"` / `git push origin main`。
3. 回報摘要：指出已完成的 T 任務與 notes 小節位置。