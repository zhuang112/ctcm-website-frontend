import { describe, expect, it } from "vitest";
import { htmlToMarkdown } from "../../src/html/html-to-markdown";
import type { LegacyHtmlDocument } from "../../src/html/legacy-html-types";

// Basic regression tests for htmlToMarkdown to ensure images/anchors/verses stay aligned
describe("htmlToMarkdown", () => {
  it("converts simple heading and paragraph", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/example.htm",
      html: "<html><body><h1>示範標題</h1><p>這是一段示範文字</p></body></html>",
    };

    const result = htmlToMarkdown(doc);

    expect(result.body_markdown).toContain("# 示範標題");
    expect(result.body_markdown).toContain("這是一段示範文字");
  });

  it("collects images but does not embed them in markdown", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/sutra_stories/story148.htm",
      html: `
        <html>
          <body>
            <p>段落前</p>
            <img src="/images/story148-1.jpg" alt="封面圖" />
            <p>段落後</p>
          </body>
        </html>
      `,
    };

    const result = htmlToMarkdown(doc);

    expect(result.images.length).toBe(1);
    expect(result.images[0]).toMatchObject({
      src: expect.stringContaining("story148-1.jpg"),
      alt: "封面圖",
    });
    expect(result.body_markdown).not.toContain("![](");
  });

  it("collects anchors like item83 from name/id attributes", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/turn/sutra/example.htm",
      html: `
        <html>
          <body>
            <a name="item83" class="chinese">段落標記</a>
            <p>一般段落</p>
          </body>
        </html>
      `,
    };

    const result = htmlToMarkdown(doc);

    expect(result.anchors).toContain("item83");
    expect(result.body_markdown).toContain("一般段落");
  });

  it("applies sutra-specific rules for word17-coffee paragraphs and anchors", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/turn/sutra/example.htm",
      html: `
        <html>
          <body>
            <a name="item83" class="chinese">
              段落標記
            </a>
            <p class="word17-coffee">觀自在菩薩<br>行深般若波羅蜜多時</p>
          </body>
        </html>
      `,
    };

    const result = htmlToMarkdown(doc);

    expect(result.body_markdown).toContain("> 觀自在菩薩");
    expect(result.body_markdown).toContain("> 行深般若波羅蜜多時");

    // verses should be combined as a single line too
    const verses = result.verses ?? [];
    expect(verses.length).toBeGreaterThan(0);
    expect(verses[0]).toContain("觀自在菩薩");
    expect(verses[0]).toContain("行深般若波羅蜜多時");

    expect(result.anchors).toContain("item83");
    expect(result.body_markdown).toContain('<a id="item83"></a>');
  });
});
