# INSTR：T-0020 teaching-end-to-end-sample（teaching HTML → zh-TW AnyContent → zh-CN）

下列內容可整段貼給實作 Agent（例如 Codex），請依步驟完成本次 T-0020 任務。

```text
你現在是這個專案的主要實作 Agent。

本次任務：T-0020 teaching-end-to-end-sample（teaching HTML → zh-TW AnyContent → zh-CN）

目標：
1. 選出 1～2 筆「teaching 類型」的 legacy HTML 範例，實際跑完整 pipeline。
2. 流程包含：
   - 從 legacy HTML 取得結構化內容。
   - 轉成 zh-TW AnyContent JSON。
   - 再透過 zh-TW → zh-CN pipeline 產生對應 zh-CN JSON。
3. 在 notes 中留下清楚紀錄（使用的 sample、輸出檔路徑、人工檢查結果），作為「實戰驗收」樣本。
4. 不追求大規模批次，只針對少數樣本把流程跑通、查驗是否符合目前的規則（HTML_TO_MARKDOWN_RULES_V4、ZH_TW_TO_ZH_CN_PIPELINE 等）。

本次預期主要動到：
- 既有 teaching 轉換程式 / CLI
- zh-TW → zh-CN pipeline CLI
- data/anycontent 底下的 zh-tw / zh-cn JSON
- docs/Windsurf_ChatGPT_NOTES.md
- （若有需要補充）PROJECT_TODO.md 狀態行

================================
【步驟一】找到 teaching 相關的轉換工具與範例資料
================================

1. 在 repo 中搜尋 teaching 相關程式與腳本，例如：
   - 檔名或符號中可能出現：
     - `teaching-from-legacy`
     - `teaching-html-to-anycontent`
   - 參考檔案：
     - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
     - `docs/CONTENT_SCHEMA.md`

2. 找到現有的 legacy teaching HTML 範例檔案來源，例如：
   - 某個 `legacy/` 或 `data/legacy-teaching/` 之類的目錄（實際名稱請以 repo 中存在的路徑為準）。
   - 若沒有明顯 sample，請在 notes 中說明現況，不要臆造路徑。

3. 選出「1～2 筆」 teaching HTML 作為本次樣本，並記錄：
   - legacy HTML 檔案相對路徑。
   - 若有對應舊站 URL，也一併記在 notes（方便未來回頭看實體頁面）。

================================
【步驟二】跑 teaching HTML → zh-TW AnyContent JSON
================================

1. 在專案中找出 teaching 轉換流程的入口：
   - 先閱讀相關程式（例如包含 `teaching-from-legacy`、`teaching-html-to-anycontent` 的 TS 檔）。
   - 再查看 `package.json` 有無現成 npm script 可用（例如 `npm run teaching:from-legacy` / `npm run teaching:sample` 等；實際名稱請以 repo 中為準）。

2. 若已有合適的 npm script：
   - 優先使用現有 npm script，並儘可能只針對「選定的 sample」執行，而非對全部 teaching 做批次。
   - 若 script 支援指定 slug / 檔名 / 目錄，請使用對應參數，只處理 1～2 筆樣本。

3. 若沒有合適的 npm script：
   - 直接用 `ts-node` 或現有工具的 CLI 入口，針對選定 sample 執行教學內容轉換。
   - 不修改程式行為，只調整參數或額外加一個「sample 專用 script」也可以（若有新增 script，請記錄在 notes）。

4. 預期輸出：
   - 1～2 筆 teaching 的 zh-TW AnyContent JSON。
   - 放置位置依現有規格（例如：`data/anycontent/zh-tw/teaching/...`，實際目錄請依 repo 規則微調）。
   - JSON 的欄位需符合 `docs/CONTENT_SCHEMA.md` 的 teaching 定義。

5. 完成後簡單檢查 JSON：
   - `post_type` 是否為 teaching（或對應的類型）。
   - `language` 是否為 `zh-tw`。
   - 標題、內文段落、清單、引文、偈語（若有）、標題階層是否符合 `HTML_TO_MARKDOWN_RULES_V4.md` 中的規則。

================================
【步驟三】跑 zh-TW → zh-CN pipeline 產生 zh-CN JSON
================================

1. 先閱讀 `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`，確認：
   - pipeline 使用的輸入/輸出目錄（預期是 zh-tw → zh-cn）。
   - 欄位白名單／不轉換欄位。
   - CLI 的預期行為與參數（例如是否支援只轉換特定路徑或單一檔案）。

2. 在 `tools/convert/` 或相近的目錄中，找到 zh-TW → zh-CN 的 CLI 程式（例如 `generate-zh-cn-from-zh-tw.ts`），並查看 `package.json` 是否已有 npm script。

3. 目標是「只針對剛剛那 1～2 筆 teaching zh-TW JSON 跑轉換」：
   - 若 CLI 已支援指定路徑 / 檔案 / slug，請使用這些參數，只轉換 sample。
   - 若 CLI 目前只支援全量轉換：
     - 可以先全量跑一次（若執行時間合理），並在 notes 中記錄這點。
     - 但要在 PROJECT_TODO / notes 中註明「將來可以考慮加上 filter 參數」，不要私自大改現有行為。

4. 預期輸出：
   - 對應的 zh-CN JSON，放在 `data/anycontent/zh-cn/...` 對應位置（實際路徑依 repo 為準）。
   - `language` 欄位應為 `zh-cn`。
   - 內容文本應為簡體字（基本依賴 OpenCC 或既有轉換程式）。

5. 完成後簡單檢查：
   - zh-CN JSON 是否有與 zh-TW 一致的檔名／路徑結構（僅語系資料夾不同）。
   - `post_type` 及其他關鍵欄位是否一致。
   - 重要欄位（例如標題、內文字串）有沒有被意外跳過或破壞。

================================
【步驟四】人工小驗收：比對 legacy HTML、zh-TW JSON、zh-CN JSON
================================

對每一筆 sample，請人工檢查以下重點（可以只看幾個代表性段落）：

1. 結構：
   - 標題階層（H1/H2/H3）在 zh-TW AnyContent 的 markdown 中是否合理。
   - 段落、清單（bullet/numbered list）是否有被保留。
   - 引文 / special block（若有）有沒有按照 `HTML_TO_MARKDOWN_RULES_V4` 的規則處理。

2. 內容：
   - 是否有整段不見／被重複的情況。
   - 是否有「純 HTML tag」被漏清掉，殘留在 markdown 文字裡。

3. 圖片／圖說（若該 sample 有）：
   - `featured_image` / `gallery_items` 是否合理填入，而不是在 markdown 中直接輸出 `![]()`。
   - markdown 內文是否沒有多餘的圖片標記（符合我們的「圖片由 JSON meta 管理」原則）。

4. zh-CN 對照：
   - zh-CN JSON 是否與 zh-TW 在結構上對齊（標題數量、段落數量大致一致）。
   - 文本是否正常變成簡體（沒有大段維持繁體，除非是白名單欄位）。

若發現明顯 bug（例如某種 HTML 標記在 teaching 中很常見，但被轉壞）：
- 先在 notes 的 T-0020 小節中描述問題與範例。
- 不要立即大改程式，可在 PROJECT_TODO 中新增下一顆 T 任務建議（由 ChatGPT 來設計 INSTR）。

================================
【步驟五】更新 notes：新增 T-0020 小節與 RAW 連結
================================

1. 打開 `docs/Windsurf_ChatGPT_NOTES.md`。

2. 在最新日期區塊下新增：

   #### T-0020 teaching-end-to-end-sample（teaching HTML → zh-TW AnyContent → zh-CN）

   - 說明本次選用的 teaching legacy HTML sample：
     - legacy 檔案路徑
     - （若有）舊站 URL
   - 簡述執行流程：
     - 使用的 teaching 轉換 CLI/npm script 名稱與主要參數。
     - 使用的 zh-TW → zh-CN CLI/npm script 名稱與主要參數。
   - 簡述人工小驗收的結果：
     - 結構是否合理（標題、段落、清單）。
     - 有無明顯遺漏／破壞。
     - zh-CN 是否對齊 zh-TW 的結構，並正常簡體化。
   - 若發現 bug 或可改進之處，請列出 1～3 點 bullet，讓 ChatGPT 之後可以依此設計下一顆 T 任務。

   變更檔案（含 RAW 連結）：

   - 選用的 sample zh-TW JSON  
     RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/<zh-tw-json-path>

   - 對應的 sample zh-CN JSON  
     RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/<zh-cn-json-path>

   - docs/Windsurf_ChatGPT_NOTES.md  
     RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/Windsurf_ChatGPT_NOTES.md

   - （如有變動）docs/PROJECT_TODO.md  
     RAW: https://raw.githubusercontent.com/zhuang112/ctcm-website-frontend/main/docs/PROJECT_TODO.md

   提醒：
   - 請將 `<zh-tw-json-path>` / `<zh-cn-json-path>` 換成實際相對路徑。
   - 若這次沒有改 PROJECT_TODO，可以省略該條 RAW 連結。

================================
【步驟六】（可選）更新 PROJECT_TODO 中 teaching 相關說明
================================

1. 若本次實際驗收結果顯示：
   - teaching pipeline 已可支援「至少部分實戰案例」，且結果令人滿意，
   - 你可以在 `docs/PROJECT_TODO.md` 中 teaching 相關條目下補上一句簡短說明，例如：
     - 已使用 T-0020 對部分 teaching HTML 跑完 end-to-end，初步驗收 OK，後續細節優化另開任務。

2. 若發現明顯需要新 T 任務的問題：
   - 可以先在 PROJECT_TODO 中加上「待 ChatGPT 補完內容」的 placeholder 條目，
   - 或只在 notes 的 T-0020 小節中描述，等 ChatGPT 看完後再正式開 T-0021/T-0022 等。

================================
【步驟七】依 workflow 收尾（git + push + 極簡回報）
================================

1. 在專案根目錄執行：

   ```bash
   git status
   ```

   預期會看到：
   - `data/anycontent/zh-tw/...` 新增或更新的 teaching JSON。
   - `data/anycontent/zh-cn/...` 新增對應 zh-CN JSON。
   - `docs/Windsurf_ChatGPT_NOTES.md`（以及可能的 `docs/PROJECT_TODO.md`）。

2. 將相關檔案加入版本控制（不包含 snapshots）： 

   ```bash
   git add data/anycontent            docs/Windsurf_ChatGPT_NOTES.md            docs/PROJECT_TODO.md 2>/dev/null || true
   ```

   若這次未修改 PROJECT_TODO，可只 add 實際有變動的檔案。

3. commit 並推送：

   ```bash
   git commit -m "T-0020: teaching end-to-end sample from HTML to zh-TW and zh-CN"
   git push origin main
   ```

4. 回覆給使用者時，用極簡格式，例如：

   - 已完成：T-0020 teaching-end-to-end-sample。
   - 本次挑選了 X 筆 teaching HTML sample，已跑完 HTML → zh-TW AnyContent → zh-CN pipeline，並在 notes 中記錄人工驗收結果與 RAW 連結。
   - 最後 commit hash：<hash>。
```
