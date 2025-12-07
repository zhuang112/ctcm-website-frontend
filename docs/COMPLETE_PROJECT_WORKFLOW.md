# COMPLETE_PROJECT_WORKFLOW.md (vNext + image fallback)

> 中台世界舊站 → Headless WordPress + React 全流程說明  
> 本版已納入：`featured_image` / fallback 主圖策略、external_id 與語言碼的更新決策。

---

## 0. 系統總覽（簡要）

### 0.1 目標

- 將舊站 `ctworld.org` / `ctworld.org.tw` 的 HTML 網頁：
  - 轉成統一的 JSON 結構（`AnyContent`，以 `zh-tw` 為主）。
  - 再產出 `zh-cn` 版 JSON。
  - 匯入 Headless WordPress（多 post_type、多語）。
  - 最終由 React 前端讀取 WP（REST / GraphQL）。

### 0.2 語言與 ID 約定

- `Language` 型別（JSON / 程式內）：

  ```ts
  type Language = 'zh-tw' | 'zh-cn' | 'en' | 'ja';
  ```

- URL 中的語言段（若有）也使用這組小寫代號：

  - 預設語言 `zh-tw`：不帶語言前綴  
    `https://www.ctworld.org/teaching/heart-sutra-001`
  - 其他語言：帶語言前綴  
    `https://www.ctworld.org/zh-cn/teaching/heart-sutra-001`

- `external_id`：
  - 為每一則「語意內容單位」的 **穩定 ID**。
  - **所有語言共用同一個 external_id**，不再加 `_zh-cn` 之類後綴。
  - 例：
    - `zh-tw`: `external_id = "teaching_20030315_heart-sutra-001"`
    - `zh-cn`: `external_id = "teaching_20030315_heart-sutra-001"`
    - `en`:    `external_id = "teaching_20030315_heart-sutra-001"`
  - 在同一語言內 `(language, external_id)` 不可重複。

- slug：
  - 網址最後一段（例如 `heart-sutra-001`）。
  - 不另外存成欄位，由前端或 importer 依 `external_id` 規則推導。
  - 未來若有需要，可再於 schema 加入獨立 `slug` 欄位。

---

## 1. Pipeline 概觀

1. **爬蟲階段**
   - 輸入：舊站 sitemap、首頁底部簡易 sitemap、人工補充的 URL 清單。
   - 輸出：`urls.json`、`url_classification.json` 等。
2. **HTML → AnyContent(JSON, zh-tw)**
   - 解析 HTML、抽正文、轉 Markdown、填 meta、解析圖片。
3. **zh-tw → zh-cn pipeline**
   - 對指定欄位做繁→簡轉換，產出 `zh-cn` JSON。
4. **匯入 WordPress**
   - 依 post_type 建立/更新對應的 WP post、ACF/meta、Polylang 關聯。
   - 同步媒體（圖片、桌布、電子書等）。
5. **fallback 主圖補齊（可在匯入後或獨立工具執行）**
   - 專門負責：為「缺少 `featured_image` 的內容」分配一張合適的主圖。
6. **React 前端**
   - 讀取 WP API，依 post_type / meta 呈現各單元頁面。
7. **Redirect 映射**
   - 依 `redirect_mapping.csv` 將舊站 URL 301 導向新站。

---

## 2. HTML → AnyContent (zh-tw)

### 2.1 主要步驟

對每個 HTML 頁面執行：

1. **classify-url**
   - 輸入：原始 URL（繁體 base URL）。
   - 輸出：`post_type`, `collection_key`。
2. **parse HTML → Cheerio DOM**
3. **extract-main-content**
   - 移除 header/nav/footer/sitemap/form 等非主體。
   - 以文字密度 heuristics 找出主內容 container。
4. **html-to-markdown-core**
   - 套用全域清理與 HTML→Markdown 規則（見 `HTML_TO_MARKDOWN_RULES_V4.md`）。
   - 處理標題、段落、列表、blockquote 等。
   - 解析 `<img>`：
     - 第一張內容圖 → `featured_image`
     - 之後的圖 → `gallery_items[]`，有 caption 則填 `caption`。
     - `featured_image_caption` 預設 `null`，僅在明確屬於 banner 標語時才填。
     - **此階段不處理 fallback 主圖。**
5. **post-type-adapters**
   - 依 `post_type` 呼叫對應 adapter（teaching / news / magazine / branch / …）。
   - 從 DOM 補 meta：日期、講者、地點、期數、下載檔案列表、食譜材料/作法等。
6. **組合 AnyContent**
   - `external_id`：依 URL +內容設計規則生成，生成後視為不可變。
   - `language = 'zh-tw'`
   - `old_url`：繁體舊站 URL。
   - `post_title`, `post_excerpt`, `body_markdown`, `meta`, `featured_image`, `gallery_items` 等。

輸出：

```text
data/zh-tw/{post_type}/{external_id}.zh-tw.json
```

---

## 3. zh-tw → zh-cn pipeline（摘要）

詳細規則見 `ZH_TW_TO_ZH_CN_PIPELINE.md`。這裡只列與整體流程相關的重點：

- 對每一個 zh-tw JSON 產生一個 zh-cn JSON：

  ```text
  data/zh-cn/{post_type}/{external_id}.zh-cn.json
  ```

- 欄位：
  - `language`：`'zh-cn'`
  - `external_id`：**與 zh-tw 版相同**。
  - `old_url`：若有 `-gb` 版本，則填其 URL，否則可留空或沿用繁體 URL 並記錄 warning。
- 只對「人類可讀中文字串」欄位做繁→簡轉換（例如 `post_title`, `body_markdown`, 部分 `meta.*`, `seo.*`）。
- 不修改：ID、URL、日期、座標等。

---

## 4. 匯入 WordPress

### 4.1 基本策略

- 以 JSON (`AnyContent`) 為唯一資料來源。
- 每一則內容在 WP 中至少對應一篇 post（不同 language 對應 Polylang 多語）。
- 使用 `external_id` 作為 WP 端的穩定識別：
  - 寫入 post meta：`ct_external_id = external_id`
- 語言：
  - 依 `AnyContent.language` 寫入 Polylang language（mapping：`zh-tw -> zh_TW`, `zh-cn -> zh_CN`）。

### 4.2 文章建立/更新流程

對每個 JSON：

1. 依 `post_type` 決定 WP post type。
2. 用 `(language, external_id)` 在 WP 查詢是否已有對應 post：
   - 0 筆 → 新增。
   - 1 筆 → 更新。
   - >1 筆 → 記錄 error（external_id 重複），不再新增。
3. 設定：
   - post title / content（從 `post_title`, `body_markdown`）。
   - meta（對應 schema / ACF）。
   - 語言與翻譯群組（Polylang）：
     - group key = `external_id`（多語共用）。
4. 圖片：
   - 若 JSON 中有 `featured_image`：
     - 從圖片 mapping（舊 URL → WP attachment ID）查出對應 attachment。
     - 設為 `set_post_thumbnail()`。
   - 若 JSON 中無 `featured_image`：
     - **先保持空白，交由 fallback 工具後處理。**
   - `gallery_items`：
     - 若有需求，可在 WP 端建立 gallery meta / ACF，或僅保留在 JSON 層由前端自行渲染。

---

## 5. fallback 主圖補齊流程（新規則）

> 目的：確保「每一頁內容在前端都有一張可用的主圖」，但又不污染原始 HTML→JSON 的「真實紀錄」。

### 5.1 原則

- **HTML→JSON 階段不做 fallback**：只反映「舊站當年有沒有圖」。  
- fallback 主圖由「匯入後的後處理」負責：
  - 以 WP 文章為主（或 JSON 為主），批次補齊 `featured_image`。
- fallback 策略必須：
  - 可重複執行（idempotent）。
  - 同一篇文章每次跑都拿到同一張 fallback 圖（穩定）。

### 5.2 可能實作位置

兩種典型做法任選一種或並行：

1. **WP-CLI 工具（推薦）**
   - 在 WP plugin 中實作一個 CLI command，例如：
     - `wp ctworld:assign-fallback-featured-images`
   - 流程：
     1. 找出所有目標 post（例如 `post_type in (teaching, news, ...)`）。
     2. 篩選 `沒有 featured image` 的 post。
     3. 依策略（見 5.3）計算要用的 fallback 圖片（attachment ID）。
     4. 呼叫 `set_post_thumbnail()` 補上。

2. **Node script 呼 WP REST API**
   - 在 node 專案中寫 script：
     - 列出所有無 `featured_image` 的內容（透過 JSON 或 WP API）。
     - 按策略分配 fallback 圖片，呼叫 REST API 設定 featured media。

### 5.3 fallback 圖片策略（建議）

可先從簡單版本開始，未來視覺設計成熟後再調整：

- 準備一組「可當主圖的庫存圖片」（WP Media 中的若干 attachment）：
  - 例如：`fallback_teaching_01`, `fallback_news_01`, `fallback_branch_01` …
- 為每個 post_type 定義一組候選清單：

  ```ts
  const FALLBACK_POOL = {
    teaching: [id_101, id_102],
    news: [id_201, id_202],
    magazine: [id_301],
    branch: [id_401, id_402],
    // ...
  };
  ```

- 對於每一個沒有主圖的 post：

  ```ts
  const key = external_id; // 或 `${post_type}:${external_id}`
  const idx = stableHash(key) % pool.length;
  const chosenAttachmentId = pool[idx];
  ```

  - `stableHash` 可以是任何 deterministic hash（例如 murmurhash / FNV），只要在程式中固定即可。
  - 同一個 `external_id` 每次都會得到同一個 idx → 同一張 fallback 圖。

- 若某 post_type 未定義 pool：
  - 可以跳過不補，或使用一個 global fallback pool。

### 5.4 `featured_image_caption` 在 fallback 階段的角色

- 一般內容頁：
  - fallback 主圖通常不需要 caption，`featured_image_caption` 可維持 `null`。
- 特殊場合（例如首頁 hero banner）：
  - 可以手動或程式化指定：
    - 在匯入或後處理階段將 `featured_image_caption` 設為簡短標語。
- 規則：
  - `featured_image_caption` **不是必填欄位**。
  - 前端顯示時需能處理 `null` 情況。

---

## 6. external_id 唯一性與檢查機制（補充）

> 已知舊站會有「同名」內容，必須確保 `external_id` 在同一語言下不重複。

### 6.1 生成階段檢查

在 HTML→JSON 生成程式中：

- 於程式執行期間維護一個 Set：

  ```ts
  const seen = new Set<string>(); // key = `${language}:${external_id}`
  ```

- 每產生一個 `AnyContent`：
  - 若 key 已存在 → 記錄 error + 決定 skip / abort。

### 6.2 全量驗證工具

撰寫獨立 script，例如：`scripts/validate-external-ids.ts`：

- 掃描 `data/{language}/**/*.json`。
- 以 `(language, external_id)` 為 key，檢查：
  - 是否出現重複。
  - 是否有同一 external_id 對應多個 `old_url`（可視為 warning）。
- 於 CI / pre-import 階段執行，若有重複則 fail。

### 6.3 WP 匯入階段檢查

在 importer 中：

- 匯入前，用 `(language, external_id)` 查詢既有 post：
  - 若結果 > 1 筆 → 記錄嚴重錯誤，不再新增新 post。
- 可視情況將這些衝突寫入 `import_errors.json` 以便人工處理。

---

## 7. Redirect 映射（與 external_id / slug 的關係）

- redirect 實際使用的是：

  ```text
  old_url -> new_url
  ```

- 建議 `redirect_mapping.csv` 欄位：

  ```csv
  kind,old_url,new_url,lang,external_id,notes
  ```

  - redirect 系統只依 `old_url,new_url` 執行 301。
  - `external_id` 只做對照與除錯，不作為 redirect key。

- 當 URL 結構或 slug 策略調整時：
  - 建議由「匯入 / route 生成程式」統一重建 `new_url`，再重新產出 `redirect_mapping.csv`。

---

（本文件為工作流程總覽，細節請搭配：`CONTENT_SCHEMA.md`、`HTML_TO_MARKDOWN_RULES_V4.md`、`ZH_TW_TO_ZH_CN_PIPELINE.md` 一起閱讀。）
