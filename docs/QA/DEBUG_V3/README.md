# DEBUG_V3 系統總覽（T-0087）
> 目的：整理 V3 debug 流程模版，搭配 CI 自動產出部分 artifacts。

核心結構
- `TEMPLATES/`：BUG 回報與檢查模板、URL 排程與 golden 策略，外部 AI 互動用的 prompt 也放這裡。
- `URL_QUEUE.md`：實際待驗證或已驗證的網址清單。
- `GOLDENS/JSON` 與 `GOLDENS/HTML`：golden 匯入／匯出樣板位置，預設用 `.gitkeep` 保留資料夾。
- `REPORTS/`：人工或 CI 產出的 debug 報告，**一律為 Markdown (`.md`)，不要放 PDF/Docx/HTML**，外部 AI 產出的報告也放這裡。

使用方式（摘要）
1. 先在專案根目錄開工，必要時在 `URL_QUEUE.md` 補網址、unit/URL/狀態備註。
2. 需要正式回報時，複製 `TEMPLATES/BUG_REPORT_TEMPLATE.md` 或 `CHECKLIST_TEMPLATE.md`，填寫後存入 `REPORTS/`。
3. 若要維護 golden 比對，參考 `TEMPLATES/GOLDENS_POLICY.md` 說明，將樣板放進 `GOLDENS/JSON` / `GOLDENS/HTML`。
4. 若要請外部 AI 協助 debug / review，先準備好 versioned handoff zip（含 MANIFEST、task_id、source_commit），並使用 `TEMPLATES/EXTERNAL_AI_PROMPT_DEBUG_REVIEW_PACK.md` 或 `EXTERNAL_AI_PROMPT_BUGFIX_VALIDATION.md` 作為提示文字。
5. CI 會在 `.github/workflows/ci-self-proof.yml` 內跑 tests/build/checks，並輸出 `ci_summary.md/json`，同時收集 `docs/QA/**`、`docs/terminal_logs/**` 作為 artifacts。

可參考
- `TEMPLATES/BUG_REPORT_TEMPLATE.md`
- `TEMPLATES/CHECKLIST_TEMPLATE.md`
- `TEMPLATES/URL_QUEUE_TEMPLATE.md`
- `TEMPLATES/GOLDENS_POLICY.md`
- `TEMPLATES/EXTERNAL_AI_PROMPT_DEBUG_REVIEW_PACK.md`
- `TEMPLATES/EXTERNAL_AI_PROMPT_BUGFIX_VALIDATION.md`
