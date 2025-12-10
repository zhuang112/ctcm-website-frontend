import * as OpenCC from "opencc-js";

// Initialize once to avoid recreating converters
const converter = OpenCC.Converter({ from: "tw", to: "cn" });

/**
 * Convert Traditional Chinese (TW) text to Simplified Chinese (CN).
 * Keeps falsy inputs unchanged to avoid surprising null/undefined handling.
 */
export function convertToZhCn(text: string): string {
  if (!text) return text;
  return converter(text);
}
