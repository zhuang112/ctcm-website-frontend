# Directus Schema 管理（T-0095）

透過 Directus API 的 snapshot/diff/apply 來管理 collections，避免只能靠 UI 手動調整。

## 環境變數
- `DIRECTUS_URL`：例如 `http://localhost:8055`
- `DIRECTUS_TOKEN`：Directus Admin token（需要可呼叫 /schema/* 權限）

## 使用方式（需 Admin token）
```bash
# 取出目前 Directus schema
npm run directus:schema:snapshot
# 會寫入 apps/directus/schema/snapshot.json

# 套用 snapshot 到另一個 Directus
npm run directus:schema:apply
```

重點：
- apply 會先 diff 再 apply；若沒有差異會印出 `No schema changes to apply.`
- snapshot 檔可以跟著 repo commit，compose 起新的 Directus 後可直接 apply。

API 參考：
- `GET /schema/snapshot`
- `POST /schema/diff`（body: `{ snapshot }`）
- `POST /schema/apply`（body: `{ hash, diff }` 來自 diff 回傳）

curl 範例（diff）：
```bash
curl -X POST "$DIRECTUS_URL/schema/diff" \
  -H "Authorization: Bearer $DIRECTUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @apps/directus/schema/snapshot.json
```
