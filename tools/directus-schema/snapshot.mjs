#!/usr/bin/env node
/**
 * Snapshot Directus schema to apps/directus/schema/snapshot.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.resolve(__dirname, "../../apps/directus/schema/snapshot.json");

const { DIRECTUS_URL, DIRECTUS_TOKEN } = process.env;
if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
  console.error("Missing DIRECTUS_URL or DIRECTUS_TOKEN");
  process.exit(1);
}

async function main() {
  const res = await fetch(`${DIRECTUS_URL}/schema/snapshot`, {
    headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Snapshot failed: ${res.status} ${res.statusText} :: ${text}`);
    process.exit(1);
  }
  const json = await res.json();
  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  await fs.promises.writeFile(outPath, `${JSON.stringify(json, null, 2)}\n`, "utf8");
  console.log(`Schema snapshot written to ${outPath}`);
}

main().catch((err) => {
  console.error("[schema snapshot] error", err.message);
  process.exit(1);
});
