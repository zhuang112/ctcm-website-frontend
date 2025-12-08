# PROJECT_TODO

> 建議由 ChatGPT 協助維護這份清單，
> Windsurf / Cursor 則依照指定的 TODO 項目實作。

## 規則

- 每一條任務盡量「小而明確」。  
- 每一條任務要指明：
  - 關聯的 docs（規格來源）。
  - 要修改的檔案路徑。
  - 允許修改的範圍（通常是 TODO 區塊）。
  - 驗收方式（測試、輸出檔、或手動檢查）。

---

## TODO 列表

### 1. 實作 crawl 工具（已完成範例）

- 狀態：✅ 完成  
- 說明：
  - 檔案：
    - `tools/crawl/crawl-ctworld.ts`
    - `tools/crawl/filesystem-inventory.ts`
    - `tools/crawl/diff-crawl-vs-files.ts`
    - `package.json`（scripts: `crawl:ctworld` / `inventory:fs` / `diff:crawl-vs-fs`）
  - 規格：
    - `docs/crawl-and-inventory.md`
    - `docs/CRAWL_TOOLS_SETUP.md`
  - 功能：
    - 從 `https://www.ctworld.org` 與 `/sitemap.htm` 出發做 BFS 爬蟲。
    - 只保留 `ctworld.org` / `ctworld.org.tw` 網域。
    - 產出：
      - `data/crawl/crawled-urls.json` / `crawled-urls.csv`（線上爬蟲結果）。
      - `data/crawl/all-files.json` / `all-files.csv`（本機 docroot inventory）。
      - `data/crawl/missing-from-crawl.csv` / `extra-from-crawl.csv`（差異報表）。
  - 允許修改範圍（已完成，供未來參考）：
    - 僅限 `tools/crawl/*.ts` 內的實作細節與 CLI 參數解析，不改動 public API 與 scripts 名稱。
  - 驗收方式：
    - 能在本機成功跑：
      - `npm run crawl:ctworld`
      - `npm run inventory:fs`
      - `npm run diff:crawl-vs-fs`
    - 產生上述 JSON / CSV 檔案，且格式符合 `crawl-and-inventory.md` 規格。
- 負責人：ChatGPT（規格＋骨架）＋ Windsurf（實作）＋ 你（整合與驗收）

### 2. 實作 HTML→AnyContent：teaching

- 狀態：⬜ 尚未開始  
- 說明：
  - 檔案（預計）：
    - `tools/convert/html-to-anycontent-teaching.ts`（需由 ChatGPT 產生骨架）
    - `src/types/anycontent-teaching.ts`（schema 定義）
  - 規格：
    - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
    - `docs/CONTENT_SCHEMA.md`
    - `docs/COMPLETE_PROJECT_WORKFLOW.md`（整體流程）
  - 功能：
    - 將 teaching 類型 HTML 轉成 `TeachingContent` / `AnyContent` JSON：
      - 正確處理標題階層、主文段落、引用與列表。
      - 偵測並抽離偈語區塊（`ct_verse_block_markdown` 等欄位）。
      - 根據圖片規則填入 `featured_image` / `featured_image_caption` / `gallery_items[]`。
  - Windsurf 使用說明（給 Windsurf 的提示）：
    - 「只能修改 `html-to-anycontent-teaching.ts` 中標註 TODO 的區塊。」
    - 不可修改 `CONTENT_SCHEMA` 中定義的型別與欄位名稱。
  - 驗收方式（暫定）：
    - 準備 2–3 個代表性 teaching HTML 範例，手動比對輸出 JSON 與規格是否一致。
    - 未來可補上 `tests/html-to-anycontent-teaching.spec.ts` 做 snapshot 測試。

### 3. 實作 zh-TW → zh-CN pipeline

- 狀態：⬜ 尚未開始  
- 說明：
  - 檔案（預計）：
    - `tools/convert/generate-zh-cn-from-zh-tw.ts`（骨架待產生）
  - 規格：
    - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
    - `docs/CONTENT_SCHEMA.md`（欄位與 `Language` 定義）
  - 功能：
    - 讀取 zh-TW 版的 AnyContent JSON（例如 `data/zh-tw/**/*.json`）。
    - 使用 OpenCC（或等效工具）對指定欄位做繁→簡轉換：
      - 例如 `post_title`, `post_excerpt`, `body_markdown`, 多數 `meta` 中文欄位與 `seo` 文案。
    - 不變更：ID / URL / 數字 / enum 類欄位與 `external_id`。
    - 輸出對應 zh-CN JSON，並維持 `multilingual` 關聯資訊正確。
  - Windsurf 使用說明（給 Windsurf 的提示）：
    - 僅實作 `generate-zh-cn-from-zh-tw.ts` 中指定 TODO 區塊。
    - 不修改 `Language` union 或 `AnyContent` schema；欄位白名單應以 docs 為準。
  - 驗收方式（暫定）：
    - 使用少量 zh-TW JSON 範例，檢查 zh-CN 版本：
      - 文字已正確轉為簡體。
      - 結構（欄位／型別）與原本完全一致。
      - ID / URL / enum 未被誤改。

---

## 使用方式

1. 當你和 ChatGPT 討論出一個新功能：
   - 由 ChatGPT 幫你在這裡新增一條 TODO。  
   - 同時產生 / 更新對應的 docs 與骨架程式碼。

2. 當你要交任務給 Windsurf 時：
   - 指定「請完成 PROJECT_TODO.md 中第 X 項」。  
   - 把該項裡的「檔案 / 規格 / 限制」貼給 Windsurf。

3. 任務完成後：
   - 你標記該項為 ✅ 並（選擇性）附上實際 commit hash 或簡短說明。  
   - 若 ChatGPT 做過 code review，可以在這裡附註「已 review」。

你可以持續維護本檔案，讓它成為本專案「人機協作」的任務總覽。

## 任務列表

### T-0001 teaching-from-legacy: 將 htmlToMarkdown 的 verses 映射到 TeachingMeta 偈語欄位

- 關聯 docs：
  - docs/CONTENT_SCHEMA.md
    - 0.1 Language
    - 0.2 BaseMeta / AnyContentBase
    - 2.1 teaching（TeachingMeta / TeachingContent 偏好欄位）
  - docs/HTML_TO_MARKDOWN_RULES_V4.md
    - 有關 teaching / sutra 專用規則與 verses 的描述
  - docs/COMPLETE_PROJECT_WORKFLOW.md
    - 4. HTML → Markdown（htmlToMarkdown）
    - 5. Markdown + metadata → AnyContent JSON（teaching 的位置）
  - docs/PROJECT_STATUS.md
    - 「將 verses 寫入 TeachingMeta 偈語欄位」的下一步建議
  - docs/Windsurf_ChatGPT_NOTES.md
    - 2025-12-08 /turn/sutra/ 經論講解頁專用規則 v1

- 要修改的檔案：
  - src/adapters/teaching-from-legacy.ts
  - tests/adapters/teaching-from-legacy.spec.ts

- 規格摘要：
  - 不改動 htmlToMarkdown 的輸入 / 輸出 shape，也不修改 verses 的產生邏輯。
  - 在 teaching-from-legacy adapter 中，根據 HtmlToMarkdownResult.verses 設定 TeachingMeta 的偈語欄位：
    - 若 verses.length === 0：
      - meta.ct_has_dharma_verse = 'no'
      - meta.ct_verse_block_markdown / meta.ct_verse_type / meta.ct_verse_lang 為 null 或未填（依既有風格處理）。
    - 若 verses.length >= 1：
      - meta.ct_has_dharma_verse = 'yes'
      - meta.ct_verse_block_markdown = 每一行 verses 轉為 `> 行文`，以 `\n` 串接（形成一個 blockquote 區塊）。
      - meta.ct_verse_type = 'sutra'
      - meta.ct_verse_lang = 'zh-tw'（僅限 zh-tw 來源；未處理 zh-cn）。
  - 不更動 TeachingMeta / TeachingContent / AnyContentBase 的欄位名稱與型別，只是正確填值。

- 驗收方式：
  - 新增或擴充 tests/adapters/teaching-from-legacy.spec.ts：
    - 建立一個包含 verses 的 sutra 測試案例，斷言：
      - meta.ct_has_dharma_verse === 'yes'
      - meta.ct_verse_block_markdown 內容與預期一致（`> 行一\n> 行二` 之類）。
      - meta.ct_verse_type === 'sutra'
      - meta.ct_verse_lang === 'zh-tw'
  - 測試指令：
    - 針對單檔測試：
      - `npx vitest tests/adapters/teaching-from-legacy.spec.ts`
    - 全專案測試：
      - `npx vitest`
  - 所有既有 Vitest 測試需維持通過，不可為了通過測試而放寬型別或破壞現有 contract。

