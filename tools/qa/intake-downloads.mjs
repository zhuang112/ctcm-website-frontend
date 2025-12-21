#!/usr/bin/env node
// Intake downloads from docs/QA/INCOMING_DOWNLOADS/_INBOX
// Classify/rename/move and log results in JSONL + Markdown.
import fs from "fs";
import path from "path";
import os from "os";

const ROOT = process.cwd();
const BASE = path.join(ROOT, "docs", "QA", "INCOMING_DOWNLOADS");
const INBOX = path.join(BASE, "_INBOX");
const QUAR = path.join(BASE, "_QUARANTINE");
const LOGS = path.join(BASE, "_LOGS");

const DEST = {
  TEMP: path.join(ROOT, "docs", "TEMP"),
  PATCH: path.join(ROOT, "docs", "QA", "INCOMING_PATCHES"),
  REPORTS: path.join(ROOT, "docs", "QA", "DEBUG_V3", "REPORTS"),
  ADVICE: path.join(ROOT, "docs", "QA", "DEBUG_V3", "REPORTS", "_ADVICE"),
  INFO: path.join(ROOT, "docs", "QA", "DEBUG_V3", "REPORTS", "INFO"),
};

const TASK_RE = /(P2-\d{4}|T-\d{4})/i;
const HEAD_RE = /\b([0-9a-f]{7,8})\b/;

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function sanitizeName(stem) {
  return stem.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "file";
}

function uniquePath(baseDir, filename) {
  let candidate = path.join(baseDir, filename);
  let counter = 1;
  while (fs.existsSync(candidate)) {
    const parsed = path.parse(filename);
    const suffix = `_${counter}`;
    const nextName = `${parsed.name}${suffix}${parsed.ext}`;
    candidate = path.join(baseDir, nextName);
    counter += 1;
  }
  return candidate;
}

function classify(filePath) {
  const base = path.basename(filePath);
  const ext = path.extname(base).toLowerCase();
  const stem = path.basename(base, ext);
  const task = (base.match(TASK_RE) || [])[1] || "UNSORTED";
  const head = (base.match(HEAD_RE) || [])[1];
  const date = today();
  const short = sanitizeName(stem.replace(TASK_RE, "").replace(HEAD_RE, ""));

  const info = { kind: "UNKNOWN", destDir: QUAR, task, head, reason: "unclassified" };
  const setName = (kind, destDir, reason) => {
    info.kind = kind;
    info.destDir = destDir;
    info.reason = reason;
  };

  if (ext === ".zip") {
    if (/TEMP_/i.test(base)) {
      setName("HANDOFF", DEST.TEMP, "contains TEMP_");
    } else if (/PATCH/i.test(base)) {
      setName("PATCH", path.join(DEST.PATCH, task), "filename contains PATCH");
    } else if (/MANIFEST/i.test(base)) {
      setName("HANDOFF", DEST.TEMP, "zip manifest hint");
    }
  } else if (ext === ".md") {
    if (/ADVICE/i.test(base)) {
      setName("ADVICE", DEST.ADVICE, "advice keyword");
    } else if (/INFO/i.test(base)) {
      setName("INFO", DEST.INFO, "info keyword");
    } else if (/DECISION/i.test(base) || /REPORT/i.test(base) || TASK_RE.test(base)) {
      setName("REPORT", path.join(DEST.REPORTS, task), "report/decision/md");
    }
  } else if (ext === ".docx" || ext === ".pdf") {
    if (task !== "UNSORTED") {
      setName("REPORT", path.join(DEST.REPORTS, task), "doc report");
    } else {
      setName("INFO", DEST.INFO, "doc info default");
    }
  } else if ([".png", ".jpg", ".jpeg"].includes(ext)) {
    if (task !== "UNSORTED") {
      setName("ASSET", path.join(DEST.REPORTS, task, "assets"), "image asset");
    }
  } else if (ext === ".json") {
    setName("INFO", DEST.INFO, "json info default");
  }

  const headPart = head ? `_${head}` : "";
  const filename = `${date}_${info.kind}_${info.task}_${short}${headPart}${ext}`;
  return { ...info, filename };
}

function moveFile(src) {
  const classification = classify(src);
  ensureDir(classification.destDir);
  const target = uniquePath(classification.destDir, classification.filename);
  fs.renameSync(src, target);
  return { ...classification, original: path.relative(ROOT, src), newPath: path.relative(ROOT, target) };
}

function hasNulBytes(file) {
  const buf = fs.readFileSync(file);
  return buf.includes(0x00);
}

function run() {
  [BASE, INBOX, QUAR, LOGS].forEach(ensureDir);

  const entries = fs.readdirSync(INBOX).map((n) => path.join(INBOX, n)).filter((p) => fs.statSync(p).isFile());
  if (!entries.length) {
    console.log(`[intake] _INBOX is empty at ${INBOX}`);
    return;
  }

  const results = [];
  for (const file of entries) {
    try {
      if (hasNulBytes(file) && path.extname(file).toLowerCase() === ".md") {
        const target = uniquePath(QUAR, path.basename(file));
        fs.renameSync(file, target);
        results.push({ original: path.relative(ROOT, file), newPath: path.relative(ROOT, target), kind: "UNKNOWN", task: "UNSORTED", reason: "NUL bytes -> quarantine" });
        continue;
      }
      const moved = moveFile(file);
      results.push(moved);
      console.log(`Moved ${moved.original} -> ${moved.newPath} (${moved.kind}, ${moved.task})`);
    } catch (err) {
      const target = uniquePath(QUAR, path.basename(file));
      fs.renameSync(file, target);
      results.push({ original: path.relative(ROOT, file), newPath: path.relative(ROOT, target), kind: "UNKNOWN", task: "UNSORTED", reason: `error: ${err.message}` });
      console.error(`[intake] failed ${file}: ${err.message}`);
    }
  }

  const stamp = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const ts = `${stamp.getFullYear()}${pad(stamp.getMonth() + 1)}${pad(stamp.getDate())}_${pad(stamp.getHours())}${pad(stamp.getMinutes())}${pad(stamp.getSeconds())}`;
  const jsonlPath = path.join(LOGS, `intake_${ts}.jsonl`);
  const mdPath = path.join(LOGS, `intake_${ts}.md`);

  const lines = results.map((r) => JSON.stringify(r));
  fs.writeFileSync(jsonlPath, lines.join(os.EOL), { encoding: "utf8" });

  const mdLines = [
    "# Intake Log",
    "",
    `Generated: ${stamp.toISOString()}`,
    "",
    "| original | new_path | kind | task | reason |",
    "| --- | --- | --- | --- | --- |",
    ...results.map((r) => `| ${r.original} | ${r.newPath} | ${r.kind} | ${r.task} | ${r.reason || ""} |`),
  ];
  fs.writeFileSync(mdPath, mdLines.join(os.EOL), { encoding: "utf8" });

  console.log(`[intake] wrote logs: ${path.relative(ROOT, jsonlPath)} , ${path.relative(ROOT, mdPath)}`);
}

run();
