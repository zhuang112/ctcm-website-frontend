# INSTR-T-0047-docs-rules-consistency-review-phase-1  
> 任務：規則文件一致性檢查（第一輪）

## 0. 任務摘要

- 類型：📄 **docs-only / review-only**（不改動程式碼）
- 目標：  
  1. 精讀核心規則文件（workflow / schema / HTML→Markdown / zh-TW→zh-CN 等）。  
  2. 找出「同一主題出現在多個文件、說法不一致」或「舊版規則已過時但還在文件裡」的地方。  
  3. 整理一份 `docs/RULES_CROSSCHECK_NOTES_V1.md`，列出：  
     - 每個主題的「單一真相文件」是哪一份。  
     - 舊版段落的「候選清除/合併列表」。  
     - 可以衍生成未來 T 任務的候補清單。  

- Safety level：  
  - Docs-only（不編輯 src/、tools/、tests/、data/）。  
  - 無需執行 `npm test` / `npm run build` / `npm run check:zh-cn`（除非後面另有程式改動的 T）。

---

## 1. 需要閱讀／對照的檔案（只讀）

請依序閱讀、比對下列檔案內容（**只讀，不修改原檔**）：

1. Workflow / 協作流程  
   - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`  
   - `docs/TOOLS_ROLES_AND_BOUNDARIES.md`  
   - `docs/SESSION_CHECKLIST.md`  
   - `docs/AI_COLLAB_SUMMARY.md`  
   - `docs/COMPLETE_PROJECT_WORKFLOW.md`  
   - `docs/PENDING_DECISIONS.md`

2. 內容規則 / schema / pipeline  
   - `docs/CONTENT_SCHEMA_V1.md`  
   - `docs/CONTENT_SCHEMA.md`  
   - `docs/HTML_TO_MARKDOWN_RULES_V4.md`  
   - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`

3. 任務與歷史紀錄  
   - `docs/PROJECT_TODO.md`  
   - `docs/Windsurf_ChatGPT_NOTES.md`（只需要看 2025-12-10 之後的 T-0017～T-0046 區段）

4. INSTR 系統  
   - `docs/INSTR/README.md`  
   - `docs/INSTR/INSTR-TEMPLATE.md`  
   - `docs/INSTR/INSTR-T-0018-meta-instr-and-status-structure.md`

> ⚠️ 本任務不對這些檔案做任何修改，只用來建立 cross-check 筆記。

---

## 2. 要新增／修改的檔案

本任務只會新增／修改 **一個檔案**：

- 新增：`docs/RULES_CROSSCHECK_NOTES_V1.md`  
- 不修改任何既有 docs / src / tools / tests / data。

---

## 3. 工作內容（給 Codex 的步驟）

### 3.1 建立筆記檔

1. 在 `docs/` 目錄下建立新檔案：`docs/RULES_CROSSCHECK_NOTES_V1.md`。
2. 檔案開頭請包含任務說明、參考文件清單、日期與 T 編號（T-0047）。

### 3.2 針對每個主題做 cross-check

在 `RULES_CROSSCHECK_NOTES_V1.md` 中至少整理以下主題：

1. **Workflow / 協作流程**  
   - 主題：分工、RAW 規則、snapshot 規則、安全等級、test/build/check:zh-cn 規則、INSTR 編寫規則。  
   - 比對 `WORKFLOW_CHATGPT_GITHUB_AGENT.md`、`TOOLS_ROLES_AND_BOUNDARIES.md`、`SESSION_CHECKLIST.md`、`AI_COLLAB_SUMMARY.md`、`COMPLETE_PROJECT_WORKFLOW.md`。  
   - 列出：✅ 一致的規則；⚠️ 說法不同或重複的段落；📌 建議未來 T（如「把重複的流程集中到 workflow」）。

2. **CONTENT_SCHEMA / AnyContent V1**  
   - 主題：共用欄位、teaching/news/magazine meta、`has_unclassified_content`、language、多語/SEO。  
   - 比對 `CONTENT_SCHEMA_V1.md`、`CONTENT_SCHEMA.md`、`PROJECT_TODO.md` 相關描述。  
   - 整理：哪些欄位已實作、哪些僅規劃、是否有舊稱呼需要統一。

3. **HTML→Markdown 規則**  
   - 主題：標題/段落/換行、圖片與圖說、未知內容 fallback、index_page 規則等。  
   - 以 `HTML_TO_MARKDOWN_RULES_V4.md` 為主，對照舊版（若仍留存 V2/V3 則只讀）。  
   - 標出：被 V4 取代的規則、V4 提到但 adapter 可能尚未完全實作的部分。

4. **zh-TW → zh-CN pipeline**  
   - 主題：白名單欄位、language 變更、SEO 轉換、health check CLI 檢查項目。  
   - 比對 `ZH_TW_TO_ZH_CN_PIPELINE.md`、`PROJECT_TODO.md` 中 T-0013～T-0016 / T-0038 / T-0039。  
   - 整理：設計稿 vs CLI 現況（文字描述即可）、health check 目前檢查與未檢查項目、未來 T 建議。

### 3.3 整理「單一真相文件」與未來 T 候選

在 `RULES_CROSSCHECK_NOTES_V1.md` 結尾列出：
- 每個主題的建議單一真相文件（workflow / schema / HTML→MD / zh-CN pipeline 等）。  
- 候選未來 T（僅列題目與一行描述，不要改 PROJECT_TODO）。

### 3.4 收尾與 commit 規則

1. 只新增/修改：`docs/RULES_CROSSCHECK_NOTES_V1.md`。  
2. 不得修改其他檔。  
3. Commit 訊息：`T-0047: rules docs cross-check notes v1`。  
4. 不需跑 `npm test` / `npm run build` / `npm run check:zh-cn`。  
5. 在 `docs/Windsurf_ChatGPT_NOTES.md` 新增 T-0047 小節，記錄摘要、新增檔案、commit hash、RAW 連結。

---

## 4. 給 ChatGPT review 的檔案清單（完成後）

完成後請使用者上傳：
1. `docs/RULES_CROSSCHECK_NOTES_V1.md`
2. `docs/Windsurf_ChatGPT_NOTES.md`（含 T-0047 小節）

（若需要再指定其他原始規則檔的最新版本。）
