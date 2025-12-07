# ZH_TW_TO_ZH_CN_PIPELINE.md (vNext, language + ID updates)

> 中台世界舊站 → JSON vNext 的繁體（zh-tw）→ 簡體（zh-cn）轉換規格  
> 本版更新：使用小寫語言碼、external_id 不再加語言後綴，與多語 / Polylang 的關係。

---

## 0. 目標與邊界

- 輸入：符合 `AnyContent` 的 zh-tw JSON。  
- 輸出：對應的 zh-cn JSON：
  - `language = 'zh-cn'`
  - `external_id` 與 zh-tw 版本相同。
  - 指定欄位的中文字串做繁→簡轉換。
- 不在此階段處理：
  - HTML→Markdown（已在 HTML 轉換完成）。
  - 圖片 fallback（在匯入 / 後處理）。

---

## 1. 輸入與輸出格式

### 1.1 輸入（zh-tw）

- 檔名示意：

  ```text
  data/zh-tw/{post_type}/{external_id}.zh-tw.json
  ```

- 必備欄位：
  - `external_id: string`
  - `language: 'zh-tw'`
  - `post_type: PostType`
  - `post_title: string`
  - `body_markdown: string`
  - 其他 meta / 圖片欄位依 schema。

### 1.2 輸出（zh-cn）

- 檔名示意：

  ```text
  data/zh-cn/{post_type}/{external_id}.zh-cn.json
  ```

- 欄位：
  - `external_id`：**與輸入 zh-tw 完全相同**。
  - `language: 'zh-cn'`
  - `post_type`：與 zh-tw 相同。
  - `old_url`：優先使用 `-gb` 舊網址（若存在）。
  - 其他欄位與 zh-tw 版結構相同，只有中文字串內容轉為簡體。

> 註：多語關聯時，以 `external_id` 作為 group key，各語言共用。

---

## 2. 欄位轉換範圍

### 2.1 需要繁→簡的欄位（文字內容）

- 頂層：
  - `post_title`
  - `post_excerpt`
  - `body_markdown`
- `meta` 中的中文描述欄位（視實際 schema）：
  - `ct_speaker_name`
  - `ct_location`
  - `ct_sutra_reference`
  - `ct_teaching_category`
  - `ct_verse_block_markdown`
  - `ct_event_location`
  - `ct_news_category`
  - `ct_branch_address`
  - `ct_branch_city`
  - `ct_branch_region`
  - `ct_branch_opening_hours`
  - `ct_branch_traffic_note`
  - `ct_gallery_location`
  - `ct_gallery_event_name`
  - `ct_resource_category`
  - `ct_recipe_ingredients_markdown`
  - `ct_recipe_steps_markdown`
  - `ct_recipe_total_time`
  - `ct_index_notes`
  - `ct_magazine_issue_label`
  - `ct_magazine_section`
  - `ct_magazine_type`
  - `ct_author_name`
  - `ct_issue_items[].section`
  - `ct_issue_items[].title`
  - 其他未來新增的中文描述欄位，原則相同。
- `seo`：
  - `seo.meta_title`
  - `seo.meta_description`
  - `seo.meta_keywords`

### 2.2 不需轉換的欄位

- ID / code / slug / 數字：
  - `external_id`
  - `post_type`
  - `ct_collection_key`
  - `ct_collection_order`
  - `ct_magazine_issue_no`
  - 年月 / 日期數值等。
- URL：
  - `old_url`
  - `featured_image`
  - `gallery_items[].url`
  - 下載檔案 URL 等。
- 日期字串（若格式固定，不含中文）：
  - `ct_event_date_start` / `ct_event_date_end` 等，可視實際情況保留。
- Enum / 狀態：
  - `language`
  - `ct_download_type`
  - `ct_magazine_level`
  - `MultilingualInfo.status` 等。

> 實作上建議使用「欄位白名單」方式列出需轉換的 key，避免誤改 URL / ID。

---

## 3. 轉換工具與策略

### 3.1 使用 OpenCC（或等價工具）

- 採用「臺灣正體 → 大陸簡體」配置。
- 可載入自訂詞庫修正佛教專有名詞。

### 3.2 Markdown 與符號

- `body_markdown`、`ct_verse_block_markdown` 等欄位內含 Markdown 語法：
  - 轉換器對整段字串運作即可；多數情況下 ASCII 字元不會變動。
  - 測試時需驗證：`# 標題一` → `# 标题一`，而 `#` 保持不變。

---

## 4. Pipeline 流程

1. 掃描 zh-tw JSON 目錄。
2. 逐筆讀取並 parse 成 `AnyContent`。
3. 建立 zh-cn 版本：
   - 複製整個物件。
   - 設定：
     - `language: 'zh-cn'`
     - `external_id` 原封不動。
     - `old_url` 改為對應 `-gb` URL（若有配對表）。
4. 針對白名單欄位進行繁→簡轉換。
5. 寫出 zh-cn JSON 檔。
6. 記錄成功與錯誤 log。

---

## 5. 多語資訊與 `multilingual` 欄位

- 若 zh-tw JSON 已包含 `multilingual`：

  ```jsonc
  "multilingual": {
    "translations": [
      { "language": "zh-tw", "old_url": "https://www.ctworld.org.tw/...htm", "status": "manual" },
      { "language": "zh-cn", "status": "planned" }
    ]
  }
  ```

- 則 zh-cn 版本應補齊：

  ```jsonc
  "multilingual": {
    "translations": [
      { "language": "zh-tw", "old_url": "https://www.ctworld.org.tw/...htm", "status": "manual" },
      { "language": "zh-cn", "old_url": "https://www.ctworld.org.tw/...-gb.htm", "status": "generated" }
    ]
  }
  ```

- 若 zh-tw 版本尚未有 `multilingual`：
  - 建議先在 zh-tw 生成階段就建立基本結構，使 zh-cn pipeline 僅需「填補 zh-cn 那一筆」。

---

## 6. external_id 與 Polylang 的關係

- 同一筆內容的多語版本：
  - `external_id` 相同。
  - `language` 不同（`zh-tw` / `zh-cn` / `en` / `ja`）。
- 匯入 WP 時：
  - 可將 `external_id` 當作 Polylang 的 group key。
  - 各語言 WP post 透過 WordPress / Polylang API 綁定為互為翻譯。

---

## 7. 錯誤處理與檢查

- 若無對應 `-gb` URL：
  - `old_url` 可保留 zh-tw 的 URL 或設為空，並記錄 warning。
- 若某欄位在轉換前後出現不預期變化：
  - 需建立對應 unit test / snapshot，比較前後差異。

---

（本檔為繁→簡 pipeline vNext 版，更新後請同步調整實作程式與測試。）
