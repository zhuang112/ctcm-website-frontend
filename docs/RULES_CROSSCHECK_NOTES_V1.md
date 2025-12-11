# RULES_CROSSCHECK_NOTES_V1

> 任務：T-0047 規則文件一致性檢查（第一輪，筆記用，非正式規範）  
> 日期：2025-12-12  
> 參考文件（只讀）：workflow / schema / HTML→Markdown / zh-CN pipeline / TODO / NOTES / INSTR 系列

---

## 核心參考文件
- Workflow / 協作：`WORKFLOW_CHATGPT_GITHUB_AGENT.md`、`TOOLS_ROLES_AND_BOUNDARIES.md`、`SESSION_CHECKLIST.md`、`AI_COLLAB_SUMMARY.md`、`COMPLETE_PROJECT_WORKFLOW.md`、`PENDING_DECISIONS.md`
- Schema / 內容規則：`CONTENT_SCHEMA_V1.md`、`CONTENT_SCHEMA.md`
- HTML→Markdown：`HTML_TO_MARKDOWN_RULES_V4.md`
- zh-TW→zh-CN：`ZH_TW_TO_ZH_CN_PIPELINE.md`
- 任務與歷史：`PROJECT_TODO.md`、`Windsurf_ChatGPT_NOTES.md`（2025-12-10 之後的 T-0017～T-0046）
- INSTR 系統：`INSTR/README.md`、`INSTR/INSTR-TEMPLATE.md`、`INSTR/INSTR-T-0018-meta-instr-and-status-structure.md`

---

## Cross-check 主題整理

### 1) Workflow / 協作流程
- ✅ 一致重點：
  - 單一真相：GitHub main + notes；snapshot 只是備援（workflow 1.7/RAW、小節補充）。
  - 安全等級：code/tools/tests/data 任務需 `npm test` + `npm run build`；涉 zh-CN 要 `npm run check:zh-cn`；docs-only 可不跑，但需在 notes 說明。
  - 分工：使用者決策+轉貼、ChatGPT 設計/規則、實作 Agent（Codex）執行；回報走 notes + RAW。
  - INSTR 規則：列檔案清單、禁止 citation、長規格放 docs。
- ⚠️ 待統一/重複：
  - Workflow vs COMPLETE_PROJECT_WORKFLOW：前者偏日常協作，後者偏 roadmap，有些流程（如 snapshot、分支）描述重複，可考慮集中於 workflow。
  - SESSION_CHECKLIST 的收工條目（test/build/check:zh-cn）與 workflow 安全小節，語氣略不同，可在下輪同步字眼。
- 📌 建議未來 T（候選）：
  - `T-00xx consolidate-workflow-docs`: 把流程/安全/RAW/snapshot 相關說明集中到 workflow + checklist，減少重複。

### 2) CONTENT_SCHEMA / AnyContent V1
- ✅ 一致重點：
  - V1 schema 主要在 `CONTENT_SCHEMA_V1.md`；`CONTENT_SCHEMA.md` 指向 V1 草稿。
  - teaching/news/magazine 基本欄位、`has_unclassified_content`/`unclassified_notes` 已在 schema + adapter/test 實作（news/teaching/magazine v1）。
  - Magazine meta issue/pub_date 已在 schema V1 + adapter（T-0045）對齊。
- ⚠️ 待統一/缺口：
  - `CONTENT_SCHEMA.md` 仍帶有部分舊描述（少量）；需確保後續只維護 V1 或明確標註版本。
  - SEO、多語（multilingual）尚未實作，文件提到但缺少實際任務。
- 📌 建議未來 T（候選）：
  - `T-00xx schema-v1-single-source`: 明確指定 `CONTENT_SCHEMA_V1.md` 為唯一 schema 文件，舊 `CONTENT_SCHEMA.md` 精簡成導覽/版本說明。
  - `T-00xx schema-seo-multilingual-plan`: 針對 SEO / multilingual 欄位補規格與實作計畫。

### 3) HTML→Markdown 規則
- ✅ 一致重點：
  - V4 (`HTML_TO_MARKDOWN_RULES_V4.md`) 為現行主檔；包含圖片、段落、未知內容 fallback（搭配 unclassified flags）。
  - Adapter 遇到未知內容：保留 `body_markdown`，必要時 set `meta.has_unclassified_content` + `meta.unclassified_notes`。
  - compare 頁支援 unclassified badge/filter（已在 T-0036 等說明）。
- ⚠️ 待清理：
  - 舊版 V2/V3 若仍存在，可標註歷史參考或移到 archive，避免與 V4 混淆。
  - V4 提到的某些特殊樣板（如 index_page、自訂 class）在 adapter 中未完全覆蓋，需要對照實作狀態。
- 📌 建議未來 T（候選）：
  - `T-00xx clean-up-old-html-to-md-v2v3`: 將 V2/V3 標註為歷史或移至 archive。
  - `T-00xx html-to-md-gap-review`: 梳理 V4 規則 vs 實作落差（特殊列表/樣板），列出需補強的 adapter/test。

### 4) zh-TW → zh-CN pipeline
- ✅ 一致重點：
  - 白名單欄位與 pipeline 設計在 `ZH_TW_TO_ZH_CN_PIPELINE.md`；健康檢查 CLI (`npm run check:zh-cn`) 及其檢查項目已寫入 workflow/checklist。
  - T-0038/0039 描述 health check：檢查成對、基本欄位（post_type/slug/old_url/language）、可轉換欄位存在性。
- ⚠️ 待補：
  - Pipeline 規格 vs CLI 實作：部分欄位（例如 SEO/部分 meta）尚未涵蓋於健康檢查報表；需再對齊白名單。
  - zh-CN 產出/報表格式仍偏簡單，可考慮匯總/分類 WARN、輸出摘要。
- 📌 建議未來 T（候選）：
  - `T-00xx extend-zh-cn-health-check`: 擴充 health check 欄位（含 SEO/meta），提供更完整報表。
  - `T-00xx pipeline-impl-progress`: 盤點 pipeline 規格 vs 已實作（transform/CLI），列出缺口。

### 5) INSTR 系統
- ✅ 一致重點：
  - 命名規則、檔案位置、模板（INSTR-TEMPLATE）、meta-instr 結構已在 INSTR/README + T-0018 說明。
  - INSTR 要列「給 ChatGPT review 的檔案清單」、避免 citation、長規格放 docs。
- ⚠️ 重複/需提醒：
  - workflow 也有撰寫 INSTR 的注意事項；與 INSTR/README 內容部分重疊，可考慮集中。
- 📌 建議未來 T（候選）：
  - `T-00xx align-instr-guidelines`: 合併/交叉引用 workflow 與 INSTR/README，讓撰寫規則單一來源。

---

## 建議單一真相文件
- Workflow / 協作流程 → `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`（checklist/其他檔指向此）
- AnyContent V1 schema → `docs/CONTENT_SCHEMA_V1.md`（`CONTENT_SCHEMA.md` 作為導覽/版本說明）
- HTML→Markdown 規則 → `docs/HTML_TO_MARKDOWN_RULES_V4.md`
- zh-TW→zh-CN pipeline → `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
- INSTR 規則 → `docs/INSTR/README.md` + `docs/INSTR/INSTR-TEMPLATE.md`
- 任務歷史 / 真實狀態 → `docs/Windsurf_ChatGPT_NOTES.md`
- 任務清單 → `docs/PROJECT_TODO.md`

---

## 候選未來 T 題目（草案）
- `T-00xx consolidate-workflow-docs`: 整併 workflow / checklist / COMPLETE_PROJECT_WORKFLOW 重複段落，指向單一檔案。
- `T-00xx schema-v1-single-source`: 明確指定 CONTENT_SCHEMA_V1 為唯一 schema，舊檔退居導覽。
- `T-00xx clean-up-old-html-to-md-v2v3`: 將舊版 HTML→MD 規則標註歷史或移至 archive。
- `T-00xx html-to-md-gap-review`: 梳理 V4 規則 vs adapter/test 實作的缺口。
- `T-00xx extend-zh-cn-health-check`: 擴充 health check 報表與檢查欄位（含 SEO/meta）。
- `T-00xx align-instr-guidelines`: 將 INSTR 撰寫規則集中為單一來源（workflow vs INSTR/README）。
