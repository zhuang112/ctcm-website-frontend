# PROJECT_TODO

> 建議由 ChatGPT 協助維護這份清單，
> Windsurf / Cursor 則依照指定的 TODO 項目實作。

## 規則

- 每一條任務盡量「小而明確」。
- 每一條任務要指明：
  - 關聯的 docs（規格來源）。
  - 要修改的檔案路徑。
  - 允許修改的範圍（通常是 TODO 區塊）。
  - 驗收方式（測試、輸出檔、或手動檢查）。

---

## TODO 列表（原始三項）

### 1. 實作 crawl 工具（已完成範例）

- 狀態：✅ 完成
- 說明：
  - 檔案：
    - `tools/crawl/crawl-ctworld.ts`
    - `tools/crawl/filesystem-inventory.ts`
    - `tools/crawl/diff-crawl-vs-files.ts`
    - `package.json`（scripts: `crawl:ctworld` / `inventory:fs` / `diff:crawl-vs-fs`）
  - 規格：
    - `docs/crawl-and-inventory.md`
    - `docs/CRAWL_TOOLS_SETUP.md`
  - 功能摘要：
    - 從 `https://www.ctworld.org` 與 `/sitemap.htm` 出發做 BFS 爬蟲，只保留 `ctworld.org` / `ctworld.org.tw` 網域。
    - 產出：
      - `data/crawl/crawled-urls.json` / `crawled-urls.csv`（線上爬蟲結果）
      - `data/crawl/all-files.json` / `all-files.csv`（本機 docroot inventory）
      - `data/crawl/missing-from-crawl.csv` / `extra-from-crawl.csv`（差異報表）
  - 允許修改範圍（已完成，供未來參考）：
    - 僅限 `tools/crawl/*.ts` 內的實作細節與 CLI 參數解析，不改動 public API 與 scripts 名稱。
  - 驗收方式：
    - 能在本機成功執行：
      - `npm run crawl:ctworld`
      - `npm run inventory:fs`
      - `npm run diff:crawl-vs-files`
    - 產出的 JSON / CSV 檔格式符合 `crawl-and-inventory.md` 規格。
  - 負責人：ChatGPT（規格＋骨架）＋ Windsurf（實作）＋ 你（整合與驗收）

---

### 2. 實作 HTML→AnyContent：teaching

- 狀態：⬜ 尚未開始
- 說明：
  - 預計檔案：
    - `tools/convert/html-to-anycontent-teaching.ts`（由 ChatGPT 產生骨架）
    - `src/types/anycontent-teaching.ts`（teaching schema 定義，已存在可補強）
  - 規格：
    - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
    - `docs/CONTENT_SCHEMA.md`
    - `docs/COMPLETE_PROJECT_WORKFLOW.md`（整體流程）
  - 功能：
    - 將 teaching 類型 HTML 轉成 `TeachingContent` / `AnyContent` JSON：
      - 正確處理標題階層、主文段落、引用與列表。
      - 偵測並抽離偈語區塊，填入 `ct_verse_block_markdown` 等偈語相關欄位。
      - 依圖片規則填入 `featured_image`、`featured_image_caption`、`gallery_items[]`。
  - Windsurf 使用說明：
    - 只能修改 `html-to-anycontent-teaching.ts` 中標註 TODO 的區塊。
    - 不可修改 `CONTENT_SCHEMA` 中定義的型別與欄位名稱。
  - 驗收方式（暫定）：
    - 準備 2–3 個代表性 teaching HTML 範例，手動比對輸出 JSON 與規格是否一致。
    - 後續可補上 `tests/html-to-anycontent-teaching.spec.ts` 做 snapshot 測試。

---

### 3. 實作 zh-TW → zh-CN pipeline

- 狀態：⬜ 尚未開始
- 說明：
  - 預計檔案：
    - `tools/convert/generate-zh-cn-from-zh-tw.ts`
  - 規格：
    - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
    - `docs/CONTENT_SCHEMA.md`（欄位與 `Language` 定義）
  - 功能：
    - 讀取 zh-TW 版 AnyContent JSON（例如 `data/zh-tw/**/*.json`）。
    - 使用 OpenCC（或等效工具）對指定欄位做繁→簡轉換：
      - 包含 `post_title`, `post_excerpt`, `body_markdown`，以及多數中文 `meta` 與 `seo` 文案欄位。
    - 不變更：ID / URL / 數字 / enum 類欄位與 `external_id`。
    - 輸出對應 zh-CN JSON，並維持 `multilingual` 關聯資訊正確。
  - Windsurf 使用說明：
    - 僅實作 `generate-zh-cn-from-zh-tw.ts` 中指定 TODO 區塊。
    - 不修改 `Language` union 或 `AnyContent` schema；欄位白名單需以 docs 為準。
  - 驗收方式（暫定）：
    - 使用少量 zh-TW JSON 範例，檢查 zh-CN 版本：
      - 文字已正確轉為簡體。
      - 結構（欄位／型別）與原本完全一致。
      - ID / URL / enum 未被誤改。

---

## T 系列任務（由 ChatGPT 維護）

> T-XXXX 用來標記「人機協作的小步驟」，方便分派給 Windsurf。

### ✅ T-0001 teaching-from-legacy: 將 htmlToMarkdown 的 verses 映射到 TeachingMeta 偈語欄位（已完成）

- 狀態：
  - 已由 Windsurf 在 2025-12-08 完成對 teaching-from-legacy 的偈語欄位映射實作。
  - 對應測試（`tests/adapters/teaching-from-legacy.spec.ts`）已新增並通過。
- 相關程式檔：
  - `src/html/html-to-markdown.ts`
  - `src/html/legacy-html-types.ts`
  - `src/types/anycontent-teaching.ts`
  - `src/adapters/teaching-from-legacy.ts`
- 相關測試：
  - `tests/html/html-to-markdown.spec.ts`
  - `tests/adapters/teaching-from-legacy.spec.ts`
- 相關說明與紀錄：
  - `docs/Windsurf_ChatGPT_NOTES.md`
  - `docs/terminal_logs/T-0001_teaching-from-legacy_vitest_fail.txt`
  - `docs/terminal_logs/T-0001_teaching-from-legacy_vitest_pass.txt`
- 結果摘要：
  - `htmlToMarkdown` 專用 sutra 規則會將偈語收集到 `verses: string[]`。
  - `teaching-from-legacy` adapter 會依據 `verses` 設定 TeachingMeta 的偈語欄位：
    - `ct_has_dharma_verse`
    - `ct_verse_block_markdown`
    - `ct_verse_type`
    - `ct_verse_lang`
  - 不破壞既有 TeachingContent / AnyContent schema contract。

---

### ✅ T-0002 AnyContent 其他 post_type 型別：news / magazine contract（已完成）

- 狀態：
  - 已由 Windsurf 依照 T-0002 規格完成實作，並通過 TypeScript 型別檢查。
- 新增 / 更新的型別檔：
  - `src/types/anycontent-teaching.ts`
  - `src/types/anycontent-news.ts`
  - `src/types/anycontent-magazine.ts`
  - `src/types/anycontent.ts`
- 任務規格來源：
  - `docs/PROJECT_TODO.md`（T-0002 段落）
  - `docs/CONTENT_SCHEMA.md`
- 相關說明與紀錄：
  - `docs/Windsurf_ChatGPT_NOTES.md`
  - `docs/terminal_logs/T-0002_anycontent_types_tsc_pass.txt`
- 結果摘要：
  - AnyContent 的 contract 型別現已包含 teaching / news / magazine 三種 post_type。
  - news / magazine 的 meta / content 型別已明確定義，未破壞既有 `Language` union 與 `AnyContentBase`。

---

### ✅ T-0003 news-from-legacy: 建立 NewsContent adapter 骨架（minimal mapping）（已完成）

- 狀態：
  - 已由 Windsurf 依照 T-0003 規格完成實作，並通過 Vitest 測試。
- 新增 / 更新的程式檔：
  - `src/html/html-to-markdown.ts`
  - `src/html/legacy-html-types.ts`
  - `src/types/anycontent-teaching.ts`
  - `src/types/anycontent-news.ts`
  - `src/types/anycontent-magazine.ts`
  - `src/types/anycontent.ts`
  - `src/adapters/teaching-from-legacy.ts`
  - `src/adapters/news-from-legacy.ts`
- 新增 / 更新的測試檔：
  - `tests/html/html-to-markdown.spec.ts`
  - `tests/adapters/teaching-from-legacy.spec.ts`
  - `tests/adapters/news-from-legacy.spec.ts`
- 交接與流程說明檔：
  - `docs/WORKFLOW_CHATGPT_GITHUB_WINDSURF.md`
  - `docs/PROJECT_TODO.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`
- 本次型別檢查與測試 log：
  - `docs/terminal_logs/T-0001_teaching-from-legacy_vitest_fail.txt`
  - `docs/terminal_logs/T-0001_teaching-from-legacy_vitest_pass.txt`
  - `docs/terminal_logs/T-0002_anycontent_types_tsc_pass.txt`
  - `docs/terminal_logs/T-0003_news-from-legacy_vitest_pass.txt`
- 結果摘要：
  - 已有 minimal 版本的 `news-from-legacy` adapter 與對應測試，能從 legacy HTML + htmlToMarkdownResult 建立基本的 `NewsContent`。
  - teaching / news / magazine adapter / 型別之間關聯已初步串起，之後可逐步擴充 news 的日期、地點等欄位 mapping。

---

### ✅ T-0004 magazine-from-legacy: 建立 MagazineContent adapter 骨架（minimal mapping）（已完成）

- 狀態：
  - 已由 Windsurf 依照 T-0004 規格完成實作，並通過 TypeScript 型別檢查與 Vitest 測試。
- 新增 / 更新的程式檔：
  - `src/html/html-to-markdown.ts`
  - `src/html/legacy-html-types.ts`
  - `src/types/anycontent-teaching.ts`
  - `src/types/anycontent-news.ts`
  - `src/types/anycontent-magazine.ts`
  - `src/types/anycontent.ts`
  - `src/adapters/teaching-from-legacy.ts`
  - `src/adapters/news-from-legacy.ts`
  - `src/adapters/magazine-from-legacy.ts`
- 新增 / 更新的測試檔：
  - `tests/html/html-to-markdown.spec.ts`
  - `tests/adapters/teaching-from-legacy.spec.ts`
  - `tests/adapters/news-from-legacy.spec.ts`
  - `tests/adapters/magazine-from-legacy.spec.ts`
- 交接與流程說明檔：
  - `docs/WORKFLOW_CHATGPT_GITHUB_WINDSURF.md`
  - `docs/PROJECT_TODO.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`
- 本次型別檢查與測試 log：
  - `docs/terminal_logs/T-0001_teaching-from-legacy_vitest_fail.txt`
  - `docs/terminal_logs/T-0001_teaching-from-legacy_vitest_pass.txt`
  - `docs/terminal_logs/T-0002_anycontent_types_tsc_pass.txt`
  - `docs/terminal_logs/T-0003_news-from-legacy_vitest_pass.txt`
  - `docs/terminal_logs/T-0004_magazine-from-legacy_tsc_pass.txt`
  - `docs/terminal_logs/T-0004_magazine-from-legacy_vitest_pass.txt`
- 結果摘要：
  - 已有 minimal 版本的 `magazine-from-legacy` adapter 與對應測試，能從 legacy HTML + htmlToMarkdownResult 建立基本的 `MagazineContent`。
  - teaching / news / magazine 三種 post_type 的 adapter 骨架都已完成，可分別在後續任務中逐步補齊欄位 mapping。

---

### T-0005 news-from-legacy: 映射 NewsMeta 日期與地點欄位（v1）

- 目標：
  - 在既有 `news-from-legacy` 骨架上，實作第一版的日期與地點欄位 mapping，
    讓 `NewsMeta` 至少能填入「新聞日期」與「活動日期 / 地點」等基本資訊。

- 關聯 docs：
  - `docs/CONTENT_SCHEMA.md`
    - NewsMeta / NewsContent 段落
  - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
    - 與 news 版面相關的 HTML 結構與轉 Markdown 規則（若有）
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`
    - HTML → Markdown → AnyContent 流程
  - `docs/Windsurf_ChatGPT_NOTES.md`
    - 請在本任務完成時補充實際解析到的樣板與 selector

- 要更新的檔案：
  - `src/adapters/news-from-legacy.ts`
  - `tests/adapters/news-from-legacy.spec.ts`

- 規格摘要（v1 範圍）：
  - 以目前最常見、最容易解析的 news 樣板為主，先支援一小部分範例頁面即可。
  - 從 legacy HTML 或 htmlToMarkdownResult 中，嘗試解析：
    - `meta.ct_news_date`
    - `meta.ct_event_date_start`
    - `meta.ct_event_date_end`
    - `meta.ct_event_date_raw`
    - `meta.ct_event_location`
  - 具體策略由 Windsurf 在程式中實作並在 `docs/Windsurf_ChatGPT_NOTES.md` 紀錄，例如：
    - 針對特定 container / class（如 `.news-date` / `.article-info`）解析文字。
    - 或在 Markdown 中尋找「日期：」「地點：」等前綴行，做簡單的字串切割。
  - 無法可靠解析的欄位先維持 `null` / 未填，避免亂猜：
    - 例如只有一行「2022-03-14」時，可以同時填入 `ct_news_date` 與 `ct_event_date_start`，但需在 notes 中說明。

- 允許修改的範圍：
  - 僅修改 `news-from-legacy.ts` 內與 `NewsMeta` 欄位相關的邏輯。
  - 可以為測試新增少量 fixture / helper，用於組裝代表性的 `LegacyHtmlDocument` / `HtmlToMarkdownResult`。
  - 不可修改：
    - `NewsMeta` / `NewsContent` 的欄位名稱與型別。
    - `Language` union、`AnyContentBase` 結構。

- 驗收方式：
  - 新增 / 擴充 `tests/adapters/news-from-legacy.spec.ts`：
    - 至少加入 1–2 個代表性的 news 測試案例，斷言日期與地點欄位正確填入。
  - 測試指令：
    - 單檔：
      - `npx vitest tests/adapters/news-from-legacy.spec.ts`
    - 全專案：
      - `npx vitest`
  - TypeScript 型別檢查需通過：
    - `npm run typecheck`（若存在）
    - 或 `npx tsc --noEmit`

---

## 使用方式


---

### T-0006 legacy-data-root: 舊站資料盤點與 CTWORLD_LEGACY_ROOT 文件化（待資料取得後執行）

> 狀態：待舊站完整資料備份取得後再執行（目前僅預先登記工作項目）

- 觸發時機：
  - 已從主機商／舊系統取得完整舊站檔案（HTML / 圖片 / PDF 等）。

- 目標：
  - 在本機或指定 storage 設定 `CTWORLD_LEGACY_ROOT`（環境變數），作為舊站資料根目錄。
  - 實際檢視舊站檔案的目錄結構，紀錄「現況」，而不是強迫重構。
  - 在 docs 中新增一小節，描述：
    - `CTWORLD_LEGACY_ROOT` 實際對應的路徑（例如本機 / NAS / S3）。
    - 目前舊站檔案實際的目錄結構（文字描述或範例樹狀圖即可）。
  - 暫不對舊站檔案做大規模搬移或改名；若未來需要 refactor，另開新的 T 任務處理。

- 關聯 docs：
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`：補充「legacy 資料來源」相關小節。
  - `docs/PROJECT_TODO.md`：本任務條目本身。
  - （選用）若有需要，可新增 `docs/LEGACY_DATA_NOTES.md` 紀錄更細節。

- 建議修改檔案：
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`：新增／更新一小節描述 `CTWORLD_LEGACY_ROOT` 與實際檔案位置。
  - `docs/PROJECT_TODO.md`：標記本任務為 ✅ 並補充實際觀察結果摘要。
  - （選用）`docs/LEGACY_DATA_NOTES.md`：若檔案結構特別複雜，可在此詳述。

- 允許修改的範圍：
  - 僅限上述 docs，與實作 pipeline 無關的部分。
  - 不對舊站檔案做自動搬移／重命名；此類操作需另開專門 T 任務。

- 驗收方式：
  - [ ] 系統中已設定 `CTWORLD_LEGACY_ROOT` 並能在該路徑下列出舊站檔案。
  - [ ] `docs/COMPLETE_PROJECT_WORKFLOW.md` 中已能看出舊站資料實際來源與存放位置。
  - [ ] 如有新增 `docs/LEGACY_DATA_NOTES.md`，已簡要記錄目錄結構現況，無強迫重構要求。


1. 當你和 ChatGPT 討論出一個新功能：
   - 由 ChatGPT 幫你在這裡新增一條 TODO。
   - 同時產生 / 更新對應的 docs 與骨架程式碼。

2. 當你要交任務給 Windsurf 時：
   - 指定「請完成 PROJECT_TODO.md 中第 X 項」或「請完成 T-000X」。
   - 把該項裡的「檔案 / 規格 / 限制」貼給 Windsurf。

3. 任務完成後：
   - 你標記該項為 ✅ 並（選擇性）附上實際 commit hash 或簡短說明。
   - 若 ChatGPT 做過 code review，可以在這裡附註「已 review」。

你可以持續維護本檔案，讓它成為本專案「人機協作」的任務總覽。
