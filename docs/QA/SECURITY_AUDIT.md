# SECURITY_AUDIT（T-0080）

- source_commit：9d1ac8a0f4b72d0bb88e4d90ebf6f6f6633999c5
- 範圍：工作樹（排除 node_modules/dist/docs/TEMP 等）；初步檢查 git 最近歷史。
- 工具：
  - `npm run security:scan`（scripts/quality/security-scan.js）
  - patterns：WP_APP_PASSWORD / Authorization / Bearer token / ssh key / SITEGROUND / SFTP_PASSWORD / CPANEL_PASSWORD 等
- 結果：
  - `npm run security:scan` 無阻斷，僅對 SiteGround / WP_APP_PASSWORD 等關鍵字做警告（皆為 placeholder / 範例），未發現實際 secrets。
  - `.env*`、`docs/TEMP/*.zip`、`*.pem`、`*.key` 已列入 .gitignore。
- 後續建議：
  - 部署/匯入前必跑 `npm run security:scan`。
  - 若將來發現 secrets：立即移除檔案、rotate 憑證、必要時 rewrite git history 並在本檔記錄。
