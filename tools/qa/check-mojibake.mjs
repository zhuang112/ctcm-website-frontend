#!/usr/bin/env node
/**
 * Mojibake (encoding corruption) check for docs.
 *
 * Modes:
 *   (default)  - tracked: only git-tracked files under docs/*.md
 *   --staged   - staged: only staged files under docs/*.md (for pre-commit)
 *   --all      - filesystem: all files under docs/*.md (includes untracked)
 *
 * If not in a git worktree, falls back to filesystem mode with a warning.
 */
import fs from "fs";
import { glob } from "glob";
import { execSync } from "child_process";

const TARGET_GLOB = "docs/**/*.md";
const MAX_Q_COUNT = 200;
const MAX_Q_RATIO = 0.005;

const allowlist = new Set([
  // Known legacy docs with high question mark density (not mojibake)
  'docs/RULES_CROSSCHECK_NOTES_V1.md',
  'docs/Windsurf_ChatGPT_NOTES.md',
  'docs/PROJECT_TODO.md',
  'docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md',
  // Legacy INSTR files with pre-existing mojibake (to be fixed separately)
  'docs/INSTR/INSTR-T-0019-enforce-utf8-encoding.md',
]);

/**
 * Check if we're inside a git worktree
 */
function isGitWorktree() {
  try {
    execSync('git rev-parse --git-dir', { encoding: 'utf8', stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get tracked markdown files under docs/
 */
function getTrackedFiles() {
  const output = execSync('git ls-files "docs/**/*.md"', { encoding: 'utf8' }).trim();
  return output ? output.split('\n').filter(Boolean) : [];
}

/**
 * Get staged markdown files under docs/ (added, copied, modified)
 */
function getStagedFiles() {
  const output = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' }).trim();
  if (!output) return [];
  // Filter to only docs/**/*.md files
  return output.split('\n').filter(f => f && f.startsWith('docs/') && f.endsWith('.md'));
}

/**
 * Get all markdown files under docs/ (filesystem glob)
 */
async function getAllFiles() {
  return await glob(TARGET_GLOB, { nodir: true });
}

/**
 * Read file and check for BOM
 */
const readUtf8NoBom = (file) => {
  const buf = fs.readFileSync(file);
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    throw new Error(`BOM detected in ${file}`);
  }
  return buf.toString("utf8");
};

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  if (args.includes('--all')) {
    return 'all';
  }
  if (args.includes('--staged')) {
    return 'staged';
  }
  return 'tracked'; // default
}

const main = async () => {
  const mode = parseArgs();
  let files = [];
  let modeLabel = '';

  if (!isGitWorktree() && mode !== 'all') {
    console.warn('[mojibake] WARNING: not in git worktree, falling back to filesystem mode');
    files = await getAllFiles();
    modeLabel = 'filesystem (non-git fallback)';
  } else {
    switch (mode) {
      case 'staged':
        files = getStagedFiles();
        modeLabel = 'staged';
        break;
      case 'all':
        files = await getAllFiles();
        modeLabel = 'filesystem (--all)';
        break;
      default:
        files = getTrackedFiles();
        modeLabel = 'tracked';
    }
  }

  console.log(`[mojibake] mode: ${modeLabel}, checking ${files.length} file(s)...`);

  if (!files.length) {
    console.log('OK: no files to check');
    process.exit(0);
  }

  const errors = [];

  for (const file of files) {
    // Skip files that don't exist (e.g., deleted in staged mode)
    if (!fs.existsSync(file)) {
      continue;
    }

    const normalized = file.replace(/\\/g, '/');

    try {
      const text = readUtf8NoBom(file);
      const badCharCount = (text.match(/\uFFFD/g) || []).length;
      const qCount = (text.match(/\?/g) || []).length;
      const qRatio = text.length ? qCount / text.length : 0;

      if (badCharCount > 0) {
        errors.push(`${file}: contains U+FFFD replacement characters (${badCharCount})`);
        continue;
      }

      if (!allowlist.has(normalized) && qCount > MAX_Q_COUNT && qRatio > MAX_Q_RATIO) {
        errors.push(`${file}: excessive question marks (count=${qCount}, ratio=${qRatio.toFixed(6)})`);
      }
    } catch (err) {
      errors.push(`${file}: ${err.message}`);
    }
  }

  if (errors.length) {
    console.error("[mojibake] FAIL:\n" + errors.join("\n"));
    process.exit(1);
  } else {
    console.log(`OK: no mojibake or suspicious '?' density detected in ${files.length} file(s)`);
  }
};

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

