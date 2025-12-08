# AI 協作摘要（角色、契約、修改範圍）

> 根據：
> - `docs/WORKFLOW_CHATGPT_GITHUB_WINDSURF.md`
> - `docs/COMPLETE_PROJECT_WORKFLOW.md`
> - `docs/CONVENTIONS.md`
> - `docs/CODING_GUIDELINES.md`
>
> 整理出「AI 在本專案中的角色與責任」、「不可隨便改動的契約」、「實作任務時允許修改的範圍」。

---

## 1. AI（ChatGPT / Windsurf / Cursor）在專案中的角色與責任

### 1.1 ChatGPT（這個對話）— 架構師＋規格機

- **主要責任**
  - 設計內容模型與 JSON schema：`AnyContent`、各 `*Meta` / `*Content` 型別。
  - 撰寫與維護規格文件：
    - `docs/CONTENT_SCHEMA.md`
    - `docs/COMPLETE_PROJECT_WORKFLOW.md`
    - `docs/HTML_TO_MARKDOWN_RULES_*.md`
    - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
    - `docs/WORKFLOW_CHATGPT_GITHUB_WINDSURF.md` 等。
  - 產生骨架程式碼（含 `// TODO`）與函式簽名：
    - 例如 `tools/convert/*.ts`、`tools/crawl/*.ts`、未來的 `html-to-anycontent-*.ts` 等。
  - 在你提供 diff 或檔案內容時，做 **code review**：
    - 檢查是否符合 schema / docs
    - 檢查實作是否適合長期維護

- **不該做的事**
  - 不在完全沒有規格的情況下「亂寫成品」。
  - 不繞過 `docs/*.md` 直接更改 schema 或 type 定義。
  - 不隨意重構 public API 或大改檔案結構，除非你先決策並更新文件。

### 1.2 Windsurf / Cursor — 實作工程師

- 依照 `docs/*.md` ＋骨架程式碼＋ TODO 清單，補完實作細節。
- 修正 TypeScript / Node.js /（未來）WordPress plugin 的具體錯誤。
- 讓測試程式（若已存在）全部通過。
- **需要遵守**：
  - 不修改 TypeScript interface / JSON schema 欄位名稱與型別。
  - 不任意變更檔案架構或改名核心函式。

### 1.3 你 — 協調者 / 決策者

- 決定需求與優先順序（例如：先做 crawl、還是先做 teaching 轉換）。
- 把 ChatGPT 產生的 docs / 骨架程式碼放進 repo。
- 用固定模板把任務交給 Windsurf（限定可修改範圍）。
- 在關鍵階段把程式碼 / diff 貼回 ChatGPT，請求 code review。

---

## 2. 「不能隨便改動的契約」檔案與型別

### 2.1 Schema / 型別層（最關鍵的 contract）

- **`docs/CONTENT_SCHEMA.md`**
  - 定義 `Language`、`PostType`、`AnyContentBase`、各 `*Meta` / `*Content` interface。
  - 例如：
    - `Language = 'zh-tw' | 'zh-cn' | 'en' | 'ja'`
    - `featured_image` / `featured_image_caption` / `gallery_items[]`
    - `external_id`, `old_url`, `post_title`, `body_markdown` 等。

- **`src/types/*.ts`、`tools/types/*.ts`**
  - 映射 `CONTENT_SCHEMA` 的實際 TypeScript 定義。
  - 視為「內容 schema 的合約」。

- **規則（AI / IDE 不得做的事）**
  - 不改 interface / type 名稱：例如 `AnyContent`, `TeachingMeta`, `MagazineContent`。
  - 不改欄位名稱：例如 `external_id`, `language`, `post_type`, `body_markdown`。
  - 不改關鍵欄位型別：例如 `language` union、`featured_image?: string | null`。
  - 若要調整 schema：
    1. 由 ChatGPT 先更新 `docs/CONTENT_SCHEMA.md`。
    2. 再調整對應 `src/types/*.ts` / `tools/types/*.ts`。
    3. 最後才更新實作程式與測試。

### 2.2 行為層規則（HTML→Markdown、繁→簡）

- **`docs/HTML_TO_MARKDOWN_RULES_*.md`**
  - 規定：
    - Caption 只存在 JSON；不寫進 `body_markdown`。
    - 圖片欄位必須用 `featured_image` / `featured_image_caption` / `gallery_items[]`。
    - 偈語、索引頁等特殊區塊的處理方式。
  - AI / IDE 實作時不得：
    - 在 `body_markdown` 插入圖片圖說。
    - 自行新增 `body_html` 等未定義欄位當作捷徑。
    - 改變圖片欄位的結構設計。

- **`docs/ZH_TW_TO_ZH_CN_PIPELINE.md`**
  - 哪些欄位需要繁→簡，哪些絕對不能動（ID、URL、enum、數字）。

- **`docs/COMPLETE_PROJECT_WORKFLOW.md`**
  - 整體 pipeline：crawl → HTML→AnyContent(JSON) → 繁簡 → WordPress 匯入 → React 前端。
  - 各階段邊界、責任分工（例如：fallback 主圖不在 HTML→JSON 階段處理）。

### 2.3 Public API（函式與檔案邊界）

- 已經定義好的對外匯出介面視為 contract：
  - 如 `htmlToAnyContentTeaching(html: string, url: string): TeachingContent`。
  - `crawl-ctworld.ts` 的 CLI 參數與主流程。
- AI / IDE 在實作任務時不應：
  - 改變函式名稱或參數列表。
  - 任意更動檔案對外的 export 結構。

---

## 3. 實作任務時應修改哪些區塊？應避免哪些重構？

### 3.1 可以安全修改的範圍

- **標註 `// TODO` 的區塊**
  - 例如：
    - `tools/convert/html-to-anycontent-teaching.ts` 中未實作的函式體。
    - `tools/crawl/*.ts` 內明確標出待完成的邏輯。
  - Windsurf / Cursor 應主要在這些區塊填入實作。

- **同一檔案內的小型輔助函式**
  - 為了完成 TODO，可以在同一檔案內新增小 helper：
    - 例如 `extractMainContentRoot(dom)`、`normalizeLegacyUrl(url)` 等。
  - 但不可：
    - 拆檔案成多個 module，改整體架構。
    - 改變既有 public export 的介面。

- **與任務直接相關的實作細節**
  - HTML→Markdown 的標題、段落、列表、圖片解析實作。
  - crawl / filesystem inventory / diff 的業務邏輯。
  - 繁→簡 pipeline 中欄位遍歷與轉換邏輯。

### 3.2 應避免或需極度小心的變更

- **避免修改 schema／型別檔**
  - 不直接改 `src/types/*.ts`、`tools/types/*.ts`，除非：
    - 先在 `docs/CONTENT_SCHEMA.md` 調整，
    - 再由 ChatGPT 幫忙更新 types 與實作。

- **避免隨意更動 public API / 檔案結構**
  - 不將既有函式改名或改參數型別。
  - 不重命名檔案、搬動目錄、或拆分/合併已約定好的模組（例如 `classify-url.ts`、`extract-main-content.ts`）。

- **避免為了一個任務就重構整個檔案**
  - 任務只要求「補完 TODO」時：
    - 不大規模改寫毫無關聯的程式碼。
    - 不跨檔案引入新的相依關係或大改呼叫方式。

- **避免違反 HTML / Markdown / JSON 的核心規則**
  - 不把圖片 caption 寫進 `body_markdown`。
  - 不增加與 docs 不符的新欄位（例如 `body_html`、`images_raw`）。
  - 不更改 `featured_image` + `gallery_items[]` 的結構與用途。

- **避免為了測試過關偷偷改 schema**
  - 若有測試（未來的 `tests/*.spec.ts` 等）：
    - 完成標準是「在 **既有 schema 與 docs 不變** 的前提下，讓測試通過」。
    - 若認為測試與文件衝突，應更新 docs 或討論後再動 schema，而不是私下改 type 或欄位。

---

## 4. 一句話總結

- **ChatGPT**：負責「規格 + 骨架 + code review」，是 schema / 流程的設計者。
- **`docs/CONTENT_SCHEMA.md` + `src/types/*.ts` 等**：是這個專案的「憲法」與合約，不可隨意改動。
- **每次實作任務**：應只在明確標註的 TODO 與本任務相關的小範圍內修改程式，
  避免隨意重構或變更 contract，以保持長期可維護性與多方協作的一致性。
