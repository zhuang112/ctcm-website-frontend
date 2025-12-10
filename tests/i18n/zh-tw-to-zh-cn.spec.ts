import { describe, it, expect } from "vitest";
import { convertToZhCn } from "../../src/i18n/zh-tw-to-zh-cn";

describe("convertToZhCn", () => {
  it("converts Traditional Chinese (TW) text to Simplified Chinese", () => {
    const input = "臺灣佛教";
    const output = convertToZhCn(input);
    expect(output).not.toBe(input);
    expect(output).toContain("台湾");
  });

  it("returns empty string as-is", () => {
    expect(convertToZhCn("")).toBe("");
  });
});
