# AnyContent Schema V1 Draft

> 版本：V1 draft（T-0031，2025-12-12）  
> 適用：teaching / news / magazine 的 AnyContent JSON（含 zh-TW / zh-CN）

## 1. 共用結構（Base）

- `post_type`：`"teaching" | "news" | "magazine"`（必填，用於判斷後續欄位）
- `language`：`"zh-tw" | "zh-cn" | "en" | "ja"`（本專案主要用 zh-tw / zh-cn）
- `external_id`：string（建議必填，跨系統唯一鍵）
- `slug`：string（建議，對應未來新站 / WordPress slug）
- `old_url`：string（建議，記錄舊站 URL，方便對照與工具使用）
- `post_title`：string（必填）
- `post_excerpt`：string | null（選填摘要）
- `body_markdown`：string（必填，主內容 Markdown）
- `featured_image`：string | null；`featured_image_caption`：string | null（選填）
- `gallery_items`：Array<{ url: string; alt?: string | null; caption?: string | null }>（可為空陣列）
- `meta`：各 post_type 專用欄位（見下方）

## 2. teaching（TeachingContent）

- 主要欄位：同共用結構。
- `meta`（TeachingMeta）：
  - `ct_speaker_name`: string | null
  - `ct_location`: string | null
  - `ct_event_date`: string | null（日期字串）
  - `ct_sutra_reference`: string | null
  - 偈語相關：
    - `ct_has_dharma_verse`: `"yes" | "no"`
    - `ct_verse_block_markdown`: string | null
    - `ct_verse_type`: string | null
    - `ct_verse_lang`: `"zh-tw" | "zh-cn" | "en" | "ja" | "bilingual" | null`

## 3. news (NewsContent)

- 主要欄位：同共用結構。
- `meta`（NewsMeta）：
  - `ct_news_date`: string | null（新聞日期，YYYY-MM-DD）
  - `ct_event_date_start`: string | null
  - `ct_event_date_end`: string | null
  - `ct_event_date_raw`: string | null
  - `ct_event_location`: string | null
  - `ct_news_category`: string | null

## 4. magazine (MagazineContent)

- 主要欄位：同共用結構。
- `meta`（MagazineMeta）：
  - `ct_magazine_level`: `"issue" | "article"`（標示為整期或單篇）
  - 期別欄位：
    - `ct_magazine_issue_no`: string | null
    - `ct_magazine_year`: number | null
    - `ct_magazine_month`: number | null
    - `ct_magazine_issue_label`: string | null（如「第 15 期」）
  - `ct_issue_items`: IssueItem[]（issue 專用，收錄篇目）
    - `section`: string | null
    - `title`: string
    - `has_article`: boolean
    - `article_external_id`: string | null
    - `page_no`: string | null
  - 單篇欄位（article 專用）：
    - `ct_magazine_section`: string | null
    - `ct_magazine_type`: string | null
    - `ct_author_name`: string | null

## 5. zh-TW / zh-CN 轉換注意事項（pipeline）

- 轉換（OpenCC/等效）：標題、摘要、`body_markdown` 以及主要中文 meta 欄位需繁→簡。
- 不轉換：`external_id`、`slug`、`old_url`、日期數字欄位、枚舉類型（post_type、language）。
- zh-CN 輸出需標記 `language: "zh-cn"`，其餘結構與 zh-TW 保持一致。

## 6. 可能的後續擴充（暫不實作）

- magazine 文章級封面、標籤等欄位。
- news 類別/作者等進階欄位。
- teaching 章節/系列索引欄位。
- 若未來新增，建議以 version/migration 方式處理，避免破壞既有 JSON。

## 7. 版本與後續調整

- 本文件為 AnyContent Schema V1 draft，提供目前 V1 JSON 的欄位基準。
- 若需破壞性調整（新增必填欄、改型別等），建議：
  - 另開 T 任務，並討論是否引入 `schema_version` 與 migration 流程。
  - 在 notes 中記錄影響範圍與升級步驟。
