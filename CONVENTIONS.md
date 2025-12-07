# CONVENTIONS.md

> 專案的「約法三章」：命名、語言碼、URL pattern 與檔案結構。
> 目標是讓所有人類與 AI（Windsurf / Cursor）都用同一套習慣寫程式。

---

## 1. 語言與 Locale

### 1.1 JSON / 程式內的語言碼

統一使用小寫語言碼：

```ts
export type Language = 'zh-tw' | 'zh-cn' | 'en' | 'ja';
```

- `AnyContent.language` 使用這組 type。
- `multilingual.translations[].language` 也使用這組。

### 1.2 URL / 路由中的語言碼

- 預設語言：`zh-tw` → **不帶語言前綴**
  - `/teaching/heart-sutra-001`
- 其他語言：帶語言前綴
  - `/zh-cn/teaching/heart-sutra-001`
  - `/en/teaching/heart-sutra-001`
  - `/ja/teaching/heart-sutra-001`

### 1.3 與 WordPress / HTML 的 locale 映射

- `zh-tw` → `zh_TW` / `zh-TW`
- `zh-cn` → `zh_CN` / `zh-CN`

Importer 需要負責這個 mapping。

---

## 2. external_id / slug / URL 約定

### 2.1 external_id

- 每一則內容的穩定 ID。
- 多語共用同一個 external_id。
- `(language, external_id)` 在整個系統內不可重複。
- 生成後視為 **不可變**。

建議命名模式（示例，不強制）：

```text
{post_type}_{yyyyMMdd}_{short-slug}
teaching_20030315_heart-sutra-001
```

### 2.2 slug

- URL 最後一段，例如：`heart-sutra-001`。
- **現在不另存欄位**，一律由 external_id 推導：
  - 例如：砍掉 `teaching_` 前綴，只保留 `20030315_heart-sutra-001`，再把 `_` 轉成 `-`。
- 若未來覺得需要更靈活的 URL 設計，再新增 `slug` 欄位即可。

### 2.3 新站 URL pattern

- 預設語言（zh-tw）：

  ```text
  /{section}/{slug}
  /teaching/heart-sutra-001
  /news/ct-world-activity-2025-03-15
  ```

- 其他語言：

  ```text
  /{lang}/{section}/{slug}
  /zh-cn/teaching/heart-sutra-001
  /en/teaching/heart-sutra-001
  ```

- `{section}` 一般對應 post_type：
  - `teaching`, `news`, `magazine`, `branch`, `gallery`, `resource`, `download`

> 注意：實際 router 可以額外允許 alias / custom route，但這裡是「默認規則」。

---

## 3. 檔案與目錄命名

### 3.1 TypeScript / JS 檔案

- 檔名一律 `kebab-case`：

  ```text
  html-to-markdown.ts
  classify-url.ts
  extract-main-content.ts
  zh-tw-to-zh-cn.ts
  ```

- 型別定義檔：
  - `*.types.ts` 或集中在 `CONTENT_SCHEMA.ts` / `types.ts`。

### 3.2 React Component

- 檔名：`PascalCase.tsx`，每檔一個主要 component：

  ```text
  TeachingPage.tsx
  NewsList.tsx
  GalleryGrid.tsx
  ```

- 檔案內容：
  - 預設匯出：`export default function Xxx() {}`。
  - 若有多個小 component，依需求命名 `XxxHeader`, `XxxBody` 等。

### 3.3 測試檔

- 放在同層或 `__tests__` 目錄下，檔名以 `.spec.ts` 或 `.test.ts` 結尾。

  ```text
  html-to-markdown.spec.ts
  classify-url.spec.ts
  ```

---

## 4. 命名規則（post_type / meta / ACF）

### 4.1 post_type

- WordPress / JSON 中的 post_type：

  ```ts
  type PostType =
    | 'teaching'
    | 'news'
    | 'magazine'
    | 'branch'
    | 'gallery'
    | 'resource'
    | 'download'
    | 'index_page';
  ```

- 前端 URL `section` 盡量與 post_type 同名。

### 4.2 meta key

- 全部使用 `ct_` prefix + snake_case：

  ```text
  ct_speaker_name
  ct_event_date_start
  ct_branch_address
  ct_magazine_issue_no
  ct_recipe_ingredients_markdown
  ```

- WordPress ACF / postmeta 亦建議使用相同 key。

### 4.3 圖片欄位

- 預設欄位：

  ```ts
  featured_image?: string | null;
  featured_image_caption?: string | null;
  gallery_items: GalleryItem[];
  ```

- HTML→JSON 階段只處理「舊站原有圖片」，fallback 主圖在匯入 / 後處理階段處理。

---

## 5. docs 優先順序

> 當文件與程式有衝突時，要以誰為準？

優先級（由高到低）：

1. `docs/CONTENT_SCHEMA.md`
2. `docs/HTML_TO_MARKDOWN_RULES_V4.md`
3. `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
4. `docs/COMPLETE_PROJECT_WORKFLOW.md`
5. `ARCHITECTURE.md`
6. 程式內註解 / README

若發現衝突：

1. 以上述順序決定哪一份是「權威」。
2. 建 issue / TODO，修正其他文件或程式，讓它們對齊。

---

## 6. 前端檔案分工（建議）

### 6.1 pages / routes 層

- 負責：
  - Route 定義。
  - 讀取 URL 参数（slug, language）。
  - 呼叫 data hooks。

### 6.2 components 層

- 負責：
  - 純視覺呈現。
  - 不直接呼叫 API，只吃 props。

### 6.3 hooks / data 層

- 負責：
  - 讀取 WP API / JSON。
  - 將 raw data 轉成前端 view model。

> 原則：**資料邏輯不要散落在 component 裡**，而是集中在 hook / data 層。

---

## 7. 其他慣例

- Git commit message：
  - 建議使用簡短英文字，例如 `feat: add teaching adapter skeleton`。
- TODO 標註：
  - `// TODO(ctworld): xxx`
  - 可搭配 issue ID，例如 `// TODO(CT-123): refine verse parser`。

未來若有需要，可以把這份檔案拆出 `STYLEGUIDE.md` 或補充更多細節。
