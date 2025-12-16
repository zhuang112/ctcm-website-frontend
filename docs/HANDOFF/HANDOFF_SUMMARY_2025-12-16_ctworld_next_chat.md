# 中台世界改版專案｜本次對話交接摘要（給下一個對話的 ChatGPT）
生成時間：2025-12-16 09:44 

> 核心：ctworld 舊站 → headless（目前仍以 repo 工作流為主），採「任務 T 編號 + INSTR + Codex 執行 + versioned TEMP zip + MANIFEST」的可追溯流程。  
> 使用者偏好：聊天室不貼長文；所有長內容以檔案交付；review 回覆只要 **結論 / 備註 / 小優化**。  
> 交接優先真相來源：**上傳的 TEMP zip（含 MANIFEST）**；必要時才看 GitHub RAW。  
> 一旦看不到檔案/內容 → 必須立刻中止推論並一次列出所需檔案。

---

## 1) 本次對話完成到哪裡（狀態）

### 已完成且有 versioned TEMP zip 的任務（使用者提供清單/截圖）
使用者本機可見的 zip 檔名（節錄）：
- TEMP_20251213_T-0066_26de43d.zip
- TEMP_20251213_T-0067_ff6d20e.zip
- TEMP_20251213_T-0068_25628be.zip
- TEMP_20251213_T-0070_990d6df.zip
- TEMP_20251213_T-0072_bd4f0cd.zip
- TEMP_20251213_T-0073_1581cfc.zip
- TEMP_20251213_T-0074_e7444ee.zip
- TEMP_20251213_T-0077_1481182.zip
- TEMP_20251213_T-0078_0c1fbca.zip
- TEMP_20251213_T-0079.zip（疑似舊格式：缺 HEAD7）
- TEMP_20251213_T-0080_45fbd17.zip
- TEMP_20251216_T-0081_097f4ff.zip
- TEMP_20251216_T-0082_6a8ab2d.zip
- TEMP_20251216_T-0083_f8adf69.zip
- TEMP_20251216_T-0085_*（多份：24c0169 / 9b85f85 / d12d031；後者為 RERUN 完整包）
- TEMP_20251216_T-0087_7e10600.zip
- TEMP_20251216_T-0089_220549c.zip
- TEMP_20251216_T-0090_692c9c3.zip
- TEMP_20251216_T-0091_*（截圖中有）

> 注意：使用者問「handoff ZIP 是哪個 T 任務的 TEMP ZIP？」——答案：每顆 T 對應自己的 TEMP zip（versioned），以檔名 task_id 判定；若缺/舊格式，需 rerun handoff 補包。

---

## 2) 本次對話的關鍵規範/決策（務必沿用）

### 2.1 交接包規則（目前最新）
- 交接一律用 `docs/TEMP/TEMP_<YYYYMMDD>_<T-XXXX>_<HEAD7>.zip`
- zip 內保留原始路徑（不可 flatten）
- MANIFEST 必含 source_commit，且必須等於生成當下 HEAD（T-0081 已做斷言）
- 同一日多顆任務 zip 不能互相覆蓋（版本化檔名已解決）

### 2.2 review 與小優化規則
- review 回覆：只給 **結論 / 備註 / 小優化**
- 小優化若不需討論 → 直接列入工作項目（第一優先）
- 若需要討論 → 助手主動提出 A/B/C 分析
- 所有流程改變/修 bug/小優化：需登記至 improvements backlog（第一優先追蹤）

### 2.3 debug V3 方向（本次已落地一部分）
- Debug V3 強調：黃金樣本 + 機器驗收（CI）+ 抽樣人工 + 多 AI 互查
- 回報格式標準化：bug_report/checklist/url_queue 模板
- 外部 AI debug 產物：只收 Markdown，放固定資料夾（docs/QA/DEBUG_V3/REPORTS）

---

## 3) 使用者的新需求/問題（待處理）

1) **下載檔案常出現「找不到檔案」**（本對話中再次發生：INSTR-T-0092 下載失敗）。
2) **「之前沒有打包的部份怎麼辦？」**：需要一顆流程任務把「缺 zip / 舊格式 zip」補齊（RERUN-HANDOFF）。
3) 外部 AI（Gemini/Grok 等）要協助 debug：需要一份可直接給他們的指令稿 + 回報模板（已做過一版，後續要納入 repo workflow）。
4) 住持/上位者溝通：用 dashboard/Drive 展示（之前已有 SiteGround 部署 progress dashboard 的作法）。
5) 靜態首頁原型（T-0090）已完成，有交接包；使用者可直接看 dev/static-homepage/。

---

## 4) 本次新產出的 INSTR（需要 Codex 去做）

### T-0092（本次新增，待執行）
目的：
- 補齊「缺漏交接包」的政策與流程，並把外部 AI debug 的 prompt/報告格式固定化（只收 Markdown）。

主要做法：
- 更新 workflow：新增「缺 zip → RERUN-HANDOFF」章節
- 更新 Debug V3 README：規定 reports 路徑與命名
- 新增兩份外部 AI prompt 模板（debug review pack / bugfix validation）
- 如發現舊格式 zip（例如 T-0079）→ rerun handoff 產新版 zip（不刪舊檔）

（INSTR 檔案由 ChatGPT 產出，但曾遇到「下載找不到」；若再發生，需重新生成並確認可下載。）

---

## 5) 本機環境（使用者狀況）
- Windsurf 會繼續跑
- 已安裝 Docker Desktop（但可能還要 BIOS 虛擬化設定）
- Node.js LTS + npm/pnpm、Git：使用者「應該已有」但不確定
- 使用者傾向：能用 zip 交接就用 zip，避免 RAW 誤讀/舊檔問題

---

## 6) 下一步建議（給下一個對話）
1) 先請使用者把「最新要 review 的 TEMP zip」上傳（或指定 task_id），以 zip 為單一真相來源。
2) 優先執行 T-0092：把缺包/外部 AI debug 規範正式寫入 repo。
3) 檢查並修正：是否仍有舊格式 zip（如 `TEMP_20251213_T-0079.zip`）→ rerun handoff。
4) 若使用者要外部 AI 幫忙：提供「最小 Review Pack（20–80MB）」打包規則與 prompt（放入 repo templates）。

---

## 7) 重要提醒（對下一個對話的 ChatGPT）
- 使用者要求：任何看不到/讀不到的檔案，一律立即停下推論，**一次列出**需要哪些檔案（路徑/檔名），請使用者提供。
- 長文一律改成輸出檔案（.md/.html），聊天室只給重點與下載連結。
