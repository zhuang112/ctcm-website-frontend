# 中台世界專案協作工作流程（User / ChatGPT / 實作 Agent）

> 檔名：`docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`  
> 版本：2025-12-10（由 ChatGPT 更新）
> 目標：讓你只需要做關鍵決策與簡單 copy / paste，技術細節與執行由 ChatGPT + 實作 Agent（目前主要是 Codex）自動接力完成。
> 本檔案原為舊版 workflow（Windsurf 版），已在 T-0010 任務中改名為 WORKFLOW_CHATGPT_GITHUB_AGENT.md。
> **提醒：本檔為協作流程與安全規則的單一真相來源，其他文件僅作摘要或歷史備忘。**

---

## 1. 角色分工與單一真相來源

### 1.1 你（使用者）

- 決定 **做什麼**、**先做哪個**。
- 在 ChatGPT 與 Windsurf 之間負責「簡單傳遞」：  
  - 把 ChatGPT 給 Windsurf 的指令貼給 Windsurf。  
  - 把 Windsurf 的「任務回報摘要」貼回 ChatGPT。
- 負責執行 **有限幾條安全指令**（例：`git status` / `git add` / `git commit` / `git push` / `npm run ...`）。
- 不需要寫程式、不需要自己 Debug，只要看得懂「任務說明」與「回報摘要」。

### 1.2 ChatGPT（架構師＋文件機器＋任務設計者）

ChatGPT 負責：

- 設計整體架構與流程（HTML → AnyContent → zh-CN → WordPress → React）。
- 拆解成一顆一顆的 T 任務（T-0001, T-0002, ...）。
- 撰寫與維護專案文件：
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`
  - `docs/CONTENT_SCHEMA.md`
  - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
  - `docs/PROJECT_STATUS.md`
  - `docs/PROJECT_TODO.md`
  - `docs/TOOLS_ROLES_AND_BOUNDARIES.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`
  - `docs/PENDING_DECISIONS.md` …
- 為每一個 T 任務寫出「可以直接貼給 Windsurf / Codex 的短指令」。

原則：

- **所有長篇規格、思考過程與設計細節，都寫進 `docs/*.md`，不要塞在對話裡。**
- 對話中保持「摘要＋指令」，讓每個新對話能快速接上。

### 1.3 Windsurf（本機 IDE 實作 Agent）

Windsurf 在你的本機 repo 中實作：

- 修改 TypeScript / React / 工具程式碼。
- 維護對應測試（Vitest / typecheck）。

職責：

- 依照 ChatGPT 給的任務指令，修改特定檔案。
- 只在允許的範圍內 refactor，不擅自大改其他模組。
- 執行測試、產生 terminal log，並把重點結果寫進：
  - `docs/Windsurf_ChatGPT_NOTES.md`
  - `docs/terminal_logs/*.txt`
- 在回報摘要最後提供一段 `[建議 git 指令]`，讓你可以直接 `git add / commit / push`。

重要限制：

- Windsurf **不會自動執行 `git add` / `git commit` / `git push`**，只會提供指令給你手動確認。

### 1.4 Codex（雲端實作 Agent，未來可選）

Codex 的角色類似 Windsurf，但在「雲端」執行：

- 可以在 GitHub / 雲端環境改 code、跑測試。
- 適合跑「較大顆」的任務（例如批次格式化、批次轉檔、CI 工具）。

規則與 Windsurf 類似：

- 遵守 `docs/TOOLS_ROLES_AND_BOUNDARIES.md`。
- 所有長規格寫回 docs。
- 提供 `[Agent 回報摘要]`＋ `[建議 git 指令]`。

目前可以先視為「Windsurf 的擴充」，等未來需要再大量使用。

### 1.5 單一真相來源（Single Source of Truth）

- **GitHub repo 的 `main` 分支 + `docs/*.md`** 是唯一權威來源。
- ChatGPT / Windsurf / Codex 的說法如果互相衝突，以 **GitHub 上最新的 docs** 為準。
- 若 ChatGPT / Agent 的回答與 docs 不一致：
  - 優先更新 docs。
  - 再請 ChatGPT / Agent 依 docs 調整說法。

### 1.6 GitHub 作為唯一真相 & push 規則

- GitHub（預設：`main` 分支）是程式碼與 docs 的單一真相來源：
  - ChatGPT 需要了解目前專案狀況時，優先以 GitHub 的內容為準。
  - 本機尚未 `commit` / `push` 的修改，視為「尚未正式生效」。
- 每一個 T-XXXX 任務的標準結束流程：
  1. 實作 Agent（目前主要是 Codex）完成程式與 docs 修改。
  2. 本機跑必要的測試 / lint（若有 script，如 `npm test`、`npm run typecheck`）。
  3. 使用 git 將相關檔案 commit，commit message 至少包含：
     - T 任務編號（例如 `T-0007 docs-snapshot-cli: ...`）
     - 簡短說明本次變更。
  4. 將該 commit push 到遠端（預設 `origin/main`）。
  5. 在 `docs/Windsurf_ChatGPT_NOTES.md` 對應 T 任務的小節中，紀錄：
     - 完成時間
     - 最後 push 的 commit hash（例如 `commit: abc1234`）
     - 簡要變更摘要。
- ChatGPT 在分析程式碼 / docs 時：
  - 預設以 GitHub 上的 `main` 分支為準。
  - 若 GitHub 無法存取（網路 / 權限問題），必須明確告知使用者，不得假設 GitHub 狀態。
- snapshot ZIP（`npm run snapshot:docs -- --task T-XXXX`）的定位：
  - 作為「例外情況」的備用方案，而不是主要資訊來源。
  - 典型使用情境：
    - 需要讓 ChatGPT 檢查本機尚未 commit 的變更。
    - 需要傳遞較大的 log / 中間產出，不適合直接 commit 到 repo。
  - 若當前 T 任務已經有對應的 commit 並 push 到 GitHub，優先讓 ChatGPT 直接讀 GitHub，而不是重新上傳 ZIP。

### 1.7 GitHub RAW 連結規則（給 ChatGPT 用）

為了讓 ChatGPT 能穩定讀取 repo 裡的 docs，而不是只看到 GitHub 頁面的外框，本專案對 `zhuang112/ctcm-website-frontend` 採用以下 RAW 連結規則：

- Repo：`zhuang112/ctcm-website-frontend`
- 預設分支：`main`
- RAW base URL（給 ChatGPT 用）：

  ```text
  https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/
  ```

- 對於 repo 內的任何檔案路徑（例如 `docs/PROJECT_TODO.md`），ChatGPT 應優先用下列 RAW URL 讀取內容：

  ```text
  Base + 相對路徑

  範例：
  docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md
  → https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md

  docs/PROJECT_TODO.md
  → https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md
  ```

- ChatGPT 在本專案中必須遵守的行為：

  1. 當使用者或實作 Agent 在對話中直接提供 `raw.githubusercontent.com` 開頭的連結時（RAW 連結），  
     ChatGPT 應自動讀取該檔案全文；若讀取失敗（404 / 網路 / 權限問題），必須明確回報，  
     不得假裝已讀取內容。

  2. 當使用者或實作 Agent 在對話中提到本 repo 的檔案相對路徑，並明確表示要「從 GitHub 讀取」時，例如：  
     - 「請從 GitHub 讀取 `docs/PROJECT_TODO.md`」  
     - 「請看 GitHub 上的 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`」

     則 ChatGPT 應自動組合上述 RAW base URL + 相對路徑，  
     形成對應的 RAW URL，並以該 RAW URL 讀取檔案內容。

  3. 若 RAW 連結無法讀取（例如路徑打錯、分支名稱不符、檔案不存在），  
     ChatGPT 不得用記憶或舊 snapshot 當作「最新版」，  
     必須回報問題並請使用者提供：
     - 正確的 RAW 連結，或
     - 最新的 docs snapshot ZIP，或
     - 直接貼上需要分析的段落。

- 注意事項：
  - 本規則僅適用於本 repo（`zhuang112/ctcm-website-frontend`）的 `main` 分支。  
    若未來使用其他分支或 fork，需要在本小節更新 RAW base URL。
  - 在本專案的對話中，可以簡單說：
    - 「請從 GitHub 讀取 `docs/PROJECT_TODO.md`」，  
      ChatGPT 會自動以 RAW 連結 `https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md` 來讀取。
  - docs snapshot ZIP（備援，不是單一真相）：
    - 定位：只作為 ChatGPT / Agent 的備援，不是單一真相；真相以 GitHub/main + notes 為準。
    - 檔名建議：包含 T 編號＋日期，例如 `ctworld-docs-T-0007-2025-12-10-v1.zip`。
    - 使用順序：若 RAW 可讀，以 RAW（GitHub/main）為準；RAW 無法讀或被阻擋時，再使用最新 snapshot 或請使用者上傳本機檔。

#### RAW 無法讀取時的停用規則

- ChatGPT 在以下情況必須 **立即停止** 針對該檔案內容提出推論或建議：
  - RAW URL 能打開頁面但實際內容缺漏/無法解析（只看到框架或空白）。
  - 被工具或 sandbox 阻擋，無法取得 RAW 內容。
  - RAW 直接回傳 404 / 403。
- 停用動作：
  - 不得依舊記憶或舊 snapshot 猜測內容。
  - 回報「RAW 無法讀取」，請使用者貼上本機檔案或重新上傳 snapshot，待取得可讀內容後再分析。

### 1.8 Notes 中必須附上 RAW 連結

- 每一個 T-XXXX 任務完成後，實作 Agent 必須在 `docs/Windsurf_ChatGPT_NOTES.md` 的對應小節中，紀錄：
  - 任務標題與日期
  - 實際修改／新增的檔案清單
  - 測試指令與結果（若有）
  - 最後 push 的 commit hash（例如 `commit: 27caf76`）
  - 一個「變更檔案（含 RAW 連結）」區塊
- RAW 連結的格式例如：

  ```markdown
  變更檔案（含 RAW 連結）：

  - docs/PROJECT_TODO.md  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

  - docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md

  - docs/Windsurf_ChatGPT_NOTES.md  
    RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
  ```

- ChatGPT 在 review 任務時，可以只看 notes 中的這個區塊，直接點 RAW 連結打開每一個變更檔案的最新內容。
- 若未來 repo 名稱或預設分支有變更，必須同步更新本小節中的 RAW base URL 與示範連結。

### 1.9 實作 Agent 的 sandbox / full access 規則

- 只允許在本 repo 目錄內操作：`cwd` 指向 `ctcm-website-frontend/`，避免跨出專案根目錄（禁止對 `../` 做破壞性指令）。
- sandbox / approval 設定：
  - 若 IDE/Agent 已開啟 full access（無 sandbox + auto-approve），仍需遵守本小節的範圍限制。
  - 若處於受限模式，必要時請求 allow，但以不超出專案根目錄為原則。
- 安全界線：
  - 禁用破壞性指令：`rm -rf /`、`rm -rf ..`、修改全域 git config / hosts 等與專案無關的項目。
  - 對 repo 的變更需正常 `git status` 檢查與 notes 紀錄，避免隱性修改。
- 工作流程不變：
  - 依 `PROJECT_TODO` / `Windsurf_ChatGPT_NOTES` 條目執行任務。
  - 變更完成後，`git add` / `commit` / `push`，並在 notes 記錄 commit hash 與 RAW 連結。
  - ChatGPT 會以 notes + RAW 連結 review，不在對話中展開長篇細節。

### 1.10 Safety levels：test/build/zh-CN/RAW/審核

- 基本原則：
  - 只要任務碰到 `src/`、`tools/`、`tests/` 或程式會讀寫的 `data/`，收尾前一律跑 `npm test` **與** `npm run build`。
  - 任務若涉及 zh-CN pipeline 或新增/修改 zh-CN JSON，再加跑 `npm run check:zh-cn`；有 ERROR 先修復或開 T 任務，無法通過不得 push。
  - 純 docs/INSTR 編輯可不跑 test/build，但需在 notes 明講「docs-only，未跑 test/build」。
- RAW 可讀性：
  - 預設 ChatGPT 直接讀 GitHub RAW；若 RAW 404/無法讀取，必須停止推論，請使用者貼本機檔或提供 snapshot，待可讀內容後再繼續。
- schema / mapping 調整：
  - 任何新增欄位、調整 mapping（HTML→Markdown、AnyContent、zh-CN 白名單）都要在 docs 先寫清楚，並標記「需 ChatGPT review」後再實作。
- /dev/compare、檔案樣本：
  - 若任務需要 sample/對照（如 compare 頁），優先用 repo 內現有樣本；缺料時在 notes 記錄阻礙，避免自行對外抓資料。

### 1.11 ChatGPT review 輸出規則（T-0060 起）

- ChatGPT 回應時先給「結論/判斷」（可否視為完成）、再列「重點註記」（bug/風險/TODO），如需更多檔案一次列出需求。
- 若有未定案議題，提出 A/B/C 選項請使用者決策，必要時建議另開 T + INSTR。
- 不在對話中長篇描述 Codex 的執行過程；細節寫回 docs/notes。

### 1.12 ChatGPT 交接檔（docs/TEMP/ → docs/TEMP.zip + MANIFEST，v5.2）

- 單一交接包：ChatGPT review **只看 `docs/TEMP.zip`（內含 `docs/TEMP/` 檔案與 `MANIFEST.json`）**，避免同時混用 RAW / 零散檔。  
- staging 規則：`docs/TEMP/` 只作為暫存，zip 完成後應可清空；repo 內不得同時保留舊的 `docs/TEMP/` 與 `docs/TEMP.zip` 造成混淆（`.gitignore` 已忽略兩者）。  
- 命名：原始路徑的 `/` → `__`，置於 `docs/TEMP/`。例：`src/wp/import/anycontent-to-wp.ts` → `docs/TEMP/src__wp__import__anycontent-to-wp.ts`
- MANIFEST（必備）：`docs/TEMP/MANIFEST.json` 為 UTF-8（無 BOM），至少包含：  
  - `generated_at`（ISO 8601）、`repo`、`source_commit`（zip 生成時可追溯的 commit）、`task_id`。  
  - `files[]`：每筆列出 `temp_path`、`repo_path`（repo 相對路徑，勿出現 `docs/docs/...` 類重複）、`sha256`、`bytes`。  
  - 可另附 `MANIFEST.sha256.txt` 供校驗。  
- 流程：  
  1) 將需審檔案複製到 `docs/TEMP/`，產出 `MANIFEST.json`（含 sha256、bytes）。  
  2) 壓縮為 `docs/TEMP.zip`（`.gitignore` 已忽略 `docs/TEMP/` 與 `docs/TEMP.zip`）。  
  3) 回報時提供 `docs/TEMP.zip` 與 MANIFEST 的 `source_commit`，提醒使用者上傳給 ChatGPT。  
  4) review 完成即可清空 `docs/TEMP/`（不影響 git）。  
- 自動化（推薦）：可使用 `npm run handoff:tempzip` 產生 TEMP + MANIFEST + ZIP；如自訂腳本，亦需遵守上述欄位與路徑規則。

### 1.13 檔案編碼與行尾（防止亂碼）

- 所有文字檔一律使用 `UTF-8`，行尾使用 `LF`；已在 `.editorconfig` / `.gitattributes` 強制設定。
- 若在 Windows 看到亂碼，請先 `chcp 65001`，或在編輯器選擇「以 UTF-8 重新開啟」。
- 禁止以 ANSI / Big5 另存；如誤存請改回 UTF-8 並重新提交。

### 1.14 RAW 無法開啟時的本機上傳 fallback（給 ChatGPT 用）

- ChatGPT 每次看到 `raw.githubusercontent.com/...` 連結時，會嘗試直接讀取 RAW 內容。
- 若因工具限制、404 或權限問題 **無法讀取檔案本體**，必須在回覆中明講：
  - 說明「哪一個 RAW URL 或檔案路徑」打不開。
  - 不得假裝已讀過，也不得猜測檔案內容。
- 若該檔案是後續判斷所需，ChatGPT 應請使用者：
  - 在對話中直接「上傳本機檔案」（例如某個 HTML / JSON / markdown）。
  - 之後以「上傳的檔案」作為唯一真相來源繼續分析，不再猜測。
- 若日後 GitHub RAW 與上傳版本有差異：
  - 以最新、經使用者確認的版本為準（通常是上傳檔案），並在 notes 記錄差異來源。

### 1.15 Codex 回報 Gate（最小回報集）

Codex 每顆 T 完成且 push 後，回報維持精簡四要點：  
1) 結果：已完成 T-xxxx。  
2) main commit hash。  
3) 測試指令執行情況（或標註 docs-only 未跑）。  
4) TEMP：已準備 `docs/TEMP.zip`（含 MANIFEST，source_commit=...）；若有阻塞/測試失敗則在此說明。  
細節（變更檔案、RAW 連結、決策）一律寫入 notes。
---

## 2. 檔案與資料夾結構（簡要）

> 詳細結構請參考 `ARCHITECTURE.md` 與 `CONTENT_SCHEMA.md`。這裡只列出與協作流程最相關的部分。

- `src/`：前端 React / TypeScript 程式碼。
- `tools/`：各種 CLI 與輔助工具（爬蟲、轉檔、docs snapshot 等）。
- `data/`：後續 AnyContent、zh-tw / zh-cn JSON 等資料存放位置（目前仍在規劃中）。
- `docs/`：
  - `COMPLETE_PROJECT_WORKFLOW.md`：專案整體 workflow。
  - `CONTENT_SCHEMA.md`：AnyContent schema 設計。
  - `HTML_TO_MARKDOWN_RULES_V4.md`：HTML → markdown 規則 v4。
  - `PROJECT_STATUS.md`：目前整體進度與下一階段建議。
  - `PROJECT_TODO.md`：T 任務列表與狀態（✅ 已完成 / ⬜ 未完成）。
  - `PROJECT_TODO_TEMPLATE.md`：新增 T 任務的模板。
  - `TOOLS_ROLES_AND_BOUNDARIES.md`：User / ChatGPT / Windsurf / Codex 的角色與邊界。
  - `Windsurf_ChatGPT_NOTES.md`：每個 T 任務的實作日誌與交接說明。
  - `PENDING_DECISIONS.md`：尚未決定或未完全定案的設計點。
  - `SESSION_CHECKLIST.md`：每輪對話的檢查清單。
  - 其他：爬蟲、zh-CN pipeline、archive 等相關文件。
- `docs/terminal_logs/`：
  - 每次執行重要指令（如 `npx vitest`、`npm run snapshot:docs` 等）產生的 log。
  - 檔名慣例：`T-000X_任務描述_指令說明.txt`。
- `snapshots/`（不納入 git）：
  - 給 ChatGPT 用的 docs snapshot ZIP，例如：
    - `ctworld-docs-T-0007-2025-12-09-v1.zip`
  - 由 `tools/docs-snapshot/make-docs-snapshot.ts` 產生。

---

## 3. 一般工作循環（高階流程）

這一節描述你 + ChatGPT + Windsurf 之間的一般循環。  
細節與範例則寫在 `PROJECT_TODO.md` 與 `Windsurf_ChatGPT_NOTES.md` 中。

### 3.1 ChatGPT 與你：選擇下一個 T 任務

1. 你開啟 ChatGPT 對話（或新對話）時，提供：
   - GitHub repo 名稱（例如：`zhuang112/ctcm-website-frontend`）。
   - 最新的 docs snapshot ZIP（或要求 ChatGPT 直接閱讀 GitHub 上的 docs）。
2. ChatGPT 先閱讀：
   - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`
   - `docs/TOOLS_ROLES_AND_BOUNDARIES.md`
   - `docs/PROJECT_STATUS.md`
   - `docs/PROJECT_TODO.md`
   - `docs/Windsurf_ChatGPT_NOTES.md`
3. ChatGPT 將用自己的話：
   - 重述目前專案狀態與最近完成的 T 任務。
   - 在 `PROJECT_TODO.md` 中，挑出一個「最適合現在執行的 T 任務」，並說明理由。
   - 如果有需要新增 T 任務，會先依 `PROJECT_TODO_TEMPLATE.md` 在 docs 中補上架構。

### 3.2 ChatGPT → Windsurf：撰寫任務指令（短版）

對於每一個具體的 T 任務（例如 `T-0003 news-from-legacy: 建立 NewsContent adapter 骨架`），ChatGPT 會：

1. 在 `docs/PROJECT_TODO.md` 裡，補齊該任務的詳細規格：
   - 任務目標與背景。
   - 要修改／新增的檔案列表。
   - 不可以更動的 contract（型別、函式行為、public API 等）。
   - 要執行的測試指令與預期結果。
2. 產生一段「可以直接貼給 Windsurf 的短指令」，格式類似：

```text
請依照 docs/PROJECT_TODO.md 中的 T-0003 任務說明進行實作，重點如下：

1. 先閱讀：
   - docs/PROJECT_TODO.md（T-0003 小節）
   - docs/CONTENT_SCHEMA.md（NewsContent 相關欄位）
   - docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md（特別是 4.y 小節）

2. 允許修改或新增的檔案：
   - src/adapters/news-from-legacy.ts
   - tests/adapters/news-from-legacy.spec.ts
   - 其他與 NewsContent 直接相關、在 T-0003 任務說明中列出的檔案。

3. 不可以變更的 contract：
   - 已存在的 AnyContent 型別定義（除非 T-0003 任務明確允許）。
   - 其他 T 任務尚未觸及的 adapter 行為。

4. 請執行並確保以下測試通過：
   - npx vitest tests/adapters/news-from-legacy.spec.ts

5. 任務完成後：
   - 更新 docs/Windsurf_ChatGPT_NOTES.md，新增 T-0003 小節，說明修改內容與測試結果。
   - 在 docs/terminal_logs/ 新增本次 vitest 執行結果的 log 檔。
   - 在回報摘要最後加上一段 [建議 git 指令]，方便我在本機執行 git add / commit / push。
```

### 3.3 你要做的事（每個任務循環）

- 把 ChatGPT 產生的「任務指令」整段複製，貼給 Windsurf。  
- 等 Windsurf 完成任務並給出回報摘要後：
  - 把「回報摘要」貼回 ChatGPT，讓 ChatGPT 幫你檢查是否符合任務說明。
  - 確認沒問題後，再依 Windsurf 提供的 `[建議 git 指令]` 在本機執行 `git add / commit / push`。

### 3.4 Windsurf 要做的事（每個任務循環）

Windsurf 根據 ChatGPT 給的指令：

- 修改程式碼與測試。  
- 在 terminal 自動跑安全指令（`npx vitest`、`npm run lint`…）。  
- 更新 `docs/Windsurf_ChatGPT_NOTES.md` 對應小節，記錄：
  - 任務標題與日期。
  - 實際修改的檔案與重點邏輯。
  - 執行了哪些測試／結果如何。
  - 若有卡關，寫「無法解決的問題」段落。
- 在回報摘要最後給你一段 `[建議 git 指令]`，會特別為 ChatGPT / 你設計成可直接貼的文字。

### 3.5 對話與文件分工：細節進 docs，對話保持精簡

**對話窗保持精簡**：

- ChatGPT：在對話中只給「任務摘要 + 給 Windsurf 的短指令」，所有長篇規格與細節寫進 docs（例如 `WORKFLOW_*`、`CONTENT_SCHEMA.md`、`Windsurf_ChatGPT_NOTES.md`）。
- Windsurf：回報時只需提供「本次任務代號 + 變更檔案列表 + 測試結果 + [建議 git 指令] 區塊」，不需要貼出完整思路或大段 diff。

### 3.6 ChatGPT ↔ 實作 Agent 的溝通格式（code block＋notes）

為了讓使用者只需要做「轉貼」而不用自己整理指令，本專案規定：

- ChatGPT 對使用者的回應，預設分成兩個部分：
  1. **簡短摘要**：用自己的話說明這次要做的任務（例如要改哪些 docs / 實作哪個 T 任務）。
  2. **給實作 Agent 的完整指令**：以「單一 code block」呈現，可以直接貼給實作 Agent（目前為 Codex）。  
     指令中會明寫：
     - 需要修改 / 新增的檔案列表
     - 允許修改的範圍（通常是特定檔案或 TODO 區塊）
     - 要執行的測試指令與預期結果
     - 收尾動作（git add / commit / push、更新 notes）

- 使用者只需要：
  - 把 ChatGPT 提供的 code block 原封不動貼給實作 Agent。
  - 任務完成後，將實作 Agent 的回報摘要貼回 ChatGPT。

- 實作 Agent（目前為 Codex）完成任務後，對使用者應提供「極簡回報」：
  - 指明已完成的 T 任務編號（例如 `T-0011`）。
  - 提醒使用者：「詳細請看 notes 的哪一個小節」，例如：  
    `請看 docs/Windsurf_ChatGPT_NOTES.md 中 2025-12-12 任務：T-0011 小節（內含 RAW 連結）。`
  - 其餘細節（變更檔案、測試內容、疑問）一律寫入 `docs/Windsurf_ChatGPT_NOTES.md`，而不是塞在對話裡。
- code block 規範：
  - 不得出現 citation / content reference（例如 `::contentReference[...]`、`oaicite:0` 等），避免污染貼給 Agent 的指令。
  - 若 ChatGPT 需要引用內容，請在 code block 之外以文字描述，不要在 code block 中夾帶引用標記。

- ChatGPT 在 review 任務成果時，會依據 notes 中的資訊與 RAW 連結：
  - 先讀 `docs/Windsurf_ChatGPT_NOTES.md` 對應小節。
  - 再透過 notes 中提供的 RAW 連結打開各個異動檔案，確認內容是否符合任務說明。
  - 若發現問題或需要新任務，會再產生下一個 T 任務的 code block 指令。

### 3.6 code 任務一律先跑 test + build 才能收尾

- 適用範圍（需跑 test+build 的任務類型）：
  - `src/` 內的程式碼、型別、i18n/pipeline。
  - `tools/` 內的 CLI / script。
  - `tests/` 內的測試檔。
  - `data/` 內若涉及程式解析/轉換會讀寫的資料（CSV/JSON 等）。
- 收尾規則：
  - 這些任務在 commit 前，預設都要執行 `npm test` **以及** `npm run build`，兩者都需通過。
  - 若任務本身就是為了修復 test/build 失敗，可以在 notes 中記錄當前錯誤與狀態，但不得隱瞞未通過的結果。
- 例外：
  - 純 docs/INSTR 編輯不強制跑 test/build。
  - 若因外部阻礙（例如依賴未備妥）暫時無法通過，需在 notes 清楚記錄錯誤訊息、原因與下一步建議。

### 3.7 zh-CN JSON 健康檢查（check:zh-cn）

- 只要任務涉及 zh-CN pipeline 或新增 / 調整 zh-CN JSON，請在收尾流程加入：
  - `npm run check:zh-cn`
  - 若輸出有 **ERROR**，先修復或開 T 任務處理，暫停 push；只有 WARN 或無問題時再進行 git 收尾。
- 主要檢查：
  - zh-TW / zh-CN JSON 是否成對存在。
  - `post_type` / `slug` / `old_url` / `language` 一致性。
  - 依 `ZH_TW_TO_ZH_CN_PIPELINE.md` 白名單，確認 `post_title` / `post_excerpt` / `body_markdown`、meta string、`seo.meta_title` / `seo.meta_description` 等欄位在 zh-CN 版本存在。

### 3.8 撰寫 INSTR 的必要資訊（給 ChatGPT 檢閱）

- INSTR 要明列「需要 ChatGPT review 的檔案清單」，方便 ChatGPT 直接開 RAW：
  - 列出 src / tools / tests / docs 相關檔案，commit 後在 notes 補 RAW 連結。
  - INSTR 內不要放 citation 或 `::contentReference[...]`；保持可直接貼給 Agent 的指令格式。
- 若任務涉及 schema / pipeline / rules，請在 INSTR 指明 ChatGPT 要先讀的 docs（如 RULES_V4 / CONTENT_SCHEMA_V1 / ZH_TW_TO_ZH_CN_PIPELINE）。
- 長規格放 docs，INSTR 只放必要的檔案清單與步驟，避免佔位符與註解。

### 3.11 每個 T 任務都要有對應的 INSTR .md（T-0052）

- 原則：**沒有 INSTR 不開工**。在 `docs/INSTR/` 下建立 `INSTR-T-xxxx-<slug>.md`，內容至少列任務目標、允許修改的檔案、必跑測試、收尾與 notes 更新規則。
- ChatGPT 發任務時務必指定 INSTR 檔名；實作 Agent 只在 INSTR 列出的範圍內動手，若缺 INSTR 或範圍不明，先回報、不要自行擴張。
- INSTR 應指向 `PROJECT_TODO` 對應的小節，並要求完成後更新 notes（含 RAW 連結與 commit hash）。
- 例外：純文檔小修若已在 INSTR/TODO 明示可省略，需在 notes 註記「docs-only / 未跑 test/build」；其他任務一律遵守 T + INSTR 配對。

### 3.9（前瞻）分支策略的提醒

- 目前預設直接在 `main` 上工作並 push。
- 若未來有多人協作或需要大型重構，可開啟 `feature/T-xxxx-*` 分支並走 PR 流程；但未啟用前請維持 main 為單一真相來源。

### 3.10 無法歸類內容的處理（HTML→Markdown / AnyContent）

- 若在撰寫或調整 HTML→Markdown / AnyContent adapter 時，遇到暫時無對應欄位的片段：
  - 文字優先放 `body_markdown`，不要臨時新增 meta 欄位或未知 key。
  - 保留 `old_url`、legacy HTML 來源，方便日後對照。
  - 若發現常見且需要新欄位，請在 notes 記錄並另開 T 任務，再更新 schema/adapter。
- 如需標記仍有未分類內容，可在 AnyContent JSON 設 `meta.has_unclassified_content = true`，並用 `meta.unclassified_notes` 簡述暫存原因；不強迫當下拆欄位。
- 規則詳見 `docs/HTML_TO_MARKDOWN_RULES_V4.md` 的「未知內容 fallback」段落。

**細節全部寫在文件**：

- 任務規格與邏輯說明：  
  放在 `docs/PROJECT_TODO.md` 對應的 T 任務小節。
- 實作細節與歷史：  
  放在 `docs/Windsurf_ChatGPT_NOTES.md`。
- 尚未決定的議題：  
  放在 `docs/PENDING_DECISIONS.md`。

**ChatGPT 只看 docs，不靠舊對話記憶**：

- 新對話啟動時，ChatGPT 先讀最新 docs（或你提供的 snapshot ZIP）。
- 若發現 docs 沒有記錄某個規則，會請你在 docs 中補上，而不是只記在對話裡。

---

## 4. T 任務與 git 流程（Windsurf → 你）

### 4.1 T 任務命名慣例

- 任務 ID：`T-0001`, `T-0002`, ...（零填滿 4 碼）。
- 標題範例：
  - `T-0001 teaching-from-legacy: 將 htmlToMarkdown 的 verses 映射到 TeachingMeta 偈語欄位`
  - `T-0002 AnyContent 其他 post_type：news / magazine contract`
  - `T-0003 news-from-legacy: 建立 NewsContent adapter 骨架（minimal mapping）`

### 4.2 任務的最小單位

一個 T 任務盡量只做「一件清楚的小事」：

- 新增或擴充一個 adapter。
- 定義一個 AnyContent 型別。
- 實作一個 CLI 工具（例如 docs snapshot）。

每個 T 任務的變更都應盡量集中：

- 修改的檔案列表可由 ChatGPT 事先列出。
- 不要同時在多個不相關模組大改。

### 4.3 T 任務的完成條件（Definition of Done）

每個 T 任務完成時，應該至少滿足：

**程式與型別層面**

- 所有相關 `.ts` / `.tsx` 檔能通過 typecheck。
- 新增或修改的函式／型別有合理的命名與註解（如有需要）。

**測試層面**

- 相關 Vitest 測試全部通過，新增的功能具備基本測試覆蓋。
- 如有無法立即補測的情況，需在 `PENDING_DECISIONS.md` 或 T 任務說明中註明原因。

**文件層面**

- `docs/PROJECT_TODO.md` 中對應的 T 任務狀態更新（⬜ → ✅）。
- `docs/Windsurf_ChatGPT_NOTES.md` 新增一個 T 任務小節，記錄：
  - 變更摘要。
  - 主要改動檔案。
  - 執行指令與測試結果。
  - 未解決問題（若有）。
- 如有重大設計決策變更，更新：
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`
  - `docs/CONTENT_SCHEMA.md`
  - `docs/TOOLS_ROLES_AND_BOUNDARIES.md`
  - `docs/PENDING_DECISIONS.md` 等。

**git 層面**

- 本機 `git status` 乾淨（`working tree clean`）。
- 該 T 任務產生的 commit message 建議使用：
  - `feat: T-000X ...`
  - 或 `chore: T-000X ...`（若主要是重構 / 文件）。

### 4.y 每個 T 任務完成後的建議 git 流程（Windsurf → 你）

為了讓 GitHub 上的 repo 永遠貼近「最新已完成的 T 任務」，每一個 T-XXXX 任務收尾時，建議由 Windsurf 在回報摘要的最後，自動多附一段「建議 git 指令」，讓你可以在 IDE / 終端機中直接複製執行。

同時，Windsurf 不會自動執行任何 `git add` / `git commit` / `git push`，只會提供建議指令，由你在 IDE / 終端機中手動確認與執行。

#### 4.y.1 建議的 git 指令區塊格式

Windsurf（或其他實作 Agent）在每次任務完成時，回報摘要的結尾多附一段「[建議 git 指令]」區塊，讓你可以在 PowerShell / 終端機中「整段複製貼上就能執行」，不需要再自行代入參數。

範例（以 T-0007 為例）：

```text
[建議 git 指令]
git status

git add package.json package-lock.json tools/docs-snapshot/make-docs-snapshot.ts docs/PROJECT_TODO.md docs/Windsurf_ChatGPT_NOTES.md docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt

git commit -m "feat: T-0007 docs snapshot CLI"
git push origin main

```
#### 4.y.2 你在本機的實際操作流程

收到 Windsurf 的回報摘要之後，先大致確認：

- 任務是否照 T 任務說明執行。
- 測試是否通過。
- 有沒有列出任何未解決問題。

在專案根目錄打開 PowerShell / 終端機，執行 `[建議 git 指令]` 區塊中的內容：

建議順序通常是：

1. `git status`
2. `git add ...`
3. `git commit -m "..."`
4. `git push origin main`

若你不確定某個指令的作用，可以：

- 先單獨執行 `git status` 觀察變更。
- 有疑問時，把 `git status` 與回報摘要貼給 ChatGPT 請教。



#### 4.y.3 同一個 T 任務中的多步驟自動前進規則（給 Windsurf / Codex）

有些較大的工作會拆成「同一顆 T 任務下的一連串 step」（例如 step01 / step02 / step03）。  
為了減少你在中間一直來回貼指令，只要 **任務說明裡有明確列出步驟與安全範圍**，實作 Agent 可以在同一顆 T 任務內「自動往下一步」，但必須遵守以下原則：

**Agent 可以自動前進到下一個 step 的前提：**

- 當前 step 的任務說明已完成，且：
  - 所有在該 step 任務說明中列出的測試、typecheck 指令全部通過。
  - 沒有新增未解決的錯誤或例外（例如測試紅燈但被忽略）。
  - 不需要更動「不在本 T 任務允許修改清單中的檔案」。
  - 不需要更動 schema / public API 等「跨多顆 T 任務的共用 contract」。
- 當前 step 若有要求更新 docs，已完成：
  - `docs/PROJECT_TODO.md`（補上當前 step 已完成的描述，必要時更新 T 任務狀態）。
  - `docs/Windsurf_ChatGPT_NOTES.md`（在本 T 任務的小節內，新增一段描述目前 step 的修改與測試結果）。
  - `docs/PENDING_DECISIONS.md`（如果在過程中產生新的「暫定規則」或待確認議題）。

在上述條件都滿足時，Agent **可以直接繼續執行下一個 step**，不必每一小步都停下來等 ChatGPT 或你確認。

**Agent 必須「停下來 & 回報」的情況：**

- 任一測試 / typecheck 失敗，且不是 trivially fixable 的 typo。
- 發現必須修改：
  - 不在本 T 任務允許清單中的檔案，或
  - 其他 T 任務負責的模組、全域設定。
- 發現 schema / workflow / contract 層級的設計問題，需要：
  - 更新 `CONTENT_SCHEMA.md`、`COMPLETE_PROJECT_WORKFLOW.md`、`TOOLS_ROLES_AND_BOUNDARIES.md` 等。
- 遇到無法確認的業務規則（例如某欄位要不要 nullable、某種 HTML 是否要支援）。
- 任務說明中明寫「執行到 step N 就暫停，請回報」。

這些情況下，Agent 應該：

- 先停止繼續後續 step。
- 在 `docs/Windsurf_ChatGPT_NOTES.md` 對應 T 任務的小節中：
  - 增加「未解決問題」或「卡關說明」段落。
- 在 `[Agent 回報摘要]` 中清楚說明：
  - 已完成到哪一個 step。
  - 哪些測試已通過。
  - 卡在哪裡、需要 ChatGPT / 你幫忙決定什麼。
- （選用）若問題較多，也可更新 `docs/PENDING_DECISIONS.md` 或 `docs/UNRESOLVED_ISSUES.md` 做集中列表。

> 特別說明：  
> - Agent **絕對不能自行開啟「全新 T 任務」或決定 T-號碼**。  
>   若要新增 T 任務，必須由 ChatGPT 先在 `PROJECT_TODO.md` 設計並命名。  
> - Agent 允許自動前進的範圍，只限於「同一顆 T 任務內、ChatGPT 已事先規劃好的 step01 / step02 / step03」。

---

## 5. `Windsurf_ChatGPT_NOTES.md` 與 `PROJECT_TODO.md` 的搭配

### 5.1 `PROJECT_TODO.md`：任務清單與狀態

每個 T 任務在 `docs/PROJECT_TODO.md` 裡應包含：

- 標題（含 T 編號）。
- 狀態（✅ / ⬜）。
- 任務說明（目標、背景）。
- 要修改的檔案列表。
- 不可更動的 contract。
- 驗收條件（測試／檢查項目）。

ChatGPT 在規劃下一步時，會優先閱讀這份清單。

### 5.2 `Windsurf_ChatGPT_NOTES.md`：實作日誌與交接

每次 Windsurf 完成一個 T 任務，應在 `docs/Windsurf_ChatGPT_NOTES.md` 加一個小節：

- `YYYY-MM-DD T-000X 任務名稱`

小節內容包含：

- 修改檔案列表。
- 關鍵改動說明（例如：新增哪些欄位、修改哪些映射）。
- 執行指令與結果（簡要；詳細 log 在 `docs/terminal_logs/`）。
- 未解決問題與後續建議（若有）。

### 5.3 ChatGPT 如何利用這兩份文件

ChatGPT 在每次新對話開始時會：

1. 讀取 `docs/PROJECT_TODO.md`：
   - 確認哪些 T 任務已完成（✅）。
   - 找出目前開著但未做完的項目（⬜）。
2. 讀取 `docs/Windsurf_ChatGPT_NOTES.md`：
   - 理解最近幾次 T 任務的實作細節。
   - 找出是否有遺留問題或需要 follow-up 的點。

綜合判斷後，提出「下一個建議的 T 任務」，並給出理由。

---

## 6. ChatGPT 開新對話：什麼時候開、怎麼開？

### 6.1 什麼時候建議開新 ChatGPT 對話？

當出現下面任一種情況時，建議「結束目前對話，開一個新的 ChatGPT 對話」，讓 ChatGPT 重新以 docs 為基準冷啟動，而不是繼續累積越來越重的對話歷史：

- 覺得回應明顯變慢、卡頓，或回應開始「答非所問」。  
- 本輪已經完成 1～2 個 T 任務，`docs/PROJECT_TODO.md`、`docs/Windsurf_ChatGPT_NOTES.md` 已有明顯更新。  
- 對話裡已經貼了大量 log / code / 長指令，自己也開始搞不清楚現在在談哪一段。  
- 準備切換到新的主題（例如：從 html-to-markdown 規則，改成討論 zh-tw → zh-cn pipeline）。

在「關掉舊對話 → 開新對話」之前，建議遵守以下流程：

**請實作 Agent 收尾並更新 docs**

- 確認本輪 T 任務的變更已寫入：
  - `docs/PROJECT_TODO.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`
  - （如有需要）`docs/PENDING_DECISIONS.md`
- 若有測試或工具輸出，關鍵 log 已存成：
  - `docs/terminal_logs/T-xxxx_*.txt`

**你在本機手動做的事**

在專案根目錄執行：

```bash
git status
```

依照 `[建議 git 指令]` 區塊執行：

```bash
git add ...
git commit -m "..."
git push origin main
```

執行前先檢查 `[建議 git 指令]`：

- 不能出現 `<...>`、`[...]` 這類佔位符，也不能在指令行內加 `#`、`//` 註解。
- 若有，先請實作 Agent 重新產生一版可直接執行的指令。

**產生新的 docs snapshot（給下一輪 ChatGPT 用）**

在本機執行（依實際任務代號填寫）：

```bash
npm run snapshot:docs -- --task T-xxxx
```

這會在 `snapshots/` 底下產生一個新的 ZIP，例如：

- `snapshots/ctworld-docs-T-0007-YYYY-MM-DD-v1.zip`

`snapshots/` 資料夾與 ZIP 保持未加入 git，只在本機用來傳給 ChatGPT。

**準備好「新對話開場資訊」**

開新對話時，請上傳最新的 docs snapshot ZIP（或指向 GitHub 最新 commit / 分支），並簡單說明：

- 這是「中台世界舊站 → Headless CMS」專案。
- 希望 ChatGPT 先閱讀的檔案清單。
- 最近完成的是哪幾個 T 任務（可以引用 `Windsurf_ChatGPT_NOTES.md` 的標題）。

### 6.2 建議的開新對話開場模板

未來你在 ChatGPT 開新對話，可以這樣開場（可自行調整）：

```text
這是「中台世界舊站 → Headless CMS」專案。

專案 repo：ctcm-website-frontend

請先閱讀這些檔案（如果存在）：
- docs/COMPLETE_PROJECT_WORKFLOW.md
- docs/CONTENT_SCHEMA.md
- docs/HTML_TO_MARKDOWN_RULES_V4.md
- docs/PROJECT_TODO.md
- docs/Windsurf_ChatGPT_NOTES.md
- docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md

目前最新任務小節是：
- docs/Windsurf_ChatGPT_NOTES.md 裡的「YYYY-MM-DD 任務：...」（以及之後的任務，如果有）。

如果我有另外提供 docs snapshot ZIP，請以 ZIP 內的檔案為準，不要再使用舊的 snapshot 或舊版本 docs。

請你：
1. 用自己的話重述目前專案狀態與最近幾次實作 Agent（Windsurf / Codex）的修改重點。
2. 根據 docs/PROJECT_TODO.md 與 notes，幫我挑一個「最適合現在進行」的 T 任務，並說明理由。
3. 為這個 T 任務產生一段「可以直接貼給實作 Agent 的任務指令」（用 code block 包起來），內容包含：
   - 要閱讀的 docs / 章節。
   - 要修改或新增的檔案路徑。
   - 不可以改動的型別／規則（contract）。
   - 要執行的測試指令與預期結果。
4. 之後每一輪新任務，也都用同樣模式提供「簡短任務摘要 + 給實作 Agent 的指令」即可，把所有細節寫回 docs。
```

---

## 7. ChatGPT 可見範圍與 docs snapshot / ZIP 交接

### 7.1 ChatGPT 能看到什麼？

ChatGPT 能看到：

- 你在對話中打的文字。
- 你上傳的檔案（ZIP / `.md` / `.txt` / `.ts` / `.tsx` / `.json` 等）。
- 公開的 GitHub repo（或透過 connector 提供的存取）。

ChatGPT 看不到：

- 你本機的 `F:\` 資料夾（除非你壓縮成 ZIP 上傳）。
- 尚未 push 的本機變更（只存在於 working tree 的修改）。

### 7.2 實作 Agent 完成任務後要做什麼？

Windsurf / Codex 在本機 / 雲端改完 code 之後，應該：

- 更新 `docs/PROJECT_TODO.md`（T 任務狀態與說明）。
- 更新 `docs/Windsurf_ChatGPT_NOTES.md`（實作日誌）。
- 在 `docs/terminal_logs/` 新增執行指令的 log 檔。
- 在回報摘要中附上 `[建議 git 指令]`。

### 7.3 如何讓 ChatGPT 看到完整變更？

**GitHub 路線**

你在本機執行建議的 git 指令：

```bash
git status
git add ...
git commit -m "..."
git push origin main
```

ChatGPT 在新對話中直接閱讀 GitHub 上的 docs / 程式碼。

**docs snapshot ZIP 路線**

在本機執行：

```bash
npm run snapshot:docs -- --task T-xxxx
```

得到一個新的 snapshot ZIP，在新對話中上傳給 ChatGPT。

ChatGPT 以 ZIP 內的內容為準，不會再看舊 ZIP。

---

## 8. 總結

- 你：決定方向＋複製貼上＋偶爾 `git` / `npm install`。  
- ChatGPT：設計架構規格＋拆任務＋寫 docs（大改時提供 ZIP）。  
- Windsurf / Codex：實作程式＋跑測試＋寫 `Windsurf_ChatGPT_NOTES.md`＋輸出回報摘要與 `[建議 git 指令]`。  

只要三方都照這份工作流程走：

- 對話視窗保持「輕量：決策＋指令＋回報」。  
- 詳細規格與操作歷史集中在 Git repo 的 `docs/*.md`。  
- 無論是你、ChatGPT、Windsurf 或 Codex，要接續工作時都能快速銜接。
