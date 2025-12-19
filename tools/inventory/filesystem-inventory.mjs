#!/usr/bin/env node
/**
 * Filesystem inventory walker (T-0114).
 * Walks repo root, excludes common build/tmp dirs, and writes:
 * - FILES_ALL_20251219.json
 * - STATS_20251219.json
 * - INVENTORY_SUMMARY_20251219.md
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

const args = process.argv.slice(2);
const outFlag = args.indexOf('--out');
if (outFlag === -1 || !args[outFlag + 1]) {
  console.error('Usage: node tools/inventory/filesystem-inventory.mjs --out <outputDir>');
  process.exit(1);
}
const outDir = path.resolve(args[outFlag + 1]);

const excludeDirs = new Set([
  '.git',
  'node_modules',
  'dist',
  '.next',
  '.astro',
  'docs/TEMP',
  'docs/.temp_staging',
  'handoff',
  '.idea',
  '.vscode',
  '.DS_Store',
]);

function isExcluded(relPath, isDir) {
  for (const dir of excludeDirs) {
    const norm = dir.replace(/\\/g, '/');
    if (relPath === norm) return true;
    if (relPath.startsWith(norm + '/')) return true;
  }
  return false;
}

async function walk(current, base) {
  const entries = await fs.promises.readdir(current, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const full = path.join(current, entry.name);
    const rel = path.relative(base, full).replace(/\\/g, '/');
    if (isExcluded(rel, entry.isDirectory())) continue;
    if (entry.isDirectory()) {
      results.push(...(await walk(full, base)));
    } else if (entry.isFile()) {
      const stat = await fs.promises.stat(full);
      const ext = path.extname(entry.name).replace(/^\./, '') || '(none)';
      results.push({ path: rel, bytes: stat.size, ext });
    }
  }
  return results;
}

function summarize(files) {
  const total_files = files.length;
  const total_bytes = files.reduce((sum, f) => sum + f.bytes, 0);
  const by_ext = {};
  for (const f of files) {
    if (!by_ext[f.ext]) by_ext[f.ext] = { count: 0, bytes: 0 };
    by_ext[f.ext].count += 1;
    by_ext[f.ext].bytes += f.bytes;
  }
  const by_top_dir = {};
  for (const f of files) {
    const top = f.path.split('/')[0];
    by_top_dir[top] = (by_top_dir[top] || 0) + 1;
  }
  const top_ext = Object.entries(by_ext)
    .map(([ext, v]) => ({ ext, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  const largest = [...files].sort((a, b) => b.bytes - a.bytes).slice(0, 20);
  return { total_files, total_bytes, by_ext, by_top_dir, top_ext, largest };
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

function writeSummaryMd(p, stats, excluded) {
  const lines = [];
  lines.push('# Inventory Summary (T-0114)');
  lines.push('');
  lines.push(`- Total files: ${stats.total_files}`);
  lines.push(`- Total bytes: ${stats.total_bytes}`);
  lines.push('');
  lines.push('## Top 20 extensions (by count)');
  lines.push('');
  lines.push('| # | ext | count | bytes |');
  lines.push('|---|-----|-------|-------|');
  stats.top_ext.forEach((item, i) => {
    lines.push(`| ${i + 1} | ${item.ext} | ${item.count} | ${item.bytes} |`);
  });
  lines.push('');
  lines.push('## Top 20 largest files');
  lines.push('');
  lines.push('| # | path | bytes |');
  lines.push('|---|------|-------|');
  stats.largest.forEach((item, i) => {
    lines.push(`| ${i + 1} | ${item.path} | ${item.bytes} |`);
  });
  lines.push('');
  lines.push('## Excluded paths');
  lines.push('');
  excluded.forEach((d) => lines.push(`- ${d}`));
  fs.writeFileSync(p, lines.join('\n'), 'utf8');
}

async function main() {
  ensureDir(outDir);
  const files = await walk(repoRoot, repoRoot);
  const stats = summarize(files);
  const filesJson = path.join(outDir, 'FILES_ALL_20251219.json');
  const statsJson = path.join(outDir, 'STATS_20251219.json');
  const summaryMd = path.join(outDir, 'INVENTORY_SUMMARY_20251219.md');
  writeJson(filesJson, files);
  writeJson(statsJson, stats);
  writeSummaryMd(summaryMd, stats, Array.from(excludeDirs));
  console.log('Inventory complete');
  console.log(`  total_files: ${stats.total_files}`);
  console.log(`  total_bytes: ${stats.total_bytes}`);
  console.log(`  outputs: ${filesJson}, ${statsJson}, ${summaryMd}`);
  if (stats.total_files <= 188) {
    console.warn('WARNING: total_files <= 188 (inventory may be incomplete).');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
