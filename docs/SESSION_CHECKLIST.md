# SESSION_CHECKLIST：每次工作時的小抄

> 每次開工前，可以快速過這個 checklist，讓自己不要被技術細節淹沒。

## 開始前

- [ ] 今天的重點是什麼？（一句話就好）
- [ ] 有沒有需要先問 ChatGPT 的架構／規則問題？
- [ ] repo 是否已經 `git pull` 最新版本？

## 跟 ChatGPT 協作

- [ ] 是否需要更新 `docs/*.md` 或新增一份說明？
- [ ] 是否需要請 ChatGPT 幫忙寫／更新 `docs/PROJECT_TODO.md` 的任務？
- [ ] ChatGPT 給的內容，有沒有貼回 repo 並 commit？

## 跟 Windsurf 協作


- [ ] 本次任務是否有一段「可複製」的 Windsurf 指令？（若沒有，請請求 ChatGPT 產生）
- [ ] Windsurf 是否有給一段「可複製的回報摘要」？（方便貼回給 ChatGPT）


- [ ] 是否有清楚指示 Windsurf：
  - 要看哪些文件（例如：`docs/HTML_TO_MARKDOWN_RULES_V4.md`、`docs/PROJECT_TODO.md`）。
  - 要執行哪一個任務（例如：`[T-002][OPEN][W]`）？
- [ ] Windsurf 完成後，有沒有簡單看 diff 或結果？
- [ ] 有需要請 ChatGPT 幫忙 review 或優化嗎？


## 收工前（每一輪對話／每一個 T 任務收尾時）

- [ ] 今天完成了哪些任務？（簡短記錄即可）
- [ ] `docs/PROJECT_TODO.md` 裡，有沒有更新相關 T 任務的狀態與說明？
- [ ] `docs/Windsurf_ChatGPT_NOTES.md` 是否已新增本次任務的小節？
- [ ] 是否有需要暫存到 `docs/PENDING_DECISIONS.md` 的「尚未定案規則」？

- [ ] 已依照實作 Agent 提供的 `[Agent 回報摘要]`，確認本次變更已寫回：
  - `docs/PROJECT_TODO.md`（更新狀態、T 任務說明）
  - `docs/Windsurf_ChatGPT_NOTES.md`（新增本次任務小節）
  - `docs/PENDING_DECISIONS.md`（若有暫定規則）
  - `docs/terminal_logs/`（是否已新增本次指令的 log 檔）

- [ ] 已依照實作 Agent 提供的 `[建議 git 指令]` 完成：
  - `git status`
  - `git add ...`
  - `git commit -m "..."`（建議使用 `feat: T-000X ...` 或 `chore: T-000X ...`）
  - `git push origin main`

- [ ] 在執行 `[建議 git 指令]` 之前，**已檢查該區塊內沒有出現 `<...>`、`[...]` 或內嵌註解**（例如 `#`、`//`）。  
      若有，已請 Agent 重生一版「可以直接貼上執行」的指令。

- [ ] 如有需要給 ChatGPT 下一輪使用的 docs snapshot：
  - 已在本機執行：
    - `npm run snapshot:docs -- --task T-xxxx`
  - 新的 snapshot ZIP（例如 `snapshots/ctworld-docs-T-0008-YYYY-MM-DD-v1.zip`）已產生，且 **沒有被加入 git**。

- [ ] 若覺得當前 ChatGPT 對話已經太長、回應變慢或內容開始混亂：
  - 已完成上述 git / docs / snapshot 步驟。
  - 準備在新的 ChatGPT 對話中：
    - 上傳最新 docs snapshot ZIP（或指定 GitHub repo）。
    - 要求 ChatGPT 依 `docs/WORKFLOW_CHATGPT_GITHUB_WINDSURF.md` 的「新開對話啟動步驟」重新建立 context。

