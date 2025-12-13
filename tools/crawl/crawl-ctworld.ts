#!/usr/bin/env ts-node

/**
 * 線上 ctworld 網站爬蟲，產生 URL 清單。
 * 對應：docs/crawl-and-inventory.md §2 任務 A
 *
 * 使用方式（示例）：
 *   ts-node tools/crawl/crawl-ctworld.ts \\
 *     --base-url https://www.ctworld.org \\
 *     --out data/crawl/crawled-urls.json \\
 *     --max-depth 3 \\
 *     --max-urls 500 \\
 *     --delay-ms 200
 */

import fs from "node:fs";
import path from "node:path";
import { URL } from "node:url";
import * as cheerio from "cheerio";
import iconv from "iconv-lite";

interface CrawledUrl {
  url: string;
  status: number;
  contentType?: string | null;
  source?: string;
}

interface CrawlTask {
  url: string;
  depth: number;
  source: string;
}

interface QaEntry {
  url: string;
  stage: "fetch" | "decode";
  encoding?: string | null;
  error: string;
  first_seen_at: string;
}

interface CliOptions {
  baseUrl: string;
  outPath: string;
  maxDepth: number;
  delayMs: number;
  maxUrls: number;
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
  const maxUrls = Number(args.get("max-urls") ?? "0"); // 0 代表不限

  return { baseUrl, outPath, maxDepth, delayMs, maxUrls };
}

function ensureDirExists(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 只允許 ctworld.org / ctworld.org.tw 網域
 */
function isSameDomain(targetUrl: string): boolean {
  try {
    const u = new URL(targetUrl);
    const host = u.hostname.toLowerCase();
    return (
      host === "ctworld.org" ||
      host === "www.ctworld.org" ||
      host === "ctworld.org.tw" ||
      host === "www.ctworld.org.tw"
    );
  } catch {
    return false;
  }
}

/**
 * 將相對網址轉成絕對網址，基準為 baseUrl
 */
function toAbsoluteUrl(href: string, baseUrl: string): string | null {
  if (!href) return null;
  href = href.trim();
  if (!href || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return null;
  }
  try {
    const url = new URL(href, baseUrl);
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * 從 HTML 中抓出所有 <a href> 連結，轉成絕對網址
 */
function getLinksFromHtml(html: string, pageUrl: string): string[] {
  const $ = cheerio.load(html);
  const links = new Set<string>();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    const abs = toAbsoluteUrl(href ?? "", pageUrl);
    if (abs) {
      links.add(abs);
    }
  });

  return Array.from(links);
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(
  url: string,
): Promise<{ status: number; contentType: string | null; body: string | null; qa?: QaEntry }> {
  try {
    const res = await fetch(url);
    const status = res.status;
    const contentType = res.headers.get("content-type");
    const isHtml = contentType ? contentType.includes("text/html") : false;
    if (!isHtml) {
      return { status, contentType, body: null };
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const headerCharset = contentType?.match(/charset=([\w-]+)/i)?.[1]?.toLowerCase() ?? null;
    const guesses = [headerCharset, "utf-8", "big5", "big5-hkscs", "windows-1252"].filter(
      Boolean,
    ) as string[];
    let lastError: string | null = null;
    for (const enc of guesses) {
      try {
        if (!iconv.encodingExists(enc)) continue;
        const decoded = iconv.decode(buffer, enc);
        return { status, contentType, body: decoded };
      } catch (err: any) {
        lastError = err?.message ?? String(err);
      }
    }

    return {
      status,
      contentType,
      body: null,
      qa: {
        url,
        stage: "decode",
        encoding: headerCharset,
        error: lastError ?? "decode failed",
        first_seen_at: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error(`Fetch error for ${url}:`, err);
    return {
      status: 0,
      contentType: null,
      body: null,
      qa: {
        url,
        stage: "fetch",
        encoding: null,
        error: err instanceof Error ? err.message : String(err),
        first_seen_at: new Date().toISOString(),
      },
    };
  }
}

/**
 * 將 CrawledUrl 陣列轉成 CSV 字串
 */
function toCsv(crawled: CrawledUrl[]): string {
  const header = "url,status,contentType,source";
  const esc = (v: string | number | null | undefined) => {
    if (v === null || v === undefined) return '""';
    return '"' + String(v).replace(/"/g, '""') + '"';
  };

  const rows = crawled.map((c) =>
    [esc(c.url), esc(c.status), esc(c.contentType ?? ""), esc(c.source ?? "")].join(","),
  );

  return header + "\n" + rows.join("\n") + "\n";
}

/**
 * BFS 爬蟲主流程
 */
async function crawl(options: CliOptions): Promise<{ results: CrawledUrl[]; qa: QaEntry[] }> {
  const { baseUrl, maxDepth, delayMs, maxUrls } = options;

  const visited = new Set<string>();
  const queue: CrawlTask[] = [
    { url: baseUrl, depth: 0, source: "seed" },
    { url: new URL("/sitemap.htm", baseUrl).toString(), depth: 0, source: "sitemap-seed" },
  ];

  const results: CrawledUrl[] = [];
  const qa: QaEntry[] = [];

  while (queue.length > 0) {
    const task = queue.shift()!;
    const { url, depth, source } = task;

    if (visited.has(url)) continue;
    visited.add(url);

    if (!isSameDomain(url)) continue;
    if (depth > maxDepth) continue;

    // 若有設定 maxUrls，且已達上限，就停止爬蟲
    if (maxUrls > 0 && results.length >= maxUrls) {
      console.log(`[crawl] Reached maxUrls = ${maxUrls}, stopping.`);
      break;
    }

    console.log(`[crawl] (${depth}) ${url}`);

    const { status, contentType, body, qa: qaEntry } = await fetchPage(url);
    results.push({ url, status, contentType, source });
    if (qaEntry) {
      qa.push(qaEntry);
    }

    // 只在 HTML 頁面上繼續往下抓
    const isHtml = contentType ? contentType.includes("text/html") : false;
    if (status === 200 && isHtml && body) {
      const links = getLinksFromHtml(body, url);
      for (const link of links) {
        if (!visited.has(link) && isSameDomain(link)) {
          queue.push({ url: link, depth: depth + 1, source: "link" });
        }
      }
    }

    if (delayMs > 0) {
      await delay(delayMs);
    }
  }

  return { results, qa };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  const { results: crawled, qa } = await crawl(options);

  ensureDirExists(options.outPath);
  fs.writeFileSync(options.outPath, JSON.stringify(crawled, null, 2), "utf-8");

  const csvPath = options.outPath.replace(/\.json$/i, ".csv");
  fs.writeFileSync(csvPath, toCsv(crawled), "utf-8");

  console.log(`Crawled ${crawled.length} URLs.`);
  console.log(`JSON: ${options.outPath}`);
  console.log(`CSV : ${csvPath}`);

  if (qa.length > 0) {
    const qaPath = path.join("docs", "QA", "CRAWL_FAILS.md");
    ensureDirExists(qaPath);
    const lines = [
      "# CRAWL_FAILS",
      "",
      `> 自動記錄 fetch/decode 失敗的 URL（最新 run: ${new Date().toISOString()}）`,
      "",
      "| url | stage | encoding | error | first_seen_at |",
      "| --- | --- | --- | --- | --- |",
      ...qa.map(
        (q) =>
          `| ${q.url} | ${q.stage} | ${q.encoding ?? ""} | ${q.error.replace(/\|/g, "\\|")} | ${q.first_seen_at} |`,
      ),
      "",
    ];
    fs.writeFileSync(qaPath, lines.join("\n"), "utf-8");
    console.log(`QA fails recorded: ${qa.length} -> ${qaPath}`);
  }
}

// 直接執行 main（在 ts-node 環境中）
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
