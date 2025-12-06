# CONVENTIONS

> 本文件定義此專案的命名、結構與一般工作慣例。  
> 若與 `docs/*` 衝突，以 `docs/*` 為最終權威。

---

## 1. 檔案與目錄命名

- **TypeScript / React**
  - 檔案：遵循既有專案風格，可用 `PascalCase.tsx`（component）、`kebab-case.ts`（工具 / 模組）。
  - React component 檔名建議：`PascalCase.tsx`（例如 `HomePage.tsx`）。

- **Schema / 內容轉換**
  - 型別定義集中在 `docs/CONTENT_SCHEMA.md` 與對應 `src/types/CONTENT_SCHEMA.ts`（若存在）。
  - 轉換邏輯放在 `src/convert/`。
  - 依責任分檔：
    - `html-to-markdown.ts`
    - `classify-url.ts`
    - `extract-main-content.ts`
    - `html-to-markdown-core.ts`
    - `post-type-adapters/*.ts`

- **文件**
  - 規格與流程：`docs/*.md`。
  - 專案說明與開發者導引：根目錄的 `README.md`, `ARCHITECTURE.md`, `CODING_GUIDELINES.md`。

---

## 2. 命名慣例

- `post_type` 值固定為小寫字串：
  - `"teaching"`, `"news"`, `"magazine"`, `"branch"`, `"gallery"`, `"resource"`, `"download"`, `"index_page"` 等。

- `meta` 內欄位：
  - 以 `ct_` 作為 prefix（對應舊站 / 專案專用欄位），具體欄位以 `CONTENT_SCHEMA.md` 為準。

- Boolean / flag：
  - 使用具語意名稱，例如 `has_article`, `is_index_page`，避免 `flag1` 這類無意義名稱。

---

## 3. 文件與規格優先順序

若有衝突，參考順序為：

1. `docs/CONTENT_SCHEMA.md`
2. `docs/HTML_TO_MARKDOWN_RULES_V4.md`
3. `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
4. 其他說明文件（如本檔、`CODING_GUIDELINES.md`）

任何新需求 / 新欄位：

- **先更新 `docs/` 對應文件，再修改程式。**

---

## 4. 語言與多語處理

- JSON：
  - `language` 目前僅接受 `"zh-TW"` 或 `"zh-CN"`（此專案階段）。

- `external_id`：
  - zh-TW / zh-CN 使用約定的後綴（詳見 `ZH_TW_TO_ZH_CN_PIPELINE.md`），以支援多語綁定。

- Markdown：
  - 只存放人類可閱讀正文，不包含圖片、偈語區塊等純結構化資訊（這些進 `meta` / `featured_image` / `gallery_items`）。

---

## 5. 前端頁面與組件慣例（簡述）

- Container / Page component：
  - 負責資料抓取與高階頁面佈局。

- Presentational component：
  - 接收明確的 props（以 TypeScript 型別定義），專注於畫面呈現，不直接依賴全域狀態或 API 呼叫。

- 與內容模型的關係：
  - 前端不直接解析舊站 HTML，僅依賴 Headless WordPress / API 回傳的結構化資料。
  - 若需要新欄位，需先在 `CONTENT_SCHEMA` 與後端轉換流程中補上，再由前端渲染。
