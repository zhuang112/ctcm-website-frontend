# HTML_TO_MARKDOWN_RULES_V4.md (updated images & fallback notes)

> 中台世界舊站 → JSON vNext 的 HTML→Markdown 轉換規格  
> 本版重點更新：圖片欄位行為、`featured_image` / `gallery_items` / `featured_image_caption` 的角色，
> 並明確說明 **不在此階段處理 fallback 主圖**。

---

## 0. 目標與輸入輸出

（略，同前版：目標是將舊站 HTML 轉成 `AnyContent` JSON，並產出 `body_markdown`。）

---

## 1. 全域清理規則

（略，同前版：移除 script/style/nav/footer/form、處理版面 table、行內元素等。）

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
