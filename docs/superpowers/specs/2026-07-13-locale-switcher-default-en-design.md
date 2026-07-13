# Locale Switcher + English Default — Design Spec

**Date:** 2026-07-13
**Scope:** `i18n/routing.ts`, `components/layout/navbar.tsx`, `app/sitemap.ts`, `next.config.ts`, `messages/{en,es}.json`, `app/layout.tsx` + `app/[locale]/layout.tsx` (metadata)

## Goal

Two related changes, approved by the user:

1. **Switch the default locale from Spanish to English.** The audience is mostly international; Spanish speakers are auto-detected and redirected to `/es` by the existing next-intl middleware.
2. **Add an EN/ES language switcher to the navbar** so visitors can override the auto-detected language. The choice persists via next-intl's locale cookie.

## Non-Goals

- No login/PIN page (parked separately)
- No new translations — all existing `messages/*` content stays; only new keys for the switcher's accessible label
- No flag icons (user's no-generic-visuals rule) — text "EN" / "ES" only

## 1. Default Locale Switch

`i18n/routing.ts`: `defaultLocale: "es"` → `"en"`. `localePrefix: "as-needed"` stays. Also add `localeCookie: { maxAge: 60 * 60 * 24 * 365 }` — next-intl's default `NEXT_LOCALE` cookie is session-only; without `maxAge` the visitor's language choice would not survive closing the browser.

**Pathname keys stay Spanish-named.** The keys in the `pathnames` config (`/precios`, `/producto`, …) are internal route identifiers consumed by typed hrefs across the app (e.g. `href: "/precios" as const` in `navbar.tsx`). Only `defaultLocale` changes — do NOT rename the keys.

Resulting URL structure:

| Page | English (default, unprefixed) | Spanish (prefixed) |
|---|---|---|
| Home | `/` | `/es` |
| Product | `/product` | `/es/producto` |
| Pricing | `/pricing` | `/es/precios` |
| Blog | `/blog` | `/es/blog` |
| Privacy | `/privacy` | `/es/privacidad` |
| Terms | `/terms` | `/es/terminos` |

Browser-language detection and the `NEXT_LOCALE` cookie keep working unchanged (middleware is `createMiddleware(routing)` with defaults).

### Legacy URL redirects

Previously-live unprefixed Spanish URLs would 404 under the new default (e.g. `/precios` is no longer a valid English pathname). Add permanent redirects in `next.config.ts`:

- `/producto` → `/es/producto`
- `/precios` → `/es/precios`
- `/privacidad` → `/es/privacidad`
- `/terminos` → `/es/terminos`

(`/` and `/blog` remain valid paths in the new scheme; blog post slugs are per-locale files and `/blog/bienvenido` remains reachable via `/es/blog/bienvenido` — the old unprefixed `/blog/bienvenido` also gets a redirect to `/es/blog/bienvenido` for completeness: use `/blog/bienvenido` exact redirect, not a pattern.)

### Sitemap

`app/sitemap.ts` currently hardcodes Spanish-unprefixed/English-prefixed URLs. Flip: English entries unprefixed, Spanish entries under `/es/...`, and the blog mapping becomes `locale === "en" ? "" : "/es"`.

### Metadata

`app/layout.tsx` exports hardcoded metadata with a **Spanish** description ("Convierte leads en ventas por WhatsApp") — after the flip, the English default site would ship a Spanish meta description. Move the description into a localized `generateMetadata` in `app/[locale]/layout.tsx` reusing the **existing orphaned `metadata` namespace** in `messages/{en,es}.json` (already contains proper SEO titles/descriptions, currently unused); `app/layout.tsx` keeps only a minimal fallback (`title: "ConvertChat"`).

### hreflang / alternate links

Nothing to do: next-intl middleware emits `Link` alternate headers automatically (`alternateLinks` defaults to true) and self-corrects after the flip; no `alternates` exist in any page metadata.

## 2. Navbar Language Switcher

### Desktop (`md:` up)

- A compact button showing the current locale in uppercase with a chevron (e.g. `EN ⌄`), placed in the right-side group **before** the "Talk to us" CTA.
- Typography/colors match the existing nav links: `font-sans text-[15px]`, `text-white/55 hover:text-white/80` unscrolled, `text-neutral-500 hover:text-neutral-900` scrolled.
- Click toggles a small dropdown panel (rounded-xl, white bg, border, shadow — matching the mobile menu's surface style) with two rows: "English" and "Español". The active locale gets a check mark. Panel closes on selection, outside click, and Escape.

### Mobile (inside the hamburger dropdown)

- A final row after the nav links, visually separated by the existing border treatment: two inline options `EN · ES` (or "English / Español"), active one emphasized (text-neutral-900 font-medium vs text-neutral-400). Tapping switches locale and closes the menu.
- The open menu is height-clamped at `max-h-80` with `overflow-hidden` — the extra row fits (~280px total) but is close; bump the clamp (e.g. `max-h-96`) if the row clips.

### Behavior

- Switching navigates to the **same page** in the other locale using next-intl navigation: `router.replace({ pathname, params }, { locale })` with `usePathname()` + `useParams()` — this maps localized pathnames automatically (`/pricing` ⇄ `/es/precios`).
- next-intl sets the `NEXT_LOCALE` cookie on locale switch, so the choice sticks for future visits.
- **Blog post edge case:** slugs are per-locale content files (`welcome` vs `bienvenido`), so switching locale on a post keeps the same slug and may 404. Accepted for now (one post exists); posts' `notFound` already behaves sanely. Not worth a slug-mapping table yet.
- Accessible label from new i18n keys: `nav.language` ("Language" / "Idioma") used as `aria-label` on the control; option labels "English" / "Español" are proper nouns, hardcoded (same in both locales).

### Component placement

`LocaleSwitcher` lives as a small client component in `components/layout/navbar.tsx` (used twice: desktop dropdown + mobile row variant). It receives `scrolled` for color states.

## Reduced Motion / SSR

- Dropdown open/close is a simple CSS transition (opacity/translate) — negligible; no special reduced-motion handling needed beyond respecting existing patterns.
- The switcher renders identically on SSR and client (current locale comes from `useLocale()` — available server- and client-side; no hydration risk).

## Testing / Verification

- `npm run typecheck` passes
- Playwright (port 3002): `/` serves English; `/es` serves Spanish; desktop dropdown switches `/pricing` ⇄ `/es/precios`; mobile menu row switches locale and closes; cookie persists choice across a reload and has a ~1-year Max-Age (check the Set-Cookie/document.cookie attributes); legacy `/precios` redirects to `/es/precios`
- Verify navbar layout doesn't wrap at 320px with the new control; locale row fully visible in the open mobile menu
- `/` and `/es` `<meta name="description">` are English/Spanish respectively
- `curl -I` the four legacy redirects
