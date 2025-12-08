#!/usr/bin/env ts-node

/**
 * teaching 專用：將單一 legacy HTML 檔轉成 TeachingContent / AnyContent JSON。
 *
 * 對應：docs/CONTENT_SCHEMA.md teaching、docs/COMPLETE_PROJECT_WORKFLOW.md teaching 流程說明。
 *
 * 使用方式（最小範例）：
 *
 *   ts-node tools/convert/teaching-html-to-anycontent.ts \
 *     --in path/to/legacy-teaching.html \
 *     --external-id teaching_example_0001 \
 *     --language zh-tw \
 *     --out data/anycontent/teaching/example-0001.json
 *
 * 若未指定 --out，則會將 JSON 直接輸出到 stdout。
 */

import fs from "node:fs";
import path from "node:path";
import { teachingFromLegacy } from "../../src/adapters/teaching-from-legacy";
import type { LegacyHtmlDocument } from "../../src/html/legacy-html-types";
import type { Language } from "../../src/types/anycontent-teaching";

interface CliOptions {
  inPath: string;
  outPath?: string;
  externalId: string;
  language: Language;
  url?: string;
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

  const inPath = args.get("in");
  if (!inPath) {
    throw new Error("Missing required --in <path/to/legacy-teaching.html>");
  }

  const externalId = args.get("external-id") ?? path.basename(inPath);
  const language = (args.get("language") as Language | undefined) ?? "zh-tw";
  const outPath = args.get("out");
  const url = args.get("url");

  return { inPath, outPath, externalId, language, url };
}

function ensureDirExists(filePath: string): void {
  if (!filePath) return;
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const { inPath, outPath, externalId, language, url } = options;

  const absInPath = path.resolve(inPath);
  const html = fs.readFileSync(absInPath, "utf-8");

  const doc: LegacyHtmlDocument = {
    url: url ?? `file://${absInPath.replace(/\\/g, "/")}`,
    html,
  };

  const teaching = teachingFromLegacy(doc, {
    externalId,
    language,
  });

  const json = JSON.stringify(teaching, null, 2);

  if (outPath) {
    const absOut = path.resolve(outPath);
    ensureDirExists(absOut);
    fs.writeFileSync(absOut, json, "utf-8");
    // 仍在 stdout 提示輸出位置，方便人工確認
    // eslint-disable-next-line no-console
    console.log(`Wrote TeachingContent JSON to ${absOut}`);
  } else {
    // 直接輸出 JSON 到 stdout
    // eslint-disable-next-line no-console
    console.log(json);
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
