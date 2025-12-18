import fs from "fs";
import { glob } from "glob";

const allowlist = new Set([
  // Known mojibake-heavy legacy docs (to be fixed separately)
  'docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md',
  'docs/Windsurf_ChatGPT_NOTES.md',
  'docs/RULES_CROSSCHECK_NOTES_V1.md',
  'docs/PROJECT_TODO.md',
  'docs/INSTR/INSTR-T-0100-recover-mojibake-docs-and-strengthen-check.md',
  'docs/INSTR/INSTR-T-0019-enforce-utf8-encoding.md',
]);

const TARGET_GLOB = "docs/**/*.md";
const MAX_Q_COUNT = 200;
const MAX_Q_RATIO = 0.005;

const readUtf8NoBom = (file) => {
  const buf = fs.readFileSync(file);
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    throw new Error(`BOM detected in ${file}`);
  }
  return buf.toString("utf8");
};

const main = async () => {
  const files = await glob(TARGET_GLOB, { nodir: true });
  const errors = [];

  for (const file of files) {
    const normalized = file.replace(/\\/g, '/');
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
  }

  if (errors.length) {
    console.error("[mojibake] FAIL:\n" + errors.join("\n"));
    process.exit(1);
  } else {
    console.log("OK: no mojibake or suspicious '?' density detected");
  }
};

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
