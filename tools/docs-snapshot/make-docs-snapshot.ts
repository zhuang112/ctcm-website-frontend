import fs from 'node:fs';
import path from 'node:path';
import { mkdir, readdir } from 'node:fs/promises';
import archiver from 'archiver';

type CliOptions = {
  taskId: string;
  version: number;
};

type FileEntry = {
  absolutePath: string;
  relativePath: string;
};

const DEFAULT_TASK_ID = 'T-0007';
const SNAPSHOTS_DIRNAME = 'snapshots';

function formatDate(value: Date): string {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseArgs(argv: string[]): CliOptions {
  let taskId = DEFAULT_TASK_ID;
  let version = 1;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--task' || arg === '-t') {
      taskId = argv[i + 1] ?? taskId;
      i += 1;
    } else if (arg.startsWith('--task=')) {
      taskId = arg.split('=')[1] || taskId;
    } else if (arg === '--version' || arg === '-v') {
      const value = Number.parseInt(argv[i + 1] ?? '', 10);
      if (!Number.isNaN(value)) {
        version = value;
      }
      i += 1;
    } else if (arg.startsWith('--version=')) {
      const value = Number.parseInt(arg.split('=')[1] ?? '', 10);
      if (!Number.isNaN(value)) {
        version = value;
      }
    }
  }

  return { taskId, version };
}

async function collectDocs(baseDir: string): Promise<FileEntry[]> {
  const docsDir = path.join(baseDir, 'docs');
  const entries = await readdir(docsDir, { withFileTypes: true });
  const files: FileEntry[] = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => {
      const absolutePath = path.join(docsDir, entry.name);
      const relativePath = path.relative(baseDir, absolutePath);
      return { absolutePath, relativePath };
    });

  const terminalLogsDir = path.join(docsDir, 'terminal_logs');
  try {
    const logEntries = await readdir(terminalLogsDir, { withFileTypes: true });
    const txtFiles = logEntries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.txt'))
      .map((entry) => {
        const absolutePath = path.join(terminalLogsDir, entry.name);
        const relativePath = path.relative(baseDir, absolutePath);
        return { absolutePath, relativePath };
      });
    files.push(...txtFiles);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }

  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

async function createZip(outputPath: string, files: FileEntry[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve());
    archive.on('warning', (err) => {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        console.warn('[snapshot:docs] warning:', err.message);
        return;
      }
      reject(err);
    });
    archive.on('error', (err) => reject(err));

    archive.pipe(output);

    files.forEach((file) => {
      archive.file(file.absolutePath, {
        name: file.relativePath.replace(/\\/g, '/'),
      });
    });

    archive.finalize().catch(reject);
  });
}

async function main(): Promise<void> {
  const projectRoot = process.cwd();
  const { taskId, version } = parseArgs(process.argv.slice(2));
  const dateStamp = formatDate(new Date());
  const snapshotsDir = path.join(projectRoot, SNAPSHOTS_DIRNAME);
  await mkdir(snapshotsDir, { recursive: true });

  const zipName = `ctworld-docs-${taskId}-${dateStamp}-v${version}.zip`;
  const zipPath = path.join(snapshotsDir, zipName);

  const files = await collectDocs(projectRoot);
  if (files.length === 0) {
    console.error('[snapshot:docs] No eligible docs found to archive.');
    process.exitCode = 1;
    return;
  }

  console.log(`[snapshot:docs] Creating ${path.relative(projectRoot, zipPath)}`);
  console.log('[snapshot:docs] Files:');
  files.forEach((file) => console.log(` - ${file.relativePath}`));

  await createZip(zipPath, files);
  console.log('[snapshot:docs] Done.');
}

main().catch((error) => {
  console.error('[snapshot:docs] Failed:', error);
  process.exitCode = 1;
});
