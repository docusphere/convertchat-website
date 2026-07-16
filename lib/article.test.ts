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
