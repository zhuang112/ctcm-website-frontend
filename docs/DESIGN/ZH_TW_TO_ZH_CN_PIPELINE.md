# ZH_TW_TO_ZH_CN_PIPELINE（canonical）

> 版本：2025-12-16（docs first，但已有 v1 pipeline＋health check 可運行）  
> 目的：定義 zh-TW → zh-CN 繁簡轉換的欄位白名單、資料流、CLI 規格與 QA 報表，作為單一真相；目前已有 v1 pipeline（含 `npm run check:zh-cn`），本檔持續對齊與更新，其他舊稿請改讀本檔。

---

## 1. 目標與範圍

- 輸入：zh-TW 版 AnyContent JSON（teaching / news / magazine 等 post_type）。
- 輸出：對應的 zh-CN JSON，維持原結構與 multilingual 關聯，僅對白名單欄位做繁→簡。
- 不改：id、URL、數字、enum 及其他非文字欄位；不改 schema。

---

## 2. 欄位白名單（需要做繁→簡）

- Post 級：
  - `title` / `post_title`
  - `excerpt` / `post_excerpt`
  - `body_markdown`
- Meta 中的中文說明欄位（依 `CONTENT_SCHEMA_V1` 為準），例如：
  - `ct_speaker_name`, `ct_location`, `ct_teaching_category`, `ct_news_category`
  - 其他描述型 string 欄位（需隨 schema 變動同步更新）
- SEO / og / social 中文欄位：
  - `seo.meta_title`
  - `seo.meta_description`

### 保留欄位（不轉換）

- `id` / `uuid` / `external_id`
- `slug` / `url` / `permalink` / `old_url`
- 日期、時間、數字、enum 類欄位
- 語言欄位（例如 `language: "zh-tw" | "zh-cn"`）：由 pipeline 直接設為目標語言，不透過 OpenCC。

> 欄位實際清單以 `docs/CONTENT_SCHEMA_V1.md` 為準；schema 更新時需同步調整此白名單。

---

## 3. 資料來源與輸出目錄（暫定）

- 輸入（source）：zh-TW AnyContent JSON  
  - 建議目錄：`data/anycontent/zh-tw/**/*.json`（可視實際狀況微調）
- 輸出（target）：zh-CN AnyContent JSON  
  - 建議目錄：`data/anycontent/zh-cn/**/*.json`
- 對應規則：
  - 每個 zh-TW 檔對應產生一個 zh-CN 檔，檔名沿用，目錄改為 `zh-cn`。
  - 若目前 repo 尚無實際 JSON 檔，此為目標結構，實作時可再微調。

---

## 4. CLI：generate-zh-cn-from-zh-tw

- 預計檔案：`tools/convert/generate-zh-cn-from-zh-tw.ts`
- 功能（v1）：
  - 掃描指定的 zh-TW JSON 目錄（`--input`）。
  - 逐檔讀取 AnyContent JSON，針對白名單欄位做繁→簡。
  - 將結果寫入輸出目錄（`--output`），維持原結構與 multilingual 關聯。
- 預計參數：
  - `--input <dir>`：zh-TW JSON 根目錄。
  - `--output <dir>`：輸出 zh-CN JSON 根目錄。
  - （選用）`--dry-run`：僅列出預計處理的檔案與變更摘要，不寫檔。
- 使用範例：

```bash
# 產生 zh-CN JSON，從預設 zh-TW 資料夾讀取
npx ts-node tools/convert/generate-zh-cn-from-zh-tw.ts \
  --input data/anycontent/zh-tw \
  --output data/anycontent/zh-cn
```

- 本任務僅定義規格，不實作程式碼；實作將在後續 T 任務進行。

---

## 5. 繁→簡轉換工具策略

- 預期使用 OpenCC 或相容的繁簡轉換工具，支援 zh-TW → zh-CN 字形轉換。
- 在 pipeline 程式中包一層 utility，例如 `convertToZhCn(text: string): string`，集中管理設定。
- 未來實作（後續 T 任務）需：
  - 安裝並設定繁簡轉換套件。
  - 撰寫基本測試案例，確保常見詞彙轉換正確。
  - 嚴格遵守白名單；避免對 URL、ID、enum、數字進行轉換。

---

## 6. multilingual 關聯與輸出

- `language` 欄位：在輸出 JSON 明確設為 `"zh-cn"`。
- `multilingual.translations`：
  - 若輸入已有 zh-tw → zh-cn 的 planned 條目，可在輸出中標記為 generated。
  - 若無，實作時可於輸出補上對應的 zh-cn 條目（細節在實作任務中補充）。
- 其他欄位：除白名單轉換外，其餘結構與值應與原 zh-TW JSON 保持一致。

---

## 7. QA 資源與報表

- 白名單 / 規則：
  - `rules/whitelist_fields.json`
  - `rules/normalize_zhTW.tsv`
  - `rules/fix_zhCN.tsv`
- 檢查報表（由 `npm run check:zh-cn` 產生，或後續 CLI）：
  - `reports/report_hits.md`：命中統計與問題摘要。
  - `reports/report_candidates.md`：候選修正／可疑欄位清單。
- -gb 舊站：目前不依賴 `-gb` HTML，主要以 AnyContent JSON 為基礎；如需 -gb 對照，請在報告中註記來源。

---

## 8. 後續任務建議

- T-0014（待開）：實作 `generate-zh-cn-from-zh-tw.ts`，完成 CLI + 測試。
- T-0015（待開）：加入更多欄位與實際檔案路徑支援，並驗證 multilingual 關聯。
- T-0016（待開）：整合至 WordPress importer / 前端顯示（若有需要）。

---

## 9. 取代舊稿

- 本檔為 zh-TW → zh-CN pipeline 的 canonical。若發現其他位置有舊稿或重複內容，請一律以本檔為準，並在舊檔標註已被取代。
