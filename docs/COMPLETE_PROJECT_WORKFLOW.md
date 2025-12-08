# COMPLETE_PROJECT_WORKFLOW（舊站 HTML → AnyContent JSON → zh-cn → WordPress）

> 本檔案描述「整體 pipeline」，細部規則拆到其他 docs。  
> 實作時請搭配：
> - `docs/CONTENT_SCHEMA.md`
> - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
> - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
> - `docs/WORKFLOW_CHATGPT_GITHUB_WINDSURF.md`

---

## 1. 階段總覽

1. 爬蟲與檔案盤點  
2. HTML 抓取與清洗  
3. HTML → Markdown（通則 + 各單元專用規則）  
4. Markdown + metadata → AnyContent JSON  
5. zh-tw → zh-cn pipeline  
6. 匯入 WordPress（含 Polylang & redirect）  
7. 匯入後驗證與人工調整  

---

## 2. 爬蟲與檔案盤點

**目標：**  
確定「舊站有哪些頁面」，避免有東西沒抓到或抓到多餘垃圾檔。

**工具與輸出：**

- 工具：
  - `tools/crawl/crawl-ctworld.ts`
  - `tools/crawl/filesystem-inventory.ts`
  - `tools/crawl/diff-crawl-vs-files.ts`
- NPM scripts（已在 `package.json` 中定義）：
  - `npm run crawl:ctworld`
  - `npm run inventory:fs`
  - `npm run diff:crawl-vs-fs`
- 主要輸出：
  - `data/crawl/crawled-urls.{json,csv}`
  - `data/crawl/all-files.{json,csv}`
  - `data/crawl/{missing-from-crawl,extra-from-crawl}.csv`

> 詳細參考：未來可補充 `docs/crawl-and-inventory.md`。

---

## 3. HTML 抓取與清洗

**目標：**  
對「每一個 legacy URL」取得 HTML，並做最小清洗，方便後續解析。

**輸入：**

- 從 crawl + inventory 整合後的 URL 列表（已排除不需要的外站，如普中國小等）。

**處理：**

- 用 Node `fetch` 抓取 HTML。
- 清除明顯不需要的元素（`<script>` / `<style>` / 一些全站 header/footer…）。
- 保存為 `LegacyHtmlDocument` 結構：
  - `url: string`
  - `html: string`
  - 之後可擴充例如 `fetched_at`, `http_status` 等。

**輸出：**

- 建議使用 JSONL 或多個 JSON 檔，供之後 pipeline 使用：
  - 例如：`data/html-dump/legacy-html.jsonl`（每行一個 `LegacyHtmlDocument`）。

---

## 4. HTML → Markdown（`htmlToMarkdown`）

**目標：**  
把每篇 HTML 的「主內容」轉成 Markdown，並收集圖片、anchors、偈語等結構資訊。

**實作位置：**

- `src/html/html-to-markdown.ts`
- 規格：`docs/HTML_TO_MARKDOWN_RULES_V4.md`

**輸入：**

- `LegacyHtmlDocument`（至少包含 `url` 與 `html`）。

**輸出：**

- `HtmlToMarkdownResult`（摘要）：
  - `body_markdown: string`
  - `images: HtmlImageInfo[]`（頁面內出現的圖片，含 src / alt）
  - `anchors: string[]`（如 `item83`）
  - `verses: string[]`（偈語／經文段落的純文字）

**注意：**

- 此階段**不決定**：
  - featured image 是哪一張
  - caption 要寫什麼
  - 偈語要不要存到 `meta`
- 這些決策留給「各 post_type adapter」。

---

## 5. Markdown + metadata → AnyContent JSON

**目標：**  
每篇 HTML 轉成「結構化 JSON」，按照 post_type（teaching / news / magazine / …）填入對應欄位。

**實作位置（持續擴充中）：**

- 型別：
  - `src/types/anycontent-teaching.ts`（已完成）
  - 未來：`src/types/anycontent-news.ts`, `src/types/anycontent-magazine.ts`, …
- adapter：
  - `src/adapters/teaching-from-legacy.ts`（已完成 v1）
  - 未來：`src/adapters/news-from-legacy.ts`, `src/adapters/magazine-from-legacy.ts`, …

**輸入：**

- `LegacyHtmlDocument`（含 URL + HTML）
- `HtmlToMarkdownResult`（由 `htmlToMarkdown` 轉出）
- 外層給的：
  - `externalId: string`
  - `language: "zh-tw" | "zh-cn" | "en" | "ja"`

**輸出：**

- 各 post_type 的 `*Content`（例如 `TeachingContent`），結構對齊 `docs/CONTENT_SCHEMA.md`。

---

## 6. zh-tw → zh-cn pipeline

**目標：**  
在不重抓 `-gb` HTML 的前提下，為每篇內容產生對應的 `zh-cn` 版本，並保留舊簡體網址（`-gb`）供 redirect 使用。

**規格來源：**

- `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`

**高層流程：**

1. 建立 `baseUrl ↔ gbUrl` 對應（從 sitemap / 既有 URL 分析）。
2. 只從 `baseUrl`（繁中）抓 HTML → 產生 zh-tw AnyContent JSON。
3. 使用 OpenCC（或等效工具）遍歷 zh-tw JSON，產生 zh-cn JSON：
   - 規定哪些欄位要轉、哪些不能動（URL, ID, enum…）。
4. 匯入 WordPress 時：
   - 第一輪匯入 zh-tw。
   - 第二輪匯入 zh-cn，並透過 external_id / group key 建立 Polylang 對應。
   - 將 `old_url` / `-gb` URL 存進 meta，供 redirect 使用。

---

## 7. 匯入 WordPress ＋ Polylang ＋ redirect

**目標：**  
把 AnyContent JSON（zh-tw + zh-cn）安全匯入 Headless WordPress，並建立多語＆舊網址 redirect。

**預計設計：**

- WordPress 端實作：
  - WP-CLI 指令或 plugin：
    - 讀 JSON 檔（從某個目錄或 API）。
    - 依 post_type 建立／更新文章。
    - 設定：
      - `language`（Polylang）
      - `ct_external_id`（meta）
      - 各 `ct_*` meta 欄位（speaker, location, event_date…）
    - 寫入舊網址：
      - `_ct_old_url`（原繁中 URL）
      - `_ct_old_url_gb`（原 `-gb` URL，如果有）
- Redirect：
  - 可使用現有 redirect 外掛，或自寫一個簡單 routing：
    - 遇到舊 URL：查 meta → 301 到新站對應路徑。

---

## 8. 匯入後驗證與人工調整

**目標：**  
確保「沒有漏資料、沒有錯頁」，並提供一點人工微調空間。

**大致作法：**

1. 對照：
   - `data/crawl/crawled-urls.csv`
   - 匯入成功的 WordPress post 列表
   - 看是否有 URL 還沒對應到任何文章。
2. Spot check：
   - 隨機挑幾頁 sutra / blossom / news，確認：
     - Markdown 排版是否符合預期。
     - 圖片有無遺漏或錯誤。
3. 若有特殊單元需要客製 layout（例如月刊左側目錄＋右側文章）：
   - 由前端 React 根據 `post_type` + `meta` 渲染，不需要再改 pipeline。
