# PROJECT_STATUS

> 版本：2025-12-10  
> 這份文件描述 ctworld.org → Headless WordPress + React / Headless WordPress 專案目前的整體進度與下一步方向。

---

## 1. 整體進度總覽

- 🧱 **基礎設施（開發環境 / 工具）**：已就緒  
  - Vite + React + TypeScript 專案架構已建立。  
  - npm scripts 覆蓋 dev / build / test / lint / 各種工具指令（crawl、inventory、convert、snapshot 等）。

- 🕸 **舊站內容盤點（crawl + filesystem inventory）**：V1 完成  
  - 已能從舊站抓取網址清單、比對本機檔案結構，找出缺漏與多餘檔案。

- 🔁 **HTML → Markdown + sutra 專用規則**：V1 完成  
  - 共用的 `htmlToMarkdown` 流程已建立，sutra 頁面有專門規則與測試。

- 📦 **AnyContent schema & adapters（teaching / news / magazine）**：三個類型皆有 V1  
  - teaching / news 已有對應測試，magazine 有 minimal V1。

- 🗃 **docs snapshot CLI（T-0007）**：已完成並可用  
  - 可產生「本次任務專用 docs snapshot ZIP」，供 ChatGPT / Agent 使用。

- 🌏 **zh-TW → zh-CN pipeline**：僅有規格，尚未實作  
  - 有清楚的設計文件，尚未開始寫程式。

- 🗂 **legacy data root（T-0006）**：等待完整舊站備份  
  - 暫時以 placeholder 目錄存在，真正 HTML 檔尚未導入。

- 🧱 **Headless WordPress importer / React 前端**：尚未實作  
  - 有目標與初步構想，尚未開始撰寫 importer 或前端頁面。

---

## 2. 舊站爬蟲與檔案盤點（crawl + inventory）

- 相關檔案：
  - `tools/crawl/crawl-ctworld.ts`
  - `tools/crawl/filesystem-inventory.ts`
  - `tools/crawl/diff-crawl-vs-files.ts`
- 輸出資料：
  - `data/crawl/crawled-urls.{json,csv}`
  - `data/crawl/all-files.{json,csv}`
  - `data/crawl/missing-from-crawl.csv`
  - `data/crawl/extra-from-crawl.csv`
- 現況：
  - 已完成 V1 實作並跑過一輪。
  - 可以用來對照舊站實際內容與本機檔案結構差異。
- 後續可能任務（另開 T 任務）：
  - 針對特定目錄做更細緻的差異分析。
  - 產生「匯入優先順序」報表。

---

## 3. HTML → Markdown 與 sutra 頁面規則

- 主要實作：
  - `src/html/html-to-markdown.ts`
  - 測試：`tests/html/html-to-markdown.spec.ts`
  - 規則文件：`docs/HTML_TO_MARKDOWN_RULES_V4.md`
- 現況：
  - 一般頁面的 HTML → Markdown 流程已建立。
  - sutra 頁面有專用偵測與段落處理邏輯（偈語、分段、 anchors 等），並有對應測試。
- 後續可能任務：
  - 根據實際匯入過程中遇到的特殊版型，擴充規則與測試案例。

---

## 4. AnyContent schema & legacy adapters

- 規格文件：
  - `docs/CONTENT_SCHEMA.md`

### 4.1 Teaching

- 相關檔案：
  - 型別：`src/types/anycontent-teaching.ts`
  - adapter：`src/adapters/teaching-from-legacy.ts`
  - CLI：`tools/convert/teaching-html-to-anycontent.ts`
  - 測試：對應 teaching adapter 的測試檔
- 現況：
  - 從 legacy teaching HTML 轉成 AnyContentTeaching JSON 的 V1 已完成。
  - sutra 偈語等欄位有專用 mapping，並有測試覆蓋。
- 後續任務（另開 T 任務）：
  - 增加更多實際頁面的測試案例。
  - 微調欄位命名或結構（若在實際匯入過程有新發現）。

### 4.2 News

- 相關檔案：
  - 型別：`src/types/anycontent-news.ts`
  - adapter：`src/adapters/news-from-legacy.ts`
  - 測試：`tests/adapters/news-from-legacy.spec.ts`
- 現況：
  - 基本的內容 mapping 已完成。
  - 已實作從舊站 HTML 解析 news meta（日期、地點等），填入：
    - `ct_news_date`
    - `ct_event_date_*`
    - `ct_event_location`
  - 測試案例覆蓋了日期 / 地點 parsing 的主要情境。
- 後續任務：
  - 遇到更多舊版 news 版型後，視需要補充 parsing 規則與測試。

### 4.3 Magazine

- 相關檔案：
  - adapter：`src/adapters/magazine-from-legacy.ts`
  - 測試：對應 magazine adapter 的測試檔
- 現況：
  - 已有 minimal V1 adapter 與基礎測試。
- 後續任務：
  - 根據實際匯入需求，補齊 magazine 特有欄位與更多測試。

---

## 5. docs snapshot CLI（T-0007）

- 相關檔案：
  - CLI：`tools/docs-snapshot/make-docs-snapshot.ts`
  - npm script：`"snapshot:docs": "ts-node tools/docs-snapshot/make-docs-snapshot.ts"`
  - log：`docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`
- 功能：
  - 在專案根目錄執行：
    - `npm run snapshot:docs -- --task T-0007`
  - 會在 `snapshots/` 目錄下產生：
    - `ctworld-docs-T-0007-YYYY-MM-DD-vN.zip`
  - ZIP 內容：
    - `docs/*.md`
    - `docs/terminal_logs/*.txt`
  - 不會打包 `node_modules/`、`dist/` 等大型目錄，且 snapshots 目錄不納入 git。
- 現況：
  - T-0007 已實作並驗收，可作為「把目前 docs 狀態打包給 ChatGPT / Agent」的備援方案。

---

## 6. zh-TW → zh-CN pipeline（尚未實作）

- 規格文件：
  - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
- 現況：
  - 僅有設計規格，尚未開始實作程式。
  - 預期會採用字形轉換（類 OpenCC）搭配已有 AnyContent JSON，而非重新爬 `-gb` 版本 HTML。
- 後續：
  - 需拆解為多個 T 任務，實作：
    - 文字轉換工具。
    - pipeline script。
    - 測試與驗證流程。

---

## 7. legacy data root（T-0006）

- 相關檔案 / 目錄：
  - `ctworld-docroot/`（目前僅為 placeholder）
- 現況：
  - T-0006 任務目前為 blocked 狀態：
    - 需要取得完整舊站備份與明確目錄結構後，才能正式設定 `CTWORLD_LEGACY_ROOT` 並進行檔案盤點。
- 後續：
  - 待舊站備份到位後，再啟動 T-0006 與相關子任務。

---

## 8. Headless WordPress importer 與 React 前端

- 現況：
  - 目前僅有高層架構與構想：
    - AnyContent → WordPress 自訂 post type / ACF schema。  
    - React / Next.js 前端讀 WordPress JSON API。
  - 尚未開始撰寫實際 importer 或前端頁面。
- 後續：
  - 需依照 CONTENT_SCHEMA 與 WordPress 資料模型，拆解為多個 T 任務，逐步實作 importer、同步機制與前端頁面。
