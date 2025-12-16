
### T-0103 directus-db-hardening: roles/tokens, indexes, backup runbook

> 狀態：? 已完成（2025-12-17）

- 目標：
  - 在 docs 記錄 Directus token/role 分工（Astro readonly / Importer write），避免前端使用 admin token。
  - 新增 DB migration：`apps/directus/db/migrations/001_any_content_constraints_and_indexes.sql`（type+lang+slug 唯一、常用索引）。
  - 建立備份/還原 runbook。
- 驗收：
  - [x] `docs/SECURITY/DIRECTUS_TOKENS_AND_ROLES.md` 記錄 token/role 與環境變數。
  - [x] migration 檔已入 repo，apps/directus/README 說明執行方式。
  - [x] `docs/OPS/BACKUP_RESTORE_DIRECTUS_POSTGRES.md` 提供備份/還原與驗證步驟。

### T-0105 first-uizip-pilot-articlecard-listing：ArticleCard + 列表 UI 落地並準備外部 debug

> 狀態：? 已完成（2025-12-17）

- 目標：
  - 建立 `ArticleCard` 元件並在 `/[lang]/[type]/index` 以卡片列表呈現 Directus 資料（無資料則顯示範例卡片）。
  - 依 DevTools checklist 記錄 UI 參數，存於 `docs/QA/UI_SNAPSHOTS/T-0105/DEVTOOLS_PARAMS.md`，預留桌機/平板/手機截圖。
  - 準備外部 AI debug 檔案路徑（T-0105 報告目錄與 placeholder），收尾產出標準 handoff zip。
- 驗收：
  - [x] `ArticleCard` 元件與列表頁面可渲染，支持 slug/published_at/summary/cover。
  - [x] DevTools 量測摘要檔存在；截圖可後續補齊。
  - [x] notes 記錄 T-0105，handoff zip 已產生。

### T-0106 close-t0105-ai-reports-and-snapshots：收斂 T-0105 報告與截圖

> 狀態：? 已完成（2025-12-17）

- 目標：
  - 產出 Gemini/Grok debug 報告檔（暫為待填 placeholder，統一命名）。
  - 補齊 T-0105 的 UI 截圖檔位（桌機/平板/手機 placeholder PNG）。
  - 調整列表頁空狀態：DIRECTUS_URL 未設顯示 sample，有設但無資料顯示「尚無資料」。
- 驗收：
  - [x] `docs/QA/DEBUG_V3/REPORTS/T-0105/AI_DEBUG_TEMP_20251216_T-0105_5d73c65_20251217.md` 存在（Gemini/Grok 區塊待外部填寫）。
  - [x] `docs/QA/UI_SNAPSHOTS/T-0105/desktop.png` / `tablet.png` / `mobile.png` 存在。
  - [x] 列表頁依 DIRECTUS_URL 決定 sample/空狀態。
