
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
