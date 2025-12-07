# CTCM Website Frontend & Migration

這個 repo 的長期目標是：

> 把中台世界舊站（ctworld.org / ctworld.org.tw）的內容，整理成結構化 JSON，匯入 Headless WordPress，最後由 React 前端呈現。

目前包含兩大角色：

1. **前端站台**：React + TypeScript + Vite（ctworld 新站的瀏覽介面）。  
2. **規格與工具**：描述「舊站 → JSON → WP → React」整體流程，並逐步加入工具程式。

---

## 1. 專案架構（高層）

完整說明請看 `ARCHITECTURE.md`，這裡只有簡要版流程：

```text
舊站 HTML
   ↓
爬 sitemap / URL 收集 (crawler)
   ↓
HTML → AnyContent(JSON, zh-tw)
   ↓
zh-tw → zh-cn pipeline
   ↓
WordPress 匯入 (post_type + meta + Polylang)
   ↓
Fallback 主圖補齊 / 其他後處理
   ↓
React 前端 (本 repo) 透過 WP API 讀取
   ↓
Redirect: 舊網址 → 新網址
```

關鍵資料結構：

- `AnyContent`：一個 union type，描述所有 post_type 共通的 JSON 結構。
- `external_id`：每則內容的穩定 ID，多語版本共用同一個 external_id。
- `Language`：`'zh-tw' | 'zh-cn' | 'en' | 'ja'` 小寫語言碼。

詳細 schema 請看：`docs/CONTENT_SCHEMA.md`。

---

## 2. 語言與網址策略（簡述）

- **語言碼（JSON / 內部）**：`'zh-tw' | 'zh-cn' | 'en' | 'ja'`  
- **URL 語言 segment**：
  - 預設語言 `zh-tw`：不帶語言段  
    - `/teaching/heart-sutra-001`
  - 其他語言：帶語言段  
    - `/zh-cn/teaching/heart-sutra-001`
    - `/en/teaching/heart-sutra-001`

- slug 不另外存欄位，由 `external_id` 規則推導。

---

## 3. 快速開始（前端開發）

> ⚠️ 以下假設已安裝 Node.js（推 NVM 管理）。

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 編譯
npm run build

# Lint / 型別檢查（視專案實際 script 調整）
npm run lint
npm run typecheck
```

前端主要資料來源（未來）：

- Headless WordPress REST API / GraphQL。
- 或中介層 API，輸入為 `AnyContent` JSON。

---

## 4. 規格文件索引

這些 docs 檔是整個專案的「權威規格」，也是給 Windsurf / Cursor / AI IDE 看的：

- `docs/COMPLETE_PROJECT_WORKFLOW.md`  
  → 全流程：爬蟲 → HTML→JSON → 繁簡 → WP 匯入 → 前端 → Redirect。

- `docs/CONTENT_SCHEMA.md`  
  → `AnyContent` 型別定義，包含所有 post_type 的 meta。

- `docs/HTML_TO_MARKDOWN_RULES_V4.md`  
  → HTML→Markdown + 圖片 / 圖說的處理規則。

- `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`  
  → 繁→簡 pipeline 的欄位白名單與實作原則。

- `ARCHITECTURE.md`  
  → 系統藍圖與分層設計（crawler / converter / importer / frontend）。

- `CONVENTIONS.md`  
  → 命名規則、語言碼、URL pattern、前端檔案結構約定。

- `CODING_GUIDELINES.md`  
  → TypeScript / React / 工具程式的實作風格與測試策略。

---

## 5. 如何閱讀這個 Repo

1. 先看 `ARCHITECTURE.md` 抓整體藍圖。
2. 再看 `docs/COMPLETE_PROJECT_WORKFLOW.md` 理解 end-to-end 流程。
3. 需要操作 HTML→JSON 時，看：
   - `docs/CONTENT_SCHEMA.md`
   - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
4. 需要操作繁→簡時，看：
   - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
5. 要寫新程式 / Component 時，看：
   - `CONVENTIONS.md`
   - `CODING_GUIDELINES.md`

未來所有新工具與 script，都應該：

- 以這些 docs 為唯一真相（Single Source of Truth）。
- 在程式註解裡標明「對應 docs 的哪一節」。

