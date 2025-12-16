# DEBUG_V3 系統總覽（T-0087）

> 目的：集中 V3 debug 流程的模板與產出，搭配 CI 自動產生摘要與 artifacts。

目錄結構：
- `TEMPLATES/`：BUG 報告、檢查清單、URL 佇列、golden 政策模板。
- `URL_QUEUE.md`：實際待驗收或待重現的網址清單。
- `GOLDENS/JSON`、`GOLDENS/HTML`：golden 輸入／輸出樣本（預留，請用 `.gitkeep` 保留資料夾）。
- `REPORTS/`：人工或 CI 產生的 debug 報告（初始放置 `.gitkeep`）。

使用方式（摘要）：
1. 新增案例時，先在 `URL_QUEUE.md` 補條目（含 unit/URL/狀態/備註）。
2. 需要正式報告時，複製 `TEMPLATES/BUG_REPORT_TEMPLATE.md` 或 `CHECKLIST_TEMPLATE.md`，填寫後存入 `REPORTS/`。
3. 若需要 golden 比對，依 `TEMPLATES/GOLDENS_POLICY.md` 說明將樣本放入 `GOLDENS/JSON` / `GOLDENS/HTML`。
4. CI 會在 `.github/workflows/ci-self-proof.yml` 執行 tests/build/checks，並產出 `ci_summary.md/json` 以及收集 `docs/QA/**`、`docs/terminal_logs/**` 作為 artifacts。

參考檔：
- `TEMPLATES/BUG_REPORT_TEMPLATE.md`
- `TEMPLATES/CHECKLIST_TEMPLATE.md`
- `TEMPLATES/URL_QUEUE_TEMPLATE.md`
- `TEMPLATES/GOLDENS_POLICY.md`
