# Card Icons & AI Agent Reframe — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add gradient glass icons to card sections (How It Works, Industries, Platform Features), reframe the AI Agent section with outcome-first positioning and a static nighttime chat visual, and replace company initials with logos in the Proof section.

**Architecture:** Lucide React SVG icons on gradient glass pill containers with glow shadows. Each section component gets inline icon rendering — no shared icon component. AI Agent section gets copy updates via i18n JSON files and a static inline WhatsApp chat composition. Proof section replaces initial-letter avatars with `<img>` logo tags.

**Tech Stack:** Next.js 16, Tailwind CSS v4, Lucide React (new dep), next-intl

**Spec:** `docs/superpowers/specs/2026-07-07-card-icons-design.md`

**Deviation from spec:** The spec calls for 3dicons.co PNG assets. This plan uses Lucide React SVGs instead because: (1) no manual asset downloads needed, (2) vector icons are sharper at all sizes, (3) smaller payload (~0KB vs ~200KB), (4) matches option C from brainstorm which user approved. The gradient glass pill visual treatment (gradient bg + glow shadow + inner glass highlight) is identical.

---

## File Structure

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `package.json` | Add `lucide-react` dependency |
| Modify | `components/sections/how-it-works.tsx` | Replace faded numbers with gradient glass icons + step labels |
| Modify | `components/sections/industries-section.tsx` | Add industry icons above titles |
| Modify | `components/sections/platform-section.tsx` | Replace `FeatureIcon` numbered badges with gradient glass icons |
| Modify | `components/sections/ai-agent-section.tsx` | Copy reframe + static nighttime chat visual |
| Modify | `components/sections/proof-section.tsx` | Company logos replace initial-letter avatars |
| Modify | `messages/en.json` | AI Agent section copy update |
| Modify | `messages/es.json` | AI Agent section copy update |
| Create | `public/logos/smilodox.png` | Company logo (manual download) |
| Create | `public/logos/tata-cliq.png` | Company logo (manual download) |
| Create | `public/logos/bgc-wholesale.png` | Company logo (manual download) |
| Create | `public/logos/unilever.png` | Company logo (manual download) |

---

### Task 1: Install Lucide React

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install lucide-react**

```bash
cd /Users/franciscojosejimeneznillardkam/Documents/Frank\ DOCS/Frank\ Projects/convertchat-website
npm install lucide-react
```

- [ ] **Step 2: Verify installation**

```bash
cd /Users/franciscojosejimeneznillardkam/Documents/Frank\ DOCS/Frank\ Projects/convertchat-website
cat node_modules/lucide-react/package.json | grep '"version"'
```

Expected: Prints a version string like `"version": "0.x.x"`

- [ ] **Step 3: Verify dev server still runs**

```bash
cd /Users/franciscojosejimeneznillardkam/Documents/Frank\ DOCS/Frank\ Projects/convertchat-website
npm run build 2>&1 | tail -5
```

Expected: Build succeeds

---

### Task 2: How It Works — Replace Numbers with Icons

**Files:**
- Modify: `components/sections/how-it-works.tsx`

The current file renders 4 step cards with large faded serif numbers (`text-5xl text-primary-500/15`). Replace each number with a Lucide icon inside a gradient glass pill, and add a small "Step N" label above the icon.

Icon mapping:
| Step | Lucide icon | Gradient |
|------|-------------|----------|
| step1 (Upload & clean) | `CloudUpload` | green `#22c55e → #16a34a` |
| step2 (Email with WA button) | `Mail` | purple `#8b5cf6 → #7c3aed` |
| step3 (They click) | `MousePointerClick` | cyan `#06b6d4 → #0891b2` |
| step4 (Broadcast offers) | `Megaphone` | green `#22c55e → #16a34a` |

- [ ] **Step 1: Add Lucide imports and icon config**

At the top of `components/sections/how-it-works.tsx`, after existing imports, add:

```tsx
import { CloudUpload, Mail, MousePointerClick, Megaphone, type LucideIcon } from "lucide-react";

const STEP_ICONS: { icon: LucideIcon; gradient: string; glow: string }[] = [
  { icon: CloudUpload, gradient: "from-[#22c55e] to-[#16a34a]", glow: "rgba(34,197,94,0.3)" },
  { icon: Mail, gradient: "from-[#8b5cf6] to-[#7c3aed]", glow: "rgba(139,92,246,0.3)" },
  { icon: MousePointerClick, gradient: "from-[#06b6d4] to-[#0891b2]", glow: "rgba(6,182,212,0.3)" },
  { icon: Megaphone, gradient: "from-[#22c55e] to-[#16a34a]", glow: "rgba(34,197,94,0.3)" },
];
```

- [ ] **Step 2: Replace the faded number with icon + step label**

Replace this line inside the card `div`:

```tsx
<span className="font-serif text-5xl font-normal text-primary-500/15">{t(`${key}.num`)}</span>
```

With (reusing the existing `.num` i18n key for the step label to avoid hardcoded English):

```tsx
<span className="text-xs font-medium text-neutral-400">{t(`${key}.num`)}</span>
<div
  className={`mt-2 flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gradient-to-br ${STEP_ICONS[i].gradient}`}
  style={{ boxShadow: `0 8px 20px ${STEP_ICONS[i].glow}, inset 0 1px 0 rgba(255,255,255,0.2)` }}
  aria-hidden="true"
>
  {(() => { const Icon = STEP_ICONS[i].icon; return <Icon className="h-7 w-7 text-white" strokeWidth={1.75} />; })()}
</div>
```

Note: The existing `.num` keys hold `"01"`, `"02"`, etc. which work as small step labels. This avoids hardcoding English text.

- [ ] **Step 3: Verify build**

```bash
cd /Users/franciscojosejimeneznillardkam/Documents/Frank\ DOCS/Frank\ Projects/convertchat-website
npm run typecheck
```

Expected: No errors

- [ ] **Step 4: Visual check**

Open `http://localhost:3000` and scroll to "How It Works" section. Verify:
- Each card has a small "Step N" label above a colored gradient pill
- Each pill contains a white icon (cloud, envelope, cursor, megaphone)
- Gradient glow shadow visible beneath each pill
- Cards still layout correctly in 4-column grid on desktop, stack on mobile

- [ ] **Step 5: Commit**

```bash
git add components/sections/how-it-works.tsx
git commit -m "feat: replace how-it-works numbers with gradient glass icons"
```

---

### Task 3: Industries Section — Add Icons

**Files:**
- Modify: `components/sections/industries-section.tsx`

Currently pure text cards. Add a gradient glass icon above each industry title.

Icon mapping:
| Industry | Lucide icon | Gradient |
|----------|-------------|----------|
| electronics | `Laptop` | green `#22c55e → #16a34a` |
| realEstate | `Building2` | purple `#8b5cf6 → #7c3aed` |
| health | `HeartPulse` | cyan `#06b6d4 → #0891b2` |
| auto | `Cog` | green `#22c55e → #16a34a` |

- [ ] **Step 1: Add Lucide imports and icon config**

At the top of `components/sections/industries-section.tsx`, after existing imports, add:

```tsx
import { Laptop, Building2, HeartPulse, Cog, type LucideIcon } from "lucide-react";

const INDUSTRY_ICONS: { icon: LucideIcon; gradient: string; glow: string }[] = [
  { icon: Laptop, gradient: "from-[#22c55e] to-[#16a34a]", glow: "rgba(34,197,94,0.3)" },
  { icon: Building2, gradient: "from-[#8b5cf6] to-[#7c3aed]", glow: "rgba(139,92,246,0.3)" },
  { icon: HeartPulse, gradient: "from-[#06b6d4] to-[#0891b2]", glow: "rgba(6,182,212,0.3)" },
  { icon: Cog, gradient: "from-[#22c55e] to-[#16a34a]", glow: "rgba(34,197,94,0.3)" },
];
```

- [ ] **Step 2: Add icon above each industry title**

Inside the card `div` (the one with `className={`p-8 ...`}`), add the icon before the `<h3>`:

```tsx
<div
  className={`flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gradient-to-br ${INDUSTRY_ICONS[i].gradient}`}
  style={{ boxShadow: `0 8px 20px ${INDUSTRY_ICONS[i].glow}, inset 0 1px 0 rgba(255,255,255,0.2)` }}
  aria-hidden="true"
>
  {(() => { const Icon = INDUSTRY_ICONS[i].icon; return <Icon className="h-7 w-7 text-white" strokeWidth={1.75} />; })()}
</div>
<h3 className="mt-4 font-serif text-xl font-medium text-neutral-900">{t(`${key}.title`)}</h3>
```

Note: No `mt-2` on the icon div since it's the first element — the card's `p-8` padding provides top spacing. The `<h3>` gets `mt-4` to space it from the icon.

- [ ] **Step 3: Verify build**

```bash
cd /Users/franciscojosejimeneznillardkam/Documents/Frank\ DOCS/Frank\ Projects/convertchat-website
npm run typecheck
```

Expected: No errors

- [ ] **Step 4: Visual check**

Scroll to Industries section. Verify:
- Each industry card has a gradient pill icon above the title
- Icons: laptop, building, heart, gear
- Border layout (2x2 grid with dividers) still intact
- Cards don't feel cramped with the added icon

- [ ] **Step 5: Commit**

```bash
git add components/sections/industries-section.tsx
git commit -m "feat: add gradient glass icons to industries section"
```

---

### Task 4: Platform Features — Replace Numbered Badges with Icons

**Files:**
- Modify: `components/sections/platform-section.tsx`

Replace the `FeatureIcon` component (renders numbered badges 1-6) with gradient glass icons. Remove the `FEATURE_ACCENT` map and `FeatureIcon` component entirely.

Icon mapping:
| Feature | Lucide icon | Gradient |
|---------|-------------|----------|
| feature1 (Smart import) | `Users` | green `#22c55e → #16a34a` |
| feature2 (Email → WA) | `Send` | purple `#8b5cf6 → #7c3aed` |
| feature3 (Broadcasts) | `Radio` | cyan `#06b6d4 → #0891b2` |
| feature4 (Inbox) | `MessageCircle` | green `#22c55e → #16a34a` |
| feature5 (Tracking) | `BarChart3` | purple `#8b5cf6 → #7c3aed` |
| feature6 (GDPR) | `ShieldCheck` | cyan `#06b6d4 → #0891b2` |

- [ ] **Step 1: Replace imports and config**

Remove the `FeatureIcon` component and `FEATURE_ACCENT` map. Replace with:

```tsx
import { Users, Send, Radio, MessageCircle, BarChart3, ShieldCheck, type LucideIcon } from "lucide-react";

const FEATURE_ICONS: { icon: LucideIcon; gradient: string; glow: string }[] = [
  { icon: Users, gradient: "from-[#22c55e] to-[#16a34a]", glow: "rgba(34,197,94,0.3)" },
  { icon: Send, gradient: "from-[#8b5cf6] to-[#7c3aed]", glow: "rgba(139,92,246,0.3)" },
  { icon: Radio, gradient: "from-[#06b6d4] to-[#0891b2]", glow: "rgba(6,182,212,0.3)" },
  { icon: MessageCircle, gradient: "from-[#22c55e] to-[#16a34a]", glow: "rgba(34,197,94,0.3)" },
  { icon: BarChart3, gradient: "from-[#8b5cf6] to-[#7c3aed]", glow: "rgba(139,92,246,0.3)" },
  { icon: ShieldCheck, gradient: "from-[#06b6d4] to-[#0891b2]", glow: "rgba(6,182,212,0.3)" },
];
```

- [ ] **Step 2: Replace FeatureIcon usage in cards**

Replace:

```tsx
<FeatureIcon index={i} accentClass={FEATURE_ACCENT[key]} />
```

With:

```tsx
<div
  className={`flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gradient-to-br ${FEATURE_ICONS[i].gradient}`}
  style={{ boxShadow: `0 8px 20px ${FEATURE_ICONS[i].glow}, inset 0 1px 0 rgba(255,255,255,0.2)` }}
  aria-hidden="true"
>
  {(() => { const Icon = FEATURE_ICONS[i].icon; return <Icon className="h-7 w-7 text-white" strokeWidth={1.75} />; })()}
</div>
```

- [ ] **Step 3: Remove dead code**

Delete the `FeatureIcon` function and `FEATURE_ACCENT` constant. Also remove the `FeatureKey` type if no longer used.

- [ ] **Step 4: Verify build**

```bash
cd /Users/franciscojosejimeneznillardkam/Documents/Frank\ DOCS/Frank\ Projects/convertchat-website
npm run typecheck
```

Expected: No errors

- [ ] **Step 5: Visual check**

Scroll to Platform Features section. Verify:
- 6 cards in 3-column grid on desktop
- Each card has a gradient pill icon (people, send arrow, radio, chat, bar chart, shield)
- Hover effect (-translate-y-1 + shadow) still works
- Icons are visually distinct from How It Works icons

- [ ] **Step 6: Commit**

```bash
git add components/sections/platform-section.tsx
git commit -m "feat: replace platform section numbered badges with gradient glass icons"
```

---

### Task 5: AI Agent Section — Copy Reframe + Nighttime Chat

**Files:**
- Modify: `messages/en.json` (aiAgent section)
- Modify: `messages/es.json` (aiAgent section)
- Modify: `components/sections/ai-agent-section.tsx`

This is the largest task. Three sub-parts:
1. Update i18n copy (badge, label, title, lead, bullets)
2. Build static nighttime WhatsApp chat visual
3. Replace placeholder div with the chat

- [ ] **Step 1: Update English copy**

In `messages/en.json`, replace the entire `"aiAgent"` block with:

```json
"aiAgent": {
  "label": "Automated",
  "badge": "Always On",
  "title": "Your store never closes",
  "lead": "ConvertChat answers questions, recommends products, and closes sales on WhatsApp \u2014 automatically, 24/7, in your brand's voice.",
  "bullet1": "Learns your product catalog, pricing, and stock",
  "bullet2": "Answers buyer questions instantly, any time of day",
  "bullet3": "Recommends products and sends checkout links",
  "bullet4": "Routes hot leads to your team when they're ready to buy"
}
```

- [ ] **Step 2: Update Spanish copy**

In `messages/es.json`, replace the entire `"aiAgent"` block with:

```json
"aiAgent": {
  "label": "Automatizado",
  "badge": "Siempre Activo",
  "title": "Tu tienda nunca cierra",
  "lead": "ConvertChat responde preguntas, recomienda productos y cierra ventas en WhatsApp \u2014 automáticamente, 24/7, con la voz de tu marca.",
  "bullet1": "Aprende tu catálogo de productos, precios y stock",
  "bullet2": "Responde preguntas de compradores al instante, a cualquier hora",
  "bullet3": "Recomienda productos y envía enlaces de pago",
  "bullet4": "Te redirige los compradores calientes cuando están listos para comprar"
}
```

- [ ] **Step 3: Build static nighttime chat visual**

In `components/sections/ai-agent-section.tsx`, replace the right column content (the `RainbowBorder` with placeholder div) with a static mini WhatsApp conversation showing a sale closing at 3:42 AM.

Replace this block:

```tsx
{/* Right column — visual placeholder */}
<SectionReveal delay={0.15} className="w-full">
  <RainbowBorder borderRadius="16px" padding="3px">
    <div
      aria-hidden="true"
      className="flex h-80 w-full items-center justify-center rounded-[13px] bg-neutral-900 md:h-96"
    >
      <span className="text-sm text-white/30">AI Agent Preview</span>
    </div>
  </RainbowBorder>
</SectionReveal>
```

With:

```tsx
{/* Right column — nighttime chat visual */}
<SectionReveal delay={0.15} className="w-full">
  <div aria-hidden="true" className="relative overflow-hidden rounded-2xl bg-neutral-950 p-5 md:p-6">
    {/* Moon/stars nighttime aesthetic */}
    <div className="pointer-events-none absolute right-4 top-4 text-2xl opacity-60">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#fbbf24" opacity="0.8" />
      </svg>
    </div>
    <div className="pointer-events-none absolute right-14 top-3 h-1 w-1 rounded-full bg-yellow-300/40" />
    <div className="pointer-events-none absolute right-10 top-8 h-0.5 w-0.5 rounded-full bg-yellow-300/30" />
    <div className="pointer-events-none absolute right-20 top-6 h-0.5 w-0.5 rounded-full bg-yellow-300/25" />

    {/* Chat bubbles */}
    <div className="space-y-3">
      {/* Customer message */}
      <div className="flex justify-start">
        <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-neutral-800 px-4 py-2.5">
          <p className="text-sm text-white/90">Do you have this in size M?</p>
          <p className="mt-1 text-right text-[10px] text-white/30">3:40 AM</p>
        </div>
      </div>

      {/* Brand (ConvertChat) reply */}
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary-600 px-4 py-2.5">
          <p className="text-sm text-white">Yes! Only 2 left. Here&apos;s your checkout link</p>
          <div className="mt-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2">
            <p className="text-xs text-white/70">checkout.store.com/size-m</p>
          </div>
          <p className="mt-1 text-right text-[10px] text-white/50">3:41 AM</p>
        </div>
      </div>

      {/* Customer reply */}
      <div className="flex justify-start">
        <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-neutral-800 px-4 py-2.5">
          <p className="text-sm text-white/90">Just ordered! 🎉</p>
          <p className="mt-1 text-right text-[10px] text-white/30">3:42 AM</p>
        </div>
      </div>
    </div>

    {/* Subtle "3:42 AM" label at bottom */}
    <p className="mt-4 text-center text-xs text-white/20">Sale closed at 3:42 AM</p>
  </div>
</SectionReveal>
```

- [ ] **Step 4: Remove RainbowBorder import if no longer used**

RainbowBorder is removed from the right column because the dark chat card (`bg-neutral-950`) provides its own visual boundary; the animated border would conflict with the nighttime aesthetic.

Check if `RainbowBorder` is still used in the file. If the only usage was the placeholder, remove the import:

```tsx
import { RainbowBorder } from "@/components/ui/rainbow-border";
```

- [ ] **Step 5: Verify build**

```bash
cd /Users/franciscojosejimeneznillardkam/Documents/Frank\ DOCS/Frank\ Projects/convertchat-website
npm run typecheck
```

Expected: No errors

- [ ] **Step 6: Visual check**

Scroll to AI Agent section. Verify:
- Badge says "Always On" (en) / "Siempre Activo" (es) instead of "Beta"
- Heading: "Your store never closes" / "Tu tienda nunca cierra"
- Right side shows a dark card with 3 WhatsApp-style chat bubbles
- Moon icon and star dots visible in top-right corner
- Customer messages in dark gray, brand replies in green
- Timestamps show 3:40, 3:41, 3:42 AM
- "Sale closed at 3:42 AM" text at bottom
- Check both `/en` and `/es` locales

- [ ] **Step 7: Commit**

```bash
git add components/sections/ai-agent-section.tsx messages/en.json messages/es.json
git commit -m "feat: reframe AI agent section with outcome-first copy and nighttime chat visual"
```

---

### Task 6: Proof Section — Company Logos

**Files:**
- Create: `public/logos/` directory
- Create: `public/logos/smilodox.png`, `tata-cliq.png`, `bgc-wholesale.png`, `unilever.png`
- Modify: `components/sections/proof-section.tsx`

**Blocker note:** Company logos must be manually sourced and saved to `public/logos/`. The implementer should create placeholder colored squares if logos are not yet available, with a TODO comment for the user to replace them.

- [ ] **Step 1: Create logos directory and placeholders**

```bash
mkdir -p /Users/franciscojosejimeneznillardkam/Documents/Frank\ DOCS/Frank\ Projects/convertchat-website/public/logos
```

Create simple 80x80 placeholder PNGs (solid colored squares) using ImageMagick or similar. If ImageMagick is not available, skip placeholders and use a text fallback in the component.

- [ ] **Step 2: Update proof-section.tsx to use logo images**

In the CASES array, add a `logo` field:

```tsx
const CASES = [
  { company: "case1_company", type: "case1_type", result: "case1_result", logo: "/logos/smilodox.png" },
  { company: "case2_company", type: "case2_type", result: "case2_result", logo: "/logos/tata-cliq.png" },
  { company: "case3_company", type: "case3_type", result: "case3_result", logo: "/logos/bgc-wholesale.png" },
  { company: "case4_company", type: "case4_type", result: "case4_result", logo: "/logos/unilever.png" },
] as const;
```

Replace the initial-letter avatar div:

```tsx
<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 font-serif text-sm font-medium text-neutral-700">
  {t(company).charAt(0)}
</div>
```

With a simple `<img>` tag:

```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={logo} alt={t(company)} className="h-7 w-auto shrink-0" loading="lazy" />
```

**Note:** This task is blocked on logo files being present in `public/logos/` before a production build. If logos are not yet available, broken image indicators will show — this is an intentional signal to add them before deployment.

- [ ] **Step 3: Destructure logo from CASES in the map**

Update the map destructuring from `{ company, type, result }` to `{ company, type, result, logo }`.

- [ ] **Step 4: Verify build**

```bash
cd /Users/franciscojosejimeneznillardkam/Documents/Frank\ DOCS/Frank\ Projects/convertchat-website
npm run typecheck
```

Expected: No errors

- [ ] **Step 5: Visual check**

Scroll to Proof section. Verify:
- Logo images render (or show broken image indicators if placeholders aren't created)
- Company name and type still display correctly next to the logo
- Card layout is unchanged

- [ ] **Step 6: Commit**

```bash
git add public/logos/ components/sections/proof-section.tsx
git commit -m "feat: replace proof section initials with company logos"
```

---

### Task 7: Final Build Verification

- [ ] **Step 1: TypeScript check**

```bash
cd /Users/franciscojosejimeneznillardkam/Documents/Frank\ DOCS/Frank\ Projects/convertchat-website
npm run typecheck
```

Expected: No errors

- [ ] **Step 2: Production build**

```bash
cd /Users/franciscojosejimeneznillardkam/Documents/Frank\ DOCS/Frank\ Projects/convertchat-website
npm run build
```

Expected: Build succeeds with no errors

- [ ] **Step 3: Full visual walkthrough**

Open `http://localhost:3000` and scroll through the entire page, verifying:
1. How It Works: 4 gradient glass icons with step labels
2. Industries: 4 gradient glass icons above titles
3. Platform Features: 6 gradient glass icons replacing numbered badges
4. AI Agent: "Always On" badge, outcome-first copy, nighttime chat visual
5. Proof: Company logos (or broken image placeholders to be replaced)

Check both `/en` and `/es` locales.
