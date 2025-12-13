// news：legacy HTML → NewsContent（AnyContent news）
// 對應：docs/CONTENT_SCHEMA_V1.md § news；docs/HTML_TO_MARKDOWN_RULES_V4.md 通用規則

import { htmlToMarkdown } from "../html/html-to-markdown";
import type {
  HtmlToMarkdownOptions,
  LegacyHtmlDocument,
} from "../html/legacy-html-types";
import type { Language } from "../types/anycontent-teaching";
import type { NewsContent, NewsMeta } from "../types/anycontent-news";
import { parseDateRange, parseDateToken } from "../utils/parse-date";

export interface NewsFromLegacyOptions extends HtmlToMarkdownOptions {
  /** 外部提供的唯一鍵 */
  externalId: string;
  /** 語言；預設以 zh-tw 為主，zh-cn 由 pipeline 產出 */
  language: Language;
  /** HTML 缺標題時的後援 */
  fallbackTitle?: string;
}

/**
 * 將一篇 legacy news 轉成 NewsContent（含 gallery style/block）。
 * - Markdown 由 htmlToMarkdown() 產出
 * - 本函式填入 NewsContent 核心欄位與 meta
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
  const defaultGalleryStyle = "grid-3";
  const galleryBlocks = buildGalleryBlocks(galleryImages);

  const meta: NewsMeta = {
    ct_collection_key: undefined,
    ct_collection_order: undefined,
    default_gallery_style: defaultGalleryStyle,
    ct_news_date: parsed.newsDate,
    ct_event_date_start: parsed.eventDateStart,
    ct_event_date_end: parsed.eventDateEnd,
    ct_event_date_raw: parsed.eventDateRaw,
    ct_event_date_range: parsed.eventDateRange,
    ct_event_location: parsed.eventLocation,
    ct_event_location_raw: parsed.eventLocationRaw,
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
    gallery_blocks: galleryBlocks,
    meta,
  };

  return news;
}

interface ParsedNewsDateLocation {
  newsDate: string | null;
  eventDateStart: string | null;
  eventDateEnd: string | null;
  eventDateRaw: string | null;
  eventDateRange?: { start: string | null; end: string | null; raw: string | null };
  eventLocation: string | null;
  eventLocationRaw: string | null;
}

function parseNewsDateAndLocationFromHtml(html: string): ParsedNewsDateLocation {
  const text = html
    .replace(/<script[^>]*>.*?<\/script>/gis, " ")
    .replace(/<style[^>]*>.*?<\/style>/gis, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ");
  const normalized = text.replace(/\s+/g, " ").trim();

  // 優先抓「日期：...」段落（可能含區間）
  const dateFieldMatch = normalized.match(/日期[:：]\s*([^；，。、\s][^；，。]*)/);
  const dateFieldRaw = dateFieldMatch ? dateFieldMatch[1].trim() : null;
  const range = parseDateRange(dateFieldRaw ?? "");

  // 若仍無日期，再嘗試第一個日期 token（含 ROC）
  let fallbackStart: string | null = range.start;
  if (!fallbackStart) {
    const tokenMatch = normalized.match(
      /(\d{4}[./-]\d{1,2}[./-]\d{1,2}|民國\s*\d{2,3}[年./-]\d{1,2}[月./-]\d{1,2})/,
    );
    if (tokenMatch) {
      fallbackStart = parseDateToken(tokenMatch[1]);
      if (fallbackStart && !range.raw) {
        range.raw = tokenMatch[1];
      }
    }
  }

  const eventDateStart = range.start ?? fallbackStart;
  const eventDateEnd = range.end;
  const eventDateRaw = range.raw ?? null;
  const newsDate = eventDateStart;

  const locationRegex = /(地點|地点)[:：]\s*([^;，。、\s]+)/;
  const locationMatch = normalized.match(locationRegex);

  let eventLocation: string | null = null;
  let eventLocationRaw: string | null = null;
  if (locationMatch) {
    const locRaw = locationMatch[2].trim();
    eventLocationRaw = locRaw || null;
    eventLocation = locRaw.split(/[\s\u3000]+/)[0] || null;
  }

  return {
    newsDate,
    eventDateStart,
    eventDateEnd,
    eventDateRaw,
    eventDateRange: { start: eventDateStart, end: eventDateEnd, raw: eventDateRaw },
    eventLocation,
    eventLocationRaw,
  };
}

function buildGalleryBlocks(
  galleryItems: Array<{ src: string; alt?: string | null; caption?: string | null }>,
) {
  if (!galleryItems.length) return undefined;
  return [
    {
      id: "main_gallery",
      style: null,
      image_indexes: galleryItems.map((_, index) => index),
    },
  ];
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
