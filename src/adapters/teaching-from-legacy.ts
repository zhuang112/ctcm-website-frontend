// teaching 單元：從舊站 HTML 轉成 TeachingContent（AnyContent 的 teaching 變體）
// 對應：docs/CONTENT_SCHEMA.md §2.1 teaching、docs/HTML_TO_MARKDOWN_RULES_V4.md §5.1

import { htmlToMarkdown } from "../html/html-to-markdown";
import type { HtmlToMarkdownOptions, LegacyHtmlDocument } from "../html/legacy-html-types";
import type { Language, TeachingContent, TeachingMeta } from "../types/anycontent-teaching";

// TODO: 未來可將這些型別抽到 src/types/anycontent-teaching.ts，作為正式 schema 定義。

export interface TeachingFromLegacyOptions extends HtmlToMarkdownOptions {
  /**
   * 指派給這一篇內容的 external_id（由外層流程決定）。
   */
  externalId: string;
  /**
   * 語言碼，必須符合 docs/CONTENT_SCHEMA.md 中的 Language union。
   */
  language: Language;
  /**
   * 預設標題（若無法從 HTML 自動推斷時使用）。
   */
  fallbackTitle?: string;
}

/**
 * 將一篇舊站 teaching 類型 HTML 轉成 TeachingContent。
 *
 * - HTML→Markdown 的規則實作由 `htmlToMarkdown()` 負責。
 * - 本函式專注於：
 *   - 填入 TeachingContent 所需欄位（post_type/meta/圖片欄位等）。
 */
export function teachingFromLegacy(
  doc: LegacyHtmlDocument,
  options: TeachingFromLegacyOptions,
): TeachingContent {
  const { externalId, language, fallbackTitle, ...markdownOptions } = options;

  const mdResult = htmlToMarkdown(doc, markdownOptions);

  // TODO: 之後可依 HTML 結構與 rules 檔實作更精準的標題與 meta 解析。
  const post_title = fallbackTitle ?? deriveTitleFromUrl(doc.url);

  const verses = mdResult.verses ?? [];

  const teaching: TeachingContent = {
    external_id: externalId,
    language,
    post_type: "teaching",
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
    meta: buildTeachingMetaFromVerses(verses, language),
  };

  return teaching;
}

function buildTeachingMetaFromVerses(
  verses: string[],
  language: Language,
): TeachingMeta {
  const hasVerses = verses.length > 0;

  const base: TeachingMeta = {
    ct_collection_key: undefined,
    ct_collection_order: undefined,
    ct_speaker_name: null,
    ct_location: null,
    ct_event_date: null,
    ct_sutra_reference: null,
    ct_has_dharma_verse: "no",
    ct_verse_block_markdown: null,
    ct_verse_type: null,
    ct_verse_lang: null,
  };

  if (!hasVerses) {
    return base;
  }

  // 根據 PROJECT_TODO T-0001 規格：將 verses 映射到 TeachingMeta 偈語欄位
  const verseBlock = verses.map((line) => `> ${line}`).join("\n");

  return {
    ...base,
    ct_has_dharma_verse: "yes",
    ct_verse_block_markdown: verseBlock,
    ct_verse_type: "sutra",
    ct_verse_lang: language === "zh-tw" ? "zh-tw" : null,
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
