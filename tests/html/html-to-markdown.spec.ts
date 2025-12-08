import { describe, expect, it } from "vitest";
import { htmlToMarkdown } from "../../src/html/html-to-markdown";
import { LegacyHtmlDocument } from "../../src/html/legacy-html-types";

// 注意：這裡使用的是「簡化版、但貼近 ctworld 結構」的 HTML 片段，
// 真正專案中可以再替換成實際抓下來的樣本。

describe("htmlToMarkdown", () => {
  it("converts simple heading and paragraph", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/example.htm",
      html: "<html><body><h1>測試標題</h1><p>這是一段內容。</p></body></html>",
    };

    const result = htmlToMarkdown(doc);

    expect(result.body_markdown).toContain("# 測試標題");
    expect(result.body_markdown).toContain("這是一段內容。");
  });

  it("collects images but does not embed them in markdown", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/sutra_stories/story148.htm",
      html: `
        <html>
          <body>
            <p>內文前。</p>
            <img src="/images/story148-1.jpg" alt="佛典故事" />
            <p>內文後。</p>
          </body>
        </html>
      `,
    };

    const result = htmlToMarkdown(doc);

    expect(result.images.length).toBe(1);
    expect(result.images[0]).toMatchObject({ src: expect.stringContaining("story148-1.jpg") });
    expect(result.body_markdown).not.toContain("![](");
  });

  it("collects anchors like item83 from name/id attributes", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/turn/sutra/example.htm",
      html: `
        <html>
          <body>
            <a name="item83" class="chinese">（八十三）</a>
            <p>某一段經文。</p>
          </body>
        </html>
      `,
    };

    const result = htmlToMarkdown(doc);

    expect(result.anchors).toContain("item83");
    expect(result.body_markdown).toContain("某一段經文。");
  });
});
