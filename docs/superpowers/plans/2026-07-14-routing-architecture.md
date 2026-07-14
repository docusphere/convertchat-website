# Routing Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Central route registry from which next-intl pathnames, sitemap, and hreflang all derive; English internal route names; blog en↔es translation linkage. Zero public URL changes.

**Architecture:** New `lib/routes.ts` is the single source of truth for static routes (localized paths + sitemap metadata). `i18n/routing.ts` and `app/sitemap.ts` derive from it. New client-safe `lib/blog-slugs.ts` holds blog translation pairs (no MDX imports, so the navbar can use it). New `lib/seo.ts` builds `Metadata["alternates"]` (canonical + hreflang) for every page.

**Tech Stack:** Next.js 16 App Router, next-intl (`localePrefix: "as-needed"`, defaultLocale `en`), TypeScript.

**Spec:** `docs/superpowers/specs/2026-07-14-routing-architecture-design.md`

**Testing note:** This repo has no unit-test framework (marketing site) — do not add one. Each task verifies via `npm run typecheck`, `npm run build`, and browser/curl checks against the dev server. Dev server: `npm run dev` (project runs on port 3002 locally if 3000/3001 are taken by other projects — check the dev server's startup output for the actual port and use it in the curl/browser commands below).

**Formatting note:** No `.prettierrc` exists. If you run prettier, ALWAYS pass flags explicitly: `npx prettier --write --print-width 120 --semi --no-single-quote --trailing-comma all <files>`. Bare `npx prettier` reformats at 80 cols and must not be used.

**Key facts for someone new to this codebase:**
- next-intl `pathnames` maps an **internal key** → per-locale public paths. The internal key MUST match the `app/[locale]/…` directory path. So changing keys from `/precios` to `/pricing` requires renaming `app/[locale]/precios/` → `app/[locale]/pricing/` in the same commit.
- Public URLs never change in this work: they are controlled by the per-locale values in `pathnames`, which stay identical.
- `<Link href>` values (from `@/i18n/navigation`) are typed against the `pathnames` keys, so every stale Spanish href becomes a compile error after Task 2 — that's expected and fixed in the same task.
- The NEXT_LOCALE cookie makes the middleware redirect unprefixed paths to the preferred locale. When testing EN URLs in a browser that visited /es pages, first run `document.cookie = "NEXT_LOCALE=en; path=/"`.

---

### Task 0: Commit the pending navbar anchor fix

`components/layout/navbar.tsx` has an uncommitted, already-verified fix (locale-aware plain `<a>` anchors for homepage sections). Commit it first so later diffs stay clean.

**Files:**
- Modify: none (already modified)

- [ ] **Step 1: Confirm the diff is only the anchor fix**

Run: `git diff components/layout/navbar.tsx`
Expected: changes limited to `homeHref`/`navLinks` (anchor entries) and the `"anchor" in link` render branches.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/layout/navbar.tsx
git commit -m "fix: navbar section anchors work from interior pages via locale-aware hrefs"
```

---

### Task 1: Create the registry modules (`lib/routes.ts`, `lib/blog-slugs.ts`, `lib/seo.ts`)

Pure additions — nothing consumes them yet.

**Files:**
- Create: `lib/routes.ts`
- Create: `lib/blog-slugs.ts`
- Create: `lib/seo.ts`

- [ ] **Step 1: Create `lib/routes.ts`**

```ts
// Single source of truth for static routes. i18n/routing.ts (pathnames),
// app/sitemap.ts, and lib/seo.ts (hreflang) all derive from this registry.
// Adding a static page = add one entry here + create app/[locale]/<key>/.

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const BASE_URL = "https://convertchat.co";

type RouteDef = {
  es: string; // Spanish path (English path IS the key — en is the default, unprefixed locale)
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

export const staticRoutes = {
  "/": { es: "/", changeFrequency: "weekly", priority: 1 },
  "/product": { es: "/producto", changeFrequency: "monthly", priority: 0.8 },
  "/pricing": { es: "/precios", changeFrequency: "monthly", priority: 0.7 },
  "/blog": { es: "/blog", changeFrequency: "weekly", priority: 0.6 },
  "/privacy": { es: "/privacidad", changeFrequency: "yearly", priority: 0.3 },
  "/terms": { es: "/terminos", changeFrequency: "yearly", priority: 0.3 },
} as const satisfies Record<string, RouteDef>;

export type RouteKey = keyof typeof staticRoutes;

// Absolute URL for a static route in a locale. en is unprefixed; es lives under /es.
export function localizedUrl(key: RouteKey, locale: Locale): string {
  if (locale === "en") return key === "/" ? BASE_URL : `${BASE_URL}${key}`;
  const esPath = staticRoutes[key].es;
  return esPath === "/" ? `${BASE_URL}/es` : `${BASE_URL}/es${esPath}`;
}
```

- [ ] **Step 2: Create `lib/blog-slugs.ts`**

```ts
import type { Locale } from "./routes";

// Translation pairs linking each blog post across locales. Client-safe: no MDX
// imports, so client components (navbar locale switcher) can import it without
// bundling post content. When adding a post, add its pair here AND its raw
// content to the registry in lib/blog.ts. A locale key may be absent when the
// post has no translation.
export const postSlugPairs: ReadonlyArray<Partial<Record<Locale, string>>> = [
  { en: "welcome", es: "bienvenido" },
];

export function getTranslatedSlug(fromLocale: Locale, slug: string, toLocale: Locale): string | null {
  const pair = postSlugPairs.find((p) => p[fromLocale] === slug);
  return pair?.[toLocale] ?? null;
}
```

- [ ] **Step 3: Create `lib/seo.ts`**

```ts
import type { Metadata } from "next";
import { BASE_URL, localizedUrl, locales, type Locale, type RouteKey } from "./routes";
import { getTranslatedSlug } from "./blog-slugs";

// Canonical + hreflang alternates for a static page. x-default points at
// English (the unprefixed default locale).
export function pageAlternates(key: RouteKey, locale: Locale): Metadata["alternates"] {
  return {
    canonical: localizedUrl(key, locale),
    languages: {
      en: localizedUrl(key, "en"),
      es: localizedUrl(key, "es"),
      "x-default": localizedUrl(key, "en"),
    },
  };
}

export function blogPostUrl(locale: Locale, slug: string): string {
  return locale === "en" ? `${BASE_URL}/blog/${slug}` : `${BASE_URL}/es/blog/${slug}`;
}

// Alternates for a blog post — only includes locales where a translation exists.
export function blogPostAlternates(locale: Locale, slug: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    const s = l === locale ? slug : getTranslatedSlug(locale, slug, l);
    if (s) languages[l] = blogPostUrl(l, s);
  }
  if (languages.en) languages["x-default"] = languages.en;
  return { canonical: blogPostUrl(locale, slug), languages };
}
```

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add lib/routes.ts lib/blog-slugs.ts lib/seo.ts
git commit -m "feat: central route registry, blog slug pairs, and hreflang helpers"
```

---

### Task 2: Derive `i18n/routing.ts` from the registry; rename route dirs + internal hrefs to English

These three changes are coupled (pathnames keys ↔ directory names ↔ typed hrefs) and must land in one commit.

**Files:**
- Modify: `i18n/routing.ts` (full rewrite below)
- Rename: `app/[locale]/precios/` → `app/[locale]/pricing/`
- Rename: `app/[locale]/producto/` → `app/[locale]/product/`
- Rename: `app/[locale]/privacidad/` → `app/[locale]/privacy/`
- Rename: `app/[locale]/terminos/` → `app/[locale]/terms/`
- Modify: `components/layout/footer.tsx:22,28,31` (3 hrefs)
- Modify: `components/layout/navbar.tsx:180` (1 href)

- [ ] **Step 1: Rewrite `i18n/routing.ts`**

```ts
import { defineRouting } from "next-intl/routing";
import { locales, staticRoutes, type RouteKey } from "@/lib/routes";

// pathnames derives from the central registry (lib/routes.ts). Internal keys
// are the English paths and MUST match the app/[locale]/ directory names.
const staticPathnames = Object.fromEntries(
  (Object.keys(staticRoutes) as RouteKey[]).map((key) => [key, { en: key, es: staticRoutes[key].es }]),
) as { [K in RouteKey]: { en: K; es: (typeof staticRoutes)[K]["es"] } };

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
  // Persist the visitor's language choice for a year (default cookie is session-only)
  localeCookie: { maxAge: 60 * 60 * 24 * 365 },
  pathnames: {
    ...staticPathnames,
    "/blog/[slug]": "/blog/[slug]",
  },
});
```

Note: if `defineRouting` rejects the readonly `locales` tuple, spread it: `locales: [...locales]`.

- [ ] **Step 2: Rename the route directories**

```bash
git mv "app/[locale]/precios" "app/[locale]/pricing"
git mv "app/[locale]/producto" "app/[locale]/product"
git mv "app/[locale]/privacidad" "app/[locale]/privacy"
git mv "app/[locale]/terminos" "app/[locale]/terms"
```

- [ ] **Step 3: Update internal hrefs to English keys**

In `components/layout/footer.tsx`: `href="/precios"` → `href="/pricing"`, `href="/privacidad"` → `href="/privacy"`, `href="/terminos"` → `href="/terms"` (leave `href="/blog"` as-is).

In `components/layout/navbar.tsx` navLinks: `href: "/precios" as const` → `href: "/pricing" as const`.

- [ ] **Step 4: Typecheck — this is the safety net for missed hrefs**

Run: `npm run typecheck`
Expected: exit 0. If it fails with an invalid `href`/pathname type error, a Spanish key was missed — fix and re-run.

- [ ] **Step 5: Build and smoke-test URLs**

Run: `npm run build`
Expected: exit 0.

Then **restart the dev server** (stale route manifests after directory renames can produce false 404s) and verify public URLs are unchanged (replace 3002 with the actual dev port):

```bash
curl -s -o /dev/null -w "%{http_code} " http://localhost:3002/pricing; \
curl -s -o /dev/null -w "%{http_code} " http://localhost:3002/es/precios; \
curl -s -o /dev/null -w "%{http_code} " http://localhost:3002/privacy; \
curl -s -o /dev/null -w "%{http_code} " http://localhost:3002/es/privacidad; \
curl -s -o /dev/null -w "%{http_code} " http://localhost:3002/product; \
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3002/es/terminos
```

Expected: `200 200 200 200 200 200` (curl sends no cookies, so no locale redirects interfere).

- [ ] **Step 6: Commit**

```bash
git add i18n/routing.ts "app/[locale]" components/layout/footer.tsx components/layout/navbar.tsx
git commit -m "refactor: derive pathnames from route registry, rename internal routes to English"
```

---

### Task 3: Derive `app/sitemap.ts` from the registry with hreflang alternates

**Files:**
- Modify: `app/sitemap.ts` (full rewrite below)

- [ ] **Step 1: Rewrite `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { localizedUrl, staticRoutes, type Locale, type RouteKey } from "@/lib/routes";
import { getAllSlugs } from "@/lib/blog";
import { getTranslatedSlug } from "@/lib/blog-slugs";
import { blogPostUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = (Object.keys(staticRoutes) as RouteKey[]).flatMap((key) => {
    const { changeFrequency, priority } = staticRoutes[key];
    const alternates = { languages: { en: localizedUrl(key, "en"), es: localizedUrl(key, "es") } };
    return [
      { url: localizedUrl(key, "en"), lastModified: new Date(), changeFrequency, priority, alternates },
      // Spanish entries rank one notch below their English counterparts (existing convention)
      {
        url: localizedUrl(key, "es"),
        lastModified: new Date(),
        changeFrequency,
        priority: Math.round((priority - 0.1) * 10) / 10,
        alternates,
      },
    ];
  });

  const blogPages = getAllSlugs().map(({ locale, slug }) => {
    const l = locale as Locale;
    const languages: Record<string, string> = { [l]: blogPostUrl(l, slug) };
    for (const other of ["en", "es"] as const) {
      if (other === l) continue;
      const translated = getTranslatedSlug(l, slug, other);
      if (translated) languages[other] = blogPostUrl(other, translated);
    }
    return {
      url: blogPostUrl(l, slug),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
      alternates: { languages },
    };
  });

  return [...staticPages, ...blogPages];
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0. (If `alternates` is rejected by `MetadataRoute.Sitemap`, check the Next 16 sitemap docs via context7 — the shape above matches Next ≥14.2.)

- [ ] **Step 3: Verify sitemap output**

With the dev server running:

Run: `curl -s http://localhost:3002/sitemap.xml`
Expected:
- Entries for all 6 static pages × 2 locales (12), including the previously missing `/es/privacidad` and `/es/terminos`
- 2 blog post entries
- `<xhtml:link rel="alternate" hreflang="en" ...>` / `hreflang="es"` elements on entries

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: derive sitemap from route registry with hreflang alternates"
```

---

### Task 4: Blog translation linkage — locale switcher targets the translated post

**Files:**
- Modify: `lib/blog.ts` (comment only — point authors at the pair registry)
- Modify: `components/layout/navbar.tsx` (LocaleSwitcher `switchTo`)

- [ ] **Step 1: Update the "add new posts" comment in `lib/blog.ts`**

Replace the comment on lines 3–4 (`// Static imports — ... Add new imports here as blog posts are created.`) with:

```ts
// Static imports — Webpack processes these at build time via asset/source rule.
// Adding a post: (1) import its .mdx here and add it to postRegistry below,
// (2) add its translation pair to lib/blog-slugs.ts (links locales for the
// locale switcher, hreflang, and sitemap alternates).
```

No other changes to `lib/blog.ts` — its per-locale registry API stays as-is; `lib/blog-slugs.ts` carries the linkage.

- [ ] **Step 2: Teach the LocaleSwitcher about blog posts**

In `components/layout/navbar.tsx`, add imports:

```ts
import { getTranslatedSlug } from "@/lib/blog-slugs";
import type { Locale } from "@/lib/routes";
```

Remove the local `type Locale = keyof typeof LOCALE_LABELS;` (line 12) — the imported `Locale` replaces it (`LOCALE_LABELS` keys already match).

Replace the `switchTo` function in `LocaleSwitcher` (currently lines 79–85):

```ts
const switchTo = (next: Locale) => {
  setOpen(false);
  onNavigate?.();
  if (next === locale) return;
  // Blog posts have per-locale slugs (welcome ⇄ bienvenido) — swap to the
  // translated slug, or fall back to the blog index if untranslated.
  const slug = typeof params?.slug === "string" ? params.slug : null;
  if (slug) {
    const translated = getTranslatedSlug(locale as Locale, slug, next);
    if (translated) {
      router.replace({ pathname: "/blog/[slug]", params: { slug: translated } }, { locale: next });
    } else {
      router.replace("/blog", { locale: next });
    }
    return;
  }
  // @ts-expect-error -- params type is route-specific; next-intl maps localized pathnames at runtime
  router.replace({ pathname, params }, { locale: next });
};
```

(The only route with a `slug` param is `/blog/[slug]`, so param presence is a safe discriminator.)

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 4: Verify in the browser (Playwright MCP)**

1. Navigate to `http://localhost:3002/blog/welcome` → switch language to Español → URL becomes `/es/blog/bienvenido`, Spanish post renders (NOT 404).
2. Switch back to English → `/blog/welcome`.
3. Sanity-check a static page still round-trips: `/pricing` → ES → `/es/precios` → EN → `/pricing` (reset cookie with `document.cookie = "NEXT_LOCALE=en; path=/"` if the EN URL redirects).

- [ ] **Step 5: Commit**

```bash
git add lib/blog.ts components/layout/navbar.tsx
git commit -m "fix: locale switcher maps blog posts to their translated slugs"
```

---

### Task 5: hreflang + canonical metadata on every page

**Files:**
- Modify: `app/[locale]/page.tsx` (add generateMetadata)
- Modify: `app/[locale]/product/page.tsx` (add generateMetadata)
- Modify: `app/[locale]/pricing/page.tsx` (extend existing)
- Modify: `app/[locale]/blog/page.tsx` (add generateMetadata)
- Modify: `app/[locale]/blog/[slug]/page.tsx` (add generateMetadata)
- Modify: `app/[locale]/privacy/page.tsx` (extend existing)
- Modify: `app/[locale]/terms/page.tsx` (extend existing)

- [ ] **Step 1: Pages with existing `generateMetadata` — add `alternates`**

`app/[locale]/pricing/page.tsx` — add imports and extend the return:

```ts
import { pageAlternates } from "@/lib/seo";
import type { Locale } from "@/lib/routes";
```

```ts
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return { title: t("metaTitle"), alternates: pageAlternates("/pricing", locale as Locale) };
}
```

`app/[locale]/privacy/page.tsx` — same imports, key `"/privacy"`. Note these legal pages build their title via `getLegalDoc(locale, ...)`, not `getTranslations` — keep the existing `title` line untouched and only add the `alternates` property.
`app/[locale]/terms/page.tsx` — same, key `"/terms"`.

- [ ] **Step 2: Pages without `generateMetadata` — add alternates-only metadata**

`app/[locale]/page.tsx` (title/description inherit from the locale layout):

```ts
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/seo";
import type { Locale } from "@/lib/routes";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: pageAlternates("/", locale as Locale) };
}
```

`app/[locale]/product/page.tsx` — same with key `"/product"`.
`app/[locale]/blog/page.tsx` — same with key `"/blog"`.

- [ ] **Step 3: Blog post metadata (title + alternates)**

`app/[locale]/blog/[slug]/page.tsx`:

```ts
import type { Metadata } from "next";
import { blogPostAlternates } from "@/lib/seo";
import type { Locale } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) return {};
  return {
    title: `${post.title} | ConvertChat`,
    description: post.description,
    alternates: blogPostAlternates(locale as Locale, slug),
  };
}
```

- [ ] **Step 4: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: both exit 0.

- [ ] **Step 5: Verify head tags**

```bash
curl -s http://localhost:3002/pricing | grep -o '<link rel="[^"]*" hreflang="[^"]*" href="[^"]*"' | head -5
curl -s http://localhost:3002/es/precios | grep -o '<link rel="canonical"[^>]*>'
curl -s http://localhost:3002/blog/welcome | grep -o 'hreflang="[^"]*"'
```

Expected:
- `/pricing`: alternate links for `en` (`https://convertchat.co/pricing`), `es` (`https://convertchat.co/es/precios`), `x-default` (en URL)
- `/es/precios`: canonical `https://convertchat.co/es/precios`
- `/blog/welcome`: hreflang `en`, `es`, `x-default`

- [ ] **Step 6: Commit**

```bash
git add "app/[locale]"
git commit -m "feat: canonical + hreflang alternates on all pages"
```

---

### Task 6: Full verification pass (spec checklist)

**Files:** none (verification only)

- [ ] **Step 1: Clean build**

Run: `npm run typecheck && npm run build`
Expected: exit 0.

- [ ] **Step 2: Every page × both locales loads (Playwright MCP or curl)**

All must render (200, correct language content): `/`, `/product`, `/pricing`, `/blog`, `/blog/welcome`, `/privacy`, `/terms`, `/es`, `/es/producto`, `/es/precios`, `/es/blog`, `/es/blog/bienvenido`, `/es/privacidad`, `/es/terminos`.

- [ ] **Step 3: Locale switcher round-trips on every page** (browser; reset NEXT_LOCALE cookie when testing EN URLs)

Including blog post: `/blog/welcome` ⇄ `/es/blog/bienvenido`.

- [ ] **Step 4: Legacy redirects still 308**

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3002/precios
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3002/terminos
```

Expected: `308 …/es/precios`, `308 …/es/terminos`.

- [ ] **Step 5: Navbar anchors from interior pages** (browser)

From `/es/precios`, click "El problema" → lands on `/es#problem` with the section scrolled into view (96px offset).

- [ ] **Step 6: Sitemap final check**

`curl -s http://localhost:3002/sitemap.xml` — 12 static entries + 2 blog entries, xhtml:link alternates present.

- [ ] **Step 7: Report results to Frank before any push**

Per project rules: never auto-push. Summarize verification, then Frank decides on /ship.
