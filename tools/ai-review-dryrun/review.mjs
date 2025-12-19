#!/usr/bin/env node
import { execSync } from "child_process";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const argv = process.argv.slice(2);
const args = {};
argv.forEach((arg) => {
  const trimmed = arg.replace(/^--/, "");
  if (trimmed.includes("=")) {
    const [k, v] = trimmed.split("=");
    args[k] = v;
  } else {
    args[trimmed] = true;
  }
});

const taskId = typeof args.task === "string" ? args.task : "T-TEST-0001";
const reviewers = (typeof args.reviewers === "string" ? args.reviewers : "gemini,grok,claude,chatgpt")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const mode = typeof args.mode === "string" ? args.mode : "cheap";

function gitDiffSummary() {
  try {
    const out = execSync("git diff --stat --name-status", { encoding: "utf8" });
    return out.trim() || "(no pending changes)";
  } catch (err) {
    return `(failed to read git diff: ${err.message})`;
  }
}

const diffSummary = gitDiffSummary();
const __dirname = dirname(fileURLToPath(import.meta.url));
const reportPath = join(
  __dirname,
  "..",
  "..",
  "docs",
  "QA",
  "DEBUG_V3",
  "REPORTS",
  "T-TEST-0001",
  "AI_DEBUG_DRYRUN_20251219.md",
);
mkdirSync(dirname(reportPath), { recursive: true });

const report = `# AI_DEBUG_DRYRUN_20251219 (${taskId})

## Summary
- Dry-run only（不呼叫外部 AI）。模式：${mode}.
- Reviewers: ${reviewers.join(', ')}.

## Routing
- Execution Agent: trial branch dry-run.
- External AI: N/A（placeholder report, no API call）。

## Inputs
- git diff summary:
${diffSummary.split('\n').map((l) => `  ${l}`).join('\n')}

## Findings
### High
- None observed in dry-run；建議正式 review 時檢查安全性與資料外洩風險。

### Medium
- 請確認未追蹤檔案是否應納入 commit，避免遺漏。

### Low
- README/指令可再補充支援自訂輸出路徑（後續可加）。

## Suggested Fix
- 正式交付時請跑實際 AI reviewer；若有未追蹤檔請確認後納入或忽略。

## Tests / Checks
- Dry-run only；請見最終回報的檢查結果（check:no-bom / check:utf8 / check:mojibake / test / build）。

## Non-goals
- 不呼叫任何外部 API。
- 不覆蓋既有程式邏輯，只產生最小測試報告。
`;

writeFileSync(reportPath, report, { encoding: "utf8" });
console.log(`Dry-run report generated at ${reportPath}`);
