# 中台世界專案三方協作工作流程（User / ChatGPT / Windsurf）

> 版本：2025-12-08（由 ChatGPT 更新）

> 目標：讓你只需要做關鍵決策與簡單 copy / paste，  
> 技術細節與執行由 ChatGPT + Windsurf 自動接力完成。

---

## 1. 角色分工與單一真相來源

### 1.1 你（使用者）

- 決定 **做什麼**、**先做哪個**。
- 在 ChatGPT 與 Windsurf 之間負責「簡單傳遞」：
  - 把 ChatGPT 給 Windsurf 的指令貼給 Windsurf。
  - 把 Windsurf 的「回報摘要」貼給 ChatGPT。
- 偶爾執行本機操作：
  - `git add / commit / push`
  - 必要時手動執行 `npm install` 等需要確認的指令。
- 確保 GitHub repo 永遠是 **唯一真相來源**（程式碼 + docs）。

### 1.2 ChatGPT（架構師＋規格機）

- 負責「設計」與「規格」：
  - 規劃整體架構、欄位、流程。
  - 撰寫與更新 `docs/*.md` 規格（大改時會提供 ZIP）。
- 負責「寫任務說明」：
  - 對每個任務產生一段 **「可直接貼給 Windsurf 的指令」**（code block）。
  - 指令包含：
    - 要看哪些 docs。
    - 要改哪些檔案。
    - 不能改動的型別 / 規則。
    - 要跑哪些測試與預期結果。
- 負責「技術決策與 debug 指導」：
  - 閱讀 Windsurf 寫的 notes / 回報，決定下一步。
  - 遇到難題時，設計更精細的修改指令。

### 1.3 Windsurf（實作者＋本機工具）

- 負責「實際動手」：
  - 編輯程式碼與測試。
  - 儘量自動執行安全的指令（`npx vitest`、`npm run lint`…）。
- 負責「寫給 ChatGPT 看的說明檔」：
  - 維護 `docs/Windsurf_ChatGPT_NOTES.md`：
    - 記錄每次任務的需求摘要、修改內容、測試、遇到的問題。
- 負責「回報摘要」：
  - 每次任務結束，輸出一段 **可以給你直接貼回 ChatGPT 的短回報文字**。

---

## 2. 主要協作文件一覽

這些檔案是三方協作時會用到的主要文件：

- `docs/COMPLETE_PROJECT_WORKFLOW.md`  
  舊站 HTML → JSON → zh-cn → WordPress → React 的整體 pipeline。

- `docs/CONTENT_SCHEMA.md`  
  各 post_type 的 AnyContent schema（欄位與說明）。

- `docs/HTML_TO_MARKDOWN_RULES_V4.md`  
  HTML→Markdown 規則與舊站 class 對應（目前唯一權威版本）。

- `docs/PROJECT_TODO.md`  
  中長期任務清單（T-001, T-002...），**由 ChatGPT 維護**。

- `docs/Windsurf_ChatGPT_NOTES.md`  
  **三方交接日誌**：每一次 Windsurf 實作的詳細紀錄，  
  ChatGPT 開新對話時可以讀這個檔案快速接續。

- （選用）`docs/UNRESOLVED_ISSUES.md`  
  Windsurf 解不了的問題集中列出，給 ChatGPT 進一步協助。  
  若同一時間有多個未解決問題，建議在 UNRESOLVED_ISSUES.md 做列表索引，並連回各自於 `Windsurf_ChatGPT_NOTES.md` 中的任務小節，方便你與 ChatGPT 快速定位。

---

## 3. 大改 vs 小改：什麼時候需要 ZIP？什麼時候用指令？

### 3.1 大改（spec / workflow / schema）

符合下列任一者視為「大改」：

- 調整 `CONTENT_SCHEMA.md` 結構（新增欄位、改欄位意義）。
- 大幅更新 `HTML_TO_MARKDOWN_RULES_V4.md` 的規則。
- 新增新的 post_type 或 pipeline 大架構。
- 更新協作流程本身（像這份文件）。

**大改流程：**

1. 由 ChatGPT：
   - 在對話中簡短說明這次大改的重點。
   - 直接編寫 / 更新對應 `docs/*.md` 的完整內容。
   - 將相關 docs 打成 ZIP（例如 `ctworld_docs_xxx.zip`）給你下載。

2. 你：
   - 解壓 ZIP 覆蓋到專案。
   - `git add / commit / push`。
   - 告訴 Windsurf：「請閱讀最新的 docs，之後依此為準。」

> 規則：**大改 → ZIP + 規格寫死在 docs 裡**。

---

### 3.2 小改（程式、小 bug、局部行為）

例如：

- sutra 頁 `<a id="item83"></a>` 沒出現在 markdown。
- 某個 adapter 欄位 mapping 要微調。
- 新增一個 pipeline helper function。
- 補一個測試案例。

**小改流程：**

1. 由 ChatGPT：
   - 產生一段「**給 Windsurf 的任務指令**」（用 code block 包起來）。
   - 內容包含：
     - 要讀的 docs（哪一節）。
     - 要動的檔案路徑。
     - 限制條件（那些型別／規則不能動）。
     - 要跑的測試指令＋預期結果。

2. 你：
   - 只需要 **複製這段指令貼給 Windsurf**。

3. Windsurf：
   - 根據指令修改程式碼。
   - 在 terminal 自動跑安全指令（`npx vitest`、`npm run lint`…）。
   - 更新 `docs/Windsurf_ChatGPT_NOTES.md` 對應小節，記錄：
     - 任務標題與日期。
     - 實際修改的檔案與重點邏輯。
     - 執行了哪些測試／結果如何。
     - 若有卡關，寫「無法解決的問題」段落。
   - 最後給你一段「**回報摘要**」，會特別為 ChatGPT 設計成可直接貼的文字。

4. 你：
   - 把這段回報摘要貼回 ChatGPT。
   - 覺得 OK 的時候再 `git add / commit / push`。

> 規則：**小改 → ChatGPT 給指令（code block），Windsurf 改程式＋寫 notes，回報摘要給 ChatGPT**。  
> 不一定要 re-ZIP，只要主規則沒變就好。

---

## 4. 每一輪任務的標準節奏

### Step 0：啟動新任務（你 → ChatGPT）

在 ChatGPT 這邊說明：

- 這次要處理什麼（例：sutra 規則 v1、blossom 單元、某個 bug）。
- （選擇性）希望這個任務在 notes 中的章節名稱，例如：
  - `## 2025-12-10 任務：sutra 規則 v2`

ChatGPT 會：

- 讀取需要的 docs（`PROJECT_TODO`、`Windsurf_ChatGPT_NOTES`、schema、rules）。
- 規劃任務拆分與限制條件。
- 給你一段「**給 Windsurf 的任務指令**」，用 code block 包起來，方便你一鍵複製。

---

### Step 1：你 → Windsurf

你只需要：

- 把 ChatGPT 給的指令整段複製，貼到 Windsurf。

Windsurf 收到後會：

- 閱讀指令中提到的 docs。
- 修改指令中提到的檔案。
- 在 terminal 執行安全的指令，例如：
  - `npx vitest`
  - `npx vitest tests/xxx.spec.ts`
  - `npm run lint`
- 在 `docs/Windsurf_ChatGPT_NOTES.md` 裡建立 / 更新本次任務的小節，內容包括：
  - 任務標題與日期。
  - 實際修改的檔案與重點邏輯。
  - 執行了哪些測試、結果如何。
  - 若有 卡關，就寫「無法解決的問題」段落。

---

### Step 2：Windsurf → 你（回報摘要）

任務完成後，Windsurf 會給你一段像這樣的文字：

```text
[Windsurf 回報摘要]
- 已更新：src/html/html-to-markdown.ts，調整 sutra 頁 anchor 輸出，
  現在會在 body_markdown 中輸出 `<a id="item83"></a>` + 原始編號文字。
- 測試：npx vitest tests/html/html-to-markdown.spec.ts
  - 4 個案例全部通過。
- 文件：已在 docs/Windsurf_ChatGPT_NOTES.md 增加本次任務小節，說明修改內容與測試結果。
```

你只要：

- 把這段回報摘要貼回 ChatGPT。

---

### Step 3：你 → ChatGPT（回報與下一步）

在 ChatGPT 對話中：

- 貼上 Windsurf 的回報摘要。
- 視情況說明是否已經 push 到 GitHub。

ChatGPT 會：

- 用回報摘要更新心中的專案狀態。
- 視需要：
  - 調整 / 追加 `docs/PROJECT_TODO.md` 的任務狀態。
  - 規劃下一步（下一個單元、下一個 pipeline…）。
  - 給你下一段要貼給 Windsurf 的指令。

---



### 4.x T 任務（T-0001, T-0002 …）的 lifecycle

> T-0001, T-0002, ... 是「可以拆給 Windsurf 的最小工作單位」。

1. **定義 T 任務（你 ↔ ChatGPT）**
   - 你在 ChatGPT 這邊說明想做的事與優先順序。
   - ChatGPT 會：
     - 先讀 `docs/PROJECT_TODO.md`、`docs/Windsurf_ChatGPT_NOTES.md`、schema / rules。
     - 在 `PROJECT_TODO.md` 裡新增一條 `T-XXXX` 任務（含：
       - 規格來源 docs
       - 要改的檔案路徑
       - 允許修改範圍
       - 驗收方式
     - 同時幫你想好一段「給 Windsurf 的短指令」。

2. **交辦 T 任務給 Windsurf（你 → Windsurf）**
   - 你只需要：
     - 把 ChatGPT 提供的短指令（code block）貼給 Windsurf。
     - 指令內容通常是：
       - 「請完成 `docs/PROJECT_TODO.md` 中的 T-000X，依照其中規格修改哪些檔案與跑哪些測試。」

3. **Windsurf 實作與記錄（Windsurf）**
   - Windsurf 依照 `PROJECT_TODO.md` 中 T-XXXX 的規格：
     - 修改程式與測試檔（只在允許修改的檔案內動手）。
     - 執行對應的 `npx vitest` / `npm run typecheck` / `npx tsc --noEmit` 等指令。
   - 並更新：
     - `docs/Windsurf_ChatGPT_NOTES.md`：加入本次任務的小節（實作細節、重要 decision）。
     - `docs/terminal_logs/…`：存放這次任務關鍵的 terminal log（tsc / vitest / 其他工具）。

4. **Windsurf 回報與你轉貼（Windsurf → 你 → ChatGPT）**
   - Windsurf 給你一段「回報摘要」，例如：
     - 本次任務代號（T-000X）。
     - 新增 / 更新的程式檔、測試檔路徑。
     - 新增的 docs / terminal_logs 路徑。
     - 測試與型別檢查是否通過。
   - 你只要把這段摘要貼回 ChatGPT 對話即可。

5. **ChatGPT 收尾與規劃下一步（ChatGPT）**
   - ChatGPT 會：
     - 將 `PROJECT_TODO.md` 中對應的 `T-XXXX` 標記為 ✅，並補上結果摘要。
     - 視需要調整 / 補充其他 docs 的說明（例如 CONTENT_SCHEMA / WORKFLOW）。
     - 幫你規劃下一個 T 任務（T-XXXX+1），並給出下一輪要貼給 Windsurf 的短指令。

> 總之：  
> - `PROJECT_TODO.md` 是「T 任務清單 + 狀態」。  
> - `Windsurf_ChatGPT_NOTES.md` 是「每個 T 任務的實作日誌」。  
> - 你只要負責在 ChatGPT 和 Windsurf 之間傳遞「短指令」與「回報摘要」，就能一路推進 T-0001, T-0002, ...。

### 4.y 每個 T 任務完成後的建議 git 流程（Windsurf → 你）

為了讓 GitHub 上的 repo 永遠貼近「最新已完成的 T 任務」，每一個 T-XXXX 任務收尾時，建議由 Windsurf 在回報摘要的最後，自動多附一段「建議 git 指令」，讓你可以在 IDE / 終端機中直接複製執行。
同時，**Windsurf 不會自動執行任何 `git add` / `git commit` / `git push`**，只會提供建議指令，由你在 IDE / 終端機中手動確認與執行。


#### 4.y.1 建議的 git 指令區塊格式

Windsurf 在每次任務完成時，回報摘要的結尾多附一段（範例）：

```text
[建議 git 指令]
git status

git add <這次變更相關的檔案列表>

git commit -m "feat: T-0005 news meta date/location"
git push origin <你的目標分支，例如 main>
```

說明：

- `git status`：讓你快速確認這次任務實際動到哪些檔案。
- `git add ...`：
  - 由 Windsurf 列出與本次 T 任務直接相關的檔案（程式檔、測試檔、docs、terminal_logs 等）。
  - 你可以在執行前再視需要增減檔案（例如再補上忘了 `git add` 的檔案）。
- `git commit -m "feat: T-0005 news meta date/location"`：
  - 採用「Conventional Commits + T 任務編號」的格式：
    - `type`: `feat` / `fix` / `refactor` / `chore` / `docs` 之類。
    - `T 任務編號`: `T-0005`、`T-0006`...
    - `簡短描述`: 用英文或中英混合皆可，但盡量精準描述本次 T 任務的重點。
- `git push origin <branch>`：
  - 由 Windsurf 用 `<你的目標分支，例如 main>` 作為提示，你在實際執行前可以自行改成目前開發分支名稱。

#### 4.y.2 建議的 commit message 模板

為了讓 commit history 一眼就能對應到 T 任務，建議 Windsurf 一律使用下列格式產生 commit 指令：

```text
<type>: T-<序號> <簡短說明>

# 範例
feat: T-0005 news meta date/location
feat: T-0004 magazine-from-legacy skeleton
fix: T-0007 sutra verse edge-case handling
chore: T-0002 anycontent news/magazine types
docs: T-0001 teaching-from-legacy verses notes
```

其中：

- `type`：
  - `feat`: 新功能或新 adapter / 型別骨架。
  - `fix`: 修正 bug 或錯誤行為。
  - `refactor`: 重構（不改功能，只整理程式結構）。
  - `chore`: 工具腳本、設定檔、型別調整等非使用者可見功能。
  - `docs`: 純文件變更（例如更新 `WORKFLOW_*`、`PROJECT_TODO` 說明）。
- `T-<序號>`：對應 `docs/PROJECT_TODO.md` 中的 T 任務編號。
- `<簡短說明>`：一行說清楚這個 T 任務的主要工作（可以搭配 post_type / adapter 名稱）。

> 重點：  
> - 每個 T 任務理論上對應「至少一個 commit」，但你也可以視情況把多個小 T 任務合併成一個較大的 milestone commit。  
> - Windsurf 產生的「建議 git 指令」只是模板，你在執行前可以先看 `git status` / `git diff` 再決定要不要調整檔案列表與 commit message。  

## 5. Windsurf 自動跑 terminal 與「卡關」處理

### 5.1 Windsurf 可以自行執行的指令

**可以自動執行（不需你貼 terminal）：**

- 測試：
  - `npx vitest`
  - `npx vitest tests/xxx.spec.ts`
- Lint / build：
  - `npm run lint`
  - `npm run build`（視專案規模與效能情況決定是否常態執行；如 build 時間較長，可只在特定任務、且經你明確同意後再執行）

**需要你同意或手動執行：**

- `npm install ...`
- 可能會刪除 / 大量改動檔案的指令。
- 連線外部 API 的指令。

Windsurf 在這些情況會詢問你 / 要你按確認。

---

### 5.2 解不了的問題怎麼交接給 ChatGPT？

當 Windsurf 多次嘗試修正後仍然卡住時，會：

1. 在 `docs/Windsurf_ChatGPT_NOTES.md` 的該任務小節下新增一段：

   ```markdown
   #### 無法解決的問題

   - 問題描述：...
   - 重現步驟：
     - `npx vitest tests/...`
   - 關鍵 terminal 輸出（節錄）：
     - ...
   - 已嘗試過的修改：
     - 修改 A 檔案第幾行，結果如何。
     - 修改 B 檔案第幾行，結果如何。
   - 目前卡住的點 / 需要 ChatGPT 決策的地方：
     - ...
   ```

2. （選用）若問題較多，也可更新 `docs/UNRESOLVED_ISSUES.md` 做列表。

你只要：

- 把這段「無法解決的問題」及相關內容貼給 ChatGPT，  
  或在 ChatGPT 那邊說：「請閱讀 `docs/Windsurf_ChatGPT_NOTES.md` 裡最新任務的小節，幫我設計具體修改指令給 Windsurf。」

---

## 6. ChatGPT 開新對話建議開場模板

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
- docs/WORKFLOW_CHATGPT_GITHUB_WINDSURF.md

目前最新任務小節是：
- docs/Windsurf_ChatGPT_NOTES.md 裡的「YYYY-MM-DD 任務：...」（以及之後的任務，如果有）。

請你：
1. 用自己的話重述目前專案狀態與最近幾次 Windsurf 的修改重點。
2. 建議我這一輪最適合先做哪一個小任務，並產生一段「可以直接貼給 Windsurf 的指令」。
3. 之後，每一次新的任務請都以同一個模式給我一段可複製的 Windsurf 指令。
```

---

## 7. 總結

- **你**：決定方向＋複製貼上＋偶爾 `git` / `npm install`。
- **ChatGPT**：設計架構規格＋拆任務＋寫 docs（大改時提供 ZIP）。
- **Windsurf**：實作程式＋跑測試＋寫 `Windsurf_ChatGPT_NOTES.md`＋輸出回報摘要。

只要三方都照這份工作流程走：

- 對話視窗保持「輕量：決策＋指令＋回報」。
- 詳細規格與操作歷史集中在 Git repo 的 `docs/*.md`。
- 無論是你、ChatGPT 或 Windsurf，要接續工作時都能快速銜接。
