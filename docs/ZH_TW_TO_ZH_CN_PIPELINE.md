# ZH_TW_TO_ZH_CN_PIPELINE.md (vNext)

> 中台世界舊站 → JSON vNext 的繁體（zh-TW）→ 簡體（zh-CN）轉換規格  
> 本文件對齊：`COMPLETE_PROJECT_WORKFLOW.md (vNext)` 與 `CONTENT_SCHEMA.md (vNext)`

---

## 0. 目標與邊界

### 0.1 目標

- 將 **已結構化的 zh-TW JSON（AnyContent）**，批次產出對應的 **zh-CN JSON**：
  - 保留相同的 `external_id` 基底（以語言後綴區分）。
  - 將指定欄位由繁體中文轉為簡體中文。
  - 非中文內容（數字、英文、URL 等）必須保持不變。
- 對前台與 WordPress 的影響：
  - zh-TW / zh-CN 均由同一套 schema 驅動。
  - Polylang 使用「同一 group key」綁定不同語言版本。

### 0.2 不做的事

- 不直接處理 HTML → Markdown（已在 `HTML_TO_MARKDOWN_RULES_V4.md` 處理）。
- 不修改結構（欄位名稱、資料型別）——僅修改「欄位值中的文字內容」。

---

## 1. 輸入與輸出格式

### 1.1 輸入

- 檔案位置：
  - 例如：`data/zh-TW/{post_type}/{external_id}.zh-TW.json`
- 結構：
  - 必須符合 `AnyContent` interface（見 `CONTENT_SCHEMA.md`）。
- 最小需求欄位：
  - `external_id`, `language` = `"zh-TW"`
  - `post_type`
  - `post_title`
  - `body_markdown`
  - （其他欄位照 schema optional）

### 1.2 輸出

- 對每一個輸入 JSON，產出一個新的 zh-CN JSON：
  - 檔名建議：`data/zh-CN/{post_type}/{external_id}.zh-CN.json`
  - `language` 欄位改為 `"zh-CN"`。
  - `external_id` 建議附加 `_zh-CN` 後綴（或依你在 schema 中的實作決策）。
  - 文字欄位做繁→簡轉換後寫回。

---

## 2. 欄位轉換範圍

### 2.1 需要轉換的欄位（文字內容）

對以下欄位，需執行「繁體 → 簡體」轉換：

- 頂層：
  - `post_title`
  - `post_excerpt`
  - `body_markdown`
- `meta` 中所有「明顯是中文文字」的欄位：
  - `ct_speaker_name`（人名可能不必強制改，但可一律送轉換器處理，通常影響不大）
  - `ct_location`
  - `ct_sutra_reference`
  - `ct_teaching_category`
  - `ct_verse_type`
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
  - `ct_recipe_servings`（若包含中文）
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
  - 以及任何未來新增的中文描述欄位（原則：屬於人類閱讀的中文字串，都應納入轉換）。
- `seo`：
  - `seo.meta_title`
  - `seo.meta_description`
  - `seo.meta_keywords`

### 2.2 不需轉換的欄位

- 所有 **純 ID / code / slug / 數字** 欄位：
  - `external_id`
  - `post_type`
  - `ct_collection_key`
  - `ct_collection_order`
  - `ct_magazine_issue_no`
  - `ct_magazine_year`
  - `ct_magazine_month`
  - `ct_event_roc_year`
  - `ct_branch_lat`, `ct_branch_lng`
  - `ct_download_type`
  - `ct_wallpaper_code`
  - `ct_wallpaper_files[].url`, `label`（只有 label 中含中文才需轉換；預設為解析度數字不須處理）
  - `ct_ebook_files[].url`
- 日期欄位：
  - `ct_event_date`, `ct_event_date_start`, `ct_event_date_end`
  - `ct_news_date`
  - `ct_gallery_date`
- URL 類欄位：
  - `old_url`
  - `featured_image`
  - `gallery_items[].url`
  - `DownloadFile.url`
- 語言 / 狀態類 enum 欄位：
  - `language`
  - `post_type`
  - `ct_resource_type`
  - `ct_magazine_level`
  - `TranslationStatus` 等

> 實作上，可以用「欄位白名單」來指定要轉換的 key 清單，避免誤改 ID / URL。

---

## 3. 轉換工具與策略

### 3.1 工具選擇（以 OpenCC 為例）

建議以 OpenCC 類工具作為繁→簡轉換核心：

- 具備：
  - 用詞表、詞組級別的轉換規則。
  - 可載入自訂詞庫（例外字詞）；
- 在 Node.js 中可使用對應 binding 或透過 CLI 呼叫。

### 3.2 用詞策略

- 預設使用通用的「臺灣正體 → 大陸簡體」配置。
- 可視需求建立 **自訂詞庫 override**：
  - 佛教專有名詞（某些字不希望被異體化）。
  - 專有名詞、人名等。
- 例：
  - 「中台禪寺」→ 若預設不會被錯誤改寫，可不特別處理。
  - 若出現不希望的字型轉換（例如某些「祇」、「闍」等），才考慮列入自訂詞庫。

### 3.3 Markdown 與特殊符號

- `body_markdown` / `ct_verse_block_markdown` 等欄位包含 Markdown 語法：
  - 必須「只對中文字元做轉換」，保留：
    - `#`, `*`, `_`, `[`, `]`, `(`, `)`, `>`, ``` ````, `-`, `+`, `1.` 等 Markdown 符號。
- 實務上：
  - 大多數繁→簡工具可以直接對整個字串運作，不會修改 ASCII 字元，因此通常安全。
  - 仍應在測試案例中覆蓋 Markdown 情境。

---

## 4. Pipeline 詳細流程

### 4.1 高層流程

1. 掃描 zh-TW JSON 目錄。
2. 逐一讀取 JSON → parse 為 `AnyContent`。
3. 建立 zh-CN 版本物件：
   - 複製整個物件。
   - 修改：`language`, `external_id`, `old_url`, `multilingual` 等（見 4.2）。
4. 對指定欄位執行繁→簡轉換。
5. 寫出 zh-CN JSON 檔：
   - 目錄與檔名遵照規則。
6. 記錄轉換 log / error。

### 4.2 欄位層級變更

#### 4.2.1 頂層

- `language`：
  - `"zh-TW"` → `"zh-CN"`

- `external_id`：
  - 建議模式：在原 external_id 後加 `_zh-CN` 後綴；例如：
    - zh-TW: `teaching_20030315_heart_sutra_001`
    - zh-CN: `teaching_20030315_heart_sutra_001_zh-CN`
  - 這樣 group key = 去掉語言後綴的那一段（匯入端負責實作）。

- `old_url`：
  - 若有 `url_pairs.json`（baseUrl / gbUrl 配對檔）：
    - 尋找輸入 zh-TW JSON 的 `old_url`（base URL），查到對應 `gb_url`：
      - zh-CN JSON `old_url` 設為 `gb_url`。
  - 若找不到對應 `gb_url`：
    - 可以：
      - 留空，或
      - 設為同一個 base URL，但需標記在 log 以便日後檢查。

#### 4.2.2 multilingual 欄位

- 若 zh-TW JSON 已帶有 `multilingual`：
  - zh-TW 版本可能長這樣：

    ```jsonc
    "multilingual": {
      "translations": [
        {
          "language": "zh-TW",
          "old_url": "https://www.ctworld.org.tw/sutra_stories/story148.htm",
          "status": "manual"
        },
        {
          "language": "zh-CN",
          "status": "planned"
        }
      ]
    }
    ```

- zh-CN 版本應該更新為：

  ```jsonc
  "multilingual": {
    "translations": [
      {
        "language": "zh-TW",
        "old_url": "https://www.ctworld.org.tw/sutra_stories/story148.htm",
        "status": "manual"
      },
      {
        "language": "zh-CN",
        "old_url": "https://www.ctworld.org.tw/sutra_stories/story148-gb.htm",
        "status": "generated"
      }
    ]
  }
  ```

- Pipeline 中的具體策略：
  1. 複製 zh-TW JSON 的 `multilingual` 整個物件。
  2. 找出其中 `language = "zh-CN"` 的項目：
     - 若不存在，新增一筆。
     - 將其 `old_url` 設為 `gb_url`（如有），`status` 設為 `"generated"`。
  3. 不移除 zh-TW 那筆 translation。

> 若 zh-TW 版本完全沒有 multilingual，zh-CN 版本可以選擇：
> - 先保持 `multilingual` 為空或 undefined，轉交給匯入程式補完；
> - 或在 pipeline 中就補上 basic multilingual 結構。  
> 建議：**於 zh-TW 生成時就為 multilingual 打底**，避免 pipeline 太複雜。

#### 4.2.3 meta / seo / 其他欄位

- 除了文字轉換外，不改變任何 key / 結構。
- 例外：若未來有新增「語言」相關的 meta（例如 `ct_original_language`），需明確規定是否在 zh-CN 複製或修改。

---

## 5. CLI 設計建議

### 5.1 介面草案

假設會寫一個 Node CLI：`generate-zh-cn.ts`

```bash
# 全量轉換
node scripts/generate-zh-cn.ts

# 只轉某個 post_type
node scripts/generate-zh-cn.ts --post-type=teaching

# 只轉某個 external_id
node scripts/generate-zh-cn.ts --only-id=teaching_20030315_heart_sutra_001

# dry run 模式（只在 console 顯示差異，不寫檔）
node scripts/generate-zh-cn.ts --dry-run
```

### 5.2 記錄與報表

輸出 `zh_cn_generate_results.json`，內容示例：

```jsonc
[
  {
    "external_id_tw": "teaching_20030315_heart_sutra_001",
    "external_id_cn": "teaching_20030315_heart_sutra_001_zh-CN",
    "post_type": "teaching",
    "status": "ok",
    "tw_path": "data/zh-TW/teaching/teaching_20030315_heart_sutra_001.zh-TW.json",
    "cn_path": "data/zh-CN/teaching/teaching_20030315_heart_sutra_001_zh-CN.json"
  }
]
```

錯誤則記在 `zh_cn_generate_errors.json`：

```jsonc
[
  {
    "external_id_tw": "teaching_20030315_heart_sutra_002",
    "post_type": "teaching",
    "error_code": "NO_GB_URL",
    "message": "No gb_url found for old_url=https://www.ctworld.org.tw/..."
  }
]
```

---

## 6. 邊界情境與特殊處理

### 6.1 已存在 zh-CN JSON

- 若 pipeline 再跑一次時，發現 output 檔已存在：
  - 預設策略：**覆寫**（因為轉換規則可能更新）。
  - 或提供 `--skip-existing` 選項，讓使用者可選擇不覆蓋。

### 6.2 非預期文字混雜

- 若欄位中包含：
  - 部分為繁體中文字，部分為簡體，或
  - 其他語種混雜（如日文片語）；
- 轉換器一般會只針對繁體→簡體，其他語種不受影響。  
- 若某些專有名詞被轉錯：
  - 僅能透過自訂詞庫修正。

### 6.3 Emoji / 特殊符號

- 應保持原樣，轉換器通常不會影響。

---

## 7. 測試與驗證策略

### 7.1 單元測試（Unit Test）

為 pipeline 核心函式撰寫單元測試：

- 簡單字詞：
  - 「臺灣」→「台湾」
  - 「中台禪寺」→預期不被錯誤改寫。
- Markdown 內容：
  - `## 標題一` → `## 标题一`
  - `> 偈語第一行\n> 偈語第二行` → 保持 Markdown 結構不變。
- meta 欄位：
  - `ct_recipe_ingredients_markdown` 中的食材名稱正確簡體化。

### 7.2 整合測試（Integration Test）

- 用真實的 zh-TW JSON 樣本：
  - 一篇 teaching
  - 一篇 news
  - 一期 magazine issue + 一篇 article
  - 一個 branch
  - 一個 resource（e-Book + 食譜）
  - 一個 download（桌布）
- 對應產出的 zh-CN JSON：
  - 手動 spot-check 文字是否合理。
  - 檢查 multilingual / old_url 是否正確寫入。

### 7.3 Regession Test（回歸測試）

- 每次更新轉換規則或詞庫：
  - 重新跑 pipeline，與舊版 zh-CN JSON 比對差異：
    - 例如使用 snapshot 檔或 diff 工具。
  - 只接受「預期差異」（例如修正錯誤用詞），避免引入新錯誤。

---

## 8. 實作建議檔案結構

```text
scripts/
  generate-zh-cn.ts          # CLI 入口
  zh-tw-to-zh-cn/
    index.ts                 # 公開 API
    transformer.ts           # 欄位層級轉換邏輯
    opencc-client.ts         # 包一層對 OpenCC / 其他工具的封裝
    fields-whitelist.ts      # 需要轉換的欄位清單與路徑
    tests/
      transformer.test.ts
      opencc-client.test.ts
```

- `fields-whitelist.ts` 可以用一種「路徑表達式」形式列舉所有需要轉換的欄位，例如：
  - `post_title`
  - `post_excerpt`
  - `body_markdown`
  - `meta.ct_*`（需更精細列出）
  - `seo.meta_title`
  - `seo.meta_description`
  - `seo.meta_keywords`

---

## 9. 與 WP 匯入 / Redirect 的關聯

- zh-CN JSON 中的：
  - `external_id`
  - `language`
  - `post_type`
  - `old_url`（應為 `gb_url`）
- 在 WP 匯入階段會用來：
  - 建立 Polylang 的多語關聯：
    - 以 group key（去除語言後綴的 external_id）將 zh-TW / zh-CN 綁在一起。
  - 建立 redirect：
    - 將舊簡體 URL（`-gb`）導向新站 zh-CN 頁面。

因此，本 pipeline 必須確保：

1. **external_id 規則一致**（與匯入程式協調）。  
2. **old_url 為正確的 gb URL**（有配對則填，無配對則記錄 error）。  
3. multilingual 標記的 `status` 正確：
   - zh-CN = `"generated"`，讓未來人工調整時，可改標為 `"manual"`。

---

（本檔為 ZH_TW→ZH_CN pipeline vNext 草案，未來如有新增欄位或語言策略，請先更新本檔與 `CONTENT_SCHEMA.md`，再更新實作程式。）
