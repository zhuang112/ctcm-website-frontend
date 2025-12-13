import { Buffer } from "node:buffer";

export interface WPClientConfig {
  baseUrl: string;
  username: string;
  appPassword: string;
}

export interface WPClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
}

export function createWPClient(config: WPClientConfig): WPClient {
  const base = config.baseUrl.replace(/\/+$/, "");
  const auth = Buffer.from(`${config.username}:${config.appPassword}`).toString("base64");

  async function request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
    const url = `${base}${path}`;
    const headers: Record<string, string> = {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    };
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`WP request failed ${res.status}: ${text}`);
    }
    return (await res.json()) as T;
  }

  return {
    get: (path) => request("GET", path),
    post: (path, body) => request("POST", path, body),
  };
}

export function getConfigFromEnv(): WPClientConfig {
  const { WP_BASE_URL, WP_USERNAME, WP_APP_PASSWORD } = process.env;
  if (!WP_BASE_URL || !WP_USERNAME || !WP_APP_PASSWORD) {
    throw new Error("Missing WP envs: WP_BASE_URL, WP_USERNAME, WP_APP_PASSWORD");
  }
  return {
    baseUrl: WP_BASE_URL,
    username: WP_USERNAME,
    appPassword: WP_APP_PASSWORD,
  };
}
