#!/usr/bin/env node
/**
 * Build a ChatGPT handoff package:
 * - copies listed files into a staging folder with "__" path separators
 * - generates MANIFEST.json with sha256/bytes and metadata
 * - zips staging into docs/TEMP.zip
 * - cleans staging afterward
 *
 * Usage:
 *   node scripts/handoff/build-temp-zip.js --source_commit <hash> --out docs/TEMP.zip -- files...
 *
 * Flags:
 *   --source_commit <hash>   optional; defaults to `git rev-parse HEAD`
 *   --out <path>             optional; defaults to docs/TEMP.zip
 *   -- files...              required; repo-relative paths to include
 */
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import archiver from 'archiver';

const repo = 'zhuang112/ctcm-website-frontend';
const cwd = process.cwd();
const stagingDir = path.join(cwd, 'docs', '.temp_staging');

function parseArgs() {
  const args = process.argv.slice(2);
  const files = [];
  let outPath = 'docs/TEMP.zip';
  let sourceCommit = null;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--out' && args[i + 1]) {
      outPath = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--source_commit' && args[i + 1]) {
      sourceCommit = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--files') {
      continue;
    }
    files.push(arg);
  }

  if (!files.length) {
    throw new Error('No files specified. Usage: node scripts/handoff/build-temp-zip.js --out docs/TEMP.zip --source_commit <hash> -- files...');
  }
  return { files, outPath, sourceCommit };
}

async function ensureCleanStaging() {
  await fsp.rm(stagingDir, { recursive: true, force: true });
  await fsp.mkdir(stagingDir, { recursive: true });
}

function tempNameFor(repoPath) {
  return repoPath.replace(/\\/g, '/').replace(/\//g, '__');
}

async function hashFile(filePath) {
  const hash = crypto.createHash('sha256');
  const data = await fsp.readFile(filePath);
  hash.update(data);
  return { sha256: hash.digest('hex'), bytes: data.length };
}

async function stageFiles(filePaths) {
  const staged = [];
  for (const rel of filePaths) {
    const abs = path.resolve(cwd, rel);
    if (!fs.existsSync(abs)) {
      throw new Error(`File not found: ${rel}`);
    }
    const repoPath = path.relative(cwd, abs).replace(/\\/g, '/');
    if (repoPath.startsWith('..')) {
      throw new Error(`File not in repo: ${rel}`);
    }
    const tempName = tempNameFor(repoPath);
    const dest = path.join(stagingDir, tempName);
    await fsp.copyFile(abs, dest);
    const { sha256, bytes } = await hashFile(dest);
    staged.push({ temp_path: tempName, repo_path: repoPath, sha256, bytes });
  }
  return staged;
}

async function writeManifest({ sourceCommit, taskId, filesMeta }) {
  const manifest = {
    generated_at: new Date().toISOString(),
    repo,
    source_commit: sourceCommit,
    task_id: taskId,
    files: filesMeta,
  };
  const manifestPath = path.join(stagingDir, 'MANIFEST.json');
  await fsp.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { encoding: 'utf8' });
  const { sha256, bytes } = await hashFile(manifestPath);
  return { manifestPath, manifestSha: sha256, manifestBytes: bytes };
}

async function buildZip(outPath) {
  await fsp.rm(outPath, { force: true });
  const outDir = path.dirname(outPath);
  await fsp.mkdir(outDir, { recursive: true });

  const output = fs.createWriteStream(outPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  const finalizePromise = new Promise((resolve, reject) => {
    output.on('close', resolve);
    archive.on('error', reject);
  });

  archive.pipe(output);
  const entries = await fsp.readdir(stagingDir);
  for (const entry of entries) {
    const full = path.join(stagingDir, entry);
    archive.file(full, { name: entry });
  }
  archive.finalize();
  await finalizePromise;
  const stats = await fsp.stat(outPath);
  return stats.size;
}

async function main() {
  const { files, outPath, sourceCommit } = parseArgs();
  const resolvedOut = path.resolve(cwd, outPath);
  const commit = sourceCommit || execSync('git rev-parse HEAD').toString().trim();

  await ensureCleanStaging();
  const filesMeta = await stageFiles(files);
  const { manifestPath, manifestSha, manifestBytes } = await writeManifest({
    sourceCommit: commit,
    taskId: 'T-0063',
    filesMeta,
  });

  const zipSize = await buildZip(resolvedOut);
  await fsp.rm(stagingDir, { recursive: true, force: true });

  console.log('Handoff package created:');
  console.log(`  zip: ${resolvedOut} (${zipSize} bytes)`);
  console.log(`  manifest: ${manifestPath}`);
  console.log(`  manifest sha256: ${manifestSha} (${manifestBytes} bytes)`);
  console.log('  files:');
  filesMeta.forEach((f) => {
    console.log(`    - ${f.repo_path} -> ${f.temp_path} (sha256 ${f.sha256}, ${f.bytes} bytes)`);
  });
}

main().catch((err) => {
  console.error('[handoff] failed:', err.message);
  process.exit(1);
});
