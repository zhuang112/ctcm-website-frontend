# crawl-and-inventory.md

> 任務給 Windsurf / Cursor：為中台世界舊站建立「完整 URL 清單」與「爬蟲對帳機制」。  
> 目標是：知道**有哪些頁面真的被爬到、有哪些只存在於檔案系統但沒被爬到**。

---

## 0. 背景與目標

專案的大方向：

- 舊站：`https://www.ctworld.org`、`https://www.ctworld.org.tw`
- 新系統：HTML → AnyContent(JSON) → WordPress → React

這個任務專注在**「URL 蒐集與對帳」**：

1. 用爬蟲抓出「線上實際可以逛到的頁面 URL」。  
2. 用檔案系統（舊站 docroot）列出「所有 HTML 檔對應的 URL」。  
3. 對兩份清單做 diff：
   - 找出「檔案存在但爬不到」的頁面（可能是孤兒頁 / 歷史頁 / 測試頁）。
   - 找出「爬到但檔案清單沒有」的頁面（例如動態生成或 docroot 外的東西）。

**這份 md 是要給 AI IDE（Windsurf / Cursor）看的任務說明。**  
請依這份說明產生：TypeScript 工具程式＋npm script＋基本測試（若來得及）。

---

## 1. 環境與基本約定

- Node.js：建議 >= 18
- 語言：TypeScript
- 檔案放置位置（建議）：

```text
/tools
  /crawl
    crawl-ctworld.ts
    filesystem-inventory.ts
    diff-crawl-vs-files.ts
    types.ts
```

- 輸出資料放在：

```text
/data
  /crawl
    crawled-urls.json
    crawled-urls.csv
    all-files.json
    all-files.csv
    missing-from-crawl.csv
    extra-from-crawl.csv
```

可以視專案實際結構微調，但請在程式註解與 README 中註明。

---

## 2. 任務 A：線上網站爬蟲（crawl-ctworld.ts）

### 2.1 目標

- 從線上舊站出發，抓出「實際使用者現在還可以點到」的所有 HTML 頁面 URL。
- 主要來源：
  - sitemap：`https://www.ctworld.org/sitemap.htm`
  - 首頁 menu、首頁下方的網站架構連結
  - 內頁連結（限制在同一網域）

### 2.2 輸入

- 起始 URL：
  - `https://www.ctworld.org/`
  - `https://www.ctworld.org/sitemap.htm`
  - （可以再加 `https://www.ctworld.org.tw/` 視需要）

- CLI 參數建議：

```bash
npx ts-node tools/crawl/crawl-ctworld.ts   --base-url https://www.ctworld.org   --out data/crawl/crawled-urls.json   --max-depth 5   --delay-ms 200
```

### 2.3 輸出

- `crawled-urls.json`：陣列，每一筆至少包含：

```ts
interface CrawledUrl {
  url: string;
  status: number;               // HTTP status code
  contentType?: string | null;
  source?: string;              // 來源說明(例如 'sitemap', 'menu', 'link')
}
```

- `crawled-urls.csv`：同樣內容轉成 CSV，方便用試算表開。

### 2.4 爬蟲行為規則

- 僅抓同網域：
  - `ctworld.org` / `ctworld.org.tw`
- 僅關心 HTML 頁面：
  - `Content-Type` 包含 `text/html` 才解析連結。
- 連結解析：
  - 相對網址 → 轉成絕對網址。
  - 去掉 fragment（`#xxx`）。
  - 可以視情況將查詢字串 normalize（例如保留或移除某些毫無意義的 query）。
- 避免：
  - 不要進入明顯的檔案下載（`.pdf`, `.doc`, `.zip`, 圖片）。
  - 可設定最大深度（`--max-depth`），避免遞迴過深。

### 2.5 實作建議 / Hint

- 可以使用：
  - `node-fetch` / `undici` / `axios` 來發 HTTP。
  - `cheerio` 來解析 HTML，抓 `<a href>`。

- 資料結構：
  - 使用 `Set<string>` 來記錄已拜訪的 URL。
  - 使用佇列（BFS）或 stack（DFS）實作簡單 crawler。

- 請在程式中加入註解：
  - 說明爬蟲的限制（max depth、domian 限制）。
  - 未來若要擴增起始 URL 的方式。

---

## 3. 任務 B：檔案系統 inventory（filesystem-inventory.ts）

> 這一段需要「舊站 docroot（網站原始檔案）」在本機某個資料夾。  
> 例如：`/var/www/ctworld/` 或 `~/ctworld-docroot/`。

### 3.1 目標

- 在本機跑一個 script：
  - 遞迴列出指定 docroot 下所有 `.htm` / `.html`（或其他需要的副檔名）。
  - 將每個檔案對映成一個「預期 URL」。

### 3.2 輸入

- CLI 參數示意：

```bash
npx ts-node tools/crawl/filesystem-inventory.ts   --docroot /path/to/ctworld-docroot   --base-url https://www.ctworld.org   --out data/crawl/all-files.json
```

### 3.3 輸出

- `all-files.json`：陣列，每筆至少包含：

```ts
interface FileEntry {
  filePath: string;  // 本機檔案路徑
  url: string;       // 對應的舊站 URL (推算)
}
```

- `all-files.csv`：同內容的 CSV。

### 3.4 URL 對映規則

- 基本規則：

```text
filePath: /path/to/docroot/foo/bar/page.htm
baseUrl: https://www.ctworld.org
→ url: https://www.ctworld.org/foo/bar/page.htm
```

- 若有 `ctworld.org.tw` / `ctworld.org` 多個 docroot，可：
  - 接受多個 `--docroot` + `--base-url` pair，或
  - 分別跑兩次腳本，再用 CSV 合併。

請在程式註解中說明：

- 如何處理 index 檔：`index.htm` / `default.htm` → `/foo/` 或 `/foo/index.htm`？
- 舊站實際 URL 規則可能需要人工調整，請保留 TODO 註解讓未來自己來微調。

---

## 4. 任務 C：差異報表（diff-crawl-vs-files.ts）

### 4.1 目標

- 使用 `crawled-urls.json` 與 `all-files.json`，輸出：
  1. `missing-from-crawl.csv`：檔案存在於 docroot，但爬蟲沒抓到的 URL。
  2. `extra-from-crawl.csv`：爬蟲有抓到，但檔案清單沒有的 URL。

### 4.2 輸入

```bash
npx ts-node tools/crawl/diff-crawl-vs-files.ts   --crawled data/crawl/crawled-urls.json   --files data/crawl/all-files.json   --out-dir data/crawl
```

### 4.3 輸出格式

- `missing-from-crawl.csv`：

```csv
url,filePath,notes
https://www.ctworld.org/foo/bar/page.htm,/path/to/docroot/foo/bar/page.htm,"not reached by crawler"
```

- `extra-from-crawl.csv`：

```csv
url,status,source,notes
https://www.ctworld.org/some/dynamic/page,200,sitemap,"no matching file in docroot"
```

### 4.4 比對邏輯

- 基本上可直接用「字串相等」來比對 URL。
- 若舊站實際情況複雜，可預留：
  - 正規化步驟（去掉尾端 `/`、大小寫、query string 部分）。
  - 註解說明何處可以客製 Normalize。

---

## 5. 任務 D：npm scripts 與文件

### 5.1 在 package.json 加入 script（示意）

```jsonc
{
  "scripts": {
    "crawl:ctworld": "ts-node tools/crawl/crawl-ctworld.ts --base-url https://www.ctworld.org --out data/crawl/crawled-urls.json",
    "inventory:fs": "ts-node tools/crawl/filesystem-inventory.ts --docroot /path/to/docroot --base-url https://www.ctworld.org --out data/crawl/all-files.json",
    "diff:crawl-vs-fs": "ts-node tools/crawl/diff-crawl-vs-files.ts --crawled data/crawl/crawled-urls.json --files data/crawl/all-files.json --out-dir data/crawl"
  }
}
```

實際路徑與參數可依你機器環境調整，程式中不用寫死 docroot。

### 5.2 README / 註解

- 請在程式檔頭部說明：
  - 這個工具做什麼。
  - 需要什麼前置條件（例如：本機已有 docroot）。
- 若有時間，可以在根目錄 README 或 docs 裡簡短提一下：
  - 如何跑這三個步驟，來檢查「爬蟲 coverage」。

---

## 6. 測試與安全網（若時間足夠）

不一定要一開始就寫完整測試，但可以：

- 為 URL 正規化邏輯寫 unit test。
- 用假的小型 docroot 跑一輪 `filesystem-inventory`，確認輸出符合預期。
- 用假的 `crawled-urls.json` / `all-files.json` 測試 diff 邏輯。

---

## 7. 實作風格

請遵守本專案既有的風格（若有）：

- TypeScript 嚴格型別。
- 檔名使用 `kebab-case`。
- 重要函式加上對應 docs 註解，例如：

```ts
/**
 * 將線上 ctworld 網站進行 BFS 爬蟲，產生 URL 清單。
 * 對應：crawl-and-inventory.md §2 任務 A
 */
```

---

## 8. 完成標準（Definition of Done）

- 可以在本機成功執行：
  1. `crawl-ctworld.ts` → 產生 `crawled-urls.json` / `.csv`
  2. `filesystem-inventory.ts` → 產生 `all-files.json` / `.csv`
  3. `diff-crawl-vs-files.ts` → 產生 `missing-from-crawl.csv` / `extra-from-crawl.csv`
- 調整 docroot 路徑與 base-url 後，仍能正常運作。
- 程式對錯誤（例如無法連線、讀不到 docroot）有基本的錯誤訊息，而不是悶不吭聲地掛掉。

---

> 給 Windsurf / Cursor 的一句話指令範例：  
>
> 「請依 `crawl-and-inventory.md` 的說明，在 `tools/crawl/` 底下建立 `crawl-ctworld.ts`、`filesystem-inventory.ts`、`diff-crawl-vs-files.ts` 三個 TypeScript 工具，並在 `package.json` 加入對應 npm script。」

