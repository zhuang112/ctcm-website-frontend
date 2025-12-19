# INSTR-T-0018-phase2-sample-driven-parser-and-import-plan

> Date: 2025-12-19 (Asia/Taipei)  
> Owner: codex-max (canonical repo on F:\ctcm-website-frontend_phase2)  
> Context: Phase 2 已完成 inventory baseline（T-0114）並合回 main；接下來要把「內容盤點 → 樣本集 → 解析/匯入規格 → 可測試的 parser/importer」落成可迭代閉環。

---

## 0) Routing Header (AI / Budget)

- Execution Agent: **codex-max**
- External reviewers (budgeted):
  - Grok (risk/edge-cases): **ON**（僅針對規格/假設與資料一致性）
  - ChatGPT (workflow/schema consistency): **ON**（免 API，人工貼回報告即可）
  - Claude Web (spec drafting): **OPTIONAL**（免 API；只用於整理規格文字）
- Budget guard: 本任務以 **不呼叫 API** 為預設；如需 Grok，先產出 review pack 再送。

---

## 1) Goal

建立「Sample-driven」的 parser/import 設計與測試骨架，讓後續每個 crawler/parser/import 任務都能：

**樣本 ZIP → 解析器 → 產出 JSON（AnyContent/Directus-ready）→ tests 驗證 → handoff**

---

## 2) Definition of Done (DoD)

1) 新增一份可讀、可維護的規格文件：
   - `docs/PHASE2/PHASE2_SAMPLE_DRIVEN_PARSER_PLAN.md`
   - 內容包含：來源類型分類（teaching/news/magazine/branch/gallery/index_page/flipbook）、最小必要欄位、slug/lang 規則、圖片/附件策略、錯誤分級與回報格式、回歸測試策略。

2) 新增「樣本驅動」的工具與測試骨架（先不寫完整 crawler）：
   - `tools/phase2-samples/`（或等效命名）
     - `extract-samples.mjs`：從 `docs/QA/INVENTORY/T-0114/SAMPLES_*.zip` 解出到 temp dir（不入庫）
     - `run-parse.mjs`：對樣本批次跑 parser（先 stub），輸出 `out/*.jsonl`
     - `README.md`：說明如何新增樣本、如何跑解析、如何讀報告
   - `tests/phase2/`（或等效）
     - 最少 5 個測試：encoding/slug/lang/type 判定、必填欄位、錯誤分類、json schema 形狀、determinism（同樣本輸出一致）

3) 更新 workflow/TODO/notes（最小必要）：
   - `docs/PROJECT_TODO.md`：新增 T-0018 並標記完成
   - `docs/Windsurf_ChatGPT_NOTES.md`：新增 T-0018 小節（含 RAW 連結、handoff、commit）
   - （可選）`docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`：索引新增「Phase2 sample-driven harness」

4) 自證與交付：
   - `npm run check:no-bom`
   - `npm run check:utf8`
   - `npm run check:mojibake`
   - `npm test`
   - `npm run build`
   - 產 `docs/TEMP/TEMP_<date>_T-0018_<HEAD7>.zip`，且 `MANIFEST.source_commit == HEAD`

---

## 3) Working Rules (重要)

- Canonical workdir: **F:\ctcm-website-frontend_phase2**
- 起點：`origin/main` 最新 HEAD（請先 `git pull --ff-only`）
- 全程在新分支上做：`phase2/T-0018-sample-driven-parser-plan`
- **不要把樣本解壓後的大量檔案加進 Git**：只允許入庫「ZIP + manifest/summary + 規格與工具程式碼」。

---

## 4) Steps

### Step A — 建立分支 & 同步

```bash
git checkout main
git pull --ff-only
git checkout -b phase2/T-0018-sample-driven-parser-plan
git status --porcelain
```

DoD：工作樹乾淨。

---

### Step B — 盤點現有樣本來源

確認下列檔案存在（如不存在，請在 notes 記錄原因，並建立 TODO 待補）：

- `docs/QA/INVENTORY/T-0114/`
  - `FILES_ALL_20251219.json`
  - `STATS_20251219.json`
  - `INVENTORY_SUMMARY_20251219.md`
  - `SAMPLES_T-0114_*_20251219.zip`
  - `SAMPLE_MANIFEST_20251219.md`

---

### Step C — 新增規格文件（先寫清楚再動碼）

建立：

- `docs/PHASE2/PHASE2_SAMPLE_DRIVEN_PARSER_PLAN.md`

最低要包含章節：

1. Scope / Non-goals  
2. Content Types & Routing（type/lang/slug → URL）  
3. Minimal Fields（對應 Directus collections 的欄位草案；含 published_at/featured_image/images/captions）  
4. Source Patterns（從樣本歸納：html 結構、metadata 位置、常見異常）  
5. Error Taxonomy（decode/parse/validate/network 等 stage；對應 jsonl 記錄格式）  
6. Regression Strategy（新增樣本流程、測試策略、DoD）  
7. Handoff & Reports（REPORTS/T-xxxx、INCOMING_* ZIP、TEMP zip）  

---

### Step D — 新增 sample harness 工具（最小可跑）

新增目錄：`tools/phase2-samples/`

- `extract-samples.mjs`
  - input: `--samples_zip <path>`（預設取 `docs/QA/INVENTORY/T-0114/SAMPLES_T-0114_*_20251219.zip` 最新一份）
  - output: OS temp dir（或 `docs/.tmp/phase2-samples/`，需加入 .gitignore）
- `run-parse.mjs`
  - 對解出的檔案做「分類 + stub parse」
  - 先只做到：判斷 type/lang/slug + 產出 jsonl（每筆至少含：source_path、type、lang、slug、ok、errors[]）
- `README.md`
  - 一行指令跑完整流程

> 重要：先不要做真正的 HTML 解析器；本任務目標是把「跑得動 + 可測 + 可回歸」的框架立起來。

---

### Step E — 新增 npm scripts（若適合）

在 `package.json` 增加（命名可調，但需一致）：

- `phase2:samples:extract`
- `phase2:samples:parse`

---

### Step F — 新增測試（至少 5 個）

建立 `tests/phase2/sample-harness.test.ts`（或 repo 既有測試框架適配）：

最低驗證：

- 解析輸出 deterministic（相同輸入 → 相同輸出）
- 每筆必有 `type/lang/slug`
- `lang` 僅允許 `zh-hant|zh-hans|en|ja`（先以專案現況為主）
- `slug` 不得空、不含空白
- `errors[].stage` 僅允許 enum（decode/parse/validate/unknown）

---

### Step G — 更新 docs（TODO/notes/workflow）

- `docs/PROJECT_TODO.md`：新增 T-0018 並標記完成
- `docs/Windsurf_ChatGPT_NOTES.md`：新增 T-0018 小節（含：
  - 分支名
  - 主要檔案
  - checks 指令
  - handoff 路徑
  - commit hash / RAW links）
- （可選）在 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 快速索引新增一條指向：
  - `docs/PHASE2/PHASE2_SAMPLE_DRIVEN_PARSER_PLAN.md`
  - `tools/phase2-samples/README.md`

---

### Step H — 自證 / 交付

```bash
npm run check:no-bom
npm run check:utf8
npm run check:mojibake
npm test
npm run build
npm run handoff:tempzip -- --task_id T-0018
```

DoD：handoff zip 內 `MANIFEST.source_commit` 必須等於當前 `HEAD`。

---

## 5) External AI Review Pack (Optional)

若你要啟用 Grok review（省錢版）：

1) 先產生 review pack（用 handoff zip 或另打一包只含規格+工具+一小段輸出 jsonl）
2) 請把 Grok 回覆落檔：
   - `docs/QA/DEBUG_V3/REPORTS/T-0018/AI_DEBUG_SAMPLES_PLAN_<YYYYMMDD>.md`

---

## 6) Commit / PR

- Commit message: `T-0018 phase2 sample-driven parser plan + harness`
- PR（如有）：base `main`，title 同 commit

---

## 7) Handoff Content List (must include)

- `docs/PHASE2/PHASE2_SAMPLE_DRIVEN_PARSER_PLAN.md`
- `tools/phase2-samples/**`
- `package.json`（若新增 scripts）
- `tests/phase2/**`（或等效）
- `docs/PROJECT_TODO.md`
- `docs/Windsurf_ChatGPT_NOTES.md`
- `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`（若改）
