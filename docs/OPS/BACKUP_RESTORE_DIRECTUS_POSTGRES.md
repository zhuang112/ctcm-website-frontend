# Backup/Restore Runbook - Directus/Postgres（T-0103）

## 備份
- DB：`pg_dump`（staging/prod 都必須）
  ```bash
  pg_dump -h <host> -U <user> -d directus -F c -f directus_$(date +%Y%m%d).dump
  ```
- Files：備份 uploads volume（或 S3 bucket），記錄備份路徑與校驗（sha256）。

## 還原
- DB：`pg_restore` 或 `psql` 匯入
  ```bash
  pg_restore -h <host> -U <user> -d directus -c directus_YYYYMMDD.dump
  ```
- Files：還原 uploads，確保權限/路徑正確。
- 驗證：
  - 以 Directus UI 登入（admin/readonly 角色各一次）。
  - Astro 前端讀 1 筆，Importer 寫 1 筆（測試 type+lang+slug 唯一約束）。

## 常見問題
- 權限不足：確認角色 token/DB 使用者權限。
- 約束衝突：若舊資料違反唯一鍵，需先清理再還原。
