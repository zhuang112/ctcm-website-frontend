
# INSTR：新增 TODO 條目 T-0016（zh-TW / zh-CN 健康檢查工具）

下列內容可整段貼給 Codex，先把「zh-TW / zh-CN 健康檢查工具」記錄進 TODO，不實作程式，只更新 PROJECT_TODO 與 notes。

```text
你現在是這個專案的主要實作 Agent。

目標：
先把「zh-TW / zh-CN 健康檢查工具」記錄進 TODO，不實作程式。  
只要更新 docs/PROJECT_TODO.md 與 docs/Windsurf_ChatGPT_NOTES.md，讓未來可以依這個條目開新任務。

本次僅改 docs。

================================
【步驟一】更新 PROJECT_TODO：新增 T-0016 健康檢查工具任務
================================

1. 打開 `docs/PROJECT_TODO.md`。

2. 在 T-0015 之後，新增一個條目，例如：

   ### T-0016 zh-cn-health-check-tool: zh-TW / zh-CN JSON 健康檢查工具

   > 狀態：⬜ 尚未開始（僅登記需求，未實作）

   - 目標：
     - 提供一個簡單 CLI（或 Node script），用來檢查 zh-TW / zh-CN JSON 是否一致：
       - 比對 `data/anycontent/zh-tw` 與 `data/anycontent/zh-cn`（實際路徑依 repo 最終結構微調）。
       - 列出：
         - zh-TW 有但 zh-CN 缺少的檔案。
         - zh-CN 有但 zh-TW 沒有（多出來）的檔案。
         - （進階）檔名相同但語言欄位或基本欄位有明顯異常的項目。
     - 將來實作完成後，用這個工具在「跑完 zh-TW→zh-CN pipeline」之後做健康檢查。

   - 建議未來實作重點（備忘）：
     - 走訪 zh-TW / zh-CN 根目錄，建立檔名列表。
     - 用相對路徑為 key，比對兩側是否都有檔案。
     - 可選：讀部分 JSON 欄位（例如 `language`），確認 zh-CN 檔案的 `language === "zh-cn"`。

   - 驗收（待未來任務補充）：
     - 在專案根目錄執行 `npm run check:zh-cn`（名稱可修改），能輸出缺失或異常檔案列表。
     - 對於正常情況，log 內容清楚，且不會誤刪、誤改任何檔案。

3. 不需修改其他既有任務內容，這一顆目前只作為「將來要實作」的備忘錄。

================================
【步驟二】更新 notes：記錄 T-0016 條目新增
================================

1. 打開 `docs/Windsurf_ChatGPT_NOTES.md`。

2. 在「2025-12-12 任務」區塊底下，新增一個簡短小節，例如：

   #### T-0016 zh-cn-health-check-tool（僅登記 TODO）

   - 新增 `PROJECT_TODO` 條目 T-0016，預留「zh-TW / zh-CN JSON 健康檢查 CLI」需求。
   - 未實作任何程式碼，僅備忘未來需要一個工具：
     - 比對 zh-TW / zh-CN 資料夾檔案數量與檔名一致性。
     - 在跑完 zh-TW→zh-CN pipeline 後，提醒使用者用此工具檢查。

   變更檔案（含 RAW 連結）：

   - docs/PROJECT_TODO.md  
     RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

   - docs/Windsurf_ChatGPT_NOTES.md  
     RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

================================
【步驟三】依 workflow 收尾（git + push + 極簡回報）
================================

1. `git status` 確認本次只改：
   - `docs/PROJECT_TODO.md`
   - `docs/Windsurf_ChatGPT_NOTES.md`

2. 執行：

   ```bash
   git add docs/PROJECT_TODO.md docs/Windsurf_ChatGPT_NOTES.md
   git commit -m "T-0016: add zh-CN health check tool todo entry"
   git push origin main
   ```

3. 回覆給使用者時，用極簡格式，例如：

   - 已新增：T-0016 zh-cn-health-check-tool TODO（僅登記，未實作）。
   - 請看 `docs/Windsurf_ChatGPT_NOTES.md` 中 2025-12-12 任務：T-0016 小節（含 RAW 連結）。
   - 最後 commit hash：<hash>。
```
