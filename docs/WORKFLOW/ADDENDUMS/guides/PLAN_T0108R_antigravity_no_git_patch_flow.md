# 決策：Anti 沒有 Git → 轉為「Patch 生產者」，由有 Git 的執行環境落地 T-0108R

> 你現在的狀態是正常的：anti 沙盒環境找不到 Git，因此 **不能做 clone / commit / push / handoff(source_commit==HEAD)**。  
> 但我們仍然可以把 T-0108R 做完：讓 anti 產出「Patch ZIP」，再由有 Git 的執行環境（你的本機 repo / codex-max / Claude Desktop）套用、驗收、commit、handoff。

---

## 1) 我建議你對 anti 的回覆（直接貼）
> 可以，請你打包 Patch。你先不要宣稱完成 T-0108R（因為你沒有 Git），你只要產出 `PATCH_20251218_T-0108R_antigravity_r1.zip`。  
> Patch 內務必包含：  
> 1) `docs/INSTR/_TEMPLATE_INSTR_WITH_AI_ROUTING.md`（你已建立的那份）  
> 2) `WORKFLOW_1_24_AI_ROUTING_MATRIX.md`（你幫我準備要新增到 docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md 的 1.24 章節內容，獨立成檔）  
> 3) `APPLY_INSTRUCTIONS.md`（告訴我解壓縮後要把哪些檔案覆蓋到 repo 的哪些路徑）  
> 4) `PATCH_MANIFEST.json`（列出檔名、目的路徑、sha256、版本/作者/日期）  
> 打包完成後把 ZIP 放在 `C:\Users\master\.gemini\antigravity\scratch\`，並回報完整路徑與檔案清單。

---

## 2) 有 Git 的環境要怎麼「落地」T-0108R（你或 codex-max 執行）
> 前提：你在一個**真正的 git repo** 內（`ctcm-website-frontend`，且 remote=origin，branch=main 或新分支皆可）。

### 2.1 建議分支
```bash
git checkout -b docs/T-0108R-finish-routing-matrix origin/main
```

### 2.2 套用 Patch
1) 把 `PATCH_20251218_T-0108R_antigravity_r1.zip` 複製到 repo 外（例如桌面或 repo 根目錄旁邊）
2) 解壓縮後依 `APPLY_INSTRUCTIONS.md` 覆蓋檔案到 repo 內

你最終應該得到：
- `docs/INSTR/_TEMPLATE_INSTR_WITH_AI_ROUTING.md`（新增或更新）
- `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`（在 1.23 後新增 1.24 AI 路由矩陣）
- `docs/PROJECT_TODO.md`（新增並勾選 T-0108R 完成）
- `docs/Windsurf_ChatGPT_NOTES.md`（新增 T-0108R 小節紀錄）

### 2.3 驗收（必跑）
```bash
npm run check:no-bom
npm run check:utf8
```

### 2.4 commit + handoff（必做）
```bash
git status
git add -A
git commit -m "T-0108R: add AI routing matrix to workflow and add INSTR template"
git push -u origin HEAD
npm run handoff:tempzip -- --task_id T-0108R
```

要求：
- `docs/TEMP/TEMP_<date>_T-0108R_<HEAD7>.zip`
- `MANIFEST.source_commit == git rev-parse HEAD`

---

## 3) 這樣做會不會跟 codex-max/Claude 不一致？（結論）
不會，只要守住：
- **同一顆 T：只有「有 Git 的那個環境」能宣稱完成並產 handoff**
- anti 只負責產 patch（輸入物）
- 最終以 repo main + notes + canonical TEMP zip 為單一真相

---

## 4) 下一步（完成 T-0108R 後再做）
T-0108R 一落地，我們再開下一顆真正要做的「Inventory / Scraper / UI」任務，並依 1.24 矩陣自動路由請 Gemini/Grok/Claude 參與。
