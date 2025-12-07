# ARCHITECTURE.md

> 中台世界舊站 → Headless WordPress → React 前端 的系統藍圖。  
> 著重在「模組分工」與「資料流」，細節流程請搭配 `docs/COMPLETE_PROJECT_WORKFLOW.md` 閱讀。

---

## 1. 全體系統架構圖（文字版）

```text
[Legacy Web (ctworld.org / ctworld.org.tw)]
        |
        |  (HTTP GET HTML)
        v
[爬蟲 / HTML 抓取工具]
        |
        |  (HTML 檔 + URL 清單)
        v
[HTML→AnyContent 轉換器 (zh-tw)]
        |
        |  AnyContent JSON (zh-tw)
        v
[繁→簡 Pipeline (zh-tw → zh-cn)]
        |
        |  AnyContent JSON (zh-cn)
        v
[WordPress Importer]
        |
        |  WP posts + meta + Polylang + Media
        v
[Headless WordPress]
        |
        |  REST / GraphQL
        v
[React / Next/Vite Frontend (本 repo)]
```

### 1.1 核心資料單位：AnyContent

- 將舊站各種 HTML 頁面，轉成同一種 JSON 結構：`AnyContent`。
- `post_type` 決定內容類型：
  - `teaching`, `news`, `magazine`, `branch`, `gallery`, `resource`, `download`, `index_page`。
- 每一筆 `AnyContent` 至少包含：
  - `external_id`, `language`, `old_url`, `post_title`, `body_markdown`。
  - 圖片：`featured_image`, `featured_image_caption`, `gallery_items[]`。
  - `meta`：各 post_type 特有欄位。

詳細型別定義：`docs/CONTENT_SCHEMA.md`。

---

## 2. 內容轉換分層

> 這一段通常會實作在 Node.js / TypeScript 工具專案中，但規格由此說明。

### 2.1 URL 分類：classify-url

責任：

- 根據舊站 URL 判斷：
  - `post_type`
  - `collection_key`（如 sutra_stories / chan_koans / buddhist_ebooks）。

輸入：

- 原始 URL（`https://www.ctworld.org.tw/...`）

輸出（示例介面）：

```ts
interface UrlClassification {
  post_type: PostType;
  collection_key?: string;
}
```

### 2.2 主內容抽取：extract-main-content

責任：

- 從整頁 DOM 裡找出「真正的正文區塊」。

步驟：

1. 移除：header / nav / footer / sitemap / script / style / form 等。  
2. 以文字密度、DOM 結構為 heuristic 找出主欄位 `<td>` / `<div>`。  
3. 回傳該節點作為 html-to-markdown 的根。

### 2.3 HTML→Markdown 核心：html-to-markdown-core

責任：

- 把主內容節點 DOM 轉成：
  - `body_markdown`
  - `featured_image`
  - `featured_image_caption`
  - `gallery_items[]`

遵守 `docs/HTML_TO_MARKDOWN_RULES_V4.md`：

- 區塊元素 → Markdown（標題、段落、列表、blockquote、code 等）。
- 圖片：
  - 第一張 → `featured_image`（可選擇填 `featured_image_caption`）。
  - 後續 → `gallery_items[]`。
  - 本階段 **不處理 fallback 主圖**，缺圖就維持 `null`。

### 2.4 post-type-adapters

責任：

- 依 `post_type` 解析該類型獨有的 meta。

範例：

- `teaching-adapter`
  - 講者、地點、日期、經典、偈語區塊等。
- `news-adapter`
  - 新聞日期、活動日期區間、地點、分類。
- `magazine-issue-adapter` / `magazine-article-adapter`
  - 期數、年/月、欄位名、作者、目錄結構。
- `branch-adapter`
  - 地址、電話、交通資訊。
- `resource-adapter`
  - 電子書清單、食譜材料/作法 markdown。

### 2.5 AnyContent 組裝

- 前述步驟的輸出＋ `external_id` / `language` / `old_url` → 組成完整 `AnyContent`。


---

## 3. 繁→簡 Pipeline 分層

完整規範：`docs/ZH_TW_TO_ZH_CN_PIPELINE.md`。

概念上本身也是一個獨立模組：

- Input：`AnyContent (language = 'zh-tw')`
- Process：對「文字欄位白名單」做繁→簡轉換。
- Output：`AnyContent (language = 'zh-cn')`

特點：

- `external_id` 不變，作為多語 group key。
- `old_url` 盡量填入對應的 `-gb` 版舊網址。
- 不修改 URL / ID / 數值型欄位。

---

## 4. WordPress Importer 與 Media Pipeline

### 4.1 Importer 分層

Importer 建議拆為：

1. JSON Reader
   - 批次讀取 `data/{lang}/{post_type}/*.json`。
2. Mapper
   - `AnyContent` → `WP_Post` + meta + ACF。
3. WP I/O 層
   - 新增 / 更新 post。
   - 設定 Polylang 語言 / 翻譯群組。
   - 設定 featured image。
4. Error / Logging
   - 記錄 external_id / language / old_url / 錯誤原因。

### 4.2 Media / 圖片處理

媒體處理拆成兩階段：

1. **來源同步階段**
   - 從所有 JSON 收集舊圖片 URL 清單。
   - 批次下載並上傳到 WP Media。
   - 產生映射表：`legacy_image_url -> attachment_id / new_url`。

2. **應用階段**
   - 在匯入文章時，依 `featured_image` / `gallery_items` 的 URL，查找 mapping。
   - 設定：
     - 該文章的 `featured_image`（WP featured thumbnail）。
     - 若有需要，可把 gallery 寫進 ACF。

### 4.3 Fallback 主圖

- 不在 HTML→JSON 階段處理。
- 在 WP 端提供獨立工具：
  - 例如 `wp ctworld:assign-fallback-featured-images`。
- 對所有「沒有 featured image 的 post」：
  - 依 post_type + external_id 利用 hash 選出固定的一張 fallback 圖。

---

## 5. React 前端（本 repo）的角色

### 5.1 資料來源

- Headless WordPress：REST API / GraphQL。
- 部分 static JSON（例如 build-time 匯入）。

### 5.2 分層建議

- `pages/` / route level：
  - 負責 route 與 data fetching（呼叫 hook / API）。
- `components/`：
  - 純顯示邏輯，僅吃 props，不直接打 API。
- `hooks/`：
  - 包裝 API / data fetching，輸入 external_id / slug / post_type，輸出整理後的 view model。

### 5.3 URL 與 routing

- 預設語言（zh-tw）：

  ```text
  /teaching/{slug}
  /news/{slug}
  /magazine/{slug}
  ```

- 其他語言：

  ```text
  /zh-cn/teaching/{slug}
  /en/teaching/{slug}
  /ja/teaching/{slug}
  ```

- `{slug}` 由 external_id 推導而來，不直接暴露整串 external_id。

---

## 6. 測試與驗證的架構

### 6.1 內容轉換測試

- HTML fixture（舊站部分頁面）：放在 `tests/fixtures/html/`。
- JSON snapshot：放在 `tests/snapshots/`。
- 測試目標：
  - HTML→AnyContent：主要欄位與 meta 是否如預期。
  - zh-tw→zh-cn：文字欄位是否正常轉換，ID/URL 不變。

### 6.2 Importer 測試

- 以小型 JSON fixture 在本機 or 測試 WP 安裝上試匯入。
- 驗證：
  - 輸出的 post 數量。
  - `ct_external_id` 及語言是否正確。
  - Polylang 翻譯關係是否正確。

### 6.3 前端測試

- Component level：snapshot / DOM 測試（例如 React Testing Library）。
- Page level：重要路由的 E2E 測試（可考慮 Playwright / Cypress）。

---

## 7. 與 docs 的關係

本檔案描述的是「**架構藍圖與分層**」。  
實際工作規則與欄位定義，請參照：

- `docs/COMPLETE_PROJECT_WORKFLOW.md`：流程 + 時序。  
- `docs/CONTENT_SCHEMA.md`：欄位與型別。  
- `docs/HTML_TO_MARKDOWN_RULES_V4.md`：HTML→Markdown 規則。  
- `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`：繁→簡規則。

所有程式檔與 Component 的註解，應該儘量標明：

> 「本函式 / 模組實作自哪一份 docs 的哪一節」

以便未來維護與 AI IDE（Windsurf / Cursor）理解上下文。
