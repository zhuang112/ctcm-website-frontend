# PENDING_DECISIONS：尚未寫入正式 workflow / schema 的決策暫存區

> 用途：先把「已經大致討論過，但還不想立即修改正式文件」的想法、規則或設計，暫時記錄在這裡。
> 當累積到一定程度時，再由 ChatGPT 協助整理、整併到對應的正式文件（例如 WORKFLOW、TOOLS_ROLES_AND_BOUNDARIES、CONTENT_SCHEMA 等）。

使用建議：

- 當你或實作 Agent（Windsurf / Codex）：
  - 對某個流程有新的想法，但還在觀察是否適用所有情境。
  - 對某個欄位命名、schema 結構有暫定方案，但尚未最後定案。
  - 在 debug / 開發過程中發現一個可以優化的點，但不想打斷當前任務。
- 就可以在本檔案新增一條紀錄，而不是直接改動所有相關的正式文件。

建議紀錄格式（範例）：

```markdown
## 2025-12-09 Codex 設定細節（已初步共識，待整理進 TOOLS_ROLES_AND_BOUNDARIES）

- 決策類型：工具設定 / Codex
- 背景：
  - 為了讓 Codex 成為主要實作 Agent，需要一套固定的預設模式與模型選擇。
- 暫定決策：
  - Mode：使用「Agent」模式，而非 Chat / full access。
  - Model：GPT-5.1-codex-max。
  - Reasoning：
    - 預設 medium。
    - 僅在大型重構或跨整個 pipeline 的設計／除錯時使用 high。
- 預計寫入的正式文件與位置：
  - `docs/TOOLS_ROLES_AND_BOUNDARIES.md` 的 ChatGPT / 實作 Agent / Codex 小節。
- 備註：
  - 實際使用之後，若有需要微調模式或模型，再開新小節補充修訂版。
```

實務建議流程：

1. 先把暫定想法寫入本檔案。
2. 在下一次與 ChatGPT 的協作中，將本檔案內容打包進 docs snapshot ZIP，一起上傳。
3. 由 ChatGPT 協助檢視哪些條目已經成熟，可以：
   - 併入 `docs/WORKFLOW_CHATGPT_GITHUB_WINDSURF.md`。
   - 併入 `docs/TOOLS_ROLES_AND_BOUNDARIES.md`。
   - 併入其他 schema／rules 檔案。
4. 一旦正式文件已更新，對應的條目即可在本檔案標註為「已處理」或刪除，以保持本檔案精簡。
