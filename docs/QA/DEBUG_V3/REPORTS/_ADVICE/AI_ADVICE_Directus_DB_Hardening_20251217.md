Date: 2025-12-17
Sources: Gemini, Grok
Topic: Directus/DB hardening (token/role, unique/index, backup)
Context: ctworld Directus + Astro migration

## Gemini
- 建議：強制使用 role-based token，限制 schema/apply 權限；定期產出 schema diff 並備份。
- 指定：any_content type+lang+slug unique index；files 欄位需限制可用 MIME。

## Grok
- 建議：管理員 token 分離，CLI 需支持 dry-run；導入時保留 change log。
- 提醒：備份策略需記錄存放位置與驗證流程（checksum）。
