# PROJECT_STATUS（目前專案進度摘要）

> 本檔案給「未來接手的自己 / ChatGPT / Windsurf」快速掌握目前狀態。  
> 內容只放「已完成 vs 進行中 vs 下一步」，詳細規格請看其他 docs。

---

## 1. 整體狀態一眼看

- ✅ 專案 repo 已初始化：`ctcm-website-frontend`
  - 前端：React + Vite 基本架構已就位（但尚未接 Headless 內容）。
  - `docs/*.md` 已有完整第一輪規格。
- ✅ 爬蟲與檔案 inventory 工具已就緒
  - `tools/crawl/crawl-ctworld.ts`
  - `tools/crawl/filesystem-inventory.ts`
  - `tools/crawl/diff-crawl-vs-files.ts`
  - npm scripts：
    - `crawl:ctworld` / `inventory:fs` / `diff:crawl-vs-fs`
- ✅ HTML → Markdown 核心函式已實作第一版
  - `src/html/html-to-markdown.ts`
  - 覆蓋「通則」與 `/turn/sutra/` 專用規則 v1。
  - 對應規格：`docs/HTML_TO_MARKDOWN_RULES_V4.md`
- ✅ AnyContent teaching 型別與 adapter 已完成 v1
  - 型別：`src/types/anycontent-teaching.ts`
    - `Language = "zh-tw" | "zh-cn" | "en" | "ja"`
    - `TeachingMeta` / `TeachingContent` 結構穩定，可視為 contract。
  - adapter：`src/adapters/teaching-from-legacy.ts`
    - 輸入：`LegacyHtmlDocument`（url + html）
    - 輸出：`TeachingContent`
- ✅ 測試基礎已建立
  - `tests/html/html-to-markdown.spec.ts`
  - `tests/adapters/teaching-from-legacy.spec.ts`
  - 已安裝 `vitest`，可用 `npx vitest` 或 `npm test` 跑測試。
- ✅ 三方協作工作流已寫成文件
  - `docs/WORKFLOW_CHATGPT_GITHUB_WINDSURF.md`
  - `docs/AI_COLLAB_SUMMARY.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`（Windsurf 已寫第一個 sutra 任務小節）

---

## 2. 各階段詳細狀態

### 2.1 爬蟲與舊站檔案 inventory

**已完成**

- `tools/crawl/crawl-ctworld.ts`
  - BFS 爬 `https://www.ctworld.org` / `ctworld.org.tw`
  - 參數：
    - `--base-url`
    - `--out`
    - `--max-depth`
    - `--max-urls`
    - `--delay-ms`
  - 只抓 HTML 頁面，結果輸出 JSON + CSV。

- `tools/crawl/filesystem-inventory.ts`
  - 從本機 `./ctworld-docroot` 掃出所有 `.htm / .html` 檔。
  - 產生 `all-files.json` / `.csv`。

- `tools/crawl/diff-crawl-vs-files.ts`
  - 比對「線上實際抓到的 URL」 vs 「本機 docroot 檔案」。
  - 找出：
    - 線上有但本機沒有
    - 本機有但線上沒爬到

**下一步建議**

- [ ] 寫一個小的 `docs/crawl-and-inventory.md`（目前只有任務說明，還沒正式 doc）：
  - 寫清楚「如何使用這三個工具做全站盤點」。
  - 補充「如何限制 max-urls 做抽樣」。

---

### 2.2 HTML → Markdown（`htmlToMarkdown`）

**已完成**

- 通則：
  - 將 `<h1>~<h6>`, `<p>`, `<ul>/<ol>/<li>`, `<a>`, `<img>`, `<blockquote>` 轉為標準 Markdown。
  - 收集：
    - `images: HtmlImageInfo[]`
    - `anchors: string[]`
    - `verses: string[]`（專門給偈語／經文使用）
- `/turn/sutra/` 專用規則 v1（記錄於 `docs/Windsurf_ChatGPT_NOTES.md`）：
  - 以 URL 包含 `/turn/sutra/` 判斷 sutra 頁。
  - `preprocessSutraDom()`：
    - 正規化 `<a name="item83">` → `id="item83"`，並避免重複收集錨點。
  - `<p class="word17-coffee">`：
    - 轉為逐行 `> ...` blockquote。
    - 同時把整段文字存進 `result.verses[]`。
  - 測試：
    - `tests/html/html-to-markdown.spec.ts` 中有 sutra 專用案例。

**進行中／待做**

- 其他單元的特殊 class 還沒實作：
  - `blossom`、`reply`、`chan7` 七日行程、`佛教藝術`、祖師法語等。
- 這些都已在 `HTML_TO_MARKDOWN_RULES_V4.md` 附錄裡有規則，只是程式尚未補完。

---

### 2.3 HTML → AnyContent JSON（目前 focused 在 teaching）

**已完成**

- `src/types/anycontent-teaching.ts`
  - 定義 `Language`, `TeachingMeta`, `TeachingContent`。
  - 與 `docs/CONTENT_SCHEMA.md` 對齊。

- `src/adapters/teaching-from-legacy.ts`
  - `teachingFromLegacy(doc, { externalId, language, fallbackTitle })`：
    - 呼叫 `htmlToMarkdown` 得到：
      - `body_markdown`
      - `images[]`
      - `anchors[]`
      - `verses[]`（暫時未用，之後可寫入 `ct_verse_*`）
    - 填入 `TeachingContent`：
      - `external_id = externalId`
      - `language` 來自外層（必須是 `Language` union）
      - `old_url = doc.url`
      - `post_title` 先用 `fallbackTitle` 或 URL 推導
      - `featured_image = 第一張圖`
      - `gallery_items = 其餘圖片`
      - `meta` 裡的 `ct_*` 欄位先填 `null` / `undefined`，等未來 adapter 更精細解析。

**下一步建議**

- [ ] 把 `verses` 寫入 `TeachingMeta` 的 `ct_has_dharma_verse`, `ct_verse_block_markdown`, `ct_verse_type` 等。
- [ ] 為其他 post_type 寫 AnyContent 型別與 adapter：
  - `src/types/anycontent-news.ts` / `src/adapters/news-from-legacy.ts`
  - `src/types/anycontent-magazine.ts` / `src/adapters/magazine-from-legacy.ts`
  - …

---

### 2.4 zh-tw → zh-cn pipeline

**已完成（規格）**

- `docs/ZH_TW_TO_ZH_CN_PIPELINE.md` 描述：
  - 如何從 `-gb` URL 建立 `baseUrl ↔ gbUrl` 對應。
  - 只抓繁中 HTML，簡中用 OpenCC 從 zh-tw JSON 轉。
  - 哪些欄位要轉（`post_title`, `body_markdown`, `meta` 中中文欄位…），哪些不能轉（ID, URL 等）。
  - WordPress + Polylang 對應策略。

**尚未實作程式**

- 真正的 `zh-tw → zh-cn` Node 工具尚未實作（例如 `tools/convert/zh-tw-to-zh-cn.ts`）。
- WordPress 匯入腳本也尚未寫（WP-CLI / plugin）。

---

### 2.5 WordPress 匯入與 Polylang / Redirect

**目前狀態**

- 架構與規則已在以下文件描述：
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`（本檔）
  - `docs/CONTENT_SCHEMA.md`
  - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
- 實際的 WP-CLI / plugin code 尚未開始。

**未來方向**

- 會有一個 `tools/wp-import/…` 或 WordPress plugin：
  - 讀取 JSON（AnyContent）。
  - 建立各 post_type。
  - 設定 Polylang 語言與翻譯關係。
  - 寫入舊站 `old_url` / `-gb` URL 供 redirect 使用。

---

## 3. 建議下一步任務（供 ChatGPT / Windsurf 排程）

1. **補 strong contract：AnyContent 其他 post_type 型別**
   - 建立 `src/types/anycontent-news.ts`, `src/types/anycontent-magazine.ts`…
2. **擴充 htmlToMarkdown：blossom / reply / chan7 等單元專用規則 v1**
   - 每次只挑一個單元，實作＆加測試。
3. **實作 `zh-tw → zh-cn` 轉換工具 v1**
   - 先針對 teaching 做一條完整 pipeline：`HTML → TeachingContent(zh-tw) → TeachingContent(zh-cn)`。
4. **規劃 WordPress importer skeleton**
   - 先寫 docs + PHP / WP-CLI 骨架，不急著實作細節。
