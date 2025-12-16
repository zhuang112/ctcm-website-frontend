# DevTools UI 參數檢查清單（T-0104）

## 快速檢查項目
- Layout / Container：max-width（如 1280px / max-w-7xl）、grid 欄數、gap、斷點（桌機/平板/手機）、padding。
- Typography：font stack，H1/H2/H3/Body 的 font-size / line-height / weight。
- Colors：primary/accent/bg/text/border/link/hover，記錄 hex 或 rgb。
- Spacing / Radius / Shadow：section 上下距、card padding、radius（如 8/12/16）、shadow。
- Card / Media：封面/縮圖的 aspect ratio（6:9 / 4:3 / 1:1）、line-clamp（如 2–3 行）。
- Interaction：hover（陰影/縮放）、sticky header、mobile menu（開合）、tabs/accordion。

## 建議回報格式（貼給 Gemini / Agent）
- Container: max-w=____, padding=____
- Breakpoints: mobile<____, tablet<____, desktop>=____
- Fonts: base=____/____, h1=____/____, h2=____/____
- Colors: primary=____, text=____, bg=____, border=____, link=____, hover=____
- Card: radius=____, shadow=____, padding=____, image_ratio=____, title_clamp=____, summary_clamp=____
- Grid: cols=____, gap=____
- Interactions: hover=Y/N, sticky=Y/N, menu=Y/N, tabs=Y/N, accordion=Y/N

> 開 DevTools（Elements + Computed/Styles），先記下上述參數，再請 Gemini/Agent 依此落地或比對 UIZIP。
