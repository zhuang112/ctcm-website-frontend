# INSTR-T-0018-meta-instr-and-status-structure

指定執行者：實作 Agent（目前為 Codex）
任務：T-0018 meta-instr-and-status-structure

## 目標
1. 建立 `docs/INSTR/` 目錄，集中所有 INSTR 檔，並提供 README / Template。
2. 將現有 INSTR 檔以命名規則 `INSTR-T-xxxx-<slug>.md` 存放到 `docs/INSTR/`。
3. 在 notes 與 PROJECT_TODO 中註記本次整理，方便後續查找與追蹤。

---

## 要修改 / 參考的檔案
1. `docs/INSTR/` 目錄（新增 README、INSTR-TEMPLATE、搬移後的 INSTR 檔）。
2. `docs/PROJECT_TODO.md`（新增 T-0018 條目）。
3. `docs/Windsurf_ChatGPT_NOTES.md`（新增 T-0018 小節與 RAW 連結）。
4. （視需要）`docs/PROJECT_STATUS.md`：如需提醒 INSTR 集中化，可補充一句。

---

## 操作步驟
1. 建立 `docs/INSTR/` 目錄。
2. 將 INSTR 檔搬移並符合命名規則，例如：
   - `INSTR-add-T0016-zh-cn-health-check-tool-todo.md` → `INSTR-T-0016-zh-cn-health-check-tool-todo.md`
   - `INSTR-fix-communication-rules-no-citations.md` → `INSTR-T-0000-fix-communication-rules-no-citations.md`（跨任務通用規則暫以 0000 表示）
   - `INSTR-T0017-html-to-markdown-rules-cleanup.md` → `INSTR-T-0017-html-to-markdown-rules-cleanup.md`
   - `INSTR-update-workflow-full-access-rules.md` → `INSTR-T-0000-update-workflow-full-access-rules.md`
3. 在 `docs/INSTR/` 新增：
   - `README.md`：說明用途、命名規則、既有 INSTR 清單。
   - `INSTR-TEMPLATE.md`：建立新 INSTR 時可複製的模板（含 notes/RAW 連結區塊）。
4. 更新 `docs/PROJECT_TODO.md`：新增 T-0018 條目，描述 INSTR 整理、命名規則、notes/RAW 要求。
5. 更新 `docs/Windsurf_ChatGPT_NOTES.md`：新增 T-0018 小節，記錄搬移與新增檔案、commit hash、RAW 連結。
6. （選用）若需在 `docs/PROJECT_STATUS.md` 提醒 INSTR 集中化，可補充一句；無必要可略。

---

## 更新 PROJECT_TODO
1. 打開 `docs/PROJECT_TODO.md`。
2. 新增 T-0018 條目（狀態：已完成），說明：
   - INSTR 目錄與命名規則。
   - 需要在 notes 附 RAW 連結。

---

## 更新 notes（含 RAW 連結）
1. 打開 `docs/Windsurf_ChatGPT_NOTES.md`。
2. 在 2025-12-xx 區段新增「T-0018 meta-instr-and-status-structure」小節，記錄：
   - 搬移/新增的 INSTR 檔案。
   - README / Template 內容概述。
   - commit hash。
   - 變更檔案（含 RAW 連結）。

---

## 收尾（git + push）
1. `git status` 確認變更：`docs/INSTR/`、`docs/PROJECT_TODO.md`、`docs/Windsurf_ChatGPT_NOTES.md`（以及可能的 PROJECT_STATUS）。
2. `git add ...` / `git commit -m "T-0018: organize INSTR structure and add status/index docs"` / `git push origin main`。
3. 回報摘要：
   - 完成 T-0018；INSTR 集中到 `docs/INSTR/`，新增 README/Template。
   - notes 小節位置。
   - 最後 commit hash。