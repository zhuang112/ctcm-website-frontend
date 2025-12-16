# Directus Importer（stub，T-0094）

目的：將 AnyContent JSON upsert 進 Directus。現階段僅做檔案掃描與 payload 準備（idempotent upsert key：type+lang+slug），未發 HTTP，後續 T-0095+ 再接 Directus API。

## 使用

```bash
npm run import:directus -- --input data/anycontent --limit 20
```

- `--input`：JSON 根目錄，預設 `data`。
- `--limit`：可選，限制檔案數。

目前行為：
- 掃描 JSON，組成 payload（external_id/type/lang/slug/title/published_at/meta/body_markdown/images）。
- 列出 upsert key：`type::lang::slug`，重跑不會重複新增（之後 API upsert 可用）。
- 失敗寫入 `docs/QA/DIRECTUS_IMPORT_FAILS.jsonl`（append）。
- 僅列印 payload，不會寫入 Directus。

## 後續
- 串 Directus REST/GraphQL，支援 upsert（by external_id 或 type+lang+slug）。
- 把 files/gallery 改寫成 directus_files 關聯。
- 增加 dry-run / commit 切換。
