// news 轉換：將 legacy HTML 轉為 NewsContent（AnyContent 的 news 結構）
// 對應：docs/CONTENT_SCHEMA_V1.md § news、docs/HTML_TO_MARKDOWN_RULES_V4.md 共用規則

import { htmlToMarkdown } from "../html/html-to-markdown";
import type {
  HtmlToMarkdownOptions,
  LegacyHtmlDocument,
} from "../html/legacy-html-types";
import type { Language } from "../types/anycontent-teaching";
import type { NewsContent, NewsMeta } from "../types/anycontent-news";

export interface NewsFromLegacyOptions extends HtmlToMarkdownOptions {
  /** 指派給這篇內容的 external_id（由外層流程決定）。 */
  externalId: string;
  /** 語言：預設以 zh-tw 為主，未來由 pipeline 產出 zh-cn 版本。 */
  language: Language;
  /** 若 HTML 沒有標題，可提供 fallback。 */
  fallbackTitle?: string;
}

/**
 * 將一篇 legacy news 頁面轉成 NewsContent（minimal v2）。
 * - Markdown 抽取由 htmlToMarkdown() 處理。
 * - 本函式負責填入 NewsContent 基本欄位與部分 meta。
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
  eventLocation: string | null;
  eventLocationRaw: string | null;
}

function parseNewsDateAndLocationFromHtml(html: string): ParsedNewsDateLocation {
  // T-0005 v1：固定抓常見「日期 / 地點」格式；若抓不到則為 null
  const text = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  const normalized = text.replace(/\s+/g, " ").trim();

  const dateRegex =
    /日期[:：]\s*([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})(?:\s*[~〜-]\s*([0-9]{4}-[0-9]{1,2}-[0-9]{1,2}))?/;
  const dateMatch = normalized.match(dateRegex);

  const locationRegex = /(地點|場地)[:：]\s*([^;，。、\s]+)/;
  const locationMatch = normalized.match(locationRegex);

  const newsDate = dateMatch ? dateMatch[1] : null;
  const eventDateStart = dateMatch ? dateMatch[1] : null;
  const eventDateEnd = dateMatch && dateMatch[2] ? dateMatch[2] : null;
  const eventDateRaw = dateMatch ? dateMatch[0].replace(/^日期[:：]\s*/, "").trim() : null;

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
