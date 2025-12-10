import { describe, it, expect } from "vitest";
import { transformAnycontentZhTwToZhCn } from "../../src/i18n/zh-tw-to-zh-cn-pipeline";

describe("transformAnycontentZhTwToZhCn", () => {
  it("converts whitelisted fields and updates language", () => {
    const input = {
      language: "zh-tw",
      post_title: "臺灣佛教",
      post_excerpt: "這是一段簡介",
      body_markdown: "正文內容：臺灣佛教",
      meta: {
        ct_speaker_name: "釋淨空",
        ct_location: "臺北講堂",
        count: 3,
      },
      seo: {
        meta_title: "SEO 標題：臺灣佛教",
        meta_description: "SEO 描述：臺灣佛教",
      },
    };

    const result = transformAnycontentZhTwToZhCn(input);

    expect(result.language).toBe("zh-cn");
    expect(result.post_title).not.toBe(input.post_title);
    expect(result.post_excerpt).not.toBe(input.post_excerpt);
    expect(result.body_markdown).not.toBe(input.body_markdown);
    expect(result.meta.ct_speaker_name).not.toBe(input.meta.ct_speaker_name);
    expect(result.meta.count).toBe(3);
    expect(result.seo.meta_title).not.toBe(input.seo.meta_title);
    expect(result.seo.meta_description).not.toBe(
      input.seo.meta_description,
    );
  });
});
