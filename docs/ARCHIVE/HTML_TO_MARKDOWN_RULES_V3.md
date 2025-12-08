# 中台世界網站 - HTML 轉 Markdown 規則 V3

> 目標：  
> 1. 讓抓取內容可以穩定、自動轉成 Markdown + 結構化 JSON  
> 2. 讓之後的 WordPress / React 前端可以自由組合與重複利用內容  
> 3. 避免圖說、索引、月刊版頭等「裝飾性文字」干擾正文

---

## 1. 核心原則

1. **使用 90% Markdown + 10% HTML 的混合方案**
2. 統一做三個層次：
   - HTML 清理 → 找到「主內容區」
   - HTML → Markdown（`body_markdown`）
   - 同時抽出 JSON 結構欄位（圖片、圖說、偈語、月刊欄位…）
3. Markdown 盡量保持：
   - 結構清晰（標題、段落、列表、引用）
   - 適當保留必要的 HTML 容器（如 `quote-hero`）

---

## 2. 噪音移除與主內容區辨識

與 V2 規則相同，這裡只補關鍵點：

- 移除：導覽、footer、版權、友善列印、上一頁/下一頁、站內搜尋、讀者心得等
- 特別處理：
  - **佛典故事「心得」段落**：整塊移除，不進 Markdown / JSON
  - 「閱讀感言」、「心得」、「網友迴響」等固定結構用正則直接剃掉

只保留真正正文與教學、活動報導、月刊文章內容。

---

## 3. 標題、段落與換行

保留 V2 的大部分設定；這裡只列出要點：

### 3.1 標題

- `<h1>` → `#`
- `<h2>` → `##`
- `<h3>` → `###`
- `<span class="blue">` / `<strong>` / `<b>` 這類「小標」→ `### 小標題`

### 3.2 段落與換行

- `<p>` / `<div>` → 正常段落，中間用一行空白分隔
- `<br>`：
  - 詩偈 / 一行一句時 → 轉成行尾兩個空格＋換行（保持詩行對齊）
  - 一段 `<br><br><br>` → 只保留一個空行或視情況轉成段落結束

---

## 4. 圖片與圖說（JSON-only Caption）

> **重要更新：圖說只存 JSON 不進 Markdown**

### 4.1 圖片判定與主圖選擇

- 每篇文章至少期望有一張主圖：
  - 若舊頁有圖片：
    - 第一張 → `featured_image`
    - 其他 → `gallery_items[]`
  - 若舊頁沒有圖片：
    - 之後可由工具批次指派預設風景圖、道場圖  
      （匯入後由額外的 script 檢查 `featured_image` 為空的文章，自動填補）

### 4.2 圖說抽取與儲存

- 若 `<img>` 緊接著一小段文字（`<p>` / `<span>` / 特定 class），判定為圖說：
  - 不放進 `body_markdown`
  - 只寫入：
    - `featured_image_caption`
    - 或對應 `gallery_items[i].caption`

- JSON 例子：

  ```jsonc
  {
    "featured_image": "https://.../image1.jpg",
    "featured_image_caption": "禪七齋堂共修情景。",
    "gallery_items": [
      {
        "url": "https://.../image2.jpg",
        "alt": "供佛儀軌",
        "caption": "供佛儀軌時，僧眾靜默安住。"
      }
    ]
  }
  ```

- `body_markdown`：
  - 只保留必要的 `![](url)` 或乾脆不放圖（視前端策略而定）
  - 不使用 `<small>圖說…</small>` 防止重複顯示

---

## 5. 特殊段落：偈語、引言、HR、月刊欄位

### 5.1 引言（quote-hero）

- 頁面開頭一整塊「經文＋短勉勵語」→ 包在 `<div class="quote-hero">` 中：

```md
<div class="quote-hero">
經云：「天上天下無如佛，十方世界亦無比。」  
學佛，向聖人看齊，  
行住坐臥，像佛形儀，  
三業清淨，具佛戒律，  
寂照一如，得佛受用。  
與聖賢同行，成為更好的自己！
</div>
```

### 5.2 文中 HR 與「省思」段落

- `* * *` → `---`（一條水平線）
- 若在月刊或故事中出現段落標題「省思」：
  - 強制轉成：

    ```md
    ## 省思
    ```

### 5.3 中台山月刊／中台廣傳欄位

這類資訊通常是「版面頭、欄位名」，不當成正文。

在 JSON：

```jsonc
{
  "post_type": "magazine",
  "body_markdown": "（文章正文）",
  "meta": {
    "ct_magazine_issue_no": 301,
    "ct_magazine_issue_label": "中台山月刊 301 期",
    "ct_magazine_section": "中台廣傳"
  }
}
```

原則：

- 「中台廣傳」「修學園地」等欄位名 → 僅存在 meta
- 月刊版頭與期數資訊，不進正文，只做排版用

---

## 6. Teaching / News / Magazine / Branch 共通欄位（與 Markdown 相關部分）

此處只列出跟 HTML→Markdown 直接相關的欄位：

- `post_type`: `teaching`, `news`, `magazine`, `branch`, `index_page`…
- `post_title`: 從主標題抽取
- `post_excerpt`: 從首段摘要或特定欄位抽取
- `body_markdown`: 清理後的主文 Markdown
- `featured_image`, `featured_image_caption`
- `gallery_items[]`
- `meta`:
  - Teaching 專用：
    - `ct_speaker_name`
    - `ct_event_date`
    - `ct_sutra_reference`
    - `ct_teaching_category`
    - …
  - News：
    - `ct_news_date`
    - `ct_event_location`
    - `ct_related_branch`
  - Magazine：
    - `ct_magazine_issue_no`
    - `ct_magazine_section`
  - Branch：
    - `ct_branch_type`
    - `ct_branch_region`
- `seo`:
  - `meta_title`
  - `meta_description`
  - `meta_keywords`

（詳細 schema 可另開文件，這裡只放與 Markdown 相關的部分）

---

## 7. index_page（目錄頁）轉換規則

- 這類頁面只需要 minimal Markdown 以供 debug：
  - `body_markdown` 可寫簡短說明：
    - 例如：「此頁為舊站索引，不作為前端正式內容」
- 重點在 `meta.ct_index_key`：
  - 如：`sutra_stories`、`chan_koans`、`annals`

之後實際的 index 頁由新系統根據 `ct_index_key` 動態產生。

---

## 8. 多語與 `language` 欄位簡述

- `language`：`zh-TW`, `zh-CN`, `en`, `ja`
- **HTML→Markdown 階段** 通常只產生 `zh-TW` 版本
- `zh-CN` 由後續的 **繁→簡 pipeline** 自動產生（見 `ZH_TW_TO_ZH_CN_PIPELINE.md`）
- `en` / `ja` 若有現成 HTML，再走同樣流程各自轉；  
  沒有的可以標 `status: planned` 或 `status: machine_translation` 等
