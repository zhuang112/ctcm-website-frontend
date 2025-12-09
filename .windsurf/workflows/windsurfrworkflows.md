---
description: # CTCM 開發 Workflows
auto_execution_mode: 1
---

---
description: # CTCM 開發 Workflows
auto_execution_mode: 1
---

# CTCM 開發 Workflows（建議給 Windsurf / ChatGPT 參考）

## Workflow: 實作一個新的 AnyContent 任務（T-XXXX）

### 步驟 1：閱讀規格與範圍
- **[Step 1.1] 開啟 `docs/PROJECT_TODO.md`**
  - 找到目標任務（例如 `T-0006 teaching-from-legacy CLI`）。
  - 確認：
    - 任務目標
    - 關聯文件 / 參考連結
    - 允許修改 / 新增的檔案清單
    - 驗收標準（tests / typecheck / CLI 行為等）

### 步驟 2：建立內部 TODO 與初步設計
- **[Step 2.1] 使用 Windsurf todo_list 工具**
  - 為該 T-XXXX 建立 3–5 個小任務，例如：
    - 讀規格
    - 實作 adapter / CLI
    - 撰寫 / 更新測試
    - 執行測試與型別檢查
    - 更新 `Windsurf_ChatGPT_NOTES.md`
- **[Step 2.2] 參考既有實作**
  - 若是 adapter：參考 `src/adapters/news-from-legacy.ts`、`src/adapters/magazine-from-legacy.ts` 等。
  - 若是 CLI：參考 `tools/crawl/crawl-ctworld.ts`、`tools/convert/teaching-html-to-anycontent.ts` 等。

### 步驟 3：實作與更新測試
- **[Step 3.1] 嚴守「允許修改檔案」範圍**
  - 僅編輯 TODO 中允許變動的路徑，除非使用者明確同意擴大範圍。
- **[Step 3.2] 先改程式再補測試，或 TDD**
  - Adapter / CLI：先建立 minimal 實作（確保不破壞現有行為）。
  - 測試檔：放在 `tests/` 對應目錄下，仿照現有測試風格撰寫。

### 步驟 4：執行測試與型別檢查
- **[Step 4.1] 執行專案指定指令**
  - 例如：
    - `pnpm vitest` 或 `pnpm vitest path/to/spec --runInBand`
    - `pnpm typecheck` 或 `pnpm tsc --noEmit`
- **[Step 4.2] 紀錄重要輸出**
  - 針對每個 T-XXXX，至少保留一份 tests / typecheck 相關的 log：
    - `docs/terminal_logs/T-XXXX_說明_key.txt`

### 步驟 5：整理技術說明與使用方式
- **[Step 5.1] 更新 `docs/Windsurf_ChatGPT_NOTES.md`**
  - 新增 `## T-XXXX 任務名稱` 段落。
  - 描述內容建議包含：
    - 任務目的與背景（為什麼要做）
    - 主要修改檔案與重點程式碼說明
    - 假如有 parsing / 推論邏輯，需具體描述規則
    - 測試與使用方式（例如 CLI 如何執行）
    - 已知限制或未來可擴充點

### 步驟 6：回報與交接給使用者 / ChatGPT
- **[Step 6.1] 在 Windsurf 對話中回報**
  - 輸出兩個獨立區塊：
    - `[Windsurf 回報摘要]`：
      - 概述本次 T-XXXX 完成情況
      - 列出主要修改檔案
      - 列出已執行的測試 / 型別檢查與結果
      - 提醒詳細內容可見 `docs/Windsurf_ChatGPT_NOTES.md`
    - `[建議 git 指令]`：
      - 以一般純文字列出建議的 git 指令（例如 `git status`、`git add ...`、`git commit -m "..."`）。
      - 不要混入說明文字，也不要使用任何 code block。
- **[Step 6.2] 由使用者執行 git / push**
  - Windsurf 只提供建議，不自動操作 git。
  - 使用者可依摘要與 NOTES 內容在 GitHub 或 ChatGPT 端做進一步 review。

---

## Workflow: 為 ChatGPT 建立 / 更新專案 Rules & Memories

### 步驟 1：彙整專案約定
- 從：
  - `docs/windsurfrules.md`
  - `docs/windsurfrworkflows.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`
  中擷取重要規則與流程。

### 步驟 2：整理成 ChatGPT Custom Instructions
- 拆成三塊：
  - Rules（你一定要遵守的規則）
  - Workflows（處理這個 repo 任務時要走的步驟）
  - Memories（這個專案的長期背景 / 偏好）

### 步驟 3：在 ChatGPT 介面設定
- 把整理好的內容貼到：
  - Custom Instructions / System message / 或對應欄位中。
- 未來修改專案流程時，記得同步更新這裡與 `docs/windsurfrules.md` / `docs/windsurfrworkflows.md`。
