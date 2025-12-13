# SECURITY_AUDIT（T-0080）

- source_commit：<to-fill-after-commit>
- 範圍：工作樹（排除 node_modules/dist/docs/TEMP 等）；初步檢查 git 最近歷史。
- 工具：
  - `npm run security:scan`（scripts/quality/security-scan.js）
  - patterns：WP_APP_PASSWORD / Authorization / Bearer token / ssh key / SITEGROUND / SFTP_PASSWORD / CPANEL_PASSWORD 等
- 結果：
  - 未偵測到 secrets 關鍵字。
  - `.env*`、`docs/TEMP/*.zip` 已列入 .gitignore。
- 後續建議：
  - 部署/匯入前必跑 `npm run security:scan`。
  - 若將來發現 secrets：立即移除檔案、rotate 憑證、必要時 rewrite git history 並在本檔記錄。

