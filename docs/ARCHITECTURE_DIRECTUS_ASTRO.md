# ARCHITECTURE_DIRECTUS_ASTRO（T-0094 A3+B1+C2）

目標：提供 Directus（A3 schema）、Importer（C2 upsert stub）、Astro 最小頁面（B1 後續擴充）三件套 MVP。

## A3 schema（Directus collections）
- any_content
  - id (uuid)
  - type (string/enum)
  - slug (string)
  - title (string)
  - published_at (datetime)
  - meta (json)
  - body_markdown (text)
  - blocks (json) — 預留
  - cover_file (m2o -> directus_files)；暫時可用 meta.cover_url
  - images (o2m -> any_content_images)
  - translations（B1 預留，不強制 UI，下一顆 T 處理）
- any_content_images
  - id (uuid)
  - parent (m2o -> any_content)
  - file (m2o -> directus_files) 或 url (string)
  - alt (string)
  - caption (text)
  - sort (int)

## C2 importer（tools/directus-import/import.mjs）
- 掃描 `data/**/*.json`，組 payload（external_id/type/lang/slug/title/published_at/meta/body_markdown/images）。
- 目前僅列印 payload，未發 HTTP；失敗寫入 `docs/QA/DIRECTUS_IMPORT_FAILS.jsonl`。
- 後續 T-0095+ 目標：upsert Directus（by external_id 或 type+lang+slug）、支援 files/gallery 關聯、dry-run/commit。

## Astro MVP（apps/astro）
- fetch layer：`src/lib/directus.ts`（placeholder，未接後端）。
- 頁面：
  - `src/pages/[lang]/[type]/[slug].astro`：顯示 title/published_at/cover/body_markdown/images。
  - `src/pages/[lang]/[type]/index.astro`：簡易列表頁 placeholder。
- 後續可接 Directus REST/GraphQL，再強化 SSG。

## Directus 開發環境
- docker compose：`apps/directus/docker-compose.yml`
- 說明：`apps/directus/README.md`
- 啟停：
  - `npm run directus:up`
  - `npm run directus:down`

## npm scripts
- `directus:up` / `directus:down`：docker compose up/down。
- `import:directus -- --input data/anycontent --limit 20`：掃描 JSON 並列印 payload（stub）。

## 後續建議（交給下一顆 T）
- 真正接 Directus API（auth、upsert、files）。
- A3 translations（B1）UI/欄位補齊。
- Astro 改為讀取 Directus，產生 SSG；增加列表排序/分頁。
