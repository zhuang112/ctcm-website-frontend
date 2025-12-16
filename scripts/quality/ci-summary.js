#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Write CI summary files (md + json).
 * Accepts optional repeated flag: --check name=status
 * Status should be: pass | fail | skipped | warn | unknown
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const cwd = process.cwd();

function parseArgs() {
  const checks = {};
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--check' && args[i + 1]) {
      const [name, status] = args[i + 1].split('=');
      if (name) {
        checks[name] = status || 'unknown';
      }
      i += 1;
    }
  }
  return checks;
}

function gatherCrawlFails() {
  const file = path.join(cwd, 'docs', 'QA', 'CRAWL_FAILS.md');
  if (!fs.existsSync(file)) return { exists: false };
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  return {
    exists: true,
    line_count: lines.length,
  };
}

function writeJson(summary) {
  fs.writeFileSync(
    path.join(cwd, 'ci_summary.json'),
    `${JSON.stringify(summary, null, 2)}\n`,
    'utf8',
  );
}

function writeMd(summary) {
  const md = [];
  md.push('# CI Summary');
  md.push('');
  md.push(`- source_commit: \`${summary.source_commit}\``);
  md.push(`- run_at: ${summary.run_at}`);
  md.push('');
  md.push('## Checks');
  Object.entries(summary.checks).forEach(([name, status]) => {
    md.push(`- ${name}: ${status}`);
  });
  if (summary.crawl_fails?.exists) {
    md.push('');
    md.push('## Crawl Fails');
    md.push(`- line_count: ${summary.crawl_fails.line_count}`);
  }
  md.push('');
  fs.writeFileSync(path.join(cwd, 'ci_summary.md'), md.join('\n'), 'utf8');
}

function main() {
  const checks = parseArgs();
  const source_commit = execSync('git rev-parse HEAD').toString().trim();
  const run_at = new Date().toISOString();
  const crawl_fails = gatherCrawlFails();
  const summary = { source_commit, run_at, checks, crawl_fails };
  writeJson(summary);
  writeMd(summary);
  console.log('CI summary written to ci_summary.md and ci_summary.json');
}

main();

