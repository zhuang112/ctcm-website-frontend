#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Simple secret scanner for working tree + recent git history.
 * - Scans text files in repo (excluding large/binary and ignored dirs) for suspicious patterns.
 * - Runs a lightweight git grep across recent commits for the same patterns.
 * Exits 1 if any hit is found.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..', '..');

const strictMode = process.argv.includes('--strict') || process.env.SECURITY_SCAN_STRICT === '1';

const ignoreDirs = new Set([
  '.git',
  'node_modules',
  'dist',
  'dist-ssr',
  '.temp_staging',
  'docs/TEMP',
  'tmp',
  '.next',
  'snapshots',
]);

const failPatterns = [
  /WP_APP_PASSWORD/i,
  /Authorization:\s*\S+/i,
  /Bearer\s+[A-Za-z0-9_\-\.]+/i,
  /ssh-rsa/i,
  /BEGIN (OPENSSH|RSA) PRIVATE KEY/i,
];

const warnPatterns = [/SITEGROUND/i, /SFTP_PASSWORD/i, /CPANEL_PASSWORD/i];

const maxFileSizeBytes = 2 * 1024 * 1024; // skip files >2MB

const hits = [];
const warns = [];

function isBinary(buffer) {
  // crude binary detection: contains null byte
  return buffer.includes(0);
}

function shouldSkip(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.endsWith('.example')) return true;
  if (lower.endsWith('security-scan.js')) return true; // avoid self-match
  return false;
}

function scanFile(filePath) {
  const stat = fs.statSync(filePath);
  if (stat.size === 0 || stat.size > maxFileSizeBytes) return;
  const buffer = fs.readFileSync(filePath);
  if (isBinary(buffer)) return;
  const text = buffer.toString('utf8');
  if (shouldSkip(filePath)) return;

  const allowWords = ['<redacted>', 'placeholder', 'example', 'your-password', 'xxx', '****'];
  const isMarkdown = filePath.toLowerCase().endsWith('.md');
  const isDocs = filePath.replace(/\\/g, '/').startsWith('docs/');
  const processPatterns = (patterns, bucket) => {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const line = text.split(/\r?\n/).find((l) => pattern.test(l)) ?? '';
        const lowerLine = line.toLowerCase();
        if (allowWords.some((w) => lowerLine.includes(w))) continue;
        const sanitized = line.replace(pattern, '<redacted>');
        const safeCodeContext =
          line.includes('process.env') ||
          line.includes('${auth}') ||
          line.includes('${ secrets.') ||
          line.includes('${secrets');
        const targetBucket = isMarkdown || isDocs || safeCodeContext ? warns : bucket;
        targetBucket.push({ file: filePath, pattern: pattern.toString(), line: sanitized.trim() });
      }
    }
  };

  processPatterns(failPatterns, hits);
  processPatterns(warnPatterns, warns);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.relative(repoRoot, path.join(dir, entry.name)).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (ignoreDirs.has(rel) || [...ignoreDirs].some((p) => rel.startsWith(`${p}/`))) {
        continue;
      }
      walk(path.join(dir, entry.name));
    } else {
      scanFile(path.join(dir, entry.name));
    }
  }
}

function scanHistory() {
  try {
    const revList = execSync('git rev-list --max-count=200 HEAD', { cwd: repoRoot })
      .toString()
      .trim();
    if (!revList) return;
    const pattern = '(WP_APP_PASSWORD|Authorization:|Bearer |ssh-rsa|BEGIN (OPENSSH|RSA) PRIVATE KEY)';
    const cmd = `git grep -n --color=never -i -E "${pattern}" ${revList}`;
    const out = execSync(cmd, { cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    if (out.trim()) {
      out
        .trim()
        .split('\n')
        .forEach((line) => {
          const [location] = line.split(':');
          const targetBucket = strictMode ? hits : warns;
          targetBucket.push({ file: `(git history) ${location}`, pattern: 'history-match', line: '<redacted>' });
        });
    }
  } catch {
    // ignore git grep exit 1 (no matches) or other minor errors
  }
}

walk(repoRoot);
scanHistory();

if (hits.length > 0) {
  console.error('Security scan FAILED: found potential secrets:');
  hits.forEach((h) => {
    console.error(`- ${h.file} :: ${h.pattern} :: ${h.line}`);
  });
  if (warns.length) {
    console.error('\nWarnings (placeholders / keywords, please double-check):');
    warns.forEach((h) => console.error(`- ${h.file} :: ${h.pattern} :: ${h.line}`));
  }
  process.exit(1);
}

if (warns.length > 0) {
  console.warn('Security scan WARNING: keyword hits (check manually, but no obvious secrets):');
  warns.forEach((h) => console.warn(`- ${h.file} :: ${h.pattern} :: ${h.line}`));
}

console.log('OK: security scan passed (no blocking secrets found)');
