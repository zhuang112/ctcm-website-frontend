# AI_PLAYBOOK_PHASE2

> Phase 2 單一真相的 AI 協作規則（routing / budget / reports / handoff）。
> Canonical repo/workdir：F:\\ctcm-website-frontend_phase2（僅此一份）；分支一律 phase2/<task>。

## 1. Canonical 與單一真相
- 只使用 canonical repo：F:\\ctcm-website-frontend_phase2，禁止在其他 clone 落地檔案或手動套 patch。
- 分支命名：phase2/<task_id>-<slug>，Task ID 以 P2-xxxx 為主。
- 真相來源：GitHub main + 本 repo 的 docs（WORKFLOW / TODO / NOTES / REPORTS）。snapshot/zip 只是備援，不是主真相。

## 2. 命名規則（取自 P2-0001）
- Task ID：P2-xxxx；如沿用舊 T-xxxx，需在文件註明對應。
- Branch：phase2/<P2-id>-<slug>。
- Handoff zip：docs/TEMP/TEMP_<YYYYMMDD>_<P2-id>_<HEAD7>.zip，MANIFEST.source_commit == HEAD。
- Reports：
  - Debug/Review：docs/QA/DEBUG_V3/REPORTS/<P2-id>/...
  - Advice/Info：docs/QA/DEBUG_V3/REPORTS/_ADVICE/...、docs/QA/DEBUG_V3/REPORTS/INFO/...
  - Decision memo：docs/QA/DEBUG_V3/REPORTS/<P2-id>/DECISION_<YYYYMMDD>_<short>.md

## 3. AI Routing Matrix（高層摘要）
- UI / 前端：預設 Gemini + Grok + ChatGPT，Codex 負責落地與自證。
- Importer / Crawler / Pipeline：Grok + ChatGPT，必要時加 Claude（推理/程式檢查）。
- Docs-only：可只用 Codex；高風險可請 ChatGPT 做二次檢查。
- 所有外部 reviewer 必須在 notes / reports 標示（誰、讀了哪份檔、結論）。

## 4. AI Queue + Budget Guard
- Queue 標準流程（每顆 P2 任務）：
  1) Machine self-check：
pm run check:no-bom、
pm run check:utf8、
pm run check:mojibake:staged、
pm test、
pm run build（依任務適用）。
  2) 產 TEMP zip（含 MANIFEST.source_commit==HEAD）。
  3) 對外 reviewer：附 prompt + 交接包路徑，禁止外泄 key/cred。
  4) 收到回饋後修正並再跑 self-check。
- Budget guard：
  - 不寫入任何 API key；僅描述「要用哪個 AI、預估次數/費用」。
  - 若需多次呼叫，同一任務預設 reviewer API <= 2 輪；超過需在 notes 註明原因。

## 5. Decision / Review / Info 檔案歸位
- Decision memo（跨任務或單任務決策）：docs/QA/DEBUG_V3/REPORTS/<P2-id>/DECISION_<YYYYMMDD>_<short>.md，模板：docs/QA/DEBUG_V3/REPORTS/_TEMPLATE_DECISION_MEMO.md。
- Review/Debug/Advice 報告：docs/QA/DEBUG_V3/REPORTS/<P2-id>/... 或 _ADVICE/...；跨任務共通資訊放 REPORTS/INFO/。
- INFO 命名：INFO_<Topic>_<YYYYMMDD>.md，內文簡述來源、適用範圍、是否可公開。

## 6. Encoding / Mojibake Guardrails（沿用 P2-0006）
- 自證：
pm run check:no-bom、
pm run check:utf8、
pm run check:mojibake:staged（pre-commit 亦採 staged）。
- 請勿在非 UTF-8 編輯器中開檔（特別是 PS 5.1 預設編碼）；出現 U+FFFD 或過多 ? 視為問題。
- Legacy mojibake 檔案留待專案清理任務，不要在其他任務順手混入。

## 7. Workflow 入口
- 本檔為 Phase 2 Rulebook，所有 AI 協作/報告/決策的規範以此為準。
- WORKFLOW_CHATGPT_GITHUB_AGENT.md 內的 Phase 2 區段僅做索引，若有衝突以本檔為主。
