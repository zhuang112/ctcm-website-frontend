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

## TODO 列表（原始三項）

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
  - 功能摘要：
    - 從 `https://www.ctworld.org` 與 `/sitemap.htm` 出發做 BFS 爬蟲，只保留 `ctworld.org` / `ctworld.org.tw` 網域。
    - 產出：
      - `data/crawl/crawled-urls.json` / `crawled-urls.csv`（線上爬蟲結果）
      - `data/crawl/all-files.json` / `all-files.csv`（本機 docroot inventory）
      - `data/crawl/missing-from-crawl.csv` / `extra-from-crawl.csv`（差異報表）
  - 允許修改範圍（已完成，供未來參考）：
    - 僅限 `tools/crawl/*.ts` 內的實作細節與 CLI 參數解析，不改動 public API 與 scripts 名稱。
  - 驗收方式：
    - 能在本機成功執行：
      - `npm run crawl:ctworld`
      - `npm run inventory:fs`
      - `npm run diff:crawl-vs-fs`
    - 產出的 JSON / CSV 檔格式符合 `crawl-and-inventory.md` 規格。
  - 負責人：ChatGPT（規格＋骨架）＋ Windsurf（實作）＋ 你（整合與驗收）

---

### 2. 實作 HTML→AnyContent：teaching

- 狀態：⬜ 尚未開始
- 說明：
  - 預計檔案：
    - `tools/convert/html-to-anycontent-teaching.ts`（由 ChatGPT 產生骨架）
    - `src/types/anycontent-teaching.ts`（teaching schema 定義，已存在可補強）
  - 規格：
    - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
    - `docs/CONTENT_SCHEMA.md`
    - `docs/COMPLETE_PROJECT_WORKFLOW.md`（整體流程）
  - 功能：
    - 將 teaching 類型 HTML 轉成 `TeachingContent` / `AnyContent` JSON：
      - 正確處理標題階層、主文段落、引用與列表。
      - 偵測並抽離偈語區塊，填入 `ct_verse_block_markdown` 等偈語相關欄位。
      - 依圖片規則填入 `featured_image`、`featured_image_caption`、`gallery_items[]`。
  - Windsurf 使用說明：
    - 只能修改 `html-to-anycontent-teaching.ts` 中標註 TODO 的區塊。
    - 不可修改 `CONTENT_SCHEMA` 中定義的型別與欄位名稱。
  - 驗收方式（暫定）：
    - 準備 2–3 個代表性 teaching HTML 範例，手動比對輸出 JSON 與規格是否一致。
    - 後續可補上 `tests/html-to-anycontent-teaching.spec.ts` 做 snapshot 測試。

---

### 3. 實作 zh-TW → zh-CN pipeline

- 狀態：⬜ 尚未開始
- 說明：
  - 預計檔案：
    - `tools/convert/generate-zh-cn-from-zh-tw.ts`
  - 規格：
    - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
    - `docs/CONTENT_SCHEMA.md`（欄位與 `Language` 定義）
  - 功能：
    - 讀取 zh-TW 版 AnyContent JSON（例如 `data/zh-tw/**/*.json`）。
    - 使用 OpenCC（或等效工具）對指定欄位做繁→簡轉換：
      - 包含 `post_title`, `post_excerpt`, `body_markdown`，以及多數中文 `meta` 與 `seo` 文案欄位。
    - 不變更：ID / URL / 數字 / enum 類欄位與 `external_id`。
    - 輸出對應 zh-CN JSON，並維持 `multilingual` 關聯資訊正確。
  - Windsurf 使用說明：
    - 僅實作 `generate-zh-cn-from-zh-tw.ts` 中指定 TODO 區塊。
    - 不修改 `Language` union 或 `AnyContent` schema；欄位白名單需以 docs 為準。
  - 驗收方式（暫定）：
    - 使用少量 zh-TW JSON 範例，檢查 zh-CN 版本：
      - 文字已正確轉為簡體。
      - 結構（欄位／型別）與原本完全一致。
      - ID / URL / enum 未被誤改。

---

## T 系列任務（由 ChatGPT 維護）

> T-XXXX 用來標記「人機協作的小步驟」，方便分派給 Windsurf。

### ✅ T-0001 teaching-from-legacy: 將 htmlToMarkdown 的 verses 映射到 TeachingMeta 偈語欄位（已完成）

- 狀態：
  - 已由 Windsurf 在 2025-12-08 完成對 teaching-from-legacy 的偈語欄位映射實作。
  - 對應測試（`tests/adapters/teaching-from-legacy.spec.ts`）已新增並通過。
- 相關程式檔：
  - `src/html/html-to-markdown.ts`
  - `src/html/legacy-html-types.ts`
  - `src/types/anycontent-teaching.ts`
  - `src/adapters/teaching-from-legacy.ts`
- 相關測試：
  - `tests/html/html-to-markdown.spec.ts`
  - `tests/adapters/teaching-from-legacy.spec.ts`
- 相關說明與紀錄：
  - `docs/Windsurf_ChatGPT_NOTES.md`
  - `docs/terminal_logs/T-0001_teaching-from-legacy_vitest_fail.txt`
  - `docs/terminal_logs/T-0001_teaching-from-legacy_vitest_pass.txt`
- 結果摘要：
  - `htmlToMarkdown` 專用 sutra 規則會將偈語收集到 `verses: string[]`。
  - `teaching-from-legacy` adapter 會依據 `verses` 設定 TeachingMeta 的偈語欄位：
    - `ct_has_dharma_verse`
    - `ct_verse_block_markdown`
    - `ct_verse_type`
    - `ct_verse_lang`
  - 不破壞既有 TeachingContent / AnyContent schema contract。

---

### T-0002 AnyContent 其他 post_type 型別：news / magazine contract

- 目標：
  - 依照 `docs/CONTENT_SCHEMA.md` 中的定義，為 news / magazine 建立穩定的 AnyContent contract 型別檔，
    讓之後的 adapter 可以直接依賴這些型別，不需要再改 schema。

- 關聯 docs：
  - `docs/CONTENT_SCHEMA.md`
    - 0.1 Language
    - 0.2 BaseMeta / AnyContentBase
    - 2.x 中與 news / magazine 相關的小節（NewsMeta / MagazineMeta / MagazineContent）
    - 3. AnyContent union
  - `docs/PROJECT_STATUS.md`
    - 關於「補 strong contract：AnyContent 其他 post_type 型別」的建議
  - `docs/WORKFLOW_CHATGPT_GITHUB_WINDSURF.md`
    - 關於「型別 / contract 不可隨意變動」的原則

- 要新增 / 更新的檔案（實際名稱可依現有風格微調）：
  - `src/types/anycontent-news.ts`
    - 匯出：
      - `interface NewsMeta`
      - `interface NewsContent extends AnyContentBase`
  - `src/types/anycontent-magazine.ts`
    - 匯出：
      - `interface MagazineMeta`
      - `interface MagazineContent extends AnyContentBase`
  - 若有集中管理 AnyContent union 的檔案（例如 `src/types/anycontent.ts` 或類似）：
    - 將 `NewsContent` / `MagazineContent` 納入 AnyContent union。

- 規格摘要（概念層級，具體欄位以 `docs/CONTENT_SCHEMA.md` 為準）：
  - NewsContent：
    - `post_type` 固定為 `'news'`
    - `meta: NewsMeta`
    - `NewsMeta` 至少包含：
      - `ct_news_date?: string | null`
      - `ct_event_date_start?: string | null`
      - `ct_event_date_end?: string | null`
      - `ct_event_date_raw?: string | null`
      - `ct_event_location?: string | null`
      - `ct_news_category?: string | null`
  - MagazineContent：
    - `post_type` 固定為 `'magazine'`
    - `meta: MagazineMeta`
    - `MagazineMeta` 包含期數與文章區塊相關欄位：
      - 例如 `ct_issue_items`, `ct_magazine_section`, `ct_magazine_type`, `ct_author_name` 等
      - 具體名稱與型別以 `docs/CONTENT_SCHEMA.md` 為準。
  - 不可變動的既有 contract：
    - `Language` union: `'zh-tw' | 'zh-cn' | 'en' | 'ja'`
    - `AnyContentBase` 既有欄位與型別
    - Teaching 相關型別（`TeachingMeta` / `TeachingContent`）

- 驗收方式：
  - 型別檢查：
    - 若專案有對應 script，則執行：
      - `npm run typecheck`
    - 若沒有，則執行：
      - `npx tsc --noEmit`
  - 測試：
    - 確保所有既有 Vitest 測試通過：
      - `npx vitest`
  - 後續當新增 news / magazine 專用 adapter 時，不需修改這兩個型別檔，只需依照 contract 實作 adapter。

---

## 使用方式

1. 當你和 ChatGPT 討論出一個新功能：
   - 由 ChatGPT 幫你在這裡新增一條 TODO。
   - 同時產生 / 更新對應的 docs 與骨架程式碼。

2. 當你要交任務給 Windsurf 時：
   - 指定「請完成 PROJECT_TODO.md 中第 X 項」或「請完成 T-000X」。
   - 把該項裡的「檔案 / 規格 / 限制」貼給 Windsurf。

3. 任務完成後：
   - 你標記該項為 ✅ 並（選擇性）附上實際 commit hash 或簡短說明。
   - 若 ChatGPT 做過 code review，可以在這裡附註「已 review」。

你可以持續維護本檔案，讓它成為本專案「人機協作」的任務總覽。
