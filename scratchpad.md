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
- [ ] Hero Phone upgrade — 3D floating component (via 21st.dev Magic MCP)
- [ ] SEO: Open Graph images, meta descriptions per page
- [ ] Analytics: tracking setup (Plausible, PostHog, or similar)
- [ ] Blog: content pages (framework exists at `/[locale]/blog`)
- [ ] Product/Pricing pages: content TBD
- [ ] Mobile: final QA pass across breakpoints
