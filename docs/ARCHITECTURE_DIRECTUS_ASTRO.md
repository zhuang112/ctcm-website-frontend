# ARCHITECTURE_DIRECTUS_ASTRO（T-0095）

目的：用 Directus（A3 schema）、Importer（C2 upsert）、Astro MVP（B1 早期介面）組成可運作的乾淨主線，便於之後擴充。

## A3 schema（Directus collections）
- any_content
  - id (uuid)
  - type (string/enum)
  - lang (enum：zh-TW/zh-CN/en/ja；B1 translations 預留)
  - slug (string)
  - title (string)
  - published_at (datetime)
  - meta (json)
  - body_markdown (text)
  - blocks (json)
  - cover_url (string；暫存，之後可換成 cover_file m2o)
  - images (o2m -> any_content_images)
  - translations（B1 預留，之後開新 T）
- any_content_images
  - id (uuid)
  - parent (m2o -> any_content)
  - file (m2o -> directus_files) 或 url (string)
  - alt (string)
  - caption (text)
  - sort (int)

## C2 importer（tools/directus-import/import.mjs）
- 掃描 `data/**/*.json`，組 payload（external_id/type/lang/slug/title/published_at/meta/body_markdown/images）。
- upsert key：`type::lang::slug`（idempotent）。
- 實作：先查 existing（GET），有則 PATCH，無則 POST；images 採 replace（先清舊再新增）。
- 失敗寫入 `docs/QA/DIRECTUS_IMPORT_FAILS.jsonl`。
- env：`DIRECTUS_URL`、`DIRECTUS_TOKEN`（若未設，只印 payload）。

## Astro MVP（apps/astro）
- fetch layer：`src/lib/directus.ts`（Directus REST filters，失敗 fallback placeholder）。
- 頁面：
  - `src/pages/[lang]/[type]/[slug].astro`：顯示 title/published_at/cover/body_markdown/images。
  - `src/pages/[lang]/[type]/index.astro`：簡易列表（若無資料顯示提示）。
- 後續：可將 pages 改為 SSG 並串接正式 API/GraphQL。

## Directus 本地開發
- docker compose：`apps/directus/docker-compose.yml`
- 說明：`apps/directus/README.md`
- 指令：
  - `npm run directus:up`
  - `npm run directus:down`

## npm scripts
- `directus:up` / `directus:down`：docker compose up/down
- `directus:schema:snapshot` / `directus:schema:apply`
- `import:directus -- --input data/anycontent --limit 20`
- `dev:astro` / `build:astro`

## 後續建議（交給之後的 T）
- 強化 Directus API（auth / upsert / files）。
- translations（B1）UI/欄位補強。
- Astro 改為編譯時抓 Directus，產生 SSG；列表/詳細頁版型再精緻化。
