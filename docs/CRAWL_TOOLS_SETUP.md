# CRAWL_TOOLS_SETUP.md

> 給未來的自己 & Windsurf：如何安裝依賴、加上 npm scripts，讓
> `crawl-ctworld.ts` / `filesystem-inventory.ts` / `diff-crawl-vs-files.ts` 可以直接使用。

---

## 1. 安裝依賴

這三支工具用到：

- Node 內建模組：`fs`, `path`, `url`（不用額外裝）
- 第三方：
  - `cheerio`（解析 HTML 抓 `<a href>`）

### 1.1 安裝 cheerio

在專案根目錄執行：

```bash
npm install cheerio
```

> 若你有使用 TypeScript，建議額外安裝型別（可選）：

```bash
npm install -D @types/cheerio
```

### 1.2 關於 fetch（Node 版本說明）

`crawl-ctworld.ts` 使用的是 **全域 `fetch`**：

```ts
const res = await fetch(url);
```

- 如果你使用 **Node 18+**（建議 Node 20）：  
  → Node 已內建 `fetch`，不需額外安裝任何 polyfill。

- 如果你在舊版本 Node（不推薦），你可以：
  1. 安裝 `node-fetch`：

     ```bash
     npm install node-fetch
     ```

  2. 在 `crawl-ctworld.ts` 開頭加上（或集中在一個 polyfill 檔案）：

     ```ts
     // 只有在 Node 18 以下才需要
     // import fetch from "node-fetch";
     // (globalThis as any).fetch = fetch;
     ```

  最好是直接升級 Node 版本，而不是長期依賴這種 polyfill。

---

## 2. 新增 npm scripts

請打開專案根目錄的 `package.json`，在 `"scripts"` 區塊加入以下三條（依你實際工具路徑調整）：

```jsonc
{
  "scripts": {
    // ... 你原本的 script 保留
    "crawl:ctworld": "ts-node tools/crawl/crawl-ctworld.ts --base-url https://www.ctworld.org --out data/crawl/crawled-urls.json --max-depth 5 --delay-ms 200",
    "inventory:fs": "ts-node tools/crawl/filesystem-inventory.ts --docroot ./ctworld-docroot --base-url https://www.ctworld.org --out data/crawl/all-files.json",
    "diff:crawl-vs-fs": "ts-node tools/crawl/diff-crawl-vs-files.ts --crawled data/crawl/crawled-urls.json --files data/crawl/all-files.json --out-dir data/crawl"
  }
}
```

> 注意：  
> - `./ctworld-docroot` 請改成你本機實際放舊站原始檔案的路徑。  
> - 如果你同時有 `ctworld.org` / `ctworld.org.tw` 兩份 docroot，可以先針對其中一個跑，或複製一組 script 再改 base-url。

如果你的專案是用 `pnpm` / `yarn`，改成對應指令即可，例如：

```bash
pnpm crawl:ctworld
pnpm inventory:fs
pnpm diff:crawl-vs-fs
```

---

## 3. 執行順序（建議）

1. **先跑線上爬蟲：**

   ```bash
   npm run crawl:ctworld
   ```

   - 產出：
     - `data/crawl/crawled-urls.json`
     - `data/crawl/crawled-urls.csv`

2. **再跑本機檔案 inventory：**

   ```bash
   npm run inventory:fs
   ```

   - 產出：
     - `data/crawl/all-files.json`
     - `data/crawl/all-files.csv`

3. **最後跑 diff：**

   ```bash
   npm run diff:crawl-vs-fs
   ```

   - 產出：
     - `data/crawl/missing-from-crawl.csv`
     - `data/crawl/extra-from-crawl.csv`

---

## 4. 給 Windsurf 的指令範例

你可以在 Windsurf 開專案後，直接下這種自然語言指令：

> 「請依 `CRAWL_TOOLS_SETUP.md` 的說明，幫我：  
> 1. 安裝 `cheerio`（如果還沒裝）；  
> 2. 檢查 Node 版本是否 >= 18，如果不是，幫我在 `crawl-ctworld.ts` 加上 `node-fetch` polyfill；  
> 3. 在 `package.json` 的 `scripts` 裡加入 `crawl:ctworld`、`inventory:fs`、`diff:crawl-vs-fs` 這三條。」

Windsurf 會：

- 幫你修改 `package.json`  
- 補上缺少的 dependencies / import  
- 你再手動跑一次三個 script，看輸出是否符合預期。

---

## 5. 小提醒

- `data/crawl/` 下面產生的 JSON / CSV 應該視為「中間成果」，可以加進 `.gitignore` 或只挑 CSV 版本 commit（看你想不想把這些紀錄納入版本控制）。
- 若舊站的 URL 規則未來需要特別處理（例如 index.htm → `/foo/`），請修改：
  - `filesystem-inventory.ts` 中的 `filePathToUrl()`，加上對 index 檔案的特別 mapping。
- 若 crawler 爬太慢或太快，可以調整：
  - `--delay-ms`（禮貌性延遲）
  - `--max-depth`（避免爬得太深）

這份檔案是給「未來幾個月要回來看這組工具的你」以及 Windsurf / Cursor 看的，
可以隨著實際使用經驗再補充細節。
