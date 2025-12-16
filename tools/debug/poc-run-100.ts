#!/usr/bin/env ts-node
/**
 * POC runner for up to 100 URLs from docs/QA/DEBUG_V3/URL_QUEUE.md.
 * - Reads the table, extracts URLs.
 * - Writes a summary to tmp/poc/results.json.
 * - Emits checklist and bug report into docs/QA/DEBUG_V3/REPORTS/.
 * Note: This POC does NOT fetch external URLs (pending approved list); it records a blocked status when queue is empty.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const repoRoot = process.cwd();
const queuePath = path.join(repoRoot, 'docs', 'QA', 'DEBUG_V3', 'URL_QUEUE.md');
const reportsDir = path.join(repoRoot, 'docs', 'QA', 'DEBUG_V3', 'REPORTS');
const tmpDir = path.join(repoRoot, 'tmp', 'poc');
const resultsPath = path.join(tmpDir, 'results.json');

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

type QueueEntry = { unit: string; url: string; status: string; notes: string };

function parseQueue(): QueueEntry[] {
  if (!fs.existsSync(queuePath)) return [];
  const lines = fs.readFileSync(queuePath, 'utf8').split(/\r?\n/);
  const rows = lines.filter((l) => l.trim().startsWith('|'));
  if (rows.length <= 2) return []; // header + separator only
  const entries: QueueEntry[] = [];
  for (const row of rows.slice(2)) {
    const cols = row.split('|').map((c) => c.trim());
    if (cols.length < 5) continue;
    const unit = cols[1];
    const url = cols[2];
    const status = cols[3];
    const notes = cols[4];
    if (!url) continue;
    entries.push({ unit, url, status, notes });
  }
  return entries;
}

type Result = {
  unit: string;
  url: string;
  status: 'blocked';
  reason: string;
};

function buildSummary(entries: QueueEntry[]): { results: Result[]; stats: Record<string, number> } {
  const results: Result[] = [];
  const stats: Record<string, number> = { total: 0, blocked: 0 };
  if (entries.length === 0) {
    results.push({
      unit: 'n/a',
      url: '',
      status: 'blocked',
      reason: 'URL_QUEUE is empty; awaiting approved URLs',
    });
    stats.total = 0;
    stats.blocked = 1;
    return { results, stats };
  }

  for (const entry of entries.slice(0, 100)) {
    stats.total += 1;
    results.push({
      unit: entry.unit || 'unknown',
      url: entry.url,
      status: 'blocked',
      reason: 'Runner does not fetch external URLs without approved list',
    });
    stats.blocked += 1;
  }
  return { results, stats };
}

function writeJson(results: Result[], stats: Record<string, number>) {
  ensureDir(tmpDir);
  fs.writeFileSync(resultsPath, JSON.stringify({ results, stats }, null, 2));
}

function writeReport(results: Result[], stats: Record<string, number>) {
  ensureDir(reportsDir);
  const date = new Date().toISOString().slice(0, 10);
  const commit = execSync('git rev-parse --short HEAD').toString().trim();
  const reportPath = path.join(reportsDir, `POC_100_${date}_${commit}.md`);
  const lines = [
    `# POC 100 Debug Report`,
    ``,
    `- date: ${date}`,
    `- commit: ${commit}`,
    `- total_urls: ${stats.total}`,
    `- blocked: ${stats.blocked}`,
    `- note: 未提供實際 URL，暫以 blocked 狀態記錄，待提供 URL 後再執行抓取與轉換。`,
    ``,
    `## Results (sample up to 20)`,
  ];
  results.slice(0, 20).forEach((r, idx) => {
    lines.push(`- [${idx + 1}] unit=${r.unit} url=${r.url || '(empty)'} status=${r.status} reason=${r.reason}`);
  });
  fs.writeFileSync(reportPath, lines.join('\n'), 'utf8');
}

function writeChecklist(results: Result[]) {
  ensureDir(reportsDir);
  const date = new Date().toISOString().slice(0, 10);
  const commit = execSync('git rev-parse --short HEAD').toString().trim();
  const checklistPath = path.join(reportsDir, `CHECKLIST_${date}_POC100.md`);
  const lines = [
    `# Checklist POC100`,
    ``,
    `- date: ${date}`,
    `- commit: ${commit}`,
    `- sampled: ${results.length > 0 ? Math.min(results.length, 10) : 0}`,
    ``,
    `| url | status | notes |`,
    `|-----|--------|-------|`,
  ];
  const sample = results.slice(0, 10);
  if (sample.length === 0) {
    lines.push(`| (none) | blocked | waiting for URL list |`);
  } else {
    sample.forEach((r) => {
      lines.push(`| ${r.url || '(empty)'} | ${r.status} | ${r.reason} |`);
    });
  }
  fs.writeFileSync(checklistPath, lines.join('\n'), 'utf8');
}

function main() {
  const entries = parseQueue();
  const { results, stats } = buildSummary(entries);
  writeJson(results, stats);
  writeReport(results, stats);
  writeChecklist(results);
  console.log('POC runner finished. Stats:', stats);
  console.log(`results: ${resultsPath}`);
}

main();

