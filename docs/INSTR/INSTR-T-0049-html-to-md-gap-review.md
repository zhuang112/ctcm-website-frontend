# INSTR-T-0049-html-to-md-gap-review：HTML→Markdown 規則 vs 實作落差盤點（docs-only）

> 任務編號：T-0049  
> 類型：docs / review（不改程式）  
> 目標：盤點 `HTML_TO_MARKDOWN_RULES_V4.md` 規則與實作（html-to-markdown + adapters + 測試）之間的落差，結果寫進 `RULES_CROSSCHECK_NOTES_V1.md`，暫不修改程式碼。

---

## 1. 背景與目的

目前狀況：

- `docs/HTML_TO_MARKDOWN_RULES_V4.md` 已整理為現行主要規則，包含：
  - 標題 / 段落 / 換行
  - 清單 / 引言 / sutra 偈語
  - 圖片與圖說策略（featured / gallery / fallback）
  - index_page / 其他特殊樣板
  - 未知內容 fallback（body_markdown + unclassified flags）
- 實作散布在：
  - `src/html/html-to-markdown.ts`
  - `src/adapters/teaching-from-legacy.ts`
  - `src/adapters/news-from-legacy.ts`
  - `src/adapters/magazine-from-legacy.ts`
  - `tests/html/html-to-markdown.spec.ts`
  - `tests/adapters/*.spec.ts`

這顆 T 只做「**對照＋筆記**」，不直接改 code / tests / 規則檔。  
目的是為後續實作補強 T 做準備（例如 `T-00xx html-to-md-gap-fix` 之類）。

---

## 2. 允許與禁止的變更範圍

### 2.1 可以變更

- `docs/RULES_CROSSCHECK_NOTES_V1.md`
  - 新增一個針對 HTML→Markdown 的「實作落差筆記」小節。
- `docs/PROJECT_TODO.md`
  - 新增 T-0049 條目，說明本次任務與狀態（✅）。
- `docs/Windsurf_ChatGPT_NOTES.md`
  - 新增 T-0049 小節，記錄摘要、變更檔案、測試情況（本次預期 docs-only）、最後 commit hash、RAW 連結。

### 2.2 不可以變更

- 不修改任何 `src/`、`tools/`、`tests/`、`data/` 檔案。
- 不修改 `docs/HTML_TO_MARKDOWN_RULES_V4.md` 本體（這顆 T 只做觀察與筆記）。
- 不修改其他 docs，除上述三份（RULES_CROSSCHECK_NOTES_V1 / PROJECT_TODO / Windsurf_ChatGPT_NOTES）。

---

## 3. 工作內容（給 Codex 的步驟）

### 3.1 閱讀與對照範圍

請依下列順序閱讀（只讀、不改）：

1. 規則檔：
   - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
2. 實作檔：
   - `src/html/html-to-markdown.ts`
   - `src/adapters/teaching-from-legacy.ts`
   - `src/adapters/news-from-legacy.ts`
   - `src/adapters/magazine-from-legacy.ts`
3. 測試檔：
   - `tests/html/html-to-markdown.spec.ts`
   - `tests/adapters/teaching-from-legacy.spec.ts`
   - `tests/adapters/news-from-legacy.spec.ts`
   - `tests/adapters/magazine-from-legacy.spec.ts`

### 3.2 針對主要主題做「規則 vs 實作」整理

在 `docs/RULES_CROSSCHECK_NOTES_V1.md` 中，新增一個小節，例如：

```
### 3.x HTML→Markdown 實作落差盤點（T-0049）

- ✅ 已對齊：
  - ...
- ⚠️ 尚未完全覆蓋 / 規則有寫但實作沒有：
  - ...
- 📌 建議未來 T：
  - ...
```

請至少涵蓋以下主題：

- 標題 / 段落 / 換行  
  V4 中對 `<h1>`~`<h6>`、一般 `<p>`、多段落換行／連續 `<br>` 的規則。  
  實作是否完全依照 V4？有沒有特別處理連續 `<br>`、空行壓縮等？

- 清單（有序 / 無序）  
  V4 對 `<ul>/<ol>/<li>` 的處理（縮排層級、嵌套 list、特別 class）。  
  實作是否有處理多層 list？有沒有和規則不一致的地方？

- 引用 / sutra 偈語 / 特殊 block  
  V4 中對 blockquote / sutra / 偈語的規則（例如：偈語轉多行 `>`、meta 標記等）。  
  實作實際怎麼做（教學 adapter + HTML→MD）；是否所有情境都有測試覆蓋？

- 圖片與圖說（featured / gallery / fallback）  
  V4 描述：哪些進 body_markdown？哪些進 JSON 裡的圖片陣列（目前 schema 可能還未完全實作）？  
  實作現狀：目前 HTML→MD / adapters 對圖片做了什麼？哪些規則還只是文件上的構想、尚未落實？

- index_page / 特殊樣板  
  V4 中若有描述 index_page 或特殊 layout（例如：目錄列表、分欄）。  
  實作中是否已有處理？還是目前完全忽略、交給未來 T？

- 未知內容 fallback + unclassified flags  
  V4 / schema / workflow 一致的地方：遇到無法分類的內容 → body_markdown + meta.has_unclassified_content 等。  
  實作目前是否有這樣的判斷？還是還沒實作，只是 docs 有寫？

每個小點請用簡短的 bullet 說明：
- ✅：規則與實作已經對齊，哪支程式／測試覆蓋。  
- ⚠️：規則有寫但實作沒有、或實作和規則略有出入。  
- 📌：可以提議 1–2 個未來 T 的代號（先用 T-00xx 佔位即可），例如：
  - `T-00xx html-to-md-gap-fix-headings-lists`
  - `T-00xx html-to-md-gap-fix-images-gallery`

### 3.3 更新 PROJECT_TODO 與 NOTES

- 在 `docs/PROJECT_TODO.md` 中新增 T-0049 條目：
  - 標題：`T-0049 html-to-md-gap-review：HTML→Markdown 規則 vs 實作落差盤點`
  - 狀態：✅ 已完成
  - 內容簡要說明：目標：盤點 V4 規則與實作／測試的差異，結果寫入 RULES_CROSSCHECK_NOTES_V1；驗收：有條列「✅ 已對齊 / ⚠️ 待補 / 📌 未來 T 建議」，未修改任何程式碼。
- 在 `docs/Windsurf_ChatGPT_NOTES.md` 新增一個小節，內容至少包含：
  - 目的與摘要
  - 更新的檔案（RULES_CROSSCHECK_NOTES_V1 / PROJECT_TODO / notes 自己）
  - 測試情況：docs-only，未執行 test/build/check:zh-cn
  - commit hash
  - RAW 連結（依現有 notes 慣例）

### 3.4 測試與建置

本任務為 docs-only，依 workflow 安全等級，可以 **不執行**：
- `npm test`
- `npm run build`
- `npm run check:zh-cn`

但仍需在 notes 中明確寫出「本次未執行 test/build/check:zh-cn（docs-only）」。

### 3.5 Commit 規則

- 確認只有以下檔案有變更：
  - `docs/RULES_CROSSCHECK_NOTES_V1.md`
  - `docs/PROJECT_TODO.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`
- 建議 commit 訊息：`T-0049: html-to-md rules vs impl gap review`
- push 至 `origin/main`。
- 在 notes 的 T-0049 小節中填入最後 commit hash。

### 3.6 給 ChatGPT review 的檔案清單（完成後）

完成後請使用者上傳以下本機檔案給 ChatGPT：
- `docs/RULES_CROSSCHECK_NOTES_V1.md`
- `docs/PROJECT_TODO.md`
- `docs/Windsurf_ChatGPT_NOTES.md`

若後續需要做更細的 code review，再另外指定需要上傳的 src/ / tests/ 檔案。
