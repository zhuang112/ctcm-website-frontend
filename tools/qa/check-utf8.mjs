#!/usr/bin/env node
/**
 * UTF-8 integrity check for docs.
 * - Scans git-tracked Markdown files under docs/
 * - Fails if UTF-8 decode fails or contains replacement chars (�)
 */
import fs from 'fs';
import { execSync } from 'child_process';

function listFiles() {
  const output = execSync('git ls-files "docs/**/*.md"', { encoding: 'utf8' }).trim();
  return output ? output.split('\n').filter(Boolean) : [];
}

function hasReplacementChar(text) {
  return (text.match(/\uFFFD/g) || []).length;
}

const files = listFiles();
if (!files.length) {
  console.log('No markdown files found under docs/.');
  process.exit(0);
}

let failed = false;
const decoder = new TextDecoder('utf-8', { fatal: true });

for (const file of files) {
  try {
    const buf = fs.readFileSync(file);
    const decoded = decoder.decode(buf);
    const replCount = hasReplacementChar(decoded);
    if (replCount > 0) {
      console.error(`[utf8] replacement characters (${replCount}) in ${file}`);
      failed = true;
    }
  } catch (err) {
    console.error(`[utf8] decode failed for ${file}: ${err.message}`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log('OK: docs/**/*.md are valid UTF-8 with no replacement characters.');
