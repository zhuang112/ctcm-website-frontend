# [DEPRECATED] Replaced by docs/INSTR/INSTR-P2-0007-phase2-rulebook-and-decision-memo-sop.md`n`n# INSTR-P2-0007-ai-router-queue-and-budget-guard.md

## 0) 隞餃??桃?嚗2-0007嚗???**canonical repo嚗:\ctcm-website-frontend_phase2嚗?* 銝?唬?????AI ?? debug ??撠?????

- ??**Queue嚗obs.jsonl嚗?* ?膩嚗?隞餃?閬隤堆?grok/gemini/claude/chatgpt嚗撓?交?/ZIP?蝙?典??prompt 璅⊥??蝞??撓?箄暺?- ??**Router CLI** 霈??Queue ???舫嚗??API ??撠?閬瑼 `docs/QA/DEBUG_V3/REPORTS/<TASK_ID>/...` ???湔 job ???- ???**Dry-run嚗??澆 API嚗?*嚗??????payload???瑼楝敺?綽?蝣箔?瘚??舫?霅?飛??- ?? **Budget Guard**嚗???job ??token/?銝?嚗誑 env 閮剖?嚗?頞??唾歲?蒂閮???- **UI ?怎楨**嚗隞餃??芾???debug/review ??routing & automation嚗???UIZIP pipeline嚗歇?冽??SOP嚗?
> ??嚗?*codex-max ?臬銝 Execution Agent嚗 repo / commit / push / handoff嚗?*?隞?AI ?芰??report嚗PI ??web/desktop ??嚗?
---

## 1) ?砌遙?楝?梧?Routing嚗?- Execution Agent嚗?*codex-max**
- Reviewer嚗PI嚗?grok / gemini / chatgpt嚗penAI嚗????嗉? dry-run嚗?甇?API ?澆???舫??- Reviewer嚗? API嚗?Claude Code / Claude Web ?雿??票 prompt嚗?閬瑼?? REPORT 頝臬??喳嚗outer ?芾?鞎祆???瘙??末嚗?
---

## 2) 撌乩??桅? / ? / DoD
### Canonical repo / workdir
- Canonical: `F:\ctcm-website-frontend_phase2`
- 隢?券? canonical ??scratch repo ?賢嚗??甇?蝺函Ⅳ瘙⊥?嚗?
### Branch
- `phase2/P2-0007-ai-router`

### Definition of Done嚗oD嚗?1) ?啣? Router 撌亙??README嚗 dry-run嚗?2) ?啣? Queue ?桅???靘?job
3) ?啣?嚗?瘝輻嚗rompt templates嚗???secret嚗?4) ???Ｙ?銝蝑?dry-run report ??REPORTS 頝臬?
5) `npm run check:no-bom / check:utf8 / check:mojibake` ?券?
6) `npm test` + `npm run build` ?券?
7) ?湔 `docs/PROJECT_TODO.md`?docs/Windsurf_ChatGPT_NOTES.md`
8) ?Ｙ? handoff zip嚗 MANIFEST.source_commit==HEAD嚗?
---

## 3) 閬憓?靽格??獢?File Plan嚗?
### A) Queue嚗極雿???
- ?啣?嚗docs/QA/DEBUG_V3/QUEUE/README.md`
- ?啣?嚗docs/QA/DEBUG_V3/QUEUE/jobs.jsonl`嚗隞亦征瑼絲憪?
- ?啣?嚗docs/QA/DEBUG_V3/QUEUE/examples/P2-0007_example_jobs.jsonl`

### B) Router CLI
- ?啣?嚗tools/ai-router/run.mjs`
- ?啣?嚗tools/ai-router/README.md`

### C) Prompt templates嚗窒?冽??+ 鋆撥嚗?- ?亙歇摮嚗docs/QA/DEBUG_V3/PROMPTS/debug_review.md`?bugfix_validation.md` ??銝?
- ?啣?嚗隞餃?撠嚗?`docs/QA/DEBUG_V3/PROMPTS/api_debug_request_template.md`
  - ?批捆嚗??撓?仿?隞嗆???/ context / constraints / output format???澆?
  - 銝隞颱? key

### D) NPM scripts
- 靽格嚗package.json`
  - ?啣?嚗?    - `ai:router:dryrun` ??`node tools/ai-router/run.mjs --dry-run`
    - `ai:router:run` ??`node tools/ai-router/run.mjs`
    - `ai:router:one` ??`node tools/ai-router/run.mjs --job <id>`
  - 瘜冽?嚗?閬? key/URL 撖恍?script嚗?敺? env

---

## 4) Job ?澆?嚗obs.jsonl嚗?銝銵???JSON ?拐辣嚗SONL嚗?靘?

```json
{"id":"P2-0007-demo-001","task_id":"P2-0007","target":"ai-router","reviewers":["grok","gemini"],"mode":"debug_review","inputs":[{"type":"zip","path":"docs/TEMP/TEMP_YYYYMMDD_P2-0007_HEAD7.zip"}],"context_md":"docs/QA/DEBUG_V3/REPORTS/P2-0007/CONTEXT.md","budget":{"max_tokens":12000,"max_cost_usd":0.25},"status":"queued"}
```

甈?隤芣?嚗?- `id`嚗ob id嚗銝嚗?- `task_id`嚗?憒?`P2-0007`
- `reviewers`嚗["grok","gemini","chatgpt"]`嚗laude ?舐 `"claude_manual"`嚗?- `mode`嚗debug_review` / `bugfix_validation` / `advice`
- `inputs`嚗?獢??殷?zip/md/json 蝑?
- `context_md`嚗?賂??其???憿??
- `budget`嚗???Router ??瑼Ｘ嚗?- `status`嚗queued|running|done|skipped|error`

---

## 5) Router 銵閬嚗VP嚗?### CLI ?
- `--dry-run`嚗??澆 API嚗?Ｙ? request 瑼?- `--job <id>`嚗???桐? job
- `--queue <path>`嚗?閮?`docs/QA/DEBUG_V3/QUEUE/jobs.jsonl`
- `--date <YYYYMMDD>`嚗閬神?交?嚗?閮凋??伐?

### ?Ｗ
- dry-run嚗???reviewer ?Ｖ?隞?request嚗?  - `docs/QA/DEBUG_V3/REPORTS/<TASK_ID>/AI_DEBUG_REQUEST_<reviewer>_<YYYYMMDD>.md`
- run嚗?芯???API嚗?瘥?reviewer ?Ｖ?隞賜???
  - `docs/QA/DEBUG_V3/REPORTS/<TASK_ID>/AI_DEBUG_<reviewer>_<YYYYMMDD>.md`

### Budget guard嚗??′???
- ??`budget` 蝻箏仃 ??Router 隞 request嚗ry-run嚗?雿 run 璅∪?銝敺?`skipped` 銝西??????踹?鈭??ｇ???
### API key嚗隞餃?銝?啣 repo嚗?- Router 霈??env嚗?  - `OPENAI_API_KEY`嚗hatgpt嚗?  - `GEMINI_API_KEY`
  - `GROK_API_KEY`
- **銝?**??key ?暸脖遙雿?repo 瑼??遙雿?handoff zip??- ??env 蝻箏仃嚗outer ??run 璅∪??湔 `skipped` 銝血神??嚗ry-run 銝?敶梢??
> ??嚗? P2-0007 ???ueue + Request/Report ?賣? + Budget Guard??摰?嚗PI ???臭誑銝?憿?P2-0008 ?????踹?銝甈∪云憭折?嚗?
---

## 6) 撌乩?瘚?嚗odex-max ?郊嚗?1) `cd /d F:\ctcm-website-frontend_phase2`
2) `git status` 敹?銋暹楊
3) `git checkout -b phase2/P2-0007-ai-router`
4) 靘?File Plan ?啣?瑼???scripts
5) 頝霅?
   - `npm run check:no-bom`
   - `npm run check:utf8`
   - `npm run check:mojibake`
   - `npm test`
   - `npm run build`
6) 撱箇?銝蝑?demo job嚗?嚗?   - `npm run ai:router:dryrun`
7) ?湔 TODO/notes
8) commit + push + handoff嚗ANIFEST.source_commit==HEAD嚗?
---

## 7) Handoff ?撠?獢??殷?撱箄降嚗?- `tools/ai-router/run.mjs`
- `tools/ai-router/README.md`
- `docs/QA/DEBUG_V3/QUEUE/README.md`
- `docs/QA/DEBUG_V3/QUEUE/jobs.jsonl`
- `docs/QA/DEBUG_V3/QUEUE/examples/P2-0007_example_jobs.jsonl`
- `docs/QA/DEBUG_V3/PROMPTS/api_debug_request_template.md`
- `docs/QA/DEBUG_V3/REPORTS/P2-0007/AI_DEBUG_REQUEST_<reviewer>_<YYYYMMDD>.md`
- `package.json`
- `docs/PROJECT_TODO.md`
- `docs/Windsurf_ChatGPT_NOTES.md`

---

## 8) 摰?敺?銝甇伐???嚗?- P2-0008嚗?賂?嚗?甇?葡??API嚗penAI/Gemini/Grok嚗???嚗蒂?? cost/token 閮??蜇憿銝???- P2-0002嚗ample-driven parser/import嚗? samples zip ??inventory baseline ?券莎?

