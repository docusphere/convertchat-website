# Pricing Page — Design Spec

_Date: 2026-07-13_
_Status: approved decisions from discussion; supersedes the tier numbers in `docs/pricing.md` for the website_

## Goal

Replace the "coming soon" placeholder at `app/[locale]/precios/page.tsx` with a real pricing page: 3 paid tiers, book-a-call CTAs, grounded in what the app (convertchat_neurium) can actually deliver today.

## Business Decisions (settled)

| Decision | Choice | Rationale |
|---|---|---|
| CTAs | Every tier → Cal.com booking (`https://cal.com/architct/onboarding`), framed as white-glove setup | No self-serve onboarding or Stripe yet; manual setup required |
| Tiers | 3 paid: Starter / Growth / Pro. No Free tier card | Free tier needs self-serve; every call should be a potential payer |
| Prices | 49 / 99 / 199 per month, labeled "Early access pricing" | $29 too cheap for call-based onboarding; label gives license to change |
| Currency | EUR on `/es/precios`, USD on `/pricing` — identical digits (€49 / $49) | Spain is the beachhead; USD for international; same digits avoid price-list drift |
| WhatsApp fees | Customer pays Meta directly at cost, **0% markup** — headline differentiator | Architecturally true today (customers connect their own WABA, Meta bills their card); attacks ManyChat/Superchat fee models |
| Message credits / markup | NOT now. Revisit when volume justifies Tech Provider credit-line billing | Reversible later: copy + billing change, not a site rewrite |
| Stripe | NOT now. CTAs swap to checkout links later | |
| Competitive comparison table | Skipped for now | |
| Seats/users | No users row shown (app supports 1 user per company) | Don't promise unbuilt team features |
| WhatsApp numbers | "1 WhatsApp number" on all tiers (Pro: "more on request") | App only uses 1 active number today |
| Pro contacts | Capped at 25,000 (more on request), NOT unlimited | "Unlimited" at €199 would block future contact-based expansion pricing (Klaviyo model); raising a cap later is easy, taking away unlimited is not |
| Enterprise | No 4th card — slim "Need more?" banner under the grid → Cal.com | App has no enterprise features (1 user, 1 number, no API/SSO); banner captures >25k-contact leads without promising unbuilt features |

## Tier Content (source of truth for the page)

| | Starter 49 | Growth 99 | Pro 199 |
|---|---|---|---|
| Persona line | For solo operators | For growing businesses | For serious senders |
| Contacts | 1,000 | 5,000 | 25,000 (more on request) |
| Email sends/mo | 3,000 | 10,000 | 50,000 |
| WhatsApp campaign msgs/mo | 500 | 2,000 | 10,000 |
| WhatsApp number | 1 | 1 | 1 (more on request) |
| Inbox | Included | Included | Included |
| AI Agent | — | +49/mo add-on | +49/mo add-on |
| Analytics | Campaign stats | Full funnel | Full funnel |
| Support | Email | Priority | Dedicated onboarding |

Notes:
- All quotas are per workspace, not per user.
- Email quotas sized against the shared Resend account cost (ConvertChat pays Resend; ~$20/mo per 50k emails).
- WhatsApp msg caps are expectation-setting only — no enforcement exists in the app yet.
- "Most popular" highlight: Growth (center card).

## Page Structure (top to bottom)

1. **Hero** — `pt-36` to clear navbar (navbar renders solid on this page automatically). Small "Early access pricing" pill, serif H1 ("Simple pricing. No contracts."), subline with the three attack lines: no seat minimums · cancel anytime · 0% message markup.
2. **Tier cards** — 3 cards in a `md:grid-cols-3` grid, `max-w-6xl`. Starter/Pro: white cards, `border-neutral-200`. Growth center card: **full animated rainbow background** (reuse `var(--rainbow-gradient)` + `rainbow-shift` animation from `RainbowBorder`, `backgroundSize: 200% 200%`), slight lift (`md:-translate-y-2`), colored shadow, dark "Most popular" pill. Legibility rules for the rainbow card: all text white (secondary text `white/75`), divider `white/25`, check icons white (not green), CTA is a WHITE button with dark text (not green). User explicitly chose full rainbow over rainbow-border and lavender alternatives (visual mockup session 2026-07-13). Each card: tier name, persona line, price (`€49`/`$49` + `/mo`, set in Newsreader serif — NOT Clash Display), allowances block (contacts, WhatsApp msgs/mo, emails/mo), divider, check-icon feature list (enumerated below), CTA Button ("Get set up with us") → Cal.com, new tab. Mobile: cards stack, Growth first.

   Check-icon feature list per tier (allowances block covers contacts/messages/emails; this list covers the rest):
   - **Starter**: 1 WhatsApp number · Shared inbox · Campaign stats · Email support. (No AI Agent line — omit the row entirely, no strikethrough.)
   - **Growth**: 1 WhatsApp number · Shared inbox · Full funnel analytics · Priority support · AI Agent available (+€49/+$49 per mo).
   - **Pro**: 1 WhatsApp number (more on request) · Shared inbox · Full funnel analytics · Dedicated onboarding · AI Agent available (+€49/+$49 per mo).
3. **Enterprise banner** — slim full-width strip directly under the tier cards (same `bg-neutral-50` section): one line, e.g. "Need more? Higher volumes, multiple numbers, tailored onboarding — we'll build you a custom plan on the call." + text link/button → Cal.com, new tab. Catch-all for leads above Pro's 25k contact cap. Not a 4th card — the app has no enterprise features to promise; this stays honest while capturing big fish.
4. **AI Agent add-on strip** — dark rounded card (matches FAQ/AI-agent section style): headline + one-liner ("It replies, qualifies and sells while you sleep"), "+€49/mo" (es) / "+$49/mo" (en) "· available on Growth and Pro". No CTA — informational only.
5. **Messaging costs explainer** — 3 short columns: (a) WhatsApp fees go directly to Meta at cost, 0% markup ever; (b) marketing messages cost roughly €0.05 (es page) / $0.06 (en page) each, replies within 24h are free; (c) email sending included in your plan. Purpose: transparency = differentiator.
6. **FAQ** — reuse the FAQ accordion pattern (dark card style as homepage FAQ, or light variant — implementer follows DESIGN_SYSTEM). 5 questions:
   1. What happens on the call? (30-min setup: connect WhatsApp, import contacts, first campaign)
   2. Are there contracts or minimums? (No. Monthly, cancel anytime, no seat minimums)
   3. What do WhatsApp messages cost? (Meta bills you directly at cost — roughly €0.05 per marketing message in Spain (es page) / roughly $0.06 per marketing message in most markets (en page); replies within 24h are free; we add 0% markup)
   4. Can I change plans later? (Yes — switch up or down anytime; changes apply next billing cycle.)

   5. Do I need a new phone number? (Existing or new number works; set up together on the call)

   > Spec note (editorial, not page copy): FAQ 4 makes no price-lock/grandfathering promise unless Frank opts into one later.
7. **CTA section** — reuse existing `CtaSection` component as-is.

## Implementation Shape

- **Page**: rewrite `app/[locale]/precios/page.tsx` as a server component (like producto page): `setRequestLocale`, assemble section components. Add `generateMetadata` with localized title (e.g. "Pricing | ConvertChat" / "Precios | ConvertChat").
- **New components** in `components/sections/`:
  - `pricing-tiers.tsx` — hero + cards + Enterprise banner (client component only if needed; prefer server + `SectionReveal`)
  - `pricing-ai-addon.tsx` — dark strip
  - `pricing-costs.tsx` — messaging costs explainer
  - `pricing-faq.tsx` — accordion (client, mirrors existing FAQ section component)
  - Keep files small; if hero is trivial it can live inside `pricing-tiers.tsx`.
- **i18n**: ALL copy in `messages/en.json` + `messages/es.json` under expanded `pricing` namespace. Numbers/prices also in messages. Digits identical across locales for tier and add-on prices only; per-message examples differ per the Currency line below ($0.06 / €0.05). Existing `pricing.title/comingSoon/cta/ctaSub` keys are replaced.
- **Spanish copy is primary** (Spain is the beachhead). English strings in this spec are the source; the implementer drafts the Spanish equivalents following the tone in `docs/website-copy-positioning.md` and existing `messages/es.json` conventions. Flag both languages for user review before shipping.
- **Currency**: locale decides symbol — en → `$`, es → `€`. Applies to ALL money strings: tier prices, AI add-on (+$49 / +€49), and per-message examples ($0.06 / €0.05). Store full price strings in messages (e.g. `"price": "$49"` / `"price": "€49"`) rather than runtime formatting. Simple > clever.
- **Backgrounds** (avoid mid-page seams): hero + tier cards share ONE section on `bg-neutral-50`; AI add-on strip = dark card inside a `bg-white` section; costs explainer = `bg-white`; FAQ = dark card on `bg-white` (same pattern as homepage FAQ); `CtaSection` brings its own background.
- **Design system**: Newsreader serif headings, Satoshi body, `rounded-xl` buttons (NOT pill), `max-w-6xl`, section padding `py-16 md:py-36`, `SectionReveal` on sections, no overlines/uppercase labels.
- **Sitemap/routing**: `/precios` already exists in routing + sitemap — no changes needed.

## Out of Scope

- Stripe checkout / payment links
- Free tier
- Credits/coin wallet system (app feature, later)
- Competitive comparison table
- Quota enforcement (app-side)
- Team seats
- Updating `docs/pricing.md` business doc is a nice-to-have follow-up, not part of the page build

## Testing / Verification

- Playwright: `/pricing` (USD copy) and `/es/precios` (EUR copy) at 1280 and 390 widths; no horizontal overflow at 320
- All tier CTAs open Cal.com in new tab
- FAQ accordion expands/collapses
- Localized `<title>` per locale
- `npm run typecheck` clean; formatting via `npx prettier --check --print-width 120 --semi --trailing-comma all <changed files>` (repo has no prettier config file — flags are mandatory)
