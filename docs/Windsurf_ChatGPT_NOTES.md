# ChatGPT × 實作 Agent 協作筆記

> 本檔案給「未來接手的 ChatGPT / AI 助手」閱讀，說明目前專案狀態與已完成的修改。
>
> 目前主要實作 Agent：Codex（在本機 repo 直接修改程式與 docs）。本檔名暫為 `Windsurf_ChatGPT_NOTES.md`，未來若調整命名可在對應 T 任務中更新本說明。
>
> 維護方式建議：每一個明確的開發任務（feature / bugfix）新增一個小節，簡要說明需求與已改動檔案。

---

## 2025-12-10 默契 / 操作習慣

- snapshot CLI：`npm run snapshot:docs -- --task T-0007`，只打包本機 `docs/*.md`、`docs/terminal_logs/*.txt` 到 `snapshots/`，不進 git；最新驗收已於 2025-12-10 完成。
- 實作 Agent 角色：目前實作由 Codex 執行（取代原本固定稱呼 Windsurf）；使用者只需在 ChatGPT 與實作 Agent 間傳遞指令與回報。
- 編碼：docs 檔案維持 UTF-8（含 BOM 可接受），若再遇亂碼優先用 UTF-8 讀寫。
- 簡化 TODO 記錄：任務條目以「狀態、目標、驗收」為主，避免過長的實作範圍描述；狀態欄位含日期與誰驗證。
- 若開新對話，先看 `docs/PROJECT_TODO.md` 與本檔，快速對齊任務狀態與約定。

## 2025-12-10 任務：T-0011 / T-0012 初始化

- 在 `docs/PROJECT_TODO.md` 增補新的任務條目：
  - `T-0011 fix-corrupted-docs`：修復亂碼 docs、統一 UTF-8。
  - `T-0012 sync-status-docs`：對齊 PROJECT_TODO / PROJECT_STATUS 與實際進度。
- 目前僅新增 TODO 條目，未開始實作內容。commit: a423ba4

## 2025-12-10 任務：T-0012 sync-status-docs（執行中）

- 更新檔案：
  - `docs/PROJECT_TODO.md`：補齊教學任務狀態（v1 已完成）、T-0005 狀態行（news meta 日期/地點 mapping v1），重申 T-0006 blocked、T-0010 ✅。
  - `docs/PROJECT_STATUS.md`：重寫總覽，對齊目前實作（crawl、HTML→Markdown + sutra、teaching/news/magazine adapters、docs snapshot CLI、zh-TW→zh-CN 未實作、legacy data root 待備份、WP/React 未開始）。
- 測試：僅文檔更新，未跑額外測試。
- commit: 86f2021

## 2025-12-11 任務：T-0011 fix-corrupted-docs（PROJECT_STATUS 重寫）

- 更新檔案：`docs/PROJECT_STATUS.md` 完整以 UTF-8 新內容覆蓋，移除亂碼。
- 重點：依 2025-12-10 版本，整理進度總覽、各模組狀態（crawl/inventory、HTML→Markdown + sutra、teaching/news/magazine adapters、docs snapshot CLI、zh-TW→zh-CN 未實作、legacy data root blocked、WP/React 未開始）。
- 測試：僅文檔更新，無額外測試。
- commit: 9329d58

## 2025-12-11 任務：workflow 新增 GitHub RAW 連結規則

- 更新檔案：`docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`，新增「1.7 GitHub RAW 連結規則（給 ChatGPT 用）」。
- 重點：定義 `raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/` 為 RAW base，說明 ChatGPT 讀取方式與失敗時回報原則。
- 測試：僅文檔更新，無額外測試。
- commit: ccfcbad

## 2025-12-12 任務：T-0011 fix-corrupted-docs（其他亂碼 docs 重寫）

- 更新檔案（整檔覆蓋，UTF-8 正常可讀）：
  - `docs/AI_COLLAB_SUMMARY.md`：協作模式總結（角色、流程、真相來源）。
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`：精簡版完整流程與現況。
  - `docs/PENDING_DECISIONS.md`：未決策清單（pipeline、WP 匯入、前端架構等）。
  - `docs/SESSION_CHECKLIST.md`：乾淨工作小抄。
  - `docs/TOOLS_ROLES_AND_BOUNDARIES.md`：角色與邊界重寫。
- 測試：僅文檔更新，無額外測試。
- commit: 5777bf6
---

## 2025-12-08 任務：/turn/sutra/ 經論講解頁專用規則 v1

### 1. 任務需求總結

- 頁面範圍：`/turn/sutra/` 經論講解頁。
- 目標：在不破壞既有通則與測試的前提下，為經論講解頁實作 **sutra 專用規則 v1**。
- 型別／結構約束：
  - 不修改 `src/html/legacy-html-types.ts` 中既有介面名稱與欄位。
  - `HtmlToMarkdownResult` 結構不變，只是在 `verses` 中填值。
  - 不修改 `src/types/anycontent-teaching.ts` 與其他 AnyContent 型別檔案。

### 2. 主要實作內容

#### 2.1 sutra 頁判斷與 context

- 檔案：`src/html/html-to-markdown.ts`
- 新增行為：
  - 以 `LegacyHtmlDocument.url` 判斷 sutra 頁：
    - `const isSutraPage = doc.url.includes("/turn/sutra/");`
  - 建立 `HtmlToMarkdownContext`：
    - `interface HtmlToMarkdownContext { isSutraPage: boolean; verses: string[]; }`
  - 在 `htmlToMarkdown` 中建立：
    - `const verses: string[] = [];`
    - `const context: HtmlToMarkdownContext = { isSutraPage, verses };`
  - 轉換主流程改為：
    - `nodeToMarkdown($, el, context)`（而非舊版無 context 版本）。

#### 2.2 sutra DOM 預處理：錨點正規化

- 新增 `preprocessSutraDom($, $root)`：
  - 僅在 `isSutraPage` 時呼叫。
  - 對 `<a name="...">` 做正規化：
    - 若有 `name` 且沒有 `id`，則設 `id = name`。
    - 之後 `removeAttr("name")`，避免後續同一錨點以 name/id 重複收集。
  - 加註註解：
    - `// 規則來源：HTML_TO_MARKDOWN_RULES_V4.md § 經論講解（/turn/sutra/）`

#### 2.3 collectImagesAndAnchors 調整

- 函式簽名由：
  - `collectImagesAndAnchors($root, baseUrl, images, anchors)`
- 調整為：
  - `collectImagesAndAnchors($, $root, baseUrl, images, anchors)`
- 錨點收集邏輯：
  - 掃描 `a[name], a[id]`。
  - 使用 `const candidate = id || name;`，並以 `!anchors.includes(candidate)` 避免重複。
  - sutra 頁因已在 `preprocessSutraDom` 將 `name` 正規化為 `id`，最終 anchors 中只會收到一次該 id（例如 `"item83"`）。

#### 2.4 sutra 經文段落：`<p class="word17-coffee">` → blockquote + verses

- 目標：
  - 在 sutra 頁，將 `<p class="word17-coffee">行一<br>行二</p>` 轉為：
    - `> 行一`\n`> 行二`
  - 並把該段經文的純文字加入 `result.verses: string[]`。

- 實作細節：
  - 在 `nodeToMarkdown` 的 `case "p"` 中：
    - 若 `context.isSutraPage && $el.hasClass("word17-coffee")`：
      - 呼叫 `sutraParagraphToMarkdownLines($, $el)` 取得：
        - `lines: string[]`：每一行經文（已依 `<br>` 切行、整理空白）。
        - `combinedText: string`：所有行以空白串起來的純文字（例：`"行一 行二"`）。
      - 若 `combinedText` 非空：`context.verses.push(combinedText);`
      - 若 `lines` 非空：輸出：
        - `lines.map((line) => "> " + line).join("\n")`
      - 若沒有有效文字行：回傳空字串。
    - 非 sutra 或非 `word17-coffee` 段落仍使用原本的 `inlineText` 規則。

- `sutraParagraphToMarkdownLines` 行為：
  - 逐一掃描 `<p>` 的子節點：
    - 文字節點：累加到暫存 `current`。
    - `<br>`：將 `current` 正規化（收尾 trim 多餘空白）後 push 到 `rawLines`，並清空 `current`。
    - 其他子元素：呼叫既有的 `inlineText` 抽取純文字並加入 `current`。
  - 結束後處理最後一行，然後：
    - `lines`：
      - 對每行再做一次空白正規化與 trim，過濾空行。
    - `combinedText = lines.join(" ");`

#### 2.5 sutra 段落錨點：同時保留文字與 `<a id="..."></a>`

- 需求：
  - sutra 頁 `body_markdown` 中希望有：
    - `<a id="item83"></a>（八十三）`
  - 同時維持 anchors 有 `"item83"`。

- `nodeToMarkdown` 的 `case "a"` 調整：

  ```ts
  case "a": {
    const id = $el.attr("id");
    const href = $el.attr("href");
    const text = inlineText($, $el);

    if (context.isSutraPage && id && !href) {
      // sutra 頁的段落錨點需在 markdown 中保留 id，並保留原本文字內容
      // 規則來源：HTML_TO_MARKDOWN_RULES_V4.md § 經論講解（/turn/sutra/）
      const anchorHtml = `<a id="${id}"></a>`;
      if (!text) {
        return anchorHtml;
      }
      return `${anchorHtml}${text}`;
    }

    if (href) {
      const label = text || href;
      return `[${label}](${href})`;
    }

    return text;
  }
  ```

- 效果：
  - 原始 HTML：

    ```html
    <a name="item83" class="chinese">（八十三）</a>
    <p class="word17-coffee">行一<br>行二</p>
    ```

  - sutra 流程：
    1. `preprocessSutraDom` 將 `name="item83"` 正規化為 `id="item83"`。
    2. `collectImagesAndAnchors` 將 `"item83"` 收進 `result.anchors`。
    3. `nodeToMarkdown` 對 `<a>` 輸出：`<a id="item83"></a>（八十三）`。
    4. `word17-coffee` 段落轉為：
       - `> 行一`\n`> 行二`。

  - 最終 `body_markdown` 片段類似：

    ```md
    <a id="item83"></a>（八十三）

    > 行一
    > 行二
    ```

#### 2.6 其他通則維持不變

- 原有行為維持：
  - heading：`h1`–`h4` → `#`～`####`。
  - 一般段落：`<p>` → `inlineText`。
  - 列表：`<ul>/<ol>` → `listToMarkdown`（僅多傳入 `context`）。
  - blockquote：仍使用既有邏輯，僅改為呼叫新版 `blockChildrenToMarkdown($, $el, context)`。
  - 連結：有 `href` 照舊輸出 `[text](href)`。
  - 圖片：只從 DOM 中移除並收集到 `images`，不輸出 markdown `![]()`。

---

### 3. 測試調整

- 檔案：`tests/html/html-to-markdown.spec.ts`

#### 3.1 原有三個測試維持

1. `converts simple heading and paragraph`
   - 驗證 h1 + 段落轉換。
2. `collects images but does not embed them in markdown`
   - 驗證 images 被收集、markdown 不含 `![]()`。
3. `collects anchors like item83 from name/id attributes`
   - 驗證 anchors 收集 `"item83"`，並保留一般段落文字。

#### 3.2 新增 sutra 專用測試

- 測試名稱：`"applies sutra-specific rules for word17-coffee paragraphs and anchors"`
- 測試輸入：

  ```html
  <html>
    <body>
      <a name="item83" class="chinese">
        （八十三）
      </a>
      <p class="word17-coffee">行一<br>行二</p>
    </body>
  </html>
  ```

- 測試重點斷言：
  - blockquote：
    - `result.body_markdown` 含 `"> 行一"` 與 `"> 行二"`。
  - verses 收集：
    - 以 `const verses = result.verses ?? [];` 讀取。
    - 斷言 `verses.length > 0`，且 `verses[0]` 同時包含 `"行一"`、`"行二"`。
  - anchors 與 id：
    - `result.anchors` 包含 `"item83"`。
    - `body_markdown` 中包含 `<a id="item83"></a>`（而不是只有純文字）。

---

### 4. 之後給 ChatGPT 的使用建議

未來若有其他任務（例如 blossom / reply 等特殊單元）：

1. 在本檔案新增一個新的章節，例如：
   - `## 2025-12-10 任務：blossom 單元特殊樣式處理`
2. 簡要列出：
   - 需求摘要
   - 預計修改檔案
   - 已完成的實作與測試
3. 把這個檔案（或其中相關章節）貼給 ChatGPT / AI 助手，讓它快速掌握前情。這樣可以避免重複解釋專案背景與既有約束。

---

## 2025-12-08 任務：T-0001 teaching-from-legacy 偈語欄位映射

### 1. 任務需求總結

- 對應 PROJECT_TODO：
  - `T-0001 teaching-from-legacy: 將 htmlToMarkdown 的 verses 映射到 TeachingMeta 偈語欄位`
- 目標：
  - 不修改 `htmlToMarkdown` 的輸入 / 輸出型別與 verses 產生邏輯。
  - 僅在 teaching adapter 中，根據 `HtmlToMarkdownResult.verses` 將偈語資訊填入 `TeachingMeta` 偏好欄位。

### 2. 主要實作內容

- 檔案：`src/adapters/teaching-from-legacy.ts`

  - 讀取 `const verses = mdResult.verses ?? [];`.
  - 新增 helper：`buildTeachingMetaFromVerses(verses, language)`, 回傳 `TeachingMeta`：
    - 無偈語時（`verses.length === 0`）：
      - `ct_has_dharma_verse = "no"`
      - `ct_verse_block_markdown = null`
      - `ct_verse_type = null`
      - `ct_verse_lang = null`
    - 有偈語時（`verses.length >= 1`）：
      - `ct_has_dharma_verse = "yes"`
      - `ct_verse_block_markdown = verses.map(line => "> " + line).join("\n")`
        - 目前 sutra 頁的 verses 會將整段偈語壓成一個元素（例如 `"行一 行二"`），
          因此實際輸出會是單行 `> 行一 行二`。
      - `ct_verse_type = "sutra"`
      - `ct_verse_lang = "zh-tw"`（僅當 `language === "zh-tw"`；其他語言暫時設為 `null`）。
  - 其餘 TeachingContent 結構（圖片欄位、post_type 等）維持原狀。

- 型別約束：
  - 未修改 `HtmlToMarkdownResult` 介面（`verses` 仍為選填 `string[] | undefined`）。
  - 未修改 `src/types/anycontent-teaching.ts` 中 `TeachingMeta` / `TeachingContent` 定義。

### 3. 測試調整

- 檔案：`tests/adapters/teaching-from-legacy.spec.ts`

  - 原有測試：
    - `builds a minimal TeachingContent from legacy HTML`
      - 驗證 TeachingContent 的基本欄位與圖片欄位 mapping。

  - 新增測試：`"maps verses from htmlToMarkdown into TeachingMeta dharma verse fields"`

    - 測試輸入：

      ```html
      <html>
        <body>
          <p class="word17-coffee">行一<br>行二</p>
        </body>
      </html>
      ```

    - 預期行為：
      - sutra 頁的 `htmlToMarkdown` 會將該段偈語轉成：
        - `verses = ["行一 行二"]`（實際內容由 HTML parser 決定，這裡只依 adapter 規格處理）。
      - teaching adapter 轉換後：
        - `meta.ct_has_dharma_verse === "yes"`
        - `meta.ct_verse_block_markdown === "> 行一 行二"`
        - `meta.ct_verse_type === "sutra"`
        - `meta.ct_verse_lang === "zh-tw"`

### 4. 測試方式

- 單檔測試：

  ```bash
  npx vitest tests/adapters/teaching-from-legacy.spec.ts
  ```

- 全專案測試：

  ```bash
  npx vitest
  ```

- 預期：所有 Vitest 測試通過，未放寬型別或修改既有 contract.

---

## 2025-12-08 任務：T-0003 news-from-legacy: 建立 NewsContent adapter 骨架（minimal mapping）

### 1. 任務需求總結

- 對應 PROJECT_TODO：
  - `T-0003 news-from-legacy: 建立 NewsContent adapter 骨架（minimal mapping）`
- 目標：
  - 建立第一版 `news-from-legacy` adapter，將 legacy HTML + htmlToMarkdown 輸出轉成最基本的 `NewsContent` 結構，
    僅實作 minimal mapping，其餘進階欄位留待後續 T 任務處理。

### 2. 主要實作內容

- 檔案：`src/adapters/news-from-legacy.ts`

  - 匯出：
    - `newsFromLegacy(doc: LegacyHtmlDocument, options: NewsFromLegacyOptions): NewsContent`
  - `NewsFromLegacyOptions`：
    - 延伸 `HtmlToMarkdownOptions`，新增：
      - `externalId: string`
      - `language: Language`（沿用 AnyContent 的 `Language` union，目前實際測試以 `"zh-tw"` 為主）
      - `fallbackTitle?: string`
  - 轉換流程：
    - 呼叫 `htmlToMarkdown(doc, markdownOptions)` 取得 `mdResult`。
    - `post_title`：先以 `fallbackTitle ?? deriveTitleFromUrl(doc.url)` 簡單推得，詳細標題規則留待後續任務。
    - `meta: NewsMeta`：僅建立 skeleton，全部日期 / 地點 / 類別欄位先填 `null`：
      - `ct_news_date: null`
      - `ct_event_date_start: null`
      - `ct_event_date_end: null`
      - `ct_event_date_raw: null`
      - `ct_event_location: null`
      - `ct_news_category: null`
    - `NewsContent`：
      - `external_id`：來自 options.externalId。
      - `language`：來自 options.language。
      - `post_type: 'news'`.
      - `old_url: doc.url`.
      - `post_title` 如上。
      - `post_excerpt: null`（暫不從 HTML 推導）。
      - `body_markdown: mdResult.body_markdown`.
      - `featured_image`：取 `mdResult.images[0]?.src ?? null`.
      - `featured_image_caption: null`.
      - `gallery_items`：其餘圖片映射為 `{ url, alt, caption: null }` 陣列。

- 檔案：`tests/adapters/news-from-legacy.spec.ts`

  - 新增測試：`"builds a minimal NewsContent from legacy HTML"`
  - 測試輸入：一個簡單的 legacy news HTML，包含：
    - `<h1>重要公告</h1>`
    - 一段主文 `<p>這是一則新聞內容。</p>`
    - 兩張圖片：一張主圖、一張 gallery 圖。
  - 測試斷言：
    - `news.post_type === 'news'`.
    - `news.language === 'zh-tw'`.
    - `news.old_url === doc.url`.
    - `news.body_markdown` 內含主文文字。
    - 圖片：
      - `featured_image` 包含主圖檔名。
      - `gallery_items.length === 1` 且唯一元素的 `url` 包含 gallery 圖檔名。
    - `meta` skeleton：
      - `ct_news_date` / `ct_event_date_start` / `ct_event_date_end` / `ct_event_date_raw` / `ct_event_location` / `ct_news_category` 皆為 `null`.

### 3. 測試與型別檢查

- 型別檢查：
  - 指令（沿用 T-0002）：
    - `npx tsc --noEmit`

- 測試：
  - 單檔：

    ```bash
    npx vitest tests/adapters/news-from-legacy.spec.ts
    ```

  - 全專案：

    ```bash
    npx vitest
    ```

- 後續若在 news adapter 上新增日期 / 地點 / 類別等邏輯，建議再開新的 T 任務，而不直接更動本小節描述.

---

## 2025-12-08 任務：T-0004 magazine-from-legacy: 建立 MagazineContent adapter 骨架（minimal mapping）

### 1. 任務需求總結

- 對應 PROJECT_TODO：
  - `T-0004 magazine-from-legacy: 建立 MagazineContent adapter 骨架（minimal mapping）`
- 目標：
  - 建立第一版 `magazine-from-legacy` adapter，從 legacy HTML + htmlToMarkdown 輸出建立最基本的 `MagazineContent`，
    僅實作 minimal mapping，期數 / 區塊 / 作者等進階欄位留給後續 T 任務補強。

### 2. 主要實作內容

- 檔案：`src/adapters/magazine-from-legacy.ts`

  - 匯出：
    - `magazineFromLegacy(doc: LegacyHtmlDocument, options: MagazineFromLegacyOptions): MagazineContent`
  - `MagazineFromLegacyOptions`：
    - 延伸 `HtmlToMarkdownOptions`，新增：
      - `externalId: string`
      - `language: Language`（沿用 AnyContent 的 `Language` union，目前實際測試以 `"zh-tw"` 為主）
      - `fallbackTitle?: string`
  - 轉換流程：
    - 呼叫 `htmlToMarkdown(doc, markdownOptions)` 取得 `mdResult`。
    - `post_title`：先以 `fallbackTitle ?? deriveTitleFromUrl(doc.url)` 簡單推得。
    - `meta: MagazineMeta`：僅建立 skeleton，issue / article 相關欄位先填 `null` / `undefined`：
      - `ct_magazine_level: "issue"`（暫定當前頁代表整期雜誌）。
      - `ct_magazine_issue_no: null`
      - `ct_magazine_year: null`
      - `ct_magazine_month: null`
      - `ct_magazine_issue_label: null`
      - `ct_issue_items: undefined`
      - `ct_magazine_section: null`
      - `ct_magazine_type: null`
      - `ct_author_name: null`
    - `MagazineContent`：
      - `external_id`：來自 options.externalId。
      - `language`：來自 options.language。
      - `post_type: 'magazine'`。
      - `old_url: doc.url`。
      - `post_title` 如上。
      - `post_excerpt: null`（暫不從 HTML 推導）。
      - `body_markdown: mdResult.body_markdown`。
      - `featured_image`：取 `mdResult.images[0]?.src ?? null`。
      - `featured_image_caption: null`。
      - `gallery_items`：其餘圖片映射為 `{ url, alt, caption: null }` 陣列。

- 檔案：`tests/adapters/magazine-from-legacy.spec.ts`

  - 新增測試：`"builds a minimal MagazineContent from legacy HTML"`
  - 測試輸入：一個簡單的 legacy magazine HTML，包含：
    - `<h1>雜誌第一期</h1>`
    - 一段主文 `<p>這是雜誌內容的摘要段落。</p>`
    - 兩張圖片：一張封面、一張內頁圖。
  - 測試斷言：
    - `magazine.post_type === 'magazine'`。
    - `magazine.language === 'zh-tw'`。
    - `magazine.old_url === doc.url`。
    - `magazine.body_markdown` 內含主文文字。
    - 圖片：
      - `featured_image` 包含封面檔名。
      - `gallery_items.length === 1` 且唯一元素的 `url` 包含內頁圖檔名。
    - `meta` skeleton：
      - `ct_magazine_issue_no` / `ct_magazine_year` / `ct_magazine_month` / `ct_magazine_issue_label` 為 `null`。
      - `ct_issue_items` 為 `undefined`。
      - `ct_magazine_section` / `ct_magazine_type` / `ct_author_name` 為 `null`。

### 3. 測試與型別檢查

- 型別檢查：
  - 指令（沿用 T-0002）：
    - `npx tsc --noEmit`

- 測試：
  - 單檔：

    ```bash
    npx vitest tests/adapters/magazine-from-legacy.spec.ts
    ```

  - 全專案：

    ```bash
- 後續若在 magazine adapter 上新增 issue / section / author 等邏輯，建議再開新的 T 任務，而不直接更動本小節描述。

---

## 2025-12-08 任務：T-0005 news-from-legacy: 映射 NewsMeta 日期與地點欄位（v1）

### 1. 任務需求總結

- 對應 PROJECT_TODO：
  - `T-0005 news-from-legacy: 映射 NewsMeta 日期與地點欄位（v1）`
- 目標：
  - 在現有 `news-from-legacy` 骨架上，實作第一版日期與地點欄位 mapping，
    讓 `NewsMeta` 至少能填入「新聞日期」與「活動日期 / 地點」等基本資訊。

### 2. 主要實作內容

- 檔案：`src/adapters/news-from-legacy.ts`

  - 新增 helper：`parseNewsDateAndLocationFromHtml(html: string)`，回傳：

    ```ts
    interface ParsedNewsDateLocation {
      newsDate: string | null;
      eventDateStart: string | null;
      eventDateEnd: string | null;
      eventDateRaw: string | null;
      eventLocation: string | null;
    }
    ```

  - 解析策略（v1）：
    - 僅針對最簡單且常見的樣板：
      - 文字中出現：`日期：YYYY-MM-DD`（可選 `~` / `～` / `-` 再接第二個日期）。
      - 文字中出現：`地點：XXXX`，以 `。` / `；` / `;` 或字串結尾作為終止。
    - 步驟：
      1. 將 HTML 中所有標籤移除，取得純文字，並將空白壓成單行字串。
      2. 使用正則：
         - 日期：`/日期：\s*([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})(?:\s*[~～─-]\s*([0-9]{4}-[0-9]{1,2}-[0-9]{1,2}))?/`
         - 地點：`/地點：\s*([^。；;]+)/`
    - 對應欄位填值：
      - 若有日期：
        - `ct_news_date = 第一個日期`
        - `ct_event_date_start = 第一個日期`
        - `ct_event_date_end = 第二個日期`（若存在，否則為 `null`）
        - `ct_event_date_raw = 去掉「日期：」前綴後的原始日期字串`
      - 若有地點：
        - `ct_event_location = 地點後方文字（去尾端標點與多餘空白）`
      - 若無匹配到，保持 `null`。

  - `NewsMeta` 組裝調整：

    ```ts
    const parsed = parseNewsDateAndLocationFromHtml(doc.html);

    const meta: NewsMeta = {
      ct_collection_key: undefined,
      ct_collection_order: undefined,
      ct_news_date: parsed.newsDate,
      ct_event_date_start: parsed.eventDateStart,
      ct_event_date_end: parsed.eventDateEnd,
      ct_event_date_raw: parsed.eventDateRaw,
      ct_event_location: parsed.eventLocation,
      ct_news_category: null,
    };
    ```

### 3. 測試調整

- 檔案：`tests/adapters/news-from-legacy.spec.ts`

  - 原有測試：`"builds a minimal NewsContent from legacy HTML"` 維持，用於確認 skeleton 行為仍正確。

  - 新增測試：`"maps basic date and location fields into NewsMeta when present in HTML (T-0005 v1)"`

    - 測試輸入（代表性 news HTML）：

      ```html
      <html>
        <body>
          <div class="news-meta">
            日期：2025-03-14 地點：台北講堂
          </div>
          <p>這是一則含有日期與地點資訊的新聞。</p>
        </body>
      </html>
      ```

    - 預期行為：
      - `ct_news_date === "2025-03-14"`
      - `ct_event_date_start === "2025-03-14"`
      - `ct_event_date_end === null`（因為只出現單一日期）
      - `ct_event_date_raw === "2025-03-14"`
      - `ct_event_location === "台北講堂"`

### 4. 測試與型別檢查

- 型別檢查：
  - 建議指令：
    - `npx tsc --noEmit`

- 測試：
  - 單檔：

    ```bash
    npx vitest tests/adapters/news-from-legacy.spec.ts
    ```

  - 全專案：

    ```bash
    npx vitest
    ```

- 之後若要支援更複雜的日期範圍或多段地點描述，建議再開新 T 任務，並在本檔記錄新的解析策略.

---

## 2025-12-08 任務：T-0006 teaching-from-legacy CLI（HTML → AnyContent 範例）

### 1. 任務需求總結

- 對應 PROJECT_TODO（口頭描述）：
  - `T-0006 teaching-from-legacy CLI（HTML → AnyContent 範例）`
- 目標：
  - 提供一支最小可用的 teaching 轉換 CLI，從本機 legacy teaching HTML 檔產生 `TeachingContent` / `AnyContent` JSON，
    作為日後批次轉換工具與 pipeline 的示範。

### 2. 主要實作內容

- 檔案：`tools/convert/teaching-html-to-anycontent.ts`

  - 功能：
    - 從本機讀取一個 legacy teaching HTML 檔。
    - 組裝 `LegacyHtmlDocument`，呼叫 `teachingFromLegacy` adapter（內部會再呼叫 `htmlToMarkdown`）。
    - 將結果輸出為 JSON（stdout 或指定輸出檔）。

  - CLI 介面（v1）：

    ```bash
    ts-node tools/convert/teaching-html-to-anycontent.ts \
      --in path/to/legacy-teaching.html \
      --external-id teaching_example_0001 \
      --language zh-tw \
      --out data/anycontent/teaching/example-0001.json
    ```

    - 參數說明：
      - `--in`（必填）：legacy teaching HTML 檔案路徑。
      - `--external-id`（選填）：預設為輸入檔名；實務上建議由外層 pipeline 決定。
      - `--language`（選填）：預設 `zh-tw`，需符合 `Language` union。
      - `--out`（選填）：輸出 JSON 檔案路徑；若未指定，則直接輸出到 stdout。
      - `--url`（選填）：用於填入 `LegacyHtmlDocument.url`，若未給則使用 `file://<絕對路徑>`。

  - 轉換流程：

    ```ts
    const doc: LegacyHtmlDocument = {
      url: url ?? `file://${absInPath.replace(/\\/g, "/")}`,
      html,
    };

    const teaching = teachingFromLegacy(doc, {
      externalId,
      language,
    });
    ```

    - `teachingFromLegacy` 會：
      - 呼叫 `htmlToMarkdown` 取得 `body_markdown`、`images`、（可能的）`verses`。
      - 依 T-0001 的規則，將 `verses` 映射到 `TeachingMeta` 偈語欄位。
      - 組裝 `TeachingContent` 結構（post_type / images / meta 等）。

### 3. 使用與限制說明

- 目前 CLI 僅支援「單一檔案 → 單一 JSON」的使用情境，適合作為：
  - 手動驗證 teaching adapter 行為。
  - 示範未來批次轉換工具（例如：讀取一整個 docroot 路徑）。

- URL 欄位：
  - 若呼叫時未指定 `--url`，則預設使用：

    ```
    file:///.../absolute/path/to/legacy-teaching.html
    ```

  - 實際上正式 pipeline 應該由外層流程提供對應的舊站 URL（例如 `https://www.ctworld.org/turn/xxx.htm`）。

- 後續若要擴充：
  - 可以新增：
    - `--stdout` / `--pretty` 等旗標。
    - 以 glob / 目錄為輸入，一次轉多個檔案。
  - 建議在 `PROJECT_TODO.md` 新增對應 T 任務，而不是直接在本小節擴寫行為。


---

## 2025-12-09 任務：T-0007 docs-snapshot-cli：自動產生 docs snapshot ZIP

### 1. 任務需求總結

- 對應 PROJECT_TODO：
  - `T-0007 docs-snapshot-cli: 自動產生 docs snapshot ZIP（給 ChatGPT 用）`
- 目標：
  - 在本機 repo 中提供一個簡單 CLI / npm script，讓實作 Agent 可以用單一指令產生「本次任務專用的 docs snapshot ZIP」。
  - ZIP 只打包 `docs/*.md` 與 `docs/terminal_logs/*.txt`，輸出到 `snapshots/`，**不加入 git**。
  - 之後你要給 ChatGPT 看最新狀態，只要上傳對應的 snapshot ZIP 即可。

### 2. 主要實作與修改檔案

- `tools/docs-snapshot/make-docs-snapshot.ts`
  - 新增 docs snapshot CLI：
    - 預設輸出目錄：`snapshots/`
    - 檔名格式：`ctworld-docs-T-xxxx-YYYY-MM-DD-vN.zip`
    - 必填參數：
      - `--task T-xxxx`：對應本次任務編號（會寫進檔名）。
    - 打包內容：
      - 所有 `docs/*.md`
      - 所有 `docs/terminal_logs/*.txt`
    - 不會包含 `node_modules`、`dist` 等大型目錄。

- `package.json`
  - 新增 npm script：

    ```jsonc
    "scripts": {
      // ...
      "snapshot:docs": "ts-node tools/docs-snapshot/make-docs-snapshot.ts"
    }
    ```

- `docs/PROJECT_TODO.md`
  - 將 T-0007 狀態改為「✅ 已完成」並補上實際 CLI 行為與驗收方式說明。

- `docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`
  - 記錄第一次成功執行 `npm run snapshot:docs -- --task T-0007` 的終端輸出。
- 驗收：已於 2025-12-10 跑 `npm run snapshot:docs -- --task T-0007`，產生 zip 並確認內容。

### 3. 使用方式備忘

- 實作 Agent 在每個 T 任務收尾時，如果需要給 ChatGPT 看最新 docs：
  1. 先依照任務需求更新 `docs/*.md` 與 `docs/terminal_logs/*.txt`。
  2. 在專案根目錄執行：

     ```bash
     npm run snapshot:docs -- --task T-xxxx
     ```

  3. 檢查 `snapshots/` 下多了一個類似：

     ```text
     snapshots/ctworld-docs-T-0007-2025-12-09-v1.zip
     ```

  4. **不要把 snapshots/ 加入 git**，只在本機保留，用來上傳給 ChatGPT。

- 之後你開新對話時，只要：
  - 上傳最新的 docs snapshot ZIP。
  - 附上一段 `[Agent 回報摘要]`（含 T 任務編號、變更檔案列表、主要測試結果與 snapshot 檔名），
  - 就能讓新的 ChatGPT 對話直接接上這一輪完成的工作。

---

## 2025-12-09 任務：T-0007 docs-snapshot-cli：自動產生 docs snapshot ZIP

### 1. 任務需求總結

- 對應 PROJECT_TODO：
  - `T-0007 docs-snapshot-cli: 自動產生 docs snapshot ZIP（給 ChatGPT 用）`
- 目標：
  - 在本機 repo 中提供一個簡單 CLI / npm script，讓實作 Agent 可以用單一指令產生「本次任務專用的 docs snapshot ZIP」。
  - ZIP 只打包 `docs/*.md` 與 `docs/terminal_logs/*.txt`，輸出到 `snapshots/`，**不加入 git**。
  - 之後要給 ChatGPT 看最新狀態，只要上傳對應的 snapshot ZIP 即可。

### 2. 主要實作與修改檔案

- `tools/docs-snapshot/make-docs-snapshot.ts`
  - 新增 docs snapshot CLI：
    - 預設輸出目錄：`snapshots/`
    - 檔名格式：`ctworld-docs-T-xxxx-YYYY-MM-DD-vN.zip`
    - 必填參數：
      - `--task T-xxxx`：對應本次任務編號（會寫進檔名）。
    - 打包內容：
      - 所有 `docs/*.md`
      - 所有 `docs/terminal_logs/*.txt`
    - 不會包含 `node_modules`、`dist` 等大型目錄。

- `package.json`
  - 新增 npm script：

    ```jsonc
    "scripts": {
      // ...
      "snapshot:docs": "ts-node tools/docs-snapshot/make-docs-snapshot.ts"
    }
    ```

- `docs/PROJECT_TODO.md`
  - 將 T-0007 狀態改為「✅ 已完成」，並補上實際 CLI 行為與驗收方式說明。

- `docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`
  - 記錄第一次成功執行 `npm run snapshot:docs -- --task T-0007` 的終端輸出。

### 3. 使用方式備忘

- 實作 Agent 在每個 T 任務收尾時，如果需要給 ChatGPT 看最新 docs，可以：

  1. 先依照任務需求更新 `docs/*.md` 與 `docs/terminal_logs/*.txt`。
  2. 在專案根目錄執行：

     ```bash
     npm run snapshot:docs -- --task T-xxxx
     ```

  3. 檢查 `snapshots/` 下多了一個類似：

     ```text
     snapshots/ctworld-docs-T-0007-2025-12-09-v1.zip
     ```

  4. **不要把 snapshots/ 加入 git**，只在本機保留，用來上傳給 ChatGPT。

- 之後你開新對話時，只要：

  - 上傳最新的 docs snapshot ZIP。
  - 附上一段 `[Agent 回報摘要]`（含 T 任務編號、變更檔案列表、主要測試結果與 snapshot 檔名），

就能讓新的 ChatGPT 對話直接接上這一輪完成的工作。

