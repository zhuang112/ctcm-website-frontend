# PROJECT_TODO（範本）

> 建議由 ChatGPT 協助維護這份清單，
> Windsurf / Cursor 則依照指定的 TODO 項目實作。

## 規則

- 每一條任務盡量「小而明確」。  
- 每一條任務要指明：
  - 關聯的 docs（規格來源）。
  - 要修改的檔案路徑。
  - 允許修改的範圍（通常是 TODO 區塊）。
  - 驗收方式（測試、輸出檔、或手動檢查）。

---

## TODO 列表示範

### 1. 實作 crawl 工具（已完成範例）

- 狀態：✅ 完成  
- 說明：
  - 檔案：`tools/crawl/crawl-ctworld.ts`
  - 規格：`docs/crawl-and-inventory.md`
  - 功能：
    - 從 `https://www.ctworld.org` 與 `/sitemap.htm` 出發做 BFS 爬蟲。
    - 只保留 ctworld.org / ctworld.org.tw 網域。
    - 產出 `data/crawl/crawled-urls.json` / `.csv`。
- 負責人：ChatGPT（骨架）＋ Windsurf（實作）

### 2. 實作 HTML→AnyContent：teaching

- 狀態：⬜ 尚未開始  
- 說明：
  - 檔案：
    - `tools/convert/html-to-anycontent-teaching.ts`（需由 ChatGPT 產生骨架）
    - `src/types/anycontent-teaching.ts`（schema）
  - 規格：
    - `docs/HTML_TO_MARKDOWN_RULES_V3.md`
    - `docs/CONTENT_SCHEMA.md`（規劃中）
  - 功能：
    - 將 teaching 類型 HTML 轉成 `AnyContentTeaching` JSON。
    - 正確處理標題、主文、偈語、圖片欄位。
- Windsurf 使用說明（給 Windsurf 的提示）：
  - 「只能修改 `html-to-anycontent-teaching.ts` 中標註 TODO 的區塊。」

### 3. 實作 zh-TW → zh-CN pipeline

- 狀態：⬜ 尚未開始  
- 說明：
  - 檔案：
    - `tools/convert/generate-zh-cn-from-zh-tw.ts`（骨架待產生）
  - 規格：
    - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
  - 功能：
    - 讀取 `data/zh-tw/**/*.json`，用 OpenCC 轉成簡體。
    - 針對指定欄位做繁簡轉換，其他欄位原封不動。

---

## 使用方式

1. 當你和 ChatGPT 討論出一個新功能：
   - ChatGPT 幫你在這裡新增一條 TODO。  
   - ChatGPT 同時產生 / 更新對應的 docs 與骨架程式碼。

2. 當你要交任務給 Windsurf 時：
   - 指定「請完成 PROJECT_TODO.md 中第 X 項」。  
   - 把該項裡的「檔案 / 規格 / 限制」貼給 Windsurf。

3. 任務完成後：
   - 你標記該項為 ✅ 並附上實際 commit hash（選擇性）。
   - 若 ChatGPT 做過 code review，可以在這裡附註「已 review」。

你可以把本檔案改名為 `PROJECT_TODO.md` 放進專案根目錄或 `docs/`，
並讓 ChatGPT 在每次重大討論後同步更新清單。
