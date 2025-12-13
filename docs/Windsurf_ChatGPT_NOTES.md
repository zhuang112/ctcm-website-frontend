# ChatGPT × 實作 Agent 協作筆記

> 本檔案給「未來接手的 ChatGPT / AI 助手」閱讀，說明目前專案狀態與已完成的修改。
>
> 目前主要實作 Agent：Codex（在本機 repo 直接修改程式與 docs）。本檔名暫為 `Windsurf_ChatGPT_NOTES.md`，未來若調整命名可在對應 T 任務中更新本說明。
>
> 維護方式建議：每一個明確的開發任務（feature / bugfix）新增一個小節，簡要說明需求與已改動檔案。

---

## 2025-12-10 默契 / 操作習慣

- snapshot CLI：`npm run snapshot:docs -- --task T-0007`，只打包本機 `docs/*.md`、`docs/terminal_logs/*.txt` 到 `snapshots/`，不進 git；最新驗收已於 2025-12-10 完成。
- 實作 Agent 角色：目前實作由 Codex 執行（取代原本固定稱呼 Windsurf）；使用者只需在 ChatGPT 與實作 Agent 間傳遞指令與回報。
- 編碼：docs 檔案維持 UTF-8（含 BOM 可接受），若再遇亂碼優先用 UTF-8 讀寫。
- 簡化 TODO 記錄：任務條目以「狀態、目標、驗收」為主，避免過長的實作範圍描述；狀態欄位含日期與誰驗證。
- 若開新對話，先看 `docs/PROJECT_TODO.md` 與本檔，快速對齊任務狀態與約定。
- full access / sandbox 約定：若 IDE/Agent 已開 full access（或 auto-approve），仍僅能在 `ctcm-website-frontend/` 下操作；禁止破壞性指令（如 `rm -rf /`、`rm -rf ..`）；所有變更需照 workflow 1.9、記錄在 notes 並附 RAW 連結。
- notes 記錄格式（每個 T 任務一個小節）：
  - 說明任務標題、日期、需求摘要。
  - 列出更新檔案與測試狀態，紀錄最後 commit hash。
- 追加「變更檔案（含 RAW 連結）」區塊，列出本次所有異動/新增檔案與 RAW URL。
- ChatGPT → Agent code block 約定：code block 中不得出現 citation / content reference（例如 `::contentReference[...]`、`oaicite:0`），如需引用請在 code block 外以文字描述。

## 2025-12-10 任務：T-0011 / T-0012 初始化

- 在 `docs/PROJECT_TODO.md` 增補新的任務條目：
  - `T-0011 fix-corrupted-docs`：修復亂碼 docs、統一 UTF-8。
  - `T-0012 sync-status-docs`：對齊 PROJECT_TODO / PROJECT_STATUS 與實際進度。
- 目前僅新增 TODO 條目，未開始實作內容。commit: a423ba4

## 2025-12-10 任務：T-0012 sync-status-docs（執行中）

- 更新檔案：
  - `docs/PROJECT_TODO.md`：補齊教學任務狀態（v1 已完成）、T-0005 狀態行（news meta 日期/地點 mapping v1），重申 T-0006 blocked、T-0010 ?。
  - `docs/PROJECT_STATUS.md`：重寫總覽，對齊目前實作（crawl、HTML→Markdown + sutra、teaching/news/magazine adapters、docs snapshot CLI、zh-TW→zh-CN 未實作、legacy data root 待備份、WP/React 未開始）。
- 測試：僅文檔更新，未跑額外測試。
- commit: 86f2021

## 2025-12-11 任務：T-0011 fix-corrupted-docs（PROJECT_STATUS 重寫）

- 更新檔案：`docs/PROJECT_STATUS.md` 完整以 UTF-8 新內容覆蓋，移除亂碼。
- 重點：依 2025-12-10 版本，整理進度總覽、各模組狀態（crawl/inventory、HTML→Markdown + sutra、teaching/news/magazine adapters、docs snapshot CLI、zh-TW→zh-CN 未實作、legacy data root blocked、WP/React 未開始）。
- 測試：僅文檔更新，無額外測試。
- commit: 9329d58

## 2025-12-11 任務：workflow 新增 GitHub RAW 連結規則

- 更新檔案：`docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`，新增「1.7 GitHub RAW 連結規則（給 ChatGPT 用）」。
- 重點：定義 `raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/` 為 RAW base，說明 ChatGPT 讀取方式與失敗時回報原則。
- 測試：僅文檔更新，無額外測試。
- commit: ccfcbad

## 2025-12-12 任務：T-0011 fix-corrupted-docs（其他亂碼 docs 重寫）

- 更新檔案（整檔覆蓋，UTF-8 正常可讀）：
  - `docs/AI_COLLAB_SUMMARY.md`：協作模式總結（角色、流程、真相來源）。
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`：精簡版完整流程與現況。
  - `docs/PENDING_DECISIONS.md`：未決策清單（pipeline、WP 匯入、前端架構等）。
  - `docs/SESSION_CHECKLIST.md`：乾淨工作小抄。
  - `docs/TOOLS_ROLES_AND_BOUNDARIES.md`：角色與邊界重寫。
- 測試：僅文檔更新，無額外測試。
- commit: 5777bf6
  - 本次補充 workflow 溝通格式與 notes RAW 規則，commit: eb92dde
變更檔案（含 RAW 連結）：

- docs/AI_COLLAB_SUMMARY.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/AI_COLLAB_SUMMARY.md

- docs/COMPLETE_PROJECT_WORKFLOW.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/COMPLETE_PROJECT_WORKFLOW.md

- docs/PENDING_DECISIONS.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PENDING_DECISIONS.md

- docs/SESSION_CHECKLIST.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/SESSION_CHECKLIST.md

- docs/TOOLS_ROLES_AND_BOUNDARIES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/TOOLS_ROLES_AND_BOUNDARIES.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

> 參考 RAW 連結：
>
> - docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
>   RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md
>
> - docs/Windsurf_ChatGPT_NOTES.md  
>   RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0013 zh-tw-to-zh-cn-pipeline-design（docs first）

- 更新檔案：
  - `docs/PROJECT_TODO.md`：將 zh-TW→zh-CN pipeline 條目改為 umbrella，新增 T-0013 並標記為完成。
  - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`：補齊欄位白名單、資料來源/輸出目錄假設、CLI 規格、繁簡轉換策略（僅 docs）。
- 測試：僅文檔更新，無額外測試。
- commit: 5e7d235
變更檔案（含 RAW 連結）：

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/ZH_TW_TO_ZH_CN_PIPELINE.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/ZH_TW_TO_ZH_CN_PIPELINE.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

> 參考 RAW 連結：
>
> - docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
>   RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md
>
> - docs/Windsurf_ChatGPT_NOTES.md  
>   RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0014 zh-tw-to-zh-cn-pipeline-core-and-cli-skeleton

- 更新檔案：
  - `package.json`：新增 `convert:zh-cn` 腳本與 opencc-js 依賴。
  - `src/i18n/zh-tw-to-zh-cn.ts`：`convertToZhCn` utility（opencc-js）。
  - `tests/i18n/zh-tw-to-zh-cn.spec.ts`：基本轉換測試。
  - `tools/convert/generate-zh-cn-from-zh-tw.ts`：CLI skeleton，支援 `--input` / `--output` / `--dry-run`，可寫出 zh-cn JSON。
  - `docs/PROJECT_TODO.md`：新增 T-0014 條目並標記完成。
  - `docs/Windsurf_ChatGPT_NOTES.md`：記錄本次任務與 RAW 連結。
- 測試：新增單元測試（convertToZhCn）；未跑整套，僅 skeleton。
- commit: fde0a7a
變更檔案（含 RAW 連結）：

- package.json  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/package.json

- src/i18n/zh-tw-to-zh-cn.ts  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/i18n/zh-tw-to-zh-cn.ts

- tests/i18n/zh-tw-to-zh-cn.spec.ts  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/tests/i18n/zh-tw-to-zh-cn.spec.ts

- tools/convert/generate-zh-cn-from-zh-tw.ts  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/tools/convert/generate-zh-cn-from-zh-tw.ts

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0015 zh-tw-to-zh-cn-pipeline-write-json

- 更新檔案：
  - `src/i18n/zh-tw-to-zh-cn-pipeline.ts`：`transformAnycontentZhTwToZhCn` 實作（白名單轉換、language=zh-cn）。
  - `tools/convert/generate-zh-cn-from-zh-tw.ts`：CLI 寫檔（dry-run / write 支援）。
- `tests/i18n/zh-tw-to-zh-cn-pipeline.spec.ts`：覆蓋 transform。
- `docs/PROJECT_TODO.md`：新增 T-0015 條目並標記完成。
- `docs/Windsurf_ChatGPT_NOTES.md`：記錄本次任務與 RAW。
- 測試：`npx vitest tests/i18n/zh-tw-to-zh-cn-pipeline.spec.ts`
- commit: 9b146f4
變更檔案（含 RAW 連結）：

- src/i18n/zh-tw-to-zh-cn-pipeline.ts  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/i18n/zh-tw-to-zh-cn-pipeline.ts

- tools/convert/generate-zh-cn-from-zh-tw.ts  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/tools/convert/generate-zh-cn-from-zh-tw.ts

- tests/i18n/zh-tw-to-zh-cn-pipeline.spec.ts  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/tests/i18n/zh-tw-to-zh-cn-pipeline.spec.ts

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0016 zh-cn-health-check-tool（登記 TODO）

- 更新檔案：
  - `docs/PROJECT_TODO.md`：新增 T-0016 條目（zh-TW/zh-CN JSON 健康檢查 CLI）。
  - `docs/Windsurf_ChatGPT_NOTES.md`：記錄新增 TODO 與 RAW。
- 測試：純文檔更新，未執行程式。
- commit: (pending push)
變更檔案（含 RAW 連結）：

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0017 html-to-markdown-rules-cleanup

- 更新檔案：
  - `docs/HTML_TO_MARKDOWN_RULES_V4.md`：重寫共用規則、圖片策略、各 post_type 注意事項與驗收檢查。
  - `docs/PROJECT_TODO.md`：新增 T-0017 條目並標記完成。
  - `docs/Windsurf_ChatGPT_NOTES.md`：記錄任務摘要與 RAW 連結。
- 測試：純文檔更新，未執行程式。
- commits: 9b669a4（初版重寫）、c3e4c3d（結構調整與後續微調）
變更檔案（含 RAW 連結）：

- docs/HTML_TO_MARKDOWN_RULES_V4.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/HTML_TO_MARKDOWN_RULES_V4.md

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0018 meta-instr-and-status-structure

- 更新檔案：
  - 新增 `docs/INSTR/` 目錄並搬移 INSTR 檔，統一命名規則 `INSTR-T-xxxx-<slug>.md`（跨任務通用以 0000 表示）。
  - 新增 `docs/INSTR/README.md`（用途、命名規則、現有列表）與 `docs/INSTR/INSTR-TEMPLATE.md`（新增 INSTR 的模板）。
  - 更新 `docs/PROJECT_TODO.md`：新增 T-0018 條目並標記完成。
  - 更新 `docs/Windsurf_ChatGPT_NOTES.md`：記錄本次 INSTR 整理與 RAW 連結。
- 測試：純文檔更新，未執行程式。
- commit: c3e4c3d
變更檔案（含 RAW 連結）：

- docs/INSTR/README.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/INSTR/README.md

- docs/INSTR/INSTR-TEMPLATE.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/INSTR/INSTR-TEMPLATE.md

- docs/INSTR/INSTR-T-0000-fix-communication-rules-no-citations.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/INSTR/INSTR-T-0000-fix-communication-rules-no-citations.md

- docs/INSTR/INSTR-T-0000-update-workflow-full-access-rules.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/INSTR/INSTR-T-0000-update-workflow-full-access-rules.md

- docs/INSTR/INSTR-T-0016-zh-cn-health-check-tool-todo.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/INSTR/INSTR-T-0016-zh-cn-health-check-tool-todo.md

- docs/INSTR/INSTR-T-0017-html-to-markdown-rules-cleanup.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/INSTR/INSTR-T-0017-html-to-markdown-rules-cleanup.md

- docs/INSTR/INSTR-T-0018-meta-instr-and-status-structure.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/INSTR/INSTR-T-0018-meta-instr-and-status-structure.md

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0019 enforce-utf8-encoding

- 更新檔案：
  - 新增 `.editorconfig`、`.gitattributes`，強制文字檔 UTF-8 + LF。
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`：新增編碼/行尾提醒。
  - `docs/PROJECT_TODO.md`：新增 T-0019 條目並標記完成。
  - `docs/Windsurf_ChatGPT_NOTES.md`：記錄本次任務與 RAW 連結。
- 測試：純文檔/設定更新，未執行程式。
- commit: 95d9a13
變更檔案（含 RAW 連結）：

- .editorconfig  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/.editorconfig

- .gitattributes  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/.gitattributes

- docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0044 cleanup-project_todo-header-and-structure

- 目的：整理 `docs/PROJECT_TODO.md` 檔頭亂碼與結構，維持各 T 條目有標題與狀態行、格式較一致。
- 內容：
  - 檔頭改寫為簡短說明（GitHub/main 為真相、細節看 notes/INSTR）。
  - 清掉重複的 T-0013 區塊、補上缺失的狀態行（以「請參考 notes」標示），並保持原有文字不改寫。
- 測試 / 建置：本次僅 docs 更新，未執行 `npm test` / `npm run build` / `npm run check:zh-cn`。
- commit: 5e7684b

變更檔案（含 RAW 連結）：

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0045 magazine-meta-from-legacy-v1

- 目的：讓 magazine AnyContent 的期別與出版日期 meta 可由 legacy HTML 自動解析（v1）。
- 主要變更：
  - `src/adapters/magazine-from-legacy.ts`：新增 `parseMagazineMetaFromHtml`，解析「日期：YYYY-MM-DD　期別：第 N 期」，填入 `ct_magazine_issue(_raw)`、`ct_magazine_pub_date(_raw)`。
  - `src/types/anycontent-magazine.ts`：補齊上述欄位型別（issue/pub_date），保留既有 legacy 欄位。
  - `docs/CONTENT_SCHEMA_V1.md`：magazine meta 加入 issue/pub_date 欄位說明（v1）。
  - `tests/adapters/magazine-from-legacy.spec.ts`：新增 issue/date 測試案例並調整 skeleton 期望。
- 測試 / 建置：
  - `npm test`（通過）
  - `npm run build`（通過）
- commit: 8c74c29

變更檔案（含 RAW 連結）：

- src/adapters/magazine-from-legacy.ts  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/adapters/magazine-from-legacy.ts
- src/types/anycontent-magazine.ts  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/types/anycontent-magazine.ts
- tests/adapters/magazine-from-legacy.spec.ts  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/tests/adapters/magazine-from-legacy.spec.ts
- docs/CONTENT_SCHEMA_V1.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/CONTENT_SCHEMA_V1.md
- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0046 fix-instr-encoding-and-snapshot-rules

- 目的：確認 INSTR/README/PROJECT_TODO 為 UTF-8、補充 workflow 中的 docs snapshot 規則。
- 主要變更：
  - `docs/INSTR/INSTR-T-0018-meta-instr-and-status-structure.md`：確認內容正常 UTF-8。
  - `docs/INSTR/README.md`：確認內容正常 UTF-8。
  - `docs/PROJECT_TODO.md`：重寫為可讀的 UTF-8 版本，並新增 T-0046 條目。
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`：補充 docs snapshot ZIP 的定位（備援、非單一真相）、檔名建議（含 T 編號＋日期）、RAW 優先順序。
- 測試 / 建置：本次僅 docs 更新，未執行 `npm test` / `npm run build` / `npm run check:zh-cn`。
- commit: 0ece285

變更檔案（含 RAW 連結）：

- docs/INSTR/INSTR-T-0018-meta-instr-and-status-structure.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/INSTR/INSTR-T-0018-meta-instr-and-status-structure.md
- docs/INSTR/README.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/INSTR/README.md
- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md
- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0047 docs-rules-consistency-review-phase-1

- 目的：檢查規則文件一致性，整理 cross-check 筆記（docs-only）。
- 主要變更：
  - 新增 `docs/RULES_CROSSCHECK_NOTES_V1.md`：記錄 workflow/schema/HTML→MD/zh-CN pipeline/INSTR 等主題的交叉檢視，列出單一真相文件與未來候選 T。
  - 不修改其他規則檔，僅筆記用途。
- 測試 / 建置：本次僅 docs 筆記，未執行 `npm test` / `npm run build` / `npm run check:zh-cn`。
- commit: 3f0e602

變更檔案（含 RAW 連結）：

- docs/RULES_CROSSCHECK_NOTES_V1.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/RULES_CROSSCHECK_NOTES_V1.md
- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0048 consolidate-workflow-docs-single-source

- 目的：將協作流程相關文件統一以 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 為單一真相，其餘檔案改為摘要/導覽並加註提醒。
- 主要變更：
  - 在 TOOLS_ROLES_AND_BOUNDARIES / SESSION_CHECKLIST / AI_COLLAB_SUMMARY / COMPLETE_PROJECT_WORKFLOW / PENDING_DECISIONS 檔頭加入提醒，指向 workflow 單一真相。
  - 在 workflow 檔頭明示「本檔為單一真相」。
  - 未改動程式碼，僅整理說明文並標示歷史/摘要角色。
- 測試 / 建置：docs-only，未執行 `npm test` / `npm run build` / `npm run check:zh-cn`。
- commit: 43bc794

變更檔案（含 RAW 連結）：
- docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md
- docs/TOOLS_ROLES_AND_BOUNDARIES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/TOOLS_ROLES_AND_BOUNDARIES.md
- docs/SESSION_CHECKLIST.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/SESSION_CHECKLIST.md
- docs/AI_COLLAB_SUMMARY.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/AI_COLLAB_SUMMARY.md
- docs/COMPLETE_PROJECT_WORKFLOW.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/COMPLETE_PROJECT_WORKFLOW.md
- docs/PENDING_DECISIONS.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PENDING_DECISIONS.md
- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0049 html-to-md-gap-review

- 目的：盤點 `HTML_TO_MARKDOWN_RULES_V4.md` 與實作（html-to-markdown + adapters + tests）之間的落差，僅寫筆記、不改程式。
- 主要變更：
  - `docs/RULES_CROSSCHECK_NOTES_V1.md`：新增 HTML→Markdown 落差小節（列出已對齊 / 待補 / 未來 T 建議）。
  - `docs/PROJECT_TODO.md`：新增並標記完成 T-0049。
- 測試 / 建置：本次 docs-only，未執行 `npm test` / `npm run build` / `npm run check:zh-cn`。
- commit: 0533f08

變更檔案（含 RAW 連結）：
- docs/RULES_CROSSCHECK_NOTES_V1.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/RULES_CROSSCHECK_NOTES_V1.md
- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0050 html-image-gallery-rules-v1-design

- 目的：整理 HTML→Markdown / AnyContent schema 的圖片、圖說、gallery 規則（docs-only，不改程式）。
- 主要變更：
  - `docs/HTML_TO_MARKDOWN_RULES_V4.md`：新增圖片/圖說/gallery 專章，標示已實作 vs 未實作，按 post_type 補充提醒。
  - `docs/CONTENT_SCHEMA_V1.md`：補齊 `featured_image` / `featured_image_caption` / `gallery_items` 定義與轉換備註。
  - `docs/RULES_CROSSCHECK_NOTES_V1.md`：更新圖片相關落差與未來 T 建議（鏈結 T-0051~T-0053 候選）。
  - `docs/PROJECT_TODO.md`：新增並標記完成 T-0050。
- 測試 / 建置：本次 docs-only，未執行 `npm test` / `npm run build` / `npm run check:zh-cn`。
- commit: 6dfda93

變更檔案（含 RAW 連結）：
- docs/HTML_TO_MARKDOWN_RULES_V4.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/HTML_TO_MARKDOWN_RULES_V4.md
- docs/CONTENT_SCHEMA_V1.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/CONTENT_SCHEMA_V1.md
- docs/RULES_CROSSCHECK_NOTES_V1.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/RULES_CROSSCHECK_NOTES_V1.md
- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
---


## 2025-12-12 臨時檢查：全套 Vitest

- 執行：`npm test`（Vitest 全套）。
- 結果：全部通過（6 檔測試、12 個測試案例），無新增失敗。
- 其他：執行前執行 `npm install` 安裝依賴，未改動程式或 docs。

## 2025-12-12 任務：T-0020 teaching-end-to-end-sample（teaching HTML → zh-TW AnyContent → zh-CN）

- 範例來源：`data/legacy-teaching/sample-001.html`（示範教學頁，含 sutra 偈語、列表）。
- 轉換流程：
  - zh-TW：`npx tsx tools/convert/teaching-html-to-anycontent.ts --in data/legacy-teaching/sample-001.html --external-id teaching_sample_001 --language zh-tw --out data/anycontent/zh-tw/teaching/sample-001.json`
  - zh-CN：`npx tsx tools/convert/generate-zh-cn-from-zh-tw.ts --input data/anycontent/zh-tw/teaching --output data/anycontent/zh-cn/teaching`
- 人工檢查摘要：
  - zh-TW JSON：post_type=teaching、language=zh-tw，偈語轉成 blockquote，meta `ct_has_dharma_verse=yes`、`ct_verse_block_markdown` 兩行 `>`。
  - zh-CN JSON：language=zh-cn，內文與偈語皆轉為簡體，結構與 zh-TW 對齊。
- 變更檔案（含 RAW 連結）：

  - data/legacy-teaching/sample-001.html  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/legacy-teaching/sample-001.html

  - data/anycontent/zh-tw/teaching/sample-001.json  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-tw/teaching/sample-001.json

  - data/anycontent/zh-cn/teaching/sample-001.json  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-cn/teaching/sample-001.json

  - docs/Windsurf_ChatGPT_NOTES.md  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0022 update-workflow-raw-fallback

- 在 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 新增「RAW 無法開啟時的本機上傳 fallback」規則：
  - ChatGPT 若打不開 RAW / 檔案內容，須明確告知是哪個檔案或 URL。
  - 請使用者在對話中直接上傳檔案，之後以上傳檔案為準，不得猜測。
  - 若 RAW 與上傳版本不同，以使用者確認的最新版本為準，並在 notes 記錄。
- 目的：確保後續判斷都基於可讀檔案，避免因工具限制誤判。
- 變更檔案（含 RAW 連結）：

  - docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md

  - docs/Windsurf_ChatGPT_NOTES.md  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0023 cleanup-working-tree-simple

- 目的：依使用者授權，將當前 working tree 的「所有已修改/已刪除的 tracked 檔案」一次打包 commit，讓 main 回到乾淨狀態；未追蹤檔（docs/todo、snapshots ZIP/TAR 等）維持 untracked、不加入本次 commit。
- 變更範圍（皆為既有 tracked 檔案的累積修改）：
  - 設定/Workflow：`.editorconfig`、`.gitattributes`、`.gitignore`、`.github/workflows/deploy-pages.yml`、`README_CTWorld_AI_WORKFLOW.md`、`docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`、`docs/INSTR/...`。
  - 文件/notes：`docs/PROJECT_TODO.md`、`docs/Windsurf_ChatGPT_NOTES.md`、`docs/terminal_logs/*` 等。
  - 程式碼/型別：`src/adapters/*`、`src/html/*`、`src/types/*`、`tools/convert/teaching-html-to-anycontent.ts`。
  - 測試：`tests/adapters/*`、`tests/html/html-to-markdown.spec.ts`。
  - 資料：`data/crawl/*.csv`。
  - 依賴鎖定：`package-lock.json`。
- 測試：`npm test` 全部通過（12/12）。
- 變更檔案（含 RAW 連結）：

  - docs/Windsurf_ChatGPT_NOTES.md  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

  - docs/PROJECT_TODO.md  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

  - docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md

  - .editorconfig  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/.editorconfig

  - .gitattributes  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/.gitattributes

  - package-lock.json  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/package-lock.json

  - （其餘大量 tracked 檔案修改，請以本次 commit diff 為準）

## 2025-12-12 任務：T-0025 legacy-new-visual-compare-tool（僅登記 TODO）

- 說明：
  - 在 `docs/PROJECT_TODO.md` 更新 T-0025 規格：做成「單獨一頁」的小工具，左右兩欄＋ index 總表；左欄顯示 legacy URL/HTML，右欄可切換「新頁 render / AnyContent JSON 可讀版 / WP 資料摘要」，index 點選一列可同步切換三者。目標用於檢查 mapping 與資料欄位正確性（先支援 teaching 或 news，再擴充）。
  - 本次僅更新 PROJECT_TODO，未實作任何程式或 CLI。

變更檔案（含 RAW 連結）：

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0026 implement-visual-compare-tool-v1

- 目標：依 T-0025 構想實作 v1 dev 工具頁 `/dev/compare`，先支援 teaching sample-001，方便比對 legacy / AnyContent / 新站。
- 內容：
  - 新增 index 資料：`data/compare/index.json`（含 teaching-sample-001 的 legacy 路徑、AnyContent 路徑、預留新站/WordPress 欄位）。
  - 新增 React dev page：`src/dev/VisualComparePage.tsx`，提供：
    - 上方 index 總表（點選同步左右欄）。
    - 左欄：legacy 本機 HTML 預覽或 legacy URL（iframe + 連結）。
    - 右欄：tabs 切換 zh-TW JSON / zh-CN JSON / New page / WordPress（後兩者暫 placeholder）。
  - 入口：`src/main.tsx` 判斷 `/dev/compare` 時掛載 `VisualComparePage`，其餘路徑維持原 App。
- 測試：`npm run build` 嘗試編譯，失敗（既有問題：opencc-js 缺型別宣告，TS7016，尚未處理）。未另外執行其他測試。

變更檔案（含 RAW 連結）：

- data/compare/index.json  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/compare/index.json

- src/dev/VisualComparePage.tsx  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/dev/VisualComparePage.tsx

- src/main.tsx  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/main.tsx

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0027 fix-opencc-types-and-build

- 背景：`npm run build` 失敗，因 TypeScript 找不到 `opencc-js` 型別宣告（TS7016）。
- 作法：
  - 安裝 devDependency：`@types/opencc-js`，無需額外自訂型別檔。
  - 再次執行 `npm run build`，已通過（Vite build/type-check 均 OK）。
- 測試/檢查：`npm run build` 成功，未再出現 opencc-js 型別錯誤。

變更檔案（含 RAW 連結）：

- package.json  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/package.json

- package-lock.json  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/package-lock.json

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0028 enforce-test-build-and-raw-stop-rules

- 目的：把「RAW 無法讀取即停用」與「code 任務預設要跑 test+build」正式寫入 workflow，並在 notes 留存。
- 內容：
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`：
    - 新增 RAW 停用規則：RAW 缺漏/阻擋/404/403 時，ChatGPT 必須停止推論該檔案內容，請使用者提供本機檔或 snapshot。
    - 新增 code 任務規則：凡改動 `src/`、`tools/`、`tests/`、或會被程式讀寫的 `data/`，收尾前需執行 `npm test` **及** `npm run build`；若仍失敗，須在 notes 記錄錯誤與原因。
    - 前瞻提醒：目前仍以 `main` 為主；若未來多人協作可考慮 feature 分支 + PR。
  - notes 本節記錄規則更新，無程式碼改動。
- 測試：純 docs 更新，未執行測試/建置。

變更檔案（含 RAW 連結）：

- docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-08 任務：/turn/sutra/ 經論講解頁專用規則 v1

### 1. 任務需求總結

- 頁面範圍：`/turn/sutra/` 經論講解頁。
- 目標：在不破壞既有通則與測試的前提下，為經論講解頁實作 **sutra 專用規則 v1**。
- 型別／結構約束：
  - 不修改 `src/html/legacy-html-types.ts` 中既有介面名稱與欄位。
  - `HtmlToMarkdownResult` 結構不變，只是在 `verses` 中填值。
  - 不修改 `src/types/anycontent-teaching.ts` 與其他 AnyContent 型別檔案。

### 2. 主要實作內容

#### 2.1 sutra 頁判斷與 context

- 檔案：`src/html/html-to-markdown.ts`
- 新增行為：
  - 以 `LegacyHtmlDocument.url` 判斷 sutra 頁：
    - `const isSutraPage = doc.url.includes("/turn/sutra/");`
  - 建立 `HtmlToMarkdownContext`：
    - `interface HtmlToMarkdownContext { isSutraPage: boolean; verses: string[]; }`
  - 在 `htmlToMarkdown` 中建立：
    - `const verses: string[] = [];`
    - `const context: HtmlToMarkdownContext = { isSutraPage, verses };`
  - 轉換主流程改為：
    - `nodeToMarkdown($, el, context)`（而非舊版無 context 版本）。

#### 2.2 sutra DOM 預處理：錨點正規化

- 新增 `preprocessSutraDom($, $root)`：
  - 僅在 `isSutraPage` 時呼叫。
  - 對 `<a name="...">` 做正規化：
    - 若有 `name` 且沒有 `id`，則設 `id = name`。
    - 之後 `removeAttr("name")`，避免後續同一錨點以 name/id 重複收集。
  - 加註註解：
    - `// 規則來源：HTML_TO_MARKDOWN_RULES_V4.md § 經論講解（/turn/sutra/）`

#### 2.3 collectImagesAndAnchors 調整

- 函式簽名由：
  - `collectImagesAndAnchors($root, baseUrl, images, anchors)`
- 調整為：
  - `collectImagesAndAnchors($, $root, baseUrl, images, anchors)`
- 錨點收集邏輯：
  - 掃描 `a[name], a[id]`。
  - 使用 `const candidate = id || name;`，並以 `!anchors.includes(candidate)` 避免重複。
  - sutra 頁因已在 `preprocessSutraDom` 將 `name` 正規化為 `id`，最終 anchors 中只會收到一次該 id（例如 `"item83"`）。

#### 2.4 sutra 經文段落：`<p class="word17-coffee">` → blockquote + verses

- 目標：
  - 在 sutra 頁，將 `<p class="word17-coffee">行一<br>行二</p>` 轉為：
    - `> 行一`\n`> 行二`
  - 並把該段經文的純文字加入 `result.verses: string[]`。

- 實作細節：
  - 在 `nodeToMarkdown` 的 `case "p"` 中：
    - 若 `context.isSutraPage && $el.hasClass("word17-coffee")`：
      - 呼叫 `sutraParagraphToMarkdownLines($, $el)` 取得：
        - `lines: string[]`：每一行經文（已依 `<br>` 切行、整理空白）。
        - `combinedText: string`：所有行以空白串起來的純文字（例：`"行一 行二"`）。
      - 若 `combinedText` 非空：`context.verses.push(combinedText);`
      - 若 `lines` 非空：輸出：
        - `lines.map((line) => "> " + line).join("\n")`
      - 若沒有有效文字行：回傳空字串。
    - 非 sutra 或非 `word17-coffee` 段落仍使用原本的 `inlineText` 規則。

- `sutraParagraphToMarkdownLines` 行為：
  - 逐一掃描 `<p>` 的子節點：
    - 文字節點：累加到暫存 `current`。
    - `<br>`：將 `current` 正規化（收尾 trim 多餘空白）後 push 到 `rawLines`，並清空 `current`。
    - 其他子元素：呼叫既有的 `inlineText` 抽取純文字並加入 `current`。
  - 結束後處理最後一行，然後：
    - `lines`：
      - 對每行再做一次空白正規化與 trim，過濾空行。
    - `combinedText = lines.join(" ");`

#### 2.5 sutra 段落錨點：同時保留文字與 `<a id="..."></a>`

- 需求：
  - sutra 頁 `body_markdown` 中希望有：
    - `<a id="item83"></a>（八十三）`
  - 同時維持 anchors 有 `"item83"`。

- `nodeToMarkdown` 的 `case "a"` 調整：

  ```ts
  case "a": {
    const id = $el.attr("id");
    const href = $el.attr("href");
    const text = inlineText($, $el);

    if (context.isSutraPage && id && !href) {
      // sutra 頁的段落錨點需在 markdown 中保留 id，並保留原本文字內容
      // 規則來源：HTML_TO_MARKDOWN_RULES_V4.md § 經論講解（/turn/sutra/）
      const anchorHtml = `<a id="${id}"></a>`;
      if (!text) {
        return anchorHtml;
      }
      return `${anchorHtml}${text}`;
    }

    if (href) {
      const label = text || href;
      return `[${label}](${href})`;
    }

    return text;
  }
  ```

- 效果：
  - 原始 HTML：

    ```html
    <a name="item83" class="chinese">（八十三）</a>
    <p class="word17-coffee">行一<br>行二</p>
    ```

  - sutra 流程：
    1. `preprocessSutraDom` 將 `name="item83"` 正規化為 `id="item83"`。
    2. `collectImagesAndAnchors` 將 `"item83"` 收進 `result.anchors`。
    3. `nodeToMarkdown` 對 `<a>` 輸出：`<a id="item83"></a>（八十三）`。
    4. `word17-coffee` 段落轉為：
       - `> 行一`\n`> 行二`。

  - 最終 `body_markdown` 片段類似：

    ```md
    <a id="item83"></a>（八十三）

    > 行一
    > 行二
    ```

#### 2.6 其他通則維持不變

- 原有行為維持：
  - heading：`h1`–`h4` → `#`～`####`。
  - 一般段落：`<p>` → `inlineText`。
  - 列表：`<ul>/<ol>` → `listToMarkdown`（僅多傳入 `context`）。
  - blockquote：仍使用既有邏輯，僅改為呼叫新版 `blockChildrenToMarkdown($, $el, context)`。
  - 連結：有 `href` 照舊輸出 `[text](href)`。
  - 圖片：只從 DOM 中移除並收集到 `images`，不輸出 markdown `![]()`。

---

### 3. 測試調整

- 檔案：`tests/html/html-to-markdown.spec.ts`

#### 3.1 原有三個測試維持

1. `converts simple heading and paragraph`
   - 驗證 h1 + 段落轉換。
2. `collects images but does not embed them in markdown`
   - 驗證 images 被收集、markdown 不含 `![]()`。
3. `collects anchors like item83 from name/id attributes`
   - 驗證 anchors 收集 `"item83"`，並保留一般段落文字。

#### 3.2 新增 sutra 專用測試

- 測試名稱：`"applies sutra-specific rules for word17-coffee paragraphs and anchors"`
- 測試輸入：

  ```html
  <html>
    <body>
      <a name="item83" class="chinese">
        （八十三）
      </a>
      <p class="word17-coffee">行一<br>行二</p>
    </body>
  </html>
  ```

- 測試重點斷言：
  - blockquote：
    - `result.body_markdown` 含 `"> 行一"` 與 `"> 行二"`。
  - verses 收集：
    - 以 `const verses = result.verses ?? [];` 讀取。
    - 斷言 `verses.length > 0`，且 `verses[0]` 同時包含 `"行一"`、`"行二"`。
  - anchors 與 id：
    - `result.anchors` 包含 `"item83"`。
    - `body_markdown` 中包含 `<a id="item83"></a>`（而不是只有純文字）。

---

### 4. 之後給 ChatGPT 的使用建議

未來若有其他任務（例如 blossom / reply 等特殊單元）：

1. 在本檔案新增一個新的章節，例如：
   - `## 2025-12-10 任務：blossom 單元特殊樣式處理`
2. 簡要列出：
   - 需求摘要
   - 預計修改檔案
   - 已完成的實作與測試
3. 把這個檔案（或其中相關章節）貼給 ChatGPT / AI 助手，讓它快速掌握前情。這樣可以避免重複解釋專案背景與既有約束。

---

## 2025-12-08 任務：T-0001 teaching-from-legacy 偈語欄位映射

### 1. 任務需求總結

- 對應 PROJECT_TODO：
  - `T-0001 teaching-from-legacy: 將 htmlToMarkdown 的 verses 映射到 TeachingMeta 偈語欄位`
- 目標：
  - 不修改 `htmlToMarkdown` 的輸入 / 輸出型別與 verses 產生邏輯。
  - 僅在 teaching adapter 中，根據 `HtmlToMarkdownResult.verses` 將偈語資訊填入 `TeachingMeta` 偏好欄位。

### 2. 主要實作內容

- 檔案：`src/adapters/teaching-from-legacy.ts`

  - 讀取 `const verses = mdResult.verses ?? [];`.
  - 新增 helper：`buildTeachingMetaFromVerses(verses, language)`, 回傳 `TeachingMeta`：
    - 無偈語時（`verses.length === 0`）：
      - `ct_has_dharma_verse = "no"`
      - `ct_verse_block_markdown = null`
      - `ct_verse_type = null`
      - `ct_verse_lang = null`
    - 有偈語時（`verses.length >= 1`）：
      - `ct_has_dharma_verse = "yes"`
      - `ct_verse_block_markdown = verses.map(line => "> " + line).join("\n")`
        - 目前 sutra 頁的 verses 會將整段偈語壓成一個元素（例如 `"行一 行二"`），
          因此實際輸出會是單行 `> 行一 行二`。
      - `ct_verse_type = "sutra"`
      - `ct_verse_lang = "zh-tw"`（僅當 `language === "zh-tw"`；其他語言暫時設為 `null`）。
  - 其餘 TeachingContent 結構（圖片欄位、post_type 等）維持原狀。

- 型別約束：
  - 未修改 `HtmlToMarkdownResult` 介面（`verses` 仍為選填 `string[] | undefined`）。
  - 未修改 `src/types/anycontent-teaching.ts` 中 `TeachingMeta` / `TeachingContent` 定義。

### 3. 測試調整

- 檔案：`tests/adapters/teaching-from-legacy.spec.ts`

  - 原有測試：
    - `builds a minimal TeachingContent from legacy HTML`
      - 驗證 TeachingContent 的基本欄位與圖片欄位 mapping。

  - 新增測試：`"maps verses from htmlToMarkdown into TeachingMeta dharma verse fields"`

    - 測試輸入：

      ```html
      <html>
        <body>
          <p class="word17-coffee">行一<br>行二</p>
        </body>
      </html>
      ```

    - 預期行為：
      - sutra 頁的 `htmlToMarkdown` 會將該段偈語轉成：
        - `verses = ["行一 行二"]`（實際內容由 HTML parser 決定，這裡只依 adapter 規格處理）。
      - teaching adapter 轉換後：
        - `meta.ct_has_dharma_verse === "yes"`
        - `meta.ct_verse_block_markdown === "> 行一 行二"`
        - `meta.ct_verse_type === "sutra"`
        - `meta.ct_verse_lang === "zh-tw"`

### 4. 測試方式

- 單檔測試：

  ```bash
  npx vitest tests/adapters/teaching-from-legacy.spec.ts
  ```

- 全專案測試：

  ```bash
  npx vitest
  ```

- 預期：所有 Vitest 測試通過，未放寬型別或修改既有 contract.

---

## 2025-12-08 任務：T-0003 news-from-legacy: 建立 NewsContent adapter 骨架（minimal mapping）

### 1. 任務需求總結

- 對應 PROJECT_TODO：
  - `T-0003 news-from-legacy: 建立 NewsContent adapter 骨架（minimal mapping）`
- 目標：
  - 建立第一版 `news-from-legacy` adapter，將 legacy HTML + htmlToMarkdown 輸出轉成最基本的 `NewsContent` 結構，
    僅實作 minimal mapping，其餘進階欄位留待後續 T 任務處理。

### 2. 主要實作內容

- 檔案：`src/adapters/news-from-legacy.ts`

  - 匯出：
    - `newsFromLegacy(doc: LegacyHtmlDocument, options: NewsFromLegacyOptions): NewsContent`
  - `NewsFromLegacyOptions`：
    - 延伸 `HtmlToMarkdownOptions`，新增：
      - `externalId: string`
      - `language: Language`（沿用 AnyContent 的 `Language` union，目前實際測試以 `"zh-tw"` 為主）
      - `fallbackTitle?: string`
  - 轉換流程：
    - 呼叫 `htmlToMarkdown(doc, markdownOptions)` 取得 `mdResult`。
    - `post_title`：先以 `fallbackTitle ?? deriveTitleFromUrl(doc.url)` 簡單推得，詳細標題規則留待後續任務。
    - `meta: NewsMeta`：僅建立 skeleton，全部日期 / 地點 / 類別欄位先填 `null`：
      - `ct_news_date: null`
      - `ct_event_date_start: null`
      - `ct_event_date_end: null`
      - `ct_event_date_raw: null`
      - `ct_event_location: null`
      - `ct_news_category: null`
    - `NewsContent`：
      - `external_id`：來自 options.externalId。
      - `language`：來自 options.language。
      - `post_type: 'news'`.
      - `old_url: doc.url`.
      - `post_title` 如上。
      - `post_excerpt: null`（暫不從 HTML 推導）。
      - `body_markdown: mdResult.body_markdown`.
      - `featured_image`：取 `mdResult.images[0]?.src ?? null`.
      - `featured_image_caption: null`.
      - `gallery_items`：其餘圖片映射為 `{ url, alt, caption: null }` 陣列。

- 檔案：`tests/adapters/news-from-legacy.spec.ts`

  - 新增測試：`"builds a minimal NewsContent from legacy HTML"`
  - 測試輸入：一個簡單的 legacy news HTML，包含：
    - `<h1>重要公告</h1>`
    - 一段主文 `<p>這是一則新聞內容。</p>`
    - 兩張圖片：一張主圖、一張 gallery 圖。
  - 測試斷言：
    - `news.post_type === 'news'`.
    - `news.language === 'zh-tw'`.
    - `news.old_url === doc.url`.
    - `news.body_markdown` 內含主文文字。
    - 圖片：
      - `featured_image` 包含主圖檔名。
      - `gallery_items.length === 1` 且唯一元素的 `url` 包含 gallery 圖檔名。
    - `meta` skeleton：
      - `ct_news_date` / `ct_event_date_start` / `ct_event_date_end` / `ct_event_date_raw` / `ct_event_location` / `ct_news_category` 皆為 `null`.

### 3. 測試與型別檢查

- 型別檢查：
  - 指令（沿用 T-0002）：
    - `npx tsc --noEmit`

- 測試：
  - 單檔：

    ```bash
    npx vitest tests/adapters/news-from-legacy.spec.ts
    ```

  - 全專案：

    ```bash
    npx vitest
    ```

- 後續若在 news adapter 上新增日期 / 地點 / 類別等邏輯，建議再開新的 T 任務，而不直接更動本小節描述.

---

## 2025-12-08 任務：T-0004 magazine-from-legacy: 建立 MagazineContent adapter 骨架（minimal mapping）

### 1. 任務需求總結

- 對應 PROJECT_TODO：
  - `T-0004 magazine-from-legacy: 建立 MagazineContent adapter 骨架（minimal mapping）`
- 目標：
  - 建立第一版 `magazine-from-legacy` adapter，從 legacy HTML + htmlToMarkdown 輸出建立最基本的 `MagazineContent`，
    僅實作 minimal mapping，期數 / 區塊 / 作者等進階欄位留給後續 T 任務補強。

### 2. 主要實作內容

- 檔案：`src/adapters/magazine-from-legacy.ts`

  - 匯出：
    - `magazineFromLegacy(doc: LegacyHtmlDocument, options: MagazineFromLegacyOptions): MagazineContent`
  - `MagazineFromLegacyOptions`：
    - 延伸 `HtmlToMarkdownOptions`，新增：
      - `externalId: string`
      - `language: Language`（沿用 AnyContent 的 `Language` union，目前實際測試以 `"zh-tw"` 為主）
      - `fallbackTitle?: string`
  - 轉換流程：
    - 呼叫 `htmlToMarkdown(doc, markdownOptions)` 取得 `mdResult`。
    - `post_title`：先以 `fallbackTitle ?? deriveTitleFromUrl(doc.url)` 簡單推得。
    - `meta: MagazineMeta`：僅建立 skeleton，issue / article 相關欄位先填 `null` / `undefined`：
      - `ct_magazine_level: "issue"`（暫定當前頁代表整期雜誌）。
      - `ct_magazine_issue_no: null`
      - `ct_magazine_year: null`
      - `ct_magazine_month: null`
      - `ct_magazine_issue_label: null`
      - `ct_issue_items: undefined`
      - `ct_magazine_section: null`
      - `ct_magazine_type: null`
      - `ct_author_name: null`
    - `MagazineContent`：
      - `external_id`：來自 options.externalId。
      - `language`：來自 options.language。
      - `post_type: 'magazine'`。
      - `old_url: doc.url`。
      - `post_title` 如上。
      - `post_excerpt: null`（暫不從 HTML 推導）。
      - `body_markdown: mdResult.body_markdown`。
      - `featured_image`：取 `mdResult.images[0]?.src ?? null`。
      - `featured_image_caption: null`。
      - `gallery_items`：其餘圖片映射為 `{ url, alt, caption: null }` 陣列。

- 檔案：`tests/adapters/magazine-from-legacy.spec.ts`

  - 新增測試：`"builds a minimal MagazineContent from legacy HTML"`
  - 測試輸入：一個簡單的 legacy magazine HTML，包含：
    - `<h1>雜誌第一期</h1>`
    - 一段主文 `<p>這是雜誌內容的摘要段落。</p>`
    - 兩張圖片：一張封面、一張內頁圖。
  - 測試斷言：
    - `magazine.post_type === 'magazine'`。
    - `magazine.language === 'zh-tw'`。
    - `magazine.old_url === doc.url`。
    - `magazine.body_markdown` 內含主文文字。
    - 圖片：
      - `featured_image` 包含封面檔名。
      - `gallery_items.length === 1` 且唯一元素的 `url` 包含內頁圖檔名。
    - `meta` skeleton：
      - `ct_magazine_issue_no` / `ct_magazine_year` / `ct_magazine_month` / `ct_magazine_issue_label` 為 `null`。
      - `ct_issue_items` 為 `undefined`。
      - `ct_magazine_section` / `ct_magazine_type` / `ct_author_name` 為 `null`。

### 3. 測試與型別檢查

- 型別檢查：
  - 指令（沿用 T-0002）：
    - `npx tsc --noEmit`

- 測試：
  - 單檔：

    ```bash
    npx vitest tests/adapters/magazine-from-legacy.spec.ts
    ```

  - 全專案：

    ```bash
- 後續若在 magazine adapter 上新增 issue / section / author 等邏輯，建議再開新的 T 任務，而不直接更動本小節描述。

---

## 2025-12-08 任務：T-0005 news-from-legacy: 映射 NewsMeta 日期與地點欄位（v1）

### 1. 任務需求總結

- 對應 PROJECT_TODO：
  - `T-0005 news-from-legacy: 映射 NewsMeta 日期與地點欄位（v1）`
- 目標：
  - 在現有 `news-from-legacy` 骨架上，實作第一版日期與地點欄位 mapping，
    讓 `NewsMeta` 至少能填入「新聞日期」與「活動日期 / 地點」等基本資訊。

### 2. 主要實作內容

- 檔案：`src/adapters/news-from-legacy.ts`

  - 新增 helper：`parseNewsDateAndLocationFromHtml(html: string)`，回傳：

    ```ts
    interface ParsedNewsDateLocation {
      newsDate: string | null;
      eventDateStart: string | null;
      eventDateEnd: string | null;
      eventDateRaw: string | null;
      eventLocation: string | null;
    }
    ```

  - 解析策略（v1）：
    - 僅針對最簡單且常見的樣板：
      - 文字中出現：`日期：YYYY-MM-DD`（可選 `~` / `～` / `-` 再接第二個日期）。
      - 文字中出現：`地點：XXXX`，以 `。` / `；` / `;` 或字串結尾作為終止。
    - 步驟：
      1. 將 HTML 中所有標籤移除，取得純文字，並將空白壓成單行字串。
      2. 使用正則：
         - 日期：`/日期：\s*([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})(?:\s*[~～─-]\s*([0-9]{4}-[0-9]{1,2}-[0-9]{1,2}))?/`
         - 地點：`/地點：\s*([^。；;]+)/`
    - 對應欄位填值：
      - 若有日期：
        - `ct_news_date = 第一個日期`
        - `ct_event_date_start = 第一個日期`
        - `ct_event_date_end = 第二個日期`（若存在，否則為 `null`）
        - `ct_event_date_raw = 去掉「日期：」前綴後的原始日期字串`
      - 若有地點：
        - `ct_event_location = 地點後方文字（去尾端標點與多餘空白）`
      - 若無匹配到，保持 `null`。

  - `NewsMeta` 組裝調整：

    ```ts
    const parsed = parseNewsDateAndLocationFromHtml(doc.html);

    const meta: NewsMeta = {
      ct_collection_key: undefined,
      ct_collection_order: undefined,
      ct_news_date: parsed.newsDate,
      ct_event_date_start: parsed.eventDateStart,
      ct_event_date_end: parsed.eventDateEnd,
      ct_event_date_raw: parsed.eventDateRaw,
      ct_event_location: parsed.eventLocation,
      ct_news_category: null,
    };
    ```

### 3. 測試調整

- 檔案：`tests/adapters/news-from-legacy.spec.ts`

  - 原有測試：`"builds a minimal NewsContent from legacy HTML"` 維持，用於確認 skeleton 行為仍正確。

  - 新增測試：`"maps basic date and location fields into NewsMeta when present in HTML (T-0005 v1)"`

    - 測試輸入（代表性 news HTML）：

      ```html
      <html>
        <body>
          <div class="news-meta">
            日期：2025-03-14 地點：台北講堂
          </div>
          <p>這是一則含有日期與地點資訊的新聞。</p>
        </body>
      </html>
      ```

    - 預期行為：
      - `ct_news_date === "2025-03-14"`
      - `ct_event_date_start === "2025-03-14"`
      - `ct_event_date_end === null`（因為只出現單一日期）
      - `ct_event_date_raw === "2025-03-14"`
      - `ct_event_location === "台北講堂"`

### 4. 測試與型別檢查

- 型別檢查：
  - 建議指令：
    - `npx tsc --noEmit`

- 測試：
  - 單檔：

    ```bash
    npx vitest tests/adapters/news-from-legacy.spec.ts
    ```

  - 全專案：

    ```bash
    npx vitest
    ```

- 之後若要支援更複雜的日期範圍或多段地點描述，建議再開新 T 任務，並在本檔記錄新的解析策略.

---

## 2025-12-08 任務：T-0006 teaching-from-legacy CLI（HTML → AnyContent 範例）

### 1. 任務需求總結

- 對應 PROJECT_TODO（口頭描述）：
  - `T-0006 teaching-from-legacy CLI（HTML → AnyContent 範例）`
- 目標：
  - 提供一支最小可用的 teaching 轉換 CLI，從本機 legacy teaching HTML 檔產生 `TeachingContent` / `AnyContent` JSON，
    作為日後批次轉換工具與 pipeline 的示範。

### 2. 主要實作內容

- 檔案：`tools/convert/teaching-html-to-anycontent.ts`

  - 功能：
    - 從本機讀取一個 legacy teaching HTML 檔。
    - 組裝 `LegacyHtmlDocument`，呼叫 `teachingFromLegacy` adapter（內部會再呼叫 `htmlToMarkdown`）。
    - 將結果輸出為 JSON（stdout 或指定輸出檔）。

  - CLI 介面（v1）：

    ```bash
    ts-node tools/convert/teaching-html-to-anycontent.ts \
      --in path/to/legacy-teaching.html \
      --external-id teaching_example_0001 \
      --language zh-tw \
      --out data/anycontent/teaching/example-0001.json
    ```

    - 參數說明：
      - `--in`（必填）：legacy teaching HTML 檔案路徑。
      - `--external-id`（選填）：預設為輸入檔名；實務上建議由外層 pipeline 決定。
      - `--language`（選填）：預設 `zh-tw`，需符合 `Language` union。
      - `--out`（選填）：輸出 JSON 檔案路徑；若未指定，則直接輸出到 stdout。
      - `--url`（選填）：用於填入 `LegacyHtmlDocument.url`，若未給則使用 `file://<絕對路徑>`。

  - 轉換流程：

    ```ts
    const doc: LegacyHtmlDocument = {
      url: url ?? `file://${absInPath.replace(/\\/g, "/")}`,
      html,
    };

    const teaching = teachingFromLegacy(doc, {
      externalId,
      language,
    });
    ```

    - `teachingFromLegacy` 會：
      - 呼叫 `htmlToMarkdown` 取得 `body_markdown`、`images`、（可能的）`verses`。
      - 依 T-0001 的規則，將 `verses` 映射到 `TeachingMeta` 偈語欄位。
      - 組裝 `TeachingContent` 結構（post_type / images / meta 等）。

### 3. 使用與限制說明

- 目前 CLI 僅支援「單一檔案 → 單一 JSON」的使用情境，適合作為：
  - 手動驗證 teaching adapter 行為。
  - 示範未來批次轉換工具（例如：讀取一整個 docroot 路徑）。

- URL 欄位：
  - 若呼叫時未指定 `--url`，則預設使用：

    ```
    file:///.../absolute/path/to/legacy-teaching.html
    ```

  - 實際上正式 pipeline 應該由外層流程提供對應的舊站 URL（例如 `https://www.ctworld.org/turn/xxx.htm`）。

- 後續若要擴充：
  - 可以新增：
    - `--stdout` / `--pretty` 等旗標。
    - 以 glob / 目錄為輸入，一次轉多個檔案。
  - 建議在 `PROJECT_TODO.md` 新增對應 T 任務，而不是直接在本小節擴寫行為。


---

## 2025-12-09 任務：T-0007 docs-snapshot-cli：自動產生 docs snapshot ZIP

### 1. 任務需求總結

- 對應 PROJECT_TODO：
  - `T-0007 docs-snapshot-cli: 自動產生 docs snapshot ZIP（給 ChatGPT 用）`
- 目標：
  - 在本機 repo 中提供一個簡單 CLI / npm script，讓實作 Agent 可以用單一指令產生「本次任務專用的 docs snapshot ZIP」。
  - ZIP 只打包 `docs/*.md` 與 `docs/terminal_logs/*.txt`，輸出到 `snapshots/`，**不加入 git**。
  - 之後你要給 ChatGPT 看最新狀態，只要上傳對應的 snapshot ZIP 即可。

### 2. 主要實作與修改檔案

- `tools/docs-snapshot/make-docs-snapshot.ts`
  - 新增 docs snapshot CLI：
    - 預設輸出目錄：`snapshots/`
    - 檔名格式：`ctworld-docs-T-xxxx-YYYY-MM-DD-vN.zip`
    - 必填參數：
      - `--task T-xxxx`：對應本次任務編號（會寫進檔名）。
    - 打包內容：
      - 所有 `docs/*.md`
      - 所有 `docs/terminal_logs/*.txt`
    - 不會包含 `node_modules`、`dist` 等大型目錄。

- `package.json`
  - 新增 npm script：

    ```jsonc
    "scripts": {
      // ...
      "snapshot:docs": "ts-node tools/docs-snapshot/make-docs-snapshot.ts"
    }
    ```

- `docs/PROJECT_TODO.md`
  - 將 T-0007 狀態改為「? 已完成」並補上實際 CLI 行為與驗收方式說明。

- `docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`
  - 記錄第一次成功執行 `npm run snapshot:docs -- --task T-0007` 的終端輸出。
- 驗收：已於 2025-12-10 跑 `npm run snapshot:docs -- --task T-0007`，產生 zip 並確認內容。

### 3. 使用方式備忘

- 實作 Agent 在每個 T 任務收尾時，如果需要給 ChatGPT 看最新 docs：
  1. 先依照任務需求更新 `docs/*.md` 與 `docs/terminal_logs/*.txt`。
  2. 在專案根目錄執行：

     ```bash
     npm run snapshot:docs -- --task T-xxxx
     ```

  3. 檢查 `snapshots/` 下多了一個類似：

     ```text
     snapshots/ctworld-docs-T-0007-2025-12-09-v1.zip
     ```

  4. **不要把 snapshots/ 加入 git**，只在本機保留，用來上傳給 ChatGPT。

- 之後你開新對話時，只要：
  - 上傳最新的 docs snapshot ZIP。
  - 附上一段 `[Agent 回報摘要]`（含 T 任務編號、變更檔案列表、主要測試結果與 snapshot 檔名），
  - 就能讓新的 ChatGPT 對話直接接上這一輪完成的工作。

---

## 2025-12-09 任務：T-0007 docs-snapshot-cli：自動產生 docs snapshot ZIP

### 1. 任務需求總結

- 對應 PROJECT_TODO：
  - `T-0007 docs-snapshot-cli: 自動產生 docs snapshot ZIP（給 ChatGPT 用）`
- 目標：
  - 在本機 repo 中提供一個簡單 CLI / npm script，讓實作 Agent 可以用單一指令產生「本次任務專用的 docs snapshot ZIP」。
  - ZIP 只打包 `docs/*.md` 與 `docs/terminal_logs/*.txt`，輸出到 `snapshots/`，**不加入 git**。
  - 之後要給 ChatGPT 看最新狀態，只要上傳對應的 snapshot ZIP 即可。

### 2. 主要實作與修改檔案

- `tools/docs-snapshot/make-docs-snapshot.ts`
  - 新增 docs snapshot CLI：
    - 預設輸出目錄：`snapshots/`
    - 檔名格式：`ctworld-docs-T-xxxx-YYYY-MM-DD-vN.zip`
    - 必填參數：
      - `--task T-xxxx`：對應本次任務編號（會寫進檔名）。
    - 打包內容：
      - 所有 `docs/*.md`
      - 所有 `docs/terminal_logs/*.txt`
    - 不會包含 `node_modules`、`dist` 等大型目錄。

- `package.json`
  - 新增 npm script：

    ```jsonc
    "scripts": {
      // ...
      "snapshot:docs": "ts-node tools/docs-snapshot/make-docs-snapshot.ts"
    }
    ```

- `docs/PROJECT_TODO.md`
  - 將 T-0007 狀態改為「? 已完成」，並補上實際 CLI 行為與驗收方式說明。

- `docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`
  - 記錄第一次成功執行 `npm run snapshot:docs -- --task T-0007` 的終端輸出。

### 3. 使用方式備忘

- 實作 Agent 在每個 T 任務收尾時，如果需要給 ChatGPT 看最新 docs，可以：

  1. 先依照任務需求更新 `docs/*.md` 與 `docs/terminal_logs/*.txt`。
  2. 在專案根目錄執行：

     ```bash
     npm run snapshot:docs -- --task T-xxxx
     ```

  3. 檢查 `snapshots/` 下多了一個類似：

     ```text
     snapshots/ctworld-docs-T-0007-2025-12-09-v1.zip
     ```

  4. **不要把 snapshots/ 加入 git**，只在本機保留，用來上傳給 ChatGPT。

- 之後你開新對話時，只要：

  - 上傳最新的 docs snapshot ZIP。
  - 附上一段 `[Agent 回報摘要]`（含 T 任務編號、變更檔案列表、主要測試結果與 snapshot 檔名），

就能讓新的 ChatGPT 對話直接接上這一輪完成的工作。

## 2025-12-12 任務：T-0029 news-sample-and-visual-compare

- 目的：為 news 建立 sample-001（legacy→zh-TW AnyContent→zh-CN）並納入 `/dev/compare`。方便與 teaching 範例並列驗收 mapping 與資料完整度。
- 內容：
  - 新增 legacy 範例：`data/legacy-news/sample-001.html`（含標題、日期/地點、正文）。
  - 新增 AnyContent：
    - `data/anycontent/zh-tw/news/sample-001.json`
    - `data/anycontent/zh-cn/news/sample-001.json`
  - 更新 dev compare index：`data/compare/index.json` 增 `news-sample-001`；`/dev/compare` 可切換 teaching/news。
- 測試/建置：`npm test`、`npm run build` 皆通過。

變更檔案（含 RAW 連結）：

- data/legacy-news/sample-001.html  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/legacy-news/sample-001.html

- data/anycontent/zh-tw/news/sample-001.json  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-tw/news/sample-001.json

- data/anycontent/zh-cn/news/sample-001.json  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-cn/news/sample-001.json

- data/compare/index.json  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/compare/index.json

- src/dev/VisualComparePage.tsx  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/dev/VisualComparePage.tsx

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0030 magazine-sample-and-visual-compare

- 目的：為 magazine 建立 sample-001（legacy→zh-TW→zh-CN）並納入 `/dev/compare`，與 teaching/news 並列檢視。
- 內容：
  - 新增 legacy 範例：`data/legacy-magazine/sample-001.html`（含標題、期別/日期、正文）。
  - 新增 AnyContent：
    - `data/anycontent/zh-tw/magazine/sample-001.json`
    - `data/anycontent/zh-cn/magazine/sample-001.json`
  - 更新 dev compare index：`data/compare/index.json` 增 `magazine-sample-001`，`/dev/compare` 可切換 teaching/news/magazine。
- 測試/建置：`npm test`、`npm run build` 皆通過。

變更檔案（含 RAW 連結）：

- data/legacy-magazine/sample-001.html  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/legacy-magazine/sample-001.html

- data/anycontent/zh-tw/magazine/sample-001.json  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-tw/magazine/sample-001.json

- data/anycontent/zh-cn/magazine/sample-001.json  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-cn/magazine/sample-001.json

- data/compare/index.json  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/compare/index.json

- src/dev/VisualComparePage.tsx  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/dev/VisualComparePage.tsx

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
## 2025-12-12 任務：T-0031 define-anycontent-v1-schema-v1-draft

- 目的：整理 AnyContent teaching/news/magazine 欄位，產出 V1 schema 草稿，作為後續調整基準。
- 內容：
  - 整理 type 與 sample JSON，彙整為 `docs/CONTENT_SCHEMA_V1.md`（共用欄位、各 post_type 專用欄位、繁簡轉換注意事項、未來可能擴充）。
  - 在 `docs/CONTENT_SCHEMA.md` 標註 V1 草稿位置。
- 測試：純 docs 更新，未執行。

變更檔案（含 RAW 連結）：

- docs/CONTENT_SCHEMA_V1.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/CONTENT_SCHEMA_V1.md

- docs/CONTENT_SCHEMA.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/CONTENT_SCHEMA.md

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
## 2025-12-12 任務：T-0032 refine-anycontent-v1-schema-details

- 目的：在 V1 草稿上補齊 teaching/news/magazine 欄位與 zh-TW/zh-CN 轉換描述，讓現有 JSON 更易對照與維護。
- 內容：
  - `docs/CONTENT_SCHEMA_V1.md`：補充共用欄位（external_id、gallery_items 等）與各 post_type 專用欄位細節，列出繁簡轉換/不轉換欄位，增列後續可能擴充。
  - `docs/CONTENT_SCHEMA.md`：頂端註記 V1 草稿位置，避免混淆。
- 測試：純 docs 更新，未執行。

變更檔案（含 RAW 連結）：

- docs/CONTENT_SCHEMA_V1.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/CONTENT_SCHEMA_V1.md

- docs/CONTENT_SCHEMA.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/CONTENT_SCHEMA.md

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
## 2025-12-12 任務：T-0033 plan-future-branch-gallery-index_page inventory+schema templates

- 目的：登記未來可能的 branch / gallery / index_page 任務，預計需要的 inventory＋schema 模板方向，暫不實作。
- 內容：
  - `docs/PROJECT_TODO.md` 新增 T-0033，描述未來可用的模板元素（inventory 步驟、schema 設計、sample/compare）。
  - 本次不修改任何程式或 schema，僅記錄規劃。
- 測試：純 docs 更新，未執行。

變更檔案（含 RAW 連結）：

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
## 2025-12-12 任務：T-0034 unknown-content-handling-rule

- 目的：在規則與 workflow 中寫明「暫無欄位的內容」處理方式，避免亂增 meta，預設落在 `body_markdown` 並保留 legacy 對照。
- 內容：
  - `docs/HTML_TO_MARKDOWN_RULES_V4.md`：新增「未知內容 fallback」段落（文字放 body_markdown、不立即新增 meta、保留 old_url/legacy HTML，常見 pattern 另開 T）。
  - `docs/CONTENT_SCHEMA_V1.md`：共用欄位補充「未知內容先留 body_markdown，暫勿新增 meta key」。
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`：新增 3.8，提醒編輯 adapter 時遵守未知內容處理。
- 測試：純 docs 更新，未執行。

變更檔案（含 RAW 連結）：

- docs/HTML_TO_MARKDOWN_RULES_V4.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/HTML_TO_MARKDOWN_RULES_V4.md

- docs/CONTENT_SCHEMA_V1.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/CONTENT_SCHEMA_V1.md

- docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
## 2025-12-12 任務：T-0035 add-unclassified-content-flags

- 目的：在 AnyContent schema 與流程中加入「未分類內容」旗標，避免亂塞 meta，方便後續追蹤。
- 內容：
  - `docs/CONTENT_SCHEMA_V1.md`：共用欄位新增 `meta.has_unclassified_content`（boolean）與 `meta.unclassified_notes`（string）。
  - `docs/HTML_TO_MARKDOWN_RULES_V4.md`：未知內容 fallback 段落說明可搭配旗標，暫時留在 `body_markdown`。
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`：提醒 adapter 編輯時可視需要設定旗標，不強迫當下拆欄位。
  - `docs/PROJECT_TODO.md`：新增 T-0035 並標記完成。
- 測試：純 docs 更新，未執行。

變更檔案（含 RAW 連結）：

- docs/CONTENT_SCHEMA_V1.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/CONTENT_SCHEMA_V1.md

- docs/HTML_TO_MARKDOWN_RULES_V4.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/HTML_TO_MARKDOWN_RULES_V4.md

- docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
## 2025-12-12 任務：T-0036 compare-unclassified-flag

- 目的：在 `/dev/compare` 顯示 AnyContent JSON 的未分類旗標，並提供篩選。
- 內容：
  - `src/dev/VisualComparePage.tsx`：index 新增 badge、filter，右欄顯示未分類提示卡與 notes。
  - `data/anycontent/zh-tw/magazine/sample-001.json`：示範 `meta.has_unclassified_content = true` 與 `unclassified_notes`。
  - `data/anycontent/zh-cn/magazine/sample-001.json`：同步標記，便於對照。
  - `docs/PROJECT_TODO.md`：新增並標記完成 T-0036。
- 測試：`npm test`、`npm run build`。

變更檔案（含 RAW 連結）：

- src/dev/VisualComparePage.tsx  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/dev/VisualComparePage.tsx

- data/anycontent/zh-tw/magazine/sample-001.json  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-tw/magazine/sample-001.json

- data/anycontent/zh-cn/magazine/sample-001.json  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-cn/magazine/sample-001.json

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
## 2025-12-12 任務：HTML_TO_MARKDOWN_RULES_V4 亂碼修復（af7ff6c 回溯）

- 目的：main 上的 `docs/HTML_TO_MARKDOWN_RULES_V4.md` 出現亂碼，需從乾淨版本覆蓋並固定 UTF-8。
- 作法：
  - 使用 `git checkout af7ff6c -- docs/HTML_TO_MARKDOWN_RULES_V4.md` 取回乾淨版（含附錄）。
  - 確認 UTF-8 編碼，配合 `.editorconfig` / `.gitattributes`。
  - 單一 commit 推回 main。
- 測試：純 docs 修復，未執行。
- commit: 1e3d8a5（restore from af7ff6c，修復亂碼）

變更檔案（含 RAW 連結）：

- docs/HTML_TO_MARKDOWN_RULES_V4.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/HTML_TO_MARKDOWN_RULES_V4.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
## 2025-12-12 任務：T-0037 sync-html-to-markdown-unknown-content

- 目的：在 `HTML_TO_MARKDOWN_RULES_V4` 補回「無法歸類內容的暫存處理（簡版）」段落，對齊 T-0034/T-0035 的 schema & workflow 說明。
- 內容：
  - `docs/HTML_TO_MARKDOWN_RULES_V4.md`：新增小節，說明無欄位對應的內容暫留 `body_markdown`，必要時標 `meta.has_unclassified_content` / `meta.unclassified_notes`，並保留 `old_url` / legacy HTML。
  - `docs/PROJECT_TODO.md`：新增並標記完成 T-0037（docs-only）。
- 測試：純 docs 更新，未執行。
- commit: fdcf799

變更檔案（含 RAW 連結）：

- docs/HTML_TO_MARKDOWN_RULES_V4.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/HTML_TO_MARKDOWN_RULES_V4.md

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0038 zh-cn-health-check-cli

- 目的：提供 CLI，檢查 zh-TW / zh-CN AnyContent JSON 是否成對存在、基本欄位一致，並提醒可轉換欄位是否缺漏。
- 內容：
  - `tools/convert/check-zh-cn-health.ts`：掃描 `data/anycontent/zh-tw` 與 `data/anycontent/zh-cn` 成對 JSON。
  - 檢查欄位：`post_type` / `slug` / `old_url` / `language`；以及可轉換欄位 `post_title` / `post_excerpt` / `body_markdown`、meta string 欄位、`seo.meta_title` / `seo.meta_description`。
  - 新增 npm script：`npm run check:zh-cn`。
- 測試：`npm test`、`npm run build`。
- commit: b875471

變更檔案（含 RAW 連結）：

- tools/convert/check-zh-cn-health.ts  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/tools/convert/check-zh-cn-health.ts

- package.json  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/package.json

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0039 zh-cn-health-check-in-workflow

- 目的：在 workflow / checklist 中寫明 zh-CN JSON 健康檢查流程（`npm run check:zh-cn`）。
- 內容：
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`：新增 3.7 小節，要求觸及 zh-CN pipeline/JSON 時要跑 `npm run check:zh-cn`，有 ERROR 不得 push，需修復或開 T 任務。
  - `docs/SESSION_CHECKLIST.md`：收工檢查加入 `npm run check:zh-cn` 的提醒（當涉及 zh-CN 變更時）。
  - `docs/PROJECT_TODO.md`：新增並標記完成 T-0039（docs-only）。
- 測試：docs-only，未執行額外指令。
- commit: ca3dfd2

變更檔案（含 RAW 連結）：

- docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md

- docs/SESSION_CHECKLIST.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/SESSION_CHECKLIST.md

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0040 instr-template-files-for-chatgpt

- 目的：讓 INSTR 模板預設列出「給 ChatGPT review 的檔案清單」，並在 workflow 中提醒撰寫 INSTR 的注意事項。
- 內容：
  - `docs/INSTR/INSTR-TEMPLATE.md`：重寫模板，加入檔案清單/RAW 提醒，禁止 citation。
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`：新增撰寫 INSTR 的注意事項小節（3.8），要求列檔案清單、避免 citation，並指明需閱讀的 docs。
  - `docs/PROJECT_TODO.md`：新增並標記完成 T-0040。
  - `docs/Windsurf_ChatGPT_NOTES.md`：記錄本次 docs-only 更新。
- 測試：純 docs 更新，未執行額外指令。
- commit: 390e800

變更檔案（含 RAW 連結）：

- docs/INSTR/INSTR-TEMPLATE.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/INSTR/INSTR-TEMPLATE.md
- docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md
- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0042 mark-T-0041-blocked-and-adjust-todo-notes

- 目的：暫停 T-0041，正式記錄阻礙與解鎖條件。
- 阻礙：
  - repo 僅有 `data/legacy-teaching/sample-001.html`，缺少其他教學頁。
  - `data/crawl/*.csv` 只有索引頁 URL，沒有實際教學內容頁。
  - 嘗試抓取 `https://www.ctworld.org/turn/teaching/index.htm` 等網址只得到 404/廣告，依 workflow 不自行對外爬。
- 後續解法：
  - 等使用者提供 3–5 個實際教學頁 HTML（放入 `data/legacy-teaching/*.html`），或等待 T-0006 取得完整舊站備份，再重啟 T-0041。
- 測試：本次僅 docs 更新，未執行測試。
- commit: 4c831cb

變更檔案（含 RAW 連結）：

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0043 workflow-safety-level-note

- 目的：在 workflow 補充 safety levels，統一何時要跑 test/build/check:zh-cn、RAW 讀取失敗的停用規則，以及 schema/mapping 需先經 ChatGPT review。
- 內容：
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`：新增 Safety levels 小節（test + build、check:zh-cn、RAW 無法讀取要停、schema/mapping 需先寫 docs 並審核）。
  - `docs/PROJECT_TODO.md`：新增並標記完成 T-0043。
- 測試：本次僅 docs 更新，未執行 test/build/check:zh-cn。
- commits: f297ec4（workflow / TODO 補 safety levels）、01274ef（notes 補 commit hash）

變更檔案（含 RAW 連結）：

- docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md

- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0051 teaching-image-gallery-impl-v1

- 目的：依 V4 規則為 teaching 實作封面圖與 gallery（alt → caption），並更新 sample 與 compare。
- 主要變更：
  - `src/adapters/teaching-from-legacy.ts`：第一張圖作為 `featured_image`，caption 取 alt；其餘為 `gallery_items`，保留 alt / caption。
  - 測試：`tests/html/html-to-markdown.spec.ts`（圖片 alt 保留）、`tests/adapters/teaching-from-legacy.spec.ts`（featured / gallery 順序與 caption）。
  - Sample 與 compare：`data/legacy-teaching/sample-001.html`、`data/anycontent/zh-tw|zh-cn/teaching/sample-001.json`、`data/compare/index.json` 更新，含封面 + 2 張 gallery 圖。
- 測試 / 建置：已執行 `npm test`、`npm run build`、`npm run check:zh-cn`。
- commit: 57d9d0b

變更檔案（含 RAW 連結）：
- `src/adapters/teaching-from-legacy.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/adapters/teaching-from-legacy.ts
- `tests/html/html-to-markdown.spec.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/tests/html/html-to-markdown.spec.ts
- `tests/adapters/teaching-from-legacy.spec.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/tests/adapters/teaching-from-legacy.spec.ts
- `data/legacy-teaching/sample-001.html`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/legacy-teaching/sample-001.html
- `data/anycontent/zh-tw/teaching/sample-001.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-tw/teaching/sample-001.json
- `data/anycontent/zh-cn/teaching/sample-001.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-cn/teaching/sample-001.json
- `data/compare/index.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/compare/index.json
- `docs/PROJECT_TODO.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- `docs/Windsurf_ChatGPT_NOTES.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0061 gallery-default-style-strategy-docs-only

- 目的：釐清 gallery 預設樣式決策層級（目前採 A 案：adapter 直接寫入 meta.default_gallery_style）與 WordPress 內容欄位策略（dry-run 暫存 body_markdown 至 wp_content_html，匯入前預期轉 HTML），僅更新 docs。
- 主要變更：
  - `docs/PENDING_DECISIONS.md`：新增「Gallery default style fallback 策略」與「WordPress 內容欄位：body_markdown 與 wp_content_html」條目，記錄 A/B/C 案與現況。
  - `docs/CONTENT_SCHEMA_V1.md`：meta.default_gallery_style 說明改為「由 adapter 直接輸出，importer 不補 fallback」，並補充 wp_content_html 策略提醒。
  - `docs/DESIGN/WP_CONTENT_MODEL_V1.md`：重寫為可讀版，對齊 A 案、標註 importer 不做 default style fallback，並註記 wp_content_html 的暫定用法。
  - `docs/PROJECT_TODO.md`：新增並標記完成 T-0061。
  - `docs/Windsurf_ChatGPT_NOTES.md`：本小節。
- 測試 / 建置：docs-only，未執行 `npm test` / `npm run build` / `npm run check:zh-cn`。
- commits: 634b614（docs 更新）；notes 補記錄：後續多次提交（最新以本檔所在 commit 為準，見 git log）

變更檔案（含 RAW 連結）：
- `docs/PENDING_DECISIONS.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PENDING_DECISIONS.md
- `docs/CONTENT_SCHEMA_V1.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/CONTENT_SCHEMA_V1.md
- `docs/DESIGN/WP_CONTENT_MODEL_V1.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/DESIGN/WP_CONTENT_MODEL_V1.md
- `docs/PROJECT_TODO.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- `docs/Windsurf_ChatGPT_NOTES.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0062 workflow-v5.2-single-source-temp-zip-and-hash-manifest（docs-only）

- 目的：將 ChatGPT 交接統一為 `docs/TEMP.zip`（含 `MANIFEST.json`），並要求 Codex 回報四要點（完成、commit hash、測試狀態、TEMP.zip 就緒）。
- 主要變更：
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`：更新交接流程為 TEMP.zip + MANIFEST，新增 Codex 回報 Gate（四要點）。
  - `.gitignore`：加入 `docs/TEMP.zip` 忽略規則。
  - `docs/PROJECT_TODO.md`：新增並標記完成 T-0062。
- 測試 / 建置：docs-only，未執行 `npm test` / `npm run build` / `npm run check:zh-cn`。
- commit: 7e33d37

變更檔案（含 RAW 連結）：
- `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md
- `.gitignore`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/.gitignore
- `docs/PROJECT_TODO.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- `docs/Windsurf_ChatGPT_NOTES.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0063 temp-zip-manifest-cleanup-and-staging-folder（docs-only）

- 目的：強化 TEMP.zip + MANIFEST 交接流程，避免 TEMP 與 ZIP 並存、路徑/編碼錯亂，並提供自動化腳本。
- 主要變更：
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`：交接僅用 TEMP.zip（含 MANIFEST），`docs/TEMP/` 只作 staging，MANIFEST 必含 repo_path / temp_path / sha256 / bytes / source_commit 等欄位且為 UTF-8 無 BOM。
  - `scripts/handoff/build-temp-zip.js`：新增 handoff 腳本，建立 staging、生成 MANIFEST、zip、清理 staging；`npm run handoff:tempzip` 指向此腳本。
  - `package.json`：新增 `handoff:tempzip` script。
  - `docs/PROJECT_TODO.md`：新增並標記完成 T-0063。
- 測試 / 建置：docs + 新增工具腳本，未執行 `npm test` / `npm run build` / `npm run check:zh-cn`。
- commits: 6e6208d（新增 handoff 腳本）/ 44971d3（workflow / TODO / script 入口）

變更檔案（含 RAW 連結）：
- `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md
- `scripts/handoff/build-temp-zip.js`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/scripts/handoff/build-temp-zip.js
- `package.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/package.json
- `docs/PROJECT_TODO.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- `docs/Windsurf_ChatGPT_NOTES.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0064 field-coverage-sampling-audit-and-schema-gaps（docs-only）

- 目的：以現有 sample-001（teaching/news/magazine）檢視欄位覆蓋，列出缺口與後續 T 候選。
- 主要變更：
  - `docs/DESIGN/FIELD_COVERAGE_SAMPLING_V1.md`：新增樣本覆蓋表（teaching/news/magazine/flipbook/branch）、缺口嚴重度與後續建議。
  - `docs/PENDING_DECISIONS.md`：補充圖說對齊策略、爬蟲/編碼 fallback、民國年/區間日期解析等待決策項目。
  - `docs/PROJECT_TODO.md`：新增並標記完成 T-0064。
- 測試 / 建置：docs-only，未執行 `npm test` / `npm run build` / `npm run check:zh-cn`。
- commit: 4c7efca

變更檔案（含 RAW 連結）：
- `docs/DESIGN/FIELD_COVERAGE_SAMPLING_V1.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/DESIGN/FIELD_COVERAGE_SAMPLING_V1.md
- `docs/PENDING_DECISIONS.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PENDING_DECISIONS.md
- `docs/PROJECT_TODO.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- `docs/Windsurf_ChatGPT_NOTES.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0052 workflow-instr-for-all-tasks（docs-only）

- 目的：把「每個 T 任務必須有對應 INSTR .md」寫進 workflow，並更新 INSTR-TEMPLATE / TODO / notes。
- 主要變更：
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`：新增 3.11 說明「沒有 INSTR 不開工」、INSTR 要列範圍與測試、docs-only 可註記未跑 test/build。
  - `docs/INSTR/INSTR-TEMPLATE.md`：補充 INSTR 強制配對規則、允許修改檔案與必跑測試的填寫方式。
  - `docs/PROJECT_TODO.md`：新增並標記完成 T-0052。
- 測試 / 建置：本次為 docs-only，未執行 `npm test` / `npm run build` / `npm run check:zh-cn`。
- commit: fcce160

變更檔案（含 RAW 連結）：
- `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md
- `docs/INSTR/INSTR-TEMPLATE.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/INSTR/INSTR-TEMPLATE.md
- `docs/PROJECT_TODO.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- `docs/Windsurf_ChatGPT_NOTES.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0053 news-magazine-image-gallery-impl-v1

- 目的：依 V4 規則為 news / magazine 實作封面圖與 gallery（alt → caption），並更新 sample 與 compare。
- 主要變更：
  - `src/adapters/news-from-legacy.ts`、`src/adapters/magazine-from-legacy.ts`：第一張圖作為 `featured_image`，caption 取 alt；其餘為 `gallery_items`，保留 alt / caption。
  - 測試：`tests/adapters/news-from-legacy.spec.ts`、`tests/adapters/magazine-from-legacy.spec.ts` 更新圖片拆解與 caption 期望。
  - Sample：`data/legacy-news/sample-001.html`、`data/legacy-magazine/sample-001.html` 增封面 + gallery；對應 zh-tw / zh-cn JSON 補入圖片欄位與 caption；compare index 繼續使用。
- 測試 / 建置：已執行 `npm test`、`npm run build`、`npm run check:zh-cn`。
- commit: 57893db

變更檔案（含 RAW 連結）：
- `src/adapters/news-from-legacy.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/adapters/news-from-legacy.ts
- `src/adapters/magazine-from-legacy.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/adapters/magazine-from-legacy.ts
- `tests/adapters/news-from-legacy.spec.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/tests/adapters/news-from-legacy.spec.ts
- `tests/adapters/magazine-from-legacy.spec.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/tests/adapters/magazine-from-legacy.spec.ts
- `data/legacy-news/sample-001.html`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/legacy-news/sample-001.html
- `data/legacy-magazine/sample-001.html`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/legacy-magazine/sample-001.html
- `data/anycontent/zh-tw/news/sample-001.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-tw/news/sample-001.json
- `data/anycontent/zh-cn/news/sample-001.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-cn/news/sample-001.json
- `data/anycontent/zh-tw/magazine/sample-001.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-tw/magazine/sample-001.json
- `data/anycontent/zh-cn/magazine/sample-001.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-cn/magazine/sample-001.json
- `data/compare/index.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/compare/index.json
- `docs/PROJECT_TODO.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- `docs/Windsurf_ChatGPT_NOTES.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
## 2025-12-12 任務：T-0054 layout-and-multi-gallery-schema-design（docs-only）

- 目的：為未來多 gallery 區塊預留 schema 與規則，暫不實作程式。
- 主要變更：
  - `docs/CONTENT_SCHEMA_V1.md`：新增 `default_gallery_style`、`gallery_blocks` 欄位（預留樣式與多 gallery 區塊）。
  - `docs/HTML_TO_MARKDOWN_RULES_V4.md`：註記 layout / multi-gallery 尚未由 extractor 產出，仍僅提供 `images[]` → `featured_image` / `gallery_items`。
  - `docs/RULES_CROSSCHECK_NOTES_V1.md`：補充 T-0054 圖片/gallery schema 更新的 cross-check 提醒。
  - `docs/PROJECT_TODO.md`：新增並標記完成 T-0054。
- 測試 / 建置：docs-only，未執行 `npm test` / `npm run build` / `npm run check:zh-cn`。
- commit: e613c19

變更檔案（含 RAW 連結）：
- `docs/CONTENT_SCHEMA_V1.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/CONTENT_SCHEMA_V1.md
- `docs/HTML_TO_MARKDOWN_RULES_V4.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/HTML_TO_MARKDOWN_RULES_V4.md
- `docs/RULES_CROSSCHECK_NOTES_V1.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/RULES_CROSSCHECK_NOTES_V1.md
- `docs/PROJECT_TODO.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- `docs/Windsurf_ChatGPT_NOTES.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0055 teaching-news-magazine-gallery-adapter-v2

- 目的：依 gallery schema v2 為 teaching/news/magazine adapter 輸出 `meta.default_gallery_style` 與 `gallery_blocks`，並更新 sample / compare。
- 主要變更：
  - `src/adapters/teaching-from-legacy.ts` / `news-from-legacy.ts` / `magazine-from-legacy.ts`：預設 style（teaching=`grid-2`、news/magazine=`grid-3`）＋ `gallery_blocks`（main_gallery 取全部 gallery_items），保留 featured / gallery_items 行為。
  - `src/types/*`：BaseMeta 增加 `default_gallery_style`、`has_unclassified_content` / `unclassified_notes`，news meta 補 `ct_event_location_raw`；magazine meta 維持 issue/pub_date。
  - sample JSON（zh-tw / zh-cn teaching/news/magazine）重寫為 UTF-8，新增 `gallery_blocks` 與 default gallery style；compare dev page 顯示 gallery style / blocks 指標。
  - 測試改為正常 UTF-8 文字並驗證 gallery_blocks / default_gallery_style；VisualComparePage 重新整理文案並顯示 gallery summary。
- 測試 / 建置：已執行 `npm test`、`npm run build`、`npm run check:zh-cn`。
- commit: b1dcbbd

變更檔案（含 RAW 連結）：
- `src/adapters/teaching-from-legacy.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/adapters/teaching-from-legacy.ts
- `src/adapters/news-from-legacy.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/adapters/news-from-legacy.ts
- `src/adapters/magazine-from-legacy.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/adapters/magazine-from-legacy.ts
- `src/types/anycontent-teaching.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/types/anycontent-teaching.ts
- `src/types/anycontent-news.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/types/anycontent-news.ts
- `src/types/anycontent-magazine.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/types/anycontent-magazine.ts
- `tests/adapters/teaching-from-legacy.spec.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/tests/adapters/teaching-from-legacy.spec.ts
- `tests/adapters/news-from-legacy.spec.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/tests/adapters/news-from-legacy.spec.ts
- `tests/adapters/magazine-from-legacy.spec.ts`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/tests/adapters/magazine-from-legacy.spec.ts
- `data/anycontent/zh-tw/teaching/sample-001.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-tw/teaching/sample-001.json
- `data/anycontent/zh-cn/teaching/sample-001.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-cn/teaching/sample-001.json
- `data/anycontent/zh-tw/news/sample-001.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-tw/news/sample-001.json
- `data/anycontent/zh-cn/news/sample-001.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-cn/news/sample-001.json
- `data/anycontent/zh-tw/magazine/sample-001.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-tw/magazine/sample-001.json
- `data/anycontent/zh-cn/magazine/sample-001.json`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/data/anycontent/zh-cn/magazine/sample-001.json
- `docs/CONTENT_SCHEMA_V1.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/CONTENT_SCHEMA_V1.md
- `docs/PROJECT_TODO.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- `src/dev/VisualComparePage.tsx`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/dev/VisualComparePage.tsx
- `docs/Windsurf_ChatGPT_NOTES.md`  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0056 progress-dashboard-daily-update

- 目的：建立每日可手動更新的進度儀表板，依 PROJECT_TODO / NOTES 對齊 Timeline 與完成度。
- 主要變更：
  - 新增 docs/DESIGN/ctworld-progress-dashboard.html，以 tasks 陣列呈現日期分組、checkbox 與完成度百分比。
  - 先填入 2025-12-12 的 T-0054 / T-0055 與 2025-12-11 的 T-0046，供後續每日更新。
  - PROJECT_TODO 新增 T-0056 條目並標記完成（dev/docs-only）。
- 測試 / 建置：本次為 dev/docs-only，未新增程式碼；未重跑測試。
- commit: 0bfd657

變更檔案（含 RAW 連結）：
- docs/DESIGN/ctworld-progress-dashboard.html
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/DESIGN/ctworld-progress-dashboard.html
- docs/PROJECT_TODO.md
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- docs/Windsurf_ChatGPT_NOTES.md
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0057 deploy-progress-dashboard-to-siteground

- 目的：提供 SiteGround SFTP 部署腳本，讓進度儀表板可手動上傳，避免將憑證寫入 repo。
- 主要變更：
  - 新增 dev/progress-dashboard/ctworld-progress-dashboard.html（deploy 用來源同 docs 版本）。
  - 新增 scripts/deploy/deploy-progress-dashboard-to-siteground.js，讀取 .env.siteground 並以 ssh2-sftp-client 上傳。
  - 新增 .env.siteground.example placeholder，package.json 加入依賴與 deploy:progress-dashboard 指令。
  - PROJECT_TODO 登記並標記 T-0057 完成（dev-only）；本次未實際佈署。
- 測試 / 建置：dev/docs-only，未執行 npm test/build（script 供手動佈署）。
- commit: cdd5b28

變更檔案（含 RAW 連結）：
- dev/progress-dashboard/ctworld-progress-dashboard.html
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/dev/progress-dashboard/ctworld-progress-dashboard.html
- scripts/deploy/deploy-progress-dashboard-to-siteground.js
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/scripts/deploy/deploy-progress-dashboard-to-siteground.js
- .env.siteground.example
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/.env.siteground.example
- package.json
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/package.json
- package-lock.json
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/package-lock.json
- docs/PROJECT_TODO.md
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- docs/Windsurf_ChatGPT_NOTES.md
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-12 任務：T-0058 wordpress-gallery-importer-schema-and-mapping

- 目的：定義 AnyContent V1（teaching/news/magazine）到 WordPress 的 content model 與欄位 mapping，供 importer / ACF / 後台 UI 後續實作。
- 主要變更：
  - 新增 docs/DESIGN/WP_CONTENT_MODEL_V1.md，列出 post type / taxonomy / meta / ACF 對應（含 gallery_items / gallery_blocks / default_gallery_style / unclassified flags）。
  - docs/CONTENT_SCHEMA_V1.md 補 cross-link，指向 WordPress content model 文檔。
  - TODO 登記並標記 T-0058 完成；本次為 docs-only，未改程式碼、未跑測試。
- 測試 / 建置：docs-only，未執行 
pm test / 
pm run build / 
pm run check:zh-cn。
- commit: 8fd8b52

變更檔案（含 RAW 連結）：
- docs/DESIGN/WP_CONTENT_MODEL_V1.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/DESIGN/WP_CONTENT_MODEL_V1.md
- docs/CONTENT_SCHEMA_V1.md
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/CONTENT_SCHEMA_V1.md
- docs/PROJECT_TODO.md
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- docs/Windsurf_ChatGPT_NOTES.md
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md


## 2025-12-12 任務：T-0059 wordpress-gallery-importer-cli-v1

- 目的：實作 AnyContent → WordPress 匯入 dry-run CLI，產出 WPImportRecord 計畫檔（不呼叫 WP）。
- 主要變更：
  - src/wp/import/types.ts：定義 WPImportRecord / gallery block 等型別。
  - src/wp/import/anycontent-to-wp.ts：將 teaching/news/magazine AnyContent 轉為 WPImportRecord（含 featured、gallery_items、gallery_blocks、default_gallery_style、meta）。
  - 	ools/wp-import/wp-import-from-anycontent.ts：CLI，掃描 data/anycontent，輸出 dry-run JSON；新增 npm script wp:import:dry-run。
  - PROJECT_TODO 新增並標記 T-0059 完成；docs-only 無。
- 測試 / 建置：已執行 
pm test、
pm run build；
pm run wp:import:dry-run 生成計畫檔（tmp/wp-import-plan-zh-tw-*.json）。
- commit: 123353e

變更檔案（含 RAW 連結）：
- src/wp/import/types.ts
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/wp/import/types.ts
- src/wp/import/anycontent-to-wp.ts
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/src/wp/import/anycontent-to-wp.ts
- tools/wp-import/wp-import-from-anycontent.ts
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/tools/wp-import/wp-import-from-anycontent.ts
- package.json
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/package.json
- package-lock.json
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/package-lock.json
- docs/PROJECT_TODO.md
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- docs/Windsurf_ChatGPT_NOTES.md
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md


## 2025-12-12 任務：T-0060 workflow-review-and-temp-files

- 目的：更新 workflow 的 ChatGPT review 規則、docs/TEMP 暫存交接流程，並忽略 TEMP 目錄。
- 主要變更：
  - docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md：新增 ChatGPT review 決策輸出規則、docs/TEMP 命名與交接流程。
  - .gitignore：忽略 docs/TEMP/。
  - docs/PROJECT_TODO.md：新增並標記完成 T-0060。
- 測試 / 建置：docs/workflow-only，未執行 
pm test / 
pm run build。
- commit: 5e6a5b1

變更檔案（含 RAW 連結）：
- docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md
- docs/PROJECT_TODO.md
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- docs/Windsurf_ChatGPT_NOTES.md
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
- .gitignore
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/.gitignore
