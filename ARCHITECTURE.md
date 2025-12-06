# ARCHITECTURE

> 中台世界舊站 → Headless WordPress + React 的系統架構與資料流。

---

## 1. 系統總覽

本專案屬於一個多階段的內容遷移與前端重建計畫的一部分：

1. **爬蟲 / 抽取**
   - 從舊站 HTML 下載頁面。
   - 補齊相對網址、處理編碼等。

2. **HTML → AnyContent JSON（zh-TW）**
   - 使用 Node.js + TypeScript + Cheerio。
   - 轉成 `AnyContent` 統一 schema：
     - `post_type`：`teaching` / `news` / `magazine` / `branch` / `gallery` / `resource` / `download` / `index_page` …
     - `body_markdown`：只保留真正正文。
     - `meta`：偈語、活動日期、桌布代碼、食譜步驟等結構化欄位。
   - 規格文件：
     - `docs/CONTENT_SCHEMA.md`
     - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
     - `docs/COMPLETE_PROJECT_WORKFLOW.md`

3. **繁→簡 Pipeline（zh-TW → zh-CN）**
   - 對已產生的 zh-TW JSON 做欄位級別的繁→簡轉換。
   - 保持 schema 完全一致，只改變文字內容。
   - 規格：`docs/ZH_TW_TO_ZH_CN_PIPELINE.md`

4. **Headless WordPress 匯入**
   - 以 `AnyContent` JSON 為來源。
   - 為每個 `post_type` 建立對應 Custom Post Type 與欄位。
   - 使用 `external_id` + 語言資訊建立多語關聯與 redirect。

5. **React Frontend**
   - 本 repo 的 `src/` 目錄下為前端實作。
   - 透過 WordPress REST / GraphQL 讀取內容並渲染頁面。
   - UI/UX 規則與命名慣例見 `CONVENTIONS.md` 與 `CODING_GUIDELINES.md`。

---

## 2. 內容轉換分層架構

對應 `docs/00_windsurf-task-html-to-markdown.md` 與 `docs/HTML_TO_MARKDOWN_RULES_V4.md`：

- `classify-url.ts`
  - 輸入：原始 URL。
  - 輸出：`postType`, `collectionKey`。
  - 規則：依 `COMPLETE_PROJECT_WORKFLOW.md` 中的 sitemap 與分類決策。

- `extract-main-content.ts`
  - 輸入：完整 Cheerio DOM。
  - 輸出：主內容 root element。
  - 責任：移除 header / footer / 導覽 / 表單 / sitemap 等非正文。

- `html-to-markdown-core.ts`
  - 輸入：主內容 root + DOM。
  - 輸出：
    - `bodyMarkdown`
    - `featuredImage` / `featuredImageCaption`
    - `galleryItems[]`
  - 規則：
    - HTML 區塊 → Markdown（標題、段落、列表、blockquote、code 等）。
    - 表格判斷：版面用 table unwrap，資料表視情況保留或轉換。
    - 圖片一律放入 JSON，不進 Markdown。

- `post-type-adapters/*.ts`
  - 依 `post_type` 組裝特定 meta：
    - `teaching`：講師、偈語、經典名稱等。
    - `news`：活動日期 / 地點 / 類別。
    - `magazine`：期別、欄名、issue / article 雙層模型。
    - `branch`：地址、聯絡資訊、交通說明。
    - `resource`：e-Book / 食譜欄位。
    - `download`：桌布代碼與多解析度檔案。
    - `index_page`：只保留 debug 說明與索引 key。

---

## 3. 資料模型（概觀）

詳細型別請參考 `docs/CONTENT_SCHEMA.md`，這裡只列出概念：

- `AnyContent`
  - 必備欄位：`external_id`, `language`, `post_type`, `old_url`, `post_title`, `body_markdown` …
  - 共用欄位：`featured_image`, `gallery_items[]`, `seo`, `multilingual` …
  - `meta`：依 `post_type` 擴充，例如 `TeachingMeta`, `NewsMeta`, `MagazineMeta` 等。

- multilingual / redirect
  - zh-TW / zh-CN 使用相同 group key（由 `external_id` 派生）。
  - `old_url` 保留舊站網址（繁體 / 簡體版本）。

---

## 4. 測試與品質保證（概要）

- 內容轉換：
  - 每種 `post_type` 至少一組以上實際 HTML / JSON 範例。
  - 使用 snapshot 測試避免不小心改壞規則。

- 前端：
  - 以型別安全（TypeScript）與明確的 component props 為中心。
  - 嚴格區分「內容模型（domain model）」與「UI 呈現」層。
