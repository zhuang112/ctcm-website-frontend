import { describe, expect, it } from "vitest";
import { teachingFromLegacy } from "../../src/adapters/teaching-from-legacy";
import { LegacyHtmlDocument } from "../../src/html/legacy-html-types";

// teaching adapter 的基本行為測試：
// - 能呼叫 htmlToMarkdown 並產出 TeachingContent 結構。
// - featured_image 會取第一張圖片，其餘進 gallery_items。

describe("teachingFromLegacy", () => {
  it("builds a minimal TeachingContent from legacy HTML", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/sutra_stories/story148.htm",
      html: `
        <html>
          <body>
            <h1>佛典故事一四八</h1>
            <p>這是一段佛典故事的內容。</p>
            <img src="/images/story148-1.jpg" alt="佛典故事主圖" />
            <img src="/images/story148-2.jpg" alt="現場照片" />
          </body>
        </html>
      `,
    };

    const teaching = teachingFromLegacy(doc, {
      externalId: "teaching_story148_zh-tw",
      language: "zh-tw",
    });

    expect(teaching.post_type).toBe("teaching");
    expect(teaching.language).toBe("zh-tw");
    expect(teaching.old_url).toBe(doc.url);
    expect(teaching.body_markdown).toContain("這是一段佛典故事的內容。");
    expect(teaching.featured_image).toContain("story148-1.jpg");
    expect(teaching.gallery_items.length).toBe(1);
    expect(teaching.gallery_items[0].url).toContain("story148-2.jpg");
  });

  it("maps verses from htmlToMarkdown into TeachingMeta dharma verse fields", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/turn/sutra/example.htm",
      html: `
        <html>
          <body>
            <p class="word17-coffee">行一<br>行二</p>
          </body>
        </html>
      `,
    };

    const teaching = teachingFromLegacy(doc, {
      externalId: "teaching_sutra_example_zh-tw",
      language: "zh-tw",
    });

    expect(teaching.meta.ct_has_dharma_verse).toBe("yes");
    expect(teaching.meta.ct_verse_block_markdown).toBe("> 行一 行二");
    expect(teaching.meta.ct_verse_type).toBe("sutra");
    expect(teaching.meta.ct_verse_lang).toBe("zh-tw");
  });
});
