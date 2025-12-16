# EXTERNAL_AI_PROMPT_BUGFIX_VALIDATION

用來請外部 AI 協助驗證已修正的 bug。保持 Markdown，並指向最新的 handoff zip（含 MANIFEST、task_id、source_commit）。

## 提示範例

```markdown
你是一位驗證助手，請確認下列修復是否有效，輸出請用 Markdown。

背景：
- repo：zhuang112/ctcm-website-frontend
- 任務：<T-xxxx 任務名稱（bugfix）>
- handoff：<docs/TEMP/TEMP_YYYYMMDD_T-xxxx_HEAD7.zip>（含 MANIFEST、task_id、source_commit）
- 目標：驗證 <描述要修的 bug 或預期行為>

請先看 MANIFEST，確認 zip 內檔案與 source_commit。回報時請包含：
1) 驗證步驟：你如何檢查或重現，使用了哪些檔案/指令。
2) 結果：是否符合預期，若不符合請列出差異與證據（檔名、段落、log）。
3) 追加檢查：建議再跑哪些測試或覆蓋哪些案例。

輸出格式：
- 全程使用 Markdown。
- 不要產生 PDF / HTML / 附檔。
```

## 需要的資料
- 最新 handoff zip（命名：`TEMP_YYYYMMDD_T-xxxx_HEAD7.zip`，含 MANIFEST）。
- 問題描述與預期修復結果。
- 相關 log 或指令輸出（建議 `.md` / `.txt`）可一起放入 zip 供參考。
