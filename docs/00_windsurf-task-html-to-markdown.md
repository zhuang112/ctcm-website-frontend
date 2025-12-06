# windsurf-task-html-to-markdown.md

> 給 Windsurf / Cursor 的任務描述：實作 html-to-markdown.ts 架構與骨架程式

你現在在一個 Node.js + TypeScript 專案裡，這個 repo 的目標是：

「把 ctworld.org / ctworld.org.tw 舊站 HTML 轉成統一的 JSON 結構（AnyContent），後續會匯入 Headless WordPress。」

請把下面幾份文件視為**權威規格**，所有實作都要遵守：

- `docs/COMPLETE_PROJECT_WORKFLOW.md` (vNext)
- `docs/CONTENT_SCHEMA.md` (vNext)
- `docs/HTML_TO_MARKDOWN_RULES_V4.md`
- `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`（只做概念參考，不影響 html 解析）

---

## 目標

實作一整套「HTML → AnyContent JSON（zh-TW）」的轉換骨架，包含：

- 對外主要入口：`htmlToContentJson()`
- URL 分類（post_type / collection）
- 主內容區塊擷取
- 共用 HTML→Markdown 核心
- 各 post_type 的 adapter（meta 填寫）

重點是**架構清楚、型別完整、方便之後擴充**，細節 parser 可以先用 TODO 標註，不必一次寫完所有 case。

---

## 目標檔案（建議結構）

請在 `src/convert/` 底下建立下列檔案（檔名可以微調，但請保持職責分離）：

- `src/convert/html-to-markdown.ts`                ← 對外主要入口
- `src/convert/classify-url.ts`                   ← URL → post_type / collection 判斷
- `src/convert/extract-main-content.ts`           ← 從整頁 DOM 找出主內容 container
- `src/convert/html-to-markdown-core.ts`          ← 共用「全域清理＋HTML→Markdown」邏輯
- `src/convert/post-type-adapters/teaching-adapter.ts`
- `src/convert/post-type-adapters/news-adapter.ts`
- `src/convert/post-type-adapters/magazine-issue-adapter.ts`
- `src/convert/post-type-adapters/magazine-article-adapter.ts`
- `src/convert/post-type-adapters/branch-adapter.ts`
- `src/convert/post-type-adapters/gallery-adapter.ts`
- `src/convert/post-type-adapters/resource-adapter.ts`
- `src/convert/post-type-adapters/download-adapter.ts`
- `src/convert/post-type-adapters/index-page-adapter.ts`

你可以依照實際情況調整目錄結構，只要責任分明、可讀性高即可。

---

## 已知規格重點（請依 docs 落實，不要自行發明新的 schema）

1. JSON 結構請完全對齊 `docs/CONTENT_SCHEMA.md` 裡的 TypeScript 定義：
   - `AnyContent`
   - 各 post_type 專用 meta：
     - `TeachingMeta`, `NewsMeta`, `MagazineMeta`, `BranchMeta`, `GalleryMeta`, `ResourceMeta`, `DownloadMeta`, `IndexPageMeta`
2. HTML 解析與 Markdown 規則請完全遵守 `docs/HTML_TO_MARKDOWN_RULES_V4.md`：
   - 全域清理：移除 nav/footer/script/form 等區塊
   - 表格：
     - 版面用 table 要 unwrap
     - 真正資料用 table 視情況處理或交給 `index_page`
   - 圖片：
     - **圖片不輸出成 Markdown**，全部丟到 JSON：
       - 第一張 → `featured_image` + `featured_image_caption`
       - 其餘 → `gallery_items[]`
     - caption 只存在 JSON，不進 `body_markdown`
   - 注意各 post_type 的特殊規則：
     - `teaching`：偈語抽出為 `ct_verse_block_markdown` 等 meta
     - `news`：日期區間 / 地點 抽成 `ct_event_date_start`, `ct_event_date_end` 等
     - `magazine`：issue / article 雙層模型（`ct_magazine_level` + `ct_issue_items[]`）
     - `branch`：地址、電話、交通資訊等結構化欄位
     - `gallery`：相簿日期 / 地點 meta
     - `resource`：e-Books / 食譜，尤其是食譜要拆 `ingredients` / `steps`
     - `download`：桌布多解析度下載 `ct_wallpaper_files[]`
     - `index_page`：只留 debug 說明，列表資料不作為前端主要來源

---

## 1. html-to-markdown.ts：對外 API

請在 `src/convert/html-to-markdown.ts` 中實作對外主要入口：

```ts
import { AnyContent } from "../types/CONTENT_SCHEMA";
import type { PostType } from "../types/CONTENT_SCHEMA";

export interface HtmlToMarkdownOptions {
  url: string;          // 原始 HTML URL（繁體 base_url）
  html: string;         // 完整 HTML 字串
}

/**
 * 將單一 HTML 頁面轉成 AnyContent JSON（zh-TW 版本）
 *
 * 步驟：
 * 1. 解析 URL → 判斷 post_type / collection_key (classify-url.ts)
 * 2. 解析 HTML → Cheerio DOM
 * 3. 擷取主內容 container (extract-main-content.ts)
 * 4. 執行全域清理＋共用 HTML→Markdown 轉換 (html-to-markdown-core.ts)
 * 5. 依 post_type 呼叫對應 adapter，組出 meta / featured_image / gallery_items 等欄位
 * 6. 組合成 AnyContent 回傳
 */
export function htmlToContentJson(
  options: HtmlToMarkdownOptions
): AnyContent {
  // TODO: 實作主流程骨架
  // - parse HTML → $
  // - classify URL → postType, collectionKey
  // - extract main content root
  // - run convertDomToMarkdown
  // - switch(postType) 呼叫對應 adapter
  // - 回傳組合好的 AnyContent
}
```

請避免在這支檔案裡塞太多細節，主流程可以保持高階、清楚。

---

## 2. classify-url.ts：判斷 post_type / collection

目的：從 URL path 判斷出 post_type 與 collection key。規則請依 `COMPLETE_PROJECT_WORKFLOW.md` 第 4 節。

```ts
import type { PostType } from "../types/CONTENT_SCHEMA";

export interface UrlClassification {
  postType: PostType;           // 'teaching' | 'news' | 'magazine' | ...
  collectionKey?: string;       // sutra_stories / chan_koans / buddhist_ebooks / ...
}

export function classifyUrl(url: string): UrlClassification {
  // TODO: 根據 path 判斷 postType 與 collectionKey
  // 例：
  // - /sutra_stories/ → teaching + sutra_stories
  // - /chan_koans/ → teaching + chan_koans
  // - /dialogue/ → news
  // - /monthly/ → magazine
  // - /108/ → branch
  // - /arts/desktop/ → download (wallpapers)
  // - /Buddhist%20e-Books/ → resource (ebook)
}
```

---

## 3. extract-main-content.ts：找主內容 container

目的：從整個 Cheerio DOM 找出「正文所在的主要節點」，作為 HTML→Markdown 的起點。

依規格：
- 先移除 header/nav/footer/sitemap/form 等非主體。
- 利用文字密度 / DOM 結構尋找中間主欄。

```ts
import type { CheerioAPI, Element } from "cheerio";

/**
 * 對應 COMPLETE_PROJECT_WORKFLOW.md §3.2 與 HTML_TO_MARKDOWN_RULES_V4.md §1
 */
export function extractMainContentRoot($: CheerioAPI): Element {
  // TODO:
  // - 移除 script/style/noscript/form
  // - 移除明顯 nav/footer/sitemap 區塊
  // - 以簡單 heuristic 選出文字量最大的 <td> 或 <div>
  // - 回傳該 Element
}
```

可以先實作一個簡單、可運作的 heuristic，之後再針對特殊頁型調整。

---

## 4. html-to-markdown-core.ts：共用 HTML→Markdown 邏輯

目的：把主內容 root 轉成：

- `bodyMarkdown`
- `featuredImage` / `featuredImageCaption`
- `galleryItems[]`

並處理全域清理（table unwrap、行內元素轉 Markdown、移除多餘空白）。

```ts
import type { CheerioAPI, Element } from "cheerio";
import type { GalleryItem } from "../types/CONTENT_SCHEMA";

export interface CoreConvertResult {
  bodyMarkdown: string;
  featuredImage?: string;
  featuredImageCaption?: string | null;
  galleryItems: GalleryItem[];
}

/**
 * 將主內容節點轉成 Markdown + 圖片資訊
 *
 * 對應 HTML_TO_MARKDOWN_RULES_V4.md：
 * - §1 全域清理（移除 script/style/nav/footer/form 等）
 * - §2 區塊元素 → Markdown
 * - §3 連結處理
 * - §4 圖片與圖說（圖片不進 Markdown）
 */
export function convertDomToMarkdown(
  $: CheerioAPI,
  root: Element
): CoreConvertResult {
  // TODO: 骨架
  // - 掃描 root 內所有 <img>，解析成 featuredImage / galleryItems（含 caption）
  // - 將圖片節點從 DOM 中移除（避免變成空白段落）
  // - 針對剩餘內容，依規則轉成 Markdown 字串
  // - 回傳 CoreConvertResult
}
```

你可以先實作好基本的：

- `<p>` / `<br>` / `<h2>/<h3>` → Markdown
- `<ul>/<ol>` → Markdown 列表
- `<blockquote>` → `>`
- 其他少見標籤暫時保留原文字或簡單處理，之後再針對案例加強。

---

## 5. post-type-adapters：填 meta 的地方

每種 `post_type` 一個 adapter。這些檔案的責任是：

- 接收：
  - URL
  - Cheerio DOM
  - `CoreConvertResult`
  - 基本 meta（例如 `collection_key`）
- 輸出：
  - 完整的 `TeachingContent` / `NewsContent` / `MagazineContent` 等等。

### 5.1 teaching-adapter.ts（示例）

```ts
import type { CheerioAPI } from "cheerio";
import {
  TeachingContent,
  TeachingMeta,
  BaseMeta,
} from "../types/CONTENT_SCHEMA";
import type { CoreConvertResult } from "./html-to-markdown-core";

/**
 * 對應 HTML_TO_MARKDOWN_RULES_V4.md §5.1 teaching
 */
export function buildTeachingContent(options: {
  $: CheerioAPI;
  url: string;
  core: CoreConvertResult;
  baseMeta: BaseMeta;  // 至少包含 collection_key 等
  externalId: string;
  oldUrl: string;
}): TeachingContent {
  const { $, url, core, baseMeta, externalId, oldUrl } = options;

  const meta: TeachingMeta = {
    ...baseMeta,
    // TODO: 從 DOM 解析講師名稱 / 日期 / 地點 / 經典名稱等
    // ct_speaker_name: ...
    // ct_event_date: ...
    // ct_location: ...
    // ct_sutra_reference: ...
    // 偵測偈語區塊，抽出成 ct_verse_block_markdown 等
  };

  const content: TeachingContent = {
    external_id: externalId,
    language: "zh-TW",
    post_type: "teaching",
    old_url: oldUrl,

    post_title: "",        // TODO: 由 <title> 或頁面主標題取得
    post_excerpt: "",      // TODO: 可以先留空或從前幾段摘要
    body_markdown: core.bodyMarkdown,

    featured_image: core.featuredImage,
    featured_image_caption: core.featuredImageCaption,
    gallery_items: core.galleryItems,

    meta,
    seo: undefined,
    multilingual: undefined,
  };

  return content;
}
```

其他 adapter 類似：

- `news-adapter.ts`：重點是日期 / 地點 / 分院 / 類別。
- `magazine-issue-adapter.ts`：解析期數、年分、月份、`ct_issue_items[]`。
- `magazine-article-adapter.ts`：欄位名、期數、作者。
- `branch-adapter.ts`：地址、電話、交通資訊。
- `gallery-adapter.ts`：日期 / 地點 / 活動名稱。
- `resource-adapter.ts`：e-Books 檔案列表、食譜 ingredients / steps 等。
- `download-adapter.ts`：桌布代碼與多解析度檔案。
- `index-page-adapter.ts`：只填簡單說明與 `ct_index_key`。

現在只要先把介面、型別與 TODO 標註寫好即可，實際 parser 邏輯可以之後逐頁補上。

---

## 6. 程式風格要求

- **TypeScript 為主**，避免 `any`，盡量引用 `CONTENT_SCHEMA` 中既有型別。
- 每個檔案職責單一：
  - `html-to-markdown.ts` 只負責 orchestrate。
  - `classify-url.ts` 不做 parsing，只看 URL 字串。
  - `extract-main-content.ts` 專心找 main container。
  - `html-to-markdown-core.ts` 處理通用 HTML→Markdown 與圖片。
  - 各 adapter 專心處理 meta。
- 在重要函式上方加註解，寫清楚：
  - input / output 型別
  - 對應哪一份 docs 的哪一節（例如：`// 對應 HTML_TO_MARKDOWN_RULES_V4.md §5.4 magazine`）。

---

## 7. 測試骨架（可先寫框架，不必填實際樣本）

請建一個簡單的測試框架（使用 Vitest 或 Jest 均可），例如：

- `tests/html-to-markdown.teaching.sample.spec.ts`

內容可以先長這樣：

```ts
import { describe, it, expect } from "vitest";
import { htmlToContentJson } from "../src/convert/html-to-markdown";

describe("htmlToContentJson - teaching sample", () => {
  it("should convert a basic teaching page into TeachingContent", () => {
    const html = `
      <!-- TODO: 放一小段代表性的 teaching HTML -->
    `;

    const result = htmlToContentJson({
      url: "https://www.ctworld.org.tw/sutra_stories/storyXXX.htm",
      html,
    });

    // TODO: 之後補完整斷言，目前可以先檢查型別與基本欄位存在
    expect(result.post_type).toBe("teaching");
    expect(result.language).toBe("zh-TW");
    expect(result.body_markdown).toBeTypeOf("string");
  });
});
```

測試目前可以暫時標記為 `it.skip`，重點是搭好結構、引用正確的型別與函式名稱。

---

## 8. 總結（給 Windsurf / Cursor）

這次任務請先專注在：

- 把整個 HTML→JSON 的架構與檔案結構搭起來。
- 所有對外介面、型別宣告、主要流程（URL → DOM → main content → core convert → adapter → AnyContent）先寫好。
- 細節 parser 可以大量標 TODO，之後我會用真實 HTML 樣本，一個 post_type 一個 post_type 慢慢補完與調整。

所有細節請**以 `docs/*.md` 為唯一權威規格**，避免在程式裡發明新的欄位名稱或規則。
