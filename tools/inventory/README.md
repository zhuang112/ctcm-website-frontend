# Inventory tools (T-0114)

Generate a repo-wide inventory (excludes common build/tmp dirs like `.git`, `node_modules`, `dist`, `.next`, `.astro`, `docs/TEMP`).

```bash
node tools/inventory/filesystem-inventory.mjs --out docs/QA/INVENTORY/T-0114
```

Outputs:

- `FILES_ALL_20251219.json` – list of `{ path, bytes, ext }`
- `STATS_20251219.json` – totals + by-ext + by-top-dir + helper arrays
- `INVENTORY_SUMMARY_20251219.md` – human summary (totals, top 20 extensions, top 20 largest files, excluded paths)

`npm run inventory:fs` is wired to the same command.
