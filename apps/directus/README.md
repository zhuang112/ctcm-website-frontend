# Directus 開發環境（T-0094）

簡易 docker-compose 讓 Directus + Postgres 在本機啟動，用來測試 A3/B1/C2 MVP。

## 快速開始

```bash
cd apps/directus
docker compose up -d

# 首次啟動後，瀏覽器開 http://localhost:8055
# 預設管理員：
#   Email: admin@example.com
#   Password: adminadmin
```

停止並清理：

```bash
docker compose down
# 如需清除資料，加入 -v
docker compose down -v
```

## 組態說明
- Postgres：16-alpine，帳密/DB 皆為 `directus`。
- Directus：11.x；可在 `.env` 覆寫 KEY/SECRET/ADMIN_* 等變數。
- Volume：
  - `db_data`：Postgres 資料
  - `uploads`：Directus 上傳檔案
  - `extensions`：Directus extensions

## 後續
- A3 schema（any_content + any_content_images）建立後，可用 Directus UI 或 API 驗證。
- 搭配 importer（`tools/directus-import/import.mjs`）可將 AnyContent JSON upsert 進 Directus。
- Astro 範例頁（apps/astro）可作為最小前端展示。
