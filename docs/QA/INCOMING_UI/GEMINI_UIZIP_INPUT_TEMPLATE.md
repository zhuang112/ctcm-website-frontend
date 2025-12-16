# Gemini UIZIP Input Template（T-0104）

請在提交前確認以下項目：
- 檔名：`UIZIP_<YYYYMMDD>_<page_or_feature>_<rev>.zip`（例：`UIZIP_20251216_homepage_r1.zip`）。
- ZIP 內容：
  - 必含 `UI_HANDOFF.md`，說明頁面/元件、檔案結構、對應 repo 路徑（如 `apps/astro/src/components|layouts|pages|styles/...`）、可執行驗證指令或預覽 URL、已知限制。
  - 不要包含 `node_modules/`、大型二進位素材；保留必要截圖/設計稿即可。
  - 若有 DevTools 量測的參數（max-w、fonts、colors、spacing、radius、shadow、ratio、clamp、hover/sticky/menu/tabs/accordion），請附在 `UI_HANDOFF.md` 或子文件。
- 上傳位置：`docs/QA/INCOMING_UI/`
- 收尾：通知 Agent 依 `UI_HANDOFF.md` mapping 落檔後，產生標準 handoff `docs/TEMP/TEMP_<date>_T-xxxx_<HEAD7>.zip`。
