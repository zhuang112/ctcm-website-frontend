# 工具與角色分工（TOOLS_ROLES_AND_BOUNDARIES）

本文件定義：
- 你（User）
- ChatGPT
- Windsurf

三者在 ctworld.org 改版／匯入專案中的角色分工與「可以／不可以」做的事。

---

## 1. 你（User）

### 1.1 主要職責

- **PM（專案管理）**
  - 決定優先順序：先做哪一個單元（Teaching / News / Magazine / Branch...）。
  - 決定每一階段的「完成標準」（Done 的定義）。
  - 安排時間與檢查節奏。

- **設計師／資訊架構設計**
  - 網站結構、選單、內容模組。
  - 版面風格、版型示意（可以用傳統 HTML/CSS prototype）。

- **Reviewer**
  - 檢查 ChatGPT 的規格文件是否符合你的意圖。
  - 檢查 Windsurf 實作的結果（畫面與輸出格式）。
  - 最後一關決定：「這樣可以了，進下一步」。

### 1.2 不需要做的事（盡量避免）

- 不需要自己寫大量 TypeScript / PHP / Node。
- 不需要自己 debug 深度技術問題。
- 不需要在腦中記住所有規則，交給 `docs/*.md`＋ChatGPT。

---

## 2. ChatGPT

### 2.1 可以做的事

- **規則設計與記錄**
  - 設計 HTML→Markdown 規則（目前以 V4 規則為準，舊版 V1–V3 已歸檔）。
  - 設計 JSON schema / AnyContent 型別（含各 post_type 專用型別）。
  - 設計 WordPress 匯入策略（post type、meta、taxonomy、Polylang 對應）。
  - 設計多語系策略（zh-TW / zh-CN / en / ja）。

- **文件維護**
  - 撰寫與更新：
    - `docs/COMPLETE_PROJECT_WORKFLOW.md`
    - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
    - `docs/CONTENT_SCHEMA.md`
    - `docs/WORKFLOW_CHATGPT_GITHUB_WINDSURF.md`
    - `docs/TOOLS_ROLES_AND_BOUNDARIES.md`
    - `docs/PROJECT_TODO_TEMPLATE.md`
  - 幫你從對話中整理出清楚、可重複使用的文字。

- **骨架程式碼**
  - 產生：
    - `src/tools/html-to-markdown.ts` 的函式架構與 TODO。
    - `src/tools/generate-json-from-html.ts` 的函式架構。
    - WordPress 匯入 plugin / WP-CLI 的骨架。
  - 根據你提供的 repo 結構與需求，提出建議。

- **code review 與重構建議**
  - 檢查 Windsurf 實作是否遵守 `docs/*.md` 規格。
  - 提出更乾淨的寫法與結構建議。
  - 產生可貼回 repo 的修正版程式碼。

### 2.2 不可以做的事（限制）

- 不能直接：
  - 改你的 GitHub 檔案。
  - `git commit`／`git push`。
  - 直接登入 SiteGround 或 WordPress 後台。
- 任何實際改動，仍需由你或 Windsurf 在你的環境完成。

---



### 2.4 關於 docs snapshot ZIP（給 ChatGPT 用）

- ChatGPT 不會自己存取 GitHub，也看不到 Codex / Windsurf 的 sandbox。
- 若你希望 ChatGPT 在某次 T 任務完成後，能「完整看到當下的 docs＋terminal logs」：
  - 請讓實作 Agent 在 repo 根目錄的 `snapshots/` 資料夾中產生一個 docs snapshot ZIP：
    - 例如：`snapshots/ctworld-docs-T-0005-2025-12-09-v1.zip`
  - 你只需從本機選擇這個 ZIP，直接上傳到 ChatGPT 對話中。
- ChatGPT 會在該對話中**以你上傳的 ZIP 內容為唯一真相來源**，來設計接下來的規劃與任務。
- ChatGPT 不會把舊對話中看過的 ZIP 視為「長期硬碟」。  
  - 每一個對話中，只有**目前真的存在的上傳檔案**可以被當成真相來源。
  - 如果 ChatGPT 嘗試讀取某個檔案時，系統回報「檔案不存在／找不到路徑」，ChatGPT 必須立刻停止推論，直接請你「重新上傳需要看的 ZIP 或檔案」，而不是根據記憶臆測內容。


### 2.5 Codex（未來主要實作 Agent）的建議設定

> 本節是為了未來正式導入 Codex 作為主要實作 Agent（取代或輔助 Windsurf）時使用。

- 建議模式（Mode）：
  - 使用「Agent」模式，而非單純 Chat 或完全開放的 full access。
  - 理由：需要有明確的任務概念（T 任務）、檔案邊界與測試流程，同時保留你對 PR / merge 的最終控制權。
- 建議模型（Model）：
  - `GPT-5.1-codex-max` 作為這個專案的主要 Codex 模型。
  - 理由：專案包含大量 TypeScript / Node / React / WordPress 相關程式碼，需要最強的工程與 repo 協調能力。
- Reasoning 等級：
  - 預設使用 **medium**：
    - 適用於一般 T 任務（adapter mapping、小型 CLI、補測試、更新 docs）。
  - 僅在以下情境使用 **high**：
    - 大型重構（例如全面升級 html-to-markdown 規則、跨多 post_type 的重整）。
    - 跨整個 pipeline 的設計或除錯（舊站 HTML → AnyContent → WordPress → 前端）。
  - 幾乎不需要刻意使用 low，除非是非常小型、單檔、不牽涉多檔推理的修正。

- 不變的原則：
  - 不論實際實作者是 Windsurf 還是 Codex，都必須遵守：
    - 以 `docs/PROJECT_TODO.md` 的 T 任務為單位工作。
    - 僅在任務允許的檔案與區域內修改程式碼／文件。
    - 任務結束時更新 `docs/Windsurf_ChatGPT_NOTES.md`、必要時更新 `docs/PROJECT_TODO.md`。
    - 若有尚未寫入正式 workflow / schema 的設計，先記錄在 `docs/PENDING_DECISIONS.md`，由 ChatGPT 在適當時機協助整理進正式文件。


## 3. Windsurf

### 3.1 可以做的事

- 在你的本機／遠端開發環境中：
  - 開啟 repo。
  - 修改程式碼檔案。
  - 跑指令：`npm install`、`npm run dev`、`npm test` 等。
- 依照你的指令與 `PROJECT_TODO.md`，完成實作，例如：
  - 完整實作 `html-to-markdown.ts`（遵守 V3 規則）。
  - 完成 JSON 生成工具。
  - 完成 WordPress 匯入腳本。
  - 完成 React 前端的版型與資料綁定。

### 3.2 使用建議（如何跟 Windsurf 說話）

盡量用「指向文件＋任務」的方式：

- 好的示範：

  > 「請先閱讀 `docs/HTML_TO_MARKDOWN_RULES_V4.md` 和 `PROJECT_TODO.md`，  
  > 然後執行 TODO 中 `[T-001][OPEN][W]` 這個任務，  
  > 只修改 `src/tools/html-to-markdown.ts`，完成主要轉換流程。」

- 不建議的用法：

  > 「自己想一個方法把這些 HTML 都轉好。」

因為這會讓 Windsurf 在沒有規則的情況下「自由發揮」，增加偏離你原本架構的風險。

### 3.3 不建議交給 Windsurf 的事情

- 設計整體資料架構／匯入策略（容易與 ChatGPT 的架構不一致）。
- 直接操作正式機器、刪除資料庫、重做整個環境。
- 在沒有文件支持的情況下，做「全專案重構」。

---

## 4. 未來若增加其他工具（例如 Codex／雲端 Agent）

原則：

- 新工具「只能在文件定義的範圍內」做事。
- 若新工具會改程式碼或操作資料：
  - 先在 `docs/TOOLS_ROLES_AND_BOUNDARIES.md` 裡新增一節，定義：
    - 它的角色。
    - 可以做的範圍。
    - 不可以做的事情。
  - 讓所有 AI 以及未來的人類協作者，都能清楚各自邊界。

---

## 5. 快速摘要（如果你只想看超短版）

- **你**：定方向、做設計、檢查結果，不寫大量程式。
- **ChatGPT**：想架構、寫規則／文件、寫骨架 code、做 code review。
- **Windsurf**：在你的 repo 裡照文件實作、改程式、跑測試。

維持這個分工，會讓：
- 專案更穩定。
- 你比較不會被技術細節淹沒。
- AI 做的事情都「看得到、可解釋、可重複」。

---

## 4. Prompt snippet（可複製指令）的責任分工

為了讓你操作更輕鬆，關於「要跟 Windsurf 說什麼」的內容，責任分工如下：

- **ChatGPT：**
  - 在設計每一個任務時，負責產生一段「可直接複製貼給 Windsurf」的文字。
  - 同時更新 `PROJECT_TODO.md` 或相關 docs，把任務編號、狀態、說明寫清楚。
  - 在需要你手動操作時（例如：`npm install`、`git` 指令），提供簡短、可複製的命令區塊。

- **Windsurf：**
  - 收到指令後，直接修改程式與 docs。
  - 在每一輪任務結束時，輸出一段「回報摘要」，例如：
    - 做了哪些變更（檔名／重點）
    - 目前有哪些 TODO 或尚未完成的部分
  - 這段摘要應該可以被你複製回 ChatGPT，作為後續規劃的輸入。

- **你：**
  - 不需要自己組裝長指令，只要在兩邊之間「複製貼上」：
    - 把 ChatGPT 給的 Windsurf 指令貼到 Windsurf。
    - 把 Windsurf 的回報摘要貼回 ChatGPT。

這樣可以最大化減少你在兩邊「翻譯」或重新整理文字的工作量。

