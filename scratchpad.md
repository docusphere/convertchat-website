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
- [ ] Login page — shared-PIN velvet-rope gate → web.convertchat.co (parked, decisions in activity.md S8)
- [x] S9 — Navbar EN/ES language dropdown + English default locale (redirects, sitemap, localized metadata)
- [ ] Fix 320px horizontal overflow (hero H2 + rainbow-border card, pre-existing)
- [ ] Fix HeroPhone hydration warning under reduced motion (pre-existing)
- [ ] Add .prettierrc (printWidth 120) — repo has none, CLAUDE.md documents it
- [ ] Hero Phone upgrade — 3D floating component (via 21st.dev Magic MCP)
- [ ] SEO: Open Graph images, meta descriptions per page
- [ ] Analytics: tracking setup (Plausible, PostHog, or similar)
- [x] S10 — Privacy Policy & Terms pages (en + es content, legal article renderer, navbar solid fix on interior pages)
- [ ] Spanish legal texts: lawyer review (S10 translations are machine-made)
- [ ] Blog: content pages (framework exists at `/[locale]/blog`)
- [x] S11 — Pricing page (tiers + AI add-on + costs + FAQ, en/es, verified 320–1280)
- [x] S12 — Routing architecture: central route registry (`lib/routes.ts`), derived pathnames/sitemap, site-wide hreflang + canonical, English route dirs, blog translation linkage (switcher 404 fix)
- [ ] SEO refinement (user-queued): vet https://github.com/AgriciDaniel/claude-seo.git before install; carry-overs — x-default in sitemap alternates, page-specific titles for home/product
- [ ] Product page: content TBD
- [ ] Fix "?." double punctuation in shared CtaSection heading (copy "?" + appended ".", also on homepage)
- [x] S6 — Mobile: final QA pass across breakpoints (320/375/390/430px, layout + type hierarchy)
