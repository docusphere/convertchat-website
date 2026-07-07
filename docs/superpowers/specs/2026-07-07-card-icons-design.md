# Card Icons & AI Agent Reframe — Design Spec

## Goal

Add 3D rendered icons to card sections (How It Works, Industries, Platform Features), replace company initials with real logos in Proof section, and reframe the AI Agent section with outcome-first positioning.

## Icon Source

**3dicons.co** — free CC0 3D rendered PNGs. Use the **gradient** style variant. Download at 200px size, save to `/public/icons/`. Serve via `<img>` with explicit `width`/`height` attributes (small decorative icons don't benefit from `next/image` optimization pipeline; suppress the ESLint `no-img-element` warning per-line).

## Icon Style Treatment

Each icon sits on a gradient glass pill background built with CSS:

- Rounded square container (52-56px, `border-radius: var(--radius-md)` = 12px per DESIGN_SYSTEM.md)
- Gradient background matching the site palette (green, purple, cyan combos)
- Glow shadow: `box-shadow: 0 8px 20px rgba(color, 0.3)`
- Inner glass highlight: `inset 0 1px 0 rgba(255,255,255,0.2)`
- Icon image centered inside, ~28-32px

No new component needed — inline styles or a small utility class on each card.

## Sections

### 1. How It Works (4 step cards)

**File:** `components/sections/how-it-works.tsx`

Replace the large faded serif numbers (rendered via `t(\`${key}.num\`)` as `text-5xl text-primary-500/15`) with 3D icons. Keep the step number as a small `text-xs text-neutral-400 font-sans` label above the icon (e.g., "Step 1").

| Step | Icon | 3dicons asset |
|------|------|---------------|
| 1. Upload & clean | Cloud upload | `cloud-upload-gradient` |
| 2. Email with WA button | Envelope | `envelope-gradient` |
| 3. They click | Pointer/cursor | `pointer-gradient` |
| 4. Broadcast offers | Megaphone | `megaphone-gradient` |

### 2. Industries (4 use case cards)

**File:** `components/sections/industries-section.tsx`

Add icon above each industry title. Currently pure text.

| Industry | Icon | 3dicons asset |
|----------|------|---------------|
| Electronics | Laptop | `laptop-gradient` |
| Real Estate | Building | `building-gradient` |
| Health | Heart | `heart-gradient` |
| Auto | Gear | `gear-gradient` |

### 3. Platform Features (6 feature cards)

**File:** `components/sections/platform-section.tsx`

Replace numbered badges (1-6) with semantic 3D icons. Icons are intentionally different from How It Works to avoid duplication across the page:

| Feature | Icon | 3dicons asset |
|---------|------|---------------|
| Smart import | Contacts/people | `people-gradient` |
| Email → WhatsApp | Arrow/send | `send-gradient` |
| Broadcasts | Broadcast/signal | `signal-gradient` |
| Inbox | Chat bubble | `chat-gradient` |
| Tracking | Bar chart | `bar-chart-gradient` |
| GDPR consent | Shield | `shield-gradient` |

Note: Platform section does not use `RainbowBorder` — this is intentional and unchanged by this spec.

### 4. AI Agent Section — Reframe

**File:** `components/sections/ai-agent-section.tsx`

**Copy changes (English):**
- Badge: "Always On" (replaces "Beta")
- Label: remove "AI-powered" or replace with "Automated"
- Heading: "Your store never closes"
- Subheading: "ConvertChat answers questions, recommends products, and closes sales on WhatsApp — automatically, 24/7, in your brand's voice."
- Bullets stay but reframed as ConvertChat capabilities, not "AI" capabilities
- The word "AI" appears at most once in body copy as mechanism

**Copy changes (Spanish):**
- Badge: "Siempre Activo"
- Label: "Automatizado" (or removed)
- Heading: "Tu tienda nunca cierra"
- Subheading: "ConvertChat responde preguntas, recomienda productos y cierra ventas en WhatsApp — automáticamente, 24/7, con la voz de tu marca."

**Visual changes:**
Replace the placeholder "AI Agent Preview" box with a **static mini WhatsApp conversation** showing a sale closing at 3:42am. This is NOT an animated component like HeroPhone — it is a simple static HTML composition:

- Dark background matching the card
- Small WhatsApp-style chat bubbles (3 messages max)
- Visible timestamp "3:42 AM" on the last message
- A moon/stars or dimmed screen aesthetic to communicate "nighttime"
- Customer: "Do you have this in size M?"
- Brand: "Yes! Only 2 left. Here's your checkout link"
- Customer: "Just ordered!"

This is built inline in the section component, not as a separate reusable component. No animation, no Framer Motion, no timer chains.

Spline 3D scene is deferred — not in scope for this spec.

### 5. Proof Section — Company Logos

**File:** `components/sections/proof-section.tsx`

Replace the 40x40 `rounded-xl` company initial avatars with actual company logos. All four proof cards have white backgrounds, so use **original color logos**.

Logo files saved as `/public/logos/{company}.png`:
- `/public/logos/smilodox.png`
- `/public/logos/tata-cliq.png`
- `/public/logos/bgc-wholesale.png`
- `/public/logos/unilever.png`

Replace the avatar `<div>` entirely (remove the colored background square + initial letter). Render the logo as `<img src="/logos/{company}.png" alt="{Company Name}" className="h-7 w-auto" />`.

## Files Changed

| Action | Path | Purpose |
|--------|------|---------|
| Create | `public/icons/*.png` (~10 unique icons) | 3D icon assets from 3dicons.co |
| Create | `public/logos/*.png` (4 files) | Company logos for proof section |
| Modify | `components/sections/how-it-works.tsx` | Replace numbers with icons + step labels |
| Modify | `components/sections/industries-section.tsx` | Add industry icons |
| Modify | `components/sections/platform-section.tsx` | Replace numbered badges with icons |
| Modify | `components/sections/ai-agent-section.tsx` | Copy reframe + static nighttime chat visual |
| Modify | `components/sections/proof-section.tsx` | Company logos replace initials |
| Modify | `messages/en.json` | AI Agent section copy update |
| Modify | `messages/es.json` | AI Agent section copy update |

## Responsive

Icons scale with card size. On mobile, icons stay the same size but stack vertically with text. No special breakpoint handling needed beyond existing card grid behavior.

## Accessibility

- All card icons are decorative — use `alt=""` on `<img>` tags
- Icon containers don't need ARIA labels (text labels already present on all cards)
- Proof section logos get descriptive `alt="Company Name"` for identification
- Nighttime chat in AI Agent section: `aria-hidden="true"` (decorative illustration)

## Performance

- 3D icon PNGs at 200px: ~15-30KB each, ~10 unique icons = ~200KB total
- Above-fold icons (How It Works): eager loading. Below-fold: `loading="lazy"`
- Company logos: ~5-10KB each, `loading="lazy"`
- No new JS dependencies
- No Spline/WebGL in this iteration
