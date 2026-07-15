# Activity Log

## S1 — 2026-07-03 — Polish Pass Execution + Live Review

### Plan Execution (19 tasks)
- Updated color tokens (true neutral, accent purple, rainbow gradient)
- Created RainbowBorder component (animated gradient border wrapper)
- Refactored Problem, How It Works, Industries, Proof sections with RainbowBorder
- AI Agent section: dark card-as-section on white bg with purple glow
- CTA section: gradient moved into rounded inner card
- Footer: rewritten to white bg with Meta badge
- Navbar: full rewrite — full-width rounded-2xl, scroll-driven states
- Hero: Meta Partner badge added
- Platform section: hover lift/shadow effects
- FAQ section: new component with accordion (6 Q&As)
- Dead code cleanup (feature-cards.tsx removed, buying-section kept)
- DESIGN_SYSTEM.md updated

### Live Review Fixes
- FAQ section restyled as dark card-as-section (matching AI Agent)
- Meta badge: switched to white version (meta-partner-white.png), sized h-30
- Hero MeshGradient: removed blur, increased opacity to 60%, full coverage, speed 0.3
- Removed all overline labels from 10 sections (user: "looks AI generated")
- Before/After cards widened from max-w-5xl to max-w-6xl
- Navbar: larger sizing (md buttons, 15px links), real logos (white full unscrolled, green icon scrolled), centered nav links
- Footer: real color logo (1.png), aligned with tagline, Meta badge h-16

### Commits (website branch)
1. `80ffd20` — feat: add RainbowBorder reusable component
2. `c5ed8de` — feat: RainbowBorder on sections + AI Agent card + CTA card
3. `c92e9ab` — feat: footer, FAQ accordion, platform hover
4. `5148f00` — feat: navbar redesign + hero Meta badge + cleanup
5. `357e976` — docs: DESIGN_SYSTEM.md update
6. `ded6482` — polish: review pass — real logos, remove overlines, FAQ card, hero bg, navbar

## S2 — 2026-07-04 — Hero Phone Component

### Built
- `hero-phone.tsx` — CSS 3D perspective phone mockup with animated WhatsApp conversation
- Phone frame PNG with transparent screen, CSS perspective tilt, floating keyframe animation
- Framer Motion message sequencing with typing indicators
- Integrated into hero section right column

## S3 — 2026-07-07 — Card Icons + AI Agent Reframe

### Built
- Replaced card section icons with Lucide React SVGs on gradient glass pills
- Gradient bg + glow box-shadow + inner glass highlight treatment
- Applied to How It Works, Industries, Platform Features sections
- Proof section: real company logos (smilodox, tata-cliq, bgc-wholesale, unilever)
- AI Agent section: reframed with outcome-first positioning copy

## S4 — 2026-07-08 — Stats Section Redesign

### Built
- Added Clash Display font (Semibold + Bold) for stat numbers
- Rewrote `messaging-stat-section.tsx` — editorial layout on white bg
- 4-column grid with count-up animation, vertical dividers
- Mobile: 2x2 grid

## S5 — 2026-07-09 — AI Agent Day/Night Chat Cycle + Polish

### AI Agent Section Redesign
- Built `ai-agent-chat.tsx` — animated day/night cycle with two separate WhatsApp conversations
- Day conversation: electronics wholesaler FAQ (iPhone shipping, MOQ, pricing)
- Night conversation: urgent Samsung order — sale closed at 2:31 AM with order link
- Sky crossfade: two stacked gradient divs with JS mode-driven CSS transitions
- Sun/moon/stars animate in sync with conversation state machine
- Typing indicators with dot-bounce animation between messages
- AI badge ("ConvertChat AI" with Bot icon) on each AI response
- Reduced motion: static night view with all messages pre-rendered
- i18n: all chat text via next-intl keys (`aiAgent.chat.*`) in en.json + es.json

### Bug Fixes
- **CSS/JS desync**: Replaced CSS keyframe animations with JS mode-driven inline styles using CSS `transition`. CSS keyframes ran on fixed 20s loop but JS timers totaled ~25s, causing sun+moon to appear simultaneously.
- **Layout shift**: Changed chat container from `minHeight: 380` to fixed `height: 500` — prevents container expanding as messages appear.
- **Slow transitions**: Cut `TRANSITION_MS` from 2000ms to 800ms, `hold` delay from 1000ms to 500ms. Started next conversation during sky transition (not after). Dead time went from ~2600ms to near zero.

### Other Polish
- Problem section: stat numbers bumped (38→48px top, 28→36px bottom), "vs" text 13→18px
- Problem section: RainbowBorder card stretches to match left column height (`items-stretch`)
- CTA section: "Invite only" note wrapped in gradient border pill (matching hero style)

### Infrastructure
- DNS: Switched convertchat.co from Framer to Cloudflare Workers (A record → 192.0.2.1 proxied, www CNAME → convertchat.co proxied)
- CI/CD: Set up GitHub Actions auto-deploy on push to main (`.github/workflows/deploy.yml`)
  - Node 22 (Wrangler requires 22+), npm ci, opennextjs-cloudflare build + deploy
  - Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
  - Fixed: missing ClashDisplay font files not tracked in git, Node version bump 20→22

### Commits (main branch)
1. `61c6060` — feat: day/night chat cycle fixes, problem section polish, CTA invite pill
2. `f9e69ad` — ci: add GitHub Actions auto-deploy to Cloudflare Workers
3. `2974a83` — fix: add missing ClashDisplay font files
4. `7db2a7e` — fix: bump Node to 22 for Wrangler compatibility

## S6 — 2026-07-11 — FAQ Chevron, Footer Info + Mobile Responsive Pass

### Goal
Polish FAQ/footer details, then a full mobile responsiveness pass (all sections, 320–430px) with a second pass fixing typography hierarchy.

### Completed
- FAQ chevron redesign: gradient-border circle (h-9 w-9) with rotating chevron, matching brand gradient
- Footer company info: "Nillard Ltd · 71-75 Shelton Street, London" (en + es)
- Mobile pass 1 — layout (verified with Playwright at 320/375/390/430px):
  - Hero: all content centered on mobile (`text-center lg:text-left`), left-aligned from `lg:`
  - Hero H1: forced `<br>` now `hidden sm:block` — natural text flow on narrow screens
  - Hero buttons: natural width + centered on mobile (were full-width)
  - Meta badge: h-16 → h-20, centered on mobile
  - Hero section: `pt-28 pb-16` on mobile so navbar never covers the pill (was tight at 320px)
  - Button component: added `whitespace-nowrap` (navbar CTA wrapped to 2 lines at 320px)
  - Footer: logo, tagline, links, badge, legal all centered on mobile
- Mobile pass 2 — typography hierarchy:
  - Hero H1 36→42px, subtitle 18→16px, pill 14→12px on mobile
  - All 10 section H2s: 30→34px mobile base (desktop 44px unchanged)
  - All section leads: 18→16px on mobile (`text-base md:text-lg`)
  - Cards audited — already correct (18px serif titles / 14px body), untouched
- Mobile menu, dark card sections, and all grids verified clean at every viewport

### Decisions
- Mobile alignment: hero + footer centered; body section headings stay left-aligned (editorial style, better readability for long leads). Why: user asked for "more centered" — applied where it reads as intentional, not blanket.
- Mobile type scale: H1 42 → H2 34 → card titles 18 → leads 16 → body 14 → pill/labels 12. Why: at 390px the old scale (36/30/18/18/14) made H1, leads, and pill read as near-equal sizes.

### Lessons
- Multiple dev servers run locally — ConvertChat is on port 3002 (3000/3001 are other projects)
- Playwright MCP screenshots with custom `filename` save to `.playwright-mcp/` relative to CWD; omitting filename returns the image inline (more useful for auditing)

## S7 — 2026-07-11 — Smooth Scrolling (Navbar Anchors + Logo)

### Goal
Replace abrupt anchor jumps with smooth scrolling for navbar section links, and make the logo smooth-scroll back to the hero when already on the homepage.

### Completed
- `app/globals.css`: `html { scroll-behavior: smooth; scroll-padding-top: 96px }` — smooth anchor scrolling with navbar clearance, `prefers-reduced-motion` fallback to instant
- Covers "The problem", "How it works" navbar links and the hero "See how it works" button (all `#anchor` links)
- Navbar logo: on homepage, click intercepted → smooth-scroll to top (no re-navigation); on other pages navigates home normally; closes mobile menu if open
- Verified with Playwright: anchor lands with 96px offset, logo scroll animated (27 samples), typecheck passes

### Decisions
- CSS `scroll-behavior` over JS scroll libraries. Why: zero-dependency, covers all anchors automatically, and `window.scrollTo({ top: 0 })` without explicit behavior inherits it (so reduced-motion is respected in one place).

### Lessons
- Turbopack dev server can serve a stale CSS chunk after editing globals.css — request the page again (or hard refresh) to trigger the rebuild before concluding a CSS change "doesn't work"

## S8 — 2026-07-13 — Before/After Scroll Stack (Manychat-style)

### Goal
Replace the static before/after cards reveal with a scroll-linked animation: green "With ConvertChat" card slides over the gray "Without ConvertChat" card, rainbow scribble draws around the green headline. Full superpowers flow: brainstorm (visual prototype) → spec → plan → subagent-driven execution.

### Completed
- Rewrote `before-after-section.tsx`: 250vh section + sticky stage, Framer Motion useScroll/useTransform (fully scrubbed, reversible)
- Timeline: card travel eased over progress 0→0.75, SVG scribble draws 0.75→1 (pathLength=1 dashoffset trick)
- Percentage-based transforms (`-50% - gap/2`) — no element measurement, correct at every viewport width
- Mobile (<md): green card slides up from `translateY(100% + 20svh)` over the gray card; desktop slides horizontally with ~2.5° tilt mid-flight
- Reduced motion: static final composition, normal section height (verified via CDP emulation)
- Verified with Playwright: 1280×800, 1280×700, 390/320/430 mobile, reverse scrub, surrounding sections, es + en
- Performance measured: ~115 FPS dev, ~107 FPS prod build (transform/opacity only, no re-renders during scroll)

### Decisions
- Scribble draws OVER the headline text (matches approved prototype); pastel gradient stops (#a7f3d0 → #c4b5fd → #67e8f9) because full-saturation brand colors disappear on primary-500
- `overflow-x: clip` on the sticky stage (not `overflow: hidden`) — clips horizontal tilt spill without vertically cutting cards on short viewports
- `useIsDesktop` defaults true for SSR; section is below the fold so pre-hydration frame never visible

### Bugs Fixed
- `useReducedMotion` returns null on SSR but true on first client render → hydration mismatch; fixed with mounted gate
- Spanish copy clipped the green card's button at 390px (card height was pinned to shorter gray card via `h-full`); fixed with `grid min-h-full` on the mobile wrapper
- Green card mid-flight tilt spilled horizontally → stage `overflow-x: clip`

### Lessons
- No `.prettierrc` exists despite CLAUDE.md documenting printWidth 120 — bare `npx prettier` formats at 80 cols; pass `--print-width 120` explicitly (or add the config file)
- Spanish strings are ~10% longer — always spot-check `/es` at mobile widths when card heights are coupled
- Port 3003 is occupied by another local project (3000/3001/3002 also taken); use 3005+ for ad-hoc prod servers

### Parked (user decision)
- Login page with shared-PIN velvet-rope gate (env var, cookie skip, wrong PIN → book-a-call CTA) + navbar EN/ES dropdown — after pricing/product pages are finished

## S9 — 2026-07-13 — Locale Switcher + English Default

### Goal
Switch the default locale from Spanish to English (international audience) and add an EN/ES language switcher to the navbar. Full flow: brainstorm → spec (2 review passes) → plan (reviewed) → inline execution.

### Completed
- `i18n/routing.ts`: `defaultLocale: "en"` + `localeCookie: { maxAge: 1 year }` (default NEXT_LOCALE cookie is session-only). Pathname keys stay Spanish-named (internal identifiers)
- URL structure flipped: English unprefixed (`/`, `/pricing`, `/product`…), Spanish under `/es/...`
- `next.config.ts`: 5 permanent redirects for legacy unprefixed Spanish URLs (`/precios` → `/es/precios`, etc.) — all verified 308
- `app/sitemap.ts`: flipped to English-unprefixed / Spanish-prefixed entries
- Localized metadata: `generateMetadata` in `app/[locale]/layout.tsx` reusing the orphaned `metadata` i18n namespace (proper SEO titles); root layout keeps minimal fallback
- `LocaleSwitcher` in `navbar.tsx`: desktop `EN ⌄` dropdown (check on active, closes on outside click/Escape/selection), mobile "Language — EN · ES" row in hamburger menu (closes menu on switch); `nav.language` keys added (en/es)
- Switching maps localized pathnames via `router.replace({ pathname, params }, { locale })` — `/pricing` ⇄ `/es/precios` verified both directions
- Verified with Playwright: cookie persists 1 year (expires 2027-07), `/` → `/es` after choosing ES, meta descriptions per locale, sitemap URLs, 320/390/768/1024/1280 clean, typecheck passes

### Decisions
- Default locale English. Why: audience mostly international; Spanish speakers auto-detected via Accept-Language and redirected to `/es` by next-intl middleware.
- Navbar full-nav breakpoint moved `md` → `lg` (tablets 768–1023 get hamburger). Why: Spanish nav + switcher + CTA overflowed the bar by 76px at 768; production was already wrapping there before this change. Spanish text simply doesn't fit at md widths.

### Bugs Fixed
- Pre-existing: navbar wrapped/overflowed at 768px on production (Spanish links + CTA). Fixed by the `lg` breakpoint move; verified no overflow at 768 (hamburger) and 1024+ (full nav) in both locales.

### Lessons
- Desktop navbar's natural height is 80.5px (md Button is 50.5px tall) — don't assume ~66px when diagnosing wrap; compare against 1280px baseline
- next-intl with cookie set redirects unprefixed paths to the preferred locale's path (e.g. `/pricing` → `/es/precios` when NEXT_LOCALE=es) — expected detection behavior, not a bug

## S10 — 2026-07-13 — Privacy Policy & Terms of Service Pages + Navbar Solid Fix

### Goal
Replace the placeholder privacy/terms pages with the real legal documents (source drafts in `docs/privacy_and_terms/`), translated to Spanish, in a nicely formatted article layout.

### Completed
- `content/legal/{en,es}/{privacy,terms}.mdx` — 4 content files with frontmatter (title, effectiveDate). Privacy: 18 sections + Cookie Policy appendix (A1–A8). Terms: 17 sections + contact
- `lib/legal.ts` — static-import registry + gray-matter parsing (same pattern as `lib/blog.ts`), falls back to English for unknown locales
- `components/legal/legal-article.tsx` — custom ~90-line renderer for the markdown subset used (## / ### headings, bullet lists, **bold**, auto-linkified URLs/emails); no new dependency
- Rewrote `app/[locale]/privacidad/page.tsx` + `app/[locale]/terminos/page.tsx`: localized `generateMetadata`, `bg-neutral-50` article layout with `pt-36` to clear the fixed navbar
- Navbar fix: solid style (white card, dark links) forced on all non-home pages via `solid = scrolled || pathname !== "/"` — was white-on-white/invisible on light interior pages (pre-existing, affected blog too)
- Logo transition preserved on interior pages: full color logo at top → small icon on scroll (homepage keeps full white logo over dark hero)
- Verified with Playwright: all 4 pages at 1280 + 390 (no overflow), localized titles, footer links, navbar top/scrolled states, homepage transparency intact; typecheck passes

### Decisions
- Per-locale content files (blog pattern), NOT messages JSON. Why: long-form documents don't belong in i18n string files; gray-matter + raw mdx import infra already existed
- Custom minimal renderer instead of react-markdown. Why: controlled content subset, avoids a dependency (stdlib-over-deps preference)
- Editorial cleanups vs source drafts: placeholders resolved (NILLARD LTD trading as ConvertChat; England & Wales jurisdiction), effective date set to January 1st 2026, cookie policy aligned with reality (no GA/banner on the site; NEXT_LOCALE cookie listed)

### Lessons
- Spanish legal translations are machine-made, not lawyer-reviewed — flag for legal review before serious traffic
- The unscrolled transparent navbar assumed a dark hero; any new light-background route needs the solid variant (now automatic via pathname check)

## S11 — 2026-07-13/14 — Pricing Page (build + verification + allowance emphasis)

### Goal
Build the pricing page from spec/plan (three tiers, AI add-on, costs explainer, FAQ), verify in browser, and polish the tier cards. Session was interrupted by a power cut mid-verification; resumed 07-14 from git history + memory.

### Completed
- Spec + implementation plan + business docs (`docs/pricing.md`, `docs/core-product.md`, `docs/superpowers/plans/2026-07-13-pricing-page.md`)
- `pricing` i18n copy (en/es): tiers $49/$99/$199 (€ + /mes in es), allowances, features, AI add-on, costs, 5-item FAQ
- `components/sections/pricing-tiers.tsx` — hero + 3 cards; Growth on animated rainbow gradient with dark tint overlay, "Most popular" pill, white CTA; Enterprise "Need more?" banner
- `components/sections/pricing-ai-addon.tsx` — dark informational strip (+$49/mo, Growth/Pro only, no CTA)
- `components/sections/pricing-costs.tsx` — 3 plain columns (Meta at-cost, ~$0.06 / 0,05 € per message, email included)
- `components/sections/pricing-faq.tsx` — 5-question accordion, `pricing-faq-` id prefix (no collision with homepage FAQ)
- Assembled `app/[locale]/precios/page.tsx` with localized metadata
- Browser verification (Playwright): desktop EN/ES structure + copy, all 7 cal.com CTAs with `target="_blank"`, FAQ expand/collapse (aria-expanded), mobile 390 (Growth stacks first) + 320 (scrollWidth 305, no overflow)
- Allowance emphasis (visual-companion brainstorm, variant B chosen): quantities bold via next-intl rich text — `<b>` tags in message strings, `t.rich` maps to `text-[15px] font-semibold` span (neutral-900 / white on Growth)

### Decisions
- Bold numbers only, labels stay quiet. Why: the quantities (1,000 / 500 / 3,000) are what people compare between plans; three fully-bold lines read heavy. Alternatives considered: whole-line semibold, tinted allowance panel.
- Growth card readability: `bg-neutral-900/25` tint layer over the rainbow gradient so white text survives the yellow/green stops.

### Bugs Fixed
- Full-page Playwright screenshots show SectionReveal sections as empty gaps (whileInView never fires) — false alarm, not a bug; verify by scrolling sections into view instead

### Lessons
- A leftover dev server can hold the Next.js dev lock for this dir (found on port 3000 after the power cut); check `curl localhost:3000` before assuming 3002
- Bare `npx prettier` bit again (reformatted at 80 cols; redone with `--print-width 120`) — add the `.prettierrc` already
- Shared `CtaSection` heading renders "…worth?." (copy "?" + appended "."), pre-existing on homepage — pending user decision

### Commits
1. `e380de7` — docs: pricing page spec + implementation plan + business docs
2. `177fd50` — feat: pricing page i18n copy (en/es)
3. `e4508f4` — fix: add more-on-request qualifier to Pro contacts allowance
4. `545f3b4` — style: prettier formatting for pricing i18n copy
5. `24d12a4` — feat: pricing tiers section with rainbow Growth card + enterprise banner
6. `3dbe6e0` — feat: pricing AI add-on strip and messaging costs explainer
7. `74778bc` — feat: pricing FAQ accordion
8. `1ce4b2a` — feat: assemble pricing page with metadata
9. `11d4edb` — style: bold allowance numbers in pricing tier cards

## S12 — 2026-07-14 — Routing Architecture (central registry + hreflang)

### Goal
Rework the routing metadata so adding future pages (industries, comparisons, use cases, more blog posts) is maintainable long term: one source of truth, no drift, proper hreflang. Full superpowers flow: brainstorm → spec → plan → subagent-driven execution.

### Completed
- `lib/routes.ts` — central static route registry: English keys = English paths, Spanish translations, sitemap changeFrequency/priority, `localizedUrl()`, `BASE_URL`
- `lib/blog-slugs.ts` — client-safe blog translation pairs (welcome ⇄ bienvenido) + `getTranslatedSlug()`; no MDX imports so the navbar doesn't bundle post content
- `lib/seo.ts` — `pageAlternates` / `blogPostUrl` / `blogPostAlternates` producing canonical + hreflang (en, es, x-default → English)
- `i18n/routing.ts` — pathnames derived from the registry (Object.fromEntries + mapped-type cast preserves literal types, so stale hrefs are compile errors)
- Route dirs renamed to English: `precios→pricing`, `producto→product`, `privacidad→privacy`, `terminos→terms` (public URLs unchanged — pathnames map controls them)
- `app/sitemap.ts` fully derived from registry: per-locale entries + `alternates.languages` (xhtml:link); previously missing `/es/privacidad` + `/es/terminos` now present
- Locale switcher maps blog posts to their translated slug (was 404ing `/es/blog/welcome`); falls back to blog index if untranslated
- `generateMetadata` alternates on all 7 pages; blog `[slug]` gained locale-filtered `generateStaticParams` (no more cross-locale prerender combos)
- Navbar anchor fix committed (locale-aware `/#problem` / `/es#problem` plain anchors — works from privacy/terms/pricing)
- Final code review over the whole range: approved; 3 minor style items fixed in a polish commit
- Full verification (production build): 14 pages × 200, 6 switcher round-trips incl. blog posts, legacy 308s intact, hreflang/canonical in served HTML, sitemap 14 entries + 28 alternates, `/es/blog/welcome` → 404

### Decisions
- Central registry with everything derived (approach B). Why: 4 hand-maintained route sources had already drifted (sitemap missing 2 Spanish pages, no hreflang anywhere); planned growth compounds it
- Internal keys/directories in English matching the default locale. Why: `en` is default since S9; Spanish-named keys were a legacy confusion
- Blog slug pairs live in separate `lib/blog-slugs.ts`, not `lib/blog.ts`. Why: navbar (client) needs the pairs; importing blog.ts would bundle MDX content into client JS
- x-default → English URLs (the unprefixed default locale)

### Bugs Fixed
- Blog locale switcher 404 (`/blog/welcome` → `/es/blog/welcome`) — now swaps to `bienvenido`
- Sitemap missing `/es/privacidad` + `/es/terminos`
- Blog `generateStaticParams` prerendered cross-locale combos (`/es/blog/welcome`) — now filtered by parent locale param
- Navbar `#` anchors broken from interior pages (user re-reported on privacy/terms — was fixed locally, unpushed)

### Lessons
- Stale `.next` generated types break typecheck after route dir renames — `rm -rf .next` first
- next-intl `Locales` accepts a readonly tuple directly — no `[...locales]` spread needed
- Next outputs `hrefLang=` camelCase in HTML; lowercase grep gives false negatives, and dev streams metadata via RSC payload — verify hreflang against a production build
- Child `generateStaticParams` receives parent params synchronously — use it to filter dynamic slugs by locale
- SEO skill queued by user for later: https://github.com/AgriciDaniel/claude-seo.git — vet before installing. Carry-overs for that task: x-default in sitemap alternates, page-specific titles for home/product

### Commits
1. `aee7c50` — fix: navbar section anchors work from interior pages via locale-aware hrefs
2. `5ad9cf4` — docs: routing architecture spec
3. `89f0816` — docs: routing architecture implementation plan
4. `df0c199` — feat: central route registry, blog slug pairs, and hreflang helpers
5. `9d7064b` — refactor: derive pathnames from route registry, rename internal routes to English
6. `a6acc78` — refactor: pass readonly locales tuple directly to defineRouting
7. `842a1f2` — feat: derive sitemap from route registry with hreflang alternates
8. `234b52d` — fix: locale switcher maps blog posts to their translated slugs
9. `ed0a333` — feat: canonical + hreflang alternates on all pages
10. `713f7c3` — style: group imports at top of blog and product pages
11. `b864d5f` — style: review polish — import grouping, locales shorthand, registry-driven sitemap locale loop

## S13 — 2026-07-14 — SEO Refinement (metadata, OG cards, JSON-LD, GSC prep)

### Goal
Complete search/social presence on top of S12's routing foundation: unique per-page metadata, Open Graph cards, real favicons, structured data, llms.txt alignment, sitemap x-default — everything needed before Google Search Console verification. Full superpowers flow: vet claude-seo repo → brainstorm → spec → plan → subagent-driven execution.

### Completed
- Vetted claude-seo repo read-only into `/tmp/claude-seo-vet` (not installed) — used as grounding reference alongside Context7 Next.js 16 docs
- OG cards `public/og/og-en.png` + `og-es.png` (1200×630, ~95KB): dark hero bg with green/purple glows, white logo, Newsreader headline "Sell on WhatsApp. At scale." / "Vende por WhatsApp. A escala." — design approved via visual companion
- Real favicons from brand icon: `app/favicon.ico` (16/32/48), `app/icon.png` (512), `app/apple-icon.png` (180, opaque) — stock Next triangle gone
- Per-page meta strings (en/es): new `product`/`blog`/`legal` namespaces + `pricing.metaDescription`
- `lib/seo.ts`: `pageMetadata()` / `blogPostMetadata()` helpers (title, description, alternates, openGraph, twitter) + `metadataBase` in root layout; all 7 pages wired through them — zero piecemeal metadata left in `app/`
- JSON-LD: `components/seo/json-ld.tsx` (escaped `<` → `\u003c`) + `lib/schema.ts` builders — Organization + WebSite + FAQPage(6) on home, FAQPage(5) on pricing, BlogPosting on posts, localized
- `public/llms.txt` + `llms-full.txt`: positioning aligned ("WhatsApp remarketing and lead reactivation platform for B2B"), legacy `/producto`-style URLs → canonical English, `/pricing` added
- `app/sitemap.ts`: x-default on all alternates (static inline + guarded blog loop)
- End-to-end verification: 14 pages × unique title/description/og:*/twitter:* with correct locale OG image, all assets 200, JSON-LD valid, sitemap 14× x-default, green favicon confirmed
- Final holistic code review over the whole range: approved after one whitespace fix

### Decisions
- Helper-only metadata policy. Why: Next.js shallow-merges `openGraph` across segments — a page defining its own silently drops shared fields; documented in `lib/seo.ts`
- One static brand OG card (en/es variants), no dynamic `next/og` per-page images. Why: YAGNI at current page count
- No Offer/Product schema on pricing tiers. Why: Google's product markup targets physical/e-commerce; SaaS tier markup risks spam manual actions
- FAQPage on homepage too (not just pricing). Why: nearly free once the builder existed; feeds AI answers even though Google restricts FAQ rich display
- GSC deferred as manual post-deploy step (DNS TXT in Cloudflare). Why: no on-site code needed, and we get zero keyword data until it's verified — it is the next highest-leverage action

### Bugs Fixed
- (Process) Task 4 implementer ran bare `npx prettier --write` — repo has no prettier config so it mangled 120-width code to 80; caught via `git show`, fixed with explicit flags; all later prompts carried an explicit warning

### Lessons
- Repo has NO `.prettierrc` — bare prettier defaults to width 80 and silently reformats; always pass `--print-width 120 --semi --no-single-quote --trailing-comma all` (adding a `.prettierrc` is already on the checklist)
- Next 16 sitemap `Languages<T>` type includes `'x-default'` — verified in node_modules before planning, so no conditional needed
- Twitter cards inherit title/description/images from `openGraph` in Next's metadata resolver — only `card: "summary_large_image"` needs setting
- Playwright MCP blocks `file://` URLs — screenshot local HTML via `npx playwright screenshot` CLI instead
- Site is already indexed and #1 for brand query "convertchat.co", but keyword targets are positioning-driven guesses; no ranking data exists until GSC is verified — resist keyword-research infra before traffic

### Commits
1. `b607802` + `d1ea909` — docs: SEO refinement spec (+ review fixes)
2. `0993079` + `c020679` — docs: SEO refinement implementation plan (+ advisory tweaks)
3. `b22f2ed` — feat: brand OG card images (en/es)
4. `5d07645` — feat: real favicons from brand icon
5. `8141c60` — feat: per-page meta titles and descriptions (en/es)
6. `d5e3639` + `4afbcb5` — feat: pageMetadata/blogPostMetadata helpers + metadataBase (+ style restore)
7. `d40c8be` — feat: unique titles, descriptions and OG/Twitter tags on every page
8. `84b97e8` + `27e12f2` — feat: JSON-LD structured data (+ style)
9. `1d1b843` — fix: llms.txt aligned with current URLs and positioning
10. `b802879` + `02b93bc` — feat: x-default hreflang in sitemap alternates (+ style)
11. `a04c37e` — style: prettier formatting for blog post page

## S14 — 2026-07-15 — GSC live + Cloudflare Web Analytics

### Goal
Close out the S13 post-deploy manual steps with Frank (non-technical, guided via screenshots): Google Search Console verification + sitemap, and set up traffic analytics so it's not forgotten.

### Completed
- Confirmed convertchat.co is indexed and #1 for the brand query; namespace is crowded (convertchat.app, convertchatbot.com, convertchats.com)
- GSC: existing property was verified via Google Analytics from the old Framer site (would lapse — new site has no GA); added permanent DNS verification via Google's Cloudflare OAuth flow ("Domain name provider" → Start Verification). Two green checks now
- Sitemap: old Framer sitemap lived at the same `/sitemap.xml` path — no cleanup needed; resubmitted, Google confirmed
- Cloudflare Web Analytics: tried auto-injection ("Enable" RUM) — beacon never appeared on the live site (known limitation on Workers-served sites); switched to manual JS snippet in `app/layout.tsx`, shipped (`7413ccb`), verified beacon in production HTML
- Triaged Frank's Instagram-reel legal checklist: AI disclosure (relevant via EU AI Act, product-level) + EU-fit dispute clause → added to the lawyer-review scratchpad item; app-store nutrition labels + DMCA agent = N/A (no mobile app, no UGC)

### Decisions
- Cloudflare Web Analytics over GA4/PostHog. Why: cookieless → no consent banner (GDPR), free, one line of code; GA adds cookie-banner obligations for data we don't need pre-traffic
- Full "Enable" (not EU-excluded). Why: audience is largely EU/Spain; excluding EU would hide most visitors, and the beacon collects no personal data
- Keyword work deferred until GSC has 2–4 weeks of Performance data. Why: current targets are positioning-driven guesses; optimize from real queries, not assumptions. Blog content is the main ranking lever (1 post live)

### Lessons
- Cloudflare Web Analytics auto-injection does NOT work on Workers-served sites — use the manual beacon snippet
- GSC "verified via Google Analytics" breaks silently when a site is rebuilt without GA — always add DNS verification while still verified
- Google's GSC DNS flow can add the TXT record itself via Cloudflare OAuth — easiest path for non-technical owners

### Commits
1. `e86f619` — docs: S13 session log — SEO refinement
2. `7413ccb` — feat: Cloudflare Web Analytics beacon (cookieless)

## S15 — 2026-07-15 — Navbar Log in + rainbow CTA, blog content kickoff

### Goal
Resolve the parked login-gate item, make the navbar login prominent, and start the blog content project (the main SEO ranking lever).

### Completed
- Brainstormed the parked S8 shared-PIN gate → killed it (YAGNI). A marketing-site PIN is theater: web.convertchat.co is directly reachable, and the app currently allows open self-signup (confirmed via Frank's screenshot — Sign Up + Continue with Google)
- Real exclusivity moves to the app: wrote a paste-ready brief for Frank's app-side Claude Code session (invite code required at signup, validated server-side; Google OAuth must not auto-create accounts; no-code path → book-a-call CTA; audit other registration paths)
- Website: navbar "Log in" → https://web.convertchat.co. Desktop: outlined Button (glass over hero / ghost when solid) between locale switcher and CTA; mobile: full-width ghost button in hamburger above the language row. i18n keys `nav.login` already existed
- Rainbow border on the "Talk to us" navbar CTA (RainbowBorder, 2px padding, 26px outer radius) after showing Frank a live comparison; fixed initial radius mismatch
- Spec: `docs/superpowers/specs/2026-07-15-login-link-design.md`
- GSC: /es "URL is not on Google" triaged — expected (new URL post-S12 rework, never crawled); live test + Request Indexing run
- Blog content brainstorm started (strategy locked, topic selection pending DataForSEO)

### Decisions
- Navbar order EN/ES · Log in · Talk to us. Why: far-right is the strongest anchor and belongs to the money CTA; Frank's first proposal put the locale switcher there
- No blue pill for Log in. Why: blue isn't in the design system, and Frank himself rejected pill shapes as "AI-looking" (documented in button.tsx)
- Rainbow on the CTA only, never on Log in. Why: emphasis works by scarcity; two rainbow buttons = template look, inverted hierarchy
- Blog strategy C: commodity how-to guides drafted solo + flagship posts built on Frank's real campaign data/stories. Why: coverage fast + E-E-A-T authority where it counts
- Bylines: "Francisco Nillard — Founder, ConvertChat" on flagship posts, "ConvertChat Team" on commodity guides
- Product page media: Frank records screen videos → convert to muted looping MP4/WebM, NOT GIFs. Why: GIFs are 5–15MB and would wreck page speed
- Lawyer review bypassed for now (Frank's call); keep the free self-serve AI-disclosure line in the backlog
- DataForSEO MCP added by Frank (local scope, `claude mcp add dataforseo ... npx -y dataforseo-mcp-server`) — real keyword volume/difficulty for topic selection; pending session restart to verify

### Bugs Fixed
- Rainbow border looked "too square" around the CTA: this theme's `rounded-xl` resolves to 24px (custom design tokens), not Tailwind's default 12px — wrapper was 14px outer. Measured computed styles in the browser, set outer 26px = 24 + 2px padding

### Lessons
- Never assume Tailwind default values in this repo — `@theme inline` overrides tokens (rounded-xl = 24px); measure `getComputedStyle` before wrapping components
- RainbowBorder hugging rule: outer radius = child's real radius + padding

### Blog kickoff state (resume here after restart)
- Approved: strategy C, bylines above, en+es via existing MDX framework
- Next: verify DataForSEO MCP tools → keyword research (WhatsApp remarketing / lead reactivation cluster) → propose post list → spec `2026-07-15-blog-content-design.md` → writing-plans
