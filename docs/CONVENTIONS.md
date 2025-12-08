

---

## AI / IDE 協作相關慣例

- `src/types/*.ts`、`tools/types/*.ts` 中定義的 TypeScript interface / type，
  視為內容 schema 的「契約」，不得由 IDE / AI 自行改名、刪除或重新定義欄位。
- 當使用 Windsurf / Cursor 等 AI IDE 實作功能時，
  應優先限制修改檔案內標註 `// TODO` 的區塊；非經明確指示，不重構整個檔案或跨檔案大幅調整架構。
- 關於 HTML→Markdown / JSON 的詳細規則，以 `docs/HTML_TO_MARKDOWN_RULES_V3.md` 為唯一權威來源，
  程式實作若與其衝突，應優先依照該文件修正。

