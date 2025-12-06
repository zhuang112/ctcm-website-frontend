# CODING GUIDELINES

> 本文件描述程式風格與實作細節上的建議，目標是：可讀、可維護，且方便之後補齊規則與測試。

---

## 1. TypeScript 風格

- 優先使用嚴格型別：
  - 避免 `any`，盡量從 `CONTENT_SCHEMA` 匯入既有型別。

- 函式設計：
  - 小而專一，每個檔案職責清楚：
    - `html-to-markdown.ts`：只 orchestrate 主流程。
    - `classify-url.ts`：只看 URL，不碰 DOM。
    - `extract-main-content.ts`：只負責找主內容區塊。
    - `html-to-markdown-core.ts`：純 HTML→Markdown + 圖片處理。
    - `post-type-adapters/*.ts`：只處理特定 `post_type` 的 meta。

- 註解：
  - 在重要函式上方加上簡潔說明：
    - input / output 型別。
    - 對應哪一份 docs 的哪一節（例如：`// 對應 HTML_TO_MARKDOWN_RULES_V4.md §5.2 news`）。

---

## 2. HTML → Markdown 實作原則

請嚴格依 `docs/HTML_TO_MARKDOWN_RULES_V4.md`：

- **Markdown 只放正文**：
  - 導覽、表單、sitemap、索引列表等一律不進 Markdown。

- **結構化資訊放 JSON**：
  - 圖片、圖說、偈語、月刊目錄、桌布下載、食譜材料 / 作法等放在 `meta` 或其他對應欄位。

- 圖片處理：
  - 所有 `<img>` 必須被解析並從 DOM 中移除。
  - 第一張 → `featured_image` + caption。
  - 其餘 → `gallery_items[]`。
  - 圖說只寫入 JSON，不進 `body_markdown`。

- 區塊元素：
  - `<h2>` / `<h3>` → `##` / `###`。
  - `<p>` → 段落。
  - `<ul>` / `<ol>` → Markdown 列表。
  - `<blockquote>` → `>`。
  - `<pre>` / `<code>` → code block / inline code。

---

## 3. 測試策略

- 使用 Vitest / Jest：
  - 對 `htmlToContentJson` 建立基礎測試（可先用 `it.skip` 搭骨架）。
  - 每種 `post_type` 至少建立一個代表性樣本。

- Snapshot 測試：
  - 固定的 HTML 輸入 → 期望的 AnyContent JSON。
  - 更新規則前先檢查 snapshot 差異，確定變動是「預期的」。

---

## 4. ZH_TW → ZH_CN Pipeline 實作注意事項

細節以 `docs/ZH_TW_TO_ZH_CN_PIPELINE.md` 為準，這裡只列原則：

- 僅對「中文文字欄位」做繁→簡轉換：
  - 包含 `post_title`, `post_excerpt`, `body_markdown`, 多數 `meta` 中文欄位與 `seo` 文案。

- 不變更：
  - ID / URL / 數字 / enum 類欄位。

- 保留 Markdown 結構：
  - 僅轉換中文字元，不影響 `#`, `*`, `[ ]`, `()` 等 Markdown 符號。

- 以白名單方式列出需要轉換的欄位，避免誤改。

---

## 5. 前端程式（React）基本原則（概要）

- Component：
  - 優先使用 function components + hooks。
  - props 型別明確，避免從 `any` 或過於寬鬆的物件直接渲染。

- 資料取得：
  - 前端僅依賴 Headless WordPress / API，**不直接解析舊站 HTML**。
  - 若有需要依賴某欄位顯示，先確認該欄位已在 `CONTENT_SCHEMA` 定義並在後端轉換流程中填好，再由前端渲染。
