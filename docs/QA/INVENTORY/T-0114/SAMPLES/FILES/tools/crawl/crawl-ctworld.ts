#!/usr/bin/env ts-node

/**
 * 輕量版 ctworld 爬蟲，用來產生 URL 清單並記錄 fetch/decode 失敗。
 *
 * 使用示例：
 *   ts-node tools/crawl/crawl-ctworld.ts \
 *     --base-url https://www.ctworld.org \
 *     --out data/crawl/crawled-urls.json \
 *     --max-depth 3 \
 *     --max-urls 500 \
 *     --delay-ms 800 \
 *     --jitter-ms 700 \
 *     --max-retries 5
 */

import fs from "node:fs";
import path from "node:path";
import { URL } from "node:url";
import { execSync } from "node:child_process";
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
  last_status?: number;
  retry_count?: number;
}

interface CliOptions {
  baseUrl: string;
  outPath: string;
  maxDepth: number;
  delayMs: number;
  jitterMs: number;
  maxUrls: number;
  maxRetries: number;
  backoffBaseMs: number;
  backoffCapMs: number;
  userAgent: string;
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
  const delayMs = Number(args.get("delay-ms") ?? "800");
  const jitterMs = Number(args.get("jitter-ms") ?? "700");
  const maxUrls = Number(args.get("max-urls") ?? "0"); // 0 表示不設上限
  const maxRetries = Number(args.get("max-retries") ?? "5");
  const backoffBaseMs = Number(args.get("backoff-base-ms") ?? "1000");
  const backoffCapMs = Number(args.get("backoff-cap-ms") ?? "30000");
  const userAgent =
    args.get("user-agent") ??
    process.env.CTWORLD_CRAWLER_UA ??
    "ctworld-crawler/1.0 (+https://www.ctworld.org)";

  return {
    baseUrl,
    outPath,
    maxDepth,
    delayMs,
    jitterMs,
    maxUrls,
    maxRetries,
    backoffBaseMs,
    backoffCapMs,
    userAgent,
  };
}

function ensureDirExists(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getHeadShort(): string {
  try {
    const head = execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    return head || "unknown";
  } catch {
    return "unknown";
  }
}

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

function backoffDelayMs(base: number, cap: number, jitter: number, attempt: number): number {
  const exp = base * Math.pow(2, attempt - 1);
  const withJitter = exp + Math.floor(Math.random() * (jitter > 0 ? jitter : 1));
  return Math.min(withJitter, cap);
}

async function fetchPage(
  url: string,
  opts: {
    userAgent: string;
    referer: string;
    maxRetries: number;
    backoffBaseMs: number;
    backoffCapMs: number;
    jitterMs: number;
  },
): Promise<{ status: number; contentType: string | null; body: string | null; qa?: QaEntry }> {
  let lastError: string | null = null;
  let lastStatus: number | undefined;
  let attempts = 0;

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    attempts = attempt;
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": opts.userAgent,
          Referer: opts.referer,
        },
      });
      lastStatus = res.status;
      const contentType = res.headers.get("content-type");
      const isHtml = contentType ? contentType.includes("text/html") : false;

      if (lastStatus >= 500 || lastStatus === 429 || lastStatus === 403) {
        lastError = `http_${lastStatus}`;
      } else if (!isHtml) {
        return { status: lastStatus, contentType, body: null };
      } else {
        const buffer = Buffer.from(await res.arrayBuffer());
        const headerCharset = contentType?.match(/charset=([\w-]+)/i)?.[1]?.toLowerCase() ?? null;
        const guesses = [headerCharset, "utf-8", "big5", "big5-hkscs", "windows-1252"].filter(Boolean) as string[];
        for (const enc of guesses) {
          try {
            if (!iconv.encodingExists(enc)) continue;
            const decoded = iconv.decode(buffer, enc);
            return { status: lastStatus, contentType, body: decoded };
          } catch (err: any) {
            lastError = err?.message ?? String(err);
          }
        }
        lastError = lastError ?? "decode failed";
        // 將後續 retry 歸類為 decode 問題
        if (attempt < opts.maxRetries) {
          const waitMs = backoffDelayMs(opts.backoffBaseMs, opts.backoffCapMs, opts.jitterMs, attempt);
          await delay(waitMs);
          continue;
        }
        return {
          status: lastStatus,
          contentType,
          body: null,
          qa: {
            url,
            stage: "decode",
            encoding: headerCharset ?? null,
            error: lastError,
            first_seen_at: new Date().toISOString(),
            last_status: lastStatus,
            retry_count: attempts,
          },
        };
      }
    } catch (err: any) {
      lastError = err instanceof Error ? err.message : String(err);
    }

    if (attempt < opts.maxRetries) {
      const waitMs = backoffDelayMs(opts.backoffBaseMs, opts.backoffCapMs, opts.jitterMs, attempt);
      await delay(waitMs);
    }
  }

  return {
    status: lastStatus ?? 0,
    contentType: null,
    body: null,
    qa: {
      url,
      stage: "fetch",
      encoding: null,
      error: lastError ?? "unknown error",
      first_seen_at: new Date().toISOString(),
      last_status: lastStatus,
      retry_count: attempts,
    },
  };
}

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

async function crawl(options: CliOptions): Promise<{ results: CrawledUrl[]; qa: QaEntry[] }> {
  const { baseUrl, maxDepth, delayMs, jitterMs, maxUrls } = options;

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

    if (maxUrls > 0 && results.length >= maxUrls) {
      console.log(`[crawl] Reached maxUrls = ${maxUrls}, stopping.`);
      break;
    }

    console.log(`[crawl] (${depth}) ${url}`);

    const { status, contentType, body, qa: qaEntry } = await fetchPage(url, {
      userAgent: options.userAgent,
      referer: baseUrl,
      maxRetries: options.maxRetries,
      backoffBaseMs: options.backoffBaseMs,
      backoffCapMs: options.backoffCapMs,
      jitterMs: options.jitterMs,
    });
    results.push({ url, status, contentType, source });
    if (qaEntry) {
      qa.push(qaEntry);
    }

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
      const jitter = Math.floor(Math.random() * (jitterMs > 0 ? jitterMs : 1));
      await delay(delayMs + jitter);
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
    const nowIso = new Date().toISOString();
    const jsonlPath = path.join("docs", "QA", "CRAWL_FAILS.jsonl");
    ensureDirExists(jsonlPath);
    const headShort = getHeadShort();
    const taskId = process.env.CRAWL_TASK_ID ?? "T-0091";
    const needsNewline = fs.existsSync(jsonlPath) && fs.statSync(jsonlPath).size > 0;
    const jsonl = qa
      .map((q) =>
        JSON.stringify({
          url: q.url,
          stage: q.stage,
          encoding: q.encoding ?? null,
          error: q.error,
          first_seen_at: q.first_seen_at,
          last_seen_at: nowIso,
          last_status: q.last_status ?? null,
          retry_count: q.retry_count ?? options.maxRetries,
          task_id: taskId,
          source_commit: headShort,
        }),
      )
      .join("\n");
    fs.appendFileSync(jsonlPath, (needsNewline ? "\n" : "") + jsonl, "utf-8");

    const qaPath = path.join("docs", "QA", "CRAWL_FAILS.md");
    ensureDirExists(qaPath);
    const lines = [
      "# CRAWL_FAILS",
      "",
      `> 紀錄 fetch/decode 失敗的 URL（本 run: ${nowIso}，history: docs/QA/CRAWL_FAILS.jsonl，task_id=${taskId}，source_commit=${headShort}）`,
      "",
      "| url | stage | encoding | error | first_seen_at | last_status | retries |",
      "| --- | --- | --- | --- | --- | --- | --- |",
      ...qa.map(
        (q) =>
          `| ${q.url} | ${q.stage} | ${q.encoding ?? ""} | ${q.error.replace(/\|/g, "\\|")} | ${q.first_seen_at} | ${q.last_status ?? ""} | ${q.retry_count ?? options.maxRetries} |`,
      ),
      "",
    ];
    fs.writeFileSync(qaPath, lines.join("\n"), "utf-8");
    console.log(`QA fails recorded: ${qa.length} -> ${qaPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
