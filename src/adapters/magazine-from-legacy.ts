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

  const meta: MagazineMeta = {
    ct_collection_key: undefined,
    ct_collection_order: undefined,
    ct_magazine_level: "issue",
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
