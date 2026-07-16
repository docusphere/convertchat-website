import { describe, it, expect } from "vitest";
import { parseArticle } from "./article";

describe("parseArticle: core blocks", () => {
  it("parses paragraphs split on blank lines, joining soft wraps", () => {
    expect(parseArticle("One line\nwrapped.\n\nSecond para.")).toEqual([
      { type: "p", text: "One line wrapped." },
      { type: "p", text: "Second para." },
    ]);
  });

  it("parses h2 and h3", () => {
    expect(parseArticle("## Title\n\n### Sub")).toEqual([
      { type: "h2", text: "Title" },
      { type: "h3", text: "Sub" },
    ]);
  });

  it("parses unordered lists", () => {
    expect(parseArticle("- a\n- b")).toEqual([{ type: "ul", items: ["a", "b"] }]);
  });

  it("parses ordered lists", () => {
    expect(parseArticle("1. a\n2. b")).toEqual([{ type: "ol", items: ["a", "b"] }]);
  });
});

describe("parseArticle: tables and images", () => {
  it("parses GFM pipe tables", () => {
    const md = "| Tier | Limit |\n|---|---|\n| 1 | 1,000 |\n| 2 | 10,000 |";
    expect(parseArticle(md)).toEqual([
      {
        type: "table",
        header: ["Tier", "Limit"],
        rows: [
          ["1", "1,000"],
          ["2", "10,000"],
        ],
      },
    ]);
  });

  it("parses images with and without caption", () => {
    expect(parseArticle('![Alt text](/blog/x.webp "A caption")')).toEqual([
      { type: "image", alt: "Alt text", src: "/blog/x.webp", caption: "A caption" },
    ]);
    expect(parseArticle("![Alt](/blog/y.webp)")).toEqual([{ type: "image", alt: "Alt", src: "/blog/y.webp" }]);
  });
});

describe("parseArticle: directives", () => {
  it("parses chat blocks", () => {
    const md = ":::chat\ncustomer: Is the X200 in stock?\nai: Yes — 14 units. Want the link?\n:::";
    expect(parseArticle(md)).toEqual([
      {
        type: "chat",
        messages: [
          { from: "customer", text: "Is the X200 in stock?" },
          { from: "ai", text: "Yes — 14 units. Want the link?" },
        ],
      },
    ]);
  });

  it("parses quote, stat, callout, cta", () => {
    expect(parseArticle(":::quote\nMost bulk senders get banned because they deserve to.\n:::")).toEqual([
      { type: "quote", text: "Most bulk senders get banned because they deserve to." },
    ]);
    expect(parseArticle(":::stat\nvalue: 98%\nlabel: WhatsApp open rate\n:::")).toEqual([
      { type: "stat", value: "98%", label: "WhatsApp open rate" },
    ]);
    expect(parseArticle(":::callout warning\nNever buy contact lists.\n:::")).toEqual([
      { type: "callout", variant: "warning", text: "Never buy contact lists." },
    ]);
    expect(
      parseArticle(
        ":::cta\ntext: Ready to try it?\nbutton: Book a demo\nhref: https://cal.com/architct/onboarding\n:::",
      ),
    ).toEqual([
      { type: "cta", text: "Ready to try it?", button: "Book a demo", href: "https://cal.com/architct/onboarding" },
    ]);
  });

  it("keeps prose around directives intact", () => {
    const md = "Intro para.\n\n:::quote\nQ\n:::\n\nOutro para.";
    expect(parseArticle(md).map((b) => b.type)).toEqual(["p", "quote", "p"]);
  });
});

describe("parseArticle: edge cases (code-review regressions)", () => {
  it("does not misclassify a paragraph starting with a year as an ordered list", () => {
    expect(parseArticle("2025. Meta changed its API pricing model.")).toEqual([
      { type: "p", text: "2025. Meta changed its API pricing model." },
    ]);
  });

  it("still parses ordered lists that start at 1", () => {
    expect(parseArticle("1. first\n2. second")).toEqual([{ type: "ol", items: ["first", "second"] }]);
  });

  it("separates a heading from body text when no blank line follows", () => {
    expect(parseArticle("## Title\nBody text.")).toEqual([
      { type: "h2", text: "Title" },
      { type: "p", text: "Body text." },
    ]);
  });
});
