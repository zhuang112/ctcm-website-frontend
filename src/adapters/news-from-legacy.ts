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

  const meta: NewsMeta = {
    ct_collection_key: undefined,
    ct_collection_order: undefined,
    ct_news_date: null,
    ct_event_date_start: null,
    ct_event_date_end: null,
    ct_event_date_raw: null,
    ct_event_location: null,
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
    featured_image: mdResult.images[0]?.src ?? null,
    featured_image_caption: null,
    gallery_items: mdResult.images.slice(1).map((img) => ({
      url: img.src,
      alt: img.alt ?? null,
      caption: null,
    })),
    meta,
  };

  return news;
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
