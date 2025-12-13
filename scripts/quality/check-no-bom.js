#!/usr/bin/env node
/**
 * Scan text files for UTF-8 BOM (EF BB BF).
 * Exits non-zero if any BOM is found.
 *
 * Scans: docs/, src/, tests/, tools/, scripts/, data/
 * Skips: node_modules/, .git/, docs/TEMP/, dist/, .next/, tmp/
 */

import fs from "fs";
import path from "path";

const roots = ["docs", "src", "tests", "tools", "scripts", "data"];
const skipDirs = new Set([
  "node_modules",
  ".git",
  "docs/TEMP",
  "dist",
  ".next",
  "tmp",
]);
const textExts = new Set([
  ".md",
  ".ts",
  ".tsx",
  ".js",
  ".json",
  ".yml",
  ".yaml",
  ".txt",
  ".css",
  ".html",
]);

const bom = Buffer.from([0xef, 0xbb, 0xbf]);
const offenders = [];

function hasBom(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    if (buf.length >= 3 && buf.slice(0, 3).equals(bom)) {
      return true;
    }
  } catch (err) {
    console.error(`WARN: unable to read ${filePath}: ${err.message}`);
  }
  return false;
}

function walk(current) {
  const stat = fs.statSync(current);
  if (stat.isDirectory()) {
    // Normalize dir string for skip list comparison
    const rel = path.relative(process.cwd(), current).replace(/\\/g, "/");
    if (skipDirs.has(rel) || skipDirs.has(path.basename(current))) {
      return;
    }
    for (const entry of fs.readdirSync(current)) {
      walk(path.join(current, entry));
    }
    return;
  }

  const ext = path.extname(current).toLowerCase();
  if (!textExts.has(ext)) return;

  if (hasBom(current)) {
    offenders.push(path.relative(process.cwd(), current).replace(/\\/g, "/"));
  }
}

for (const root of roots) {
  if (fs.existsSync(root)) {
    walk(path.join(process.cwd(), root));
  }
}

if (offenders.length) {
  console.error("BOM detected in:");
  offenders.forEach((f) => console.error(` - ${f}`));
  process.exit(1);
} else {
  console.log("OK: no BOM detected");
}
