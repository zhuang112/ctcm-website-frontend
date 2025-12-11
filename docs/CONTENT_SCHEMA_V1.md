# AnyContent Schema V1 Draft

> 版本：V1 draft（T-0031，2025-12-12）  
> 適用：teaching / news / magazine 的 AnyContent JSON（含 zh-TW / zh-CN）

## 1. 共用結構（Base）

- `post_type`: `"teaching" | "news" | "magazine"`（必填）
- `language`: `"zh-tw" | "zh-cn" | "en" | "ja"`（目前主要用 zh-tw / zh-cn）
- `external_id`: string（建議必填，跨系統唯一鍵；現有 sample JSON 多未填，保留為可用欄位）
- `slug`: string（建議；對應未來新站/WordPress slug）
- `old_url`: string（建議；記錄舊站 URL，方便比對與工具使用）
- `post_title`: string（必填）
- `post_excerpt`: string | null（摘要，可為 null）
- `body_markdown`: string（必填，主內容 Markdown）
- `featured_image`: string | null（封面圖 URL；通常取正文第一張圖或專用封面區塊）
- `featured_image_caption`: string | null（封面圖圖說；優先取 `alt` 或鄰近圖說，缺乏來源則為 null）
- `gallery_items`: Array<{ url: string; alt?: string | null; caption?: string | null }>（多圖 gallery；目前 sample 多為空或僅含 url/alt，caption 可為 null）
- `meta`: 各 post_type 專用欄位（下方詳述）
- `meta.has_unclassified_content`: boolean（預設 false；若該 JSON 仍含大量未分類內容可設為 true）
- `meta.unclassified_notes`: string | null（選填，簡述「哪些段落暫時留在 body_markdown」）
- 未知或暫無欄位的內容：先留在 `body_markdown`；除非確定常見且需要欄位，暫勿自行新增 meta key（等待後續任務評估 schema）。
- 其他暫未使用欄位（seo、multilingual 等）可留白，視未來需要另行定義。

## 2. teaching（TeachingContent）

對應 TypeScript：`src/types/anycontent-teaching.ts`

- 主要欄位：同共用結構。
- `meta`（TeachingMeta，現有 sample 已使用）：
  - `ct_speaker_name`: string | null
  - `ct_location`: string | null
  - `ct_event_date`: string | null
  - `ct_sutra_reference`: string | null
  - 偈語相關：
    - `ct_has_dharma_verse`: `"yes" | "no"`
    - `ct_verse_block_markdown`: string | null
    - `ct_verse_type`: string | null
    - `ct_verse_lang`: `"zh-tw" | "zh-cn" | "en" | "ja" | "bilingual" | null`
- 目前 sample JSON 皆使用上述欄位；若未來新增教學分類等欄位，需另開版本任務。

## 3. news (NewsContent)

對應 TypeScript：`src/types/anycontent-news.ts`

- 主要欄位：同共用結構。
- `meta`（NewsMeta，現有 sample 已使用）：
  - `ct_news_date`: string | null（新聞日期，YYYY-MM-DD）
  - `ct_event_date_start`: string | null
  - `ct_event_date_end`: string | null
  - `ct_event_date_raw`: string | null
  - `ct_event_location`: string | null
  - `ct_news_category`: string | null
- 目前 sample 聚焦日期/地點/分類；若未來需要作者、tag 等，請另開任務。

## 4. magazine (MagazineContent)

對應 TypeScript：`src/types/anycontent-magazine.ts`

- 主要欄位：同共用結構。
- `meta`（MagazineMeta，現有 sample 使用期別/出刊日欄位）：
  - `ct_magazine_level`: `"issue" | "article"`（標示整期或單篇）
  - 期別／出版日期（v1）：
    - `ct_magazine_issue`: string | null（標準化期別，例如 "15"）
    - `ct_magazine_issue_raw`: string | null（原始期別字串，例如「第 15 期」）
    - `ct_magazine_pub_date`: string | null（YYYY-MM-DD，若無法正規化可為 null）
    - `ct_magazine_pub_date_raw`: string | null（原始日期字串）
    - legacy/補充欄位：`ct_magazine_issue_no`、`ct_magazine_year`、`ct_magazine_month`、`ct_magazine_issue_label`（若既有資料使用可保留）
    - `ct_issue_items`: IssueItem[]（issue 專用：section/title/has_article/article_external_id/page_no）
  - 單篇：
    - `ct_magazine_section`: string | null
    - `ct_magazine_type`: string | null
    - `ct_author_name`: string | null
- 目前 sample-001 只使用 issue/出刊日相關欄位；其他欄位可視未來需要再補。

## 5. zh-TW / zh-CN 轉換注意事項（pipeline）

- 內容等同、欄位結構相同，差異在：
  - `language`: zh-tw vs zh-cn。
  - 需繁→簡的欄位：`post_title`、`post_excerpt`（若有）、`body_markdown`、以及主要中文 meta 欄位（如 news 日期地點文字、magazine 期別標籤等）。
  - 圖片 URL 欄位（featured_image、gallery_items.url）不需繁簡轉換；文字欄位（caption）若有內容，需在 pipeline 中轉換。
  - 不轉換：`post_type`、`slug`、`external_id`、`old_url`、日期數字欄位、布林/enum。
- 若 pipeline 尚未轉換某 meta 欄位，請於後續任務補齊並更新本文件。

## 6. 可能的後續擴充（暫不實作）

- gallery 更完整欄位（排序、類型等）。
- seo（title/description/og:image 等）。
- multilingual（跨語系對應表）。
- magazine 單篇的封面/分類/標籤。
- news 作者/tag。
- 未來如需新增，建議以 version/migration 方式處理，避免破壞既有 JSON。

## 7. 版本與後續調整

- 本文件為 AnyContent Schema V1 draft，基於現有 TypeScript 與 sample JSON 彙整。
- 若需破壞性調整（新增必填欄、改型別等），建議：
  - 另開 T 任務，評估是否引入 `schema_version` 與 migration 流程。
  - 在 notes 記錄影響範圍、升級步驟，並同步更新 sample。
