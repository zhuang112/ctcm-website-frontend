# INSTR-P2-0008-download-inbox-intake-and-auto-archive
**Task ID:** P2-0008  
**Phase:** 2  
**Execution Agent:** Codex-max（主）或 Claude Code（若你想測 Claude Code Execution）  
**Repo/Workdir:** Canonical repo（你目前的 Phase2 main clone）  
**Branch:** phase2/P2-0008-download-intake

---

## 0. Goal
建立「下載檔單入口 + 自動辨識/改名/歸檔」的最小可用工具與工作流規則，避免檔案遺失、亂放、污染主檔，並能支援後續多 AI review / handoff 的穩定閉環。

---

## 1. Definition of Done (DoD)
- [x] 新增目錄：`docs/QA/INCOMING_DOWNLOADS/`（含 `_INBOX/_QUARANTINE/_PROCESSED/_LOGS`）與 README
- [x] 新增工具：`tools/qa/intake-downloads.mjs`
- [x] `package.json` 新增 script：`qa:intake-downloads`
- [x] Workflow 文件新增 Step 0（Download Intake）
- [x] 工具至少支援：`.zip .md .docx .pdf .png .jpg .json`
- [x] 工具有 log：JSONL + Markdown 摘要
- [x] 無法分類 → quarantine（而不是猜）
- [x] 跑過：
  - [x] `npm run check:no-bom`
  - [x] `npm run check:utf8`
  - [x] `npm run check:mojibake`（staged mode）
  - [x] `npm test`
  - [x] `npm run build`
- [x] 產出 handoff zip：`docs/TEMP/TEMP_<YYYYMMDD>_P2-0008_<HEAD7>.zip`（含 MANIFEST）

---

## 2. Implementation Requirements
### 2.1 Folder conventions (create if missing)
```
docs/QA/INCOMING_DOWNLOADS/
  README.md
  _INBOX/
  _QUARANTINE/
  _PROCESSED/
  _LOGS/
```

### 2.2 Classification rules (MVP)
Use a deterministic mapping (no AI needed):
- `.zip`:
  - if contains `MANIFEST.json` → treat as HANDOFF/PATCH candidate
  - if filename contains `TEMP_` → HANDOFF → move to `docs/TEMP/`
  - else if filename contains `PATCH_` → move to `docs/QA/INCOMING_PATCHES/<task_id>/`
  - else → quarantine (unknown zip)
- `.md`:
  - if filename contains `ADVICE` or located in `_ADVICE` in name → `docs/QA/DEBUG_V3/REPORTS/_ADVICE/`
  - if contains `INFO` or pricing/fee keywords → `docs/QA/DEBUG_V3/REPORTS/INFO/`
  - if contains `DECISION_` → target `docs/QA/DEBUG_V3/REPORTS/<task_id>/`
  - else if contains `P2-` or `T-` task id → target `docs/QA/DEBUG_V3/REPORTS/<task_id>/`
  - else → quarantine
- `.docx/.pdf`:
  - default to `docs/QA/DEBUG_V3/REPORTS/INFO/` unless task id detected
- images:
  - default to `docs/QA/DEBUG_V3/REPORTS/<task_id>/assets/` if task id detected else quarantine

### 2.3 Renaming rules
Rename into:
`<YYYYMMDD>_<KIND>_<TASK_OR_TOPIC>_<short>[_HEAD7].<ext>`
- KIND: HANDOFF/PATCH/REPORT/ADVICE/INFO/UIZIP/ASSET
- If task id cannot be detected: TASK_OR_TOPIC = `UNSORTED`

### 2.4 Logging
Write two logs per run:
- `docs/QA/INCOMING_DOWNLOADS/_LOGS/intake_<YYYYMMDD>_<HHMMSS>.jsonl`
- `docs/QA/INCOMING_DOWNLOADS/_LOGS/intake_<YYYYMMDD>_<HHMMSS>.md`

Each entry should include:
- original_path
- new_path (or quarantine_path)
- kind
- detected_task_id
- reason

### 2.5 Safety guard
- Never overwrite existing files. If collision, append `_n` suffix.
- Never move files out of repo root.
- If a file contains NUL bytes (0x00) and is not an expected binary, quarantine.

---

## 3. Workflow update
Update the canonical workflow doc (the one you are currently maintaining) to include:

**Step 0: Download Intake**
- Put all downloaded artifacts into `docs/QA/INCOMING_DOWNLOADS/_INBOX/`
- Run `npm run qa:intake-downloads`
- After intake, only reference files by their final archived location
- If quarantine happens, handle it explicitly before proceeding

---

## 4. Tests / Validation
- Add a small fixture set under:
  - `docs/QA/INCOMING_DOWNLOADS/_INBOX/_fixtures/` (optional)
- Provide a short “How to use” section in `docs/QA/INCOMING_DOWNLOADS/README.md`
- Include sample console output in the README

---

## 5. Commit / Handoff
- commit message: `feat(P2-0008): add download intake and auto-archive`
- Generate handoff zip under `docs/TEMP/` with correct MANIFEST.source_commit

---

## 6. Notes
- Keep the implementation small. This is **not** the API Router.
- This task is to prevent “檔案不見 / 未追蹤 / 放錯資料夾 / 亂碼污染” from reappearing.
