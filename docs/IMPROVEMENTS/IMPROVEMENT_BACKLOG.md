# IMPROVEMENT_BACKLOG

> 改善 / 修復追蹤清單。`category`: `auto`（可直接落地的小優化） / `discussion`（需討論後才動手）。完成任務後更新狀態與相關 T 編號。

欄位：
- `id`：I-xxxx
- `category`：auto | discussion
- `description`：一行說明
- `impact`：high / medium / low
- `status`：todo | doing | done | parked
- `related`：對應的 T 任務或 notes
- `notes`：補充、RAW 連結、日期等

| id    | category   | description                                              | impact | status | related | notes                          |
|-------|------------|----------------------------------------------------------|--------|--------|---------|--------------------------------|
| I-0001| auto       | （保留佔位，待補實際條目）                               | medium | todo   | -       | -                              |
| I-0002| auto       | Security hardening & secret scanning rules（T-0080）     | high   | done   | T-0080  | 2025-12-13 新增，scan 通過     |
| I-0003| auto       | Handoff source_commit autodetect + MANIFEST 斷言（T-0081） | high   | done   | T-0081  | 2025-12-16 完成，zip 帶 HEAD7   |
| I-0004| auto       | Debug V3 模板與 CI 自動檢查（T-0087）                    | high   | done   | T-0087  | 2025-12-16 建立模板與 ci-self-proof |
| I-0005| auto       | 爬蟲禮貌性：rate limit + backoff + 429/403 停止並回報（T-0085，P0） | high   | done   | T-0085  | 2025-12-16 登記，待後續實作調整 |
| I-0006| auto       | zh-TW→zh-CN pipeline docs 統一（T-0083，canonical + QA 報告） | high   | done   | T-0083  | 2025-12-16 整併 canonical 與 cross-link |
