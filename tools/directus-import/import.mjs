#!/usr/bin/env node
/**
 * Minimal importer stub: read AnyContent JSON and prepare upsert payloads.
 * - For now, it only validates files and logs intended requests.
 * - Future T-0095+ can add real Directus HTTP calls.
 */
import fs from 'fs';
import path from 'path';

function readArgs() {
  const args = process.argv.slice(2);
  const opts = { input: 'data', limit: null };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--input' && args[i + 1]) {
      opts.input = args[i + 1];
      i += 1;
    } else if (arg === '--limit' && args[i + 1]) {
      opts.limit = Number(args[i + 1]);
      i += 1;
    }
  }
  return opts;
}

function listJsonFiles(root) {
  const files = [];
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...listJsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.json')) files.push(full);
  }
  return files;
}

function loadJson(file) {
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw);
}

function main() {
  const { input, limit } = readArgs();
  const files = listJsonFiles(input).slice(0, limit ?? undefined);
  if (!files.length) {
    console.log(`[import] no json files found under ${input}`);
    return;
  }
  console.log(`[import] scanning ${files.length} file(s) under ${input}`);
  for (const file of files) {
    try {
      const data = loadJson(file);
      const payload = {
        external_id: data.id ?? path.basename(file),
        type: data.type ?? data.meta?.type ?? 'unknown',
        lang: data.language ?? 'zh-tw',
        slug: data.slug ?? data.meta?.slug ?? path.basename(file, '.json'),
        title: data.title ?? data.meta?.title ?? '',
        published_at: data.meta?.published_at ?? null,
        meta: data.meta ?? {},
        body_markdown: data.body_markdown ?? '',
        images: data.gallery_items ?? [],
      };
      const upsertKey = `${payload.type}::${payload.lang}::${payload.slug}`;
      console.log(`[import] ready -> ${file} (upsert: ${upsertKey})`);
      console.log(payload);
    } catch (err) {
      fs.appendFileSync(
        path.join('docs', 'QA', 'DIRECTUS_IMPORT_FAILS.jsonl'),
        `${JSON.stringify({ file, error: err.message })}\n`,
        'utf8',
      );
      console.error(`[import] failed ${file}: ${err.message}`);
    }
  }
  console.log('[import] done (stub mode, no HTTP calls yet)');
}

main();
