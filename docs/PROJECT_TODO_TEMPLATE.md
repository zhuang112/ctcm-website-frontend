# PROJECT_TODO 模板（範本）

說明：
- 本檔是「範本」，建議你複製內容到 `PROJECT_TODO.md` 作為實際使用檔。
- 真正執行的版本中，請持續更新任務狀態與描述。

---

## 任務標記約定

每條任務建議包含：

- 任務編號：`[T-001]`、`[T-002]`…
- 狀態：
  - `[OPEN]`：尚未開始
  - `[IN_PROGRESS]`：進行中
  - `[BLOCKED]`：被某問題卡住，需要決策或協助
  - `[NEEDS_REVIEW]`：已實作，等待 ChatGPT 或你檢查
  - `[DONE]`：完成
- 負責角色：
  - `[W]`：Windsurf 實作
  - `[C]`：ChatGPT（設計規則／文件／骨架）
  - `[U]`：你（決策／檢查／手動操作）

範例任務標頭：

- `[T-001][OPEN][W] 實作 html-to-markdown.ts 主要轉換流程`

---

## 階段 1：內容抓取與轉換（HTML → Markdown → JSON）

### [T-001][OPEN][W] 實作 html-to-markdown.ts 主要轉換流程

- 檔案位置：`src/tools/html-to-markdown.ts`
- 任務內容：
  - 依 `docs/HTML_TO_MARKDOWN_RULES_V4.md` 完成：
    - 標題、段落、列表、引用、`* * *` → `---` 等轉換。
    - 「省思」強制轉為 `## 省思`。
    - 圖片處理：
      - 第一張 → `featured_image`
      - 其餘 → `gallery_items[]`（caption 不寫進 body_markdown，只保留在 JSON 中）
    - 若ページ為「簡單結構（主文 + 單張圖片）」：
      - 只設 `featured_image`，不產生 gallery。
  - 請保留：
    - `body_markdown: string`
    - `images: { featured_image?: {...}, gallery_items?: [...] }`
- 限制：
  - 不得修改 `docs/CONTENT_SCHEMA.md` 型別定義。
- 參考文件：
  - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`
- 完成標準：
  - 通過 `tests/htmlToMarkdown.spec.ts`（若已存在）。
  - 手動用至少 3 個中台世界 HTML 範例檢查輸出。

---

### [T-002][OPEN][C] 設計 AnyContent 型別與各 post_type meta 欄位

- 檔案位置：`docs/CONTENT_SCHEMA.md`
- 任務內容：
  - 由 ChatGPT 協助設計：
    - 基本欄位：`external_id`, `language`, `post_type`, `post_title`, `post_date`, `body_markdown`, `featured_image`, `gallery_items`, `meta`, `seo`…
    - Teaching 專屬欄位（講者、開示日期、地點、經典依據…）。
    - News / Magazine / Branch / Index 專屬欄位。
- 參考文件：
  - `docs/CONTENT_SCHEMA.md`
  - 教學用 Teaching JSON 範例。

---

### [T-003][OPEN][W] 實作 generate-json-from-html.ts

- 檔案位置：`src/tools/generate-json-from-html.ts`
- 任務內容：
  - 讀取單篇 HTML：
    - 使用 `htmlToMarkdown()` 取得 `body_markdown` 與圖片資訊。
    - 結合 URL / 類型資訊，產生對應的 AnyContent JSON（例如 `AnyContentTeaching`）。
  - 將 JSON 儲存到 `data/json/{external_id}.json`。
- 參考文件：
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`
  - `docs/CONTENT_SCHEMA.md`

---

## 階段 2：zh-TW → zh-CN Pipeline

### [T-010][OPEN][C] 設計 zh-TW → zh-CN Pipeline 文件

- 檔案位置：`docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
- 任務內容：
  - 由 ChatGPT 撰寫：
    - 有 `-gb` URL 的處理方式。
    - 無簡中對應時是否用 OpenCC 自動生成。
    - 哪些欄位需要簡轉（標題、內文），哪些欄位保留繁體。
- 完成後：
  - 可新增對應的程式實作任務給 Windsurf。

---

### [T-011][OPEN][W] 實作 generate-zh-cn-from-zh-tw.ts

- 檔案位置：`src/tools/generate-zh-cn-from-zh-tw.ts`
- 任務內容：
  - 根據 `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`：
    - 讀取 zh-TW JSON。
    - 使用 OpenCC 或其他工具生成 zh-CN JSON。
    - 僅轉換指定欄位。
  - 輸出到 `data/json_zh_cn/{external_id}.json` 或相對應結構。

---

## 階段 3：WordPress 匯入（WP-CLI / Plugin）

### [T-020][OPEN][C] 設計 WP-CLI Importer 架構

- 檔案位置：`docs/WP_IMPORTER_DESIGN.md`
- 任務內容：
  - ChatGPT 撰寫：
    - 匯入流程步驟。
    - post type / meta / taxonomy 對應。
    - Polylang / 多語對應策略。
    - 匯入錯誤處理與 log 建議。

---

### [T-021][OPEN][W] 實作 `wp ctworld:import` 指令

- 檔案位置：例如 `wp-content/plugins/ctworld-importer/ctworld-importer.php`
- 任務內容：
  - 讀取 JSON 檔（選定資料夾）。
  - 將內容匯入對應 post type 與欄位。
  - 記錄 `ct_import_batch_id` 與 `ct_import_status`。
- 參考文件：
  - `docs/WP_IMPORTER_DESIGN.md`

---

## 使用建議

- 每次和 ChatGPT 討論完新的階段，可由 ChatGPT 協助更新此檔案。
- 每次讓 Windsurf 工作之前：
  - 只要指示它「從最前面的 `[OPEN][W]` 任務開始做」即可。
- 完成後，請你或 ChatGPT：
  - 把任務狀態改成 `[DONE]` 或 `[NEEDS_REVIEW]`。
