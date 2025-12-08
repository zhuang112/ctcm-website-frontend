# AI 協作與實作流程（ChatGPT + Windsurf + 你）

> 目的：讓「架構師 ChatGPT」、「實作工程師 Windsurf / Cursor」、「你（協調者）」三方有固定的合作模式，
> 盡量讓所有 coding 由 AI 完成，而你只需要決策、檢查與溝通。

---

## 1. 三個角色的分工

### 1.1 ChatGPT（這個對話）— 架構師 ＋ 規格機

- 負責：
  - 設計內容模型（content model）、JSON schema、TypeScript interface。
  - 設計抓取、轉換、匯入、繁簡 pipeline 的整體流程。
  - 撰寫 `docs/*.md` 規格與 **骨架程式碼**（含 TODO）。
  - 針對 Windsurf 產出的程式做「code review」與長期維護性建議。
- 不做：
  - 不在沒有規格的情況下直接亂寫成品。
  - 不繞過既有規格直接修改 schema（若要改，會先更新 docs）。

### 1.2 Windsurf / Cursor — 實作工程師

- 負責：
  - 依照 `docs/*.md` + 骨架程式碼 + TODO 清單，補完實作細節。
  - 修正 TypeScript / PHP / Node.js / WordPress plugin 的具體錯誤。
  - 讓測試程式（如果有）全部通過。
- 不做：
  - 不自行修改 TypeScript interface / JSON schema 的欄位名稱。
  - 不任意變更檔案架構、重命名核心函式。

### 1.3 你 — 協調者 / 決策者

- 負責：
  - 決定需求與優先順序（例如：先做 crawl、還是先做 teaching 轉換）。
  - 把 ChatGPT 生出的 docs / 骨架程式碼放進 repo。
  - 用固定的任務模板跟 Windsurf 下指令。
  - 在重要階段把程式碼 / diff 貼回來給 ChatGPT 做 code review。

---

## 2. 協作「模式」總結

### 主流程：模式 C + 模式 B

- **模式 C：規格＋骨架 code → Windsurf 補實作**（主力）
  - ChatGPT：寫 `docs/*.md` + `tools/xxx/*.ts` 骨架（含 TODO 註解）。
  - Windsurf：只允許在 TODO 區塊內補完程式碼。
- **模式 B：TODO / 任務清單**（任務管理）
  - ChatGPT：幫你維護 `docs/PROJECT_TODO.md`（或類似檔）。
  - 你：直接跟 Windsurf 說「請完成 TODO 清單第 X 項」。

### 模式 A 只用在「討論設計」階段

- 還沒決定規格時，可以開放式問 Windsurf / 其他 AI 想法。
- 一旦決定方案：
  - 由 ChatGPT 整理成正式 docs ＋骨架程式碼。
  - 開始用模式 C / B，限制 Windsurf 的修改範圍。

---

## 3. 「不能動的東西」＝ 程式裡的 Contract

為了避免 Windsurf 自行發揮，我們把重要規則變成 TypeScript / PHP 裡的「不可動契約」。

### 3.1 JSON / TypeScript 結構

- 由 ChatGPT 設計並寫進：
  - `docs/CONTENT_SCHEMA*.md`（未來）
  - `src/types/*.ts` 或 `tools/types/*.ts`
- 規則：

  - **Windsurf 不允許修改：**
    - interface 名稱（例如 `AnyContentTeaching`）。
    - 欄位名稱（例如 `external_id`, `language`, `post_type`, `body_markdown`）。
    - 關鍵欄位型別（例如 `language: 'zh-TW' | 'zh-CN' | 'en' | 'ja'`）。
  - 若未來要調整 schema：
    - 由 ChatGPT 先更新 docs ＋ types 檔，
    - 再由 Windsurf 調整相關實作。

### 3.2 HTML→Markdown / JSON 的關鍵規則

- 見：`docs/HTML_TO_MARKDOWN_RULES_V3.md`。
- 規則摘要：
  - Caption 只存在 JSON，不進 `body_markdown`。
  - 圖片欄位：
    - `featured_image` / `featured_image_caption`
    - `gallery_items[]` + `caption`
  - 偈語 / 引言、索引頁等有特殊處理。

**Windsurf 實作時禁止：**

- 在 `body_markdown` 插入圖片圖說。
- 自行新增 `body_html` 等未定義欄位。
- 將 `featured_image` 等欄位拆成其他結構。

---

## 4. 任務拆解與 TODO 策略

### 4.1 拆成「小而明確」的任務

每一個實作任務應該只解決一件事，例如：

- 實作 `tools/crawl/crawl-ctworld.ts` 裡抓 `<a href>` 的邏輯。
- 實作 `htmlToMarkdown()`，不處理 JSON 組裝。
- 實作 `generate-zh-cn-from-zh-tw.ts` 中 OpenCC 的呼叫與欄位 mapping。

### 4.2 ChatGPT 負責準備的東西

對每個任務，ChatGPT 會：

1. 在 `docs/*.md` 裡寫清楚：
   - input / output 介面。
   - 要遵守的規則（引用既有 docs）。
2. 在對應的 `.ts` / `.php` 裡：
   - 寫好函式簽名與 interface import。
   - 留下 `// TODO:` 註解與空函式體。
   - 必要時附上 1–2 個測試樣本（或單獨建立測試檔）。

### 4.3 Windsurf 實作範圍

- Windsurf 只能：
  - 修改 TODO 區塊內的內容。
  - 為 TODO 區塊補充輔助小函式（同一檔案內）。
- Windsurf 不能：
  - 刪除或改名既有函式。
  - 修改 interface / type 定義。
  - 改變檔案的對外匯出 API。

---

## 5. 給 Windsurf 的「任務模板」

下面這些是你可以直接複製貼給 Windsurf 的任務描述範本。

### 5.1 一般實作任務模板

> 請先閱讀：  
> - `docs/COMPLETE_PROJECT_WORKFLOW.md`  
> - `docs/HTML_TO_MARKDOWN_RULES_V3.md`  
> - 以及目前專案裡與本任務相關的檔案。
>
> 任務目標：  
> 完成 `tools/convert/html-to-anycontent-teaching.ts` 中註明 `TODO` 的部分，
> 實作 `htmlToAnyContentTeaching(html: string, url: string): AnyContentTeaching`。
>
> 不可以做的事：  
> - ❌ 不可以修改 `src/types/anycontent-teaching.ts` 中的 interface 欄位名稱與型別。  
> - ❌ 不可以在 `body_markdown` 中加入圖片圖說（caption 只存在 JSON）。  
> - ❌ 不可以修改檔案對外匯出的函式名稱或參數介面。  
>
> 完成標準：  
> - ✅ 通過本檔案（或 `tests/htmlToAnycontentTeaching.spec.ts`）中所有測試案例。  
> - ✅ 對照 `HTML_TO_MARKDOWN_RULES_V3.md`，處理標題、段落、列表、引用、偈語等。  
> - ✅ 能正確從 HTML 中找出主圖與其他圖片，依規則填入 `featured_image` 與 `gallery_items[]`。

### 5.2 限制修改範圍的模板

> 在這個任務中，你「只能」修改標註 `// TODO` 的區塊，
> 以及 **同一檔案內** 為完成 TODO 需要的新輔助函式，
> 其他檔案與其他函式內容請不要變更。

### 5.3 針對測試導向的模板

> 請先閱讀 `tests/htmlToMarkdown.spec.ts`，了解目前測試案例的 input/output。  
> 任務目標是讓 `npm test -- htmlToMarkdown` 全部通過：  
> - 不要修改測試檔。  
> - 若你認為測試案例不合理，請在程式碼註解中寫下你的疑慮。

---

## 6. 測試與 code review 流程

### 6.1 測試的位置與角色

- 測試程式（未來計畫）：
  - `tests/*.spec.ts` or `tools/__tests__/*.ts`
- ChatGPT：
  - 幫你設計測試案例（尤其是 HTML→Markdown / JSON mapping）。
- Windsurf：
  - 實作程式直到所有測試通過。
- 你：
  - 有需要時跑 `npm test` 或特定測試 script。

### 6.2 code review 流程

標準流程建議：

1. 你把任務交給 Windsurf，請它完成 TODO。
2. Windsurf 結束後，你看一下 diff：
   - 如果只是小改動，直接 commit。  
   - 如果改動較多或牽涉到核心流程：
     - 把關鍵檔的內容貼給 ChatGPT。  
     - 請 ChatGPT 做一次「結構 + 規則符合度」的 code review。
3. 若 ChatGPT 建議調整：
   - 由 ChatGPT 幫你產生修正版檔案（或 patch），
   - 你再貼回 repo 或交給 Windsurf 套用。

---

## 7. 與現有 docs 的關聯

你可以把這份 `AI 協作與實作流程` 當作：

- `docs/COMPLETE_PROJECT_WORKFLOW.md` 的「人機協作層」補充：
  - COMPLETE_PROJECT_WORKFLOW：描述 **系統與資料** 的整體流程。
  - AI 協作文件：描述 **人與 AI 工具** 的整體流程。
- 當我們新增 / 修改 pipeline（例如：新增一條 media importer、或調整 zh-TW→zh-CN 規則）：
  1. 先由 ChatGPT 更新 / 新增對應的 `docs/*.md`。  
  2. 由 ChatGPT 產生骨架程式碼（含 TODO）。  
  3. 你把骨架丟給 Windsurf 實作。  
  4. 實作完成後，你視情況把程式貼回給 ChatGPT 進行 review。

---

## 8. 未來可以擴充的檔案

建議未來在你的 repo 裡加這些檔案（或以目前檔案名義補充章節）：

- `docs/PROJECT_TODO.md`  
  - 由 ChatGPT 維護的任務清單（每條標註負責工具、關聯 docs、預估難度）。
- `docs/CONTENT_SCHEMA.md`  
  - 所有 post_type / AnyContent 的正式 schema。  
  - 是 Windsurf 不可修改的核心 contract。
- `docs/AI_COLLAB_WORKFLOW.md`（本檔案）  
  - 說明人機協作與任務下達規範。

你可以把本檔案放進 `docs/`，並在 `README.md` 或 `ARCHITECTURE.md` 中加一行連結：

> 「如何跟 ChatGPT / Windsurf 協作，請見 `docs/AI_COLLAB_WORKFLOW.md`。」

未來如果我們調整協作方式（例如多了一個專門寫測試的 AI），也可以在這一份檔案中修訂。
