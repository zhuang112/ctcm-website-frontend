# CODING_GUIDELINES.md

> 寫給未來的自己與 AI IDE（Windsurf / Cursor）：  
> 在這個專案裡，我們希望程式長什麼樣子。

---

## 1. TypeScript 風格

### 1.1 型別優先

- 避免使用 `any`，若不得已請加註解說明。
- 優先使用 interface / type 定義清楚資料結構：
  - `AnyContent`, `TeachingContent`, `NewsMeta` … 等集中在 `docs/CONTENT_SCHEMA.md` 與對應的 `*.ts` 中。
- 盡量讓函式 input / output 有明確型別，而不是傳 `any` 或 `object`。

### 1.2 單一職責

- 每個檔案有明確「責任」：
  - `classify-url.ts`：只處理 URL → post_type / collection_key。
  - `extract-main-content.ts`：只負責 DOM 中找主內容節點。
  - `html-to-markdown-core.ts`：只負責 DOM → Markdown + 圖片欄位。
  - `*-adapter.ts`：只負責各 post_type 的 meta 填寫。
- 避免一個檔案同時做：抓取、解析、匯出等多件事。

### 1.3 註解與 docs 對應

- 重要函式與 class 上方，寫清楚：
  - 功能摘要。
  - input / output 型別。
  - **對應哪一份 docs 的哪一節**：

```ts
/**
 * 將主內容節點轉為 Markdown + 圖片資訊
 * 對應：HTML_TO_MARKDOWN_RULES_V4.md §4
 */
export function convertDomToMarkdown(...) { ... }
```

---

## 2. HTML→Markdown 實作原則

搭配 `docs/HTML_TO_MARKDOWN_RULES_V4.md` 使用，這裡偏重「實作技巧」。

### 2.1 先清 DOM，再轉 Markdown

- 順序建議：
  1. 用 Cheerio 載入 HTML。
  2. 執行全域清理：
     - 移除 script/style/nav/footer/form 等。
     - 處理版面 table → unwrap。
  3. 找到主內容 root → 傳給 core 轉換。
- 千萬不要在 adapter 裡又各自任意操作全 DOM，以免邏輯散亂。

### 2.2 圖片處理

- 步驟建議：
  1. 在主內容 root 中掃描 `<img>`。
  2. 依序決定：
     - 第一張 → `featured_image`，必要時填 `featured_image_caption`。
     - 第二張起 → 填入 `gallery_items[]`。
  3. 解析完後，從 DOM 中移除 `<img>` 節點，避免在 Markdown 轉換時產生空段落。

- **不在此階段做 fallback 主圖**：
  - 若頁面完全沒有 `<img>`，保持：
    - `featured_image = null`
    - `gallery_items = []`

### 2.3 Markdown 安全性

- 保持 Markdown 簡單易讀：
  - 避免產生過度複雜的 nested 結構。
  - 預設使用標準 Markdown 語法（不依賴特定 renderer 的擴充）。
- 對奇怪 HTML 標籤：
  - 優先保留其文字內容，忽略未知標籤本身。

---

## 3. 繁→簡 Pipeline 實作注意事項

搭配 `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`。

### 3.1 欄位白名單

- 不要對整個 JSON 做「全域字串置換」，容易誤傷 URL / ID。
- 使用欄位白名單方式：
  - 指定哪些 key 需要轉換（例如 `post_title`, `body_markdown`, 某些 `meta.*`）。
  - 若未來新增中文欄位，要記得補進白名單。

### 3.2 Markdown 保護

- `body_markdown` / `ct_verse_block_markdown`：
  - 直接將整段字串丟進轉換器（例如 OpenCC）。
  - 測試要確保：
    - Markdown 語法（`#`, `*`, `[]()`, `` ``` `` 等）不因轉換而損壞。

### 3.3 語言碼 / external_id

- zh-tw → zh-cn：
  - `language` 改為 `'zh-cn'`。
  - `external_id` 保持不變。
- 若有 `multilingual` 欄位：
  - 在 zh-cn 版本裡補齊 `language = 'zh-cn'` 的那一列。

---

## 4. 測試策略

### 4.1 單元測試（Unit Test）

- 使用 Vitest / Jest（擇一）。
- 為核心模組寫測試：
  - `classify-url`
  - `extract-main-content`
  - `html-to-markdown-core`
  - 各 post-type adapter 的關鍵 parser。

### 4.2 Fixture + Snapshot

- 為代表性 HTML 頁建立 fixture：
  - 放在 `tests/fixtures/html/`。
- 將轉換結果（AnyContent JSON）做 snapshot：
  - 放在 `tests/snapshots/`。

注意：

- 避免 snapshot 過於巨大難以維護。
- 可以只針對關鍵欄位做部份 snapshot：
  - 例如 `post_title`, `body_markdown`, 部分 meta。

### 4.3 CI / 驗證腳本

- 建議新增：
  - `validate-external-ids.ts`：
    - 檢查 `(language, external_id)` 是否重複。
  - `validate-json-schema.ts`：
    - 使用 JSON Schema / Zod 驗證輸出 JSON 與 `CONTENT_SCHEMA` 一致。

---

## 5. React / 前端實作原則

### 5.1 Component Style

- Function component + hooks。
- 儘量寫成「純呈現」的 component：
  - 不直接呼叫 fetch / axios。
  - Data 由 props 傳入。
- Layout / UI：
  - 可視實際採用 Tailwind / CSS Modules / styled-components 等，但要統一。

### 5.2 資料取得

- 使用 hooks 包裝 API 呼叫，例如：

```ts
function useTeachingPage(externalId: string, lang: Language) {
  // fetch from WP API or internal API
}
```

- Route 層（頁面 component）只做：
  - 解析 URL → 得到 `externalId`, `language`。
  - 呼叫 hook → 得到 view model。
  - 把資料丟給展示用 component。

### 5.3 錯誤處理與 loading 狀態

- 一律處理：
  - loading state
  - error state
  - empty state（找不到資料或內容尚未匯入）

---

## 6. 日後擴充的基本原則

- **若新增欄位 / 規則**：
  1. 先改 docs（`CONTENT_SCHEMA`, `WORKFLOW`, `HTML_TO_MARKDOWN_RULES`, or `ZH_TW_TO_ZH_CN_PIPELINE`）。
  2. 再改程式碼實作。
  3. 再補測試。
- **若發現規則會讓未來後悔**：
  - 優先思考可回溯 / 可遷移的設計：
    - 例如保留 fallback 在後處理階段，而不是硬寫進原始 JSON。

---

這份檔案不求完整，但希望成為：

- 「寫新程式前，大致瞄一眼」的參考。
- AI IDE 產生骨架程式時的風格提示。
