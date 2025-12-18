# INCOMING_PATCHES（無 Git 的 Agent Patch 收件匣）

用途：收錄「無法使用 Git 的 Patch Producer」產出的 patch metadata（避免散佚、方便追溯）。

## 檔名建議
- `PATCH_<YYYYMMDD>_<T-ID>_<agent>_r<rev>.zip`

## Patch ZIP 必含
- `APPLY_INSTRUCTIONS.md`：說明每個檔案應放哪裡、是否覆蓋/附加、需要的 npm 驗收指令。
- `PATCH_MANIFEST.json`：列出每個檔案的目標路徑與 sha256。
- 實際檔案內容（如 template、章節增補等）。

## 在 repo 中的保存方式（避免把 ZIP 納入 git）
- ZIP 可以留在 repo 之外（不進 git）；但以下兩個檔案需「拆出來」存入 repo 以利追蹤：  
  - `docs/QA/INCOMING_PATCHES/<T-ID>/APPLY_INSTRUCTIONS.md`  
  - `docs/QA/INCOMING_PATCHES/<T-ID>/PATCH_MANIFEST.json`

## 落地流程
- Landing 完成並產出 canonical TEMP handoff 後，該 patch 視為「已消化」。
- 建議在 `docs/Windsurf_ChatGPT_NOTES.md` 的對應 T 小節記錄：patch 檔名、landing commit hash、handoff zip 路徑。 
