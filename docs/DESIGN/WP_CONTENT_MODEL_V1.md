# WP_CONTENT_MODEL_V1

> 任務：T-0058（docs-only）  
> 目的：定義 AnyContent V1（teaching / news / magazine）到 WordPress 的內容模型與欄位 mapping，供未來 importer / ACF / 後台 UI 參考。

---

## 1. 範圍與目標
- 產出一份可直接拿去實作 WordPress importer / ACF 的 mapping 規格（不寫程式）。  
- 重點：post type / taxonomy 建議、meta / ACF 欄位、圖片與 gallery 欄位、未分類內容旗標。
- 不做：實際 PHP/JS 程式、SiteGround 部署、修改現有 WordPress 設定。

## 2. WordPress 端基本假設
- 環境：SiteGround 上的 WordPress（單站，預設語系 zh-TW，未啟用多站）。
- 語言策略（暫定）：同一個 post type 下用 `language` meta 儲存 zh-tw / zh-cn；若未來要分開，可再開對應 post type。
- 建議 post type：
  - `ct_teaching`
  - `ct_news`
  - `ct_magazine`
- 建議 taxonomy：
  - 共用：`ct_language`（若不用 meta 存語言，可改用 taxonomy）
  - magazine 專用：`ct_magazine_issue`（若 issue 要以 taxonomy 呈現）
  - 其他分類（可選）：`ct_topic` / `ct_tag` 視需要增設。

## 3. 共用欄位（AnyContent Base → WordPress）

| AnyContent 欄位 | 型別 | WordPress 對應 | 備註 |
| --- | --- | --- | --- |
| post_title | string | post_title |  |
| post_excerpt | string \| null | post_excerpt |  |
| body_markdown | string | post_content (Markdown/raw) | importer 可考慮轉 HTML，或維持 Markdown 儲存 ACF。 |
| slug | string | post_name |  |
| language | enum | post meta: `language`（或 taxonomy `ct_language`） | zh-tw / zh-cn |
| old_url | string | post meta: `old_url` | 舊站 URL |
| external_id | string | post meta: `external_id` | 匯入用唯一鍵 |
| has_unclassified_content | boolean | post meta: `has_unclassified_content` | |
| unclassified_notes | string \| null | post meta: `unclassified_notes` | |

## 4. 圖片 / gallery / layout 欄位

| AnyContent 欄位 | 型別 | WordPress 對應 | 備註 |
| --- | --- | --- | --- |
| featured_image | string \| null | Featured Image (post thumbnail) 或 ACF `featured_image_url` | 建議匯入時下載/對應到 media library，設定 post thumbnail。 |
| featured_image_caption | string \| null | ACF `featured_image_caption` |  |
| gallery_items[] | array | ACF Repeater `gallery_items` | 欄位：`image_url`（或 attachment id）、`alt`、`caption` |
| meta.default_gallery_style | string \| null | ACF `default_gallery_style` (select) | 預設：teaching = grid-2；news/mag = grid-3；可再補 masonry/slider。 |
| gallery_blocks[] | array | ACF Repeater `gallery_blocks` | 欄位：`block_id`、`label`、`style`、`image_indexes` (array/int[])、`image_ids` (array/string[])、`title`、`description`、`position_hint` |

> Gallery 建議：  
> - importer 先以 `gallery_items` 為主；`gallery_blocks` 用來記錄分組/樣式提示。  
> - 若無 `gallery_blocks`，可由 importer 自動建一個 `main_gallery` block 覆蓋全部 items。  
> - default_gallery_style 可在前端/WP 後台預設呈現樣式。

## 5. teaching / news / magazine 專屬欄位

### 5.1 teaching
| AnyContent 欄位 | 型別 | WP 對應 | 備註 |
| --- | --- | --- | --- |
| meta.ct_speaker_name | string \| null | post meta `ct_speaker_name` | |
| meta.ct_location | string \| null | post meta `ct_location` | |
| meta.ct_event_date | string \| null | post meta `ct_event_date` | YYYY-MM-DD |
| meta.ct_sutra_reference | string \| null | post meta `ct_sutra_reference` | |
| meta.ct_has_dharma_verse | enum | post meta `ct_has_dharma_verse` | "yes"/"no" |
| meta.ct_verse_block_markdown | string \| null | post meta `ct_verse_block_markdown` | |
| meta.ct_verse_type | string \| null | post meta `ct_verse_type` | |
| meta.ct_verse_lang | enum \| null | post meta `ct_verse_lang` | |

### 5.2 news
| AnyContent 欄位 | 型別 | WP 對應 | 備註 |
| --- | --- | --- | --- |
| meta.ct_news_date | string \| null | post meta `ct_news_date` | |
| meta.ct_event_date_start | string \| null | post meta `ct_event_date_start` | |
| meta.ct_event_date_end | string \| null | post meta `ct_event_date_end` | |
| meta.ct_event_date_raw | string \| null | post meta `ct_event_date_raw` | |
| meta.ct_event_location | string \| null | post meta `ct_event_location` | |
| meta.ct_event_location_raw | string \| null | post meta `ct_event_location_raw` | |
| meta.ct_news_category | string \| null | taxonomy `ct_news_category` 或 post meta `ct_news_category` | 視後台需要，可用 taxonomy。 |
| meta.ct_has_gallery | enum \| null | post meta `ct_has_gallery` | "yes"/"no" |

### 5.3 magazine
| AnyContent 欄位 | 型別 | WP 對應 | 備註 |
| --- | --- | --- | --- |
| meta.ct_magazine_level | enum | post meta `ct_magazine_level` | "issue"/"article" |
| meta.ct_magazine_issue | string \| null | taxonomy `ct_magazine_issue` 或 post meta `ct_magazine_issue` | 建議 issue 用 taxonomy；若僅單一期可用 meta。 |
| meta.ct_magazine_issue_raw | string \| null | post meta `ct_magazine_issue_raw` | |
| meta.ct_magazine_pub_date | string \| null | post meta `ct_magazine_pub_date` | YYYY-MM-DD |
| meta.ct_magazine_pub_date_raw | string \| null | post meta `ct_magazine_pub_date_raw` | |
| meta.ct_magazine_issue_no | string \| null | post meta `ct_magazine_issue_no` | legacy 欄位（可留空） |
| meta.ct_magazine_year | number \| null | post meta `ct_magazine_year` | 可留空 |
| meta.ct_magazine_month | number \| null | post meta `ct_magazine_month` | 可留空 |
| meta.ct_magazine_issue_label | string \| null | post meta `ct_magazine_issue_label` | 可留空 |
| meta.ct_issue_items | object[] \| undefined | ACF repeater `ct_issue_items` | 欄位：section/title/has_article/article_external_id/page_no |
| meta.ct_magazine_section | string \| null | post meta `ct_magazine_section` | |
| meta.ct_magazine_type | string \| null | post meta `ct_magazine_type` | |
| meta.ct_author_name | string \| null | post meta `ct_author_name` | |

## 6. importer / 後台 UI 的注意事項（建議）
- Importer 輸入：AnyContent JSON 檔或資料夾；需支援 zh-tw / zh-cn，並以 `external_id + language` 判定更新/新增。  
- 圖片策略：可選擇僅存 URL，或下載到 media library 後以 attachment ID 寫入 ACF；前者快、後者穩。  
- 後台 gallery UI：建議 ACF Repeater + select（style）；gallery_blocks 的 image_indexes 可用文字/JSON 欄位呈現，或用多選勾選 items。  
- 未分類內容：後台顯示 `has_unclassified_content` checkbox 與 notes，方便人工補齊。  
- 語言切換：若 zh-tw / zh-cn 共用同一 post type，建議後台 filter：language = zh-tw / zh-cn。

## 7. 建議後續 T（不在本次實作）
- `T-00xx wordpress-importer-plugin-skeleton`：實作匯入 JSON 的 WP plugin（含 ACF 寫入）。  
- `T-00xy wordpress-gallery-admin-ui`：後台 gallery 編輯介面（style 選擇、block 重排）。  
- `T-00xz magazine-issue-attachments-and-flipbook-mapping`：雜誌期別 / PDF / flipbook mapping 與 UI。  
- `T-00xw wordpress-language-filter-and-sync`：WP 後台語言 filter、zh-tw/zh-cn 同步策略。
