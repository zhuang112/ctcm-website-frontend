# CTCM Website Frontend & Content Migration

> 中台世界舊站（ctworld.org / ctworld.org.tw） → Headless WordPress + React 的前端專案與內容轉換工具。

本 repo 的目標：

- 將舊站 HTML 轉成統一的 JSON 結構（`AnyContent`，詳見 `docs/CONTENT_SCHEMA.md`）。
- 提供前端 React / TypeScript 應用程式，透過 Headless WordPress / API 顯示內容。
- 規劃並落實一條可回溯、可測試的內容遷移與多語內容產線。

本專案是基於 **React + TypeScript + Vite** 模板建立，並在此基礎上擴充為完整的內容遷移與前端專案。

---

## 1. 專案結構概觀（示意）

```text
.
├─ src/                    # 前端 React / TypeScript 原始碼
│  └─ App.tsx              # 入口組件
├─ docs/                   # 規格與設計文件（唯一權威）
│  ├─ COMPLETE_PROJECT_WORKFLOW.md   # 整體專案流程 vNext
│  ├─ CONTENT_SCHEMA.md              # AnyContent JSON schema
│  ├─ HTML_TO_MARKDOWN_RULES_V4.md   # HTML→Markdown + JSON 轉換規格
│  ├─ ZH_TW_TO_ZH_CN_PIPELINE.md     # 繁→簡 pipeline 規格
│  └─ 00_windsurf-task-html-to-markdown.md # 給 AI 的開發任務說明
```

（視實際情況補上 `src/convert/`、`scripts/` 等目錄）

---

## 2. HTML → AnyContent JSON（zh-TW）

舊站 HTML 會先被轉成統一 JSON 結構，作為後續所有流程的基礎。

- 目標：
  - 產出符合 `AnyContent` 型別的 JSON（見 `docs/CONTENT_SCHEMA.md`）。
  - 其中 `body_markdown` 為可閱讀的 Markdown 正文。
  - 圖片、偈語、meta 等結構化資訊放在 JSON 的 `meta` / `featured_image` / `gallery_items` 等欄位。

- 核心程式（建議結構，詳見 `docs/00_windsurf-task-html-to-markdown.md` 與 `docs/HTML_TO_MARKDOWN_RULES_V4.md`）：
  - `src/convert/html-to-markdown.ts`：對外入口 `htmlToContentJson()`
  - `src/convert/classify-url.ts`：URL → `post_type` / `collection_key`
  - `src/convert/extract-main-content.ts`：從整頁 DOM 找出主內容 container
  - `src/convert/html-to-markdown-core.ts`：通用 HTML→Markdown 與圖片處理
  - `src/convert/post-type-adapters/*.ts`：依 `post_type` 組出對應的 meta 與內容

規則來源：

- 全域清理與 HTML→Markdown：`docs/HTML_TO_MARKDOWN_RULES_V4.md`
- JSON schema 與型別：`docs/CONTENT_SCHEMA.md`
- 整體流程：`docs/COMPLETE_PROJECT_WORKFLOW.md`

---

## 3. 繁體（zh-TW）→ 簡體（zh-CN）Pipeline

在 HTML→JSON（zh-TW）完成後，會有一條獨立 pipeline 產生 zh-CN JSON。

- 詳細規格：`docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
- 主要行為：
  - 讀取 `AnyContent`（zh-TW）JSON。
  - 對指定欄位做繁→簡轉換（例如 `post_title`, `body_markdown`, 多數 `meta` 中文欄位）。
  - 不修改 ID / URL / enum 類欄位。
  - 產生對應 zh-CN JSON 並維持 multilingual 關聯與 redirect 所需資訊。

---

## 4. 前端技術棧與開發說明

本專案使用：

- **React**：前端 UI 框架。
- **TypeScript**：型別系統，確保內容模型與 API 呼叫安全。
- **Vite**：開發與建置工具，提供快速 HMR 與打包。

此 repo 最初由官方的 React + TypeScript + Vite 模板建立，並移除大部分預設 README 範文，改由本文件與 `docs/*.md` 作為主要說明。Vite、ESLint 等詳細設定可直接參考專案中的設定檔（例如 `vite.config.ts`、`tsconfig*.json`）。

啟動開發伺服器（依實際 `package.json` 調整）：

```bash
npm install
npm run dev
```

---

## 5. 開發指引與進階主題

- 內容模型與 schema：
  - 請參考 `docs/CONTENT_SCHEMA.md`。
- HTML→Markdown 與內容轉換規則：
  - 請參考 `docs/HTML_TO_MARKDOWN_RULES_V4.md`。
- 繁→簡 pipeline：
  - 請參考 `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`。
- 更細的程式風格與命名慣例：
  - 建議放在根目錄的 `ARCHITECTURE.md`、`CONVENTIONS.md`、`CODING_GUIDELINES.md` 中（可依本 README 提到的架構自行建立）。

在開始修改或擴充程式碼前，建議先完整閱讀 `docs/` 目錄下的幾份規格，再回來對照本 README，會比較容易掌握整個專案的定位與資料流。

