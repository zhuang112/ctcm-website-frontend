# INSTR — T-0017（Encoding Hardening v2 from Claude Advice）

> 目的：把「亂碼/編碼污染」變成 **commit 前就會被擋下來** 的問題（Repo 層 guardrails）。

## 0) Repo / Branch

- Repo：**F:\ctcm-website-frontend_phase2**
- Base branch：`main`（最新）
- New branch：`chore/T-0017-encoding-hardening-v2`

## 1) Inputs（先確認已存在）

- `npm run check:no-bom` ✅
- `npm run check:utf8` ✅
- `npm run check:mojibake` ✅（若不存在就先停下，把缺的 script/工具補齊）

## 2) Changes

### A. 新增 `.gitattributes`（repo root）
要求：
- `* text=auto eol=lf`
- 明確標記：`*.md *.json *.js *.mjs *.ts *.yml *.yaml` 為 `text eol=lf`
- `*.png *.jpg *.jpeg *.webp *.zip` 為 `binary`

> 注意：不要一次把整個 repo line endings 全洗掉。只新增 `.gitattributes`，不做批次換行重寫。

### B. 加入 Husky pre-commit（dev dependency）
1. `npm i -D husky`
2. `npx husky init`（若已存在 husky，改為更新 hook）
3. `.husky/pre-commit` 內容必跑：
   - `npm run check:no-bom`
   - `npm run check:utf8`
   - `npm run check:mojibake`

要求：
- 任一 check 失敗 → exit 1 阻擋 commit
- Hook 檔案需可執行（Windows 也要可用）

### C. 新增 GitHub Actions：Encoding Checks
新增：`.github/workflows/encoding-check.yml`

觸發條件（建議）：
- PR：當 `docs/**/*.md` 或 `tools/**/*.mjs` 或 `package.json` 變更
- push：main

步驟：
- checkout
- setup node（版本用 repo 現行版本）
- `npm ci`
- run three checks

### D. Quarantine Playbook（docs）
新增：
- `docs/QA/ENCODING_QUARANTINE/README.md`

內容需包含：
- 什麼情況要隔離
- 隔離路徑命名：`docs/QA/ENCODING_QUARANTINE/YYYYMMDD/`
- 原則：**不在亂碼檔上直接覆寫重存**；先隔離，再由產生來源重跑或回復乾淨版本

### E. Workflow 補一段（最小可用）
更新：
- `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`

新增小節（延續你現行章節編號即可）：
- 「Advice Intake 只放 _ADVICE，不直接當規格」
- 「commit 前必過三檢查（husky/CI）」

## 3) QA / Checks（必跑）

- `npm run check:no-bom`
- `npm run check:utf8`
- `npm run check:mojibake`
- `npm test`
- `npm run build`

## 4) Handoff

- 產 `docs/TEMP/TEMP_<YYYYMMDD>_T-0017_<HEAD7>.zip`
- `MANIFEST.source_commit == HEAD`

打包清單至少包含：
- `.gitattributes`
- `.github/workflows/encoding-check.yml`
- `.husky/*`（含 pre-commit）
- `package.json`（若有變）
- `docs/QA/ENCODING_QUARANTINE/README.md`
- `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`
- `docs/PROJECT_TODO.md`（新增並勾選 T-0017）
- `docs/Windsurf_ChatGPT_NOTES.md`（新增 T-0017 小節 + RAW links）

## 5) Commit

- message：`chore(T-0017): enforce encoding guardrails (gitattributes+husky+CI)`

## 6) Notes（重要）

- 不要做大規模換行/重編碼 reformat（避免污染 diff）。
- 如果 husky 在 Windows 有執行問題，優先確保：CI 一定跑得起來；husky 允許你留下「Windows 已驗證/待驗證」註記，但不得破壞 CI。
