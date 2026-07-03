# ConvertChat Website — Polish Pass Design Spec

**Date:** 2026-07-03
**Goal:** Transform the working-but-generic marketing website into a $10K premium site with visual cohesion, motion, and personality.
**Reference:** hyros.ai (gradient energy, rainbow borders), manychat.com (navbar, FAQ)

---

## 1. Visual Rhythm

Mostly white page with two dark moments: AI Agent (dark card-as-section on white bg) and FAQ (dark full-section). Visual drama comes from rainbow gradient borders and gradient accents on white backgrounds, not from pervasive dark/light alternation.

**Section flow:**
1. Hero — purple gradient bg
2. Problem — white, rainbow-bordered stats card
3. Before/After — white/off-white cards
4. Messaging Stats — white, animated counters
5. How It Works — white, rainbow-bordered grid
6. Platform — white, feature cards with hover effects
7. AI Agent — **dark card-as-section** (rounded dark card on white page bg)
8. Industries — white, rainbow-bordered 2x2 grid
9. Proof — white, rainbow-bordered case study cards
10. **FAQ — dark full-section, accordion** (NEW — pairs with AI Agent to create a dark "closing act" before the CTA)
11. CTA — gradient mesh card on white
12. Footer — clean white

---

## 2. Color Palette Changes

### Keep (unchanged)
- **Primary green:** `#4ade80`, `#22c55e`, `#16a34a`, `#15803d` — buttons, CTAs, links, badges, WhatsApp brand
- **Gradient palette:** green, teal, cyan, lime, blue — hero shader fallback

### Change: Neutrals → True Neutral (drop green tint)

| Token | Current (green-tinted) | New (true neutral) |
|-------|----------------------|-------------------|
| `neutral-50` | `#fafbfa` | `#fafafa` |
| `neutral-100` | `#f1f5f2` | `#f2f2f5` |
| `neutral-200` | `#e5ebe8` | `#e5e5ea` |
| `neutral-400` | `#8a9a92` | `#8b8b92` |
| `neutral-500` | `#5a6b62` | `#5a5a65` |
| `neutral-700` | `#1a2e23` | `#1a1a2e` |
| `neutral-900` | `#0f1f17` | `#0d0d1f` |

### Add: Purple Accent Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-300` | `#c4b5fd` | Light purple text on dark |
| `accent-400` | `#a78bfa` | Gradient mid-tone |
| `accent-500` | `#8b5cf6` | Gradient core |
| `accent-600` | `#7c3aed` | Gradient anchor, overlines on dark |
| `accent-700` | `#6d28d9` | Deep accent |

### Add: Rainbow Gradient (CSS custom property)

```css
--rainbow-gradient: linear-gradient(
  135deg, #7c3aed 0%, #ec4899 20%, #f97316 35%,
  #eab308 50%, #22c55e 65%, #06b6d4 80%, #3b82f6 100%
);
```

Used for card borders via the `padding + inner card` technique (4-5px padding with gradient bg, white/dark inner card with border-radius).

Animated with `background-size: 200% 200%` and CSS `@keyframes` rotating `background-position` — no JS.

### Also Update: `dark-base` and Shadow Tokens

The `--dark-base` token (`#050a07`) is green-tinted and must shift to true neutral: `#06060f`.

Shadow tokens in `globals.css` use `rgba(15, 31, 23, ...)` (green-tinted `neutral-900`). Update to `rgba(13, 13, 31, ...)` to match the new true-neutral `neutral-900`.

Glow tokens stay green-tinted (they are intentionally green for the primary action glow).

### Also Update: DESIGN_SYSTEM.md Button Radius

DESIGN_SYSTEM.md still says buttons are "Pill-shaped (border-radius: 9999px)". The actual Button component uses `rounded-xl` (12px) — the user explicitly rejected pill as "AI-looking". Update DESIGN_SYSTEM.md to reflect `rounded-xl` / 12px for buttons.

### Overline Colors

- **Light sections:** overlines stay `text-primary-600/60` (green tint) — connects to the action color
- **Dark sections (AI Agent, FAQ):** overlines use `text-accent-600/60` (purple) — connects to the atmosphere color

### Color Roles
- **Green** = Action ("click me") — buttons, CTAs, links, badges, success, overlines on light
- **Purple** = Atmosphere ("feel premium") — hero/CTA gradients, overlines on dark, AI Agent section
- **Rainbow** = Accent detail ("premium border") — card borders, grid wrappers, used sparingly

---

## 3. Navbar Redesign

**Current:** Centered pill-shaped glass bar, static.

**New:** Full-width translucent bar with scroll-driven state transition (ManyChat-inspired).

### States

**At top (transparent):**
- Full width with large rounded corners (`border-radius: 16-20px`)
- `background: rgba(255,255,255,0.06)`, `border: 1px solid rgba(255,255,255,0.10)`
- `backdrop-filter: blur(20px)`
- Full logo: green square mark + "ConvertChat" text
- Nav links: white/55% opacity
- Buttons: glass Login + solid green CTA

**On scroll (frosted light):**
- `background: rgba(255,255,255,0.85)`, border becomes `rgba(0,0,0,0.08)`
- Logo collapses: "ConvertChat" text fades/slides out, only green square mark remains
- Nav links: dark text
- Buttons: ghost Login + solid green CTA
- Smooth CSS transition (300ms)

### Implementation
- `useEffect` scroll listener (already exists)
- CSS transition on all properties (300ms)
- Logo text: `overflow: hidden` + `max-width` transition (full width → 0) with `opacity` fade
- `position: fixed`, `top: 16px`, full width with `max-width` and horizontal margin
- **Edge case — page load with scroll position:** Check `window.scrollY` on mount (not just on scroll events) to set initial state correctly. Browsers restore scroll position on refresh, so the navbar must initialize in the correct state.
- **Dark section overlap:** The frosted-light scrolled state (white bg) works on both white and dark sections. The transparent at-top state is only visible when the hero is behind the navbar, which is always the case at `scrollY < 20`.

---

## 4. Hero Section

**Keep:** Purple gradient bg + MeshGradient blob + halftone dots.

**Add:**
- **Right column:** Floating 3D phones with WhatsApp notification animations (built via 21st.dev Magic MCP)
  - 2-3 phones at slight angles, CSS 3D transforms
  - Green notification badges with pop/pulse animation
  - Subtle green pulse rings emanating from center (broadcast effect)
  - Lazy-loaded, `prefers-reduced-motion` respected
  - **Fallback:** If the 3D phone scene doesn't meet quality bar, ship with a single centered phone mockup (flat CSS, no 3D) showing a WhatsApp conversation with notification badge. Still better than the current empty column.
- **Meta Tech Partner badge:** Inline below the note line. Small, subtle. Format: Meta infinity icon + "Official Meta Tech Partner" in small text, white/60% opacity.

---

## 5. Rainbow Border Component

Reusable component: `RainbowBorder`

```tsx
// Usage:
<RainbowBorder>
  <div className="bg-white rounded-2xl p-8">
    {/* card content */}
  </div>
</RainbowBorder>
```

Implementation:
- Outer div: `padding: 4px`, `border-radius: 20px`, `background: var(--rainbow-gradient)`, `background-size: 200% 200%`
- CSS `@keyframes rainbow-shift` animates `background-position` (8s cycle, ease-in-out, infinite)
- Inner div: white or dark bg, `border-radius: 16px`
- GPU-accelerated (only `background-position` animates)

---

## 6. Section-by-Section Changes

### 6.1 Problem Section
- Stats card: replace current gradient border with `RainbowBorder` component
- No other changes needed

### 6.2 Before/After Section
- No major changes — cards already have color contrast
- Minor: update neutral grays to true neutral

### 6.3 Messaging Stats Section
- Update neutral colors to true neutral
- Consider adding a subtle 3D WhatsApp icon above the big number
- Animated counters already working

### 6.4 How It Works Section
- Wrap the 4-step grid in `RainbowBorder`
- Inner grid: white bg, steps separated by subtle dividers
- Add 3D illustrated icon per step (upload box, email, click/tap, broadcast)
- Background: `neutral-50` or white

### 6.5 Platform Section
- Feature cards: add 3D illustrated icon per feature
- Hover: subtle lift + shadow + rainbow border glow (CSS transition)
- Replace numbered placeholders with proper icons
- Background: white

### 6.6 AI Agent Section (THE DARK SECTION)
- **Card-as-section pattern:** content inside a large rounded dark card (`neutral-900` / `#0d0d1f`) sitting on white page bg
- Subtle purple radial gradient glow behind the card (`accent-600` at low opacity)
- Overline color: `accent-600` at 60% opacity
- Beta badge: green tint (already good)
- AI preview placeholder: wrap in `RainbowBorder`
- Add 3D illustration of AI bot/brain/robot for the preview area

### 6.7 Industries Section
- Switch from dark bg to **white bg**
- 2x2 grid wrapped in `RainbowBorder` (exact hyros "Choose your use case" pattern)
- White cards inside with subtle inner dividers
- Add 3D industry icon per card (phone, building, medical, car)
- Outcome text stays green

### 6.8 Proof Section
- Switch from `neutral-50` cards to `RainbowBorder`-wrapped cards (individual borders per card)
- Add company logos to each case study card
- Serif company names, uppercase type labels

### 6.9 FAQ Section (NEW)

**Position:** Between Proof and CTA.

**Design:**
- Dark background section (`neutral-900` / `#0d0d1f`)
- Centered, max-width container
- Overline + headline
- Accordion items: question (serif, white) + answer (sans, white/50%)
- Dividers between items (white/10%)
- Chevron icon rotates on open (CSS transform)
- Smooth height animation (Framer Motion `AnimatePresence` + `motion.div` with `initial/animate/exit`)
- **Accessibility:** `aria-expanded` on trigger buttons, `aria-controls` pointing to answer panel, `role="region"` on answer panels. Minimum touch target height: 48px per accordion item.

**FAQ Content (EN):**

**Q: Will my WhatsApp number get banned?**
A: No. ConvertChat uses Meta's official WhatsApp Business API — the same infrastructure used by brands like Unilever and Tata. We enforce a two-stage opt-in flow (click = pending, message = confirmed) so every contact in your list has explicitly consented. No spam, no bans.

**Q: Do I need a WhatsApp Business API account?**
A: Not yet. If you don't have one, we'll set it up for you. We handle the Meta Business verification, phone number registration, and API connection as part of our onboarding — one-time setup fee. See our pricing page for details.

**Q: How does the email-to-WhatsApp opt-in actually work?**
A: You send a product email through ConvertChat. Each email includes a green "Message us on WhatsApp" button. When a contact clicks it, they're redirected to your WhatsApp with a pre-filled message. The moment they send that message, they're automatically tagged as opted-in. You now own that WhatsApp contact — legally and permanently.

**Q: What happens when a contact replies on WhatsApp?**
A: Two options. You can handle conversations manually through our built-in WhatsApp inbox — real-time chat with media support and read receipts. Or, if you have our AI Agent enabled (Beta), it handles the conversation automatically: answers product questions, qualifies the lead, and routes hot buyers to you.

**Q: Is this GDPR compliant?**
A: Yes. Our two-stage consent flow is designed for GDPR compliance. A click registers interest (pending). An actual WhatsApp message from the contact confirms consent (opted-in). We track and store consent status per contact with full audit trail. No unsolicited messages ever go out.

**Q: How many contacts can I import?**
A: No hard limit. Upload CSV or Excel files with thousands of contacts. We auto-detect channels (email, mobile, landline), filter invalid entries, remove duplicates, and split into optimized send batches. Most customers start with 1,000-10,000 contacts.

**FAQ Content (ES):** *(to be translated in messages/es.json)*

### 6.10 CTA Section
- Change from full-bleed purple to **rounded card on white bg** (hyros "Start with truth" pattern)
- Card: purple gradient bg + halftone dots + MeshGradient accent
- `border-radius: 24px`, centered, `max-width: 1120px`
- White page bg visible around it

### 6.11 Footer
- Switch from purple gradient to **clean white** bg
- Dark text, 4-column link layout (or simpler flex row)
- Add Meta Tech Partner badge (full `mvtp.png` image, appropriately sized)
- Border-top divider from page
- Copyright + company info bottom row

---

## 7. 3D Icons

**Primary source:** 21st.dev Magic MCP for consistent 3D-style illustrated icons.

**Fallback:** If Magic MCP output is inconsistent or unsuitable, fall back to Lucide icons with a styled container (colored background circle/square with the icon inside, similar to the existing `FeatureIcon` component in platform-section.tsx). This already works and ships — 3D icons are an upgrade, not a blocker.

**Style:** Consistent across all cards — glossy/soft 3D with subtle shadows, matching the purple/green brand palette.

**Inventory:**

| Section | Cards | Icons Needed |
|---------|-------|-------------|
| How It Works | 4 | Upload/box, Email/envelope, Click/tap, Broadcast/megaphone |
| Platform | 6 | Contact list, Rocket/launch, Broadcast tower, Chat inbox, Chart/tracking, Shield/GDPR |
| Industries | 4 | Smartphone, Building, Medical cross, Car/gear |
| Messaging Stats | 1 | WhatsApp bubble (optional) |
| AI Agent | 1 | AI brain/robot for preview area |

**Total: ~16 icons**

**Priority:** P1 (should-ship). The page works without them — they're polish, not structure.

---

## 8. Motion Spec

### Scroll Reveals (upgrade existing SectionReveal)
- Keep `whileInView` + `once: true`
- Add staggered children: parent triggers, children animate in sequence (50-80ms delay each)
- Keep current easing: `[0.22, 1, 0.36, 1]`

### Hover Micro-interactions
- **Feature cards:** `translateY(-4px)` + `box-shadow` increase + border color shift (200ms ease)
- **Rainbow border cards:** gradient animation speeds up on hover (CSS `animation-duration` transition)
- **Buttons:** existing `translateY(-1px)` + glow — keep as-is
- **Nav links:** subtle opacity transition (already working)

### Scroll-driven Moments
- **Messaging Stats:** animated number counters (already implemented)
- **How It Works steps:** staggered reveal left-to-right
- **Industries cards:** staggered reveal with slight scale-up

### Animated Rainbow Borders
- CSS `@keyframes` only — `background-position` shift
- **Subtle by default:** 12s cycle, `ease-in-out`, infinite (slow enough to feel alive, not distracting)
- **On hover:** animation speeds up to 4s cycle (CSS `animation-duration` transition)
- GPU-accelerated (no layout/paint)
- Multiple simultaneous rainbow borders (e.g., Proof section with 4 cards) are fine — the slow cycle prevents visual overload
- `prefers-reduced-motion: reduce` → animation paused, static gradient shown

### Performance Rules
- All animations: CSS `transform` and `opacity` only (GPU-composited)
- `will-change: transform` on animated elements
- `prefers-reduced-motion: reduce` → disable all motion except essential state changes
- Framer Motion for scroll triggers only — no heavy orchestrations
- Hero 3D component: lazy-loaded via `IntersectionObserver`
- No JS-driven animation loops (requestAnimationFrame) except the existing MeshGradient shader and the MessagingStatSection counter animation (existing, scroll-triggered, runs once)

---

## 9. Assets Needed

| Asset | Source | Location |
|-------|--------|----------|
| Meta Tech Partner badge | Provided | `docs/some_assets/mvtp.png` → copy to `public/` |
| 3D icons (x16) | 21st.dev Magic MCP | Generated during implementation |
| Hero 3D phone scene | 21st.dev Magic MCP | Generated during implementation |
| Company logos (x4) | Placeholder — text-only names for now, logos added later with brand permission | N/A (use styled text initials as fallback) |

---

## 10. i18n Additions

New keys needed in `messages/en.json` and `messages/es.json`:

- `faq.label` — overline text
- `faq.title` — section headline
- `faq.q1` through `faq.q6` — question texts
- `faq.a1` through `faq.a6` — answer texts
- `nav.faq` — if adding FAQ to nav links
- `hero.meta_partner` — "Official Meta Tech Partner"
- `footer.meta_partner` — alt text for badge

---

## 11. Files to Create/Modify

### New Files
- `components/ui/rainbow-border.tsx` — reusable rainbow gradient border wrapper
- `components/sections/faq-section.tsx` — FAQ accordion section
- `components/hero/hero-phones.tsx` — 3D floating phones component

### Modified Files
- `app/globals.css` — updated neutral tokens, new accent tokens, rainbow gradient CSS custom property
- `app/[locale]/page.tsx` — add FAQ section import
- `components/layout/navbar.tsx` — full redesign (scroll states, logo collapse)
- `components/layout/footer.tsx` — white bg, Meta badge, restructured layout
- `components/hero/hero-section.tsx` — add phones component + Meta partner badge
- `components/sections/problem-section.tsx` — swap to RainbowBorder
- `components/sections/how-it-works.tsx` — add RainbowBorder wrapper + 3D icons
- `components/sections/platform-section.tsx` — add 3D icons + hover effects
- `components/sections/ai-agent-section.tsx` — card-as-section on white bg + RainbowBorder preview
- `components/sections/industries-section.tsx` — white bg + RainbowBorder grid + 3D icons
- `components/sections/proof-section.tsx` — RainbowBorder per card + company logos
- `components/sections/cta-section.tsx` — rounded card on white bg
- `components/sections/messaging-stat-section.tsx` — neutral color updates
- `components/sections/before-after-section.tsx` — neutral color updates
- `messages/en.json` — FAQ strings + meta partner text
- `messages/es.json` — FAQ strings (translated) + meta partner text
- `DESIGN_SYSTEM.md` — update with new color tokens, rainbow borders, navbar spec

---

## 12. Dead Code Cleanup

These files exist but are not used on the homepage. Verify they are unused elsewhere, then delete:
- `components/sections/feature-cards.tsx` — unused, superseded by `platform-section.tsx`
- `components/sections/buying-section.tsx` — unused

`components/ui/section-transition.tsx` — keep as-is, may be used for future page transitions.

---

## 13. Priority Tiers

| Tier | Items | Rationale |
|------|-------|-----------|
| **P0 — Must ship** | Color token update, RainbowBorder component, navbar redesign, FAQ section, CTA card-on-white, footer redesign, AI Agent card-as-section, Industries to white + rainbow | Structural changes that define the new visual identity |
| **P1 — Should ship** | 3D icons (16), hero phone scene, Proof rainbow borders + logos, animated rainbow borders, hover micro-interactions | Polish that elevates but page works without |
| **P2 — Nice to have** | Staggered scroll reveals, scroll-driven parallax, DESIGN_SYSTEM.md full rewrite | Refinements for a future pass |

---

## 14. Out of Scope

- Mobile-specific responsive pass (separate task after polish pass)
- Blog/pricing pages
- Actual product screenshots
- SEO metadata optimization
- Analytics/tracking setup
- Spanish FAQ translations (draft EN first, translate after approval)
