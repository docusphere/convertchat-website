# ConvertChat Website — Scratchpad

## Strategy
Marketing website for ConvertChat — B2B WhatsApp lead reactivation platform. Invite-only early access. Target: e-commerce brands with dormant contact lists. Key message: "Your store never closes" — AI-powered 24/7 WhatsApp conversations that turn old leads into buyers.

## BUILD CHECKLIST

### Sections (page order)
- [x] S1 — Navbar (full-width, scroll states, mobile hamburger)
- [x] S1 — Hero (MeshGradient bg, Meta badge, invite-only pill, CTA)
- [x] S2 — Hero Phone (CSS 3D perspective, animated WhatsApp chat)
- [x] S1 — Messaging Stats ("2B+" headline stat + 3 supporting metrics)
- [x] S4 — Stats Redesign (Clash Display font, editorial layout, count-up)
- [x] S1 — Problem Section (before/after cards, RainbowBorder)
- [x] S1 — Before/After Section (detailed comparison)
- [x] S8 — Before/After Scroll Stack (Manychat-style scrubbed animation + rainbow scribble)
- [x] S1 — How It Works (4-step cards with gradient glass icons)
- [x] S3 — Card Icons (Lucide SVGs on gradient glass pills)
- [x] S1 — AI Agent Section (dark card, outcome-first positioning)
- [x] S5 — AI Agent Day/Night Chat (animated cycle, two conversations)
- [x] S1 — Industries Section (grid with RainbowBorder)
- [x] S1 — Platform Features (hover lift/shadow effects)
- [x] S1 — Proof Section (real company logos, RainbowBorder)
- [x] S1 — CTA Section (gradient card, invite-only pill)
- [x] S1 — FAQ Section (dark card, accordion, 6 Q&As)
- [x] S1 — Footer (white bg, real logos, Meta badge)

### Design System
- [x] S1 — Color tokens (true neutral, accent purple, rainbow gradient)
- [x] S1 — RainbowBorder component
- [x] S4 — Clash Display font (stat numbers only)
- [x] S1 — DESIGN_SYSTEM.md documentation

### i18n
- [x] S1 — English (en.json) — all sections
- [x] S1 — Spanish (es.json) — all sections
- [x] S5 — AI Agent chat keys (en + es)

### Infrastructure
- [x] S5 — DNS: convertchat.co → Cloudflare Workers
- [x] S5 — CI/CD: GitHub Actions auto-deploy on push to main
- [x] S5 — Production live at https://convertchat.co

### Pending
- [x] S15 — Navbar "Log in" button → web.convertchat.co (PIN gate dropped as theater; real invite-code gate = app-side, brief given to Frank) + rainbow border on navbar CTA
- [ ] App side (Frank, other repo): invite code at signup + close open self-signup + Google OAuth gate — brief in activity.md S15
- [x] S9 — Navbar EN/ES language dropdown + English default locale (redirects, sitemap, localized metadata)
- [ ] Fix 320px horizontal overflow (hero H2 + rainbow-border card, pre-existing)
- [ ] Fix HeroPhone hydration warning under reduced motion (pre-existing)
- [ ] Add .prettierrc (printWidth 120) — repo has none, CLAUDE.md documents it
- [ ] Hero Phone upgrade — 3D floating component (via 21st.dev Magic MCP)
- [x] S13 — SEO: Open Graph images, meta descriptions per page
- [x] S14 — Analytics: Cloudflare Web Analytics beacon (cookieless, manual snippet in app/layout.tsx — auto-injection doesn't work on Workers)
- [x] S10 — Privacy Policy & Terms pages (en + es content, legal article renderer, navbar solid fix on interior pages)
- [ ] Spanish legal texts: lawyer review — Frank bypassed for now (S15); keep the free AI-disclosure line as self-serve add. Also ask lawyer about: AI disclosure line in privacy/terms (EU AI Act transparency — users chatting with the WhatsApp AI agent must know it's AI); arbitration/dispute clause fit for EU (US-style arbitration often unenforceable vs consumers). Noted from Frank 2026-07-15; app-store nutrition labels + DMCA agent = N/A (no mobile app, no UGC on site)
- [x] S19 — Blog content: posts 2-7 shipped (broadcast limits, automation tools, API pricing, templates, bulk messages, email-to-WhatsApp funnel) — all en+es with OG images, author avatars, hero cards
- [ ] Pricing currency switch: £ on en pages, € on es pages (same numerals, strings in messages/*.json) — MUST land before blog post 3 (API pricing) ships; verify app-side billing currency first (S16 decision, Frank approved)
- [x] S11 — Pricing page (tiers + AI add-on + costs + FAQ, en/es, verified 320–1280)
- [x] S12 — Routing architecture: central route registry (`lib/routes.ts`), derived pathnames/sitemap, site-wide hreflang + canonical, English route dirs, blog translation linkage (switcher 404 fix)
- [x] S13 — SEO refinement: per-page metadata via pageMetadata() helpers, OG cards, real favicons, JSON-LD (Organization/WebSite/FAQPage/BlogPosting), llms.txt refresh, sitemap x-default (claude-seo vetted read-only, not installed)
- [x] S14 — GSC: verified permanently via DNS (Cloudflare OAuth flow) on existing property, sitemap.xml resubmitted
- [ ] Re-scrape Meta Sharing Debugger + LinkedIn Post Inspector; Rich Results spot-check (optional, Frank)
- [ ] SEO round 2 (after 2–4 weeks of GSC data): optimize titles/content around real queries; blog content is the ranking lever
- [ ] SEO minor: compress app/icon.png (~187KB); add image/dateModified to BlogPosting once BlogPost type has fields
- [ ] Pricing v2: update website pricing to $99/$249/$499 tiers (pending Frank's final approval) — see docs/pricing-strategy-v2.md
- [ ] Product page: content TBD — Frank records product screen videos → convert to muted looping MP4/WebM (not GIFs)
- [ ] Fix "?." double punctuation in shared CtaSection heading (copy "?" + appended ".", also on homepage)
- [x] S6 — Mobile: final QA pass across breakpoints (320/375/390/430px, layout + type hierarchy)
