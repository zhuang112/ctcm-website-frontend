#!/usr/bin/env ts-node

/**
 * 檔案系統 inventory：列出舊站 docroot 下所有 HTML 檔，並推算對應 URL。
 * 對應：docs/crawl-and-inventory.md §3 任務 B
 */

import fs from "node:fs";
import path from "node:path";

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

function filePathToUrl(filePath: string, docroot: string, baseUrl: string): string {
  const rel = path.relative(docroot, filePath).replace(/\\/g, "/");

  // TODO: 視實際舊站 URL 規則調整 index 轉換，例如：index.htm → /foo/
  const url = new URL(rel, baseUrl);
  return url.toString();
}

function toCsvRows(rows: FileEntry[]): string {
  const header = "filePath,url";
  const body = rows
    .map((row) => {
      const esc = (v: string | number | null | undefined) => {
        if (v === null || v === undefined) return "";
        const s = String(v).replace(/"/g, '""');
        return `"${s}"`;
      };
      return [esc(row.filePath), esc(row.url)].join(",");
    })
    .join("\n");
  return `${header}\n${body}\n`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const { docroot, baseUrl, outPath } = options;

  if (!fs.existsSync(docroot)) {
    console.error(`[filesystem-inventory] docroot not found: ${docroot}`);
    process.exitCode = 1;
    return;
  }

  console.log("[filesystem-inventory] options", options);

  const files = walkDir(docroot);
  const entries: FileEntry[] = files.map((filePath) => ({
    filePath: path.resolve(filePath),
    url: filePathToUrl(path.resolve(filePath), path.resolve(docroot), baseUrl),
  }));

  ensureDirExists(outPath);
  fs.writeFileSync(outPath, JSON.stringify(entries, null, 2), "utf-8");

  const csvPath = outPath.replace(/\.json$/i, ".csv");
  fs.writeFileSync(csvPath, toCsvRows(entries), "utf-8");

  console.log(`Saved ${entries.length} file entries to`);
  console.log(`  JSON: ${outPath}`);
  console.log(`  CSV : ${csvPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
