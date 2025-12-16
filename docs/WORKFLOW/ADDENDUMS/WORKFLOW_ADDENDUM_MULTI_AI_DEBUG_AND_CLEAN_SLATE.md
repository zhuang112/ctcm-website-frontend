# 工作流程補丁：多 AI 互查（Gemini/Grok）+ 交接包缺失處理 + 乾淨重來原則

> 目的：把「我容易忘記下一步」的風險，改成 **流程自帶下一步**。  
> 用法：這份是 **可直接貼進** `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 的增補段落（或作為 1.15 節）。

---

## 1.15 多 AI 互查（Gemini / Grok）與每包節奏

### 1.15.1 硬規則（何時一定要外部 AI 互查）
**凡是會影響 runtime 或內容轉換品質的變更，一律「一包一 debug」：**
- crawler / encoding / retry/backoff/rate limit
- zh-CN pipeline / 取代規則 / OpenCC
- html-to-markdown / table / anchor / flipbook / 內容結構
- importer 寫入（Directus/WP 任一）、資料遷移、權限/安全
- schema 變更（AnyContent schema、Directus schema）

**純 docs-only、且能 100% 用機器檢查自證者，可合併 debug：**
- 只改 README / 規範文字
- 只改 handoff 工具但有完整測試覆蓋、可重現（包含 zip + MANIFEST + check）

### 1.15.2 每包標準節奏（完成→自證→外部 debug→修→再自證）
1) Codex 完成一顆 T → 產出 versioned TEMP zip（含 MANIFEST）
2) 本機/CI 自證（必跑 INSTR 指定的 npm 指令）→ 產出 `ci_summary.md`（或同等摘要）
3) 外部 AI debug（Gemini/Grok 任一或兩者）：
   - 使用 `docs/QA/DEBUG_V3/PROMPTS/*` 的固定模板
   - 產出 bug_report（固定格式：Severity/Steps/Expected/Actual/Suspected files）
4) Codex 依 bug_report 修正 → **再跑一次自證**
5) 使用者抽樣驗收（10 頁 checklist 或只看 High/Medium）
6) 結案，進下一包

### 1.15.3 INSTR 必填欄位（避免忘記下一步）
每一顆 INSTR 一律包含：
- `External Debug Required: YES/NO`
- 若 YES：要用哪個模板（debug review / bugfix validation）與要產出哪些檔（bug_report、ci_summary）
- 若 NO：寫明理由（docs-only + 100% 自證），並列出對應自證命令

---

## 1.16 交接包缺失 / 舊任務處理（避免回頭爆炸）

### 1.16.1 原則
- **review 以 versioned TEMP zip（含 MANIFEST）為真相來源**。
- 若某顆 T 沒有 zip：視為「不可驗收」狀態，不做推論、不做 review。

### 1.16.2 立即補齊流程（重跑 handoff）
當需要 review 舊任務但缺 zip 時：
1) 先找出「該任務當時的目標 commit」或選定「現在要對齊的 HEAD」
2) 在該 commit 上重跑：
   - `npm run handoff:tempzip -- --task_id <T-XXXX>`
3) 確認 `MANIFEST.source_commit == HEAD`
4) 產出 `TEMP_YYYYMMDD_T-XXXX_<HEAD7>.zip`
5) 從這包 zip 開始 review（舊的沒有 zip 的內容不再追溯）

### 1.16.3 平台轉換期間：哪些舊 zip 可能不再需要
- **WP importer / Next.js 專屬**：可標記為 `legacy`，不再要求每次都回頭 debug
- **內容地基（crawler/AnyContent/zh-CN/QA）**：仍屬新平台會延用的「核心資產」，需要保留最後一份可追溯 zip

> 簡單說：**會被新主線使用的，保留；只屬於舊平台的，凍結歸檔。**

---

## 1.17 乾淨重來策略（保留流程，打掉技術債）

### 1.17.1 什麼必須保留（不然等於重建地獄）
- workflow/QA/交接包規則（你剛建立的這套）
- AnyContent schema（或其精神：canonical、可追溯）
- 內容抓取與清洗規則（crawler + QA jsonl）

### 1.17.2 什麼可以直接打掉重來（建議）
- WP importer、WP 專用欄位 mapping
- Next.js 專用 routing / adapters（若 Astro 取代）
- 舊站主題樣式、散落的 UI 實作（將由 Astro + 新設計系統重建）

### 1.17.3 新主線的「第一天就要有」的防爆裝置
- Directus schema 用 snapshot/diff/apply 做版本控管（避免手改 UI 後無法重現）
- Importer 必須 idempotent（可重跑）
- 每顆 T 的 External Debug Required 明確化
