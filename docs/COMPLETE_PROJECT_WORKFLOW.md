# COMPLETE_PROJECT_WORKFLOW

> 版本：2025-12-12
> 提醒：詳細協作流程與安全規則以 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 為單一真相；本檔僅保留專案 roadmap / 歷史摘要。
---
---

## 1. 目前進度概覽（2025-12-10 基準）

- ✅ 爬蟲 + filesystem inventory：`tools/crawl/*` 已跑出 `data/crawl/*.json/.csv` 差異報表。
- ✅ HTML → Markdown（含 sutra 規則）：`src/html/html-to-markdown.ts` + 測試。
- ✅ AnyContent schema + adapters：teaching / news / magazine 皆有 V1；teaching/news 有測試、magazine minimal V1。
- ✅ docs snapshot CLI（T-0007）：`npm run snapshot:docs -- --task ...` 可產 ZIP（不進 git）。
- ⬜ zh-TW → zh-CN pipeline：僅有規格，未實作。
- ⬜ legacy data root 導入（T-0006）：待完整舊站備份（blocked）。
- ⬜ WordPress importer / React 前端：尚未開始。

---

## 2. 專案目標與範圍

- 使用 AnyContent schema 管理 ctworld.org 內容，導向 Headless WordPress，前端以 React/Next.js 呈現。
- 維持內容雙語（繁/簡），保留舊站 URL 映射與 SEO 資訊。
- 以 docs + T 任務驅動開發，GitHub main 為單一真相。

---

## 3. 已完成的大步驟

- 爬蟲與檔案盤點：抓取舊站 URL，盤點 docroot，產出缺漏/多餘清單。
- HTML → Markdown：通用轉換流程 + sutra 專用規則（偈語、anchors）；測試涵蓋。
- AnyContent schema + adapters：teaching/news/magazine 型別與 adapter V1；news 已有日期/地點 mapping；teaching 有偈語 mapping；magazine minimal。
- docs snapshot CLI：可隨時打包 docs 與 terminal logs，供 ChatGPT/Agent 檢視。

---

## 4. 未完成的大步驟

- zh-TW → zh-CN pipeline：按 `docs/ZH_TW_TO_ZH_CN_PIPELINE.md` 實作 CLI + 測試。
- legacy data root：取得完整舊站備份後設定 `CTWORLD_LEGACY_ROOT`，再開 T 任務盤點與導入。
- WordPress importer / React 前端：設計 importer（ACF/custom post type/Polylang），前端路由與 SEO 策略尚未啟動。

---

## 5. 一個標準 T 任務的流程

1) 發想 / 登記：在 `PROJECT_TODO.md` 補齊背景、目標、檔案範圍、驗收方式。  
2) 寫 spec：ChatGPT 完善條目，給 Codex 短指令。  
3) 實作：Codex 依 spec 改檔、跑必要測試。  
4) 驗收：依條目檢查（測試結果 / 產出檔 / 手動檢查）。  
5) 收尾：`git add` → `git commit`（含任務編號/摘要）→ `git push`。  
6) 紀錄：在 `Windsurf_ChatGPT_NOTES.md` 登記變更與最後 commit hash；同步 `PROJECT_TODO.md` / `PROJECT_STATUS.md`。

---

## 6. 與 `WORKFLOW_CHATGPT_GITHUB_AGENT.md` 的關係

- `WORKFLOW_CHATGPT_GITHUB_AGENT.md`：高層協作規則＋日常操作（角色、單一真相、RAW 連結規則、snapshot 例外）。  
- `COMPLETE_PROJECT_WORKFLOW.md`：專案整體 roadmap + 各階段任務集合，快速了解「現在跑到哪、還剩什麼」。  
- 兩者互補：前者管「怎麼合作」，後者說「專案全貌與階段性目標」。
