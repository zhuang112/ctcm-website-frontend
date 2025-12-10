# PROJECT_STATUS

> 給 ChatGPT × 實作 Agent（目前主要是 Codex）掌握現況：GitHub `main` 為單一真相。

---

## 總覽（2025-12-10）

- 爬蟲與 inventory：V1 完成。`tools/crawl/*` 可產出 `data/crawl/*.json/.csv`，包含站內 URL、docroot 檔案列表與差異報表。
- HTML→Markdown（含 sutra 規則）：V1 完成。`src/html/html-to-markdown.ts` 具 `/turn/sutra/` 專用規則，測試於 `tests/html/html-to-markdown.spec.ts`。
- Adapters：
  - teaching：`src/adapters/teaching-from-legacy.ts` V1，搭配 `src/types/anycontent-teaching.ts`，有測試。
  - news：`src/adapters/news-from-legacy.ts` V1，含日期/地點欄位 mapping，測試於 `tests/adapters/news-from-legacy.spec.ts`。
  - magazine：`src/adapters/magazine-from-legacy.ts` minimal V1，測試於 `tests/adapters/magazine-from-legacy.spec.ts`。
- Docs snapshot CLI（T-0007）：已完成並驗收，`npm run snapshot:docs -- --task ...` 由 `tools/docs-snapshot/make-docs-snapshot.ts` 產出 ZIP（不進 git）；log 見 `docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`。
- zh-TW→zh-CN pipeline：僅有規格 `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`，尚未實作。
- Legacy data root（T-0006）：等待完整舊站備份導入後再開工。
- WordPress importer / React 前端：尚未開始，僅有架構構想（見 `docs/COMPLETE_PROJECT_WORKFLOW.md` 等）。

---

## 模組/任務狀態詳述

### 爬蟲與 inventory（V1 完成）
- 主要檔案：`tools/crawl/crawl-ctworld.ts`、`tools/crawl/filesystem-inventory.ts`、`tools/crawl/diff-crawl-vs-files.ts`。
- 產出：`data/crawl/crawled-urls.*`、`all-files.*`、`missing-from-crawl.*`、`extra-from-crawl.*`。
- 使用：`npm run crawl:ctworld` / `npm run inventory:fs` / `npm run diff:crawl-vs-files`。

### HTML→Markdown + sutra 規則（V1 完成）
- 主要檔案：`src/html/html-to-markdown.ts`，sutra 專用規則收錄在 `docs/HTML_TO_MARKDOWN_RULES_V4.md`。
- 特點：收集 images/anchors/verses，處理 `<p class="word17-coffee">` 等 sutra 特例。
- 測試：`tests/html/html-to-markdown.spec.ts`。

### Teaching / News / Magazine adapters（皆有 V1）
- teaching：`src/adapters/teaching-from-legacy.ts`，將 verses 映射到 TeachingMeta；測試於 `tests/adapters/teaching-from-legacy.spec.ts`。
- news：`src/adapters/news-from-legacy.ts`，日期/地點 mapping V1；測試於 `tests/adapters/news-from-legacy.spec.ts`。
- magazine：`src/adapters/magazine-from-legacy.ts`，minimal mapping；測試於 `tests/adapters/magazine-from-legacy.spec.ts`。
- 型別：`src/types/anycontent-*.ts` 已定義 teaching/news/magazine contract。

### Docs snapshot CLI（已完成）
- 檔案：`tools/docs-snapshot/make-docs-snapshot.ts`。
- 指令：`npm run snapshot:docs -- --task T-XXXX`，輸出至 `snapshots/`（不納入 git）。
- 驗收紀錄：`docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`。

### zh-TW→zh-CN pipeline（尚未實作）
- 目前僅有規格檔：`docs/ZH_TW_TO_ZH_CN_PIPELINE.md`。
- 尚無程式碼與測試。

### Legacy data root / 舊站備份（T-0006，阻塞中）
- 等待取得完整舊站備份後，才會設定 `CTWORLD_LEGACY_ROOT` 並記錄實際結構。

### WordPress importer / React 前端（未開始）
- 僅有流程與架構描述，尚無實作或測試。

---

## 待辦焦點（節錄）
- T-0011 fix-corrupted-docs：修復亂碼 docs，統一 UTF-8。
- T-0012 sync-status-docs：持續對齊 PROJECT_TODO / PROJECT_STATUS 與實際進度。
- T-0006 legacy-data-root：待備份到位後展開。
- zh-TW→zh-CN pipeline：依規格實作 CLI 與測試。
- WordPress importer / React 前端：後續階段再啟動。
