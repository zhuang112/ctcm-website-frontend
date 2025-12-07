#!/usr/bin/env ts-node

/**
 * 將線上 ctworld 舊站進行 BFS 爬蟲，產生 URL 清單。
 * 對應：docs/crawl-and-inventory.md §2 任務 A
 */

import fs from "node:fs";
import path from "node:path";
import { URL } from "node:url";

interface CrawledUrl {
  url: string;
  status: number;
  contentType?: string | null;
  source?: string;
}

interface CliOptions {
  baseUrl: string;
  outPath: string;
  maxDepth: number;
  delayMs: number;
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

  const baseUrl = args.get("base-url") ?? "https://www.ctworld.org";
  const outPath = args.get("out") ?? "data/crawl/crawled-urls.json";
  const maxDepth = Number(args.get("max-depth") ?? "5");
  const delayMs = Number(args.get("delay-ms") ?? "200");

  return { baseUrl, outPath, maxDepth, delayMs };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    url.hash = ""; // 去掉 fragment
    return url.toString();
  } catch {
    return null;
  }
}

function isHtmlContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  return contentType.includes("text/html");
}

function isSameDomain(target: URL, base: URL): boolean {
  return target.hostname.endsWith("ctworld.org") || target.hostname.endsWith("ctworld.org.tw");
}

function isDownloadLike(url: URL): boolean {
  const ext = path.extname(url.pathname).toLowerCase();
  const skip = [
    ".pdf",
    ".zip",
    ".rar",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
  ];
  return skip.includes(ext);
}

async function crawl(options: CliOptions): Promise<CrawledUrl[]> {
  const { baseUrl, maxDepth, delayMs } = options;
  const startUrls = [baseUrl, new URL("/sitemap.htm", baseUrl).toString()];
  const visited = new Set<string>();
  const queue: Array<{ url: string; depth: number; source: string }> = [];
  const results: CrawledUrl[] = [];

  for (const url of startUrls) {
    const normalized = normalizeUrl(url);
    if (normalized) {
      queue.push({ url: normalized, depth: 0, source: "seed" });
    }
  }

  const base = new URL(baseUrl);

  while (queue.length > 0) {
    const { url, depth, source } = queue.shift()!;
    if (visited.has(url)) continue;
    visited.add(url);

    let status = 0;
    let contentType: string | null = null;

    try {
      const res = await fetch(url, { redirect: "follow" });
      status = res.status;
      contentType = res.headers.get("content-type");

      results.push({ url, status, contentType, source });

      if (status === 200 && depth < maxDepth && isHtmlContentType(contentType)) {
        const html = await res.text();
        const links = extractLinks(html, url, base);
        for (const link of links) {
          if (!visited.has(link)) {
            queue.push({ url: link, depth: depth + 1, source: "link" });
          }
        }
      }
    } catch (err) {
      // 基本錯誤紀錄即可，避免程式直接掛掉
      results.push({ url, status: status || 0, contentType, source: source ?? "error" });
      console.error(`Error fetching ${url}:`, (err as Error).message);
    }

    if (delayMs > 0) {
      await sleep(delayMs);
    }
  }

  return results;
}

function extractLinks(html: string, currentUrl: string, base: URL): string[] {
  const links = new Set<string>();

  // 為了避免額外依賴，這裡暫時用簡單 regex 抓 href，若未來需要更完整可改用 cheerio。
  const hrefRegex = /href\s*=\s*"([^"]+)"/gi;
  let match: RegExpExecArray | null;
  while ((match = hrefRegex.exec(html)) !== null) {
    const rawHref = match[1];
    try {
      const resolved = new URL(rawHref, currentUrl);
      if (!isSameDomain(resolved, base)) continue;
      if (isDownloadLike(resolved)) continue;
      const normalized = normalizeUrl(resolved.toString());
      if (normalized) {
        links.add(normalized);
      }
    } catch {
      // ignore invalid URLs
    }
  }

  return Array.from(links);
}

function ensureDirExists(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function toCsvRows(rows: CrawledUrl[]): string {
  const header = "url,status,contentType,source";
  const body = rows
    .map((row) => {
      const esc = (v: string | number | null | undefined) => {
        if (v === null || v === undefined) return "";
        const s = String(v).replace(/"/g, '""');
        return `"${s}"`;
      };
      return [esc(row.url), esc(row.status), esc(row.contentType), esc(row.source)].join(",");
    })
    .join("\n");
  return `${header}\n${body}\n`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  console.log("[crawl-ctworld] options", options);
  const results = await crawl(options);

  ensureDirExists(options.outPath);
  fs.writeFileSync(options.outPath, JSON.stringify(results, null, 2), "utf-8");

  const csvPath = options.outPath.replace(/\.json$/i, ".csv");
  const csv = toCsvRows(results);
  fs.writeFileSync(csvPath, csv, "utf-8");

  console.log(`Saved ${results.length} URLs to`);
  console.log(`  JSON: ${options.outPath}`);
  console.log(`  CSV : ${csvPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  main();
}
