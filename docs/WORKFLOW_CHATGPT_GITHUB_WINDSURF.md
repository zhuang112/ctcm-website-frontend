# CTWorld 專案工作流程：ChatGPT × GitHub × Windsurf

這份文件說明：如何讓 ChatGPT（架構師）、GitHub（單一真相來源）、Windsurf（實作工程師）在「儘量自動化、減少人力溝通」的前提下協作完成 ctworld.org 的改版與匯入。

---

## 1. 三方分工（你／ChatGPT／Windsurf）

### 1.1 你（PM＋設計師＋Reviewer）

- 決定資訊架構、版面、優先順序。
- 把「真正重要的設計與決策」說給 ChatGPT 聽，讓 ChatGPT 寫成文件。
- 在 ChatGPT 與 Windsurf 之間傳遞少量指令：
  - 給 ChatGPT：需求、想法、目前遇到的問題。
  - 給 Windsurf：指向 `PROJECT_TODO.md`，請它依照任務執行。
- 最後一關的人工檢查（內容是否正確、排版是否合適）。

### 1.2 ChatGPT（架構師＋文件機器）

- 幫你：
  - 設計 content model、HTML→Markdown 規則、JSON schema。
  - 設計 WordPress 匯入策略（post type、meta、taxonomy、Polylang…）。
  - 撰寫與維護 `docs/*.md`（規格、流程、說明）。
  - 撰寫 `PROJECT_TODO.md`／更新任務清單。
  - 產生 TypeScript / PHP / Node / WP-CLI 的骨架程式碼。
  - 做 code review，提出重構與最佳實務建議。
- 不直接改 GitHub，只產出「可以貼進 repo 的內容」。

### 1.3 Windsurf（實作工程師）

- 在你的本機或雲端專案中：
  - 開檔案、寫 code、跑 dev server。
  - 根據 `docs/*.md` 的規格實作工具與前端。
  - 依照 `PROJECT_TODO.md` 任務清單，從上到下完成技術項目。
- 不負責決策與規則設計，只負責「照文件實作」。

---

## 2. GitHub 作為單一真相來源

重要原則：

- **文件只認 GitHub 上的最新版本**：
  - ChatGPT 幫你寫好的文件／程式碼，請務必貼回 repo 再繼續。
  - Windsurf 的工作結果，也以 repo 內的版本為準。
- 你只要保證：
  - 「事情做完」→ 有 commit。
  - 「規格改了」→ 有更新 `docs/` 檔案並 commit。

這樣 ChatGPT（透過 GitHub Connector）和 Windsurf 才能一直看到同一份真相。

---

## 3. 最小人工操作的主線循環

以下是建議的「最少手動」循環模式：

### Step 0：準備階段（一次性）

1. 在 ChatGPT 帳號中開啟 GitHub Connector，授權此專案的 repo。
2. 把這份 `docs/WORKFLOW_CHATGPT_GITHUB_WINDSURF.md` 和其他 `docs/*.md`、`PROJECT_TODO.md` 放進 repo 並 commit。
3. 在 Windsurf 中打開同一個 repo。

之後重複使用以下 4 步：

---

### Step 1：你 & ChatGPT — 定義規則與任務（文件層）

你做的事：

1. 告訴 ChatGPT：
   - 目前要解決的是哪一塊（例如：HTML→Markdown V4、Teaching JSON、News 匯入…）。
   - 你心裡大概的需求與期望。

2. 請 ChatGPT 協助：
   - 更新或撰寫相關說明文件：
     - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
     - `docs/CONTENT_SCHEMA.md`
     - `docs/COMPLETE_PROJECT_WORKFLOW.md`
     - 或其他需要的規格文件。
   - 幫你「新增或更新」`PROJECT_TODO.md` 中的任務條目。

3. 你把 ChatGPT 產生的內容：
   - 貼回 repo 對應檔案。
   - 簡單看一下是否符合你的想法。
   - `git add` ＋ `commit` ＋ `push`。

這樣就完成了「用最少的人工，把你的想法 → 文件化 → 放進 GitHub」。

---

### Step 2：你 & Windsurf — 交付實作（程式層）

你對 Windsurf 的指令可以固定成類似這樣：

> 「請先閱讀 `docs/WORKFLOW_CHATGPT_GITHUB_WINDSURF.md`、`docs/HTML_TO_MARKDOWN_RULES_V4.md` 和 `PROJECT_TODO.md`，  
> 然後從 `PROJECT_TODO.md` 中「階段 1」的第一個 `[W]` 任務開始實作，  
> 完成後請說明你修改了哪些檔案，以及有沒有任何需要我或 ChatGPT 決定的地方。」

Windsurf 會：

- 依照 TODO 項目：
  - 打開指定檔案（例如 `src/tools/html-to-markdown.ts`）。
  - 按照 `docs/*.md` 的規格完成實作。
- 跑測試／dev server（如果你有設定）：
  - 例如 `npm test`、`npm run dev`。
- 回報：
  - 哪些檔案被修改。
  - 有沒有遇到規格不清楚的地方。

你要做的事：

- 看一次 diff（或讓 Windsurf列出主要變更）。
- 如果大致 OK，就 `git add` ＋ `commit` ＋ `push`。

---

### Step 3：你 & ChatGPT — Review 與調整

當 Windsurf 完成某個任務後：

1. 確保你已經 `push` 最新 commit。
2. 回到 ChatGPT：
   - 告訴我：
     - 「請看 repo 裡 `src/tools/html-to-markdown.ts` 的最新版本，幫我檢查是否完全遵守 `docs/HTML_TO_MARKDOWN_RULES_V4.md`。」
3. ChatGPT 會：
   - 透過 GitHub Connector 讀取檔案。
   - 根據 `docs/*.md` 規格做 code review。
   - 如果有需要，可以產生改良版本或建議（你再決定要不要交給 Windsurf 套用）。

你可以視需要：

- 請我幫忙更新 `PROJECT_TODO.md`，把該任務改成 DONE／NEEDS_REVIEW。
- 請我補充規則文件（例如發現某種 HTML 還沒列入 V3 規則）。

---

### Step 4：迭代

重複 Step 1～3：

- 每次先在 ChatGPT 這邊「想清楚＋寫文件＋列 TODO」。
- 再把實作交給 Windsurf。
- 你只需要：
  - Copy / paste 文件內容一次。
  - 下 1～2 句固定指令給 Windsurf。
  - 做最後檢查。

---

## 4. 如何設計 `PROJECT_TODO.md` 讓 AI 最好配合？

請參考 `docs/PROJECT_TODO_TEMPLATE.md`，簡要原則：

- 每條任務包含：
  - 任務編號（例如 `[T-001]`）
  - 狀態標記（例如 `[OPEN]`／`[IN_PROGRESS]`／`[DONE]`／`[NEEDS_REVIEW]`）
  - 負責角色標記（例如 `[W]`／`[C]`／`[U]`）
  - 具體要改的檔案與參考文件。

範例：

- `[T-001][OPEN][W] 實作 html-to-markdown.ts 主要轉換流程`
  - 檔案：`src/tools/html-to-markdown.ts`
  - 參考：`docs/HTML_TO_MARKDOWN_RULES_V4.md`
  - 限制：不得修改 `src/types/legacy-post.ts` 型別定義。
  - 完成標準：
    - 通過 `tests/htmlToMarkdown.spec.ts`。
    - 用 3 個實際 HTML 範例手動檢查輸出。

---

## 5. 安全與風險控制

- 所有自動化操作（大匯入／刪除／重構）：
  - 先在 **測試／staging** 環境執行。
  - 確認結果正確再布署到正式環境。
- 不要把：
  - SiteGround 真實 SSH、資料庫密碼、敏感金鑰寫在 repo 裡。
  - 若需要，改用 `.env` 或設定範本＋本機環境變數。
- 規則一旦改變：
  - 請務必更新 `docs/*.md` 並 commit。
  - 讓以後的你、Windsurf、其他 AI 都能理解「為什麼現在是這樣」。

---

## 6. 建議的檔案與資料夾結構（節錄）

```txt
docs/
  WORKFLOW_CHATGPT_GITHUB_WINDSURF.md   # 本文件：三方協作與主線工作流
  TOOLS_ROLES_AND_BOUNDARIES.md         # ChatGPT / Windsurf / 你 的角色分工與界線
  PROJECT_TODO_TEMPLATE.md              # PROJECT_TODO 寫法範本
  COMPLETE_PROJECT_WORKFLOW.md          # 整體專案流程（抓取→轉換→JSON→匯入 WordPress）
  HTML_TO_MARKDOWN_RULES_V4.md          # 最新 HTML→Markdown 規則說明
  CONTENT_SCHEMA.md                     # Teaching / News / Magazine / Branch / Index 欄位定義
PROJECT_TODO.md                         # 真正執行用的任務清單
```

未來若增加其他工具（例如 Codex 或某個雲端 Agent），只要新增一份類似的 `TOOLS_ROLES_AND_BOUNDARIES` 區段，寫清楚：

- 它可以做什麼。
- 它不應該做什麼。
- 要遵守哪些 docs 與 TODO 規則。

這樣整個專案即使變複雜，仍然可以維持清楚的結構與分工。

---

## 7. 實際對話風格與「可複製指令」約定

為了減少你在對話視窗中被大量細節淹沒，實際協作時採用以下風格：

1. **對話中的資訊量要「剛好」**
   - ChatGPT 在回覆時，只講「你現在需要知道的結論」與「下一步要做什麼」。
   - 細節（欄位說明、案例、完整規則）一律寫進 `docs/*.md` 或 `PROJECT_TODO.md`，
     讓你與 Windsurf 透過 GitHub 閱讀。

2. **每一個 Windsurf 任務，都有一段可複製的指令區塊**

   - ChatGPT 在指定新任務給 Windsurf 時，必須同時做兩件事：
     1. 把任務寫進 `PROJECT_TODO.md`（或相關規格文件），包含編號、狀態、說明。
     2. 在對話中提供一段「可直接貼給 Windsurf」的指令（用程式碼區塊標記）。

   - 指令示意：

     ```text
     請先閱讀：
     - docs/COMPLETE_PROJECT_WORKFLOW.md
     - docs/CONTENT_SCHEMA.md
     - docs/HTML_TO_MARKDOWN_RULES_V4.md

     任務目標：
     - 完成 src/html/html-to-markdown.ts 中 htmlToMarkdown() 的實作骨架。
     - 僅處理基礎 block/inline 規則，專案特定樣板稍後再做。

     限制條件：
     - 不可以修改 docs/ 裡的任何檔案。
     - 不可以更動 src/types/anycontent-*.ts 內既有型別名稱。
     ```

   - 你只需要「複製這段」貼給 Windsurf 即可，不必再轉述內容。

3. **Windsurf 回報也用「可複製的摘要」**

   - ChatGPT 要求 Windsurf 在完成任務時：
     - 直接修改 / 新增對應的程式碼與 docs 檔案。
     - 在對話最後輸出一段「給你與 ChatGPT 的摘要」，例如：

       ```text
       [Windsurf 回報摘要]
       - 已完成：src/html/html-to-markdown.ts 基礎實作，支援段落、標題、清單、粗體、斜體、連結、圖片、hr。
       - 新增測試：tests/html/html-to-markdown.spec.ts，包含 3 個基本案例。
       - 尚未處理：sutra / blossom / reply 等專案特定 class 規則，之後可依 HTML_TO_MARKDOWN_RULES_V4.md 附錄分批實作。
       ```

   - 你可以把這段摘要複製回 ChatGPT，作為「本輪 Windsurf 完成狀態」的輸入，方便後續規劃。

4. **需要你手動做的事越少越好**

   - 原則上，你主要負責：
     - 決定「要不要做這件事」、「順序是什麼」。
     - 在合適時間把 ChatGPT 產出的 ZIP / 文字放進 repo。
     - 把 Windsurf 的回報摘要貼給 ChatGPT，讓架構與規格保持同步。

   - 其他重複性工作（搬移檔案、詳細 code 實作、批次替換）
     儘量交給 AI（Windsurf 或 ChatGPT 透過明確規則）完成。

此約定的目標是：
- 讓對話視窗保持「輕量的決策與溝通」；
- 讓 GitHub repo 成為「詳細規格與程式」的唯一真相來源；
- 確保每一個 AI 工具都能照同一套 docs 運作。

