# INSTR-P2-0007-phase2-rulebook-and-decision-memo-sop.md

> Phase 2 / UI 暫緩 / 你是唯一 execution agent  
> Canonical repo/workdir：`F:\ctcm-website-frontend_phase2`（或你目前專案指定的 canonical 目錄；禁止在其他 clone 落地）  
> Branch：`phase2/P2-0007-rulebook-and-decision-memo-sop`  
> 目標：把「協作規則、AI 路由/隊列/費用守門、Decision Memo/Reports 收納」收斂成 **單一真相**，避免規則散落、避免 TODO/NOTES 被長文污染。

---

## 0. 前置條件（必做）

1. 在 canonical repo 內確認乾淨：
   - `git checkout main`
   - `git pull --ff-only`
   - `git status` 必須乾淨

2. **建議順序**：若 `P2-0006`（mojibake staged/all）尚未落到 main，請先完成/合併 `P2-0006` 再做本任務。  
   - 理由：本任務會新增/更新多個 docs，若 mojibake 檢查仍是「全量」很容易被 legacy 檔卡住。

---

## 1. 本任務交付物（DoD）

你完成時必須同時滿足：

- 新增一份 **Phase 2 單一真相規則書**：
  - `docs/WORKFLOW/PHASE2/AI_PLAYBOOK_PHASE2.md`
- 讓 workflow 主入口能快速找到它（只加連結索引，不要把全文複製進去）：
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 新增/更新一個「Phase 2 Playbook」索引連結段落
- Decision/Review/Advice/Info 的固定歸檔規則（含 README）：
  - `docs/QA/DEBUG_V3/REPORTS/INFO/README.md`（若已存在則補強）
  - `docs/QA/DEBUG_V3/REPORTS/_TEMPLATE_DECISION_MEMO.md`（若已存在則補強）
- `docs/PROJECT_TODO.md` 登記並標記 `P2-0007` 完成
- `docs/Windsurf_ChatGPT_NOTES.md` 新增 `P2-0007` 小節（含 RAW/commit/handoff）

---

## 2. 要寫進 Playbook 的內容大綱（請照此結構）

建立 `docs/WORKFLOW/PHASE2/AI_PLAYBOOK_PHASE2.md`，至少包含以下章節（可簡短，但要可操作）：

### 2.1 Canonical 與同步邊界
- canonical repo/workdir 的定義（唯一真相）
- 非 canonical（Producer sandbox）只能交付：zip / patch / report；不得直接寫入 main

### 2.2 任務命名與產物路徑（引用 P2-0001 規則）
- Task ID：`P2-xxxx`
- Branch：`phase2/<P2-xxxx>-<slug>`
- Handoff：`docs/TEMP/TEMP_<YYYYMMDD>_<P2-xxxx>_<HEAD7>.zip`
- Reports：
  - debug/review：`docs/QA/DEBUG_V3/REPORTS/<P2-xxxx>/...`
  - advice/info：`docs/QA/DEBUG_V3/REPORTS/_ADVICE/...`、`docs/QA/DEBUG_V3/REPORTS/INFO/...`
  - decision memo：`docs/QA/DEBUG_V3/REPORTS/<P2-xxxx>/DECISION_<YYYYMMDD>_<short>.md`

### 2.3 外部 AI 路由矩陣（Routing Matrix）
- 何種任務要送誰（Gemini/Grok/Claude/ChatGPT）
- UI 暫緩下，UI 相關規則保留但標註「待啟用」

### 2.4 AI Queue（隊列）與 Budget Guard（費用守門）
> 先不用寫任何 API key；只寫「什麼時候用 API / 用多少 / 何時改用免費/訂閱工具」。

- **Queue**：一顆任務的固定節奏  
  1) machine self-check（本機檢查）  
  2) 產 TEMP zip（含 MANIFEST）  
  3) 送外部 reviewer（必要時才送）  
  4) 收 REPORT → 修正 → 再 self-check → 結案
- **Budget Guard**（建議硬規則，可寫成表格）：
  - 預設：不呼叫 API（先用訂閱/免 API 的 Claude Code / Gemini UI）
  - 僅在：高風險、解析/匯入、釋出前、或連續兩次無法自證時 → 才啟用 API reviewer
  - 每顆任務最多 N 次外部 API review（先寫 N=1 或 N=2，之後可調）

### 2.5 Decision Memo / Review Memo 規範
- Decision Memo 何時要寫（例如：被 mojibake 卡住、是否 allowlist、是否拆任務）
- 必填欄位：Date/Task/Context/Options(A/B/C)/Decision/Consequences/Next Step
- 使用模板：`docs/QA/DEBUG_V3/REPORTS/_TEMPLATE_DECISION_MEMO.md`

### 2.6 Encoding Guardrails（引用/連結既有規則，不要重貼）
- 本機必跑：`check:no-bom`、`check:utf8`、`check:mojibake:staged`（若已落地）
- 看到 mojibake 的處置：先隔離、不要覆寫 canonical docs
- Windows 工具禁忌（例如 PS5.1 不指定 encoding）

---

## 3. 需要更新/建立的 README（最少）

### 3.1 `docs/QA/DEBUG_V3/REPORTS/INFO/README.md`
- 說明 INFO 的用途：費用資訊、工具說明、常見問題（不屬於特定 task）
- 命名規則：`INFO_<Topic>_<YYYYMMDD>.md` 或採用小節追加（擇一寫死）

### 3.2 `_TEMPLATE_DECISION_MEMO.md`
- 放一份可複製的模板（含欄位與範例）

---

## 4. 測試/檢查（必跑）

在你的分支上依序執行：

- `npm run check:no-bom`
- `npm run check:utf8`
- `npm run check:mojibake:staged`（若存在；不存在則用目前專案規範的 mojibake 檢查指令）
- `npm test`
- `npm run build`

若任何檢查失敗：  
- **不得** 先把 legacy 檔大清理混進本任務  
- 請以 Decision Memo 記錄「被什麼 legacy 檔阻擋」並提出拆任務方案（交給 Strategic Commander 決策）

---

## 5. Commit / Handoff

1. `git add` 僅限本任務相關檔案（避免把未追蹤雜檔一起提交）
2. commit message：`P2-0007 rulebook + decision memo SOP`
3. push 分支
4. 產 handoff zip：`docs/TEMP/TEMP_<YYYYMMDD>_P2-0007_<HEAD7>.zip`
   - ZIP 內必含 `MANIFEST.json` 且 `source_commit == HEAD`
5. 更新 `docs/Windsurf_ChatGPT_NOTES.md` 記錄：branch、HEAD、handoff、檢查結果、RAW link

---

## 6. 回報格式（貼回來即可）

- Branch / HEAD
- 變更檔案清單
- 檢查結果（五項）
- Handoff zip 路徑 + MANIFEST.source_commit
