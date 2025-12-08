#!/usr/bin/env ts-node

/**
 * 使用 crawled-urls.json 與 all-files.json 輸出差異報表。
 * 對應：crawl-and-inventory.md §4 任務 C
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

interface MissingFromCrawlRow extends FileEntry {
  notes: string;
}

interface ExtraFromCrawlRow extends CrawledUrl {
  notes: string;
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

/**
 * 可以在這裡做 URL 正規化（去尾斜線、處理大小寫等）
 * TODO: 若舊站 query string 規則複雜，可在這裡做 normalization。
 */
function normalizeUrl(url: string): string {
  let normalized = url.trim();
  // 移除尾端的斜線（保留根目錄 "/")
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

function toMissingFromCrawlCsv(rows: MissingFromCrawlRow[]): string {
  const header = "url,filePath,notes";
  const esc = (v: string) => '"' + v.replace(/"/g, '""') + '"';

  const body = rows
    .map((row) => [esc(row.url), esc(row.filePath), esc(row.notes)].join(","))
    .join("\n");

  return header + "\n" + body + "\n";
}

function toExtraFromCrawlCsv(rows: ExtraFromCrawlRow[]): string {
  const header = "url,status,contentType,source,notes";
  const esc = (v: string | number | null | undefined) => {
    if (v === null || v === undefined) return '""';
    return '"' + String(v).replace(/"/g, '""') + '"';
  };

  const body = rows
    .map((row) =>
      [esc(row.url), esc(row.status), esc(row.contentType), esc(row.source), esc(row.notes)].join(","),
    )
    .join("\n");

  return header + "\n" + body + "\n";
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const { crawledPath, filesPath, outDir } = options;

  if (!fs.existsSync(crawledPath)) {
    console.error(`crawled file not found: ${crawledPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(filesPath)) {
    console.error(`files inventory not found: ${filesPath}`);
    process.exit(1);
  }

  const crawled: CrawledUrl[] = JSON.parse(fs.readFileSync(crawledPath, "utf-8"));
  const files: FileEntry[] = JSON.parse(fs.readFileSync(filesPath, "utf-8"));

  const crawledMap = new Map<string, CrawledUrl>();
  for (const c of crawled) {
    crawledMap.set(normalizeUrl(c.url), c);
  }

  const fileMap = new Map<string, FileEntry>();
  for (const f of files) {
    fileMap.set(normalizeUrl(f.url), f);
  }

  const missingFromCrawl: MissingFromCrawlRow[] = [];
  const extraFromCrawl: ExtraFromCrawlRow[] = [];

  // 檔案有、爬蟲沒有
  for (const [url, fileEntry] of fileMap.entries()) {
    if (!crawledMap.has(url)) {
      missingFromCrawl.push({ ...fileEntry, notes: "not reached by crawler" });
    }
  }

  // 爬蟲有、檔案沒有
  for (const [url, crawledEntry] of crawledMap.entries()) {
    if (!fileMap.has(url)) {
      extraFromCrawl.push({ ...crawledEntry, notes: "no matching file in docroot" });
    }
  }

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const missingPath = path.join(outDir, "missing-from-crawl.csv");
  const extraPath = path.join(outDir, "extra-from-crawl.csv");

  fs.writeFileSync(missingPath, toMissingFromCrawlCsv(missingFromCrawl), "utf-8");
  fs.writeFileSync(extraPath, toExtraFromCrawlCsv(extraFromCrawl), "utf-8");

  console.log(`Missing from crawl: ${missingFromCrawl.length} urls → ${missingPath}`);
  console.log(`Extra from crawl:   ${extraFromCrawl.length} urls → ${extraPath}`);
}

// 直接執行 main
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
