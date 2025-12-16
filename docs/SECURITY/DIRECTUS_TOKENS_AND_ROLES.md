# Directus Tokens & Roles（T-0103）

## Token / Role 分工
- `astro_readonly`: 只讀 any_content / any_content_images，禁止 create/update/delete。Astro 前端讀取用，應配置於 `DIRECTUS_TOKEN_READONLY`。
- `importer_write`: 可對 any_content / any_content_images create/update/delete，禁止 schema 操作；Importer 用，配置於 `DIRECTUS_TOKEN_IMPORTER`。
- Admin token 只用在 schema 管理或緊急維護，不應給前端/Importer。

## 環境變數建議
- Astro：`DIRECTUS_URL`、`DIRECTUS_TOKEN_READONLY`
- Importer：`DIRECTUS_URL`、`DIRECTUS_TOKEN_IMPORTER`

## 保管與更新
- Token 請在 Directus 後台建立對應 role，再產生 static token。
- 不要將 token 寫入 repo；僅留變數名稱於 .env.example / README。
- 更新 token 時需同步 notes，並可於本檔紀錄日期與負責人（不寫入實際值）。
