# ZH_TW_TO_ZH_CN_PIPELINE.md

> 目標：  
> - 不重抓 `-gb` HTML，只用繁中內容自動生成簡中版本  
> - 保留所有簡體舊網址（`-gb`）的對應關係與 redirect  
> - 確保 zh-TW / zh-CN 版本內容一致，只差字形

---

## 1. URL 配對規則

從 sitemap / menu 抓到的 URL 可能有兩種版本：

- 繁體：`https://www.ctworld.org/sutra_stories/story148.htm`
- 簡體：`https://www.ctworld.org/sutra_stories/story148-gb.htm`

處理策略：

1. 建立 `baseUrl ↔ gbUrl` 配對：
   - `baseUrl` = 去掉 `-gb` 的 URL
   - `gbUrl` = 含 `-gb` 的 URL（若存在）
2. 只抓取 `baseUrl` 的 HTML，`gbUrl` 不抓 HTML，只記錄在 mapping 中。

資料結構示例（Node.js）：

```ts
type UrlPair = {
  baseUrl: string; // 繁中
  gbUrl?: string;  // 簡中，有則記錄
};
```

---

## 2. zh-TW JSON 生成

對每個 `baseUrl`：

1. 抓 HTML
2. 套 `html-to-markdown` + V3 規則
3. 產出 `language = "zh-TW"` 的 JSON

若該 URL 有對應 `gbUrl`：

```jsonc
"multilingual": {
  "translations": [
    {
      "language": "zh-CN",
      "old_url": "https://www.ctworld.org/sutra_stories/story148-gb.htm",
      "status": "planned"
    }
  ]
}
```

---

## 3. 繁→簡轉換的欄位範圍

使用 OpenCC（或等效工具）將 zh-TW JSON 轉成 zh-CN JSON。

**需要轉換的欄位：**

- `post_title`
- `post_excerpt`
- `body_markdown`
- `meta` 裡的中文 string：
  - 如：`ct_speaker_name`、`ct_location`、`ct_teaching_category`…
  - 陣列型欄位（如 `ct_key_concepts`）內部每個中文字串
- `seo.meta_title`
- `seo.meta_description`

**不應轉換的欄位：**

- URL（`old_url`, `featured_image`, `gallery_items[].url` 等）
- 檔案路徑、檔名
- 純英文代碼、ID、日期時間等

---

## 4. zh-CN JSON 結果格式

產出的 zh-CN JSON：

```jsonc
{
  "external_id": "teaching_20030315_heart_sutra_001_zh-CN",
  "language": "zh-CN",
  "old_url": "https://www.ctworld.org/sutra_stories/story148-gb.htm",
  "post_title": "無畏自在——從《心经》看放下执著",
  "post_excerpt": "……（簡體字版）",
  "body_markdown": "……（簡體字版）",
  "meta": {
    "ct_speaker_name": "惟觉安公老和尚",
    "ct_location": "中台禅寺大殿"
  },
  "seo": {
    "meta_title": "……（簡體版）",
    "meta_description": "……（簡體版）"
  },
  "multilingual": {
    "translations": [
      {
        "language": "zh-CN",
        "old_url": "https://www.ctworld.org/sutra_stories/story148-gb.htm",
        "status": "generated"
      }
    ]
  }
}
```

---

## 5. 匯入 WordPress 與 Polylang 對應

建議流程：

1. **第一輪**：匯入所有 zh-TW JSON
   - 為每篇產生 `post_id_tw`
   - 設：
     - Polylang 語言 = `zh-TW`
     - `ct_external_id = external_id`（例如：`teaching_..._001`）

2. **第二輪**：匯入所有 zh-CN JSON
   - 為每篇產生 `post_id_cn`
   - 設：
     - Polylang 語言 = `zh-CN`
     - `ct_external_id = external_id`（例如：`teaching_..._001_zh-CN`）
   - 用 group key（例如從 external_id 去掉 `_zh-CN`）找出對應 zh-TW 一篇
   - 使用 Polylang API 建立翻譯關係

3. 同時把 `old_url` 存成 post meta（含 `-gb`），供 redirect 使用。

---

## 6. `-gb` 舊網址 redirect

為避免 SEO 損失與 404：

- 將 zh-CN JSON 的 `old_url`（即 `-gb`）：
  - 存入 WordPress post meta：`_ct_old_url_gb`
  - 或匯入自訂 redirect 表
- 使用 redirect 外掛或自寫邏輯：
  - 讓舊簡體網址（`story148-gb.htm`）→ 301 redirect 到新站對應的 zh-CN URL

---
