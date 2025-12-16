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

## 2025-12-13 任務：T-0080 security-hardening-and-public-repo-safety

- 目的：新增安全守則，避免 secrets 進入公開 repo，並建立可執行的 security scan。
- 主要變更：
  - workflow 新增 Security 小節（禁止 secrets、交接只用 TEMP zip、deploy/importer 任務必跑 `npm run security:scan`）。
  - 新增 `scripts/quality/security-scan.js` + `npm run security:scan`，掃描工作樹與近期 git history，預設將 SiteGround/placeholder 命中視為警告。
  - 新增 `docs/QA/SECURITY_AUDIT.md` 記錄本次掃描結果；.gitignore 補 .env/.env.*、*.pem、*.key。
  - PROJECT_TODO 開頭提醒 deploy/importer 任務必跑 security:scan；新增 T-0080 條目；IMPROVEMENT_BACKLOG 新增安全條目完成。
- 測試 / 檢查：`npm run security:scan`（無阻斷，僅關鍵字警告）；`npm test` / `npm run build` / `npm run check:zh-cn` 依前一任務狀態通過（本次未變動程式邏輯）。
- commits: 9d1ac8a

變更檔案（含 RAW 連結）：
- docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md
- docs/QA/SECURITY_AUDIT.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/QA/SECURITY_AUDIT.md
- scripts/quality/security-scan.js  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/scripts/quality/security-scan.js
- package.json  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/package.json
- .gitignore  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/.gitignore
- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- docs/IMPROVEMENTS/IMPROVEMENT_BACKLOG.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/IMPROVEMENTS/IMPROVEMENT_BACKLOG.md
- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

## 2025-12-16 任務：T-0082 security-scan-strictness-and-gitignore-env-example-exceptions

- 目的：強化安全掃描與 .env example 規則，減少誤判，同時在嚴格模式下攔截歷史紀錄中的敏感資訊。
- 主要變更：
  - .gitignore 允許 .env*.example、.env.*.example 做為示例檔案，不被忽略。
  - scripts/quality/security-scan.js 支援 --strict / SECURITY_SCAN_STRICT=1；git history 命中在 strict 下視為 fail，並對 docs placeholder / process.env 以警告處理。
  - docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md 補充 security:scan 可用 strict；PROJECT_TODO / IMPROVEMENT_BACKLOG 登記 T-0082。
- 測試 / 檢查：
pm run check:no-bom、
pm run security:scan（warning 為 docs placeholder）、
pm run security:scan -- --strict（因 git history 命中預期以 fail 呈現，嚴格模式生效）。
- commits: <填入本次 commit hash>
- 交接包：docs/TEMP/TEMP_20251216_T-0082_<commit>.zip（含 MANIFEST，task_id=T-0082）

變更檔案（含 RAW 連結）：
- .gitignore  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/.gitignore
- scripts/quality/security-scan.js  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/scripts/quality/security-scan.js
- docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md
- docs/PROJECT_TODO.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
- docs/IMPROVEMENTS/IMPROVEMENT_BACKLOG.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/IMPROVEMENTS/IMPROVEMENT_BACKLOG.md
- docs/Windsurf_ChatGPT_NOTES.md  
  RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
