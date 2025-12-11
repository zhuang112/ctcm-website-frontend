# HTML_TO_MARKDOWN_RULES_V4.md (updated images & fallback notes)

> 中台世界舊站 → JSON vNext 的 HTML→Markdown 轉換規格  
> 本版重點更新：圖片欄位行為、`featured_image` / `gallery_items` / `featured_image_caption` 的角色，
> 並明確說明 **不在此階段處理 fallback 主圖**。

---
## 圖片與圖說（featured / gallery）【T-0050 補充】

- 偵測來源：一般 `<img>`（含 `src`、`alt`），如有明顯封面區塊（hero/banner）或正文開頭第一張圖，列為封面候選。
- featured_image（封面圖）：
  - ✅ 目前：正文第一張圖預設為 `featured_image`（teaching/news/magazine adapter），caption 多為 `null`。
  - ⚠️ 待補：專用 class/區塊（hero/banner）優先級；若未識別封面，應至少納入 gallery，不可遺失。
- gallery_items：
  - ✅ 目前：featured 以外的圖片收集為 `gallery_items`，欄位含 `url`、`alt`（caption 多為 null）。
  - ⚠️ 待補：同一 gallery 容器的群組化、排序、分欄/段落對應。
- 圖說（caption）來源優先序：
  - `alt` → 鄰近 `figcaption` / `<p>` / 指定 class `<span>`；缺乏可靠來源時保持 `null`，勿亂生內容。
- layout / multi-gallery（T-0054 設計，尚未由 extractor 產出）：
  - schema 已預留 `default_gallery_style`、`gallery_blocks`，但 htmlToMarkdown 目前只回傳 `images[]`；adapter 仍僅填 `featured_image` / `gallery_items`。
  - 若未來需要多 gallery 分區或特定樣式，請在對應 T 任務實作 grouping，並更新本檔與 schema。
- 未能歸類的圖片：
  - 非封面圖至少進 `gallery_items`；若策略不明可暫留 `body_markdown`，必要時標記 `meta.has_unclassified_content = true` 並在 notes 說明。
- 各 post_type 提醒：
  - teaching：✅ 首圖為封面；⚠️ 偈語區內的圖片策略未定。
  - news：✅ 首圖封面，其餘 gallery；⚠️ 多圖報導/版型位置對齊未處理。
  - magazine：✅ 首圖封面，其餘 gallery；⚠️ 內頁插圖群組、封面 class 未實作。

## 0. 目標與輸入輸出

（略，同前版：目標是將舊站 HTML 轉成 `AnyContent` JSON，並產出 `body_markdown`。）

---


## 1. 全域清理規則

（略，同前版：移除 script/style/nav/footer/form、處理版面 table、行內元素等。）

---


## 0.1 無法歸類內容的暫存處理（簡版）

- 如果 legacy HTML 出現無法對應既有 schema 欄位的零星內容，先保留在 `body_markdown`，不要自行新增新的 `meta.*` 欄位。
- 若整段內容暫時只能放在 `body_markdown`，且未來可能需要人工再拆：
  - 在 AnyContent JSON 標記 `meta.has_unclassified_content = true`。
  - 視情況於 `meta.unclassified_notes` 簡述原因（例如「段落為旁白，暫未拆欄位」）。
- 一律保留對照資訊：
  - `old_url` 必填。
  - 若有 legacy HTML 檔（如 `data/legacy-*/xxx.html`），盡量保留以便 `/dev/compare` 左欄對照。
- 與本段相關的完整說明請參考：
  - `docs/CONTENT_SCHEMA_V1.md` 的 `meta.has_unclassified_content` / `meta.unclassified_notes`
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` §3.8（adapter 編輯時的未知內容處理）

---


## 2. 區塊元素 → Markdown

（略，同前版：h2/h3 → `##`/`###`，`<p>`、`<br>`、列表、blockquote、pre/code 等。）

---


## 3. 連結處理

（略，同前版：一般超連結、相對/絕對 URL、mailto/tel 等。）

---


## 4. 圖片與圖說規則（更新版）

> 核心原則：  
> - 圖片資訊存在 JSON 的 `featured_image` / `gallery_items` 欄位；
> - Markdown `body_markdown` 專注於文字內容；
> - **fallback 主圖不在本階段處理，而在匯入 / 後處理階段處理。**

### 4.1 圖片來源解析

對主內容節點中的 `<img>`：

- 解析：
  - `src` → 圖片 URL（先記舊網址）
  - `alt` → 若有，填入 `GalleryItem.alt`
- 關於圖說：
  - 嘗試從圖片 **相鄰** 的文字節點（同層的下一個兄弟節點、同一個 `<td>` / `<div>` 內的短句）判斷 caption 候選。
  - 判斷條件（示意）：
    - 字數低於某閾值（例如 60 字）
    - 不像長篇段落
    - 含有「攝影」、「Photo by」等提示詞時優先視為 caption
  - 清理標點與空白後，填至對應圖片的 `caption`。

### 4.2 第一張圖片 → featured_image

- 規則：
  - 主內容區內「第一張符合條件的內容圖片」 → `featured_image`。
  - 原則上：
    - **不將此圖片再重複放入 `gallery_items`**（除非未來有明確需求）。
- `featured_image_caption`：
  - 預設填 `null`。
  - 例外情況（選擇性）：
    - 若判斷該頁為「banner / hero」型區塊，且圖片下方有一行明顯的標語或主題文字，可將其填入 `featured_image_caption`。
    - 這類判斷多半依特定頁型進行（例如首頁），一般內容頁可不啟用。

> 注意：`featured_image` 在此階段 **僅來自 HTML 原始圖片**。  
> 對於完全沒有圖片的頁面，`featured_image` 必須維持 `null`，以便後續 fallback 流程統一處理。

### 4.3 後續圖片 → gallery_items

- 第二張及之後的圖片，一律寫入 `gallery_items[]`：

```jsonc
"gallery_items": [
  {
    "url": "https://www.ctworld.org.tw/arts/xxx/01.jpg",
    "alt": "供佛儀軌",
    "caption": "供佛儀軌時，僧眾靜默安住。"
  }
]
```

- Caption 來源同 4.1 的判斷方式。
- `body_markdown` 中預設 **不輸出** `![]()` 圖片語法，除非未來有特殊需求。

### 4.4 假如頁面沒有任何 `<img>`

- `featured_image = null`
- `featured_image_caption = null`
- `gallery_items = []`
- 不在本階段使用任何 fallback 圖片。

---


## 5. 各 post_type 特殊規則（與圖片的關係）

### 5.1 teaching

- 核心與前版相同（偈語抽出為 `ct_verse_block_markdown` 等）。
- 圖片：
  - 若為法會現場照片、法相等，依 4.2/4.3 原則處理。
  - 若某些子頁型需要特別處理（例如封面圖與內頁圖分區），可在 teaching adapter 中加入對應邏輯。

### 5.2 news

- 活動報導中常含多張照片。
- 規則：
  - 第一張 → `featured_image`，作為報導主圖。
  - 其餘 → `gallery_items`，caption 為「攝影：XXX」「活動現場」等。

### 5.3 magazine / branch / gallery / resource / download / index_page

- 依類型自行判斷圖片多寡與重要性，但一律遵守：
  - 第一張 → `featured_image`。
  - 第 2 張起 → `gallery_items`。
  - 沒有任何 `<img>` → 不做 fallback，由後處理階段統一補齊主圖。

---


## 6. 測試與驗證（與圖片相關）

- 為每個 post_type 準備包含圖片的 HTML 樣本，驗證：
  - `featured_image` 是否為預期的第一張內容圖。
  - `gallery_items.length` 是否符合 HTML 中圖片數量（視是否排除 banner / logo 而定）。
  - `caption` 是否沒有被誤抓成長篇文章或非圖說。
- 為完全無圖的頁面準備樣本：
  - 確認 `featured_image`、`featured_image_caption` 均為 `null`，`gallery_items` 為空 array。

---


（其餘章節與前版一致，如需變更請同步更新本檔與 CONTENT_SCHEMA / WORKFLOW。）

---


## 附錄：舊站特殊樣板對應規則（vNext 彙整）

以下規則僅補充說明常見單元的特殊 class／標籤對應方式，
若與前文通則衝突，以本節為優先。

### 一、通用樣式與強調

- 顏色、margin、字型等純視覺 CSS 一律在轉換時移除，由新站 CSS 決定呈現。
- `<span class="wordstrong">…</span>`：一律轉為粗體 `**…**`。
- 帶有 `class="qa"` 或 `class="q"` 的行：
  - 若獨立成一行 → 全行粗體，作為「重點語句」。  
  - 若在句中 → 僅該段文字加粗。  
  - **不**使用 blockquote。

- `<i>…</i>`：一般情況下轉為斜體 `*…*`；
  但若同時帶有 `class="q"`，仍以粗體為主（視為重點語句），避免過度使用斜體。

- `<sup>…</sup>`：
  - 在姓名中的「上／下」尊稱（如 `<sup>上</sup>惟<sup>下</sup>覺`）**必須保留** inline HTML，
    不視為純排版資訊。
  - 在 `body_markdown` 中保留 `<sup>`；在結構化欄位（如 `teacher`）則存對應的純文字版本。

- `<hr>`：
  - 在主內容區塊內，作為段落／段落群的分隔線時保留，轉成 Markdown `---`。
  - 以圖片模擬的細線（如 `bk_dot.gif`）一律視為裝飾，直接刪除。

### 二、禪七行程（`/chan/chan7/03_schedule.htm` 類）

- 主標題：
  - 第一個 `<span class="T">…</span>` → 主標題 `# …`（H1）。

- 小節標題：
  - 單獨成行、內容為一兩個詞的 `<b>…</b>`（如「報到」「起七」「起七茶會」）
    → `### …`（H3）。

- 行程內容：
  - 內文中以 `<br>` 分行的時間表，轉為一般段落或條列，
    只保留時間＋事件文字，不保留 `margin-left` 等縮排 CSS。
  - 具體排版（是否用兩欄、表格、時間軸）交由前端元件實作。

### 三、禪話隨筆（`/turn/chan_talk/`）

- 每篇文章：視為 `teaching` 類，`teaching_type = 'chan_talk'`。

- 標題：
  - 依既有規則取自 heading / 圖片對應文字；
    若頁面內有 `<span class="heading3">` 並明顯為篇名，則提升為 H1。

- 小節：
  - `<span class="q">…</span>` → `### …`（H3）作為段落小標。

- 強調文字：
  - `<span class="wordstrong">…</span>` → `**…**`。

### 四、開示講記（`/turn/lecture/`）

- 每篇文章視為 `teaching` 類，`teaching_type = 'lecture'`。

- 主標題：
  - 主內容區第一個 `<span class="heading3">…</span>` → `# …`（H1）。

- 經文／偈頌：
  - `<p class="word17-coffee">…</p>` → blockquote：
    ```md
    > 經文或偈頌內容……
    ```
  - 此類段落同時可抽出，填入 `verses[]` 或 `scripture_blocks[]`，
    但 canonical 內容仍以 `body_markdown` 為主。

- 編號小節：
  - `<span class="chinese">（一）</span>` 或 `<a name="item12" class="chinese">（六）</a>`：
    - 單獨成行時 → 小節標題，例如 `#### （一）`。
    - `name="item12"` 轉為 `<a id="item12"></a>` 插入對應位置，
      以便保留舊站 `#item12` 等錨點連結。

- 來源／場合說明：
  - 若 `<span class="brown">…</span>` 出現在標題下，內容為場合／日期／刊載資訊，
    則轉為一行粗體說明，並寫入 `meta.source_note`：
    ```md
    **於普台國民中小學九十七學年度運動大會開示**
    ```

### 五、問答單元（`/turn/reply/`）

- 主標題：
  - 主內容區的第一個 `<b>…</b>` 問句 → H1：`# …`，並填入 `title`。

- 來源 caption：
  - `<span class="caption">…</span>`（如「摘自法光雜誌．訪惟覺老和尚」）
    → 標題下方一行粗體，並寫入 `meta.source_note`：
    ```md
    **摘自法光雜誌．訪惟覺老和尚**
    ```

### 六、開山祖師法語系列（`/turn/blossom/`）

- 主標題：
  - 每篇文章的第一個 `<span class="heading3">…</span>` → H1。

- 來源說明：
  - `<span class="brown">於自由時報…刊載</span>` →
    標題下方一行粗體來源說明，同時寫入 `meta.source_note`：
    ```md
    **於自由時報 92.12.11（四）刊載**
    ```

- 多篇文章共用一個 HTML：
  - 若同一 `.htm` 內含多個 heading3／來源說明／內文區塊，
    則在轉換時切成多筆 AnyContent 記錄，
    `external_id` 可依檔名加序號（例如 `blossom-044-1`, `blossom-044-2`）。

### 七、經論講解（`/turn/sutra/`）

- 主標題：
  - 在經論講解模板中，主內容區第一個 `<span class="heading3">…</span>` → H1。

- 經文：
  - `<p class="word17-coffee">…</p>` → 使用 blockquote 呈現：
    ```md
    > 經文內容……
    ```
  - 同時抽出至 `scripture_blocks[]` 或 `verses[]` 作為索引。

- 偈頌／詩偈：
  - 若某段為一連串 `<br>` 分行的偈頌，亦轉為多行 blockquote：
    ```md
    > 參禪非等閒　　滿室春風寶光現  
    > 大眾共行無生法　　參透三關玄又玄
    ```

- 段落編號與錨點：
  - `<a name="item83" class="chinese">（八十三）</a>`：
    - 轉為 `<a id="item83"></a>` 插在對應段落前，
      以支援舊站 `#item83` 錨點連結。
    - 數字括號「（八十三）」可作為小節標題或內文標示。

### 八、佛教藝術等專欄（`/buddaart/` 等）

- 此類頁面多半歸類為 `teaching`，
  可使用 `teaching_type = 'buddhist_art'` 或填入 `series = '佛教藝術'`。

- 結構建議：
  - 標題：對應頁內主標或明顯篇名 → H1。  
  - 副標題（若有）：可放入 `subtitle`（未來擴充欄位）。  
  - 作者：填入 `teacher` 或 `byline`。  
  - 摘要：取開頭幾行作 `excerpt`。  
  - 主圖：`featured_image`（caption 放在 `featured_image_caption`）。  
  - 附圖＋圖說：`gallery_items[]`。  
  - 作者小檔案：作為 `body_markdown` 最後一節，以小標題區分。

上述規則皆以「內容語意優先」為原則：
- 有語意的標記（標題層級、經文、偈頌、法語、來源說明、尊稱上標與錨點）會保留或轉為結構化資訊；
- 純視覺樣式（顏色、縮排、字型大小）則交由新站前端 CSS 決定。

