#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Client from "ssh2-sftp-client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Attempt to load .env.siteground if present (simple parser to avoid extra deps)
function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

loadEnvFile(path.resolve(__dirname, "../../.env.siteground"));

const required = [
  "SITEGROUND_SFTP_HOST",
  "SITEGROUND_SFTP_PORT",
  "SITEGROUND_SFTP_USER",
  "SITEGROUND_SFTP_REMOTE_PATH",
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Missing required env vars:", missing.join(", "));
  console.error(
    "Create .env.siteground or export vars. See .env.siteground.example for placeholders.",
  );
  process.exit(1);
}

const LOCAL_DASHBOARD_PATH = path.resolve(
  __dirname,
  "../../dev/progress-dashboard/ctworld-progress-dashboard.html",
);

if (!fs.existsSync(LOCAL_DASHBOARD_PATH)) {
  console.error("Local dashboard file not found:", LOCAL_DASHBOARD_PATH);
  process.exit(1);
}

async function main() {
  const sftp = new Client();
  const config = {
    host: process.env.SITEGROUND_SFTP_HOST,
    port: Number(process.env.SITEGROUND_SFTP_PORT) || 22,
    username: process.env.SITEGROUND_SFTP_USER,
  };

  if (process.env.SITEGROUND_SFTP_PASSWORD) {
    config.password = process.env.SITEGROUND_SFTP_PASSWORD;
  } else if (process.env.SITEGROUND_SSH_KEY) {
    config.privateKey = fs.readFileSync(process.env.SITEGROUND_SSH_KEY);
    if (process.env.SITEGROUND_SSH_KEY_PASSPHRASE) {
      config.passphrase = process.env.SITEGROUND_SSH_KEY_PASSPHRASE;
    }
  } else {
    console.error(
      "Provide either SITEGROUND_SFTP_PASSWORD or SITEGROUND_SSH_KEY (and optional passphrase).",
    );
    process.exit(1);
  }

  const remotePath = process.env.SITEGROUND_SFTP_REMOTE_PATH;

  try {
    await sftp.connect(config);
    await sftp.fastPut(LOCAL_DASHBOARD_PATH, remotePath);
    await sftp.end();
    console.log("Progress dashboard deployed to:", remotePath);
  } catch (err) {
    console.error("Deploy failed:", err.message || err);
    process.exit(1);
  }
}

main();
