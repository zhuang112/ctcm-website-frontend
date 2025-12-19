# INSTR Template (with AI routing)

## Front-matter (fill at top of every INSTR)
- Task ID: `P2-____` (Phase 2 default; if using legacy T-xxxx, state the mapping)
- Branch: `phase2/<task_id>-<slug>`
- Task Type: `UI | Conversion | Importer | Crawler | DB/Security | Docs`
- Risk: `High | Medium | Low`
- Execution Agent: `Codex | Claude Desktop | Antigravity | Gemini Desktop | (other)` (one primary executor)
- External Debug Required: `YES/NO`
- External Debug Reviewers (if YES): `Gemini / Grok / ChatGPT / Claude` (>=1)
- Prompts to use: `debug_review.md / bugfix_validation.md / Gemini UIZIP template ...`
- Report destination: `docs/QA/DEBUG_V3/REPORTS/<task_id>/...`
- Handoff: `docs/TEMP/TEMP_<date>_<task_id>_<HEAD7>.zip` (MANIFEST.source_commit==HEAD)
- Canonical repo / workdir: `zhuang112/ctcm-website-frontend` @ `F:\ctcm-website-frontend_phase2`
- Budget / ETA (optional): `<amount or hours>` / `<date>`

## If External Debug Required = YES
1) Self-check: `npm run check:no-bom`, `npm run check:utf8`, `npm run check:mojibake`, `npm test`, `npm run build`, `npm run security:scan` (when allowed)
2) Produce versioned TEMP zip (source_commit==HEAD)
3) Attach reviewer prompt (Gemini/Grok/ChatGPT/Claude)
4) Put reports under `docs/QA/DEBUG_V3/REPORTS/<task_id>/...` (multiple files allowed)
5) Handle bug/blockers via workflow bugfix/validation, then self-check again

---

## Example 1: UI task (Gemini + Grok required)
- Task ID: `P2-0xxx`
- Task Type: UI
- Risk: High
- Execution Agent: Codex (sole)
- External Debug Required: YES
- External Debug Reviewers: Gemini, Grok, ChatGPT
- Prompts: `docs/QA/DEBUG_V3/PROMPTS/debug_review.md`
- Report: `docs/QA/DEBUG_V3/REPORTS/<task_id>/AI_DEBUG_*.md`
- Handoff: `docs/TEMP/TEMP_<date>_<task_id>_<HEAD7>.zip`

## Example 2: Importer / data-writer task (Grok + ChatGPT)
- Task ID: `P2-0yyy`
- Task Type: Importer
- Risk: High
- Execution Agent: Codex (sole)
- External Debug Required: YES
- External Debug Reviewers: Grok, ChatGPT
- Prompts: `docs/QA/DEBUG_V3/PROMPTS/debug_review.md`
- Report: `docs/QA/DEBUG_V3/REPORTS/<task_id>/AI_DEBUG_*.md`
- Handoff: `docs/TEMP/TEMP_<date>_<task_id>_<HEAD7>.zip`

## Example 3: Docs-only (external debug optional)
- Task ID: `P2-0zzz`
- Task Type: Docs
- Risk: Low
- Execution Agent: Codex (sole)
- External Debug Required: NO (can optionally ask ChatGPT if riskier)
- External Debug Reviewers: N/A
- Prompts: N/A
- Report: `docs/QA/DEBUG_V3/REPORTS/<task_id>/`
- Handoff: `docs/TEMP/TEMP_<date>_<task_id>_<HEAD7>.zip` (still recommended)
