
# INSTR：T-0017 html-to-markdown-rules-cleanup（整理 HTML→Markdown 規則文件）

下列內容可整段貼給 Codex，讓它幫忙「整理 HTML→Markdown 規則」，重點是 **整理 docs，不改現有轉換程式的核心行為**。

---

```text
你現在是這個專案的主要實作 Agent。

任務代號：T-0017 html-to-markdown-rules-cleanup

目標（一句話版）：
讓 `docs/HTML_TO_MARKDOWN_RULES_V4.md` 變成一份「單檔就看得懂」的 HTML→Markdown 規則文件，對實作 adapter / 測試的人來說更好讀，並在 PROJECT_TODO / notes 中留下記錄。

本次主要動在 docs：
- `docs/HTML_TO_MARKDOWN_RULES_V4.md`（主角）
- `docs/PROJECT_TODO.md`
- `docs/Windsurf_ChatGPT_NOTES.md`

不要求修改轉換程式本身（`tools/convert/*`、`src/adapters/*` 等），除非你在閱讀過程中發現明顯 bug，且 ChatGPT / 使用者後續另開任務。

================================
【步驟一】整理 HTML_TO_MARKDOWN_RULES_V4.md 結構與可讀性
================================

1. 打開 `docs/HTML_TO_MARKDOWN_RULES_V4.md`。

2. 在檔案開頭（標題之後、現有內容之前），新增一個「文件導讀 + 快速索引」小節，例如：

   ```markdown
   ## 0.x 文件導讀與快速索引

   本檔是目前 HTML→Markdown / AnyContent 轉換規則的最新版，重點包含：

   - 全域清理規則：移除不要的標籤（script/style/nav/footer/form 等）、表格處理。
   - 區塊元素 → Markdown：標題階層、段落、blockquote、列表、pre/code。
   - 連結處理：內外連結、mailto/tel、舊站相對路徑。
   - 圖片與圖說規則：featured_image / gallery_items / featured_image_caption（本版的主要更新）。
   - 各 post_type 特殊規則：teaching、news、magazine、branch… 與圖片的互動。
   - 測試與驗證：對應的 sample HTML 與測試檔案位置。

   下列小節多為沿用前版規則，本版只在「圖片與圖說」部分做較大的更新。
   ```

   文字可依實際內容微調，但精神是：
   - 告訴閱讀者：這份檔案包含哪些類型的規則。
   - 明確說出「本版只大幅更新圖片／圖說規則，其餘多與前版一致」。

3. 對「0. 目標與輸入輸出」「1. 全域清理規則」「2. 區塊元素 → Markdown」「3. 連結處理」這幾段，目前是「（略，同前版）」的地方：

   - 保留「沿用前版」這個訊息，但補上一段「一眼看懂」的摘要，避免讀者需要翻前版才知道大方向。
   - 例如：

     ```markdown
     ## 1. 全域清理規則（沿用前版）

     （沿用前版 V3 規則，這裡只摘要重點，詳細細節見檔尾附註或 ARCHIVE。）

     - 移除整個 `<script>`, `<style>`, `<nav>`, `<footer>`, `<form>` 節點及其內容。
     - 對主要用於排版的 `<table>`，傾向展平成段落或列表，而不是輸出為 Markdown 表格。
     - 清理多餘的 `<span>`、空白文字節點與重複 `<br>`。
     - 保留語意強的 inline 標籤，例如 `<strong>`, `<em>`, `<code>`，並轉為對應 Markdown。
     ```

   - 具體條目請依你目前看到的舊版規則 / 測試行為自行整理，**不要憑空發明新行為**。
   - 若需要引用前版細節，可以在檔案某處附一小段「前版補充說明」或指向 `ARCHIVE/`（若有），但本任務不要求你去翻 git history。

4. 針對「4. 圖片與圖說規則」：

   - 目前 V4 已經寫得比較詳細，原則上只做以下整理：
     - 檢查標題與階層是否清楚（4.1~4.4）。
     - 確保文字一致、沒有明顯矛盾（例如一個地方說 gallery 不輸出，另一個地方又說會輸出）。
     - 可適度加上小節標籤／粗體，讓實作時好掃描（例如「第一張 → featured_image」、「不處理 fallback 主圖」等要點加粗）。

   - **不要**在沒有明確需求的情況下改變「第一張圖片 → featured_image」「不處理 fallback 主圖」這類規則。

5. 在「5. 各 post_type 特殊規則」與「6. 測試與驗證」中：

   - 確認 teaching / news 等說明有提到：
     - 對應的 adapter / 測試檔案大致位置（例如 `src/adapters/teaching-from-legacy.ts`, `tests/html/html-to-markdown.spec.ts`）。
   - 如有需要，可以補上一兩行「目前 v1 實作狀態」描述（例如 teaching 已有 v1 adapter，news 規則僅規劃，尚未實作）。

6. 整體上，本檔的整理原則是：

   - 讓閱讀者「不用再翻前版」，就可以抓到大方向。
   - 不做大規模重寫；只增補摘要、指向實作檔案與測試位置，保持規則與現狀一致。

================================
【步驟二】在 PROJECT_TODO 中新增並標記 T-0017
================================

1. 打開 `docs/PROJECT_TODO.md`。

2. 在 T-0016 之後新增一個條目，例如：

   ```markdown
   ### T-0017 html-to-markdown-rules-cleanup: 整理 HTML→Markdown 規則文件

   > 狀態：✅ 已完成（V4 規則檔整理完畢）

   - 目標：
     - 整理 `docs/HTML_TO_MARKDOWN_RULES_V4.md` 的結構與摘要，讓文件本身就能看懂主要規則，不必再翻前版。
     - 補上「文件導讀 / 快速索引」，指向主要章節與實作檔案（adapter / 測試）。
     - 保留圖片與圖說規則（4.x）為本版主要更新，不改變已決定的行為（如不處理 fallback 主圖）。

   - 驗收方式：
     - 人眼閱讀 `HTML_TO_MARKDOWN_RULES_V4.md` 時，可以清楚理解：
       - 全域清理、區塊/inline 轉換、連結處理的主要原則。
       - 圖片 / 圖說規則與 featured_image / gallery_items 的角色。
       - 各 post_type（尤其 teaching / news）的特殊注意事項大致方向。
     - PROJECT_TODO 中已標記本任務為 ✅。
   ```

3. 儲存 `docs/PROJECT_TODO.md`。

================================
【步驟三】更新 notes：記錄 T-0017 與 RAW 連結
================================

1. 打開 `docs/Windsurf_ChatGPT_NOTES.md`。

2. 在「2025-12-12 任務」底下新增一個小節，例如：

   ```markdown
   #### T-0017 html-to-markdown-rules-cleanup

   - 整理 `docs/HTML_TO_MARKDOWN_RULES_V4.md`：
     - 新增「文件導讀 / 快速索引」。
     - 對原本標註「略，同前版」的小節補上摘要說明，保持行為與前版一致。
     - 圖片與圖說規則（4.x）維持本版主軸，僅調整排版與說明清晰度。
   - 更新 `docs/PROJECT_TODO.md`，新增並標記 T-0017 完成。

   變更檔案（含 RAW 連結）：

   - docs/HTML_TO_MARKDOWN_RULES_V4.md  
     RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/HTML_TO_MARKDOWN_RULES_V4.md

   - docs/PROJECT_TODO.md  
     RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

   - docs/Windsurf_ChatGPT_NOTES.md  
     RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md
   ```

3. 儲存 `docs/Windsurf_ChatGPT_NOTES.md`。

================================
【步驟四】依 workflow 收尾（git + push + 極簡回報）
================================

1. `git status` 確認本次只改：
   - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
   - `docs/PROJECT_TODO.md`
   - `docs/Windsurf_ChatGPT_NOTES.md`

2. 執行：

   ```bash
   git add docs/HTML_TO_MARKDOWN_RULES_V4.md docs/PROJECT_TODO.md docs/Windsurf_ChatGPT_NOTES.md
   git commit -m "T-0017: clean up HTML→Markdown rules doc (V4)"
   git push origin main
   ```

3. 回覆給使用者時，用極簡格式，例如：

   - 已完成：T-0017 html-to-markdown-rules-cleanup（整理 HTML_TO_MARKDOWN_RULES_V4.md）。
   - 請看 `docs/Windsurf_ChatGPT_NOTES.md` 中 2025-12-12 任務：T-0017 小節（含 RAW 連結）。
   - 最後 commit hash：<hash>。
```
