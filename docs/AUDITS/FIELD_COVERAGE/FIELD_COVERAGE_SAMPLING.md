# FIELD_COVERAGE_SAMPLING

> Version: V1  
> Last updated: 2025-12-13 (T-0064 V2，docs-only)  
> Scope: teaching / news / magazine / flipbook / branch（抽樣覆蓋度與缺口筆記）

---

## 1) 樣本覆蓋表（小批次抽樣）

| 類型 | 樣本來源 | 覆蓋狀態 | 缺口嚴重度 | 備註 / 後續建議 |
| --- | --- | --- | --- | --- |
| teaching | `data/legacy-teaching/sample-001.html` → `data/anycontent/zh-tw|zh-cn/teaching/sample-001.json` | ✅ 主要欄位覆蓋：偈語、meta、default_gallery_style、gallery_blocks | Medium | 圖片 caption 仍以 alt 為主，缺少鄰近文字對齊策略。 |
| news | `data/legacy-news/sample-001.html` → `data/anycontent/zh-tw|zh-cn/news/sample-001.json` | ✅ 日期/地點/分類 meta 已覆蓋；gallery style/block 已輸出 | High | 尚未驗證民國年/區間日期；需補 ROC & 區間 parsing。 |
| magazine | `data/legacy-magazine/sample-001.html` → `data/anycontent/zh-tw|zh-cn/magazine/sample-001.json` | ✅ 期別 / 出刊日 meta + gallery style/block | Medium | flipbook/附件尚未覆蓋；需樣本。 |
| flipbook | 無實際樣本 | ⛔ 缺料 | High | 需提供 HTML/PDF/flipbook 範例再定義欄位與 importer 行為。 |
| branch/index_page | 無實際樣本 | ⛔ 缺料 | Medium | 需具體 URL/HTML 確認 index_page/branch 欄位與呈現。 |

---

## 2) 缺口與建議（優先級）

- **High**
  - ROC 年 & 區間日期 parsing（news）。
  - flipbook/附件 mapping（需樣本）。
- **Medium**
  - crawler/HTML encoding fallback（Big5/CP950 等無法判讀時的策略）。
  - gallery caption 對齊策略（alt 缺失時的 heuristics / 鄰近文字）。
  - branch/index_page coverage（待樣本）。
- **Low**
  - gallery style/blocks 進階樣式；已輸出 default style + main_gallery，其他版型待更多樣本。

---

## 3) 後續 T 候選（僅列題目，不在本次實作）

- T-00xx date-parsing-roc-year-and-range（news 日期 ROC/區間容錯 + 測試）。
- T-00xx crawler-encoding-fallback（編碼偵測/失敗提示）。
- T-00xx gallery-caption-alignment-strategy（alt 缺失時的取值策略）。
- T-00xx flipbook-samples-and-schema（收集樣本，定義欄位）。
- T-00xx branch-index-samples-and-schema（收集樣本，定義欄位）。

---

## 4) QA / 注意事項

- 出生年/民國年/區間日期：需確認 parsing 邏輯並補測試。
- has_unclassified_content / unclassified_notes：遇到未知區塊請明確標註，避免默默吞掉。
- caption / alt 策略：目前僅取 alt；若 alt 缺失是否要讀鄰近文字需後續決策。
- teaching anchor preservation：legacy `<a name="item02">` 類錨點是否需保留，待樣本決策。
- 分支/列表頁（branch/index_page）：需實際 HTML 才能定義欄位。

---

## 5) URL Queue（抽樣來源待補）

請將待抽樣的 URL 以 `[unit] <url>` 方式紀錄於 `docs/AUDITS/FIELD_COVERAGE/URL_QUEUE.md`（unit = teaching/news/magazine/branch/flipbook/other）。
