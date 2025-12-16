# IMPROVEMENT_BACKLOG

> 改進 / 修復追蹤清單，category: uto（可直接落地的自動化） / discussion（需討論後再決定）。如有新議題請再拆成 T 任務。
- id: I-xxxx
- category: auto | discussion
- description: 簡述
- impact: high / medium / low
- status: todo | doing | done | parked
- elated: 對應的 T 任務 / notes
- 
otes: 補充、RAW 連結或日期

| id    | category | description                                                          | impact | status | related | notes                                   |
|-------|----------|----------------------------------------------------------------------|--------|--------|---------|-----------------------------------------|
| I-0001| auto     | 預留條目，待再挖掘落地項目                                           | medium | todo   | -       | -                                       |
| I-0002| auto     | Security hardening & secret scanning rules（T-0080）                 | high   | done   | T-0080  | 2025-12-13 完成，scan 通過              |
| I-0003| auto     | Handoff source_commit autodetect + MANIFEST 驗證（T-0081）           | high   | done   | T-0081  | 2025-12-16 完成，zip 帶 HEAD7           |
| I-0004| auto     | Debug V3 模板與 CI 自檢查（T-0087）                                   | high   | done   | T-0087  | 2025-12-16 建立模板與 ci-self-proof     |
| I-0005| auto     | 爬蟲禮貌性：rate limit + backoff + 429/403 停止並回報（T-0085，P0）   | high   | done   | T-0085  | 2025-12-16 登記，待後續實作調整         |
| I-0006| auto     | zh-TW→zh-CN pipeline docs 統一（T-0083，canonical + QA 資源）         | high   | done   | T-0083  | 2025-12-16 落地 canonical 與 cross-link |
| I-0007| auto     | security:scan 嚴格模式與 .env example allowlist（T-0082）            | high   | done   | T-0082  | 2025-12-16 加入 strict/allowlist        |

