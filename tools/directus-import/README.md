# Directus Importer（T-0095）

用途：把 AnyContent JSON upsert 進 Directus，upsert key = `type::lang::slug`，支援圖片 replace。失敗會記錄 jsonl。

## 使用
```bash
DIRECTUS_URL=http://localhost:8055 \
DIRECTUS_TOKEN=<admin_or_items_token> \
npm run import:directus -- --input data/anycontent --limit 20
```
- `--input`：JSON 根目錄，預設 `data`
- `--limit`：可選，限制筆數

## 行為
- 逐檔讀取 JSON，組 payload：external_id/type/lang/slug/title/published_at/meta/body_markdown/images
- 先查 `any_content` 是否已有同一 `type+lang+slug`
  - 有：PATCH 更新
  - 無：POST 新增
- 圖片：先刪除舊 `any_content_images`，再逐筆新增（保持 idempotent）
- 失敗寫入 `docs/QA/DIRECTUS_IMPORT_FAILS.jsonl`
- 若沒有設定 `DIRECTUS_URL`，僅列印 payload（stub mode）

未來可擴充：files 上傳、dry-run/commit 模式等。
