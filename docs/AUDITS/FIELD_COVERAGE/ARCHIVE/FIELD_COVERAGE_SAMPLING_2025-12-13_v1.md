# FIELD_COVERAGE_SAMPLING (Archive 2025-12-13 V1)

> 摘要：T-0064 V1 抽樣筆記（teaching/news/magazine），後續版本請參考 `docs/AUDITS/FIELD_COVERAGE/FIELD_COVERAGE_SAMPLING.md`。  
> 範圍：docs-only。

## 樣本覆蓋表（V1）

| 類型 | 樣本來源 | 覆蓋狀態 | 缺口嚴重度 | 備註 |
| --- | --- | --- | --- | --- |
| teaching | sample-001（zh-tw/zh-cn） | ✅ 偈語、meta、default_gallery_style、gallery_blocks | Medium | caption 以 alt 為主，缺鄰近文字策略 |
| news | sample-001（zh-tw/zh-cn） | ✅ 日期/地點/分類；gallery style/block | High | 未驗證民國年/區間日期 |
| magazine | sample-001（zh-tw/zh-cn） | ✅ 期別/出刊日；gallery style/block | Medium | flipbook/附件缺料 |
| flipbook | 無 | ⛔ | High | 需樣本 |
| branch | 無 | ⛔ | Medium | 需樣本 |

## 缺口列表（V1）

- High：ROC 年 / 區間日期；flipbook/附件缺料。  
- Medium：encoding fallback；gallery caption（alt 缺失時）；branch/index_page 缺料。  
- Low：進階 gallery style/block。

## 後續 T 候選（V1）

- T-00xx date-parsing-roc-year-and-range  
- T-00xx crawler-encoding-fallback  
- T-00xx gallery-caption-alignment-strategy  
- T-00xx flipbook-samples-and-schema  
- T-00xx branch-index-samples-and-schema
