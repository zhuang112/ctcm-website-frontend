

---

## 與 AI 實作工具協作時的原則

- 建議由 ChatGPT 先產生「規格＋骨架程式碼」，再交由 Windsurf / Cursor 在既有骨架中填寫實作，
  避免 AI 任意改變 public API 或資料結構。
- 實作任務應拆成小步驟，每次只處理單一檔案或單一功能，並在任務描述中明確標註允許修改的範圍。
- 若有測試檔（例如 `tests/*.spec.ts`），AI 實作的完成標準以「所有相關測試通過」為主，
  不鼓勵在未更新規格文件的情況下，為了讓測試通過而暗中變更 schema。
- 重要核心流程（例如 HTML→AnyContent、繁→簡 pipeline），
  建議在 AI 實作後，由 ChatGPT 再做一輪 code review，確認符合長期維護與文件規範。

