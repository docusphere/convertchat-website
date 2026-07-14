# Routing Architecture — Central Route Registry + hreflang

**Date:** 2026-07-14
**Status:** Approved by Frank (S12 brainstorm)

## Problem

The site's routing metadata is hand-maintained in four separate places, and they have already drifted:

1. `i18n/routing.ts` — pathnames map with **Spanish-named internal keys** (`/precios`, `/privacidad`), confusing now that `en` is the default locale.
2. `app/sitemap.ts` — hardcoded static page list. Already out of sync: `/es/privacidad` and `/es/terminos` are missing. No hreflang alternates.
3. `app/[locale]/*/` — route directories named in Spanish (`precios/`, `privacidad/`, `terminos/`, `producto/`).
4. Per-page `generateMetadata` — no `alternates.languages` (hreflang) anywhere on the site.

Blog posts have no en↔es translation linkage: `lib/blog.ts` treats each locale's posts as unrelated, so the locale switcher on a post 404s (e.g. `/blog/welcome` → `/es/blog/welcome`, which doesn't exist — the Spanish post is `bienvenido`).

Adding a page today requires 4+ manual touches. Planned growth (industry landing pages, comparison pages, use-case pages, possibly about) makes this compound.

## Goals

- One source of truth for every static route's localized paths.
- Sitemap, `pathnames` map, and hreflang derive from it — no drift possible.
- English-named internal keys and route directories (match the default locale).
- Blog posts linked across locales (fixes switcher 404, enables post hreflang).
- Site-wide hreflang alternates + canonical URLs (`en`, `es`, `x-default`).
- Pattern that future dynamic sections (industries, comparisons, use cases) copy directly.

## Non-Goals

- No public URL changes. Every existing URL keeps working exactly as-is.
- No new pages (industries/comparisons come later; this is the foundation).
- No CMS or content-driven catch-all routing (YAGNI).
- No changes to legacy redirects in `next.config.ts`.

## Design

### 1. `lib/routes.ts` — static route registry

```ts
export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const BASE_URL = "https://convertchat.co";

// Internal key = English path. One entry per static page.
export const staticRoutes = {
  "/": { es: "/" },
  "/product": { es: "/producto" },
  "/pricing": { es: "/precios" },
  "/blog": { es: "/blog" },
  "/privacy": { es: "/privacidad" },
  "/terms": { es: "/terminos" },
} as const;

export type RouteKey = keyof typeof staticRoutes;

// Absolute URL for a route in a locale (en unprefixed, es under /es).
export function localizedUrl(key: RouteKey, locale: Locale): string;
```

The key **is** the English path (next-intl uses the internal key as the default-locale path when no override is given), so entries only declare the Spanish translation. `localizedUrl` handles the `/es` prefix and the `"/"` edge case.

Sitemap metadata (`changeFrequency`, `priority`) lives in the registry entries too, so `app/sitemap.ts` contains zero per-page knowledge.

### 2. Derivations

- **`i18n/routing.ts`**: builds `pathnames` from `staticRoutes` (plus the `"/blog/[slug]"` dynamic entry). Internal keys become English: components change `href="/precios"` → `href="/pricing"`, etc. `defineRouting` config (locales, defaultLocale, localePrefix, cookie) is unchanged.
- **`app/sitemap.ts`**: maps over `staticRoutes` emitting one entry per locale **with `alternates.languages`** (Next's sitemap type supports this). Blog entries come from the blog registry with their translation pairs as alternates. Fixes the two missing Spanish pages automatically.
- **`lib/seo.ts`**: `pageAlternates(key, locale)` (and a blog-post variant) returns Next `Metadata["alternates"]`:
  ```ts
  { canonical: <this locale's URL>,
    languages: { en: <en URL>, es: <es URL>, "x-default": <en URL> } }
  ```
  Each page's `generateMetadata` spreads this in. `x-default` points at English (the unprefixed default).

### 3. Route directory renames (internal only)

| Current | New |
| --- | --- |
| `app/[locale]/precios/` | `app/[locale]/pricing/` |
| `app/[locale]/producto/` | `app/[locale]/product/` |
| `app/[locale]/privacidad/` | `app/[locale]/privacy/` |
| `app/[locale]/terminos/` | `app/[locale]/terms/` |

Public URLs are controlled by the `pathnames` map, not directory names — zero URL impact. All internal `<Link href>` usages update to English keys (navbar, footer, any cross-links).

### 4. Blog translation linkage — `lib/blog.ts`

Registry becomes translation-pair-first:

```ts
// One entry per post; a locale key may be absent if untranslated.
const posts = [
  { en: { slug: "welcome", raw: enWelcome }, es: { slug: "bienvenido", raw: esBienvenido } },
];
```

- Existing API (`getAllPosts`, `getPost`, `getAllSlugs`) preserved on top of the new shape.
- Implementation note (plan deviation): the slug pairs live in a separate client-safe `lib/blog-slugs.ts` instead of reshaping `lib/blog.ts` — the navbar (client component) needs the pairs, and importing `lib/blog.ts` there would bundle MDX post content into client JS.
- New: `getTranslatedSlug(locale, slug, targetLocale): string | null`.
- Locale switcher fix: blog post page passes the translated slug so `router.replace` targets the right post. If no translation exists, fall back to the blog index in the target locale.
- Blog post `generateMetadata` gains hreflang alternates via `lib/seo.ts` (only for locales where a translation exists).

### 5. Future sections pattern (documented, not built)

Industries/comparisons/use-cases each get: a registry (`lib/industries.ts` etc.) with localized slugs per entry, a dynamic route (`app/[locale]/industries/[slug]/`), one `pathnames` entry (`"/industries/[slug]"`), sitemap + hreflang derived the same way as blog. Adding a static page = 1 registry entry + 1 route directory.

## Ships with

- Navbar anchor fix (`components/layout/navbar.tsx`, already implemented + verified, uncommitted): locale-aware plain `<a>` anchors for homepage sections.

## Verification

1. `npm run typecheck` + `npm run build` pass.
2. Playwright: every page × both locales loads (/, product, pricing, blog, blog post, privacy, terms).
3. Locale switcher round-trips on every page, **including blog posts** (welcome ⇄ bienvenido).
4. `<head>` contains `link rel="alternate" hreflang` (en, es, x-default) + canonical on every page.
5. `/sitemap.xml` includes all pages in both locales with `xhtml:link` alternates; `/es/privacidad` + `/es/terminos` now present.
6. Legacy redirects still 308 (`/precios` → `/es/precios`).
7. Navbar anchors work from interior pages (`/es/precios` → `/es#problem`).

## Risks

- **Missed `href` rename** → typecheck catches it: `pathnames` keys are typed, so a stale `href="/precios"` is a compile error.
- **Sitemap alternates format** — verify Next's `MetadataRoute.Sitemap` alternates output renders `xhtml:link` correctly in the built XML (check against Next 16 docs during implementation).
- **Cookie-driven middleware redirects** during Playwright verification (NEXT_LOCALE) — reset cookie between locale test runs, as done in S11.
