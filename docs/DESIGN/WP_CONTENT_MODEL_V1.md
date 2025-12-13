# WP_CONTENT_MODEL_V1

> 版本：V1（最初於 T-0058 建立，T-0061 更新 gallery / wp_content 策略文字）  
> 目的：記錄 AnyContent V1（teaching / news / magazine）對應到 WordPress 的欄位 / ACF / taxonomy 規劃，供 importer 與後台 UI 參考。  
> 範圍：docs-only，未包含實際 PHP/JS 程式；importer / ACF 實作需另開任務。

---

## 1. 基本假設

- 環境：SiteGround 上的 WordPress，預設語系 zh-TW（未開啟多語插件；Polylang/其他方案未定）。  
- Post type（建議）：`ct_teaching`、`ct_news`、`ct_magazine`。  
- 語言儲存：暫以 post meta `language`（zh-tw / zh-cn）；若未來採 taxonomy，需要同步更新 importer 與後台 UI。  
- Taxonomy（暫定）：`ct_magazine_issue`（期別）可作為 taxonomy；其他分類/標籤待後續討論。  
- 匯入策略：以 `external_id + language` 作為唯一鍵；匯入時可選擇 upsert（更新或新增）。

---

## 2. 共用欄位 mapping

| AnyContent | WP 欄位 | 備註 |
| --- | --- | --- |
| `post_title` | `post_title` |  |
| `post_excerpt` | `post_excerpt` |  |
| `slug` | `post_name` |  |
| `language` | post meta `language`（或 taxonomy `ct_language`，未定） | zh-tw / zh-cn |
| `old_url` | post meta `old_url` |  |
| `external_id` | post meta `external_id` | 唯一鍵 |
| `has_unclassified_content` | post meta `has_unclassified_content` | boolean |
| `unclassified_notes` | post meta `unclassified_notes` | string |
| `body_markdown` | **wp_content_html（暫時）** | 目前 dry-run 將 markdown 原文放在計畫檔的 `wp_content_html`；預期 v2 匯入前會先轉 HTML 再寫入 WordPress。 |

---

## 3. 圖片 / gallery / layout 欄位

| AnyContent | WP/ACF 欄位（建議） | 備註 |
| --- | --- | --- |
| `featured_image` | Post Thumbnail（或 ACF `featured_image_url`） | 匯入時可下載並設定縮圖，或先以 URL 暫存。 |
| `featured_image_caption` | ACF `featured_image_caption` |  |
| `gallery_items[]` | ACF Repeater `gallery_items`（`image_url` / `alt` / `caption`） |  |
| `meta.default_gallery_style` | ACF `default_gallery_style`（select） | **目前 A 案：adapter 直接填寫**（teaching=`grid-2`，news/magazine=`grid-3`）；importer 不再做 fallback。若為 null，前端/WP 另行決定需另開 T。 |
| `gallery_blocks[]` | ACF Repeater `gallery_blocks`（block_id / label / style / image_indexes / image_ids / title / description / position_hint） | 目前 importer 建議先照 JSON 搬運；front-end/UI 再做呈現。 |

---

## 4. post_type 專屬欄位（meta）

### 4.1 teaching

| AnyContent | WP/ACF | 備註 |
| --- | --- | --- |
| `ct_speaker_name` | post meta `ct_speaker_name` |  |
| `ct_location` | post meta `ct_location` |  |
| `ct_event_date` | post meta `ct_event_date` | YYYY-MM-DD |
| `ct_sutra_reference` | post meta `ct_sutra_reference` |  |
| `ct_has_dharma_verse` | post meta `ct_has_dharma_verse` | "yes"/"no" |
| `ct_verse_block_markdown` | post meta `ct_verse_block_markdown` |  |
| `ct_verse_type` | post meta `ct_verse_type` |  |
| `ct_verse_lang` | post meta `ct_verse_lang` |  |

### 4.2 news

| AnyContent | WP/ACF | 備註 |
| --- | --- | --- |
| `ct_news_date` | post meta `ct_news_date` |  |
| `ct_event_date_start` | post meta `ct_event_date_start` |  |
| `ct_event_date_end` | post meta `ct_event_date_end` |  |
| `ct_event_date_raw` | post meta `ct_event_date_raw` |  |
| `ct_event_location` | post meta `ct_event_location` |  |
| `ct_event_location_raw` | post meta `ct_event_location_raw` |  |
| `ct_news_category` | taxonomy `ct_news_category`（或 post meta，同步策略未定） |  |
| `ct_has_gallery` | post meta `ct_has_gallery` | "yes"/"no" |

### 4.3 magazine

| AnyContent | WP/ACF | 備註 |
| --- | --- | --- |
| `ct_magazine_level` | post meta `ct_magazine_level` | "issue"/"article" |
| `ct_magazine_issue` | taxonomy `ct_magazine_issue` 或 post meta | 期別；若 taxonomy 未定，可先用 meta。 |
| `ct_magazine_issue_raw` | post meta `ct_magazine_issue_raw` |  |
| `ct_magazine_pub_date` | post meta `ct_magazine_pub_date` | YYYY-MM-DD |
| `ct_magazine_pub_date_raw` | post meta `ct_magazine_pub_date_raw` |  |
| `ct_magazine_issue_no` | post meta `ct_magazine_issue_no` | legacy |
| `ct_magazine_year` | post meta `ct_magazine_year` | optional |
| `ct_magazine_month` | post meta `ct_magazine_month` | optional |
| `ct_magazine_issue_label` | post meta `ct_magazine_issue_label` | optional |
| `ct_issue_items[]` | ACF repeater `ct_issue_items` | 欄位：section / title / has_article / article_external_id / page_no |
| `ct_magazine_section` | post meta `ct_magazine_section` |  |
| `ct_magazine_type` | post meta `ct_magazine_type` |  |
| `ct_author_name` | post meta `ct_author_name` |  |
| `magazine_issue_attachments[]` | ACF Repeater `magazine_issue_attachments`（type / url / pages / is_visible / source / notes） | flipbook / pdf / page_image_set；pages[] 可含 url/width/height；`is_visible` 控管顯示 |

---

## 5. Gallery 預設樣式策略（summary）

- **目前真相（A 案）**：`meta.default_gallery_style` 由 adapter 產出，teaching=`grid-2`，news/magazine=`grid-3`；importer 僅搬運，不做預設補值。  
- **未來變化**：若想改為 importer fallback（B 案）或前端/WP 決定（C 案），需另開 T 並更新本檔。  
- 參考：`docs/PENDING_DECISIONS.md` 中的「Gallery default style fallback 策略」記錄。

---

## 6. wp_content_html / markdown 策略（暫定）

- 目前 dry-run（T-0059）會將 `body_markdown` 原文放入計畫檔的 `wp_content_html`，供審閱。  
- 預期 v2：匯入前先將 markdown 轉為 HTML，再寫入 WordPress（可能透過 remark/markdown-it 等工具）。  
- 若未來改由 WP 插件處理 markdown→HTML，需在 importer 與後台 UI 端同步更新欄位與流程，並開新 T。

---

## 7. 後續建議 T（未實作）

- `T-00xx wordpress-importer-plugin-skeleton`：實作 PHP/Node 端匯入，含 ACF 寫入與 media 處理。  
- `T-00xy wordpress-gallery-admin-ui`：後台 gallery 編輯介面（style / block 選擇、圖片排序）。  
- `T-00xz wordpress-language-filter-and-sync`：後台語言篩選與 zh-tw/zh-cn 同步策略。  
- `T-00xw wordpress-content-html-pipeline`：在匯入前進行 markdown→HTML、處理內嵌圖片/連結。  
- `T-00xv magazine-issue-attachments-and-flipbook`：期刊附件/翻頁檔 mapping 與 UI。  
- `T-00xu gallery-style-fallback-rules`：若要改變 default style 決策層級（importer/WP/front-end），需同步更新 schema + importer + UI。
