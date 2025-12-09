---
trigger: always_on
---

# CTCM 專案 Rules / Workflows / Memories（給 Windsurf / ChatGPT 參考）

## 1. 回覆格式與語言

- **[R1] 回覆語言**：預設使用繁體中文。
- **[R2] 回覆結構（Windsurf）**：每個任務結束時，一律輸出兩個區塊：
  - `[Windsurf 回報摘要]`：純文字，簡短列出：
    - 任務編號與名稱（例如：T-0006 teaching-from-legacy CLI）
    - 主要修改檔案清單（相對路徑）
    - 已執行的測試 / 型別檢查結果
    - 若有較長的技術說明或決策原因，請註明已寫入 `docs/Windsurf_ChatGPT_NOTES.md` 對應段落
  - `[建議 git 指令]`：獨立一個區塊，以一般純文字列出建議的 git 操作（例如 `git status`、`git add ...`、`git commit -m "..."`），**不要混入說明文字，也不要使用任何 code block**。
- **[R3] 內容長度控制**：在聊天視窗中保持精簡，把詳細技術說明、長範例與排錯過程盡量寫進 `docs/Windsurf_ChatGPT_NOTES.md`。

## 2. AnyContent / Adapter 開發規則

- **[R4] 單一 Task 對應單一小變更集**：
  - `docs/PROJECT_TODO.md` 中每個 `T-XXXX` 任務，盡量對應一組集中的變更與一組 terminal logs / 測試記錄。
- **[R5] 型別與結構為單一真實來源**：
  - AnyContent 相關型別定義以 `src/types/anycontent-*.ts` 為準，Adapters 僅做映射，不自行擴充型別。
- **[R6] Adapter Minimal Mapping 原則**：
  - 新增 `*-from-legacy` adapter 時，僅做「必要欄位 + skeleton meta」的 minimal 實作：
    - `post_type`、`language`、`old_url` 等必要欄位
    - `body_markdown` 一律由 `htmlToMarkdown` 產生
    - 其他 meta 欄位先給 `null` 或 `undefined`（依型別定義），後續再由獨立任務補齊

## 3. CLI / Tools 規則

- **[R7] CLI 檔案位置與命名**：
  - 轉換 / 抓取工具統一放在 `tools/` 底下，例如：
    - `tools/convert/teaching-html-to-anycontent.ts`
    - `tools/crawl/crawl-ctworld.ts`
- **[R8] CLI 介面慣例**：
  - 以 `ts-node` 或已編譯的 node script 方式執行。
  - 最少支援：
    - 必要參數：輸入路徑（檔案或目錄，視工具而定）
    - 選用參數：輸出路徑（若省略則輸出到 stdout 或預設檔）。
  - 錯誤時，以 non-zero exit code 結束，訊息輸出到 stderr。

## 4. 測試與紀錄

- **[R9] 測試優先原則**：
  - 新增或修改 adapter / 轉換流程時，**必須**同時新增 / 更新對應的 vitest 測試（放在 `tests/`）。
- **[R10] Terminal Log 紀錄**：
  - 每個 T-XXXX 任務完成時，將至少一次 `vitest` / `tsc` / 其他關鍵指令的輸出，存成純文字檔放在：
    - `docs/terminal_logs/T-XXXX_說明_key.txt`
  - 例如：
    - `docs/terminal_logs/T-0004_magazine-from-legacy_vitest_pass.txt`

## 5. Documentation 規則

- **[R11] Windsurf_ChatGPT_NOTES.md 作為詳解區**：
  - 任何較長的說明、設計決策、排錯過程，統一寫入 `docs/Windsurf_ChatGPT_NOTES.md`，依任務編號分段。
  - 段落命名格式建議：`## T-000X 任務名稱`。
- **[R12] PROJECT_TODO.md 作為任務真實來源**：
  - 任務內容與規格以 `docs/PROJECT_TODO.md` 為準；若實作過程中有與規格不同的必要調整，需在 NOTES 中明寫原因。

## 6. 協作 Workflows（摘要）

- **[W1] 任務開工流程（Windsurf）**：
  1. 在 `docs/PROJECT_TODO.md` 找到對應 T-XXXX 任務，確認「允許修改檔案」與「驗收方式」。
  2. 更新內部 TODO（使用 `todo_list` 工具）拆解子任務。
  3. 僅在必要時開啟 / 讀取相關檔案，不要大量掃描無關檔案。

- **[W2] 開發與測試流程**：
  1. 依任務規格修改 / 新增檔案。
  2. 針對修改內容新增 / 調整 vitest 測試。
  3. 透過終端機執行必要的 `pnpm test` / `pnpm vitest` / `pnpm lint` / `pnpm build` / `pnpm typecheck`（實際指令依專案而定）。
  4. 將重要輸出貼到 `docs/terminal_logs` 對應檔案。

- **[W3] 任務收尾與回報**：
  1. 在 `docs/Windsurf_ChatGPT_NOTES.md` 新增或更新本次任務的詳細說明與使用方式。
  2. 在聊天視窗輸出兩個區塊：
     - `[Windsurf 回報摘要]`
     - `[建議 git 指令]`
  3. 不自動執行 git，僅提供建議命令。

## 7. Memories（給 ChatGPT / Windsurf 的長期記憶）

- **[M1] Repo 與專案範圍**：
  - 主要專案為 `zhuang112/ctcm-website-frontend`，AnyContent adapters 與 CLI 工具都在這個 repo 內實作。
- **[M2] 三方協作角色**：
  - 使用者：負責需求、決策與實際 git 操作。
  - Windsurf / Cascade：負責在 IDE 內改檔、跑指令、整理 NOTES 與回報摘要。
  - ChatGPT（瀏覽 GitHub 或檔案）：負責閱讀 NOTES 與程式碼做 code review、給建議與下一步規劃。
- **[M3] 變更多透過 NOTES 溝通**：
  - 若有任何重要設計決策或不直覺行為（例如 date/location parsing 的特殊規則），請務必寫入 `docs/Windsurf_ChatGPT_NOTES.md`，讓 ChatGPT 能在離線閱讀時理解全貌。
