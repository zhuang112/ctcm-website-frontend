# 一步一步架構 Directus + Astro 環境（乾淨重來版）

> 目標：你在任何一台機器都能「重新跑起來」：Directus（含 DB）+ Astro 前端 + 匯入工具。  
> 原則：不靠記憶、不靠手改 UI；能用指令重現。

---

## Step 0：先決條件（裝好就不再動）
1) Git
2) Node.js（建議 LTS）
3) Docker Desktop（Windows/Mac）或 Docker Engine（Linux）
4) （可選）VS Code + 基本終端工具

---

## Step 1：取得 repo 並安裝依賴
```bash
git clone <your-repo-url>
cd <repo>
npm install
```

---

## Step 2：啟動 Directus（Docker Compose）
進到 `apps/directus/`：
1) 複製 env
```bash
cp .env.example .env
```
2) 啟動
```bash
docker compose up -d
```
3) 打開 Directus 管理介面（通常是 http://localhost:8055）

---

## Step 3：用「Schema Snapshot」建立資料模型
1) 套用 schema（第一次建立 collections/fields）
```bash
npm run directus:schema:apply
```

2) 需要更新 schema 時
```bash
npm run directus:schema:snapshot
npm run directus:schema:apply
```

---

## Step 4：匯入 20 筆內容（AnyContent JSON → Directus）
```bash
npm run import:directus -- --limit 20
```
失敗請看：
- `docs/QA/DIRECTUS_IMPORT_FAILS.jsonl`

---

## Step 5：啟動 Astro 前端
進到 `apps/astro/`：
```bash
cp .env.example .env
npm run dev
```
測試路由：
- `/<lang>/<type>/<slug>`
- `/<lang>/<type>`

---

## Step 6：日常節奏（避免忘記）
每一包（T）固定照做：
1) 完成 → 產 zip（handoff）
2) 跑自證命令（tests/build/check）
3) 若 External Debug Required=YES：
   - 丟 Gemini/Grok 跑 debug review（固定模板）
   - 修完再跑一次自證
4) 你抽樣驗收 → 結案

---

## 常見踩雷與快速排除
- Directus 起不來：`docker compose logs -f directus`
- DB 要重建：`docker compose down -v`（資料會清空）
- 匯入重跑造成重複：表示 importer 不 idempotent（要修 key / upsert）
