# AI Review Dry-Run（T-TEST-0001）

僅供測試，不呼叫外部 AI；產生固定報告樣板：

```
npm run ai:review:dryrun
```

預設參數：`--task T-TEST-0001 --reviewers gemini,grok,claude,chatgpt --mode cheap`。可自訂：

```
node tools/ai-review-dryrun/review.mjs --task T-TEST-0001 --reviewers grok,chatgpt --mode strict
```

輸出：`docs/QA/DEBUG_V3/REPORTS/T-TEST-0001/AI_DEBUG_DRYRUN_20251219.md`（含 Summary / Routing / Inputs / Findings / Suggested Fix / Tests / Non-goals；若無 diff 會標示 `(no pending changes)`）。
