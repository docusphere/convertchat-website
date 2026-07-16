# Blog Content Wave 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the blog article renderer plus 7 SEO commodity guides (en + es = 14 MDX posts) per the approved spec `docs/superpowers/specs/2026-07-16-blog-content-design.md`.

**Architecture:** MDX files are raw strings (webpack `asset/source` / turbopack `raw-loader` — NO MDX compilation). A pure parser (`lib/article.ts`) tokenizes markdown + `:::` directive blocks into typed blocks; a server component (`components/blog/blog-article.tsx`) renders them with design-system components. Content is produced through a fixed pipeline: SERP check → outline → draft → humanizer subagent pass → Frank review → commit.

**Tech Stack:** Next.js 16 (App Router), Tailwind v4, next-intl, gray-matter, vitest (new devDep, parser tests only), DataForSEO REST API (SERP checks), Playwright MCP (visual verification + OG generation).

**Non-negotiable project rules (from CLAUDE.md / memory):**
- NEVER auto-commit. Every commit in this plan happens only after Frank's explicit sign-off for content, or after green verification for infra tasks — and even then, ask Frank before the first commit of each phase.
- Prettier has no repo config. Always run: `npx prettier --write --print-width 120 --semi --no-single-quote --trailing-comma all <files>` — and ONLY on `.ts`/`.tsx` files. NEVER run prettier on `.mdx` (its mdx parser will mangle `:::` directives).
- No new fonts. Serif = Newsreader (`font-serif`), body = Satoshi (default), stats = Clash Display (`font-heading`, see `components/sections/messaging-stat-section.tsx` for usage).
- `rounded-xl` = 24px in this theme (overridden), not 12px.
- All user-facing UI strings via next-intl — but MDX post content is inherently per-locale, so prose lives in the MDX files themselves (this is the existing blog/legal pattern).
- Dev server runs on port 3002 (`npm run dev` — 3000/3001 belong to other projects).
- Full-page Playwright screenshots show SectionReveal sections empty — blog pages don't use SectionReveal, but still scroll elements into view before screenshotting.

---

## File structure

**Phase 0 (renderer + SEO wiring):**
- Create: `lib/article.ts` — pure parser: `parseArticle(content: string): ArticleBlock[]` + `renderInline` stays OUT of here (parser is React-free)
- Create: `lib/article.test.ts` — vitest tests for the parser
- Create: `components/blog/blog-article.tsx` — block renderer (server component; owns inline markdown rendering)
- Create: `components/blog/chat-mockup.tsx` — static WhatsApp bubbles
- Create: `components/blog/cta-block.tsx` — mid/end article CTA
- Modify: `app/[locale]/blog/[slug]/page.tsx` — swap raw-text div for `<BlogArticle>`
- Modify: `lib/blog.ts` — add optional `image` + `updated` to `BlogPost`
- Modify: `lib/seo.ts` — `blogPostMetadata` accepts optional `image`
- Modify: `lib/schema.ts` — `blogPostingSchema` emits `image` + `dateModified`
- Modify: `package.json` — add `vitest` devDep + `test` script
- Create: `scripts/og-blog.html` — branded hero/OG template (1200×630)

Small single-purpose components (`ArticleImage`, `PullQuote`, `StatHighlight`, `Callout`) live inside `blog-article.tsx` — they are 5–15 lines each and only used there. `ChatMockup` and `CtaBlock` get their own files (bigger, and CtaBlock reuses `Button`).

**Phases 1–3 (per post, ×7):**
- Create: `content/blog/en/<en-slug>.mdx` + `content/blog/es/<es-slug>.mdx`
- Create: `public/og/blog/<en-slug>.png` + `public/og/blog/<es-slug>.png` (branded hero, doubles as OG)
- Modify: `lib/blog.ts` (2 imports + 2 registry entries), `lib/blog-slugs.ts` (1 pair)

---

## Phase 0 — Article renderer + SEO wiring (wave 1a prerequisite)

### Task 1: Vitest setup + parser core (headings, paragraphs, lists)

**Files:**
- Modify: `package.json`
- Create: `lib/article.ts`
- Create: `lib/article.test.ts`

- [ ] **Step 1: Install vitest**

```bash
npm install -D vitest
```

Then add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write failing tests for the block core**

`lib/article.test.ts`:

```ts
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `parseArticle` not defined / module not found.

- [ ] **Step 4: Implement the parser core**

`lib/article.ts` (React-free — no JSX, no imports from components):

```ts
// Parses the blog article dialect: markdown subset (h2/h3, paragraphs, ul/ol,
// GFM tables, images) plus ::: directive blocks (chat, quote, stat, callout,
// cta). Inline formatting (**bold**, *italic*, `code`, [links]) is rendered by
// components/blog/blog-article.tsx — this module only tokenizes blocks.

export type ChatMessage = { from: "customer" | "biz" | "ai"; text: string };

export type ArticleBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "chat"; messages: ChatMessage[] }
  | { type: "quote"; text: string }
  | { type: "stat"; value: string; label: string }
  | { type: "callout"; variant: "tip" | "warning"; text: string }
  | { type: "cta"; text: string; button: string; href: string };

export function parseArticle(content: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  // Split into raw chunks: ::: directives are multi-line and may contain blank
  // lines, so extract them first, then split the rest on blank lines.
  const chunks = splitChunks(content);
  for (const chunk of chunks) {
    const block = parseChunk(chunk);
    if (block) blocks.push(block);
  }
  return blocks;
}

function splitChunks(content: string): string[] {
  const lines = content.split("\n");
  const chunks: string[] = [];
  let current: string[] = [];
  let inDirective = false;

  const flush = () => {
    const text = current.join("\n").trim();
    if (text) chunks.push(text);
    current = [];
  };

  for (const line of lines) {
    if (line.trimEnd().startsWith(":::")) {
      if (!inDirective) {
        flush();
        inDirective = true;
        current.push(line);
      } else {
        current.push(line);
        inDirective = false;
        flush();
      }
    } else if (!inDirective && line.trim() === "") {
      flush();
    } else {
      current.push(line);
    }
  }
  flush();
  return chunks;
}

function parseChunk(chunk: string): ArticleBlock | null {
  if (chunk.startsWith(":::")) return parseDirective(chunk);
  if (chunk.startsWith("### ")) return { type: "h3", text: chunk.slice(4).trim() };
  if (chunk.startsWith("## ")) return { type: "h2", text: chunk.slice(3).trim() };

  const lines = chunk.split("\n").map((l) => l.trim());

  const image = chunk.match(/^!\[(.*?)\]\((\S+?)(?:\s+"(.+?)")?\)$/);
  if (image) return { type: "image", alt: image[1], src: image[2], caption: image[3] };

  if (lines.every((l) => l.startsWith("- "))) {
    return { type: "ul", items: lines.map((l) => l.slice(2)) };
  }
  if (lines.every((l) => /^\d+\.\s/.test(l))) {
    return { type: "ol", items: lines.map((l) => l.replace(/^\d+\.\s/, "")) };
  }
  if (lines.length >= 2 && lines.every((l) => l.startsWith("|")) && /^\|[\s:|-]+\|$/.test(lines[1])) {
    const parseRow = (l: string) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
    return { type: "table", header: parseRow(lines[0]), rows: lines.slice(2).map(parseRow) };
  }

  return { type: "p", text: lines.join(" ") };
}

function parseDirective(chunk: string): ArticleBlock | null {
  const lines = chunk.split("\n");
  const [, name, arg] = lines[0].trim().match(/^:::(\w+)(?:\s+(.*))?$/) ?? [];
  const body = lines.slice(1, -1).join("\n").trim();
  const bodyLines = body.split("\n").map((l) => l.trim()).filter(Boolean);

  switch (name) {
    case "quote":
      return { type: "quote", text: body };
    case "chat": {
      const messages: ChatMessage[] = [];
      for (const line of bodyLines) {
        const m = line.match(/^(customer|biz|ai):\s*(.+)$/);
        if (m) messages.push({ from: m[1] as ChatMessage["from"], text: m[2] });
      }
      return { type: "chat", messages };
    }
    case "stat": {
      const value = bodyLines.find((l) => l.startsWith("value:"))?.slice(6).trim() ?? "";
      const label = bodyLines.find((l) => l.startsWith("label:"))?.slice(6).trim() ?? "";
      return { type: "stat", value, label };
    }
    case "callout":
      return { type: "callout", variant: arg === "warning" ? "warning" : "tip", text: body };
    case "cta": {
      const get = (key: string) => bodyLines.find((l) => l.startsWith(`${key}:`))?.slice(key.length + 1).trim() ?? "";
      return { type: "cta", text: get("text"), button: get("button"), href: get("href") };
    }
    default:
      return null;
  }
}
```

- [ ] **Step 5: Run tests — core tests pass**

Run: `npm test`
Expected: PASS (4 tests).

- [ ] **Step 6: Prettier + typecheck + commit**

```bash
npx prettier --write --print-width 120 --semi --no-single-quote --trailing-comma all lib/article.ts lib/article.test.ts
npm run typecheck
git add package.json package-lock.json lib/article.ts lib/article.test.ts
git commit -m "feat: blog article parser core + vitest"
```

### Task 2: Parser — tables, images, directives (tests)

The implementation from Task 1 already covers these; this task locks them with tests (write tests, confirm green, fix parser where red).

**Files:**
- Modify: `lib/article.test.ts`
- Modify (if red): `lib/article.ts`

- [ ] **Step 1: Add tests**

Append to `lib/article.test.ts`:

```ts
describe("parseArticle: tables and images", () => {
  it("parses GFM pipe tables", () => {
    const md = "| Tier | Limit |\n|---|---|\n| 1 | 1,000 |\n| 2 | 10,000 |";
    expect(parseArticle(md)).toEqual([
      { type: "table", header: ["Tier", "Limit"], rows: [["1", "1,000"], ["2", "10,000"]] },
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
    expect(parseArticle(":::cta\ntext: Ready to try it?\nbutton: Book a demo\nhref: https://cal.com/architct/onboarding\n:::")).toEqual([
      { type: "cta", text: "Ready to try it?", button: "Book a demo", href: "https://cal.com/architct/onboarding" },
    ]);
  });

  it("keeps prose around directives intact", () => {
    const md = "Intro para.\n\n:::quote\nQ\n:::\n\nOutro para.";
    expect(parseArticle(md).map((b) => b.type)).toEqual(["p", "quote", "p"]);
  });
});
```

- [ ] **Step 2: Run tests; fix parser if any fail**

Run: `npm test`
Expected: PASS (all). If red: fix `lib/article.ts` minimally, re-run.

- [ ] **Step 3: Commit**

```bash
git add lib/article.test.ts lib/article.ts
git commit -m "test: article parser tables, images, directives"
```

### Task 3: ChatMockup + CtaBlock components

**Files:**
- Create: `components/blog/chat-mockup.tsx`
- Create: `components/blog/cta-block.tsx`
- Reference (read first): `components/sections/ai-agent-chat.tsx:98-125` (bubble styles), `components/ui/button.tsx`

- [ ] **Step 1: ChatMockup**

Static server component (NO framer-motion, no "use client"). Reuse the exact bubble visual language from `ai-agent-chat.tsx`:
- Container: `rounded-2xl bg-neutral-100 p-5 md:p-6`, messages in `flex flex-col gap-2`, `max-w-md mx-auto` so it reads as a phone-width chat inside the article column. `aria-hidden` NOT set (content is real copy, e.g. templates in post 5 — must be readable/copyable).
- `customer` bubble: `max-w-[82%] self-start rounded-2xl rounded-tl-sm bg-white px-3 py-2` + `text-[13px] leading-[1.45] text-neutral-900` + subtle border `border border-neutral-200`.
- `biz` bubble: `max-w-[82%] self-end rounded-2xl rounded-tr-sm bg-green-600 px-3 py-2 text-white`.
- `ai` bubble: same as `biz` plus the Bot badge (copy `AiBadge` from ai-agent-chat: `Bot` icon from lucide-react, label hardcoded prop with default "AI"; pass `label` per-locale via a prop from BlogArticle — default "AI Agent" (en) is fine for both locales, keep simple: label prop defaults to `"AI"`).

```tsx
import { Bot } from "lucide-react";
import type { ChatMessage } from "@/lib/article";

export function ChatMockup({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="mx-auto my-10 w-full max-w-md rounded-2xl bg-neutral-100 p-5 md:p-6">
      <div className="flex flex-col gap-2">
        {messages.map((m, i) =>
          m.from === "customer" ? (
            <div key={i} className="max-w-[82%] self-start rounded-2xl rounded-tl-sm border border-neutral-200 bg-white px-3 py-2">
              <p className="text-[13px] leading-[1.45] text-neutral-900">{m.text}</p>
            </div>
          ) : (
            <div key={i} className="max-w-[82%] self-end rounded-2xl rounded-tr-sm bg-green-600 px-3 py-2">
              {m.from === "ai" && (
                <span className="mb-1 inline-flex items-center gap-1 rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold text-white/70">
                  <Bot size={10} />
                  AI
                </span>
              )}
              <p className="text-[13px] leading-[1.45] text-white">{m.text}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: CtaBlock**

Read `components/ui/button.tsx` first and reuse it if it accepts `asChild`/href; otherwise style an `<a>` with the same classes. Layout: dark card `rounded-2xl bg-neutral-900 p-8 text-center` (site's dark-card emphasis pattern) wrapped in `RainbowBorder` (`components/ui/rainbow-border.tsx` — Frank's request: rainbow accents keep articles fun; respect the hug rule: outer radius = child radius + padding, and remember `rounded-2xl` is theme-overridden — getComputedStyle if unsure). Outer wrapper `my-10`. Text in `font-serif text-2xl text-white`, button below (`mt-5`). External href (cal.com) gets `target="_blank" rel="noopener"`; internal hrefs (starting `/`) render a plain `<a>` (MDX authors write locale-correct paths).

- [ ] **Step 3: Typecheck, prettier, commit**

```bash
npx prettier --write --print-width 120 --semi --no-single-quote --trailing-comma all components/blog/chat-mockup.tsx components/blog/cta-block.tsx
npm run typecheck
git add components/blog/
git commit -m "feat: ChatMockup + CtaBlock blog components"
```

### Task 4: BlogArticle renderer + page wiring

**Files:**
- Create: `components/blog/blog-article.tsx`
- Modify: `app/[locale]/blog/[slug]/page.tsx:50` (replace the `whitespace-pre-line` div)
- Reference: `components/legal/legal-article.tsx` (inline renderer precedent)

- [ ] **Step 1: BlogArticle component**

Server component. Maps `parseArticle(content)` output to JSX. Inline renderer: extend the `legal-article.tsx` approach to handle, in order: `[text](href)` links, `**bold**`, `*italic*`, `` `code` ``. Implementation guidance: process links first (split on `\[([^\]]+)\]\(([^)]+)\)`), then bold/italic/code inside plain fragments. Links: internal (`/...`) = plain `<a>` with `text-primary-700 underline decoration-primary-700/30 underline-offset-2 hover:decoration-primary-700`; external = same + `target="_blank" rel="noopener noreferrer"`.

Block styles (design system, match legal-article + homepage):
- `h2`: `mt-14 font-serif text-2xl md:text-3xl font-normal tracking-[-0.02em] text-neutral-800`
- `h3`: `mt-10 font-serif text-xl font-normal tracking-[-0.02em] text-neutral-800`
- `p`: `mt-5 text-[15px] md:text-base leading-relaxed text-neutral-600`
- `ul`/`ol`: `mt-4 list-disc pl-5 space-y-2 text-[15px] leading-relaxed text-neutral-600 marker:text-neutral-300` (ol: `list-decimal`)
- `table`: wrapper `mt-8 overflow-x-auto rounded-2xl border border-neutral-200`; `<table class="w-full text-left text-sm">`; `thead` `bg-neutral-50 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500`; cells `px-4 py-3`; body rows `border-t border-neutral-100 text-neutral-600`. Tables MUST scroll horizontally at 320px, never overflow the page (known 320px overflow bug elsewhere — do not add another).
- `image` (`ArticleImage`, local subcomponent): `<figure class="my-10">` + `<img>` `rounded-2xl w-full` + `loading="lazy"` + optional `<figcaption class="mt-3 text-center text-sm text-neutral-400">`
- `quote` (`PullQuote`): `my-10 border-l-2 border-primary-600 pl-6 font-serif text-2xl md:text-[28px] leading-snug tracking-[-0.02em] text-neutral-800`
- `stat` (`StatHighlight`): Frank's request — reuse the landing-page stats treatment (dark card + green gradient Clash Display number, see homepage stats section screenshot vibe). Dark card `my-10 rounded-2xl bg-neutral-950 px-6 py-10 text-center`; value in `font-heading font-semibold text-6xl md:text-7xl tracking-[-0.02em]` with the SAME green gradient text classes as `components/sections/messaging-stat-section.tsx` (read it first and copy the exact gradient/`bg-clip-text` classes); label `mt-3 text-sm text-neutral-400`
- `callout`: `my-8 rounded-2xl border px-5 py-4 text-[15px] leading-relaxed` — tip: `border-neutral-200 bg-neutral-50 text-neutral-600`; warning: `border-amber-200 bg-amber-50 text-amber-900`. Prefix with a lucide icon (`Lightbulb` / `TriangleAlert`, size 16, inline-block).
- `chat` → `<ChatMockup>`, `cta` → `<CtaBlock>`

- [ ] **Step 2: Wire into the post page**

In `app/[locale]/blog/[slug]/page.tsx` replace:

```tsx
<div className="prose mt-12 max-w-none whitespace-pre-line text-neutral-600">{post.content}</div>
```

with:

```tsx
<BlogArticle content={post.content} />
```

(`BlogArticle` renders its own `mt-12` wrapper.) Remove the unused `prose` class approach entirely.

- [ ] **Step 3: Verify with the existing welcome post + a scratch fixture**

Temporarily append a kitchen-sink section (heading, list, table, chat, quote, stat, callout, cta, image) to `content/blog/en/welcome.mdx`, run `npm run dev`, open `http://localhost:3002/blog/welcome`. Screenshot with Playwright MCP at 320px, 375px and 1280px. Verify: no horizontal overflow at 320px; typography matches the site. Then REVERT welcome.mdx to its original content.

- [ ] **Step 4: Typecheck, build, commit**

```bash
npm run typecheck && npm run build
git add components/blog/blog-article.tsx "app/[locale]/blog/[slug]/page.tsx"
git commit -m "feat: blog article renderer (markdown subset + directives)"
```

### Task 5: Frontmatter `image` + `dateModified` SEO wiring

**Files:**
- Modify: `lib/blog.ts` (BlogPost type + parseFrontmatter)
- Modify: `lib/seo.ts:76-97` (blogPostMetadata)
- Modify: `lib/schema.ts:37-48` (blogPostingSchema)
- Modify: `app/[locale]/blog/[slug]/page.tsx` (pass image through generateMetadata)

- [ ] **Step 1: BlogPost type**

In `lib/blog.ts` add to `BlogPost`: `image: string;` (empty string when absent) and `updated: string;`. In `parseFrontmatter`: `image: data.image || ""`, `updated: data.updated ? String(data.updated) : (data.date ? String(data.date) : "")`.

- [ ] **Step 2: blogPostMetadata image override**

In `lib/seo.ts`, extend the opts type with `image?: string` and in `openGraph.images` use the per-post image when provided:

```ts
images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : ogImage(locale),
```

- [ ] **Step 3: blogPostingSchema**

In `lib/schema.ts` add to the returned object:

```ts
...(post.image ? { image: `${BASE_URL}${post.image}` } : {}),
...(post.updated ? { dateModified: post.updated } : {}),
```

- [ ] **Step 4: Pass through the page**

In `app/[locale]/blog/[slug]/page.tsx` `generateMetadata`, add `image: post.image || undefined` to the `blogPostMetadata` call.

- [ ] **Step 4b: Visible hero on the article page**

The branded hero is visible on-page, not OG-only. In the same file, render between the author line and `<BlogArticle>`, only when `post.image` is set:

```tsx
{post.image && <img src={post.image} alt={post.title} className="mt-10 w-full rounded-2xl" />}
```

(1200×630 branded card, already sized for the 768px article column; welcome post has no image → nothing renders.)

- [ ] **Step 5: Verify + commit**

Run: `npm run typecheck && npm test && npm run build`
Expected: all green (welcome post has no `image` — falls back to locale OG, JSON-LD omits image).

```bash
git add lib/blog.ts lib/seo.ts lib/schema.ts "app/[locale]/blog/[slug]/page.tsx"
git commit -m "feat: per-post OG image + dateModified in blog metadata/JSON-LD"
```

This closes the scratchpad SEO minor "BlogPosting image/dateModified".

### Task 6: OG/hero template

**Files:**
- Create: `scripts/og-blog.html`

- [ ] **Step 1: Build the template**

Single static HTML file, 1200×630 fixed canvas, styled to match `public/og/og-en.png` (open it first with Read to copy the visual: logo placement, background, type). Layout: ConvertChat logo top-left (`../public/logo-full-color.png` — relative from `scripts/`, since the template opens as `file://`), post title (large serif, Georgia fallback is fine for a screenshot template — or load Newsreader from Google Fonts in the template), small "convertchat.co/blog" bottom-left, brand accent element (rainbow gradient bar or purple accent). Title text injected by editing a single `<h1 id="title">` before screenshot.

- [ ] **Step 2: Document generation workflow (comment at top of the html)**

Per post: edit `<h1>` text → open `file://…/scripts/og-blog.html` in Playwright MCP browser → `browser_resize` 1200×630 → `browser_take_screenshot` → save to `public/og/blog/<slug>.png`. Verify the PNG is <300KB (og images are fetched by scrapers, size matters less than body images — no WebP, OG scrapers prefer PNG/JPEG).

- [ ] **Step 3: Generate a test image, verify visually, commit template only**

```bash
git add scripts/og-blog.html
git commit -m "feat: blog OG/hero template"
```

**CHECKPOINT — Phase 0 done.** Renderer, SEO wiring and OG template exist; all tests + build green. Show Frank the kitchen-sink screenshots before starting content.

---

## Post production pipeline (used by every post task in phases 1–3)

Each "Produce post N" task runs these steps. Post-specific inputs (slugs, keywords, outline, images, links) are in the spec §"The 7 posts" — treat the spec as the source of truth for content requirements.

**P1 — SERP check.** Query DataForSEO SERP API for the post's primary keyword, top 10, in the relevant markets (EN: location_code 2840 US + 2826 UK; ES: 2724 Spain). Use Bash + python urllib with Basic auth (credentials in `~/.claude.json` under the dataforseo MCP env — read them from there; NEVER print the password). Endpoint: `POST https://api.dataforseo.com/v3/serp/google/organic/live/regular` with `[{"keyword": "...", "location_code": 2840, "language_code": "en", "depth": 10}]`. Cost ~$0.002/query. Record: what the top 10 answer, their format (listicle/guide/docs), and the gap we exploit (compliance depth / honest comparison / copy-paste assets).

**P2 — Outline.** Adapt the spec outline to the SERP findings. Must answer everything the top 10 answer + beat them on ≥1 axis. Confirm length target (spokes 1,200–1,800 words; pillar 2,000–2,500).

**P3 — Draft (en, then es).** Write the MDX. Rules:
- Frontmatter: `title`, `description` (≤155 chars, includes primary keyword), `date` (ship date), `author: "ConvertChat Team"`, `tags` (per cluster), `image: "/og/blog/<slug>.png"`.
- Voice guide (spec §Editorial pipeline): practitioner tone, second person (tú in es), short declaratives mixed with long, opinions encouraged, banned words ("revolutionary", "game-changing", "seamless", "unlock", "elevate"), every stat sourced-and-linked or cut, compliance-first, never teach spam mechanics.
- es version is a native adaptation against es keywords — not a translation. Localized examples (Spanish businesses, €).
- Visual rhythm: one visual element (table / `:::chat` / `:::quote` / `:::stat` / `:::callout` / image) every 300–400 words.
- Links: internal links are locale-correct absolute paths (en file: `/pricing`, `/blog/<en-slug>`; es file: `/es/precios`, `/es/blog/<es-slug>`). Exactly 1 in-prose money-page link; ≥1 sibling spoke; pillar link only once the pillar exists (wave 1a posts ship without it). Two `:::cta` blocks: one mid-article, one at the end (href: `https://cal.com/architct/onboarding` or the locale pricing path — whichever fits intent; CTA blocks don't count toward the money-link rule).
- Never contradict `/pricing` numbers or `docs/website-copy-positioning.md`.
- US restriction accuracy: any mention of marketing broadcasts must be consistent with the Meta US pause (spec §Target markets). Posts 3 and 4 REQUIRE an explicit US-pause section.

**P4 — Humanizer pass (fresh subagent, mandatory).** Dispatch a general-purpose subagent whose prompt contains ONLY: (1) instruction to invoke the `humanizer` skill, (2) the draft MDX body, (3) the voice guide bullet list from P3, (4) instruction to preserve frontmatter, directive blocks (`:::`), tables, and links EXACTLY — edit prose only — and return the full edited MDX. Never include this session's drafting context. Run once per language. For the FIRST post only (Task 7): diff before/after and show Frank the changes to calibrate; afterwards the pass runs silently.

**P5 — Wire in.**
1. Save `content/blog/en/<en-slug>.mdx` + `content/blog/es/<es-slug>.mdx`.
2. `lib/blog.ts`: add 2 imports + registry entries (en + es maps).
3. `lib/blog-slugs.ts`: append `{ en: "<en-slug>", es: "<es-slug>" }`.
4. Generate 2 OG images via the Task 6 workflow → `public/og/blog/<slug>.png` (localized titles).
5. `npx prettier --write --print-width 120 --semi --no-single-quote --trailing-comma all lib/blog.ts lib/blog-slugs.ts` (NOT the .mdx files).
6. `npm run typecheck && npm test && npm run build` — all green.

**P6 — Visual verification.** `npm run dev` (port 3002), open both URLs (`localhost:3002/blog/<en-slug>`, `localhost:3002/es/blog/<es-slug>`) with Playwright MCP; screenshot at 320 / 768 / 1280 scrolling through the article. Check: visual rhythm holds, tables don't overflow at 320, chat mockups render, word count in range (`wc -w` on the body).

**P7 — Frank review.** Hand Frank both URLs + 2–3 specific review points (claims accuracy, tone, CTA placement). Revise per comments. **Commit ONLY after Frank approves** — message: `feat: blog post <en-slug> (en+es)`.

---

## Phase 1 — Post 1 solo (calibration)

### Task 7: Produce post 1 — WhatsApp broadcast limits

Run the pipeline (P1–P7) with spec §post 1:
- Slugs: `whatsapp-broadcast-limits` / `limites-difusion-whatsapp`
- Primary keyword: "whatsapp broadcast limit" (SERP: US+UK; es seed: "difusion whatsapp limite" — verify best es phrasing with a keyword_suggestions call if unclear)
- Outline: limits by product (app / Business app / API) → why broadcasts don't arrive (saved-contact requirement, 256 cap) → limits comparison table → API messaging tiers → scaling without flags → FAQ
- Visuals: 1 comparison table (native), 1 `:::chat` (broadcast example), ≥1 `:::callout warning` (compliance), `:::stat` optional
- Links: sibling spokes don't exist yet → link `/pricing` (money) only; add sibling/pillar links in Task 15 retrofit
- **Extra for this task (calibration):** show Frank the humanizer before/after diff (P4) and the rendered pages; capture his tone feedback as edits to the voice guide bullets used in every later P3/P4

**CHECKPOINT — wave 1a calibration.** Do not start Task 8 until Frank has approved post 1 and the voice calibration is locked.

---

## Phase 2 — Wave 1a remainder

### Task 8: Produce post 2 — Best WhatsApp automation tools compared

Pipeline with spec §post 2:
- Slugs: `whatsapp-automation-tools` / `herramientas-automatizacion-whatsapp`
- Primary: "whatsapp automation tools" (+ "whatsapp automation"); es: "automatizar mensajes whatsapp"
- Honest listicle: ConvertChat positioned where it wins (lead reactivation, done-for-you AI agent); Manychat, Wati, respond.io, Twilio, Zapier flows reviewed fairly. Verify each competitor's current pricing/features via WebSearch before claiming anything — no stale claims
- Visuals: comparison table, 1 `:::chat` (automated flow), callouts
- Links: → post 1 (sibling), → `/` or `/pricing` (money, pick one)

### Task 9: Pricing currency switch (£ en / € es) — GATE for post 3

**Files:**
- Modify: `messages/en.json`, `messages/es.json` (pricing namespace strings)
- Possibly modify: pricing section components if currency is hardcoded outside messages (grep `\$` in `components/sections/pricing-*.tsx` first)

- [ ] **Step 1: ASK FRANK — verify app-side billing currency** (Stripe/billing must actually charge £/€ or at least not contradict the site). Blocked until he confirms.
- [ ] **Step 2: Discovery.** Grep `\$|USD|€|£` across `messages/*.json` and `components/sections/pricing-*` + `app/**/pricing*` to find every currency occurrence (including pricing FAQ copy and the costs explainer).
- [ ] **Step 3: Edit.** en.json: `$49/$99/$199` → `£49/£99/£199` (same numerals) + any prose "$" mentions; es.json: → `49 €/99 €/199 €` (Spanish convention: symbol after, non-breaking space). Meta per-message cost examples in the costs explainer: update currency consistently.
- [ ] **Step 4: Verify.** `npm run dev` → screenshot `/pricing` + `/es/precios`; typecheck; check homepage/FAQ for stray `$`.
- [ ] **Step 5: Frank sign-off → commit** `feat: pricing currency £ (en) / € (es)`.

### Task 10: Produce post 3 — WhatsApp Business API pricing, explained

**Blocked by Task 9.** Pipeline with spec §post 3:
- Slugs: `whatsapp-business-api-pricing` / `precios-whatsapp-business-api`
- Primary: "whatsapp business api pricing"; es: "whatsapp business api" + precio cluster
- MUST: worked examples in £ and € (and $ for reference); reuse the exact numbers from the /pricing costs explainer — zero contradictions; "WhatsApp marketing in the US" section covering the Meta pause; hard links to `/pricing` (this post's money link)
- Verify Meta's current per-message rates via WebSearch/Meta docs before drafting — rates changed to per-message in 2025-07; source every number

### Task 11: Wave 1a batch review

- [ ] Hand Frank posts 2 + 3 URLs (en+es) with review points. Revise → approval → commit each post separately. Push only when Frank says to (push triggers auto-deploy).

**CHECKPOINT — wave 1a live.** After deploy: spot-check production URLs, confirm sitemap includes the new posts (auto-derived).

---

## Phase 3 — Wave 1b

### Task 12: Produce post 5 — 25 WhatsApp marketing message templates

(Do 5 before 4: the pillar links to final spoke URLs; spokes first avoids retrofit edits.)
Pipeline with spec §post 5:
- Slugs: `whatsapp-marketing-message-templates` / `plantillas-mensajes-whatsapp`
- 25 copy-paste templates grouped: reactivation/win-back, abandoned cart, promos, back-in-stock, order updates, follow-ups. Templates rendered as `:::chat` mockups (4–6 of them) — the core visual asset; the rest as plain text in lists/paragraphs so they stay copyable
- Template approval rules + common rejection reasons sections; es templates written natively (not translated)

### Task 13: Produce post 6 — How to send bulk WhatsApp messages without getting banned

Pipeline with spec §post 6:
- Slugs: `send-bulk-whatsapp-messages` / `enviar-mensajes-masivos-whatsapp`
- ES-first post: primary "como enviar mensajes masivos por whatsapp" (+ "sin que te bloqueen", "gratis"); EN secondary
- Compliance twist: wrong ways (mods, extensions, Excel senders) with real risks — never teach the mechanics; right way = API + opt-in, step-by-step; quality rating + tier limits
- Higgsfield illustration slot (ships without it; placeholder = hero only)

### Task 14: Produce post 7 — WhatsApp AI agent: answer FAQs and close sales 24/7

Pipeline with spec §post 7:
- Slugs: `whatsapp-ai-chatbot` / `chatbot-whatsapp-ia`
- Outcome-first vs builder tutorials; reuses homepage day/night narrative (link to `/#` AI agent section or just `/`); ONLY post selling the AI add-on
- Honesty: AI limits, human escalation, free options + their limits, EU AI-disclosure note
- 2 `:::chat` mockups: FAQ answer (day) + closed sale (night, `ai:` sender)

### Task 15: Produce post 4 — WhatsApp marketing: the complete guide (PILLAR) + retrofit links

Pipeline with spec §post 4:
- Slugs: `whatsapp-marketing-guide` / `guia-marketing-whatsapp`
- 2,000–2,500 words; H2s capture strategies/examples/campaigns/messages secondaries; links to ALL 6 spokes; explicit "WhatsApp marketing in the US" section (Meta pause)
- **Retrofit step:** after the pillar is approved, edit all 6 spoke posts (both locales) to add one in-prose pillar link each; post 1 additionally gets its ≥1 sibling-spoke link here (deferred from Task 7 when no siblings existed); re-run typecheck/build; include in the same review batch

### Task 16: Wave 1b batch review + ship

- [ ] Frank reviews posts 4–7 (8 URLs) → revisions → approval → commit per post + retrofit commit (`feat: retrofit pillar links into wave-1a posts`) → push on Frank's go.

### Task 17: Higgsfield illustrations (async, non-blocking)

- [ ] Write the master style prompt (spec §Images: flat vector cartoon, bold shapes, brand palette — neutrals + accent purple + WhatsApp green, rainbow sparingly; no text; no realistic faces) + 3 scene prompts (post 4 concept, post 6 concept, post 7 night-shift agent).
- [ ] Hand prompts to Frank → he generates in Higgsfield → returns files.
- [ ] Optimize: convert to WebP ≤150KB, width ≤1600px (`cwebp` or `sips` + `cwebp`); save `public/blog/<slug>-illustration.webp`; insert `![...](...)` into the 6 affected MDX files (en+es); verify render; Frank approves → commit.

---

## Verification summary (every phase)

- `npm run typecheck` && `npm test` && `npm run build` green before any commit
- Playwright visual pass at 320/768/1280 for every new/changed page
- No contradiction with `/pricing` or positioning copy
- Nothing commits or pushes without Frank's explicit sign-off
