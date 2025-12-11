// magazine 單元：從舊站 HTML 轉成 MagazineContent（AnyContent 的 magazine 變體）
// 對應：docs/CONTENT_SCHEMA.md § magazine、docs/HTML_TO_MARKDOWN_RULES_V4.md 共用規則

import { htmlToMarkdown } from "../html/html-to-markdown";
import type {
  HtmlToMarkdownOptions,
  LegacyHtmlDocument,
} from "../html/legacy-html-types";
import type { Language } from "../types/anycontent-teaching";
import type { MagazineContent, MagazineMeta } from "../types/anycontent-magazine";

export interface MagazineFromLegacyOptions extends HtmlToMarkdownOptions {
  /**
   * 指派給這一篇內容的 external_id（由外層流程決定）。
   */
  externalId: string;
  /**
   * 語言碼，目前先以 zh-tw 為主，未來由 zh-TW → zh-CN pipeline 產生其他語言版本。
   */
  language: Language;
  /**
   * 預設標題（若無法從 HTML 自動推斷時使用）。
   */
  fallbackTitle?: string;
}

/**
 * 將一篇舊站 magazine 類型 HTML 轉成 MagazineContent（minimal mapping 版本）。
 *
 * - HTML→Markdown 的規則實作由 `htmlToMarkdown()` 負責。
 * - 本函式目前只負責：
 *   - 填入 MagazineContent 所需的基本欄位（post_type / language / old_url / body_markdown / meta skeleton）。
 *   - issue / section / author 等進階欄位留待後續 T 任務補強。
 */
export function magazineFromLegacy(
  doc: LegacyHtmlDocument,
  options: MagazineFromLegacyOptions,
): MagazineContent {
  const { externalId, language, fallbackTitle, ...markdownOptions } = options;

  const mdResult = htmlToMarkdown(doc, markdownOptions);

  const post_title = fallbackTitle ?? deriveTitleFromUrl(doc.url);
  const parsedMeta = parseMagazineMetaFromHtml(doc.html);

  const meta: MagazineMeta = {
    ct_collection_key: undefined,
    ct_collection_order: undefined,
    ct_magazine_level: "issue",
    ct_magazine_issue: parsedMeta.issue,
    ct_magazine_issue_raw: parsedMeta.issueRaw,
    ct_magazine_pub_date: parsedMeta.pubDate,
    ct_magazine_pub_date_raw: parsedMeta.pubDateRaw,
    ct_magazine_issue_no: null,
    ct_magazine_year: null,
    ct_magazine_month: null,
    ct_magazine_issue_label: null,
    ct_issue_items: undefined,
    ct_magazine_section: null,
    ct_magazine_type: null,
    ct_author_name: null,
  };

  const magazine: MagazineContent = {
    external_id: externalId,
    language,
    post_type: "magazine",
    old_url: doc.url,
    post_title,
    post_excerpt: null,
    body_markdown: mdResult.body_markdown,
    featured_image: mdResult.images[0]?.src ?? null,
    featured_image_caption: null,
    gallery_items: mdResult.images.slice(1).map((img) => ({
      url: img.src,
      alt: img.alt ?? null,
      caption: null,
    })),
    meta,
  };

  return magazine;
}

function deriveTitleFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] ?? url;
    return last;
  } catch {
    return url;
  }
}

interface ParsedMagazineMeta {
  issueRaw: string | null;
  issue: string | null;
  pubDateRaw: string | null;
  pubDate: string | null;
}

/**
 * v1 meta 解析：支援 sample-001 的格式
 * 「日期：YYYY-MM-DD　期別：第 N 期」
 * 未匹配時回傳 null，不拋錯，避免整頁轉換失敗。
 */
function parseMagazineMetaFromHtml(html: string): ParsedMagazineMeta {
  const text = toHalfWidth(
    html
      // 粗略移除標籤，取得可搜尋文字
      .replace(/<script[^>]*>.*?<\/script>/gis, " ")
      .replace(/<style[^>]*>.*?<\/style>/gis, " ")
      .replace(/<[^>]+>/g, " "),
  );

  const pubDateRaw = extractAfterLabel(text, /日期[:：]/);
  const issueRaw = extractAfterLabel(text, /期別[:：]/);

  return {
    issueRaw,
    issue: normalizeIssue(issueRaw),
    pubDateRaw,
    pubDate: normalizeDate(pubDateRaw),
  };
}

function extractAfterLabel(text: string, label: RegExp): string | null {
  const parts = text.split(label);
  if (parts.length < 2) return null;
  // 取標籤後第一段，並截到下一個標籤或行斷
  const candidate = parts[1]
    .split(/(?:日期[:：]|期別[:：]|\r|\n)/)[0]
    .trim();
  return candidate || null;
}

function toHalfWidth(input: string): string {
  return input.replace(/[！-～]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
  );
}

function normalizeIssue(raw: string | null): string | null {
  if (!raw) return null;
  const digits = toHalfWidth(raw).match(/\d+/);
  return digits ? digits[0] : null;
}

function normalizeDate(raw: string | null): string | null {
  if (!raw) return null;
  const normalized = toHalfWidth(raw);
  const match = normalized.match(/(\d{4})[./-](\d{1,2})[./-](\d{1,2})/);
  if (!match) return null;
  const [, y, m, d] = match;
  const pad2 = (v: string) => v.padStart(2, "0");
  return `${y}-${pad2(m)}-${pad2(d)}`;
}
