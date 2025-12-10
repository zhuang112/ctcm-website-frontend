#!/usr/bin/env ts-node
import { promises as fs } from "fs";
import path from "path";
import { convertToZhCn } from "../../src/i18n/zh-tw-to-zh-cn";

type CliOptions = {
  input: string;
  output: string;
  dryRun: boolean;
};

const RAW_CONVERT_PATHS = new Set([
  "title",
  "post_title",
  "excerpt",
  "post_excerpt",
  "body_markdown",
  "seo.meta_title",
  "seo.meta_description",
]);

const BLOCKED_KEYS = new Set([
  "id",
  "uuid",
  "external_id",
  "slug",
  "url",
  "old_url",
  "permalink",
  "featured_image",
  "language",
]);

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const inputDir = path.resolve(options.input);
  const outputDir = path.resolve(options.output);

  const files = await collectJsonFiles(inputDir);
  if (files.length === 0) {
    console.log(`[convert:zh-cn] No JSON files found under ${inputDir}`);
    return;
  }

  console.log(
    `[convert:zh-cn] ${options.dryRun ? "Dry-run" : "Converting"} ${files.length} file(s)`,
  );

  for (const file of files) {
    const relPath = path.relative(inputDir, file);
    const outPath = path.join(outputDir, relPath);
    const content = await fs.readFile(file, "utf8");

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.warn(`[convert:zh-cn] Skip (invalid JSON): ${file}`, err);
      continue;
    }

    const converted = convertNode(parsed);
    // force language to zh-cn if present
    if (typeof converted === "object" && converted && "language" in converted) {
      (converted as Record<string, unknown>).language = "zh-cn";
    }

    if (options.dryRun) {
      console.log(`  - would write: ${outPath}`);
      continue;
    }

    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, JSON.stringify(converted, null, 2), "utf8");
    console.log(`  - wrote: ${outPath}`);
  }
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = {
    input: "data/anycontent/zh-tw",
    output: "data/anycontent/zh-cn",
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--input" && argv[i + 1]) {
      opts.input = argv[++i];
    } else if (arg === "--output" && argv[i + 1]) {
      opts.output = argv[++i];
    } else if (arg === "--dry-run") {
      opts.dryRun = true;
    }
  }
  return opts;
}

async function collectJsonFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectJsonFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(full);
    }
  }
  return files;
}

function convertNode(value: unknown, pathParts: string[] = []): unknown {
  if (Array.isArray(value)) {
    return value.map((v) => convertNode(v, pathParts));
  }
  if (typeof value === "object" && value !== null) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = convertNode(v, [...pathParts, k]);
    }
    return out;
  }
  if (typeof value === "string") {
    return shouldConvert(pathParts) ? convertToZhCn(value) : value;
  }
  return value;
}

function shouldConvert(pathParts: string[]): boolean {
  const key = pathParts[pathParts.length - 1];
  if (!key) return false;
  const lowerKey = key.toLowerCase();
  if (BLOCKED_KEYS.has(lowerKey)) return false;

  const fullPath = pathParts.join(".").toLowerCase();
  if (RAW_CONVERT_PATHS.has(lowerKey) || RAW_CONVERT_PATHS.has(fullPath)) {
    return true;
  }

  // meta.*: convert string fields unless obviously non-textual
  if (pathParts[0] === "meta") {
    if (
      lowerKey.includes("id") ||
      lowerKey.includes("url") ||
      lowerKey.includes("date") ||
      lowerKey.includes("time") ||
      lowerKey.includes("slug")
    ) {
      return false;
    }
    return true;
  }

  return false;
}

main().catch((err) => {
  console.error("[convert:zh-cn] Unexpected error", err);
  process.exit(1);
});
