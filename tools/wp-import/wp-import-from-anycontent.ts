#!/usr/bin/env ts-node
import fs from "fs";
import path from "path";
import { anycontentToWpImportRecord } from "../../src/wp/import/anycontent-to-wp.ts";
import type { WPImportRecord } from "../../src/wp/import/types.ts";
import type { TeachingContent } from "../../src/types/anycontent-teaching";
import type { NewsContent } from "../../src/types/anycontent-news";
import type { MagazineContent } from "../../src/types/anycontent-magazine";

type AnyContent = TeachingContent | NewsContent | MagazineContent;

interface CliOptions {
  inputRoot: string;
  language: string;
  postTypes: string[];
  dryRun: boolean;
  outPath: string;
}

function parseArgs(argv: string[]): CliOptions {
  const args = new Map<string, string | boolean>();
  for (const arg of argv.slice(2)) {
    if (arg.startsWith("--")) {
      const [k, v] = arg.replace(/^--/, "").split("=");
      args.set(k, v === undefined ? true : v);
    }
  }
  const inputRoot = (args.get("input-root") as string) || "data/anycontent";
  const language = (args.get("language") as string) || "zh-tw";
  const postTypes = ((args.get("post-type") as string) || "teaching,news,magazine")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const dryRun = args.has("dry-run") ? Boolean(args.get("dry-run")) : true;
  const outArg = args.get("out") as string | undefined;
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath =
    outArg ||
    path.resolve(process.cwd(), `tmp/wp-import-plan-${language}-${timestamp}.json`);
  return { inputRoot, language, postTypes, dryRun, outPath };
}

function collectJsonFiles(root: string): string[] {
  const results: string[] = [];
  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) {
        results.push(full);
      }
    }
  }
  walk(root);
  return results;
}

function filterAnyContent(json: any): json is AnyContent {
  return (
    json &&
    typeof json === "object" &&
    typeof json.post_type === "string" &&
    typeof json.language === "string" &&
    typeof json.post_title === "string"
  );
}

function main() {
  const opts = parseArgs(process.argv);
  const inputDir = path.resolve(process.cwd(), opts.inputRoot, opts.language);
  if (!fs.existsSync(inputDir)) {
    console.error("Input directory not found:", inputDir);
    process.exit(1);
  }

  const files = collectJsonFiles(inputDir);
  const records: WPImportRecord[] = [];
  let skipped = 0;

  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, "utf8");
      const json = JSON.parse(raw);
      if (!filterAnyContent(json)) {
        skipped += 1;
        console.warn("Skip invalid AnyContent file:", file);
        continue;
      }
      if (!opts.postTypes.includes(json.post_type)) {
        continue;
      }
      if (json.language !== opts.language) {
        continue;
      }
      const record = anycontentToWpImportRecord(json);
      records.push(record);
    } catch (err) {
      skipped += 1;
      console.warn("Failed to parse file:", file, err instanceof Error ? err.message : err);
    }
  }

  const output = {
    generated_at: new Date().toISOString(),
    source: {
      input_root: inputDir,
      language: opts.language,
      post_types: opts.postTypes,
    },
    records,
    skipped,
  };

  const outDir = path.dirname(opts.outPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(opts.outPath, JSON.stringify(output, null, 2), "utf8");

  console.log(
    `Generated ${records.length} WP import records (lang=${opts.language}, posts=${opts.postTypes.join(
      ",",
    )}) -> ${opts.outPath}`,
  );
}

main();
