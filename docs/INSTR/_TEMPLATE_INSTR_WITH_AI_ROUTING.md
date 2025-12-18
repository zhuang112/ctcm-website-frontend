# INSTR Template（含 AI 路由欄位）

## Front-matter（請貼在每個 INSTR 開頭，務必填寫）
- T-ID：`T-____`
- Task Type：`UI | Conversion | Importer | Crawler | DB/Security | Docs`
- Risk：`High | Medium | Low`
- Execution Agent：`Codex | Claude Desktop | Antigravity | Gemini Desktop | (other)`（同一 T 只指派 1 位執行者）
- External Debug Required：`YES/NO`
- External Debug Reviewers（若 YES）：`Gemini / Grok / ChatGPT / Claude`（至少 1 位）
- Prompts to use：`debug_review.md / bugfix_validation.md / Gemini UIZIP template ...`
- Report destination：`docs/QA/DEBUG_V3/REPORTS/<T-ID>/...`
- Handoff：`docs/TEMP/TEMP_<date>_<T-ID>_<HEAD7>.zip`（含 MANIFEST，source_commit==HEAD）

## 若 External Debug Required=YES，請在 INSTR 內加入「外部 debug 流程」小節
1) Machine self-check：`npm run check:no-bom`、`npm run check:utf8`、`npm test`、`npm run build`、`npm run security:scan`（若允許略過需明寫）。
2) 產生 versioned TEMP zip（source_commit==HEAD）。
3) 提供 reviewer prompt（Gemini/Grok/ChatGPT/Claude）。
4) 報告寫入 `docs/QA/DEBUG_V3/REPORTS/<T-ID>/...`（可多份）。
5) 若有 bug/疑慮，依 workflow 開 bugfix/validation；修後再跑 self-check。

---

## 範例 1：UI 類任務（必送 Gemini + Grok）
- T-ID：`T-0xxx`
- Task Type：UI
- Risk：High
- Execution Agent：Codex（唯一）
- External Debug Required：YES
- External Debug Reviewers：Gemini, Grok, ChatGPT
- Prompts to use：`docs/QA/DEBUG_V3/PROMPTS/debug_review.md`
- Report destination：`docs/QA/DEBUG_V3/REPORTS/T-0xxx/AI_DEBUG_*.md`
- Handoff：`docs/TEMP/TEMP_<date>_T-0xxx_<HEAD7>.zip`
- 外部 debug 流程：照上方 1)~5)。

## 範例 2：Importer / 資料寫入任務（Grok + ChatGPT）
- T-ID：`T-0yyy`
- Task Type：Importer
- Risk：High
- Execution Agent：Codex（唯一）
- External Debug Required：YES
- External Debug Reviewers：Grok, ChatGPT
- Prompts to use：`docs/QA/DEBUG_V3/PROMPTS/debug_review.md`
- Report destination：`docs/QA/DEBUG_V3/REPORTS/T-0yyy/AI_DEBUG_*.md`
- Handoff：`docs/TEMP/TEMP_<date>_T-0yyy_<HEAD7>.zip`
- 外部 debug 流程：照上方 1)~5)。

## 範例 3：Docs-only（可免外部 debug）
- T-ID：`T-0zzz`
- Task Type：Docs
- Risk：Low
- Execution Agent：Codex（唯一）
- External Debug Required：NO
- External Debug Reviewers：N/A（若高風險可補 ChatGPT）
- Prompts to use：N/A
- Report destination：`docs/QA/DEBUG_V3/REPORTS/T-0zzz/`（如有需要）
- Handoff：`docs/TEMP/TEMP_<date>_T-0zzz_<HEAD7>.zip`（仍建議保留版本化交接包）