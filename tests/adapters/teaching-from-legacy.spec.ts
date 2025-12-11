import { describe, expect, it } from "vitest";
import { teachingFromLegacy } from "../../src/adapters/teaching-from-legacy";
import type { LegacyHtmlDocument } from "../../src/html/legacy-html-types";

describe("teachingFromLegacy", () => {
  it("maps featured image, gallery items, gallery blocks, and default style", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org/turn/teaching/demo.htm",
      html: `
        <html>
          <body>
            <h1>示範教學</h1>
            <p><img src="/images/featured.jpg" alt="封面示例" />導讀段落</p>
            <p><img src="/images/gallery-1.jpg" alt="現場一" />第一張圖</p>
            <p><img src="/images/gallery-2.jpg" alt="現場二" />第二張圖</p>
          </body>
        </html>
      `,
    };

    const teaching = teachingFromLegacy(doc, {
      externalId: "teaching_demo_zh-tw",
      language: "zh-tw",
    });

    expect(teaching.featured_image).toContain("featured.jpg");
    expect(teaching.featured_image_caption).toBe("封面示例");
    expect(teaching.gallery_items).toHaveLength(2);
    expect(teaching.gallery_items[0]).toMatchObject({
      url: expect.stringContaining("gallery-1.jpg"),
      alt: "現場一",
      caption: "現場一",
    });
    expect(teaching.gallery_items[1]).toMatchObject({
      url: expect.stringContaining("gallery-2.jpg"),
      alt: "現場二",
      caption: "現場二",
    });
    expect(teaching.gallery_blocks).toEqual([
      { id: "main_gallery", style: null, image_indexes: [0, 1] },
    ]);
    expect(teaching.meta.default_gallery_style).toBe("grid-2");
  });

  it("maps verses from htmlToMarkdown into TeachingMeta dharma verse fields", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org/turn/sutra/example.htm",
      html: `
        <html>
          <body>
            <p class="word17-coffee">觀自在菩薩<br>行深般若波羅蜜多時</p>
          </body>
        </html>
      `,
    };

    const teaching = teachingFromLegacy(doc, {
      externalId: "teaching_sutra_example_zh-tw",
      language: "zh-tw",
    });

    expect(teaching.meta.ct_has_dharma_verse).toBe("yes");
    expect(teaching.meta.ct_verse_block_markdown).toBe(
      "> 觀自在菩薩 行深般若波羅蜜多時",
    );
    expect(teaching.meta.ct_verse_type).toBe("sutra");
    expect(teaching.meta.ct_verse_lang).toBe("zh-tw");
  });
});
