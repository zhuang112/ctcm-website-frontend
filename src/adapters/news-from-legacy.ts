// news 單元：從舊站 HTML 轉成 NewsContent（AnyContent 的 news 變體）
// 對應：docs/CONTENT_SCHEMA.md § news、docs/HTML_TO_MARKDOWN_RULES_V4.md 共用規則

import { htmlToMarkdown } from "../html/html-to-markdown";
import type {
  HtmlToMarkdownOptions,
  LegacyHtmlDocument,
} from "../html/legacy-html-types";
import type { Language } from "../types/anycontent-teaching";
import type { NewsContent, NewsMeta } from "../types/anycontent-news";

export interface NewsFromLegacyOptions extends HtmlToMarkdownOptions {
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
 * 將一篇舊站 news 類型 HTML 轉成 NewsContent（minimal mapping 版本）。
 *
 * - HTML→Markdown 的規則實作由 `htmlToMarkdown()` 負責。
 * - 本函式目前只負責：
 *   - 填入 NewsContent 所需的基本欄位（post_type / language / old_url / body_markdown / meta skeleton）。
 *   - 圖片與進階 meta（日期、地點、類別等）留待後續 T 任務補強。
 */
export function newsFromLegacy(
  doc: LegacyHtmlDocument,
  options: NewsFromLegacyOptions,
): NewsContent {
  const { externalId, language, fallbackTitle, ...markdownOptions } = options;

  const mdResult = htmlToMarkdown(doc, markdownOptions);

  const post_title = fallbackTitle ?? deriveTitleFromUrl(doc.url);

  const parsed = parseNewsDateAndLocationFromHtml(doc.html);
  const [firstImage, ...galleryImages] = mdResult.images;

  const meta: NewsMeta = {
    ct_collection_key: undefined,
    ct_collection_order: undefined,
    ct_news_date: parsed.newsDate,
    ct_event_date_start: parsed.eventDateStart,
    ct_event_date_end: parsed.eventDateEnd,
    ct_event_date_raw: parsed.eventDateRaw,
    ct_event_location: parsed.eventLocation,
    ct_news_category: null,
  };

  const news: NewsContent = {
    external_id: externalId,
    language,
    post_type: "news",
    old_url: doc.url,
    post_title,
    post_excerpt: null,
    body_markdown: mdResult.body_markdown,
    featured_image: firstImage?.src ?? null,
    featured_image_caption: firstImage?.alt ?? null,
    gallery_items: galleryImages.map((img) => ({
      url: img.src,
      alt: img.alt ?? null,
      caption: img.alt ?? null,
    })),
    meta,
  };

  return news;
}

interface ParsedNewsDateLocation {
  newsDate: string | null;
  eventDateStart: string | null;
  eventDateEnd: string | null;
  eventDateRaw: string | null;
  eventLocation: string | null;
}

function parseNewsDateAndLocationFromHtml(html: string): ParsedNewsDateLocation {
  // T-0005 v1：僅處理最常見且容易解析的樣板，其他情況維持 null
  // 策略：
  // - 先移除 HTML 標籤取得純文字，壓成單行字串。
  // - 尋找模式：
  //   - 日期：`日期：YYYY-MM-DD` 或 `日期：YYYY-MM-DD ~ YYYY-MM-DD`
  //   - 地點：`地點：XXXX`，以句號 / 分號 / 結尾為界。

  const text = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  const normalized = text.replace(/\s+/g, " ").trim();

  const dateRegex = /日期：\s*([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})(?:\s*[~～─-]\s*([0-9]{4}-[0-9]{1,2}-[0-9]{1,2}))?/;
  const dateMatch = normalized.match(dateRegex);

  const locationRegex = /地點：\s*([^。；;]+)/;
  const locationMatch = normalized.match(locationRegex);

  const newsDate = dateMatch ? dateMatch[1] : null;
  const eventDateStart = dateMatch ? dateMatch[1] : null;
  const eventDateEnd = dateMatch && dateMatch[2] ? dateMatch[2] : null;
  const eventDateRaw = dateMatch
    ? (dateMatch[0] ?? "").replace(/^日期：\s*/, "").trim()
    : null;

  let eventLocation: string | null = null;
  if (locationMatch) {
    const locRaw = locationMatch[1].trim();
    // 只取地點欄位的第一段文字（遇到空白/全形空白後的描述不算在地點內）
    eventLocation = locRaw.split(/[\s\u3000]+/)[0] || null;
  }

  return {
    newsDate,
    eventDateStart,
    eventDateEnd,
    eventDateRaw,
    eventLocation,
  };
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
