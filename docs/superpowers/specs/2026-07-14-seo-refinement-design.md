# SEO Refinement — Per-Page Metadata, OG Cards, Structured Data, GSC

**Date:** 2026-07-14
**Status:** Approved by Frank (S13 brainstorm)

## Problem

The S12 routing rework gave every page canonical URLs and hreflang, but the rest of the site's search/social presence is missing:

1. **Titles/descriptions:** home, product, and blog index inherit the one generic layout title. Only blog posts have per-page descriptions; pricing/privacy/terms set titles but no descriptions.
2. **No Open Graph or Twitter tags anywhere**, no OG image, no `metadataBase`. Shared links render as bare URLs.
3. **No structured data** (JSON-LD) — nothing for Google rich results or AI-engine answers.
4. **Default Next.js favicon** (`app/favicon.ico` is the stock triangle).
5. **`llms.txt` drift:** links to legacy `/producto` (now a 308 redirect) and describes the product as a "WhatsApp-first sales platform" while site copy says "WhatsApp remarketing & lead reactivation for B2B".
6. **No x-default** in sitemap alternates (head tags have it; sitemap doesn't).
7. **No Google Search Console** — no visibility into whether the site ranks.

Frank's stated goal: "ranking on Google and LLMs is all I care for now." Analytics beyond that (PostHog click tracking) is explicitly deferred until the site has meaningful traffic.

## Goals

- Unique, keyword-aware title + meta description on every page, both locales.
- Every page shares one approved OG/Twitter card (en/es variants).
- Real favicons from the brand icon.
- JSON-LD: Organization + WebSite (home), FAQPage (pricing), BlogPosting (posts), localized.
- `llms.txt` / `llms-full.txt` aligned with current URLs and positioning.
- x-default in sitemap alternates (if Next's sitemap type supports it).
- Site verified in Google Search Console with the sitemap submitted.
- Total cost: $0. No consent banner required (nothing added sets cookies).

## Non-Goals

- No PostHog / behavioral analytics (parked until there's traffic worth observing).
- No dynamic per-page OG images (`next/og`) — one static brand card for now.
- No `SoftwareApplication` schema — wait until the product page has real content.
- No copy changes to visible page content; metadata only.
- No Cloudflare Web Analytics beacon — dashboard stats via proxying are already live.

## Design

### 1. Per-page titles + descriptions (en/es)

Each page gets `metaTitle` + `metaDescription` keys in its existing i18n namespace (`messages/en.json` + `messages/es.json`), following the pricing page's established pattern (`pricing.metaTitle`). Pages and target intent:

| Page | Title focus | Description focus |
| --- | --- | --- |
| `/` (home) | keep current: "ConvertChat \| WhatsApp Remarketing & Lead Reactivation for B2B" | keep current description |
| `/product` | WhatsApp marketing platform — campaigns, inbox, AI agent | what the platform does, for whom |
| `/pricing` | keep current metaTitle; add description | plans from $49/mo, WhatsApp campaigns + AI |
| `/blog` | WhatsApp marketing & lead reactivation blog | guides on WhatsApp selling for B2B |
| `/privacy` | keep title pattern; add description | one-line privacy summary |
| `/terms` | keep title pattern; add description | one-line terms summary |

Blog posts already have per-post title/description from frontmatter — unchanged.

### 2. `lib/seo.ts` — one `pageMetadata()` helper

Next.js does **not** deep-merge `openGraph` across segments: a page that defines it replaces the layout's object entirely. So pages stop assembling metadata piecemeal and call a single helper:

```ts
pageMetadata(key: RouteKey, locale: Locale, opts: { title: string; description: string }): Metadata
```

Returns: `title`, `description`, `alternates` (existing `pageAlternates`), `openGraph` (type website, localized url/title/description, locale `en`/`es_ES`, the locale's OG image, siteName ConvertChat), and `twitter` (`summary_large_image`). A blog-post variant (`blogPostMetadata`) does the same using `blogPostAlternates` and `article` type. All existing per-page `generateMetadata` functions collapse to one helper call.

`metadataBase: new URL(BASE_URL)` is set once in the **root layout** (`app/layout.tsx` if present, else `app/[locale]/layout.tsx`) so relative OG image paths resolve.

### 3. OG image assets (approved card)

Design approved in the visual companion:

- Dark hero background (near-black + green/purple radial glows, matching the homepage MeshGradient identity)
- White full logo, top-left
- Serif (Newsreader) headline: **"Sell on WhatsApp. At scale."** / es: **"Vende por WhatsApp. A escala."**
- Supporting line: "WhatsApp remarketing & lead reactivation for B2B" / es: "Remarketing y reactivación de leads por WhatsApp para B2B"

Production method: a throwaway local HTML template rendered at exactly 1200×630 and screenshotted with Playwright → `public/og/og-en.png`, `public/og/og-es.png`. The template uses the real Newsreader font (Google Fonts) and the real white logo. Keep PNGs under ~300KB (resize/compress if needed). The HTML template is not committed; only the PNGs are.

### 4. Favicons (Next file conventions)

Generated from `public/logo-icon-color.png` (green brand icon):

- `app/favicon.ico` — replace the stock triangle (multi-size 16/32/48)
- `app/icon.png` — 512×512
- `app/apple-icon.png` — 180×180 (opaque background; iOS doesn't composite transparency well)

Next emits all `<link rel>` tags automatically from these files — zero config. Generation via `sips` (macOS) and Python Pillow for the `.ico`; verify Pillow availability, else any equivalent local tool.

### 5. Structured data — `components/seo/json-ld.tsx`

A tiny server component: `<JsonLd data={object} />` renders `<script type="application/ld+json">` with `JSON.stringify` output (escape `<` as `\u003c` to prevent script-context injection). Schema builders live in `lib/schema.ts` so content stays out of components:

- **Homepage:** `Organization` (name, url, logo `logo-full-color.png` absolute URL, `sameAs` if social profiles exist — omit if none) + `WebSite` (name, url, `inLanguage`)
- **Pricing:** `FAQPage` from the 5 existing pricing FAQ i18n strings (localized per locale)
- **Blog posts:** `BlogPosting` (headline, description, datePublished from frontmatter, inLanguage, author Organization ConvertChat, url)

No `Offer`/`Product` markup on pricing tiers (Google's product schema is for physical/e-commerce products; SaaS tier markup risks spam manual actions — skip).

### 6. LLM/crawler hygiene

- `public/llms.txt` + `public/llms-full.txt`: fix `/producto` → `/product`, align positioning line with "WhatsApp remarketing & lead reactivation for B2B", add `/pricing` link, keep the concise feature list.
- `app/sitemap.ts`: add `"x-default"` key to each `alternates.languages` map pointing at the English URL — **conditional on Next's `MetadataRoute.Sitemap` type accepting it** (verify against Next 16 during implementation; if the type rejects it, skip — head hreflang already carries x-default and Google accepts either source).

### 7. Google Search Console (manual step, documented)

- Domain property `convertchat.co` via DNS TXT verification — Frank adds the record in Cloudflare DNS when Google issues it (exact record provided during implementation).
- After verification: submit `https://convertchat.co/sitemap.xml`.
- No on-site code and no cookies — no consent implications.

## Grounding references (anti-hallucination)

- `/tmp/claude-seo-vet/skills/seo-page/`, `seo-schema/`, `seo-hreflang/`, `seo-geo/` + `pdf/google-seo-reference.md` — vetted claude-seo reference docs (read-only, not installed)
- Context7 for Next.js 16 Metadata API (`openGraph`, `metadataBase`, icon file conventions, sitemap alternates typing)

## Verification

1. `npm run typecheck` + `npm run build` pass.
2. Production server (`npm run start`) + Playwright: every page × both locales has unique `<title>`, `meta[name=description]`, `og:title/description/image/url/locale`, `twitter:card` — and og:image URL returns 200 at 1200×630.
3. JSON-LD on home/pricing/blog-post parses as valid JSON and contains required fields (`@context`, `@type`, and type-specific requireds); spot-check against Google Rich Results test after deploy.
4. Favicon: `/favicon.ico`, icon + apple-icon link tags present; tab shows the green brand icon.
5. `llms.txt` contains no redirecting URLs (`curl -I` each link → 200).
6. Sitemap x-default present (if type allowed) — inspect built XML.
7. Post-deploy: GSC verification passes, sitemap submitted and read without errors.

## Risks

- **OG image caching:** social platforms cache aggressively; after deploy, re-scrape via platform debuggers (Meta Sharing Debugger, LinkedIn Post Inspector) to refresh.
- **Metadata shallow-merge:** any page that later adds a custom `openGraph` field must go through `pageMetadata` or it silently drops the shared fields — helper-only policy documented in the code.
- **FAQPage rich results** are restricted for most sites since 2023 (Google limits FAQ rich display to well-known authorities) — the markup still feeds AI answers; set expectations accordingly.
- **Pillow/ICO tooling** may be unavailable locally — fall back to any local ICO generation method; never ship the stock favicon.
