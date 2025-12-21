# INCOMING_DOWNLOADS

統一的下載物入口與分類流程。請將所有外部下載檔案先放到 `_INBOX/`，再執行 `npm run qa:intake-downloads` 進行分類與改名。

## 目錄結構
- `_INBOX/`：所有下載物初始放置處（跑指令前）。
- `_QUARANTINE/`：無法判斷或含可疑內容的檔案會被移到這裡。
- `_PROCESSED/`：保留已處理完成但尚未移除的下載原檔（可選，腳本目前不會自動使用）。
- `_LOGS/`：每次 intake 的 JSONL / Markdown 紀錄。

## 使用方式（Step 0）
1) 將下載檔放入 `docs/QA/INCOMING_DOWNLOADS/_INBOX/`（勿直接散落 repo）。
2) 執行：`npm run qa:intake-downloads`
3) 依終端輸出檢查：
   - 檔案被移到的目的路徑（HANDOFF/REPORT/INFO/ADVICE/QUARANTINE 等）。
   - `_LOGS/intake_*.jsonl`、`_LOGS/intake_*.md` 內的紀錄。
4) 若有檔案被隔離（quarantine），請先處理原因再繼續後續工作。

## 檔名/分類規則（摘要）
- 重新命名格式：`<YYYYMMDD>_<KIND>_<TASK_OR_TOPIC>_<short>[_HEAD7].<ext>`
- KIND 範例：HANDOFF / PATCH / REPORT / ADVICE / INFO / UIZIP / ASSET / UNKNOWN
- 任務/主題：優先取檔名中的 `P2-xxxx` / `T-xxxx`，否則使用 `UNSORTED`。
- 常見路徑：
  - HANDOFF：`docs/TEMP/`
  - PATCH：`docs/QA/INCOMING_PATCHES/<task_id>/`
  - REPORT/ADVICE/INFO：`docs/QA/DEBUG_V3/REPORTS/...`
  - 其他無法判斷：`docs/QA/INCOMING_DOWNLOADS/_QUARANTINE/`

## 範例輸出（摘要）
- 終端：
  - `Moved 20251221_REPORT_P2-0008_sample.md -> docs/QA/DEBUG_V3/REPORTS/P2-0008/20251221_REPORT_P2-0008_sample.md`
- 日誌：`docs/QA/INCOMING_DOWNLOADS/_LOGS/intake_20251221_105700.jsonl` / `.md`
