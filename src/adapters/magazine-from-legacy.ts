// magazine：legacy HTML → MagazineContent（AnyContent magazine）
// 對應：docs/CONTENT_SCHEMA_V1.md § magazine；docs/HTML_TO_MARKDOWN_RULES_V4.md 通用規則

import { htmlToMarkdown } from "../html/html-to-markdown";
import type {
  HtmlToMarkdownOptions,
  LegacyHtmlDocument,
} from "../html/legacy-html-types";
import type { Language } from "../types/anycontent-teaching";
import type { MagazineContent, MagazineMeta } from "../types/anycontent-magazine";
import { parseDateToken } from "../utils/parse-date";

export interface MagazineFromLegacyOptions extends HtmlToMarkdownOptions {
  externalId: string;
  language: Language;
  fallbackTitle?: string;
}

/**
 * 將一篇 legacy magazine 轉成 MagazineContent（含 gallery style/block）。
 */
export function magazineFromLegacy(
  doc: LegacyHtmlDocument,
  options: MagazineFromLegacyOptions,
): MagazineContent {
  const { externalId, language, fallbackTitle, ...markdownOptions } = options;

  const mdResult = htmlToMarkdown(doc, markdownOptions);

  const post_title = fallbackTitle ?? deriveTitleFromUrl(doc.url);
  const parsedMeta = parseMagazineMetaFromHtml(doc.html);
  const [firstImage, ...galleryImages] = mdResult.images;
  const defaultGalleryStyle = "grid-3";
  const galleryBlocks = buildGalleryBlocks(galleryImages);

  const meta: MagazineMeta = {
    ct_collection_key: undefined,
    ct_collection_order: undefined,
    default_gallery_style: defaultGalleryStyle,
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

function parseMagazineMetaFromHtml(html: string): ParsedMagazineMeta {
  const text = toHalfWidth(
    html
      .replace(/<script[^>]*>.*?<\/script>/gis, " ")
      .replace(/<style[^>]*>.*?<\/style>/gis, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

  const dateMatch = text.match(/出版日期[:：]?\s*([^\s，、]+)/);
  const issueMatch = text.match(/(期數|期別|期號|卷期|期)[:：]?\s*([^\r\n，、]+)/);

  const pubDateRaw = dateMatch ? dateMatch[1].trim() : null;
  const issueRaw = issueMatch ? issueMatch[2].trim() : null;
  const issueRawTrimmed = issueRaw ? issueRaw.match(/第\s*\d+\s*期/)?.[0] ?? issueRaw : null;

  return {
    issueRaw: issueRawTrimmed,
    issue: normalizeIssue(issueRawTrimmed),
    pubDateRaw,
    pubDate: normalizeDate(pubDateRaw),
  };
}

function toHalfWidth(input: string): string {
  return input.replace(/[Ａ-Ｚａ-ｚ０-９．：－／]/g, (ch) =>
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
  return (
    parseDateToken(normalized) ??
    parseDateToken(
      normalized.replace(/[年月日]/g, (c) => {
        if (c === "年" || c === "月") return "-";
        return "";
      }),
    )
  );
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
