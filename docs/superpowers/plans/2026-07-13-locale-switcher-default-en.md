# Locale Switcher + English Default — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline execution chosen by user). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Switch the site's default locale from Spanish to English and add an EN/ES language switcher to the navbar.

**Architecture:** Pure config flip in next-intl routing (`defaultLocale`), legacy-URL redirects in next.config, sitemap/metadata updates, and one new client component (`LocaleSwitcher`) rendered twice inside the existing navbar. No new dependencies.

**Tech Stack:** Next.js 16, next-intl 4 (typed navigation with localized pathnames), Tailwind v4.

**Spec:** `docs/superpowers/specs/2026-07-13-locale-switcher-default-en-design.md`

**Note:** No test framework in this repo — verification is `npm run typecheck` + Playwright MCP against the dev server on port 3002.

---

### Task 1: Default locale flip (routing, redirects, sitemap, metadata)

**Files:**
- Modify: `i18n/routing.ts`
- Modify: `next.config.ts`
- Modify: `app/sitemap.ts`
- Modify: `app/layout.tsx`
- Modify: `app/[locale]/layout.tsx`
- Modify: `messages/en.json`, `messages/es.json`

- [ ] **Step 1: `i18n/routing.ts`** — change `defaultLocale: "es"` to `"en"` and add the persistent cookie. Do NOT rename pathname keys (they're internal identifiers):

```ts
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeCookie: { maxAge: 60 * 60 * 24 * 365 },
  pathnames: { /* unchanged */ },
});
```

- [ ] **Step 2: `next.config.ts`** — add `async redirects()` as a top-level property of the `nextConfig` object, alongside `output`, `turbopack`, and `webpack` (inside the object passed to `withNextIntl`):

```ts
async redirects() {
  return [
    { source: "/producto", destination: "/es/producto", permanent: true },
    { source: "/precios", destination: "/es/precios", permanent: true },
    { source: "/privacidad", destination: "/es/privacidad", permanent: true },
    { source: "/terminos", destination: "/es/terminos", permanent: true },
    { source: "/blog/bienvenido", destination: "/es/blog/bienvenido", permanent: true },
  ];
},
```

- [ ] **Step 3: `app/sitemap.ts`** — flip URL scheme: English unprefixed (`/`, `/product`, `/pricing`, `/blog`, `/privacy`, `/terms`), Spanish prefixed (`/es`, `/es/producto`, `/es/precios`, `/es/blog`, `/es/privacidad`, `/es/terminos`). Keep the same priorities shape (primary locale slightly higher). Blog mapping becomes `locale === "en" ? "" : "/es"`.

- [ ] **Step 4: metadata** — REUSE the existing (currently orphaned) `"metadata"` namespace already present in both message files (en.json/es.json line ~226, with proper SEO titles like "ConvertChat | WhatsApp Remarketing & Lead Reactivation for B2B"). No new message keys needed.

In `app/[locale]/layout.tsx`: add `getTranslations` to the **existing** `next-intl/server` import (which already has `getMessages, setRequestLocale`), add `import type { Metadata } from "next"`, then add:

```tsx
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("title"), description: t("description") };
}
```

In `app/layout.tsx`: change ONLY the `metadata` export to `{ title: "ConvertChat" }` (drop the Spanish description). Leave `getLocale` and `<html lang={locale}>` untouched.

- [ ] **Step 5: `npm run typecheck`** — expect clean.

### Task 2: Navbar `LocaleSwitcher`

**Files:**
- Modify: `components/layout/navbar.tsx`
- Modify: `messages/en.json`, `messages/es.json` (`nav.language` key)

- [ ] **Step 1: i18n keys** — `nav.language`: en `"Language"`, es `"Idioma"` (aria-label only; option labels "English"/"Español" are proper nouns, hardcoded).

- [ ] **Step 2: component** — add to `navbar.tsx`. IMPORT MERGES (do not add duplicate import lines): add `useLocale` to the existing `next-intl` import (has `useTranslations`); add `useRouter` to the existing `@/i18n/navigation` import (has `Link, usePathname`); add `useRef` to the existing `react` import (has `useEffect, useState`); add a new `import { useParams } from "next/navigation";`. Then:

```tsx
const LOCALE_LABELS = { en: "English", es: "Español" } as const;

function LocaleSwitcher({ scrolled, onNavigate }: { scrolled: boolean; onNavigate?: () => void }) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchTo = (next: "en" | "es") => {
    setOpen(false);
    onNavigate?.();
    if (next === locale) return;
    // next-intl official recipe: params can't be statically verified for the typed pathname
    // @ts-expect-error -- params type is route-specific
    router.replace({ pathname, params }, { locale: next });
  };
  /* render: button `EN ⌄` + dropdown panel, see Step 3 */
}
```

- [ ] **Step 3: desktop render** — trigger button styled like nav links (`font-sans text-[15px]`, scrolled ? `text-neutral-500 hover:text-neutral-900` : `text-white/55 hover:text-white/80`), uppercase locale + rotating chevron svg; panel `absolute right-0 top-full mt-2 w-40 rounded-xl border border-neutral-200/80 bg-white/95 shadow-lg backdrop-blur-[20px] py-1.5`, rows = buttons with `LOCALE_LABELS`, active row gets a check svg + `text-neutral-900`, inactive `text-neutral-500 hover:text-neutral-900`. `aria-label={t("language")}`, `aria-expanded={open}`, `aria-haspopup="listbox"`. Place inside the desktop CTA group (`hidden md:flex`), before the Button.

- [ ] **Step 4: mobile render** — render a second, row-styled variant inside the mobile dropdown after the nav links, passing the close callback as a prop: `<LocaleSwitcherMobileRow onNavigate={() => setMobileOpen(false)} />` (or a `variant` prop on the same component — implementer's choice; `onNavigate` is a component prop consumed inside `switchTo`, NOT a `switchTo` argument). Row: `border-t border-neutral-200/60 mt-2 pt-3`, `t("language")` label left, two buttons `EN` / `ES` right (active: `text-neutral-900 font-medium`; inactive: `text-neutral-400`). If the row clips against the menu's `max-h-80`, bump to `max-h-96`.

- [ ] **Step 5: `npm run typecheck`** — expect clean. Also `npx prettier --check --print-width 120 --semi --trailing-comma all components/layout/navbar.tsx`.

### Task 3: Verify with Playwright (port 3002)

Prerequisite: `npm run dev` running on port 3002 (other projects occupy 3000/3001/3003).

- [ ] **Step 1: default flip** — fresh context (no cookie): `/` serves English (h1 English), `/es` serves Spanish. `document.documentElement.lang` = "en" / "es".
- [ ] **Step 2: legacy redirects** — `curl -sI http://localhost:3002/precios | grep -i location` → `/es/precios` (repeat for producto/privacidad/terminos/blog/bienvenido). Expect 308.
- [ ] **Step 3: desktop switcher** — 1280×800 on `/pricing`: open dropdown, click Español → URL `/es/precios`, page Spanish. Switch back → `/pricing`. Check cookie via Playwright `context.cookies()` — `NEXT_LOCALE` present with ~1-year expiry.
- [ ] **Step 4: mobile switcher** — 390×690: hamburger → locale row visible (not clipped), tap ES → Spanish + menu closed. 320×690: navbar doesn't wrap.
- [ ] **Step 5: metadata** — `/` meta description English, `/es` Spanish.
- [ ] **Step 6: sitemap** — `curl http://localhost:3002/sitemap.xml` reflects new scheme.
- [ ] **Step 7:** `npm run typecheck` final. User reviews, then ships via /ship (include spec + plan + activity/scratchpad updates).
