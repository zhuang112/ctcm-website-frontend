# CONTENT_SCHEMA.md (vNext + image & language updates)

> 定義從舊站 HTML 轉出後的統一 JSON 結構（AnyContent）。  
> 本版已更新：`Language` 型別（小寫語言碼）、`featured_image` / `featured_image_caption` 規則、external_id / slug 的定位。

---

## 0. 共用型別與基本約定

### 0.1 Language

```ts
export type Language = 'zh-tw' | 'zh-cn' | 'en' | 'ja';
```

- JSON 與程式內一律使用小寫語言碼。
- 匯入 WordPress / HTML `<html lang>` 時，再做：
  - `zh-tw` → `zh_TW` / `zh-TW`
  - `zh-cn` → `zh_CN` / `zh-CN`

### 0.2 external_id 與 slug

- `external_id: string`
  - 每一則內容的「穩定 ID」，不同語言共用同一值。
  - 在同一語言 (`language`) 下 `(language, external_id)` 不可重複。
  - 生成後視為 **不可變**（immutable），如需重大調整，應視為新內容。
- slug：
  - 網址最後一段（例如 `heart-sutra-001`），**不另外存成欄位**。
  - 由前端 / route 生成程式依 `external_id` 規則推導。
  - 未來若需要，可以在不破壞相容性的情況下新增 `slug` 欄位。

### 0.3 圖片欄位（全域約定）

```ts
export interface GalleryItem {
  url: string;              // 圖片新網址（或暫存舊網址，再經由 mapping 換成新網址）
  alt?: string | null;      // <img alt>，若有則保留
  caption?: string | null;  // 圖說，從圖片附近文字推論
}
```

所有內容型別共用：

```ts
featured_image?: string | null;
featured_image_caption?: string | null;
gallery_items: GalleryItem[];
```

- `featured_image`：
  - 優先使用 HTML 主內容中的第一張圖片。
  - 若該頁本身沒有圖片 → 轉換階段保持 `null`，由後續 fallback 流程補齊。
  - 可用於：內容頁 hero 圖、首頁 / 專題 banner。
- `featured_image_caption`：
  - 預設為 `null`。
  - 僅在明確需要（例如首頁 hero 圖說 / 標語）時由轉換或匯入流程填入。
  - 一般內容頁不依賴此欄位。
- `gallery_items`：
  - 第二張圖片起，皆記錄於此。
  - 每張圖片可有自己的 `caption`，供前端顯示或隱藏。

> 規則：HTML→JSON 階段不做 fallback，fallback 主圖僅在匯入 / 後處理階段處理。

---

## 1. Base 型別

```ts
export interface BaseMeta {
  ct_collection_key?: string | null;
  ct_collection_order?: number | null;
  // 其他跨 post_type 共用欄位可放這裡
}

export interface SeoMeta {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
}

export interface MultilingualInfo {
  translations: Array<{
    language: Language;
    old_url?: string | null;
    status: 'manual' | 'generated' | 'planned';
  }>;
}
```

```ts
export interface AnyContentBase {
  external_id: string;
  language: Language;
  post_type: PostType;
  old_url: string;                // 此語言版本對應的舊站 URL
  post_title: string;
  post_excerpt?: string | null;
  body_markdown: string;

  featured_image?: string | null;
  featured_image_caption?: string | null;
  gallery_items: GalleryItem[];

  meta: BaseMeta & Record<string, any>;
  seo?: SeoMeta;
  multilingual?: MultilingualInfo;
}
```

`PostType` 為 union：

```ts
export type PostType =
  | 'teaching'
  | 'news'
  | 'magazine'
  | 'branch'
  | 'gallery'
  | 'resource'
  | 'download'
  | 'index_page';
```

---

## 2. 各 post_type 專用 meta（摘要）

> 詳細欄位可依實作時逐步擴充；下面是最常用的核心欄位。

### 2.1 teaching

```ts
export interface TeachingMeta extends BaseMeta {
  ct_speaker_name?: string | null;
  ct_location?: string | null;
  ct_event_date?: string | null;     // 文字形式，必要時再拆結構化日期
  ct_sutra_reference?: string | null;

  ct_has_dharma_verse?: 'yes' | 'no';
  ct_verse_block_markdown?: string | null;
  ct_verse_type?: string | null;
  ct_verse_lang?: 'zh-tw' | 'zh-cn' | 'en' | 'ja' | 'bilingual' | null;
}
```

`TeachingContent`：

```ts
export interface TeachingContent extends AnyContentBase {
  post_type: 'teaching';
  meta: TeachingMeta;
}
```

### 2.2 news

```ts
export interface NewsMeta extends BaseMeta {
  ct_news_date?: string | null;
  ct_event_date_start?: string | null;
  ct_event_date_end?: string | null;
  ct_event_date_raw?: string | null;
  ct_event_location?: string | null;
  ct_news_category?: string | null;  // 中台事紀 / 活動報導 / ...
}
```

### 2.3 magazine

```ts
export type MagazineLevel = 'issue' | 'article';

export interface IssueItem {
  section?: string | null;
  title: string;
  has_article: boolean;
  article_external_id?: string | null;
  page_no?: string | null;
}

export interface MagazineMeta extends BaseMeta {
  ct_magazine_level: MagazineLevel;
  ct_magazine_issue_no?: string | null;
  ct_magazine_year?: number | null;
  ct_magazine_month?: number | null;
  ct_magazine_issue_label?: string | null; // 例：第201期

  // issue 專用
  ct_issue_items?: IssueItem[];

  // article 專用
  ct_magazine_section?: string | null;
  ct_magazine_type?: string | null;
  ct_author_name?: string | null;
}
```

`MagazineContent`：

```ts
export interface MagazineContent extends AnyContentBase {
  post_type: 'magazine';
  meta: MagazineMeta;
}
```

### 2.4 branch / gallery / resource / download / index_page

此處略述關鍵欄位：

- `BranchMeta`：地址、電話、Email、交通資訊、開放時間等。
- `GalleryMeta`：活動名稱、日期、地點等。
- `ResourceMeta`：resource 類型（電子書 / 食譜）、檔案列表、食譜材料/作法 markdown 等。
- `DownloadMeta`：桌布代碼、各解析度檔案清單。
- `IndexPageMeta`：索引頁 key、年份、備註（僅作 debug，不作前端內容來源）。

> 實際程式中，建議為每一種 post_type 定義對應 `*Meta` 與 `*Content` 介面，並在 `AnyContent` union 中收束。

---

## 3. AnyContent union

方便起見，可以在程式中定義：

```ts
export type AnyContent =
  | TeachingContent
  | NewsContent
  | MagazineContent
  | BranchContent
  | GalleryContent
  | ResourceContent
  | DownloadContent
  | IndexPageContent;
```

---

## 4. Fallback 圖片與 JSON 的關係

- **JSON 轉換階段**：
  - 只反映舊站實際有的圖片，`featured_image` 缺席時保持 `null`。
- **fallback 主圖補齊**：
  - 在匯入 / 後處理階段補上 `featured_image`（WP featured image）。
  - 若有需要，也可以回寫 JSON 中的 `featured_image`，但這不影響 schema 本身。
- `featured_image_caption`：
  - 一般情況可維持 `null`。
  - 僅在 banner / hero 等需要時使用。

---

（本 schema 為 vNext 草案，未來如新增欄位，請同步更新：HTML 轉換規則、繁→簡 pipeline、WP 匯入與前端對應程式。）
