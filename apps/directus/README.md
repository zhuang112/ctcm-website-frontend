# Directus é–‹ç™¼ç’°å¢ƒï¼ˆT-0094ï¼‰

ç°¡æ˜“ docker-compose è®“ Directus + Postgres åœ¨æœ¬æ©Ÿå•Ÿå‹•ï¼Œç”¨ä¾†æ¸¬è©¦ A3/B1/C2 MVPã€‚

## å¿«é€Ÿé–‹å§‹

```bash
cd apps/directus
docker compose up -d

# é¦–æ¬¡å•Ÿå‹•å¾Œï¼Œç€è¦½å™¨é–‹ http://localhost:8055
# é è¨­ç®¡ç†å“¡ï¼š
#   Email: admin@example.com
#   Password: adminadmin
```

åœæ­¢ä¸¦æ¸…ç†ï¼š

```bash
docker compose down
# å¦‚éœ€æ¸…é™¤è³‡æ–™ï¼ŒåŠ å…¥ -v
docker compose down -v
```

## çµ„æ…‹èªªæ˜
- Postgresï¼š16-alpineï¼Œå¸³å¯†/DB çš†ç‚º `directus`ã€‚
- Directusï¼š11.xï¼›å¯åœ¨ `.env` è¦†å¯« KEY/SECRET/ADMIN_* ç­‰è®Šæ•¸ã€‚
- Volumeï¼š
  - `db_data`ï¼šPostgres è³‡æ–™
  - `uploads`ï¼šDirectus ä¸Šå‚³æª”æ¡ˆ
  - `extensions`ï¼šDirectus extensions

## å¾ŒçºŒ
- A3 schemaï¼ˆany_content + any_content_imagesï¼‰å»ºç«‹å¾Œï¼Œå¯ç”¨ Directus UI æˆ– API é©—è­‰ã€‚
- æ­é… importerï¼ˆ`tools/directus-import/import.mjs`ï¼‰å¯å°‡ AnyContent JSON upsert é€² Directusã€‚
- Astro ç¯„ä¾‹é ï¼ˆapps/astroï¼‰å¯ä½œç‚ºæœ€å°å‰ç«¯å±•ç¤ºã€‚
## Migrations¡]T-0103¡^
- SQL ÀÉ©ñ¦b `apps/directus/db/migrations/`¡A¨Ò¦p `001_any_content_constraints_and_indexes.sql`¡]type+lang+slug °ß¤@¡A±`¥Î¯Á¤Ş¡^¡C
- °õ¦æ¤è¦¡¡]»İ¤w±Ò°Ê compose¡^¡G
```bash
cd apps/directus
# ¶i DB container ¦A®M¥Î
docker compose exec db psql -U directus -d directus -f /workspace/apps/directus/db/migrations/001_any_content_constraints_and_indexes.sql
```
- ¥i¨Ì»İ­n·s¼W npm script¡]©|¥¼¤º«Ø¡^¡F¥Ø«e¤â°Ê°õ¦æ§Y¥i¡C

## Tokens / Roles
- «ØÄ³¦b Directus «Ø¥ß¨â­Ó token¡G
  - `astro_readonly`¡G¥uÅª any_content / any_content_images¡Aµ¹ Astro¡FÀô¹ÒÅÜ¼Æ `DIRECTUS_TOKEN_READONLY`¡C
  - `importer_write`¡G¥i¼g any_content / any_content_images¡A¤£¥i°Ê schema¡Fµ¹ importer¡FÀô¹ÒÅÜ¼Æ `DIRECTUS_TOKEN_IMPORTER`¡C
- Admin token ¶È­­ schema ºŞ²z©Îºò«æºûÅ@¡C
