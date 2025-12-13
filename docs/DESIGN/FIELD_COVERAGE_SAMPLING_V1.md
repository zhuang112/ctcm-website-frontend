# FIELD_COVERAGE_SAMPLING_V1

> 版本：2025-12-12（T-0064）  
> 目的：以小樣本審視 AnyContent 欄位覆蓋度，標記缺口並提供後續 T 任務候選。  
> 範圍：docs-only，未修改程式碼。

---

## 1. 樣本覆蓋表（teaching / news / magazine / flipbook / branch）

| 類型 | 樣本來源 | 覆蓋狀態 | 缺口嚴重度 | 備註 / 後續建議 |
| --- | --- | --- | --- | --- |
| teaching | `data/legacy-teaching/sample-001.html` → `data/anycontent/zh-tw|zh-cn/teaching/sample-001.json` | ✅ 主要欄位覆蓋：偈語、meta、default_gallery_style、gallery_blocks | Medium | 圖片 caption 仍以 alt 為主，缺少圖說欄位對齊策略（見下方建議）。 |
| news | `data/legacy-news/sample-001.html` → `data/anycontent/zh-tw|zh-cn/news/sample-001.json` | ✅ 日期/地點/分類 meta 已覆蓋；gallery style/block 已輸出 | High | 尚未驗證複雜日期（區間、民國年）；建議開「ROC 年 & 區間 parsing」任務。 |
| magazine | `data/legacy-magazine/sample-001.html` → `data/anycontent/zh-tw|zh-cn/magazine/sample-001.json` | ✅ 期別 / 出刊日 meta + gallery style/block | Medium | Flipbook/附件尚未覆蓋；需後續 task 規劃。 |
| flipbook | 無實際樣本 | ⛔ 缺料 | High | 需使用者提供 HTML/PDF/flipbook 範例後再評估欄位與 importer 行為。 |
| branch/index_page | 無實際樣本 | ⛔ 缺料 | Medium | 需具體 URL/HTML 以確認 index_page/branch 欄位需求。 |

---

## 2. 缺口與建議（優先級）

- High：  
  - ROC 年 & 區間日期 parsing（news）：需處理民國年、日期區間（起迄）與多格式容錯。  
  - flipbook/附件 mapping：等待實際樣本；確認欄位（檔名、URL、顯示位置）。

- Medium：  
  - crawler/HTML encoding fallback：需在無法確定編碼時提供 fallback 或明確錯誤提示。  
  - gallery caption 對齊策略：若 alt 缺失，caption 是否需要額外 heuristics（例如鄰近文字）。  
  - branch/index_page coverage：需樣本確認欄位與呈現。

- Low：  
  - gallery style/blocks 進階樣式：已有 default style + main_gallery，其他版型可待更多樣本。

---

## 3. 後續 T 任務候選（不在本次實作）

- T-00xx date-parsing-roc-year-and-range：針對 news 日期欄位補 ROC 年與區間容錯，更新 tests + adapters。  
- T-00xx crawler-encoding-fallback：爬蟲/轉檔時的編碼偵測與 fallback 策略，明確錯誤訊息。  
- T-00xx gallery-caption-alignment-strategy：補充圖片 caption 取值策略（alt 缺失時的鄰近文字/標籤 heuristics）。  
- T-00xx flipbook-samples-and-schema：收集 flipbook 樣本並定義欄位/匯入策略。  
- T-00xx branch-index-samples-and-schema：收集 branch/index_page 樣本並定義欄位。

---

## 4. 本次採樣結論

- 現有 teaching/news/magazine sample-001 足以覆蓋核心欄位，但無法驗證複雜日期、flipbook、branch。  
- 高優先缺口：news 日期 ROC/區間；flipbook/附件缺料。  
- 中優先缺口：encoding fallback、gallery caption 取值策略；branch/index_page 缺料。  
- 建議依上方候選 T 拆解後續工作，並持續要求新增樣本再驗證。***
