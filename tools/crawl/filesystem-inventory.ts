#!/usr/bin/env ts-node

/**
 * 檔案系統 inventory：列出舊站 docroot 下所有 HTML 檔，並推算對應 URL。
 * 對應：crawl-and-inventory.md §3 任務 B
 */

import fs from "node:fs";
import path from "node:path";
import { URL } from "node:url";

interface FileEntry {
  filePath: string;
  url: string;
}

interface CliOptions {
  docroot: string;
  baseUrl: string;
  outPath: string;
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

  const docroot = args.get("docroot") ?? "./ctworld-docroot";
  const baseUrl = args.get("base-url") ?? "https://www.ctworld.org";
  const outPath = args.get("out") ?? "data/crawl/all-files.json";

  return { docroot, baseUrl, outPath };
}

function ensureDirExists(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function isHtmlFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ext === ".htm" || ext === ".html";
}

/**
 * 遞迴列出 docroot 下所有 HTML 檔案的絕對路徑
 * 對應：crawl-and-inventory.md §3.4
 */
function walkDir(root: string): string[] {
  const results: string[] = [];

  function visit(current: string) {
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(current);
      for (const name of entries) {
        visit(path.join(current, name));
      }
    } else if (stat.isFile() && isHtmlFile(current)) {
      results.push(current);
    }
  }

  visit(root);
  return results;
}

/**
 * 檔案路徑 → URL
 * TODO: 若舊站 index 檔規則特殊（index.htm → /foo/），可在此調整。
 */
function filePathToUrl(filePath: string, docroot: string, baseUrl: string): string {
  const rel = path.relative(docroot, filePath).replace(/\\/g, "/");
  const url = new URL(rel, baseUrl);
  return url.toString();
}

function toCsv(entries: FileEntry[]): string {
  const header = "filePath,url";
  const rows = entries.map((e) => {
    const esc = (v: string) => '"' + v.replace(/"/g, '""') + '"';
    return [esc(e.filePath), esc(e.url)].join(",");
  });
  return header + "\n" + rows.join("\n") + "\n";
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  const { docroot, baseUrl, outPath } = options;
  if (!fs.existsSync(docroot)) {
    console.error(`Docroot does not exist: ${docroot}`);
    process.exit(1);
  }

  const files = walkDir(docroot);
  const entries: FileEntry[] = files.map((filePath) => ({
    filePath,
    url: filePathToUrl(filePath, docroot, baseUrl),
  }));

  ensureDirExists(outPath);
  fs.writeFileSync(outPath, JSON.stringify(entries, null, 2), "utf-8");

  const csvPath = outPath.replace(/\.json$/i, ".csv");
  fs.writeFileSync(csvPath, toCsv(entries), "utf-8");

  console.log(`Saved ${entries.length} file entries to:`);
  console.log(`  JSON: ${outPath}`);
  console.log(`  CSV : ${csvPath}`);
}

// 直接執行 main
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
