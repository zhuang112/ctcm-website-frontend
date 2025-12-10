
# 指令草稿：請 Codex 修改 workflow，加上 full access 模式規則

這份檔案可以整段貼給 Codex，讓它去改 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 和 `docs/Windsurf_ChatGPT_NOTES.md`，把「執行權限模式（sandbox / full access）」正式寫進 workflow。

```text
你現在是這個專案的主要實作 Agent。

目標：
在 workflow 中正式寫入「實作 Agent 的執行權限模式」規則，讓未來可以安全切換成「專案資料夾 full access，不再跳 allow」的模式，同時約束自己只在 repo 內動手、不執行高風險指令。

本次只改 docs，不改程式碼。

================================
【步驟一】更新 WORKFLOW_CHATGPT_GITHUB_AGENT：新增「執行權限模式」小節
================================

1. 打開 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`。

2. 在合適的位置（建議放在「1.6 GitHub 作為唯一真相 & push 規則」附近，例如新增為 1.9），加入一個新小節，例如：

   ### 1.9 實作 Agent 的執行權限模式（sandbox / full access）

   本專案預期有兩種實作 Agent 執行模式，實際使用由使用者在 IDE / 工具本身設定：

   1. **安全模式（預設）**
      - sandbox / approval policy：需要使用者按「allow」才允許寫檔、跑某些指令。
      - 行為特徵：
        - 在 repo 內寫檔、跑 git、npm 有時會跳出 allow 視窗。
        - ChatGPT 給的指令若涉及較大範圍變更（例如大量刪檔），實作 Agent 會再三確認。
      - 適合階段：
        - 專案初期、還不確定 workflow 是否穩定。
        - 使用者對 Agent 還不熟悉時。

   2. **專案資料夾 full access 模式（進階，需使用者自行開啟）**
      - 前提：使用者在 IDE / Agent 設定中，主動將 workspace/sandbox 設為：
        - 僅針對本專案 repo 根目錄（例如 `ctcm-website-frontend/`）。
        - 在該目錄下的讀寫、git、npm 等指令自動允許，不再跳出 allow。
      - 本規則只描述「取得 full access 後，實作 Agent 必須遵守的自律限制」，無法幫使用者修改 IDE 設定。
      - 在此模式下，實作 Agent 必須遵守：
        - **只在 repo 內動手：**
          - `cwd` 必須是專案根目錄或其子目錄。
          - 不主動存取專案以外的路徑（例如 `../` 往上層、系統目錄等）。
        - **不執行高風險系統指令：**
          - 不使用 `rm -rf /`、`rm -rf ..` 類指令。
          - 不修改系統環境設定檔（如全域 git 設定、系統 hosts 等）。
        - **所有變更都要經過 git 管理：**
          - 只修改屬於本 repo 的檔案，並透過 `git status` 檢查差異。
          - 每一次大量變更前，repo 狀態應該是乾淨或至少由使用者知情。
        - **仍遵守本檔其他規則：**
          - 例如：每個 T 任務都要更新 `docs/Windsurf_ChatGPT_NOTES.md`、記錄 RAW 連結與 commit hash。

   - ChatGPT 的指令一律假設「cwd 已是 repo 根目錄」，且在 full access 模式下不再要求使用者按 allow。
   - 若實作 Agent 發現目前工作環境不符合上述前提（例如 cwd 不在 repo 內），必須先在 notes 中紀錄狀況並提醒使用者，而不要假設自己擁有正確的 full access。

3. 儲存 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`。

================================
【步驟二】更新 notes：記錄「可以選擇全開模式」這件事
================================

1. 打開 `docs/Windsurf_ChatGPT_NOTES.md`。

2. 在「2025-12-10 默契 / 操作習慣」區塊中，新增一條 bullet，說明：

   - 使用者可以選擇在 IDE 中將實作 Agent 切換成「專案資料夾 full access」模式：
     - 只要在本 repo 內操作，就不再跳 allow。
     - 風險由使用者自己評估。
     - 實作 Agent 必須遵守 workflow 1.9 小節中列出的限制（不離開 repo、不用高風險指令、所有變更都走 git）。

3. 在 2025-12-12（或最新日期）的任務底下，新增一個小節（可沿用 T-0011 或新開小節），簡短記錄本次補充規則，並加上：

   ```markdown
   變更檔案（含 RAW 連結）：

   - docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md  
     RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md

   - docs/Windsurf_ChatGPT_NOTES.md  
     RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
   ```

================================
【步驟三】依 workflow 收尾（git + push + 極簡回報）
================================

1. `git status` 確認本次只改：
   - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`
   - `docs/Windsurf_ChatGPT_NOTES.md`

2. 執行：

   ```bash
   git add docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md docs/Windsurf_ChatGPT_NOTES.md
   git commit -m "T-0011: document agent sandbox/full-access execution modes"
   git push origin main
   ```

3. 回覆給使用者時，用極簡格式，例如：

   - 已更新：workflow 新增「執行權限模式」小節；notes 補充可選 full access 模式與注意事項。
   - 請看 `docs/Windsurf_ChatGPT_NOTES.md` 中 2025-12-12 任務：T-0011 小節（含 RAW 連結）。
   - 最後 commit hash：<hash>。
```
