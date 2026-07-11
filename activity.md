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
