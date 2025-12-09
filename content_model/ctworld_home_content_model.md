# ctworld.org 首頁 → Headless CMS 欄位設計（v1）

> 目標：將 https://www.ctworld.org/ 首頁拆解為適合 Headless WordPress + React 的結構欄位，  
> 方便用 ACF / 自訂 Post Type 建立「首頁設定（index_page）」並由前端動態渲染。  
> 說明：本文件只描述「內容欄位與區塊」，實際實作時可依需要調整欄位名稱。

---

## 1. 基本欄位（index_page 基本資訊）

- `post_type`: `index_page`  
- `language`: `zh-TW`  
- `ct_index_key`: `home`  （代表是首頁配置用的 index_page）  
- `old_url`: `https://www.ctworld.org/`  
- `post_title`: `中台世界首頁`  
- `post_excerpt`: 首頁簡短說明（可留空）  
- `body_markdown`: 僅作 debug / 備註說明，不在前端顯示  
- `seo`  
  - `seo.meta_title`  
  - `seo.meta_description`  

> 備註：實際首頁內容不要寫死在 `body_markdown`，而是以「區塊欄位」＋「內容查詢條件」的方式來組成。

---

## 2. 全站層級：語系列／主選單（建議做成 Global 設定）

這些其實是「全站共用」而非只屬於首頁，但因為舊站是寫在首頁 HTML，所以在此列出，實作時建議改成 Global 設定：

### 2.1 語系切換列

- `global.language_switcher.enabled` (bool)
- `global.language_switcher.items[]`（array）
  - `label`：`繁體中文` / `简体中文` / `ENGLISH` / `日本語` / `網站地圖`
  - `language_code`：`zh-TW` / `zh-CN` / `en` / `ja` / `sitemap`
  - `url`：對應語系首頁或 sitemap 連結
  - `is_external` (bool)

### 2.2 主選單（開山祖師 / 中台簡介 / 禪修教育…）

實作上建議用 WordPress 原生 Menu + Polylang，不綁在首頁 post：

- `global.main_menu`：使用 WP Nav Menu（或自訂 JSON）
  - 每個主要選單項：`開山祖師`、`中台簡介`、`禪修教育`、`佛法典藏`、`弘法行履`、`文化藝術`、`教育體系`
  - 子選單：各自對應舊站的子連結（例如「佛典故事」、「中台山月刊」等）

---

## 3. 首頁內容區塊（Sections / Blocks）

以下各小節對應舊首頁從上到下的內容區塊。實作時可用 ACF 的「Flexible Content」或數個固定的 Field Group 來實現。

### 3.1 Hero Banner／首圖輪播

- `hero.enabled` (bool)
- `hero.slides[]`（array）
  - `image`：主圖（Media ID / URL）
  - `alt_text`：圖片說明（例如「中台禪寺榮獲南投縣114年宗教場所低碳認證標章」）
  - `link_url`：點擊後導向的連結（可空）
  - `label`：可選用的文字標籤（例如「中台四箴行」、「七佛通戒偈」）
- `hero.auto_rotate` (bool)
- `hero.rotation_interval` (int, 秒)

---

### 3.2 「最新法訊」區塊

內容：法會／禪七等時間區間＋標題列表。

- `section_latest_dharma.enabled` (bool)
- `section_latest_dharma.title` (string)  
  - 預設：`最新法訊`
- `section_latest_dharma.mode` (enum)  
  - `auto_query`：依條件自動抓取 `news` / `teaching` 類文章  
  - `manual`：手動指定條目
- `section_latest_dharma.max_items` (int)  
- `section_latest_dharma.query`（auto 模式用）
  - `post_type`：例如 `news`
  - `taxonomy` / `meta` 條件：如「分類=法會訊息」
  - `order_by` / `order`
- `section_latest_dharma.items[]`（manual 模式）
  - `label_date_range`：如 `2025/12/31~2026/01/01`
  - `target_post`：關聯到 WordPress 內的文章（post object）
  - `override_title`：若想覆蓋文章標題
  - `badge`：小標籤（如「報名中」、「已圓滿」）

---

### 3.3 「即時報導」區塊

內容：最新一篇或數篇即時報導（含日期、縮圖與摘要）。

- `section_realtime_reports.enabled` (bool)
- `section_realtime_reports.title` (string)  
  - 預設：`即時報導`
- `section_realtime_reports.mode` (enum) `auto_query` / `manual`
- `section_realtime_reports.max_items` (int)
- `section_realtime_reports.query`（auto 模式）
  - `post_type`: `news`
  - `category`: `即時報導`
- `section_realtime_reports.items[]`（manual 模式）
  - `target_post`
  - `display_date`：如 `2025/11/30`
  - `override_title`
  - `override_excerpt`
  - `image`：可覆蓋使用的縮圖（預設使用文章的主圖）

---

### 3.4 「弘法報導」區塊

- `section_dharma_propagation.enabled` (bool)
- `section_dharma_propagation.title` (string)  
  - 預設：`弘法報導`
- `section_dharma_propagation.mode` (enum)
- `section_dharma_propagation.max_items` (int)
- `section_dharma_propagation.query`
  - `post_type`: `news`
  - `category`: `弘法報導`
- `section_dharma_propagation.items[]`
  - `target_post`
  - `display_date`
  - `override_title`
  - `override_excerpt`
  - `image`

---

### 3.5 「中台世界博物館活動訊息」區塊

內容：指向 ctwm.org.tw 等外部連結之展覽／活動資訊。

- `section_museum_events.enabled` (bool)
- `section_museum_events.title` (string)  
  - 預設：`中台世界博物館活動訊息`
- `section_museum_events.items[]`
  - `label_date_range`：如 `2025/09/06~2026/01/03`
  - `title`：例如 `拓印卷軸手作體驗活動`
  - `url`：外部網址（ctwm.org.tw / LINE@ 等）
  - `is_external` (bool)
  - `badge`：可選，例如「常設」、「特展」

---

### 3.6 「惟覺安公老和尚開示」精選段落

內容：首頁顯示一則最新／精選開示標題＋少量內文＋「閱讀全文」。

- `section_master_teaching.enabled` (bool)
- `section_master_teaching.title` (string)  
  - 預設：`惟覺安公老和尚開示`
- `section_master_teaching.mode` (enum)
  - `latest_from_category`：自動抓取指定分類最新一篇
  - `manual`
- `section_master_teaching.source_category`：如 `大乘起信論` 系列
- `section_master_teaching.target_post`（manual 模式）
- `section_master_teaching.override_subtitle`：例如 `大乘起信論（八十三）`
- `section_master_teaching.override_excerpt`：顯示在首頁的一小段文字
- `section_master_teaching.read_more_label`：預設 `(閱讀全文…)`

---

### 3.7 「中台山月刊 XXX 期（電子書）」區塊

- `section_magazine_spotlight.enabled` (bool)
- `section_magazine_spotlight.title` (string)  
  - 例如：`中台山月刊310期 (電子書)`
- `section_magazine_spotlight.issue_ref`：關聯到 `post_type = magazine` 的某一期
- `section_magazine_spotlight.button_label`：如 `各期目錄 (更多)`
- `section_magazine_spotlight.button_link`：指向月刊目錄頁

---

### 3.8 線上影音區塊（「中台實相」／「中台四季」）

#### 3.8.1 「線上影音──中台實相」

- `section_video_reality.enabled` (bool)
- `section_video_reality.title` (string)  
  - 預設：`線上影音--中台實相`
- `section_video_reality.thumbnail`：縮圖
- `section_video_reality.links[]`
  - `label`：`中文` / `ENGLISH` / `日本語`
  - `url`：串流頁面網址（crs.ccdntech.com）
  - `language_code`：`zh-TW` / `en` / `ja`
  - `is_external` (bool)

#### 3.8.2 「線上影音──中台四季」

- `section_video_seasons.enabled` (bool)
- `section_video_seasons.title` (string)  
  - 預設：`線上影音--中台四季`
- `section_video_seasons.thumbnail`
- （如有多語連結，可比照 3.8.1 設計 `links[]`）

---

### 3.9 「精選單元」區塊

由多個「卡片」組成，例如：開示篇章精選、甘露法語精選、遇緣則有師、本期主題下的若干文章等。

#### 3.9.1 精選卡片（上半部：開示篇章／甘露法語／遇緣則有師）

- `section_featured_units.enabled` (bool)
- `section_featured_units.title` (string)  
  - 預設：`精選單元`
- `section_featured_units.cards[]`
  - `image`
  - `title`：例如 `開示篇章精選`
  - `subtitle`：例如 `惟覺安公老和尚 開示篇章`
  - `target_link`：指向對應 index 或專區
  - `target_post_type` / `ct_index_key`：用來讓前端知道要串什麼資料

#### 3.9.2 本期主題 + 4 個精選文章（佛典故事／佛教藝術／健康樂活／健康素食）

- `section_featured_topics.title`：例如 `本期主題`
- `section_featured_topics.items[]`
  - `image`
  - `title`：如 `貪著觸欲的禍害`
  - `category_label`：如 `佛典故事` / `佛教藝術` / `健康樂活` / `健康素食`
  - `target_post`：關聯到 `teaching` / `magazine` / `news` 等文章
  - `badge`：可選（例如 `本期專題`）

---

### 3.10 「本山活動即時報導」區塊

- `section_main_temple_news.enabled` (bool)
- `section_main_temple_news.title` (string)  
  - 預設：`本山活動即時報導`
- `section_main_temple_news.mode` (enum)
- `section_main_temple_news.max_items` (int)
- `section_main_temple_news.query`
  - 例如 `post_type = news` + `taxonomy = 本山活動`
- `section_main_temple_news.items[]`
  - `image`
  - `target_post`
  - `override_title`
- `section_main_temple_news.more_link`：`(更多…)`

---

### 3.11 「精舍分院活動報導」區塊

- `section_branch_news.enabled` (bool)
- `section_branch_news.title` (string)  
  - 預設：`精舍分院活動報導`
- `section_branch_news.mode` / `max_items` / `query`（邏輯同 3.10，只是 taxonomy 變成「分院活動」）
- `section_branch_news.items[]`
  - `image`
  - `target_post`
  - `override_title`

---

### 3.12 「佛學英文電子書」與「英文有聲書」

- `section_english_resources.enabled` (bool)
- `section_english_resources.ebook_link`
  - `label`：`Buddhist e-Books`
  - `url`
- `section_english_resources.audiobook`
  - `title`：`Bodhisattva in a Yellow Robe ─ Accounts of Grand Master Weichueh’s Compassionate Life`
  - `url`：如有線上收聽網址，可另外存；沒有則可留空或填 PDF 下載

---

### 3.13 「公告訊息」區塊

內容：多條公告文字，有些含外部連結（客運資訊）。

- `section_announcements.enabled` (bool)
- `section_announcements.title` (string)  
  - 預設：`公告訊息`
- `section_announcements.items[]`
  - `type` (enum)：`general` / `traffic` / `safety` …
  - `text`：完整公告文字
  - `link_label`：例如客運名稱
  - `link_url`：外部網站（如 ntbus.com.tw）
  - `is_external` (bool)
  - `priority`：用來控制排序／顯示樣式（重要公告可標示為 `high`）

---

### 3.14 「參觀資訊」區塊

內容：一系列導覽／地圖／交通等連結。

- `section_visit_info.enabled` (bool)
- `section_visit_info.title` (string)  
  - 預設：`參觀資訊`
- `section_visit_info.items[]`
  - `label`：例如 `▍線上預約導覽`、`▍參觀須知`、`▍園區導覽圖`…
  - `url`
  - `is_external` (bool)
  - `icon`：可選，前端可用來顯示圖示
  - `target_post`：若連到站內某頁，則可作為補充（與 `url` 擇一即可）

---

### 3.15 「訪客參觀動線介紹」

通常是一張圖＋一個說明連結。

- `section_visit_route.enabled` (bool)
- `section_visit_route.title` (string)  
  - 預設：`訪客參觀動線介紹`
- `section_visit_route.image`
- `section_visit_route.link`
  - `label`：例如 `本寺園區簡介 來寺交通`
  - `url`：詳細說明頁

---

### 3.16 「來寺地圖」

- `section_temple_map.enabled` (bool)
- `section_temple_map.title` (string)  
  - 預設：`來寺地圖`
- `section_temple_map.image`：地圖靜態圖
- `section_temple_map.embed_code`：若未來要嵌入 Google Maps 可用
- `section_temple_map.note`：補充文字說明（可選）

---

### 3.17 「全球分院」

內容：國外分院列表＋分區精舍列表。

- `section_global_branches.enabled` (bool)
- `section_global_branches.title` (string)  
  - 預設：`全球分院`
- `section_global_branches.overseas_items[]`
  - `label`：`美國`、`義大利`、`澳洲`、`日本`、`菲律賓`、`香港`、`泰國`
  - `target_index_link`：連到各國分院索引／介紹
- `section_global_branches.local_regions[]`
  - `label`：`大台北區`、`桃竹苗區`、`台中地區`…
  - `target_index_link`：連到各區分院列表

> 若未來有完整 `branch` post_type，首頁只需存查詢條件（例如依國家 / 區域自動列表）。

---

### 3.18 「全球分院禪修班近期開課」

內容：多筆「城市＋精舍＋日期」。

- `section_branch_classes.enabled` (bool)
- `section_branch_classes.title` (string)  
  - 預設：`全球分院禪修班近期開課`
- `section_branch_classes.mode`：`manual` 為主（資訊變動頻繁）
- `section_branch_classes.items[]`
  - `city`：如 `(台北市)`
  - `branch_label`：如 `普覺精舍`
  - `date_label`：如 `114/12/16`
  - `url`：指向該精舍或課程詳情
  - `is_external` (bool)

---

### 3.19 友站／相關單位連結列

底部幾個 Logo 連到：中台世界博物館、普台中學、普台國小等。

- `section_partner_sites.enabled` (bool)
- `section_partner_sites.items[]`
  - `logo_image`
  - `label`
  - `url`
  - `is_external` (bool)

---

### 3.20 訂閱中台電子報

- `section_newsletter.enabled` (bool)
- `section_newsletter.title`：`訂閱中台電子報`
- `section_newsletter.form_embed_code`：若未來使用外部服務（Mailchimp 等）
- `section_newsletter.description`：可簡要說明或留空

---

## 4. 實作建議摘要

1. **首頁只存「配置」與「精選清單」**  
   - 實際長文內容（開示、報導、月刊文章）都應是獨立的 `teaching` / `news` / `magazine` 文章。  
   - 首頁透過「關聯欄位」或「查詢條件」來決定要顯示哪些文章。

2. **多數列表區塊使用 auto_query + manual override 雙模式**  
   - 一般情況用 `auto_query` 依日期自動抓最新內容。  
   - 若有重要活動要置頂，只要切到 `manual` 模式並指定項目即可。

3. **將語系列／主選單抽離成 Global 設定**  
   - 方便所有頁面共用，也讓未來改版（新增選單項目）不必改首頁內容。

4. **圖片與圖說建議統一走「JSON 欄位」策略**  
   - 不把圖說寫進 `body_markdown`，而是放在各區塊的 `image` / `caption` 欄位，前端可統一樣式呈現。

這份欄位設計可以作為 ACF Field Group 或自訂 JSON Schema 的藍本，  
接下來只要依此實作 WordPress 「首頁設定 index_page」，再由 React 前端依欄位渲染即可。
