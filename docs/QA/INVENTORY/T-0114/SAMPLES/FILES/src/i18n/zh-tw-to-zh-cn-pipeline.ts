import { convertToZhCn } from "./zh-tw-to-zh-cn";

export interface ZhTwToZhCnTransformOptions {
  // 預留未來針對特定 post type 的自訂行為
}

/**
 * 將 AnyContent (zh-TW) 轉為 zh-CN：
 * - 僅轉換白名單欄位（title/excerpt/body_markdown、meta 文字欄位、SEO 文字欄位）
 * - 保留 id/slug/url/date/enum 等非文字欄位
 * - language 直接設為 zh-cn
 */
export function transformAnycontentZhTwToZhCn(
  input: any,
  _options: ZhTwToZhCnTransformOptions = {},
): any {
  const clone = globalThis.structuredClone
    ? globalThis.structuredClone(input)
    : JSON.parse(JSON.stringify(input));

  if (clone && typeof clone === "object" && clone.language === "zh-tw") {
    clone.language = "zh-cn";
  }

  // 主文欄位
  if (typeof clone?.post_title === "string") {
    clone.post_title = convertToZhCn(clone.post_title);
  }
  if (typeof clone?.post_excerpt === "string") {
    clone.post_excerpt = convertToZhCn(clone.post_excerpt);
  }
  if (typeof clone?.body_markdown === "string") {
    clone.body_markdown = convertToZhCn(clone.body_markdown);
  }

  // meta：轉換文字/文字陣列，跳過 id/url/date/slug 類欄位
  if (clone?.meta && typeof clone.meta === "object") {
    for (const key of Object.keys(clone.meta)) {
      const value = clone.meta[key];
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("id") ||
        lowerKey.includes("url") ||
        lowerKey.includes("slug") ||
        lowerKey.includes("date") ||
        lowerKey.includes("time")
      ) {
        continue;
      }
      if (typeof value === "string") {
        clone.meta[key] = convertToZhCn(value);
      } else if (Array.isArray(value)) {
        clone.meta[key] = value.map((item) =>
          typeof item === "string" ? convertToZhCn(item) : item,
        );
      }
    }
  }

  // SEO 欄位
  if (clone?.seo && typeof clone.seo === "object") {
    if (typeof clone.seo.meta_title === "string") {
      clone.seo.meta_title = convertToZhCn(clone.seo.meta_title);
    }
    if (typeof clone.seo.meta_description === "string") {
      clone.seo.meta_description = convertToZhCn(clone.seo.meta_description);
    }
  }

  return clone;
}
