# PROJECT_TODO：中台世界 Headless 專案任務列表

> 說明：本檔列出本專案各個 T-xxxx 任務的狀態與簡要說明。  
> - 所有實作與測試狀態以 GitHub/main 為準。  
> - 每顆 T 的詳細過程與 RAW 連結請參考 `docs/Windsurf_ChatGPT_NOTES.md`。  
> - 新任務請依 `docs/INSTR/INSTR-TEMPLATE.md` 撰寫 INSTR，再由 ChatGPT 產生任務內容。

---

## TODO 列表（原始三項）

### 1. crawl / inventory：舊站網址與檔案盤點
> 狀態：✅ 已完成（V1 盤點）
- 工具：`tools/crawl/crawl-ctworld.ts`、`tools/crawl/filesystem-inventory.ts`、`tools/crawl/diff-crawl-vs-files.ts`。
- 輸出：`data/crawl/*.json/csv`（網址清單、檔案清單、差異報表）。
- 說明：用於比對舊站與本機檔案結構差異，後續可再針對特定目錄細化。

### 2. HTML → AnyContent：teaching
> 狀態：✅ 已完成（V1 教學轉換與測試）
- 工具：`src/adapters/teaching-from-legacy.ts`、`tools/convert/teaching-html-to-anycontent.ts`。
- 規則：`docs/HTML_TO_MARKDOWN_RULES_V4.md`、`docs/CONTENT_SCHEMA_V1.md`。
- 說明：從 legacy teaching HTML 轉成 AnyContentTeaching JSON，偈語與欄位 mapping 已有測試覆蓋。

### 3. zh-TW → zh-CN pipeline（umbrella）
> 狀態：⏳ 拆解中（由 T-0013 等子任務處理）
- 規格：`docs/ZH_TW_TO_ZH_CN_PIPELINE.md`、`docs/CONTENT_SCHEMA_V1.md`。
- 說明：整體 pipeline 拆成多顆 T（T-0013 docs 規格、T-0014/15/16/27 等程式任務），以 docs/notes 狀態為準。

---

## T 系列任務（依 ChatGPT 產生）

> 狀態與細節以 `docs/Windsurf_ChatGPT_NOTES.md` 為準（如有出入，以 notes 最新記錄為主）。

### T-0001 teaching-from-legacy：teaching verses 與 meta 映射
> 狀態：✅ 已完成（v1，詳見 notes）
- 目標：建立 teaching-from-legacy adapter，支援偈語欄位與基本 meta。

### T-0002 anycontent-types：定義 AnyContent 型別（teaching/news/magazine）
> 狀態：✅ 已完成（v1 型別與 contract）
- 目標：整理 AnyContent 共用與各 post_type 型別，並通過 typecheck。

### T-0003 news-from-legacy：NewsContent minimal mapping
> 狀態：✅ 已完成（v1，含日期/地點 basic mapping）
- 目標：news adapter 能從 legacy HTML 產出基本內容與 meta。

### T-0004 magazine-from-legacy：MagazineContent minimal mapping
> 狀態：✅ 已完成（v1 骨架）
- 目標：magazine adapter 具備基本欄位與圖片處理，進階 meta 另開任務。

### T-0005 news-from-legacy meta：news meta 日期/地點 mapping v1
> 狀態：✅ 已完成（2025-12-10 驗證）
- 目標：解析 news meta 的日期、地點並填入對應欄位。

### T-0006 legacy-data-root：設定 CTWORLD_LEGACY_ROOT（舊站備份）
> 狀態：⛔ blocked（待完整備份）
- 目標：取得完整舊站備份並設定 docroot，方可進一步盤點與轉換。

### T-0007 docs-snapshot-cli：產生 docs snapshot ZIP
> 狀態：✅ 已完成
- 目標：`npm run snapshot:docs -- --task T-0007` 產生 `snapshots/ctworld-docs-<task>-<date>.zip`（僅 docs/* 與 docs/terminal_logs/*）。

### T-0010 rename-workflow-file：workflow 改為 Agent 中立命名
> 狀態：✅ 已完成
- 目標：workflow 檔案改名為 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 並更新引用。

### T-0011 fix-corrupted-docs：修復亂碼 docs（UTF-8）
> 狀態：✅ 已完成
- 目標：將既有亂碼 docs 改為 UTF-8 正常內容，記錄於 notes。

### T-0012 sync-status-docs：對齊 PROJECT_TODO / PROJECT_STATUS 與實際進度
> 狀態：✅ 已完成
- 目標：更新 TODO / STATUS，使描述與程式現況一致。

### T-0013 zh-tw-to-zh-cn-pipeline-design：docs 規格設計
> 狀態：✅ 已完成（docs-first）
- 目標：在 pipeline 文檔中列出欄位白名單、CLI 參數與輸入/輸出結構。

### T-0014 zh-tw-to-zh-cn-pipeline-core-and-cli-skeleton
> 狀態：請參考 notes（歷史條目）
- 目標：建立繁簡轉換 utility 與 CLI skeleton（含 dry-run）。

### T-0015 zh-tw-to-zh-cn-pipeline-write-json
> 狀態：請參考 notes（歷史條目）
- 目標：將 AnyContent zh-TW JSON 轉出 zh-CN JSON（含 dry-run/transform）。

### T-0016 zh-cn-health-check-tool：zh-TW / zh-CN JSON 健康檢查 CLI
> 狀態：請參考 notes（歷史條目）
- 目標：檢查 zh-TW/zh-CN JSON 成對與欄位一致性。

### T-0017 html-to-markdown-rules-cleanup：HTML→Markdown 規則整理
> 狀態：✅ 已完成（V4 規則重寫）
- 目標：整理共用規則、圖片策略與各 post_type 注意事項。

### T-0018 meta-instr-and-status-structure：INSTR 目錄與模板
> 狀態：✅ 已完成
- 目標：建立 `docs/INSTR/` README、模板，統一 INSTR 命名。

### T-0019 enforce-utf8-encoding：強制 UTF-8 + LF
> 狀態：✅ 已完成
- 目標：加入 `.editorconfig`、`.gitattributes` 並在 workflow 提醒編碼/行尾。

### T-0025 legacy-new-visual-compare-tool：三欄視覺比對工具（構想）
> 狀態：✅ 已完成（需求登記與規格）
- 目標：規劃左/中/右三欄比對 legacy HTML、AnyContent、New/WP 頁面，含 index 總表。

### T-0026 implement-visual-compare-tool-v1
> 狀態：請參考 notes（dev/compare 實作進度）
- 目標：在 `/dev/compare` 提供 index + 左右欄對照，先支援 sample。

### T-0027 fix-opencc-types-and-build：opencc-js 型別修正
> 狀態：請參考 notes（歷史條目）
- 目標：修正 opencc-js 型別/建置問題，讓 build 可通過。

### T-0029 news-sample-and-visual-compare：news sample end-to-end
> 狀態：請參考 notes
- 目標：建立 news sample-001（legacy→zh-tw→zh-cn）並掛入 /dev/compare。

### T-0030 magazine-sample-and-visual-compare：magazine sample end-to-end
> 狀態：請參考 notes
- 目標：建立 magazine sample-001（legacy→zh-tw→zh-cn）並掛入 /dev/compare。

### T-0031 define-anycontent-v1-schema-v1-draft：AnyContent V1 schema 草稿
> 狀態：✅ 已完成
- 目標：彙整 teaching/news/magazine 的 V1 schema 文件並更新 CONTENT_SCHEMA。

### T-0032 refine-anycontent-v1-schema-details：補齊 V1 schema 細節
> 狀態：✅ 已完成
- 目標：補充各 post_type 欄位細節與樣本，持續對齊程式。

### T-0033 plan-future-branch-gallery-index_page templates
> 狀態：⏳ 尚未啟動（僅登記未來規劃）
- 目標：預留 branch/gallery/index_page 的 inventory＋schema 模板方向。

### T-0034 unknown-content-handling-rule：未知內容暫存規則
> 狀態：✅ 已完成
- 目標：明定無欄位對應的內容暫留 `body_markdown`，必要時標記 unclassified flags。

### T-0035 add-unclassified-content-flags：新增未分類旗標欄位
> 狀態：✅ 已完成
- 目標：在 schema/workflow 中加入 `meta.has_unclassified_content` 與 `meta.unclassified_notes`。

### T-0036 compare-unclassified-flag：/dev/compare 顯示未分類旗標
> 狀態：✅ 已完成
- 目標：在 compare index/右欄顯示 has_unclassified_content，提供篩選與提示。

### T-0037 sync-html-to-markdown-unknown-content：補回未知內容段落
> 狀態：✅ 已完成
- 目標：在 RULES_V4 補充未知內容 fallback 段落，與 schema/workflow 對齊。

### T-0038 zh-cn-health-check-cli：實作 zh-TW / zh-CN JSON 健康檢查工具
> 狀態：✅ 已完成
- 目標：`tools/convert/check-zh-cn-health.ts` + `npm run check:zh-cn`。

### T-0039 zh-cn-health-check-in-workflow：將檢查流程寫入 workflow/checklist
> 狀態：✅ 已完成
- 目標：在 workflow / SESSION_CHECKLIST 加入 `npm run check:zh-cn` 規則。

### T-0040 instr-template-files-for-chatgpt：INSTR 模板加上檔案清單提醒
> 狀態：✅ 已完成
- 目標：INSTR 模板與 workflow 提醒列出檔案清單、避免 citation。

### T-0041 teaching-batch-from-crawl-pilot：crawl 教學小批次暫停
> 狀態：⛔ blocked（缺少教學頁 HTML）
- 目標：取得 3–5 篇實際教學 HTML 後，再進行 batch 轉換與 compare。

### T-0043 workflow-safety-level-note：補充 workflow 安全等級
> 狀態：✅ 已完成
- 目標：說明 test/build/check:zh-cn 的執行規則、RAW 停用條件、審核要求。

### T-0044 cleanup-project_todo-header-and-structure：整理 PROJECT_TODO 檔頭與結構
> 狀態：✅ 已完成
- 目標：清理檔頭亂碼、整理段落格式，使狀態對齊 notes。

### T-0045 magazine-meta-from-legacy-v1：雜誌期別與出版日期 meta 映射 v1

> 狀態：✅ 已完成（magazine-from-legacy 新增 issue / publish date 映射，2025-12-12）

- 目標：
  - 在雜誌 adapter 中，從 legacy HTML 解析期別與出版日期，灌入 AnyContent magazine meta。
  - 確保 `CONTENT_SCHEMA_V1`、TypeScript 型別與 sample JSON 在這些欄位上對齊。
- 驗收：
  - [x] `src/adapters/magazine-from-legacy.ts` 具備 issue/date 解析與映射邏輯。
  - [x] `tests/adapters/magazine-from-legacy.spec.ts` 新增 issue/date 測試並通過 `npm test`。
  - [x] `npm run build` 通過。

### T-0049 html-to-md-gap-review：HTML→Markdown 規則 vs 實作落差盤點

> 狀態：✅ 已完成（整理落差筆記至 RULES_CROSSCHECK_NOTES_V1，2025-12-12）

- 目標：
  - 盤點 `HTML_TO_MARKDOWN_RULES_V4.md` 與實作/測試的差異，僅寫筆記，不改程式碼。
  - 在 `RULES_CROSSCHECK_NOTES_V1.md` 條列：✅ 已對齊、⚠️ 待補、📌 未來 T 建議。
- 驗收：
  - [x] RULES_CROSSCHECK_NOTES_V1.md 新增 HTML→Markdown 落差小節。
  - [x] 未改動 src/tools/tests/data；純 docs。
  - [x] notes 記錄本次任務。

### T-0050 html-image-gallery-rules-v1-design：HTML 圖片 / 圖說 / Gallery 規則 V1 設計（docs-only）

> 狀態：✅ 已完成（圖片規則 V1 文檔化，2025-12-12）

- 目標：
  - 在 `HTML_TO_MARKDOWN_RULES_V4.md` 補充圖片/圖說/gallery 專章，標示已實作 vs 未實作。
  - 在 `CONTENT_SCHEMA_V1.md` 補齊 `featured_image` / `featured_image_caption` / `gallery_items` 欄位說明與轉換備註。
  - 在 `RULES_CROSSCHECK_NOTES_V1.md` 更新圖片相關落差與未來 T 建議。
- 驗收：
  - [x] V4 文件有清楚的圖片/圖說/gallery V1 行為，並標示實作狀態。
  - [x] Schema V1 補上圖片欄位定義與繁簡轉換說明。
  - [x] Crosscheck 筆記更新圖片缺口與後續 T 建議；未改動程式碼。

### T-0051 teaching-image-gallery-impl-v1：Teaching 圖片 / 圖說 / Gallery V1 實作

> 狀態：✅ 已完成（教學圖片拆解與 sample 更新，2025-12-12）

- 目標：
  - teaching 從 legacy HTML 拆出封面圖與 gallery，填入 `featured_image` / `featured_image_caption` / `gallery_items`。
  - 圖片順序與 alt 保留，caption 以 alt 為主（缺少則為 null）。
  - 教學 sample（legacy HTML、zh-tw / zh-cn JSON、/dev/compare index）同步展示圖片欄位，便於驗收。

- 驗收：
  - [x] `teaching-from-legacy` 以第一張圖為封面，其餘為 gallery，caption 取自 alt（無則 null）。
  - [x] `npm test`、`npm run build` 通過；若觸及 zh-CN JSON，亦執行 `npm run check:zh-cn`。
  - [x] `data/legacy-teaching/sample-001.html`、`data/anycontent/zh-tw|zh-cn/teaching/sample-001.json`、`data/compare/index.json` 同步更新，包含封面與 gallery 圖片。
  - [x] notes 記錄本次變更與 RAW 連結。

### T-0052 workflow-instr-for-all-tasks：每個 T 任務必須配對 INSTR（workflow 規則）

> 狀態：✅ 已完成（workflow / INSTR-TEMPLATE / TODO / notes 已更新，2025-12-12）

- 目標：
  - 在 workflow 寫明「沒有 INSTR 不開工」，每顆 T 任務都要有 `docs/INSTR/INSTR-T-xxxx-<slug>.md`。
  - 更新 INSTR-TEMPLATE，強調要列允許修改檔案、必跑測試（docs-only 可註記未跑 test/build）、禁用 citation。
  - 在 TODO / notes 登記本規則，方便後續查閱。

- 驗收：
  - [x] `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 新增「每個 T 任務需對應 INSTR .md」規則。
  - [x] `docs/INSTR/INSTR-TEMPLATE.md` 反映上述規則與 docs-only 測試註記。
  - [x] `docs/PROJECT_TODO.md` 新增並標記完成 T-0052；notes 有對應小節與 RAW 連結。

### T-0053 news-magazine-image-gallery-impl-v1：news / magazine 圖片 / 圖說 / Gallery V1 實作

> 狀態：✅ 已完成（news / magazine 圖片欄位與 sample 更新，2025-12-12）

- 目標：
  - news / magazine 從 legacy HTML 拆出封面圖與 gallery，填入 `featured_image` / `featured_image_caption` / `gallery_items`（caption 取 alt，缺則 null）。
  - 更新 sample（legacy HTML、zh-tw / zh-cn JSON）展示封面 + 至少 2 張 gallery 圖，compare 可對照。
  - 測試覆蓋 news / magazine 的圖片拆解與 meta 行為。

- 驗收：
  - [x] `news-from-legacy` / `magazine-from-legacy` 以第一張圖為封面、其餘為 gallery，caption 取 alt。
  - [x] `npm test`、`npm run build`、`npm run check:zh-cn` 通過（觸及 zh-CN JSON）。
  - [x] Sample 同步：`data/legacy-news|magazine/sample-001.html`、`data/anycontent/zh-tw|zh-cn/news|magazine/sample-001.json` 含封面與 gallery；compare index 保持可瀏覽。
  - [x] notes 記錄本次變更與 RAW 連結。

### T-0054 layout-and-multi-gallery-schema-design：gallery 樣式與多 gallery schema（docs-only）

> 狀態：✅ 已完成（設計 schema / 規則，未實作程式，2025-12-12）

- 目標：
  - 在 `CONTENT_SCHEMA_V1.md` 預留 `default_gallery_style`、`gallery_blocks` 欄位，支援未來多 gallery 區塊與樣式覆寫。
  - 在 `HTML_TO_MARKDOWN_RULES_V4.md` 標註 layout / multi-gallery 尚未由 extractor 產出，暫維持 `featured_image` + `gallery_items`。
  - 在 crosscheck / notes 紀錄此設計，便於後續 T（adapter / importer / frontend）實作時參考。

- 驗收：
  - [x] `CONTENT_SCHEMA_V1.md` 增列 `default_gallery_style`、`gallery_blocks` 欄位與欄位意義。
  - [x] `HTML_TO_MARKDOWN_RULES_V4.md` 註明 layout / multi-gallery 尚未產出，需未來 T 實作。
  - [x] `RULES_CROSSCHECK_NOTES_V1.md`、`PROJECT_TODO.md`、`Windsurf_ChatGPT_NOTES.md` 有對應 T-0054 紀錄；本次為 docs-only，未跑測試。

### T-0055 teaching-news-magazine-gallery-adapter-v2：gallery style/block 輸出與 sample 更新

> 狀態：✅ 已完成（teaching/news/magazine adapter v2，2025-12-12）

- 目標：
  - teaching / news / magazine adapter 輸出 `meta.default_gallery_style`（預設：teaching=`grid-2`，news/magazine=`grid-3`），並新增 `gallery_blocks`（main_gallery 對應全部 gallery_items）。
  - sample JSON（zh-tw / zh-cn）改為有效 UTF-8，帶 main_gallery block；compare dev page 可看到 default_gallery_style / gallery_blocks 指標。
  - 仍保留既有 `featured_image` / `featured_image_caption` / `gallery_items` 行為。
- 驗收：
  - [x] 三個 adapter 皆輸出 `meta.default_gallery_style` 與 `gallery_blocks`，且未破壞既有圖片欄位。
  - [x] teaching/news/magazine sample JSON（zh-tw / zh-cn）更新，/dev/compare 可顯示新的欄位摘要。
  - [x] `npm test`、`npm run build`、`npm run check:zh-cn` 通過；notes 有 T-0055 小節與 RAW 連結。

### T-0046 fix-instr-encoding-and-snapshot-rules：修正 INSTR 編碼與補強 snapshot 規則
> 狀態：✅ 已完成（2025-12-12）
- 目標：確保指定 INSTR/README/PROJECT_TODO 為 UTF-8，並在 workflow 補充 docs snapshot 使用規則。

### T-0056 progress-dashboard-daily-update：每日更新進度儀表板

> 狀態：✅ 已完成（2025-12-12；dev/docs-only）

- 目標：
  - 建立可手動每日更新的進度儀表板（docs/DESIGN/ctworld-progress-dashboard.html），以 tasks 陣列呈現當日完成的 T 任務與描述。
  - 由 Codex 依 PROJECT_TODO / Windsurf_ChatGPT_NOTES 補齊最新完成度，更新 Timeline 與 checkbox。
- 驗收：
  - [x] 儀表板頁可顯示日期分組、完成度百分比與 checkbox 狀態。
  - [x] 已填入近期任務（例如 T-0054、T-0055），並標記完成。
  - [x] notes 中有 T-0056 小節與 RAW 連結；本次為 dev/docs-only。

### T-0057 deploy-progress-dashboard-to-siteground：部署儀表板到 SiteGround（dev script）

> 狀態：✅ 已完成（2025-12-12；dev-only）

- 目標：
  - 提供一個 SFTP 部署腳本，將 dev/progress-dashboard/ctworld-progress-dashboard.html 上傳到 SiteGround 指定路徑。
  - 以 .env.siteground 管理站台憑證，不將密碼/金鑰寫入 repo。
- 驗收：
  - [x] scripts/deploy/deploy-progress-dashboard-to-siteground.js 可讀取環境變數並上傳 HTML。
  - [x] .env.siteground.example 提供 placeholders；新增 npm script deploy:progress-dashboard。
  - [x] notes 中有 T-0057 小節與 RAW 連結；本次為 dev/docs-only，未實際佈署。

### T-0058 wordpress-gallery-importer-schema-and-mapping：WordPress content model & importer mapping（docs-only）

> 狀態：✅ 已完成（2025-12-12；docs-only）

- 目標：
  - 定義 AnyContent teaching/news/magazine 與 WordPress post type / taxonomy / meta / ACF 欄位的對應（含 gallery_blocks / default_gallery_style）。
  - 建立 `docs/DESIGN/WP_CONTENT_MODEL_V1.md`，供 importer / ACF / 後台 UI 後續實作參考。
- 驗收：
  - [x] 新增 content model 文檔並涵蓋三個 post_type mapping。
  - [x] 在 CONTENT_SCHEMA_V1 補充 cross-link，方便查找 WordPress 對應文件。
  - [x] notes 中有 T-0058 小節與 RAW 連結；本次為 docs-only，未執行測試。

### T-0060 workflow-review-and-temp-files：ChatGPT review 規則與 TEMP 檔交接

> 狀態：✅ 已完成（2025-12-12；workflow/docs-only）

- 目標：
  - 在 workflow 中寫清 ChatGPT review 決策與輸出規則（結論→重點註記→需要的檔案清單）。
  - 定義 `docs/TEMP/` 暫存交接流程（路徑以 `__` 取代 `/`，review 後可清空），並忽略於 git。
- 驗收：
  - [x] `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 更新 review 規則與 `docs/TEMP/` 流程。
  - [x] `.gitignore` 忽略 `docs/TEMP/`；TODO/notes 登記 T-0060 完成。
  - [x] notes 中有 T-0060 小節與 RAW 連結；本次為 docs-only，未跑測試。

### T-0061 gallery-default-style-strategy-docs-only：gallery 預設樣式與 WP 內容欄位策略（docs-only）

> 狀態：? 已完成（2025-12-12；docs-only）

- 目標：
  - 在 `PENDING_DECISIONS.md` 明確記錄 gallery 預設樣式 A/B/C 案（目前真相：A 案由 adapter 設置 `meta.default_gallery_style`；teaching=`grid-2`，news/mag=`grid-3`；importer 不補 fallback）。
  - 補充 WordPress 內容欄位策略：dry-run 將 `body_markdown` 暫存於 `wp_content_html`，預期 v2 匯入前轉 HTML。
  - 讓 schema 與 WP content model 反映上述策略並交叉連結。
- 驗收：
  - [x] `PENDING_DECISIONS.md` 有 gallery default style 策略與 wp_content_html/markdown 記錄。
  - [x] `CONTENT_SCHEMA_V1.md` / `DESIGN/WP_CONTENT_MODEL_V1.md` 更新並 cross-link，描述現行策略與未來變化需另開 T。
  - [x] notes 有 T-0061 小節與 RAW 連結；本次為 docs-only，未執行測試。

### T-0062 workflow-v5.2-single-source-temp-zip-and-hash-manifest：交接包單一來源 + MANIFEST（docs-only）

> 狀態：? 已完成（2025-12-12；workflow/docs-only）

- 目標：
  - 將 ChatGPT review 交接統一為 `docs/TEMP.zip` + `MANIFEST.json`，避免混用 RAW / 零散檔；`MANIFEST` 必列 source_commit + sha256。
  - 在 workflow 寫明 Codex 回報 Gate（四要點）：完成狀態、commit hash、測試狀態、TEMP.zip 就緒（含 source_commit）。
  - `.gitignore` 確認忽略 `docs/TEMP/` 與 `docs/TEMP.zip`。
- 驗收：
  - [x] workflow 更新 TEMP.zip + MANIFEST 規則，以及 Codex 最小回報集。
  - [x] `.gitignore` 忽略 `docs/TEMP/` 與 `docs/TEMP.zip`。
  - [x] notes 有 T-0062 小節與 RAW 連結；本次為 docs-only，未執行測試。

### T-0057 deploy-progress-dashboard-to-siteground：部署儀表板到 SiteGround（dev script）

> 狀態：✅ 已完成（2025-12-12；dev-only）

- 目標：
  - 提供一個 SFTP 部署腳本，將 dev/progress-dashboard/ctworld-progress-dashboard.html 上傳到 SiteGround 指定路徑。
  - 以 .env.siteground 管理站台憑證，不將密碼/金鑰寫入 repo。
- 驗收：
  - [x] scripts/deploy/deploy-progress-dashboard-to-siteground.js 可讀取環境變數並上傳 HTML。
  - [x] .env.siteground.example 提供 placeholders；新增 npm script deploy:progress-dashboard。
  - [x] notes 中有 T-0057 小節與 RAW 連結；本次為 dev/docs-only，未實際佈署。

### T-0059 wordpress-gallery-importer-cli-v1：AnyContent→WP 匯入 dry-run CLI

> 狀態：✅ 已完成（2025-12-12；CLI dry-run）

- 目標：
  - 依 WP content model 產出 dry-run CLI，將 AnyContent JSON 轉為 WP 匯入 payload 並輸出 JSON 計畫檔（不呼叫 WP）。
  - 保留圖片與 gallery 欄位（featured_image、gallery_items、gallery_blocks、default_gallery_style）與 meta。
- 驗收：
  - [x] src/wp/import/anycontent-to-wp.ts 提供轉換函式；src/wp/import/types.ts 定義 WPImportRecord。
  - [x] 	ools/wp-import/wp-import-from-anycontent.ts 可掃描 data/anycontent，產生 dry-run 計畫檔；npm script wp:import:dry-run 可執行。
  - [x] notes 中有 T-0059 小節與 RAW 連結；
pm test、
pm run build 通過。
