# GOLDENS_POLICY（V3 Debug）

> 目的：為避免樣本漂移，golden 應固定來源、明確說明產生方式。

- 放置路徑：
  - JSON 輸出：`docs/QA/DEBUG_V3/GOLDENS/JSON/`
  - HTML 原文：`docs/QA/DEBUG_V3/GOLDENS/HTML/`
- 命名：`<unit>_<slug>_<version>.{json,html}`，例：`teaching_sample-001_v1.json`
- 來源說明：每個檔案旁以同名 `.txt` 簡述來源與產生指令（可選）。
- 更新原則：
  - 若規則變動需更新 golden，應在 NOTES 記錄原因與影響。
  - 不可隨意覆蓋無記錄的版本，必要時保留 `_v2`、`_v3` 並在 README/notes 說明。
