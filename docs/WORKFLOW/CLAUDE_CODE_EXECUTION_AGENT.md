# Claude Code Execution Agent Rules (Phase 2)

> This document defines the standard operating procedures for Claude Code when acting as an Execution Agent in the multi-AI workflow.

---

## 1. Role & Boundaries

- **Claude Code = Execution Agent**
  - Responsible for coding, running commands, git operations, and handoff package creation
  - Executes tasks defined by the Strategic Commander
  - Works directly in the canonical repository

- **ChatGPT = Strategic Commander**
  - Defines Definition of Done (DoD)
  - Routes tasks and handles acceptance
  - Provides high-level coordination

- **API Reviewers (Optional)**
  - Only triggered on specific workflow events
  - Not required for standard execution

---

## 2. Non-Negotiables

These rules must always be followed:

1. **Must work in canonical repo with Git**
   - All changes happen in `F:\ctcm-website-frontend_phase2` or the designated canonical repository

2. **Must open branch from `origin/main`**
   - Always create a new branch based on the latest `origin/main`
   - Branch naming convention: `phase2/<TASK_ID>-<slug>`

3. **Must run 3 encoding checks before commit**
   - `npm run check:no-bom`
   - `npm run check:utf8`
   - `npm run check:mojibake`
   - All must pass before proceeding

4. **Must update TODO + notes**
   - Update `docs/PROJECT_TODO.md`
   - Update `docs/Windsurf_ChatGPT_NOTES.md`

5. **Must produce handoff zip with `source_commit == HEAD`**
   - Zip must contain MANIFEST.json
   - `source_commit` must match the branch HEAD SHA

---

## 3. Standard Command Sequence

### 3.1 Preflight
```bash
git status --porcelain
git fetch origin
git checkout -B phase2/<TASK_ID>-<slug> origin/main
git status --porcelain
```

### 3.2 Implement Changes
- Create/modify files as specified in the task
- Follow project conventions
- Keep all files UTF-8 without BOM

### 3.3 Self-Check
Required checks (must pass):
```bash
npm run check:no-bom
npm run check:utf8
npm run check:mojibake
```

Optional checks (if available and fast):
```bash
npm test
npm run build
```

### 3.4 Commit & Push
```bash
git status --porcelain
git add <files>
git commit -m "<TASK_ID>: <description>"
git push -u origin phase2/<TASK_ID>-<slug>
git rev-parse HEAD
```

### 3.5 Handoff Zip
- Try project handoff script first
- Fall back to manual zip creation if needed
- Verify MANIFEST.json contains correct `source_commit`

---

## 4. Where Files Go

### Reports
- **Task-specific reports:** `docs/QA/DEBUG_V3/REPORTS/<TASK_ID>/...`
  - Example: `docs/QA/DEBUG_V3/REPORTS/P2-0004/EXECUTION_LOG.md`

### Advice Documents
- **AI advice/analysis:** `docs/QA/DEBUG_V3/REPORTS/_ADVICE/...`
  - Example: `AI_ADVICE_<topic>_<date>.md`

### Info Documents
- **General information:** `docs/QA/DEBUG_V3/REPORTS/INFO/...`

### Temporary Handoff
- **Handoff zips:** `docs/TEMP/...`
  - Naming: `TEMP_<YYYYMMDD>_<TASK_ID>_<HEAD7>.zip`

---

## 5. Error Handling

If any check fails:
1. **STOP** execution immediately
2. **Document** the failure in EXECUTION_LOG.md
3. **Report** back with failure details
4. **Do NOT** bypass or work around the issue

---

## 6. End-of-Task Report Format

When task is complete, report must include:
- Branch name
- Final commit SHA
- Check results (PASS/FAIL)
- Changed files list
- Handoff zip path
- Any issues encountered
