# PROJECT_TODO

> 建議由 ChatGPT 協助維護這份清單，
> 實作 Agent（目前主要是 Codex）則依照指定的 TODO 項目實作。

## 規則

- 每一條任務盡量「小而明確」。
- 每一條任務要指明：
  - 關聯的 docs（規格來源）。
  - 要修改的檔案路徑。
  - 允許修改的範圍（通常是 TODO 區塊）。
  - 驗收方式（測試、輸出檔、或手動檢查）。
- 每一個 T-XXXX 任務完成時，實作 Agent（目前主要是 Codex）負責：
  - 跑必要測試 / 型別檢查。
  - `git add` 本次修改涉及的檔案。
  - `git commit`，訊息需包含 T 任務編號與簡短說明。
  - `git push` 到遠端（預設 `origin/main`）。
  - 在 `docs/Windsurf_ChatGPT_NOTES.md` 對應的小節中紀錄本次 commit hash 與變更摘要。
  - 若因特殊原因暫時無法 push，須在 notes 中說明原因，並可視情況產生 snapshot ZIP 給 ChatGPT 使用。

---

## TODO 列表（原始三項）

### 1. 實作 crawl 工具（已完成範例）

- 狀態：? 完成
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

- 狀態：? v1 已完成（已有 teaching-from-legacy + teaching-html-to-anycontent.ts；後續優化另開任務）
- 說明：
  - 主要檔案（已存在）：
    - `tools/convert/teaching-html-to-anycontent.ts`
    - `src/adapters/teaching-from-legacy.ts`
    - `src/types/anycontent-teaching.ts`
  - 規格：
    - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
    - `docs/CONTENT_SCHEMA.md`
    - `docs/COMPLETE_PROJECT_WORKFLOW.md`（整體流程）
  - 功能：
    - 將 teaching 類型 HTML 轉成 `TeachingContent` / `AnyContent` JSON：
      - 正確處理標題階層、主文段落、引用與列表。
      - 偵測並抽離偈語區塊，填入 `ct_verse_block_markdown` 等偈語相關欄位。
      - 依圖片規則填入 `featured_image`、`featured_image_caption`、`gallery_items[]`。
  - 測試：
    - `tests/adapters/teaching-from-legacy.spec.ts`
    - `tests/html/html-to-markdown.spec.ts`（涵蓋 sutra 規則）

---

### 3. 實作 zh-TW → zh-CN pipeline

- 狀態：? 拆解中（將拆成多個 T 任務，T-0013 先負責 docs 規格）
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
  - 備註：
    - 此條為整體 pipeline 目標，實作將拆成多個 T 任務（如 T-0013 規格設計、T-0014 程式實作 v1 等）。本次新增 T-0013，專注 docs 規格，不動程式碼。

---

## T 系列任務（由 ChatGPT 維護）

> T-XXXX 用來標記「人機協作的小步驟」，方便分派給 Windsurf。

### ? T-0001 teaching-from-legacy: 將 htmlToMarkdown 的 verses 映射到 TeachingMeta 偈語欄位（已完成）

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

### ? T-0002 AnyContent 其他 post_type 型別：news / magazine contract（已完成）

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

### ? T-0003 news-from-legacy: 建立 NewsContent adapter 骨架（minimal mapping）（已完成）

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
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`
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

### ? T-0004 magazine-from-legacy: 建立 MagazineContent adapter 骨架（minimal mapping）（已完成）

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
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`
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

### T-0013 zh-tw-to-zh-cn-pipeline-design: 定義欄位白名單與 CLI 規格（docs first）

> 狀態：? 已完成（docs 規格補齊，未實作程式碼，2025-12-12）

- 目標：
  - 將 `docs/ZH_TW_TO_ZH_CN_PIPELINE.md` 補齊到可以實作的程度：
    - 明確列出「要做繁→簡轉換的欄位白名單」與「不應轉換的欄位」。
    - 說清楚 pipeline 的輸入來源與輸出位置（資料夾結構假設可以是暫定版）。
    - 定義一支 CLI 工具（預計 `tools/convert/generate-zh-cn-from-zh-tw.ts`）的參數與使用方式。
  - 不修改任何 TypeScript 程式碼，只改 docs。

- 關聯 docs：
  - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
  - `docs/CONTENT_SCHEMA.md`
  - `docs/PROJECT_STATUS.md`（目前標記 zh-TW→zh-CN 尚未實作）

- 建議修改檔案：
  - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`：補齊 pipeline 設計細節（已於本次完成）。
  - `docs/PROJECT_TODO.md`：本任務條目與原始第 3 項說明。

- 驗收方式：
  - 由 ChatGPT 閱讀 `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`，確認：
    - 可清楚知道哪一類欄位要轉換、哪一類不能轉。
    - 知道 CLI 工具預計怎麼呼叫（含 input/output 參數和使用範例）。
    - 知道 pipeline 預期的輸出資料結構（檔名 / language 欄位 / multilingual 關聯的策略）。
  - `PROJECT_TODO.md` 中 T-0013 狀態更新為 ?，並簡短描述本次完成的內容。

---

### T-0013 zh-tw-to-zh-cn-pipeline-design: 定義欄位白名單與 CLI 規格（docs first）

> 狀態：? 已完成（docs 規格補齊，未實作程式碼，2025-12-12）

- 目標：
  - 將 `docs/ZH_TW_TO_ZH_CN_PIPELINE.md` 補齊到可以實作的程度：
    - 明確列出「要做繁→簡轉換的欄位白名單」與「不應轉換的欄位」。
    - 說清楚 pipeline 的輸入來源與輸出位置（資料夾結構假設可以是暫定版）。
    - 定義一支 CLI 工具（預計 `tools/convert/generate-zh-cn-from-zh-tw.ts`）的參數與使用方式。
  - 不修改任何 TypeScript 程式碼，只改 docs。

- 關聯 docs：
  - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
  - `docs/CONTENT_SCHEMA.md`
  - `docs/PROJECT_STATUS.md`（目前標記 zh-TW→zh-CN 尚未實作）

- 建議修改檔案：
  - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`：補齊 pipeline 設計細節（已於本次完成）。
  - `docs/PROJECT_TODO.md`：本任務條目與原始第 3 項說明。

- 驗收方式：
  - 由 ChatGPT 閱讀 `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`，確認：
    - 可清楚知道哪一類欄位要轉換、哪一類不能轉。
    - 知道 CLI 工具預計怎麼呼叫（含 input/output 參數和使用範例）。
    - 知道 pipeline 預期的輸出資料結構（檔名 / language 欄位 / multilingual 關聯的策略）。
  - `PROJECT_TODO.md` 中 T-0013 狀態更新為 ?，並簡短描述本次完成的內容。

---

### T-0014 zh-tw-to-zh-cn-pipeline-core-and-cli-skeleton: 實作核心轉換＋CLI 框架（含 dry-run）

> 狀態：? 已完成（核心轉換與 CLI skeleton，2025-12-12）

- 目標：
  - 實作繁→簡轉換核心與 CLI 骨架：
    - 建立 `convertToZhCn(text: string)` utility（opencc-js 或等效實作）。
    - 建立 `tools/convert/generate-zh-cn-from-zh-tw.ts` CLI，支援 `--input` / `--output` / `--dry-run`。
    - dry-run 模式僅列出預計處理檔案，不寫檔；正式模式輸出 zh-CN JSON。
  - 本任務著重程式骨架與 logging；更進一步的欄位對應留給後續 T 任務。

- 關聯檔案：
  - `src/i18n/zh-tw-to-zh-cn.ts`
  - `tests/i18n/zh-tw-to-zh-cn.spec.ts`
  - `tools/convert/generate-zh-cn-from-zh-tw.ts`
  - `package.json`
  - `docs/PROJECT_TODO.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`

- 驗收方式：
  - `convertToZhCn` 可將典型繁體詞（如「臺灣」）轉為簡體（如「台?」）。
  - CLI 可跑 dry-run 列出輸出路徑；正常模式可將輸入目錄的 JSON 產生對應輸出檔（基本欄位轉換即可）。
  - 有對應單元測試（至少覆蓋 convertToZhCn），並新增 `npm run convert:zh-cn` 便於呼叫。

---

### T-0015 zh-tw-to-zh-cn-pipeline-write-json: 將 AnyContent JSON 轉為 zh-CN 寫檔

> 狀態：? 已完成（transform + CLI 寫檔，2025-12-12）

- 目標：
  - 完成 `transformAnycontentZhTwToZhCn`（依 pipeline docs 的欄位白名單）。
  - 讓 `tools/convert/generate-zh-cn-from-zh-tw.ts` 支援 dry-run 與實際輸出 zh-CN JSON。
  - 補上基本測試（至少覆蓋 transform）。

- 建議檔案：
  - `src/i18n/zh-tw-to-zh-cn-pipeline.ts`
  - `tools/convert/generate-zh-cn-from-zh-tw.ts`
  - `tests/i18n/zh-tw-to-zh-cn-pipeline.spec.ts`
  - `package.json`（腳本/依賴）
  - `docs/PROJECT_TODO.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`

- 驗收：
  - `npx vitest tests/i18n/zh-tw-to-zh-cn-pipeline.spec.ts`
  - dry-run 範例：`npm run convert:zh-cn -- --input data/anycontent/zh-tw --output data/anycontent/zh-cn --dry-run`
  - 確認輸出 JSON 語言為 zh-cn，白名單欄位已轉換。

---

### T-0016 zh-cn-health-check-tool: zh-TW / zh-CN JSON 健康檢查 CLI

> 狀態：? 尚未開始

- 目標：
  - 實作一支 CLI（或 Node script），用來比對 zh-TW / zh-CN JSON 是否對齊：
    - 掃描 `data/anycontent/zh-tw` 與 `data/anycontent/zh-cn`（可調整）。
    - 檢查：
      - zh-TW 有而 zh-CN 缺的檔案清單。
      - zh-CN 有而 zh-TW 缺的檔案清單。
      - 可能不一致的欄位（如 language 不是 zh-cn 等）。
    - 產出 log 或報表，供後續修正。
  - 與既有 zh-TW→zh-CN pipeline 串接，避免缺漏。

- 關聯檔案：
  - `docs/PROJECT_TODO.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`
  - （預計）`tools/convert/generate-zh-cn-from-zh-tw.ts` 或新 CLI

- 驗收方式：
  - 新增 `npm run check:zh-cn`（或等效指令）可執行健康檢查。
  - 能輸出缺漏或不一致的檔案/欄位摘要（dry-run 報表即可）。
  - notes 記錄變更與 RAW 連結。

---

### T-0027 fix-opencc-types-and-build：修復 opencc-js 型別並讓 npm run build 通過

> 狀態：✅ 已完成（安裝 @types/opencc-js，npm run build 通過，2025-12-12）

- 目標：
  - 消除 `opencc-js` 缺型別導致的 TS7016，讓 `npm run build` 可以順利通過。
  - 確保 zh-TW→zh-CN pipeline 的開發依賴完整，build/type-check 不中斷。
  - 在 docs 記錄採用的解法，若未來需要可再補自定義型別檔。

- 驗收方式：
  - [x] 安裝 `@types/opencc-js`（或必要時新增 `src/types/opencc-js.d.ts`）後，`npm run build` 不再出現 `opencc-js` 型別錯誤。
  - [x] 相關變更與路徑已記錄在 `docs/Windsurf_ChatGPT_NOTES.md` 的 T-0027 小節。

---

### T-0017 html-to-markdown-rules-cleanup: 整理 HTML→Markdown 規則文件

> 狀態：? 已完成（V4 規則整理，2025-12-12）

- 目標：
  - 重寫並整理 `docs/HTML_TO_MARKDOWN_RULES_V4.md`，讓共用規則與圖片策略清楚可維護。
  - 梳理：移除元素、區塊/行內轉換、連結/錨點、圖片（featured / gallery / fallback）。
  - 標記各 post_type 注意事項（teaching sutra 偈語收集、news 主圖＋gallery、其他以簡化策略）。
- 驗收：
  - `HTML_TO_MARKDOWN_RULES_V4.md` 為 UTF-8 正常可讀且結構清楚。
  - 明確指出：Markdown 不嵌入 `![]()`，圖片只收集到 JSON；無可用圖片時三欄位均清空。
  - notes 已記錄本次任務與 RAW 連結。

---

### T-0018 meta-instr-and-status-structure: 整理 INSTR 與狀態紀錄結構

> 狀態：? 已完成（集中 INSTR、補 README/Template，2025-12-12）

- 目標：
  - 將所有 INSTR 檔集中於 `docs/INSTR/`，命名規則 `INSTR-T-xxxx-<slug>.md`（跨任務通用可用 0000）。
  - 新增 `docs/INSTR/README.md` 說明用途、命名與現有列表；新增 `docs/INSTR/INSTR-TEMPLATE.md` 供新增 INSTR 時複製。
  - 在 notes 紀錄 INSTR 變更並附 RAW 連結。
- 驗收：
  - `docs/INSTR/` 內含 README、Template，以及已搬移、依命名規則的 INSTR 檔。
  - `docs/Windsurf_ChatGPT_NOTES.md` 有 T-0018 小節，列出變更與 RAW 連結。
  - 相關變更已 git add/commit/push。

---

### T-0019 enforce-utf8-encoding: 強制文字檔使用 UTF-8 + LF

> 狀態：? 已完成（2025-12-12）

- 目標：
  - 透過 `.editorconfig` / `.gitattributes` 確保文字檔一律 UTF-8、行尾 LF。
  - 在 workflow 中提醒 Windows 使用者如何避免 Big5/ANSI 亂碼。
  - 在 notes 留存 RAW 連結與 commit 紀錄。
- 驗收：
  - 專案根有 `.editorconfig` / `.gitattributes`，內容設定為 UTF-8 + LF。
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 提醒編碼/行尾規則。
  - notes 有 T-0019 小節並附 RAW 連結。

---

### T-0005 news-from-legacy: 映射 NewsMeta 日期與地點欄位（v1）

> 狀態：? 已完成（news meta 日期與地點 mapping v1，2025-12-10 已通過測試）

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
  - `docs/PROJECT_TODO.md`：標記本任務為 ? 並補充實際觀察結果摘要。
  - （選用）`docs/LEGACY_DATA_NOTES.md`：若檔案結構特別複雜，可在此詳述。

- 允許修改的範圍：
  - 僅限上述 docs，與實作 pipeline 無關的部分。
  - 不對舊站檔案做自動搬移／重命名；此類操作需另開專門 T 任務。

### T-0010 rename-workflow-file: 將 workflow 檔名改為 Agent 中立版本

> 狀態：? 已完成（檔名已改為 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`，2025-12-10）

- 目標：
  - 將 workflow 檔更名為 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`（取代舊 windsuf 版命名）。
  - 更新全專案引用到新檔名，敘事以「實作 Agent（目前主要是 Codex）」為主。
- 相關檔案：
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`
  - `docs/TOOLS_ROLES_AND_BOUNDARIES.md`
  - `docs/SESSION_CHECKLIST.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`
  - 其他提到 workflow 檔名的文件
- 作法摘要：
  - 透過 `git mv` 將舊 workflow 檔更名為 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`
  - 更新所有文件的檔名引用，並在新檔案開頭加入改名註記。
- 驗收：
  - [x] repo 內只剩新檔名，舊檔名不再出現於檔案系統或文字內容。
  - [x] 相關 docs 皆引用 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`。
  - [x] 本條狀態標記為 ? 並記載新檔名。

### T-0011 fix-corrupted-docs: 修復亂碼 docs 並統一為 UTF-8

> 狀態：? 尚未開始

- 目標：
  - 將目前 repo 中出現亂碼的幾個 docs 修復為正常的 UTF-8 內容，確保未來 ChatGPT / 實作 Agent 以這些檔案為單一真相來源時不會誤判。
  - 修復對象預期包含：
    - `docs/PROJECT_STATUS.md`
    - `docs/AI_COLLAB_SUMMARY.md`
    - `docs/COMPLETE_PROJECT_WORKFLOW.md`
    - `docs/PENDING_DECISIONS.md`
    - `docs/SESSION_CHECKLIST.md`
    - `docs/TOOLS_ROLES_AND_BOUNDARIES.md`

- 關聯來源（真相來源說明）：
  - 使用者曾將上述檔案的「正常版本」上傳給 ChatGPT（位於 ChatGPT 的 /mnt/data）。
  - 若有疑問，請未來由 ChatGPT 提供最新版內容，再進行小幅調整。

- 建議修改檔案：
  - 以上列出的全部 docs 檔案。

- 允許修改範圍：
  - 允許完整覆蓋內容（以正常 UTF-8 版本取代亂碼版本）。
  - 可小幅調整文字，使之與目前專案實際狀態一致，但不得隨意刪減重要章節。
  - 不改變檔名與整體段落結構的大方向（除非經 ChatGPT 建議並由使用者確認）。

- 驗收方式：
  - 在文字編輯器中以 UTF-8 開啟上述檔案，確認：
    - 中文不再出現大量「嚗」「?」等亂碼。
    - 段落與標題皆為可理解的自然語句。
  - 由 ChatGPT 再次閱讀這些 docs，確認可以用來判斷專案進度與工作流程。
  - 所有變更已依照 workflow：
    - `git add` 相關檔案。
    - `git commit -m "T-0011 fix corrupted docs to UTF-8"`（訊息可微調）。
    - `git push` 到 `origin/main`。
    - 在 `docs/Windsurf_ChatGPT_NOTES.md` 新增一小節紀錄本任務與最後 commit hash。

### T-0012 sync-status-docs: 對齊 PROJECT_TODO / PROJECT_STATUS 與實際進度

> 狀態：? 尚未開始

- 目標：
  - 讓 `docs/PROJECT_TODO.md` 與 `docs/PROJECT_STATUS.md` 真實反映目前 repo 的實作狀態，
    減少未來 ChatGPT / 實作 Agent / 使用者之間的認知落差。

- 關聯 docs：
  - `docs/PROJECT_TODO.md`
  - `docs/PROJECT_STATUS.md`
  - （參考）`docs/Windsurf_ChatGPT_NOTES.md`
  - （參考）`docs/AI_COLLAB_SUMMARY.md`

- 建議修改內容：
  - `docs/PROJECT_TODO.md`：
    - 為 **T-0005 news-from-legacy** 新增狀態行，例如：
      - `> 狀態：? 已完成（news meta 日期與地點 mapping v1，2025-12-10 已通過測試）`
    - 在「原始三項 TODO」中：
      - teaching HTML→AnyContent 的條目，補充目前已有的實作（`teaching-from-legacy` + `teaching-html-to-anycontent.ts`），
        並視情況將狀態更新為「部分完成 / v1 完成」。
    - 確認 T-0006 / T-0010 的敘述與實際情況一致（T-0010 已完成、T-0006 仍等待舊站備份）。
  - `docs/PROJECT_STATUS.md`：
    - 以目前 repo 狀態重寫一版「總覽」，可以依以下區塊撰寫：
      - 爬蟲與 inventory：V1 完成。
      - HTML→Markdown + sutra 規則：V1 完成，sutra 專用規則已上線。
      - teaching / news / magazine adapters：皆有 minimal v1，且 teaching / news 有測試。
      - docs snapshot CLI（T-0007）：已實作並驗收。
      - zh-TW→zh-CN pipeline：僅有規格，尚未實作。
      - legacy data root（T-0006）：等待完整備份。
      - WordPress importer / React 前端：尚未開始實作（僅有架構與構想）。

- 允許修改範圍：
  - 僅限狀態描述與摘要文字，不大改既有章節結構。
  - 不刪除任何既有 T 任務，只更新其狀態與說明。

- 驗收方式：
  - 由 ChatGPT 再次閱讀 `PROJECT_TODO.md` 與 `PROJECT_STATUS.md`，確認：
    - T-0005 與 teaching 相關實作與檔案列表、測試狀態皆有描述。
    - 各大模組的完成度敘述符合目前 repo 的實作。
  - 變更依 workflow 提交：
    - `git add` 相關檔案。
    - `git commit -m "T-0012 sync PROJECT_TODO and PROJECT_STATUS with current repo state"`（訊息可微調）。
    - `git push` 到 `origin/main`。
    - 在 `docs/Windsurf_ChatGPT_NOTES.md` 新增 T-0012 對應小節與 commit hash。

### T-0025 legacy-new-visual-compare-tool：舊站 / AnyContent / 新站視覺比對工具（單頁兩欄＋ index）

> 狀態：⬜ 尚未開始（概念登記，未實作）

- 目標（介面形態）：
  - 做成「單獨的一頁小工具」：左右兩欄 + 上方/側邊的 index 總表。
  - 左欄：顯示舊站內容，可嵌入 legacy URL（iframe/預覽）或載入本機 legacy HTML 供純文字/簡易 render，讓使用者看到舊站原貌。
  - 右欄：可切換視圖（tab/按鈕），至少包含：
    - 新前端頁面 render（若已有 React/Next 頁面，直接 URL 預覽）。
    - AnyContent JSON 的可讀版（欄位重組：標題、內文、偈語、圖片 meta 等）。
    - WordPress 資料摘要（若已匯入：post_id、slug、meta 等）。
  - index 總表：每列是一筆 mapping，欄位示意：
    - legacy URL 或檔案路徑
    - AnyContent JSON 路徑（如 data/anycontent/zh-tw/teaching/...）
    - 新站 URL（如未來 /teaching/... slug）
    - WordPress post ID / slug（若已知）
  - 點選 index 的一列時，左/右欄同步切換到對應的 legacy / 新頁 / JSON / WP 資料。

- 驗收精神（粗略，實作時可細化）：
  - [ ] 單頁工具具備左右兩欄與 index；右欄可在「新頁 render / AnyContent JSON / WP 資料」三種視圖間切換。
  - [ ] 至少先支援 teaching 或 news 其中一種 post_type，後續可擴充 magazine 等其他類型。
  - [ ] 可協助兩層檢查：
    - A. 新舊網站對應關係是否正確（URL/slug/post_id 等 mapping）。
    - B. 資料欄位是否正確（偈語、標題、內容段落有無漏/錯欄位）。

- 備註：
  - 本 T 僅為 roadmap 登記，未強制立即實作；正式開發時應另開後續 T（如 T-0030）＋ INSTR 拆解技術細節。

### T-0026 implement-visual-compare-tool-v1：舊站 / AnyContent / 新站對照工具 v1

> 狀態：✅ 已完成（dev 工具在 `/dev/compare`，支援 teaching sample-001，2025-12-12）

- 目標：
  - 實作一個 dev 單頁工具，方便人工比對 legacy / AnyContent / 新站：
    - 上方：index 總表（以 data/compare/index.json 為來源，一列一組 mapping）。
    - 左欄：legacy 預覽（可切換本機 HTML 或 legacy URL）。
    - 右欄：可切換 zh-TW JSON / zh-CN JSON / 新站 URL（暫可 placeholder） / WordPress（暫可 placeholder）。
  - v1 聚焦 teaching sample-001，後續可擴充更多 mapping。

- 驗收方式：
  - [x] `npm run dev` 可開啟 `/dev/compare`，看到 index + 左右欄 layout。
  - [x] index 中至少有 `teaching-sample-001`，點選後：
    - 左欄可預覽 `data/legacy-teaching/sample-001.html`。
    - 右欄 zh-TW/zh-CN JSON tab 可看到 AnyContent 檔案內容。
    - New page / WordPress 目前可顯示 placeholder 或 URL/ID（若未填）。
  - [x] 相關路徑與使用說明已記錄在 `docs/Windsurf_ChatGPT_NOTES.md` 的 T-0026 小節。

### T-0029 news-sample-and-visual-compare：news 範例＋視覺對照整合

> 狀態：✅ 已完成（news sample-001 end-to-end + dev compare 更新，2025-12-12）

- 目標：
  - 建立一組 news 範例資料，涵蓋：
    - legacy HTML（sample-001）
    - zh-TW AnyContent JSON（post_type=news）
    - zh-CN AnyContent JSON（pipeline 轉出）
  - 將該範例掛入 `/dev/compare` 視覺比對工具的 index，與 teaching 範例並列檢視。

- 驗收：
  - [x] `data/legacy-news/sample-001.html` 內容可預覽（含標題、日期、地點、正文）。
  - [x] `data/anycontent/zh-tw/news/sample-001.json` 與 `data/anycontent/zh-cn/news/sample-001.json` 建立，欄位符合 `NewsContent`，語言標記正確。
  - [x] `data/compare/index.json` 新增 `news-sample-001`，在 `/dev/compare` 可選擇並同步左右欄顯示。
  - [x] `npm test` 與 `npm run build` 通過（依 T-0028 規則）。

### T-0030 magazine-sample-and-visual-compare：magazine 範例＋視覺對照整合

> 狀態：✅ 已完成（magazine sample-001 end-to-end + dev compare 更新，2025-12-12）

- 目標：
  - 建立一組 magazine 範例資料，涵蓋：
    - legacy HTML（sample-001）
    - zh-TW AnyContent JSON（post_type=magazine）
    - zh-CN AnyContent JSON（pipeline 轉出）
  - 將該範例掛入 `/dev/compare` 視覺比對工具的 index，與 teaching/news 範例並列檢視。

- 驗收：
  - [x] `data/legacy-magazine/sample-001.html` 可預覽（含標題、期別/日期、正文）。
  - [x] `data/anycontent/zh-tw/magazine/sample-001.json` 與 `data/anycontent/zh-cn/magazine/sample-001.json` 建立，欄位符合 `MagazineContent`，語言標記正確。
  - [x] `data/compare/index.json` 新增 `magazine-sample-001`，在 `/dev/compare` 可選擇並同步左右欄顯示。
  - [x] `npm test` 與 `npm run build` 通過（依 T-0028 規則）。
### T-0031 define-anycontent-v1-schema-v1-draft：整理 AnyContent V1 schema 底稿

> 狀態：✅ 已完成（產出 CONTENT_SCHEMA_V1 草稿，2025-12-12）

- 目標：
  - 彙整 teaching/news/magazine 欄位，產出 AnyContent V1 schema 草稿文件。
  - 說明共用欄位與各 post_type 專用欄位，並註記 zh-TW / zh-CN 轉換注意事項。
  - 為後續 schema 調整建立基準（若有破壞性更新應另開 T 任務討論）。

- 驗收：
  - [x] `docs/CONTENT_SCHEMA_V1.md` 建立，含共用欄位、各 post_type 欄位、繁簡轉換注意事項、後續擴充提醒。
  - [x] `docs/CONTENT_SCHEMA.md` 標註 V1 草稿位置。
  - [x] notes 記錄本次草稿與 RAW 連結。
### T-0032 refine-anycontent-v1-schema-details：補齊 AnyContent V1 schema 欄位說明

> 狀態：✅ 已完成（補齊 teaching/news/magazine 欄位與繁簡轉換描述，2025-12-12）

- 目標：
  - 依現有 TypeScript 與 sample JSON，補齊 V1 schema 草稿的欄位細節。
  - 清楚標示各 post_type 專用欄位，以及 zh-TW / zh-CN 轉換範圍。
  - 為後續 schema 調整提供基準，若要破壞性變更需另開任務。

- 驗收：
  - [x] `docs/CONTENT_SCHEMA_V1.md` 已補上教學/新聞/雜誌欄位細節與繁簡轉換注意事項。
  - [x] `docs/CONTENT_SCHEMA.md` 保留舊版說明並提示 V1 草稿位置。
  - [x] notes 記錄本次草稿更新與 RAW 連結。
### T-0033 plan-future-branch-gallery-index_page inventory+schema templates

> 狀態：⏳ 尚未啟動（僅登記未來規劃，2025-12-12）

- 目標：
  - 為後續可能需要的 branch / gallery / index_page 任務預先規劃「inventory＋schema」類型的模板。
  - 不在本任務內實作實際 inventory 或 schema；僅在 TODO 中記下未來需要的新模板方向。
- 預期模板內容（概念）：
  - 每種類型（branch / gallery / index_page）包含：
    - inventory 步驟（如 crawl/抓取代表頁面、列出檔案清單）。
    - schema 設計步驟（如何從 legacy HTML 抽出 AnyContent/WordPress 欄位）。
    - sample JSON + /dev/compare 對照（若未來需要）。
  - 未來實作時再拆成對應的 T 任務（另開 INSTR）。
  - 驗收（僅登記）：
    - [ ] PROJECT_TODO 已新增本條目，說明未來模板方向。
    - [ ] notes 已紀錄本次登記與 RAW 連結。

### T-0035 add-unclassified-content-flags：新增未分類內容標記欄位

> 狀態：✅ 已完成（schema/workflow/rules 更新，2025-12-12）

- 目標：
  - 在 AnyContent V1 schema 加入共用欄位 `meta.has_unclassified_content`（boolean）與 `meta.unclassified_notes`（string），方便標記暫未分類的內容。
  - 在 HTML→Markdown 規則與 workflow 中說明這兩個欄位的用途：暫時留在 `body_markdown`，必要時以旗標標記，後續再開 T 任務處理。

- 驗收：
  - [x] `docs/CONTENT_SCHEMA_V1.md` 增列兩個欄位說明。
  - [x] `docs/HTML_TO_MARKDOWN_RULES_V4.md` 補充如何搭配旗標使用的 fallback 規則。
  - [x] `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 提醒 adapter 編輯時可視需要設定旗標。
  - [x] notes 紀錄本次規則更新與 RAW 連結。
### T-0034 unknown-content-handling-rule：新增「未知內容暫存」規則

> 狀態：✅ 已完成（rule 已寫入 HTML_to_MD / workflow，2025-12-12）

- 目標：
  - 在 HTML→Markdown / AnyContent 規則與 workflow 中，明定「無法歸類內容」的處理方式。
  - 避免任意新增 meta 欄位，優先放入 `body_markdown`，保留 legacy 對照，必要時另開 T 任務。

- 驗收：
  - [x] `docs/HTML_TO_MARKDOWN_RULES_V4.md` 新增未知內容 fallback 段落。
  - [x] `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 加入 adapter 編輯時需遵守的未知內容處理提醒。
  - [x] notes 記錄本次規則更新與 RAW 連結。
