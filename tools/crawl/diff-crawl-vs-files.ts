#!/usr/bin/env ts-node

/**
 * 使用 crawled-urls.json 與 all-files.json 輸出差異報表。
 * 對應：docs/crawl-and-inventory.md §4 任務 C
 */

import fs from "node:fs";
import path from "node:path";

interface CrawledUrl {
  url: string;
  status: number;
  contentType?: string | null;
  source?: string;
}

interface FileEntry {
  filePath: string;
  url: string;
}

interface CliOptions {
  crawledPath: string;
  filesPath: string;
  outDir: string;
}

function parseArgs(argv: string[]): CliOptions {
  const args = new Map<string, string>();
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = argv[i + 1];
      if (value && !value.startsWith("--")) {
        args.set(key, value);
        i++;
      } else {
        args.set(key, "true");
      }
    }
  }

  const crawledPath = args.get("crawled") ?? "data/crawl/crawled-urls.json";
  const filesPath = args.get("files") ?? "data/crawl/all-files.json";
  const outDir = args.get("out-dir") ?? "data/crawl";

  return { crawledPath, filesPath, outDir };
}

function ensureDirExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function loadJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    // TODO: 若舊站 query string 規則複雜，可在這裡做 normalization
    return u.toString();
  } catch {
    return url;
  }
}

function toMissingFromCrawlCsv(entries: Array<FileEntry & { notes?: string }>): string {
  const header = "url,filePath,notes";
  const body = entries
    .map((row) => {
      const esc = (v: string | number | null | undefined) => {
        if (v === null || v === undefined) return "";
        const s = String(v).replace(/"/g, '""');
        return `"${s}"`;
      };
      return [esc(row.url), esc(row.filePath), esc(row.notes)].join(",");
    })
    .join("\n");
  return `${header}\n${body}\n`;
}

function toExtraFromCrawlCsv(entries: Array<CrawledUrl & { notes?: string }>): string {
  const header = "url,status,source,notes";
  const body = entries
    .map((row) => {
      const esc = (v: string | number | null | undefined) => {
        if (v === null || v === undefined) return "";
        const s = String(v).replace(/"/g, '""');
        return `"${s}"`;
      };
      return [esc(row.url), esc(row.status), esc(row.source), esc(row.notes)].join(",");
    })
    .join("\n");
  return `${header}\n${body}\n`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const { crawledPath, filesPath, outDir } = options;

  if (!fs.existsSync(crawledPath)) {
    console.error(`[diff-crawl-vs-files] crawled json not found: ${crawledPath}`);
    process.exitCode = 1;
    return;
  }
  if (!fs.existsSync(filesPath)) {
    console.error(`[diff-crawl-vs-files] files json not found: ${filesPath}`);
    process.exitCode = 1;
    return;
  }

  console.log("[diff-crawl-vs-files] options", options);

  const crawled = loadJson<CrawledUrl[]>(crawledPath);
  const files = loadJson<FileEntry[]>(filesPath);

  const crawledSet = new Map<string, CrawledUrl>();
  for (const c of crawled) {
    crawledSet.set(normalizeUrl(c.url), c);
  }

  const fileSet = new Map<string, FileEntry>();
  for (const f of files) {
    fileSet.set(normalizeUrl(f.url), f);
  }

  const missingFromCrawl: Array<FileEntry & { notes?: string }> = [];
  const extraFromCrawl: Array<CrawledUrl & { notes?: string }> = [];

  // 檔案有、爬蟲沒有
  for (const [url, fileEntry] of fileSet.entries()) {
    if (!crawledSet.has(url)) {
      missingFromCrawl.push({ ...fileEntry, notes: "not reached by crawler" });
    }
  }

  // 爬蟲有、檔案沒有
  for (const [url, crawledEntry] of crawledSet.entries()) {
    if (!fileSet.has(url)) {
      extraFromCrawl.push({ ...crawledEntry, notes: "no matching file in docroot" });
    }
  }

  ensureDirExists(outDir);

  const missingPath = path.join(outDir, "missing-from-crawl.csv");
  const extraPath = path.join(outDir, "extra-from-crawl.csv");

  fs.writeFileSync(missingPath, toMissingFromCrawlCsv(missingFromCrawl), "utf-8");
  fs.writeFileSync(extraPath, toExtraFromCrawlCsv(extraFromCrawl), "utf-8");

  console.log(`Missing from crawl: ${missingFromCrawl.length} urls → ${missingPath}`);
  console.log(`Extra from crawl:   ${extraFromCrawl.length} urls → ${extraPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
