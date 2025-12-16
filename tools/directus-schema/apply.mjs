#!/usr/bin/env node
/**
 * Apply Directus schema from apps/directus/schema/snapshot.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const snapshotPath = path.resolve(__dirname, "../../apps/directus/schema/snapshot.json");

const { DIRECTUS_URL, DIRECTUS_TOKEN } = process.env;
if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
  console.error("Missing DIRECTUS_URL or DIRECTUS_TOKEN");
  process.exit(1);
}

if (!fs.existsSync(snapshotPath)) {
  console.error(`Snapshot not found at ${snapshotPath}`);
  process.exit(1);
}

const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));

async function main() {
  const diffRes = await fetch(`${DIRECTUS_URL}/schema/diff`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ snapshot }),
  });
  if (!diffRes.ok) {
    const text = await diffRes.text();
    console.error(`Diff failed: ${diffRes.status} ${diffRes.statusText} :: ${text}`);
    process.exit(1);
  }
  const { hash, diff } = await diffRes.json();
  const hasChanges = diff?.collections?.length || diff?.fields?.length || diff?.relations?.length;
  if (!hasChanges) {
    console.log("No schema changes to apply.");
    return;
  }

  const applyRes = await fetch(`${DIRECTUS_URL}/schema/apply`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ hash, diff }),
  });
  if (!applyRes.ok) {
    const text = await applyRes.text();
    console.error(`Apply failed: ${applyRes.status} ${applyRes.statusText} :: ${text}`);
    process.exit(1);
  }
  console.log("Schema apply completed.");
}

main().catch((err) => {
  console.error("[schema apply] error", err.message);
  process.exit(1);
});
