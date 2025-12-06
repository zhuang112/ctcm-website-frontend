# HTML_TO_MARKDOWN_RULES_V4.md

> 中台世界舊站 → JSON vNext 的 HTML→Markdown 轉換規格  
> 本版規格對齊：`COMPLETE_PROJECT_WORKFLOW.md (vNext)` 與 `CONTENT_SCHEMA.md (vNext)`

---

## 0. 目標與輸入輸出

### 0.1 目標

- 將舊站 HTML 轉成：
  - **結構化 JSON**：符合 `AnyContent` 型別（見 `CONTENT_SCHEMA.md`）
  - 其中的 `body_markdown`：可閱讀的 Markdown 正文
- 遵守兩個核心原則：
  1. **Markdown = 給人看的正文**  
     - 導覽、側欄、表單、index 列表、閱讀感言等，一律不進 Markdown。
  2. **結構化資訊 = 給系統的 meta**  
     - 圖片、圖說、偈語、月刊期別、食譜等放在 `meta` / `featured_image` / `gallery_items` 等欄位。

### 0.2 輸入 / 輸出介面（建議）

在 Node/TypeScript 中，大致會有：

```ts
import { AnyContent } from '../types/CONTENT_SCHEMA';

export interface HtmlToMarkdownOptions {
  url: string;          // 原始 HTML URL（繁體版 base_url）
  html: string;         // 完整 HTML 原文
}

export function htmlToContentJson(
  options: HtmlToMarkdownOptions
): AnyContent {
  // 1. parse DOM
  // 2. classify post_type & collection
  // 3. extract main content container
  // 4. apply rules by post_type
  // 5. build AnyContent
}
```

- DOM 解析建議使用 Cheerio（或等價的 server-side HTML parser）。

---

## 1. 全域清理規則（所有 post_type 共用）

### 1.1 移除不要的節點

以下節點一律從 DOM 中移除，不參與 Markdown 生成：

- `<script>`, `<style>`, `<noscript>`
- `<form>` 與其子節點（閱讀感言、聯絡表單、搜尋表單等）
- 明顯的導覽 / header / footer / sidebar 區塊：
  - 例如帶有 `nav`, `menu`, `footer` class/id 的 `<table>`, `<div>`
- 頁尾版權、聯絡資訊區塊：
  - 若出現在固定位置（例如頁尾 table最後一格，且包含「Copyright」等字詞），可直接移除。
- 全站 sitemap 區塊：
  - 多為多欄表格式連結列表，非該頁主體內容。

實作建議：建立一組「刪除 CSS selector＋關鍵字」規則表。

### 1.2 Table layout 處理

舊站大量使用 `<table>` 做版面，必須區分：

- **純版面 table** → 內層內容 unwrap：
  - 特徵：
    - 單欄或少欄，主要由 `<font>`, `<p>`, `<br>` 等構成
    - 沒有表格標題、欄位名稱，常用來置中段落文字
  - 處理：
    - 移除 `<table>`, `<tbody>`, `<tr>`, `<td>` 等，保留內層文字與行內元素。
- **真正的表格資料** → 轉 Markdown table 或保持最簡 HTML：
  - 特徵：
    - 有明確欄位（如「日期」「地點」「活動名稱」等）
    - 行列數明顯 > 1xN 的純排版
  - 預設：
    - 若屬於「索引 / 目錄」而非本文，通常最後會當 `index_page`，不進正文。
    - 若確實是內容的一部分（少數情況），可以轉成 Markdown table 或保留 `<table>` 作為 HTML 片段。

### 1.3 行內元素與空白

- `<b>`, `<strong>` → `**粗體**`
- `<i>`, `<em>` → `*斜體*`
- `<u>` → 去除標籤，保留文字（視需要可 mapping 成粗體或保持純文字）。
- `<sup>`, `<sub>`：少見，可暫時保留為 HTML（例如 `H<sub>2</sub>O`）。
- HTML entity 全部 decode 為正常文字（例如 `&nbsp;` → 空白）。
- 連續空白縮成單一空白，連續空行縮為最多 2 行。

---

## 2. 區塊元素 → Markdown

### 2.1 標題

- 第一個 `<h1>` → 通常對應 `post_title`，而非正文中的 `#`。
  - 規則：
    - 若頁面明顯有 `<title>` 或頂部大型標題，使用該標題作為 `post_title`，不再在 `body_markdown` 重複。
- 後續 `<h2>`, `<h3>` → 轉成 Markdown 標題：
  - `<h2>` → `##`
  - `<h3>` → `###`
  - 更深層級同理，但盡量不超過 `####`。

### 2.2 段落與換行

- `<p>` → 一段 Markdown 段落。
- `<br>`：
  - 連續 `<br><br>` → 段落分隔。
  - 單一 `<br>` 通常視為段內換行（例如偈語 / 詩句），但在 V4 中多數偈語會收進 meta。

### 2.3 列表

- `<ul>` → `-` 無序列表。
- `<ol>` → `1.`, `2.` 有序列表。
- 多層巢狀列表保留縮排（兩個空白）。

### 2.4 引言 / 偈語（基礎處理）

- `<blockquote>` → Markdown `>` 區塊。
- 偈語 / 詩句若已決定抽到 meta（見 teaching 一節），在 `body_markdown` 中可只保留一段提示文字（或乾脆移除），由前端決定是否獨立呈現。

### 2.5 程式碼 / 預格式文字（少見）

- `<pre>` → 保留為 Markdown code block（\`\`\`）。
- `<code>` → inline code。

---

## 3. 連結處理

### 3.1 文本連結

- 一般 `<a href="...">文字</a>` → `[文字](URL)`。
- 若 `href` 與文字相同且為長 URL，可視情況：
  - 保留為 `<https://...>` 或 `[連結](URL)`。

### 3.2 相對 / 絕對網址

- 抓取階段即應取得完整 URL（以 base URL 補齊相對路徑）。
- 放進 Markdown 時可以先保留舊網址，後續由 redirect / 新網址生成處理。

### 3.3 特殊連結

- 圖片連結（`<a><img></a>`）中的 `<a>`：
  - 不轉 Markdown 超連結，因為圖片本身以 JSON meta 表示。
- `mailto:`、`tel:`：
  - 可轉成純文字（例如 `info@ctworld.org`）或保留簡單連結。

---

## 4. 圖片與圖說規則（所有 post_type 共用）

> 核心原則：**圖說只存在 JSON，不進 Markdown**。  
> Markdown 只專注文字閱讀體驗。

### 4.1 圖片來源

- 所有 `<img>` 均需解析：
  - `src`：圖片 URL（先記舊網址）
  - `alt`：若有，填入 `GalleryItem.alt`
  - 圖片附近文字：用於猜測 caption（下節說明）

### 4.2 caption 判斷邏輯（示意）

圖說常見形態：

- 圖片下方緊接一行短文字（`<p>`, `<font>`, `<span>`），可能含括號 / 頭尾標點。
- 行內包含「（圖」、「攝影：」、「Photo by」等。

判斷流程（可實作成 helper 函式）：

1. 對每個 `<img>` 節點，找「同一層 `<td>` / `<div>` 的下一個兄弟節點」。  
2. 若該節點：
   - 文字長度明顯短於正文段落（例如 < 60 字），且
   - 無其他強烈正文特徵（很多句號、長段落），
   - 則視為 caption 候選。
3. caption 文字：
   - 清理多餘空白 / HTML 標籤。
   - 不寫入 Markdown，只寫入 JSON caption 欄位。

### 4.3 featured_image 與 gallery_items

- 第一張出現的圖片 → `featured_image`：
  - URL → `featured_image`
  - caption（若有）→ `featured_image_caption`
- 第二張之後的圖片 → `gallery_items[]`：

```jsonc
"gallery_items": [
  {
    "url": "https://www.ctworld.org.tw/arts/xxx/01.jpg",
    "alt": "供佛儀軌",
    "caption": "供佛儀軌時，僧眾靜默安住。"
  }
]
```

- 正文 `body_markdown` 內預設不輸出 `![]()` 圖片語法，除非未來有特例需要 inline 圖（目前不考慮）。

---

## 5. 各 post_type 特殊規則

### 5.1 teaching

#### 5.1.1 偵測主內容區

- 根據 URL 與 DOM 結構，常見 pattern：
  - 中央主欄 `<td>` 或 `<div>`，寬度較大，其內文字密度遠高於兩側。
  - 內含標題、日期、內文段落。
- 可以用「文字數 / DOM 深度」等簡易 heuristic 判斷最高密度區塊作為 main container。

#### 5.1.2 偈語 / 法語處理

很多 teaching 頁有一段或多段偈語 / 雙語法語：

- 常見形態：
  - 置中、每句一行，由 `<br>` 分行；
  - 或放在單獨 `<table>` 中。
- V4 規則：
  - **盡量抽成一塊 `meta.ct_verse_block_markdown`**，用 Markdown 表示：

    ```md
    > 金蛇巧步綻春暉……  
    > The golden Snake steps gracefully...
    ```

  - 在 `meta` 記錄：
    - `ct_has_dharma_verse = "yes"`
    - `ct_verse_type`（起七法語 / 解七法語 / 法會偈語 / …）
    - `ct_verse_lang`（zh-TW / en / bilingual）
  - 在 `body_markdown` 中可以：
    - 完全移除偈語內容，或
    - 僅保留一段說明文字：「（本頁含偈語，詳見頁面上方偈語區塊）」  
    （由實作時決定，建議預設移除，讓偈語完全由 meta 主導。）

#### 5.1.3 一般正文

- 主體內文按標題 / 段落規則轉成 Markdown。
- 若某段文字顯然是「版權宣告」或「編按」且放在頁尾，可視情況：
  - 保留（避免資訊遺失），
  - 或挪到 `meta`（例如 `ct_editor_note`）。

---

### 5.2 news

#### 5.2.1 日期與地點

- 頁面開頭常有活動日期 / 地點資訊：
  - 例如「2023.03.16~03.18 中台禪寺」。
- 規則：
  - 使用 regex 抽出：
    - 若為單一日期 → `ct_news_date`
    - 若為日期區間 → `ct_event_date_start`, `ct_event_date_end`, `ct_event_date_raw`
  - 地點 → `ct_event_location`

#### 5.2.2 本文

- 轉 Markdown 段落、標題。
- 圖片 / 圖說按全域規則處理。

---

### 5.3 magazine（issue + article）

#### 5.3.1 issue 頁（整期目錄）

- 來源：例如 `monthly/201/index.htm`。
- 目標：
  - `post_type = "magazine"`
  - `meta.ct_magazine_level = "issue"`
- 轉換：
  - 整期目錄文字（簡介、期別資訊）→ `body_markdown`：
    - 清理 table / font 等版面標籤。
  - 目錄列出每篇文章（欄名 / 標題 / 是否有連結）：
    - 解析為 `meta.ct_issue_items[]`：

    ```jsonc
    "ct_issue_items": [
      {
        "section": "本期主題",
        "title": "無畏自在——從《心經》看放下執著",
        "has_article": true,
        "article_external_id": "magazine_201_main_01",
        "page_no": "4"
      }
    ]
    ```

  - 若某項目沒有連結（只有標題），則：
    - `has_article = false`
    - `article_external_id` 不填，但依然保存在 issue 的項目中。

#### 5.3.2 article 頁（單篇文章）

- 來源：`monthly/{issue}/article*.htm`。
- 目標：
  - `post_type = "magazine"`
  - `meta.ct_magazine_level = "article"`
- 轉換：
  - 正文 → `body_markdown`。
  - 標題、作者、欄名等 → 相對應 meta：
    - `ct_magazine_issue_no`
    - `ct_magazine_section`
    - `ct_author_name`

---

### 5.4 branch

- 解析頁面中關於精舍的實體資訊：
  - 地址、電話、Email → `ct_branch_address`, `ct_branch_phone`, `ct_branch_email`
  - 交通資訊 → `ct_branch_traffic_note`
  - 開放時間 → `ct_branch_opening_hours`
- 歷史沿革、道場特色等長文 → `body_markdown`。

---

### 5.5 gallery

- 主體是圖片：
  - 圖片全數寫入 `gallery_items[]`，搭配 `featured_image`。
- 文字說明：
  - 活動簡介、日期、地點 → `meta.ct_gallery_date`, `ct_gallery_location`, `ct_gallery_event_name`
  - 其他敘述 → `body_markdown`。

---

### 5.6 resource

#### 5.6.1 e-Books

- 通常列表式呈現：
  - 書名、類別（經典 / 教本 / 開示 / 傳記）、語言、檔案連結。
- 轉換：
  - 若是「單一書籍介紹頁」：
    - 書籍簡介文字 → `body_markdown`。
  - 檔案連結 → `meta.ct_ebook_files[]`：
    - 先以舊網址填入，檔案搬運後改為新網址。

#### 5.6.2 健康素食食譜

- 偵測「材料」「作法」等小標題：
  - 「材料」以下第一個列表 / 連續段落 → `ct_recipe_ingredients_markdown`
  - 「作法」以下第一個列表 / 連續段落 → `ct_recipe_steps_markdown`
- 其他敘述（前言、營養說明、備註） → `body_markdown`。

---

### 5.7 download（桌布）

- 一個桌布代碼（例如 `N20210110072`）對應多個解析度下載連結。
- 轉換：
  - 標題、簡短說明 → `body_markdown`。
  - 解析所有 `<a href="...">` 檔案連結：
    - `href` → URL
    - 顯示文字 / 周邊文字 → 解析度 label（如 "1920x1080"）
  - 寫入 `meta.ct_wallpaper_code`, `meta.ct_wallpaper_files[]`：

```jsonc
"meta": {
  "ct_download_type": "wallpaper",
  "ct_wallpaper_code": "N20210110072",
  "ct_wallpaper_files": [
    { "url": "https://www.ctworld.org.tw/arts/desktop/N20210110072_1920x1080.jpg", "label": "1920x1080" },
    { "url": "https://www.ctworld.org.tw/arts/desktop/N20210110072_1024x768.jpg", "label": "1024x768" }
  ]
}
```

---

### 5.8 index_page

- 對於各式索引 / 年表頁（sutra_stories index, chan_koans index, dialogue 年度列表, monthly index, 108 總表等）：
  - 新系統不直接用其表格作為前端內容來源。
- 轉換：
  - `post_type = "index_page"`
  - `body_markdown` 僅包含：
    - 一個標題
    - 一段 debug 說明，例如：

    ```md
    # [DEBUG] sutra_stories index

    此頁為舊站佛典故事索引頁，不作為前端正式內容來源，僅供除錯與比對用。
    ```

  - `meta.ct_index_key`, `meta.ct_index_year` 等填入對應值。

---

## 6. 實作備註與測試策略

### 6.1 分層架構建議

- `classify-url.ts`：決定 post_type + collection key。
- `extract-main-content.ts`：根據 DOM + heuristics 找出主內容 container。
- `html-to-markdown-core.ts`：全域清理與 HTML→Markdown 的 mapping。
- `post-type-adapters/`：
  - `teaching-adapter.ts`
  - `news-adapter.ts`
  - `magazine-issue-adapter.ts`
  - `magazine-article-adapter.ts`
  - `branch-adapter.ts`
  - `gallery-adapter.ts`
  - `resource-adapter.ts`
  - `download-adapter.ts`
  - `index-page-adapter.ts`

### 6.2 測試樣本

至少為每個 post_type 準備多個測試 HTML 樣本：

- teaching：
  - 一般開示
  - 含雙語偈語
  - 佛典故事 / 禪門公案
- news：
  - 中台事記（有日期區間）
  - 博物館活動報導
- magazine：
  - 一個 issue + 其部分 article
- branch：
  - 中台禪寺本院 + 其中一間海外精舍
- gallery：
  - 活動相簿
- resource：
  - 一個 e-Book 頁面
  - 一個素食食譜
- download：
  - 含多解析度的桌布頁
- index_page：
  - sutra_stories index
  - dialogue 年度列表

每個樣本都應有預期輸出 JSON（snapshot），用 Jest / Vitest 等做 regression test。

---

（本檔為 HTML→Markdown 規則 v4 草案，未來如有新增欄位或 post_type，請先更新本檔與 `CONTENT_SCHEMA.md`，再更新實作程式。）
