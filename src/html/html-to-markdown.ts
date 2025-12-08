import * as cheerio from "cheerio";
import type {
  HtmlImageInfo,
  HtmlToMarkdownOptions,
  HtmlToMarkdownResult,
  LegacyHtmlDocument,
} from "./legacy-html-types";

/**
 * 將舊站 HTML 轉成 Markdown + 基本結構資訊（圖片、anchors 等）。
 * 對應：docs/HTML_TO_MARKDOWN_RULES_V4.md 的通則部分。
 *
 * 注意：
 * - 此函式只負責產出 `body_markdown` + 基礎 `images/anchors/verses`，
 *   不直接決定 featured_image / gallery_items 等 AnyContent 欄位。
 */
export function htmlToMarkdown(
  doc: LegacyHtmlDocument,
  options: HtmlToMarkdownOptions = {},
): HtmlToMarkdownResult {
  const baseUrl = options.baseUrl ?? doc.url;

  const $ = cheerio.load(doc.html);

  // 1. 全域清理：移除明顯非主內容的元素（script/style/nav/footer/form 等）
  cleanupGlobal($);

  // 2. 取主內容根節點（暫時先用 <body>，未來可依 COMPLETE_PROJECT_WORKFLOW 拆成獨立模組）
  const $root = $("body");

  const images: HtmlImageInfo[] = [];
  const anchors: string[] = [];
  const verses: string[] = [];

  const isSutraPage = doc.url.includes("/turn/sutra/");

  if (isSutraPage) {
    preprocessSutraDom($, $root);
  }

  // 收集圖片與錨點
  collectImagesAndAnchors($, $root, baseUrl, images, anchors);

  const context: HtmlToMarkdownContext = {
    isSutraPage,
    verses,
  };

  // 3. 轉換為 Markdown 文字
  const lines: string[] = [];
  $root.children().each((_, el) => {
    const block = nodeToMarkdown($, el, context);
    if (block.trim().length > 0) {
      lines.push(block.trimEnd());
    }
  });

  const body_markdown = lines.join("\n\n").replace(/\n{3,}/g, "\n\n");

  const result: HtmlToMarkdownResult = {
    body_markdown,
    images,
    anchors,
    verses, // 規則來源：HTML_TO_MARKDOWN_RULES_V4.md § 經論講解（/turn/sutra/）
  };

  return result;
}

function cleanupGlobal($: cheerio.CheerioAPI): void {
  const selectorsToRemove = [
    "script",
    "style",
    "nav",
    "footer",
    "form",
    "noscript",
  ];
  $(selectorsToRemove.join(",")).remove();
}

function collectImagesAndAnchors(
  $: cheerio.CheerioAPI,
  $root: cheerio.Cheerio<any>,
  baseUrl: string,
  images: HtmlImageInfo[],
  anchors: string[],
): void {
  $root.find("img").each((_, img) => {
    const $img = $(img);
    const src = $img.attr("src");
    if (!src) return;

    const absSrc = toAbsoluteUrl(src, baseUrl);
    const alt = $img.attr("alt") ?? undefined;
    images.push({ src: absSrc, alt });

    // 不在此階段輸出 Markdown 圖片語法，僅收集資訊
    $img.remove();
  });

  $root.find("a[name], a[id]").each((_, a) => {
    const $a = $(a);
    const name = $a.attr("name");
    const id = $a.attr("id");
    const candidate = id || name;
    if (candidate && !anchors.includes(candidate)) {
      anchors.push(candidate);
    }
  });
}

function toAbsoluteUrl(href: string, baseUrl: string): string {
  try {
    const url = new URL(href, baseUrl);
    return url.toString();
  } catch {
    return href;
  }
}

interface HtmlToMarkdownContext {
  isSutraPage: boolean;
  verses: string[];
}

function nodeToMarkdown(
  $: cheerio.CheerioAPI,
  el: any,
  context: HtmlToMarkdownContext,
): string {
  const $el = $(el);
  const tag = el.tagName?.toLowerCase();

  if (!tag) {
    return textNodeToMarkdown($, el);
  }

  switch (tag) {
    case "h1":
      return "# " + inlineText($, $el) + "\n";
    case "h2":
      return "## " + inlineText($, $el) + "\n";
    case "h3":
      return "### " + inlineText($, $el) + "\n";
    case "h4":
      return "#### " + inlineText($, $el) + "\n";
    case "p": {
      if (context.isSutraPage && $el.hasClass("word17-coffee")) {
        // 規則來源：HTML_TO_MARKDOWN_RULES_V4.md § 經論講解（/turn/sutra/）
        const { lines, combinedText } = sutraParagraphToMarkdownLines($, $el);
        if (combinedText) {
          context.verses.push(combinedText);
        }
        if (!lines.length) {
          return "";
        }
        return lines.map((line) => `> ${line}`).join("\n");
      }
      return inlineText($, $el);
    }
    case "br":
      return "\n";
    case "a": {
      const id = $el.attr("id");
      const href = $el.attr("href");
      const text = inlineText($, $el);

      if (context.isSutraPage && id && !href) {
        // sutra 頁的段落錨點需在 markdown 中保留 id，並保留原本文字內容
        // 規則來源：HTML_TO_MARKDOWN_RULES_V4.md § 經論講解（/turn/sutra/）
        const anchorHtml = `<a id="${id}"></a>`;
        if (!text) {
          return anchorHtml;
        }
        return `${anchorHtml}${text}`;
      }

      if (href) {
        const label = text || href;
        return `[${label}](${href})`;
      }

      return text;
    }
    case "ul":
      return listToMarkdown($, $el, "unordered", context);
    case "ol":
      return listToMarkdown($, $el, "ordered", context);
    case "blockquote": {
      const inner = blockChildrenToMarkdown($, $el, context)
        .split("\n")
        .map((line) => (line.length ? "> " + line : ">"))
        .join("\n");
      return inner;
    }
    default:
      // 其他標籤：以其子元素的文字為主，略過標籤本身
      return blockChildrenToMarkdown($, $el, context);
  }
}

function textNodeToMarkdown($: cheerio.CheerioAPI, el: any): string {
  if (el.type === "text") {
    return (el.data ?? "").trim();
  }
  return $(el)
    .contents()
    .toArray()
    .map((child) => textNodeToMarkdown($, child))
    .join("");
}

function inlineText($: cheerio.CheerioAPI, $el: cheerio.Cheerio<any>): string {
  return $el
    .contents()
    .toArray()
    .map((child) => {
      if (child.type === "text") {
        return child.data ?? "";
      }
      const tag = (child as any).tagName?.toLowerCase();
      const $child = $(child);
      if (tag === "b" || tag === "strong" || $child.hasClass("wordstrong")) {
        return "**" + inlineText($, $child) + "**";
      }
      if (tag === "i" || tag === "em") {
        return "*" + inlineText($, $child) + "*";
      }
      return inlineText($, $child);
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function listToMarkdown(
  $: cheerio.CheerioAPI,
  $list: cheerio.Cheerio<any>,
  kind: "ordered" | "unordered",
  context: HtmlToMarkdownContext,
): string {
  const lines: string[] = [];
  let index = 1;
  $list.children("li").each((_, li) => {
    const content = blockChildrenToMarkdown($, $(li), context)
      .replace(/\n+/g, " ")
      .trim();
    if (!content) return;
    if (kind === "unordered") {
      lines.push("- " + content);
    } else {
      lines.push(`${index}. ${content}`);
      index += 1;
    }
  });
  return lines.join("\n");
}

function blockChildrenToMarkdown(
  $: cheerio.CheerioAPI,
  $el: cheerio.Cheerio<any>,
  context: HtmlToMarkdownContext,
): string {
  const parts: string[] = [];
  $el.contents().each((_, child) => {
    if (child.type === "text") {
      const text = (child.data ?? "").replace(/\s+/g, " ").trim();
      if (text) parts.push(text);
    } else {
      parts.push(nodeToMarkdown($, child as any, context));
    }
  });
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function preprocessSutraDom(
  $: cheerio.CheerioAPI,
  $root: cheerio.Cheerio<any>,
): void {
  // 規則來源：HTML_TO_MARKDOWN_RULES_V4.md § 經論講解（/turn/sutra/）
  // 1. 正規化段落錨點：優先使用 id，避免 name/id 重複收集
  $root.find("a[name]").each((_, a) => {
    const $a = $(a);
    const name = $a.attr("name");
    const existingId = $a.attr("id");
    if (name && !existingId) {
      $a.attr("id", name);
    }
    $a.removeAttr("name");
  });
}

function sutraParagraphToMarkdownLines(
  $: cheerio.CheerioAPI,
  $el: cheerio.Cheerio<any>,
): { lines: string[]; combinedText: string } {
  const rawLines: string[] = [];
  let current = "";

  $el.contents().each((_, child) => {
    if (child.type === "text") {
      current += child.data ?? "";
      return;
    }

    const tag = (child as any).tagName?.toLowerCase();
    if (tag === "br") {
      const trimmed = current.replace(/\s+/g, " ").trim();
      if (trimmed) {
        rawLines.push(trimmed);
      }
      current = "";
      return;
    }

    const $child = $(child as any);
    current += inlineText($, $child);
  });

  const last = current.replace(/\s+/g, " ").trim();
  if (last) {
    rawLines.push(last);
  }

  const lines = rawLines
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0);

  const combinedText = lines.join(" ");

  return { lines, combinedText };
}
