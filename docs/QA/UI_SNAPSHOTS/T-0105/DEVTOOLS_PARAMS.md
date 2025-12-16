# T-0105 DevTools 參數紀錄

此檔為 DevTools 量測摘要，截圖尚未提供（桌機/平板/手機）。若需視覺驗收，請在本目錄放置 `desktop.png` / `tablet.png` / `mobile.png`。

## 測量參數（以目前 Astro 卡片列表為例）
- Container: max-w≈1200px, padding=2.5rem/1.25rem desktop, 1.5rem/1rem mobile
- Breakpoints: mobile<640px, desktop>=640px（利用 auto-fit grid）
- Fonts: base≈16px/1.6, h1≈32px/1.2, h2≈24px/1.4
- Colors: primary=#2563eb, text=#0f172a, bg gradient #f8fafc→#eef2ff, border=#e5e7eb
- Card: radius=12px, shadow=0 8–12px 18–24px rgba(0,0,0,0.05–0.08), padding=1rem, image_ratio=16:9, summary_clamp=3
- Grid: auto-fit minmax(260px,1fr), gap=1.5rem
- Interactions: hover shadow+lift, sticky header=N, menu=N, tabs=N, accordion=N
