# PENDING_DECISIONS

> 版本：2025-12-12
> 提醒：協作流程請以 `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` 為準；本檔僅記錄待決議事項，若描述流程請視為歷史紀錄。
---
---

## zh-TW → zh-CN pipeline 細節
- 背景：僅有規格 `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`，尚未實作。
- 待決策：
  - 採用哪個 OpenCC 字典或客製詞彙表。
  - 轉換階段：先生成 zh-TW AnyContent，再批次轉 zh-CN，或邊寫邊轉？
  - 錯字/用語校正策略與白名單。
- 討論對象：你 / ChatGPT（規格）／未來實作者。

## WordPress 匯入策略
- 背景：Headless WP 尚未啟動；需規劃 ACF/custom post type/Polylang。
- 待決策：
  - post type / custom fields / taxonomy 結構。
  - Polylang 語言對應與同步方式。
  - 匯入時機：一次性匯入 vs. 持續同步（Webhook/CRON）。
  - redirect 策略：old_url / -gb URL 如何對應。
- 討論對象：你 / ChatGPT／未來 WP 開發者。

## React 前端架構
- 背景：目前僅有 Vite + React 腳手架；未正式開發前端。
- 待決策：
  - Next.js（SSR/SSG）vs. 繼續 Vite + CSR。
  - 路由與 SEO：靜態生成 vs. SSR；舊站 URL mapping。
  - 部署模式：CDN + Edge / 靜態 hosting / Vercel 等。
- 討論對象：你 / ChatGPT／前端工程。

## 部署與環境
- 背景：Headless WP 與前端尚未定案。
- 待決策：
  - WP 主機與資料庫位置（自管 vs. 雲端託管）。
  - 靜態前端部署地點（CDN、Object Storage 或 Vercel 等）。
  - CI/CD 流程（推 main 觸發 build/deploy 的設計）。
- 討論對象：你 / ChatGPT／DevOps。

## 其他待定項
- 內容校對流程：誰負責審稿、何時鎖版。
- 測試策略：unit / e2e / 可接受的覆蓋率與範圍。
- 標準化規則更新：docs 改版時的通知與驗收機制。

## Gallery default style fallback 策略
- 現狀（採 A 案）：default gallery style 由 adapter 決定並寫入 AnyContent meta（teaching=grid-2，news/magazine=grid-3）；importer 只忠實搬運，不在 importer/WP 端落地 fallback。
- B/C 備選（未實作）：  
  - B：在 importer 側若為 null，再依 post_type 補預設。  
  - C：由 WordPress/前端決定預設樣式。  
- A 為目前唯一真相；若未來要採 B/C，需另開 T。

## WordPress 內容欄位：body_markdown 與 wp_content_html
- 現狀（T-0059 dry-run）：`wp_content_html` 暫放 AnyContent.body_markdown（供計畫檔參考），尚未送出至 WP。
- 預期 v2（未實作）：importer 將 body_markdown 轉 HTML 後寫入 WordPress；WP plugin/前端負責呈現，markdown 本身不直接寫入 WP。
- 若未來要改變（例如 WP 端再做 markdown→HTML），需再開 T 決策。
