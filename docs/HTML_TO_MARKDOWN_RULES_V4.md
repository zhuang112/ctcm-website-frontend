# HTML_TO_MARKDOWN_RULES_V4

> 用於將 legacy HTML 轉成 AnyContent JSON（尤其 `body_markdown`、圖片欄位與 anchors）。
> 本版著重「可維護、好查找」，若要修改程式邏輯，先更新本檔再同步程式與測試。

---

## 0. 通用原則

- 說明如何轉成 Markdown / AnyContent；不直接規範特定程式碼實作。
- 不確定的內容寧可留空（`null` / `[]`），避免亂填。
- 規則以簡潔、可落地為主，方便 ChatGPT / Agent 快速回顧。

---

## 1. 共用 HTML→Markdown 規則

### 1.1 需要移除的元素
- 直接忽略：`<script>`, `<style>`, `<nav>`, `<footer>`, `<form>`。
- `<table>` 暫不轉 Markdown 表格，只取純文字。

### 1.2 區塊元素
- `h1` / `h2` / `h3` → `#` / `##` / `###`。
- `<p>`：一般段落依行內規則輸出，`<br>` 轉成換行。
- `blockquote` / `pre` / `code`：維持 Markdown 意義，不額外嵌套。

### 1.3 行內元素
- `strong` / `em` / `code` → 對應 Markdown 行內格式。
- 不產生 `![]()`；圖片僅收集到 JSON（見第 2 章）。

### 1.4 連結與錨點
- 一般連結：`[text](href)`；若無文字，使用 `href` 當 label。
- `mailto:` / `tel:` 以正常連結格式保留。
- anchors（`id` / `name`）：收集到 `anchors`，避免重複；sutra 特例在程式中處理，原則是保持唯一與可讀。

---

## 2. 圖片與圖庫策略（featured / gallery / fallback）

### 2.1 收集 `<img>`
- 抽取 `src` 作為 URL，`alt` 作為說明；`caption` 由周邊文字推導，若無則 `null`。
- 只收集，不在 `body_markdown` 內嵌 `![]()`。

### 2.2 featured_image
- 預設第一張圖片作為 `featured_image`；若樣板有 hero/banner 可由 adapter 規則挑選。
- `featured_image_caption` 無可靠來源時保持 `null`。

### 2.3 gallery_items
- 其餘圖片依序放入 `gallery_items[]`，欄位 `{ url, alt, caption }`，缺值以 `null` 表示。
- Markdown 內不放圖庫的 `![]()`。

### 2.4 無可用圖片
- 清空所有圖片欄位：
  - `featured_image = null`
  - `featured_image_caption = null`
  - `gallery_items = []`
- 不做任意 fallback，避免污染資料。

---

## 3. 各 post_type 注意事項

### 3.1 teaching
- sutra 側重偈語：經文行會收集成 `verses`，供 adapter 映射到 `ct_verse_*`。
- 圖片沿用共用策略；若需要 hero 由 adapter 判斷，不在此強制。

### 3.2 news
- 主文 Markdown 依共用規則。
- 圖片：一張主圖、其餘進 gallery；若無可靠圖片則全部留空。
- 日期、地點等 meta 由 adapter 解析，本檔不定義解析規則。

### 3.3 magazine / branch / gallery / resource / download / index_page
- 仍採「一張主圖 + 其餘 gallery」的簡化策略。
- 若樣板尚未收斂，寧可把圖片欄位留空，不強制塞值。

---

## 4. 驗收快速檢查

- 文字：標題層級與段落是否合理？有無多餘空白或破版換行？
- 連結：`mailto:` / `tel:` 是否保留，anchors 是否去重？
- 圖片：
  - `featured_image` 有值時，caption 是否可信？不確定就 `null`。
  - `gallery_items` 數量與 HTML 實際圖片是否一致？
  - 無可用圖片時，三個欄位是否都清空？
- 規則變更時，先更新本檔，再同步程式與測試，並在 notes 註明來源與理由。