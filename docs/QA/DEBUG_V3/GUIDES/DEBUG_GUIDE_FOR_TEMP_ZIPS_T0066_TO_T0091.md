# CTWORLD TEMP ZIP Debug Guide (T-0066 → T-0091)

> 目的：讓「非原作者」也能照著要點做 review / debug，並用一致格式回報（Markdown），方便你整合與交付。

---

## 0) 要一包一包給嗎？

不一定。建議用 **「按範圍給」**，避免對方被大量檔案淹沒：

- **只 debug crawler / QA fails** → 給：T-0066、T-0089（或 T-0085 rerun）、T-0091（若有）
- **只 debug HTML→MD / anchors / images** → 給：T-0067、T-0068
- **只 debug CI / Debug V3 模板** → 給：T-0087（必要時再加 T-0083）
- **只 debug WordPress importer** → 給：T-0079
- **只 debug handoff zip / workflow / notes** → 給：T-0072、T-0081（必要時 T-0063）
- **全域 audit / 回歸檢查** → 才給「全部 T-0066→T-0091」

> 若要給多包：建議放同一個資料夾，保持檔名不改，讓 reviewer 可用檔名追溯 task_id/date/commit。

---

## 1) 給 reviewer 的「通用規則」

### 1.1 不要改檔、只 review
- Reviewer 只需要提出「問題 + 建議」。
- 真正修正由 Codex/工程流程執行（避免多人改同一份 code）。

### 1.2 每包 ZIP 的第一步（必做）
1) 打開 ZIP 內 `MANIFEST.json`
2) 檢查：
   - `task_id` 是否與檔名一致
   - `source_commit` 是否與檔名中的 HEAD7/commit 尾碼對得上（若檔名有）
   - `sha256/bytes/repo_path/temp_path` 欄位是否存在（依 workflow 版本）
3) 用 `MANIFEST.repo_path` 對照 ZIP 內路徑是否保留原始結構（不應 flatten）

### 1.3 標準回報格式（必用）
請 reviewer **一定用** `docs/QA/DEBUG_V3/TEMPLATES/BUG_REPORT_TEMPLATE.md`（若 ZIP 內有），或使用你提供的 **Sample Template**（本回覆附檔）。

---

## 2) 建議的 debug 工作流（所有 reviewer 都能照做）

### 2.1 只看檔案（不跑程式）的 review
適用：docs-only / workflow-only / schema-only 任務。

Checklist：
- 文件是否自洽？（與 CONTENT_SCHEMA / WORKFLOW / PENDING_DECISIONS 是否互相引用正確）
- 是否有矛盾、過時敘述、或「單一真相」不清楚的段落
- 是否有 typo、命名不一致、欄位說明缺漏

### 2.2 會跑程式的 review（建議工程 reviewer）
適用：crawler / adapters / importer / CI 任務。

最小驗收指令（repo 內執行）：
- `npm test`
- `npm run build`
- `npm run check:no-bom`
- `npm run security:scan`
- 若涉及 zh-CN：`npm run check:zh-cn`
- 若涉及 crawler：跑一次 crawler（依 repo 既有指令/文件）

> reviewer 不需要全部都跑，但至少要說清楚「跑了哪些」與結果。

---

## 3) 逐任務（T-0066 → T-0091）Debug 要點

> 下列是「依任務意圖」整理的 review 點；不要求每包都跑程式，但要對準該任務的風險點。

---

### T-0066 crawler-encoding-fallback + QA fails（早期版）
**目標**：編碼 fallback（utf-8/big5），失敗記錄到 QA 清單。  
**必看**：
- crawler 是否真的使用 charset fallback（Content-Type / meta / 預設）
- 失敗是否被記錄（當時可能是覆寫 md，不一定有 jsonl 歷史）

**回歸風險**：
- 轉碼錯誤導致內容亂碼、或抓取失敗率飆高
- 失敗清單覆寫導致追溯困難（後續已改成 jsonl 歷史）

---

### T-0067 gallery-caption / alt 策略
**目標**：空白 alt 正規化為 null/undefined，避免誤產 caption。  
**必看**：
- `html-to-markdown` 收集圖片時：空白 alt 是否變成 `undefined/null`
- teaching adapter test 是否覆蓋「空白 alt → caption 不應被塞值」

**回歸風險**：
- alt/caption 混用造成大量錯誤圖說
- zh-CN pipeline 對空白字串處理不一致

---

### T-0068 teaching anchor preservation
**目標**：保留 `<a name/id>` anchor（無 href 的情況），避免深連結失效。  
**必看**：
- HTML→MD 是否輸出 `<a id="..."></a>`（或等價保留方式）
- 測試是否覆蓋 `<a name="item02" class="chinese">（二）</a>` 這類 case

**回歸風險**：
- anchor 被吃掉 → 站內連結/外部引用失效（高風險）

---

### T-0070 magazine_issue_attachments / flipbook+PDF schema（docs-only）
**目標**：在 schema 中預留 flipbook/pdf/page_image_set（含 is_visible）。  
**必看**：
- schema 欄位命名一致、用途清楚
- WP content model/ACF 對應是否清晰
- is_visible 的語意是否明確（未放=不呈現 vs 放=呈現）

---

### T-0072 handoff zip versioned filenames + task_id + no-BOM manifest
**目標**：交接包版本化、保留原路徑、MANIFEST UTF-8 無 BOM。  
**必看**：
- ZIP 檔名規則是否被文件寫死、且工具能產出
- ZIP 內是否保留原始路徑（不 flatten）
- `docs/REVIEWS/README.md` 是否定義 review 檔命名

---

### T-0073 batch-run records（純紀錄）
**目標**：紀錄 0066–0072 的執行結果與 handoff 清單。  
**必看**：
- handoff 清單是否完整、任務是否對得上
- 是否有「錯列或遺漏」zip 名/commit

---

### T-0074 remove BOM + add check:no-bom
**目標**：全 repo 清 BOM，新增檢查腳本避免回歸。  
**必看**：
- `npm run check:no-bom` 是否存在且可用
- 是否會誤掃 binary（應排除或安全處理）

---

### T-0077 improvements tracker + discussion rule
**目標**：小優化/bug 的追蹤與「需討論 vs 直接做」規則。  
**必看**：
- `docs/IMPROVEMENTS/IMPROVEMENT_BACKLOG.md` 欄位清楚可用
- workflow 是否寫死：小優化必登記、需討論要主動提出 A/B/C

---

### T-0078 fix notes handoff list + RAW links
**目標**：修正 notes 清單與連結一致性。  
**必看**：
- notes 是否沒有「過時 / 重複 / 斷鏈」的 raw/handoff 清單

---

### T-0079 WordPress importer push (staging dry-run default)
**目標**：dry-run 預設、可加 `--push` 才真的打 WP；提供 `.env.wp.example`。  
**必看（安全/正確性）**：
- 預設不得 push（必須明確 dry-run）
- WP 認證是否只從 env 讀取、不可寫入 repo
- HTTP 失敗要可追溯（log/exit code）

---

### T-0080 security hardening + security:scan
**目標**：建立安全規範、加入掃描腳本、SECURITY_AUDIT。  
**必看**：
- `npm run security:scan` 是否存在、並能在 CI 跑
- `.gitignore` 是否涵蓋 `.env*`、key/pem、temp zips、deploy 憑證

---

### T-0081 handoff source_commit autodetect + manifest assert
**目標**：MANIFEST.source_commit 必須等於 git HEAD；不符直接 fail。  
**必看**：
- 沒傳 `--source_commit` 時是否自動取 HEAD
- 檔名是否含 HEAD7（避免拿錯包）

---

### T-0082 security:scan strictness + env example exceptions
**目標**：strict 模式會因 history 命中而 fail；example env 允許。  
**必看**：
- strict 的阻斷條件是否合理
- docs placeholder 是否只 warn

---

### T-0083 zh-TW → zh-CN pipeline docs 單一真相
**目標**：繁轉簡流程文檔單一真相、交叉連結一致。  
**必看**：
- canonical 文件位置是否明確
- 舊檔是否只保留「指向新檔」

---

### T-0085 crawler politeness（規範→落地→rerun）
**目標**：延遲、jitter、backoff、UA/Referer；QA 失敗歷史。  
**必看**：
- 是否真的有 jitter delay + exponential backoff（含 cap）
- QA 是否 append-only（jsonl）且摘要可讀

---

### T-0087 Debug V3 foundation（templates + workflow + CI）
**目標**：CI 自證（test/build/zh-cn/bom/security），產出 `ci_summary.md/json` + artifacts；建立 DEBUG_V3 資料夾。  
**必看**：
- workflow 是否可跑（node 版本、npm 安裝）
- summary 是否易讀（給法師看也懂）
- artifacts 是否包含 AUDITS/QA/terminal_logs

---

### T-0088 POC 100 pages（若有）
**目標**：跑 100 頁產指標、bug_report、checklist（依 DEBUG V3）。  
**必看**：
- 是否有 metrics（fails rate / pass rate / sample checklist）
- 是否可重跑（命令、輸出位置）

---

### T-0089 crawler politeness implementation + QA history（最終實作版）
**目標**：politeness/backoff/UA/Referer + JSONL history + md summary。  
**必看**：
- JSONL 是否含 task_id/source_commit/retry_count/錯誤分類
- 不可覆寫歷史（append-only）

---

### T-0090 靜態首頁原型（dev-only）
**目標**：British Museum × Kyohaku 的首頁風格 prototype（零依賴）。  
**必看**：
- Desktop mega menu / Mobile drawer 行為
- hero carousel：auto/dots/prev-next + RWD
- 預留 data-field 便於未來串 Directus/Astro

---

### T-0091 crawler QA history & docs cleanup（若已做）
**目標**：收斂 crawler QA history、文件整理、摘要生成腳本等。  
**必看**：
- 是否把 jsonl→md 摘要自動化
- 是否清掉舊流程/文件矛盾

---

## 4) 給外部 AI 的「一鍵提示 Prompt」（貼給 Gemini/Grok/其他 AI）

```text
你是資深工程 reviewer。請根據我提供的 TEMP ZIP（含 MANIFEST）做 code+docs review，
輸出一份 Markdown 報告（用 BUG_REPORT_TEMPLATE 格式），必須包含：
1) High/Medium/Low 分級
2) 每個問題：重現步驟（若需）、預期/實際、影響範圍、建議修法、驗收方式
3) 若是 docs-only：指出矛盾/缺漏/單一真相不清楚之處
4) 若是 code 任務：指出回歸風險與最小修補方向（不要大改架構）
5) 最後附「建議下一顆 T / 小優化清單」

請先從 MANIFEST.json 校驗 task_id/source_commit 與 ZIP 結構，再開始 review。
```

---

## 5) Reviewer 的回報要放哪？

建議 repo 內固定放：
- `docs/REVIEWS/`
- 命名：`REVIEW-T-XXXX-<slug>.md`  
例如：`docs/REVIEWS/REVIEW-T-0089-crawler-politeness.md`
