# SEO Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unique per-page metadata + OG cards, real favicons, JSON-LD structured data, refreshed llms.txt, and sitemap x-default for convertchat.co (spec: `docs/superpowers/specs/2026-07-14-seo-refinement-design.md`).

**Architecture:** All page metadata flows through one `pageMetadata()` helper in `lib/seo.ts` (Next.js shallow-merges `openGraph` across segments, so pages must never assemble it piecemeal). JSON-LD schema builders live in `lib/schema.ts`, rendered by a tiny `<JsonLd>` server component. Static assets (OG PNGs, favicons) are generated locally with throwaway scripts — only the outputs are committed.

**Tech Stack:** Next.js 16 App Router Metadata API, next-intl, schema.org JSON-LD, Playwright (screenshot), Python Pillow + `sips` (image generation).

**Testing note:** This repo has no unit-test framework. Each task verifies with `npm run typecheck` (+ `npm run build` where output changes), and the final task does end-to-end verification of rendered tags with a running server. This replaces the TDD red/green loop for what is metadata/asset work.

**Grounding facts (verified against this repo, do not re-derive):**
- `lib/routes.ts` exports `BASE_URL = "https://convertchat.co"`, `locales = ["en","es"]`, `type Locale`, `type RouteKey` (`"/" | "/product" | "/pricing" | "/blog" | "/privacy" | "/terms"`), `localizedUrl(key, locale)` (absolute URLs; en unprefixed, es under `/es` with Spanish paths).
- `lib/seo.ts` exports `pageAlternates(key, locale)`, `blogPostUrl(locale, slug)`, `blogPostAlternates(locale, slug)` — all already include x-default → en.
- Next 16's sitemap type DOES accept x-default: `node_modules/next/dist/lib/metadata/types/alternative-urls-types.d.ts` line 2 has `type UnmatchedLang = 'x-default'` and `Languages<T>` includes it. So Task 8 is unconditional.
- Twitter card auto-inherits title/description/images from openGraph when not set (verified in Next's `resolve-metadata.ts`) — `twitter: { card: "summary_large_image" }` alone is sufficient.
- `public/logo-icon-color.png` is 1280×1280 (square — plain resize is safe). Pillow 12.2.0 and `sips` are installed.
- Homepage FAQ i18n: namespace `faq`, keys `q1`–`q6` / `a1`–`a6`. Pricing FAQ: namespace `pricing.faq`, keys `q1`–`q5` / `a1`–`a5`. All plain text (no HTML).
- Starter plan price is $49/mo (`pricing.plans.*.price` in messages).
- Blog frontmatter (`lib/blog.ts` `BlogPost` type): `title`, `description`, `date` (string), `author`, `tags`, `slug`, `locale`.
- Prettier: printWidth 120, double quotes, semicolons, trailing commas. No tabs.

---

### Task 1: OG image assets (approved card)

**Files:**
- Create: `public/og/og-en.png` (1200×630, <300KB)
- Create: `public/og/og-es.png` (1200×630, <300KB)
- Throwaway (NOT committed): `/tmp/og-template/og-en.html`, `/tmp/og-template/og-es.html`

- [ ] **Step 1: Write the throwaway HTML templates**

Create `/tmp/og-template/og-en.html` with this exact content, replacing `__REPO__` with the absolute repo path (`/Users/franciscojosejimeneznillardkam/Documents/Frank DOCS/Frank Projects/convertchat-website` — note: keep the `file://` URL properly percent-encoded for spaces, i.e. `%20`):

```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    background:
      radial-gradient(120% 140% at 15% 10%, #34d399 0%, transparent 45%),
      radial-gradient(120% 140% at 85% 90%, #7c3aed 0%, transparent 50%),
      #0a0a0a;
    display: flex; flex-direction: column; justify-content: center;
    padding: 0 96px;
  }
  img.logo { height: 60px; width: auto; align-self: flex-start; margin-bottom: 44px; }
  h1 {
    font-family: "Newsreader", Georgia, serif; font-weight: 400;
    font-size: 92px; line-height: 1.1; color: #fff; letter-spacing: -0.02em;
  }
  p {
    font-family: -apple-system, "Helvetica Neue", sans-serif;
    font-size: 30px; color: rgba(255, 255, 255, 0.65); margin-top: 28px;
  }
</style>
</head>
<body>
  <img class="logo" src="file://__REPO__/public/logo-full-white.png" alt="">
  <h1>Sell on WhatsApp.<br>At scale.</h1>
  <p>WhatsApp remarketing &amp; lead reactivation for B2B</p>
</body>
</html>
```

Create `/tmp/og-template/og-es.html` — identical except:
- `<h1>Vende por WhatsApp.<br>A escala.</h1>`
- `<p>Remarketing y reactivación de leads por WhatsApp para B2B</p>`

- [ ] **Step 2: Screenshot both templates at exactly 1200×630**

Preferred: Playwright MCP browser — `browser_resize` to 1200×630, `browser_navigate` to `file:///tmp/og-template/og-en.html`, wait ~2s for the Google font to load, `browser_take_screenshot` (viewport, PNG), then copy the produced file to `public/og/og-en.png` (`mkdir -p public/og` first). Repeat for es.

Fallback if MCP browser is unavailable:
```bash
npx playwright screenshot --viewport-size=1200,630 --wait-for-timeout=2500 "file:///tmp/og-template/og-en.html" public/og/og-en.png
```
(run `npx playwright install chromium` first if it complains about missing browsers)

- [ ] **Step 3: Verify dimensions and size; fix if needed**

```bash
sips -g pixelWidth -g pixelHeight public/og/og-en.png public/og/og-es.png && ls -la public/og/
```
Expected: exactly 1200×630 each. If a retina screenshot produced 2400×1260, downscale: `sips -z 630 1200 public/og/og-en.png`. If either file exceeds ~300KB, compress with Pillow quantize:
```bash
python3 -c "from PIL import Image; [Image.open(f'public/og/og-{l}.png').quantize(256).save(f'public/og/og-{l}.png') for l in ('en','es')]"
```
Then re-verify dimensions/size. **Visually inspect both PNGs with the Read tool** — confirm white logo top-left, serif headline, supporting line, green/purple glows on near-black.

- [ ] **Step 4: Commit**

```bash
git add public/og/og-en.png public/og/og-es.png
git commit -m "feat: brand OG card images (en/es)"
```

---

### Task 2: Favicons from the brand icon

**Files:**
- Modify: `app/favicon.ico` (replace stock Next.js triangle)
- Create: `app/icon.png` (512×512)
- Create: `app/apple-icon.png` (180×180, opaque background)

- [ ] **Step 1: Generate all three with Pillow**

Source `public/logo-icon-color.png` is square 1280×1280. Run from the repo root:

```bash
python3 <<'EOF'
from PIL import Image

src = Image.open("public/logo-icon-color.png").convert("RGBA")

# app/icon.png — 512x512
src.resize((512, 512), Image.LANCZOS).save("app/icon.png")

# app/apple-icon.png — 180x180 opaque (iOS composites transparency poorly)
bg = Image.new("RGB", (180, 180), "white")
inner = src.resize((150, 150), Image.LANCZOS)
bg.paste(inner, (15, 15), inner)
bg.save("app/apple-icon.png")

# app/favicon.ico — multi-size 16/32/48
src.save("app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("done")
EOF
```

Fallback if Pillow import fails (do not stall): resize PNGs with `sips -z 512 512` / `sips -z 180 180` into temp files, then `npx png-to-ico app/icon.png > app/favicon.ico`.

- [ ] **Step 2: Verify outputs**

```bash
sips -g pixelWidth -g pixelHeight app/icon.png app/apple-icon.png && ls -la app/favicon.ico app/icon.png app/apple-icon.png
```
Expected: 512×512 and 180×180; favicon.ico a few KB and newer than the stock one. Read `app/icon.png` and `app/apple-icon.png` with the Read tool to confirm they show the green brand icon (apple-icon on white).

- [ ] **Step 3: Build check** (Next auto-emits icon link tags from these files — no config)

```bash
npm run typecheck && npm run build
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add app/favicon.ico app/icon.png app/apple-icon.png
git commit -m "feat: real favicons from brand icon"
```

---

### Task 3: Per-page meta strings (i18n, en + es)

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/es.json`

Home keeps the existing `metadata.title`/`metadata.description` (unchanged). Pricing already has `pricing.metaTitle`. Privacy/terms titles come from legal doc frontmatter — only descriptions are added.

- [ ] **Step 1: Add new top-level namespaces + pricing key to `messages/en.json`**

Add `"metaDescription"` inside the existing `"pricing"` object, directly after `"metaTitle"`:
```json
"metaDescription": "Plans from $49/mo with WhatsApp campaigns, unified inbox and optional AI agent. No contracts, cancel anytime, 0% markup on WhatsApp messages.",
```

Add new top-level namespaces (before the final `"metadata"` block, matching 2-space indent):
```json
"product": {
  "metaTitle": "WhatsApp Marketing Platform — Campaigns, Inbox & AI Agent | ConvertChat",
  "metaDescription": "Send WhatsApp campaigns at scale, manage every conversation in one inbox, and let an AI agent qualify your leads. Built for B2B wholesalers and distributors."
},
"blog": {
  "metaTitle": "WhatsApp Marketing & Lead Reactivation Blog | ConvertChat",
  "metaDescription": "Guides on selling via WhatsApp for B2B: remarketing, lead reactivation, opt-in campaigns and the WhatsApp Business API."
},
"legal": {
  "privacyMetaDescription": "How ConvertChat collects, uses and protects your data. No analytics cookies, no ad tracking.",
  "termsMetaDescription": "The terms that govern your use of ConvertChat's WhatsApp remarketing platform."
},
```

- [ ] **Step 2: Mirror in `messages/es.json`**

Inside `"pricing"` after `"metaTitle"`:
```json
"metaDescription": "Planes desde $49/mes con campañas de WhatsApp, inbox unificado y agente IA opcional. Sin permanencia, cancela cuando quieras y 0% de comisión en mensajes de WhatsApp.",
```

New top-level namespaces (same position as en.json):
```json
"product": {
  "metaTitle": "Plataforma de Marketing por WhatsApp — Campañas, Inbox y Agente IA | ConvertChat",
  "metaDescription": "Envía campañas de WhatsApp a escala, gestiona todas las conversaciones en un solo inbox y deja que un agente IA califique tus leads. Para mayoristas y distribuidores B2B."
},
"blog": {
  "metaTitle": "Blog de Marketing por WhatsApp y Reactivación de Leads | ConvertChat",
  "metaDescription": "Guías para vender por WhatsApp en B2B: remarketing, reactivación de leads, campañas con opt-in y la API de WhatsApp Business."
},
"legal": {
  "privacyMetaDescription": "Cómo ConvertChat recopila, usa y protege tus datos. Sin cookies de analítica ni rastreo publicitario.",
  "termsMetaDescription": "Los términos que rigen el uso de la plataforma de remarketing por WhatsApp de ConvertChat."
},
```

- [ ] **Step 3: Verify JSON validity + key parity**

```bash
node -e "
const en = require('./messages/en.json'), es = require('./messages/es.json');
for (const ns of ['product','blog','legal']) {
  const a = Object.keys(en[ns]).sort().join(), b = Object.keys(es[ns]).sort().join();
  if (a !== b) throw new Error(ns + ' key mismatch');
}
if (!en.pricing.metaDescription || !es.pricing.metaDescription) throw new Error('pricing.metaDescription missing');
console.log('i18n keys OK');
"
```
Expected: `i18n keys OK`.

- [ ] **Step 4: Format + commit**

```bash
npx prettier --write messages/en.json messages/es.json
git add messages/en.json messages/es.json
git commit -m "feat: per-page meta titles and descriptions (en/es)"
```

---

### Task 4: `pageMetadata()` / `blogPostMetadata()` helpers + `metadataBase`

**Files:**
- Modify: `lib/seo.ts`
- Modify: `app/layout.tsx` (add `metadataBase`)

- [ ] **Step 1: Extend `lib/seo.ts`**

Add below the existing helpers (keep existing exports untouched):

```ts
// ── Shared page metadata ─────────────────────────────────────────────────────
// Next.js does NOT deep-merge `openGraph` across segments: a page that defines
// it replaces the layout's object entirely. ALL pages must build metadata via
// pageMetadata()/blogPostMetadata() — never assemble openGraph piecemeal.

const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_ES" };
const OG_ALT: Record<Locale, string> = {
  en: "ConvertChat — Sell on WhatsApp. At scale.",
  es: "ConvertChat — Vende por WhatsApp. A escala.",
};

type PageMetaOpts = { title: string; description: string };

function ogImage(locale: Locale) {
  // Relative path — resolved against metadataBase (set in app/layout.tsx).
  return [{ url: `/og/og-${locale}.png`, width: 1200, height: 630, alt: OG_ALT[locale] }];
}

export function pageMetadata(key: RouteKey, locale: Locale, { title, description }: PageMetaOpts): Metadata {
  return {
    title,
    description,
    alternates: pageAlternates(key, locale),
    openGraph: {
      type: "website",
      url: localizedUrl(key, locale),
      title,
      description,
      siteName: "ConvertChat",
      locale: OG_LOCALE[locale],
      images: ogImage(locale),
    },
    twitter: { card: "summary_large_image" },
  };
}

export function blogPostMetadata(
  locale: Locale,
  slug: string,
  { title, description, publishedTime }: PageMetaOpts & { publishedTime?: string },
): Metadata {
  return {
    title,
    description,
    alternates: blogPostAlternates(locale, slug),
    openGraph: {
      type: "article",
      url: blogPostUrl(locale, slug),
      title,
      description,
      siteName: "ConvertChat",
      locale: OG_LOCALE[locale],
      images: ogImage(locale),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image" },
  };
}
```

- [ ] **Step 2: Set `metadataBase` in `app/layout.tsx`**

Change the existing `export const metadata: Metadata = { title: "ConvertChat" };` to:

```ts
import { BASE_URL } from "@/lib/routes";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "ConvertChat",
};
```
(Add the import to the existing import block; keep everything else in the file untouched.)

- [ ] **Step 3: Verify**

```bash
npm run typecheck
```
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add lib/seo.ts app/layout.tsx
git commit -m "feat: pageMetadata/blogPostMetadata helpers + metadataBase"
```

---

### Task 5: Wire all pages through the helpers

**Files:**
- Modify: `app/[locale]/page.tsx:17-20`
- Modify: `app/[locale]/product/page.tsx:8-11`
- Modify: `app/[locale]/pricing/page.tsx:11-15`
- Modify: `app/[locale]/blog/page.tsx:8-11`
- Modify: `app/[locale]/privacy/page.tsx:8-12`
- Modify: `app/[locale]/terms/page.tsx` (same shape as privacy)
- Modify: `app/[locale]/blog/[slug]/page.tsx:14-27`

Each page replaces its `generateMetadata` body with one helper call. Imports change from `pageAlternates` to `pageMetadata` (add `getTranslations` from `next-intl/server` where missing).

- [ ] **Step 1: Home — `app/[locale]/page.tsx`**

```ts
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return pageMetadata("/", locale as Locale, { title: t("title"), description: t("description") });
}
```

- [ ] **Step 2: Product — `app/[locale]/product/page.tsx`**

```ts
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "product" });
  return pageMetadata("/product", locale as Locale, { title: t("metaTitle"), description: t("metaDescription") });
}
```

- [ ] **Step 3: Pricing — `app/[locale]/pricing/page.tsx`**

```ts
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return pageMetadata("/pricing", locale as Locale, { title: t("metaTitle"), description: t("metaDescription") });
}
```

- [ ] **Step 4: Blog index — `app/[locale]/blog/page.tsx`**

```ts
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return pageMetadata("/blog", locale as Locale, { title: t("metaTitle"), description: t("metaDescription") });
}
```

- [ ] **Step 5: Privacy + Terms**

Privacy (terms is identical with `"terms"` / `termsMetaDescription`):
```ts
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const doc = getLegalDoc(locale, "privacy");
  const t = await getTranslations({ locale, namespace: "legal" });
  return pageMetadata("/privacy", locale as Locale, {
    title: `${doc.title} | ConvertChat`,
    description: t("privacyMetaDescription"),
  });
}
```

- [ ] **Step 6: Blog post — `app/[locale]/blog/[slug]/page.tsx`**

```ts
import { blogPostMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) return {};
  return blogPostMetadata(locale as Locale, slug, {
    title: `${post.title} | ConvertChat`,
    description: post.description,
    publishedTime: post.date || undefined,
  });
}
```

- [ ] **Step 7: Verify no page imports `pageAlternates`/`blogPostAlternates` directly anymore**

```bash
grep -rn "pageAlternates\|blogPostAlternates" app/ && echo "FAIL: direct alternates usage remains" || echo "OK"
```
Expected: `OK` (only `lib/seo.ts` uses them internally).

- [ ] **Step 8: Typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: both pass.

- [ ] **Step 9: Commit**

```bash
git add app/[locale]/page.tsx app/[locale]/product/page.tsx app/[locale]/pricing/page.tsx app/[locale]/blog/page.tsx app/[locale]/privacy/page.tsx app/[locale]/terms/page.tsx "app/[locale]/blog/[slug]/page.tsx"
git commit -m "feat: unique titles, descriptions and OG/Twitter tags on every page"
```

---

### Task 6: JSON-LD structured data

**Files:**
- Create: `components/seo/json-ld.tsx`
- Create: `lib/schema.ts`
- Modify: `app/[locale]/page.tsx` (Organization + WebSite + FAQPage)
- Modify: `app/[locale]/pricing/page.tsx` (FAQPage)
- Modify: `app/[locale]/blog/[slug]/page.tsx` (BlogPosting)

- [ ] **Step 1: Create `components/seo/json-ld.tsx`**

```tsx
// Renders schema.org JSON-LD. Escapes "<" so payloads can't break out of the
// script context.
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}
```

- [ ] **Step 2: Create `lib/schema.ts`**

```ts
import { BASE_URL, localizedUrl, type Locale } from "./routes";
import { blogPostUrl } from "./seo";
import type { BlogPost } from "./blog";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ConvertChat",
    url: BASE_URL,
    logo: `${BASE_URL}/logo-full-color.png`,
  };
}

export function webSiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ConvertChat",
    url: localizedUrl("/", locale),
    inLanguage: locale,
  };
}

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function blogPostingSchema(locale: Locale, post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: locale,
    url: blogPostUrl(locale, post.slug),
    author: { "@type": "Organization", name: "ConvertChat", url: BASE_URL },
  };
}
```

Note: no `sameAs` on Organization — ConvertChat has no social profiles yet (spec: omit if none). No Offer/Product markup on pricing tiers (spec non-goal).

- [ ] **Step 3: Wire homepage — `app/[locale]/page.tsx`**

In `HomePage`, after `setRequestLocale(locale)`:
```tsx
const t = await getTranslations({ locale, namespace: "faq" });
const faqItems = ([1, 2, 3, 4, 5, 6] as const).map((i) => ({ question: t(`q${i}`), answer: t(`a${i}`) }));
```
Render inside the fragment, before `<HeroSection />`:
```tsx
<JsonLd data={organizationSchema()} />
<JsonLd data={webSiteSchema(locale as Locale)} />
<JsonLd data={faqPageSchema(faqItems)} />
```
Imports: `JsonLd` from `@/components/seo/json-ld`; `organizationSchema, webSiteSchema, faqPageSchema` from `@/lib/schema`.

- [ ] **Step 4: Wire pricing — `app/[locale]/pricing/page.tsx`**

In `PricingPage` after `setRequestLocale(locale)`:
```tsx
const t = await getTranslations({ locale, namespace: "pricing.faq" });
const faqItems = ([1, 2, 3, 4, 5] as const).map((i) => ({ question: t(`q${i}`), answer: t(`a${i}`) }));
```
Render `<JsonLd data={faqPageSchema(faqItems)} />` first inside the fragment.

- [ ] **Step 5: Wire blog post — `app/[locale]/blog/[slug]/page.tsx`**

After `if (!post) notFound();` render `<JsonLd data={blogPostingSchema(locale as Locale, post)} />` as the first child of the returned `<section>`'s article (or wrap the section in a fragment with JsonLd first — either is fine, prefer fragment).

- [ ] **Step 6: Typecheck + build, then inspect output**

```bash
npm run typecheck && npm run build
```
Expected: pass. Then start the dev server on a spare port and validate every JSON-LD block parses:
```bash
PORT=3002 npm run dev &   # or reuse an already-running dev server on 3002
sleep 5
node -e "
const cheerio = null; // not installed — use regex extraction
fetch('http://localhost:3002/').then(r => r.text()).then(html => {
  const blocks = [...html.matchAll(/<script type=\"application\/ld\+json\">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
  console.log('home JSON-LD types:', blocks.map(b => b['@type']).join(', '));
  if (blocks.length !== 3) throw new Error('expected 3 blocks on home');
});
"
```
Expected: `home JSON-LD types: Organization, WebSite, FAQPage`. If the regex matches 0 blocks, inspect the raw HTML manually before concluding the schema is missing (React may render extra script attributes). Spot-check `/pricing` (FAQPage, 5 questions) and `/blog/welcome` (BlogPosting with headline + datePublished) the same way. Kill the dev server if you started it.

- [ ] **Step 7: Commit**

```bash
git add components/seo/json-ld.tsx lib/schema.ts app/[locale]/page.tsx app/[locale]/pricing/page.tsx "app/[locale]/blog/[slug]/page.tsx"
git commit -m "feat: JSON-LD structured data (Organization, WebSite, FAQPage, BlogPosting)"
```

---

### Task 7: llms.txt / llms-full.txt refresh

**Files:**
- Modify: `public/llms.txt`
- Modify: `public/llms-full.txt`

Fixes: positioning line ("WhatsApp-first sales platform" → remarketing/lead-reactivation positioning), legacy URLs (`/producto` → `/product`, `/precios` → `/pricing`, `/privacidad` → `/privacy`, `/terminos` → `/terms`), add `/pricing` to llms.txt.

- [ ] **Step 1: Rewrite `public/llms.txt`**

```
# ConvertChat

> ConvertChat is a WhatsApp remarketing and lead reactivation platform for B2B — wholesalers, distributors, and SMEs with product catalogs.

## Core Features

- **Campaigns**: Send product offers to thousands of leads via WhatsApp and email in minutes.
- **Unified Inbox**: All WhatsApp, email, and other conversations in one place.
- **AI Agent**: Automatically answers questions, qualifies leads, and schedules meetings.

## Target Audience

Wholesalers, distributors, and SMEs who sell products via WhatsApp and email.

## Links

- Website: https://convertchat.co
- Product: https://convertchat.co/product
- Pricing: https://convertchat.co/pricing
- Blog: https://convertchat.co/blog
```

- [ ] **Step 2: Update `public/llms-full.txt`**

Two edits only (keep the rest verbatim):
1. Line 3 blockquote: `> ConvertChat is a WhatsApp remarketing and lead reactivation platform for B2B — wholesalers, distributors, and SMEs with product catalogs. It helps sales teams send product campaigns, manage conversations in a unified inbox, and automate responses with an AI agent.`
2. Links section:
```
- Website: https://convertchat.co
- Product: https://convertchat.co/product
- Pricing: https://convertchat.co/pricing
- Blog: https://convertchat.co/blog
- Privacy: https://convertchat.co/privacy
- Terms: https://convertchat.co/terms
```

- [ ] **Step 3: Verify no legacy URLs remain**

```bash
grep -n "producto\|precios\|privacidad\|terminos" public/llms.txt public/llms-full.txt && echo "FAIL" || echo "OK"
```
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add public/llms.txt public/llms-full.txt
git commit -m "fix: llms.txt aligned with current URLs and positioning"
```

---

### Task 8: Sitemap x-default

**Files:**
- Modify: `app/sitemap.ts`

The type supports it (verified: `Languages<T>` includes `'x-default'`).

- [ ] **Step 1: Add x-default to static page alternates (`app/sitemap.ts:10`)**

```ts
const alternates = {
  languages: { en: localizedUrl(key, "en"), es: localizedUrl(key, "es"), "x-default": localizedUrl(key, "en") },
};
```

- [ ] **Step 2: Add x-default to blog alternates (after the `for (const other of locales)` loop)**

```ts
if (languages.en) languages["x-default"] = languages.en;
```

- [ ] **Step 3: Verify built XML**

```bash
npm run typecheck && npm run build && grep -c 'hreflang="x-default"' .next/server/app/sitemap.xml.body 2>/dev/null || echo "inspect manually"
```
If the built body file isn't at that path, start the dev server and `curl -s http://localhost:3002/sitemap.xml | grep -c 'x-default'`. Expected: one x-default per URL entry (12 static entries + one per blog post that has an English version).

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: x-default hreflang in sitemap alternates"
```

---

### Task 9: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Full build + server**

```bash
npm run typecheck && npm run build
```
Then serve the site locally. Note: `next.config.ts` uses `output: "standalone"`, so if `npm run start` refuses, use the dev server instead — metadata output is identical: `PORT=3002 npm run dev`.

- [ ] **Step 2: Verify head tags on every page × both locales**

For each of: `/`, `/product`, `/pricing`, `/blog`, `/blog/welcome`, `/privacy`, `/terms`, `/es`, `/es/producto`, `/es/precios`, `/es/blog`, `/es/blog/bienvenido`, `/es/privacidad`, `/es/terminos` — fetch and assert:

```bash
node <<'EOF'
const pages = ["/", "/product", "/pricing", "/blog", "/blog/welcome", "/privacy", "/terms",
  "/es", "/es/producto", "/es/precios", "/es/blog", "/es/blog/bienvenido", "/es/privacidad", "/es/terminos"];
const base = "http://localhost:3002";
const titles = new Set();
for (const p of pages) {
  const html = await fetch(base + p, { headers: { cookie: "NEXT_LOCALE=" + (p.startsWith("/es") ? "es" : "en") } }).then(r => r.text());
  const get = (re) => (html.match(re) || [])[1];
  const title = get(/<title>([^<]+)<\/title>/);
  const checks = {
    title,
    description: get(/name="description" content="([^"]*)"/),
    ogTitle: get(/property="og:title" content="([^"]*)"/),
    ogImage: get(/property="og:image" content="([^"]*)"/),
    ogUrl: get(/property="og:url" content="([^"]*)"/),
    ogLocale: get(/property="og:locale" content="([^"]*)"/),
    twitterCard: get(/name="twitter:card" content="([^"]*)"/),
    twitterImage: get(/name="twitter:image" content="([^"]*)"/), // confirms OG inheritance
  };
  for (const [k, v] of Object.entries(checks)) if (!v) throw new Error(`${p}: missing ${k}`);
  if (titles.has(title)) throw new Error(`${p}: duplicate title "${title}"`);
  titles.add(title);
  const expectedImg = p.startsWith("/es") ? "og-es.png" : "og-en.png";
  if (!checks.ogImage.includes(expectedImg)) throw new Error(`${p}: wrong og:image ${checks.ogImage}`);
  console.log(`OK ${p} — ${title}`);
}
EOF
```
Expected: `OK` for all 14, every title unique. (The NEXT_LOCALE cookie avoids middleware redirect noise.)

- [ ] **Step 3: OG images + favicon + llms serve 200**

```bash
for u in /og/og-en.png /og/og-es.png /favicon.ico /icon.png /apple-icon.png /llms.txt /llms-full.txt; do
  echo "$u $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3002$u)"; done
```
Expected: all 200. (Icon routes may carry hashed paths — if `/icon.png` 404s, grep the home HTML for `rel="icon"` and curl the actual href.) Also confirm the llms.txt links themselves don't redirect: `curl -s -o /dev/null -w '%{http_code}' http://localhost:3002/product` → 200.

- [ ] **Step 4: Visual spot-check in browser**

Playwright MCP: open `http://localhost:3002/`, confirm the tab favicon is the green brand icon (screenshot). No visible page content should have changed anywhere.

- [ ] **Step 5: Stop the server. No commit (nothing changed).**

---

### Post-merge manual steps (Frank — documented, not code)

1. **Deploy** happens automatically on push to main (GitHub Actions → Cloudflare Workers).
2. **Google Search Console:** add domain property `convertchat.co` → Google issues a DNS TXT record → add it in Cloudflare DNS → verify → submit `https://convertchat.co/sitemap.xml`.
3. **Re-scrape social caches:** Meta Sharing Debugger + LinkedIn Post Inspector on `https://convertchat.co`.
4. **Spot-check** home/pricing/blog-post in Google Rich Results test.
