# INSTR-P2-0001-workflow-phase2-taskid-canonicalization

> Date: 2025-12-19 (Asia/Taipei)  
> Execution Agent: codex-max (canonical repo: F:\ctcm-website-frontend_phase2)  
> Purpose: 修正「任務編號撞號」與 Phase 2 工作流收斂（P2-* 命名、branch/handoff/reports 統一、Producer/Canonical 邊界寫死）

---

## 0) Scope / Non-goals

### Scope
- 把 **Phase 2 任務**全面改用 **P2-0001 / P2-0002** 這套編號（避免與既有 T-001x 撞號）。
- 把 **branch / handoff zip / REPORTS** 的命名規則與資料夾規則寫入 workflow。
- 更新 INSTR template（讓未來每顆任務一開始就能自動決定 reviewers、debug 觸發、預算）。
- 清理「最近幾顆用 T-0015~T-0018 命名」的混淆：用 **alias + deprecate**，不要破壞既有連結。

### Non-goals
- 不改任何 runtime/business 邏輯（不碰 Directus/Astro 程式功能）。
- 不重跑 inventory，不改 sample zip 內容（除非為了命名一致性）。

---

## 1) Pre-flight (must)

```bash
git checkout main
git pull --ff-only
git status --porcelain
```

DoD：工作樹必須乾淨。

---

## 2) Create branch

```bash
git checkout -b phase2/P2-0001-workflow-taskid-canonicalization
```

---

## 3) Workflow 規則寫死（最重要）

### 3.1 更新文件（必做）
修改：`docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`

新增一個新章節（建議編號接續你目前 workflow 章節，例如 1.26 或 1.27；以現況為準）：

**內容必含：**
1) **Task ID 規則**
   - Phase 2：`P2-0001` 這種格式
   - 歷史主線/舊段落：仍用 `T-xxxx`
   - 禁止 Phase 2 再新增 `T-00xx`/`T-001x`（避免撞號）

2) **Branch 命名**
   - `phase2/P2-0001-<slug>`
   - （若是 uplift / hotfix）：`uplift/P2-xxxx-...` 仍可，但 task id 必須 P2

3) **Handoff zip 命名**
   - `docs/TEMP/TEMP_<YYYYMMDD>_P2-0001_<HEAD7>.zip`
   - `MANIFEST.source_commit == HEAD`（硬規則）
   - 若有同日多次交付：用 `_r1/_r2` 或在 notes 註記（但 zip 檔名仍需含 HEAD7）

4) **REPORTS 路徑**
   - Debug/review（與任務綁定）：`docs/QA/DEBUG_V3/REPORTS/P2-0001/AI_DEBUG_*.md`
   - Advice/strategy（不綁任務）：`docs/QA/DEBUG_V3/REPORTS/_ADVICE/AI_ADVICE_*.md`
   - 禁止把外部 AI 回覆丟到 INSTR（INSTR 只放「可執行指令」）

5) **Canonical vs Producer 邊界（寫死）**
   - Canonical truth：`origin/main` + `F:\ctcm-website-frontend_phase2`
   - Producer（C 槽沙盒、anti scratch）只交付：
     - report md / patch zip / sample zip
     - 不可被視為真相來源
   - Landing/合併 main 必須在 canonical repo 完成（含 checks + handoff）

6) **External debug triggers + Budget guard（沿用現有規則，補充一行）**
   - INSTR 必須在 header 明確列 reviewers 與預算（none/low/med/high）
   - 若 INSTR 指定 reviewer=ON，但交付未附 REPORTS：視為未完成

---

## 4) INSTR Template 更新（必做）

目標：讓你未來每一顆任務開頭就固定有「routing matrix + budget guard + DoD」。

### 4.1 修改（或新增）template
位置（沿用你現有的）：`docs/INSTR/_TEMPLATE_INSTR_WITH_AI_ROUTING.md`

更新點：
- 在 template 的欄位裡加入：
  - `Task ID:`（要求 P2-xxxx 或 T-xxxx）
  - `Branch:`（預期分支命名）
  - `Handoff Zip:`（預期命名）
  - `External Reviewers:`（gemini/grok/claude/chatgpt + on/off）
  - `Budget:`（none/low/med/high）
  - `Canonical repo/workdir:`（固定寫死 F:\ctcm-website-frontend_phase2）

### 4.2 兼容既有範例
template 內的範例把 task id 全部改成 `P2-xxxx`（不要再示範 T-001x）。

---

## 5) Alias / Deprecate：處理最近 T-0015~T-0018 的撞號風險（必做）

> 原則：不要刪舊檔，避免你之前丟出去的連結失效。  
> 作法：舊檔保留，但文件第一行加上「DEPRECATED → 指向新檔名」。

### 5.1 檔名策略
- 新的 Phase 2 任務：以 `docs/INSTR/INSTR-P2-xxxx-...md` 命名
- 對於已存在的（例如 `INSTR-T-0018-...`），新增一份「正式新檔」：
  - `docs/INSTR/INSTR-P2-0002-phase2-sample-driven-parser-and-import-plan.md`
- 然後在舊檔 `INSTR-T-0018-...` 文件最上方加：
  - `> DEPRECATED: Phase 2 任務已改用 P2-*，請改看 INSTR-P2-0002-...`

> 注意：此任務（P2-0001）只負責「改制與 alias」，不要求你完整重寫內容。

### 5.2 本次至少要處理的檔
- `docs/INSTR/INSTR-T-0018-phase2-sample-driven-parser-and-import-plan.md`（若存在）
- `docs/INSTR/INSTR-T-0017-encoding-hardening-v2-from-claude-advice.md`（若存在）
- 任何 `docs/INSTR/INSTR-T-0015*`、`docs/INSTR/INSTR-T-0016*`（若 repo 內有）

---

## 6) T-0017 handoff/HEAD 一致性備註（必做檢查）

你回報的內容出現「HEAD 與 handoff source_commit 不同」的可能性（例如 HEAD=93f28a8，但 handoff zip 是 d4e45f7）。

請在本任務 notes 增補一段「一致性檢查」：

- main HEAD（當前）：`git rev-parse HEAD`
- 最近一次 T-0017 的 zip 檔與 `MANIFEST.source_commit` 是否等於當時合併進 main 的 commit
- 若存在較舊 zip（source_commit < merge commit）：
  - 移到 `docs/TEMP/ARCHIVE/` 或在 notes 標註 `DO NOT USE`
  - canonical 以 main 合併後那個 commit 對應 zip 為準（若沒有，就重打 handoff）

> 不要重寫歷史；只做歸檔/註記，避免 reviewer 拿錯 zip。

---

## 7) Update TODO / notes（必做）

### 7.1 TODO
修改：`docs/PROJECT_TODO.md`
- 新增 `P2-0001` 條目並標記完成
- 註記：Phase 2 任務編號改制為 P2-xxxx

### 7.2 Notes
修改：`docs/Windsurf_ChatGPT_NOTES.md`
- 新增 `P2-0001` 小節，至少包含：
  - 變更摘要（workflow 改制、template 更新、alias/deprecate）
  - checks 指令
  - handoff zip 路徑
  - commit hash + RAW links（若你習慣）

---

## 8) Self-check + Handoff（必做）

```bash
npm run check:no-bom
npm run check:utf8
npm run check:mojibake
npm test
npm run build
npm run handoff:tempzip -- --task_id P2-0001
```

DoD：
- checks 全綠
- 產生 `docs/TEMP/TEMP_<date>_P2-0001_<HEAD7>.zip`
- `MANIFEST.source_commit == HEAD`

---

## 9) Commit / merge

Commit message：
- `P2-0001 phase2 task id canonicalization + workflow updates`

Push branch，必要時開 PR。

---

## 10) Handoff content (must include)

- `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`
- `docs/INSTR/_TEMPLATE_INSTR_WITH_AI_ROUTING.md`
- `docs/PROJECT_TODO.md`
- `docs/Windsurf_ChatGPT_NOTES.md`
- （若新增 alias 檔）`docs/INSTR/INSTR-P2-0002-...md` + 被 deprecated 的舊檔

