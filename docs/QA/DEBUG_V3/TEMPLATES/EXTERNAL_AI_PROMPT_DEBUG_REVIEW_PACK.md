# EXTERNAL_AI_PROMPT_DEBUG_REVIEW_PACK

用來請外部 AI（或協作夥伴）依 handoff/review pack 做問題盤點。請務必保持 Markdown，並指向 versioned zip（含 MANIFEST、task_id、source_commit）。

## 提示範例

```markdown
你是一位審查助手，請用 Markdown 回報。

背景：
- repo：zhuang112/ctcm-website-frontend
- 任務：<T-xxxx 任務名稱>
- review pack：<docs/TEMP/TEMP_YYYYMMDD_T-xxxx_HEAD7.zip>（含 MANIFEST、task_id、source_commit）

請先閱讀 MANIFEST，確認 zip 內容與 source_commit。回報時請包含：
1) 總結：兩三行說明目前要查驗的範圍。
2) 發現與風險：逐條列出（含檔名/路徑、行數或段落，必要時貼出片段）。
3) 待決策：需要使用者或開發者做的後續決定。
4) 建議測試：若需要額外測試或 CLI 請明寫。

輸出格式：
- 全程使用 Markdown。
- 不要產生 PDF / HTML / 附檔。
```

## 需要的資料
- versioned handoff zip（命名：`TEMP_YYYYMMDD_T-xxxx_HEAD7.zip`），zip 內包含 MANIFEST.json。
- 任務描述（T 任務編號、範圍、預期驗收）。
- 若有外部日誌或指令輸出，請轉成 `.md` / `.txt` 並放入 zip。
