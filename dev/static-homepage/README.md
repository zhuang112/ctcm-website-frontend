# dev/static-homepage

這是一個不需建置的靜態首頁原型（受 British Museum / Kyohaku 混合風格啟發），用來示意 ctworld 的新首頁資訊架構。

## 內容物
- `index.html`：主要版型與各區塊（HeroCarousel、KeyLinks、News / Teaching / Magazine、Gallery、Footer）。
- `styles.css`：使用 CSS 變數、RWD、簡易 mega menu / mobile menu 造型。
- `app.js`：Hero 輪播、自動播放、上一張 / 下一張；mobile menu 切換。

## 使用方式
- 直接開啟 `index.html` 即可預覽（無建置步驟）。
- 若想用本機伺服器，可自行執行：`npx serve dev/static-homepage -l 4173`（可改 port）。

## 設計重點
- Desktop menu 採 mega menu，mobile 採抽屜式。
- Hero carousel 3 張示意，具 dots / prev / next。
- 區塊皆以 placeholder 文案＆色塊示意，可替換為 Directus / Astro 元件或 API 資料。
- RWD：支援 320px 以上螢幕，行動版改單欄佈局。

## 無建置 / 無依賴
- 純 HTML / CSS / JS，未引入外部框架與字型（僅使用系統字體）。
- 未新增 npm 依賴；若要腳本，可自行在 package.json 加上 `dev:homepage: "npx serve dev/static-homepage -l 4173"`。
