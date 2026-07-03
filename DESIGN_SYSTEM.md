# ConvertChat Website — Design System v3

Design foundations for convertchat.co marketing website.
Reference sites: hyros.ai (primary inspiration — gradient energy, glassmorphism), agenticarchitects.co (typography pairing)

**Direction:** Premium editorial. Serif headings with liquid crystal WebGL shader hero. Glassmorphism overlays on dark backgrounds. Green brand identity with an exclusive, invitation-only tone.

---

## Typography

### Font Family

**Headings:** Newsreader (Google Fonts — serif, editorial, elegant)

- Fallback: `'Newsreader', Georgia, serif`
- Loaded via Google Fonts or `next/font/google`
- Weight 400 for display/h1, 500 for h2/h3

**Body & UI:** Satoshi (Fontshare — geometric sans-serif, clean, modern)

- Fallback: `'Satoshi', system-ui, sans-serif`
- Self-hosted .woff2 for performance
- Weights: 400 (body), 500-600 (labels), 700 (buttons, nav)

### Scale

| Token     | Size    | Font       | Weight  | Line Height | Letter Spacing | Usage                     |
| --------- | ------- | ---------- | ------- | ----------- | -------------- | ------------------------- |
| `display` | 80px    | Newsreader | 400     | 1.0         | -0.04em        | Hero headline             |
| `h1`      | 56px    | Newsreader | 400     | 1.1         | -0.03em        | Page titles               |
| `h2`      | 40px    | Newsreader | 500     | 1.15        | -0.02em        | Section headings          |
| `h3`      | 28px    | Newsreader | 500     | 1.25        | -0.01em        | Card titles, sub-sections |
| `body-lg` | 18px    | Satoshi    | 400     | 1.65        | 0              | Hero subtitle, intro text |
| `body`    | 16px    | Satoshi    | 400     | 1.6         | 0              | Default body text         |
| `body-sm` | 14px    | Satoshi    | 400     | 1.55        | 0              | Secondary text, captions  |
| `button`  | 14-17px | Satoshi    | 600-700 | -           | 0              | Button labels             |
| `label`   | 11-12px | Satoshi    | 600     | 1.4         | 0.06-0.1em     | Tags, badges (uppercase)  |

---

## Color Palette

### Primary (Green — brand anchor)

| Token         | Hex       | Usage                         |
| ------------- | --------- | ----------------------------- |
| `primary-400` | `#4ade80` | Gradient highlights, glows    |
| `primary-500` | `#22c55e` | Primary buttons, icons, links |
| `primary-600` | `#16a34a` | Button hover, dark accents    |
| `primary-700` | `#15803d` | Deep green accents            |

### Gradient Palette (Liquid crystal shader)

| Color | Hex       | Role                 |
| ----- | --------- | -------------------- |
| Green | `#22c55e` | Core brand blob      |
| Teal  | `#14b8a6` | Secondary cool blob  |
| Cyan  | `#06b6d4` | Cool accent blob     |
| Lime  | `#84cc16` | Warm green highlight |
| Blue  | `#3b82f6` | Depth/contrast blob  |

### Neutral (true neutral — no green tint)

| Token         | Hex       | Usage                              |
| ------------- | --------- | ---------------------------------- |
| `neutral-50`  | `#fafafa` | Light section backgrounds          |
| `neutral-100` | `#f2f2f5` | Alternate section backgrounds      |
| `neutral-200` | `#e5e5ea` | Borders, dividers (light sections) |
| `neutral-400` | `#8b8b92` | Placeholder text, muted labels     |
| `neutral-500` | `#5a5a65` | Body text (light sections)         |
| `neutral-700` | `#1a1a2e` | Headings (light sections)          |
| `neutral-900` | `#0d0d1f` | Dark backgrounds                   |

**Dark base:** `#06060f` (hero, dark sections)

### Accent (Purple — atmosphere)

| Token        | Hex       | Usage                          |
| ------------ | --------- | ------------------------------ |
| `accent-300` | `#c4b5fd` | Light purple highlights        |
| `accent-400` | `#a78bfa` | Purple accents                 |
| `accent-500` | `#8b5cf6` | Medium purple                  |
| `accent-600` | `#7c3aed` | Overlines on dark, CTA gradient|
| `accent-700` | `#6d28d9` | Deep purple accents            |

### Rainbow Gradient

Animated gradient border for cards. CSS custom property: `--rainbow-gradient`.

```css
linear-gradient(135deg, #7c3aed 0%, #ec4899 20%, #f97316 35%, #eab308 50%, #22c55e 65%, #06b6d4 80%, #3b82f6 100%)
```

Animation: 12s ease-in-out infinite cycle (speeds up to 4s on hover). `prefers-reduced-motion: reduce` disables animation.

### Color Roles

- **Green** = Action (buttons, links, badges, CTAs)
- **Purple** = Atmosphere (overlines on dark, CTA gradients, glows)
- **Rainbow** = Accent borders (card wrappers, visual drama)

---

## Buttons

Rounded (border-radius: 12px / `rounded-xl`). Satoshi font for all buttons.
Note: Pill shape was rejected as "AI-looking". Nav bar container uses `rounded-2xl`; buttons use softer `rounded-xl`.

### Variants

| Variant   | Background                 | Text                     | Hover                                     |
| --------- | -------------------------- | ------------------------ | ----------------------------------------- |
| Primary   | `#22c55e`                  | `#ffffff`                | `#16a34a` + glow + translateY(-1px)       |
| Secondary | `#0f1f17`                  | `#ffffff`                | `#1a2e23` + translateY(-1px)              |
| Ghost     | transparent, 1px `#e5ebe8` | `#1a2e23`                | `#f1f5f2` fill                            |
| Glass     | `rgba(255,255,255,0.06)`   | `rgba(255,255,255,0.75)` | `rgba(255,255,255,0.12)` + color brighten |

### Sizes

| Size | Padding   | Font Size |
| ---- | --------- | --------- |
| `sm` | 8px 18px  | 13px      |
| `md` | 14px 28px | 15px      |
| `lg` | 18px 36px | 17px      |

---

## Glassmorphism

| Element      | Background               | Border                   | Blur |
| ------------ | ------------------------ | ------------------------ | ---- |
| Glass card   | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.08)` | 24px |
| Glass hover  | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.12)` | 24px |
| Glass subtle | `rgba(255,255,255,0.03)` | `rgba(255,255,255,0.06)` | 24px |
| Glass nav    | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.10)` | 20px |
| Glass badge  | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.10)` | 12px |

---

## Shadows & Glow

### Shadows (light sections — true neutral rgba)

| Token       | Value                             |
| ----------- | --------------------------------- |
| `shadow-xs` | `0 1px 2px rgba(13,13,31,0.04)`   |
| `shadow-sm` | `0 2px 8px rgba(13,13,31,0.06)`   |
| `shadow-md` | `0 8px 24px rgba(13,13,31,0.08)`  |
| `shadow-lg` | `0 16px 48px rgba(13,13,31,0.10)` |
| `shadow-xl` | `0 24px 64px rgba(13,13,31,0.12)` |

### Glow (dark sections)

| Token          | Value                                                         |
| -------------- | ------------------------------------------------------------- |
| `glow-default` | `0 0 40px rgba(34,197,94,0.25)`                               |
| `glow-hover`   | `0 0 60px rgba(34,197,94,0.4)`                                |
| `glow-hero`    | `0 0 40px rgba(34,197,94,0.25), 0 0 80px rgba(34,197,94,0.1)` |

---

## Border Radius

| Token         | Value  | Usage                        |
| ------------- | ------ | ---------------------------- |
| `radius-sm`   | 8px    | Small elements, tags         |
| `radius-md`   | 12px   | Inputs, small cards          |
| `radius-lg`   | 16px   | Feature cards                |
| `radius-xl`   | 24px   | Hero cards, large containers |
| `radius-full` | 9999px | Pills, nav, buttons, avatars |

---

## Hero Background — Liquid Crystal Shader

WebGL fragment shader rendered on full-viewport `<canvas>`. Organic, flowing liquid shapes tuned to green brand.

### Shader Parameters

| Param      | Value | Description             |
| ---------- | ----- | ----------------------- |
| hue        | 142   | Green (matches #22c55e) |
| speed      | 0.18  | Slow, organic movement  |
| noise      | 0.00  | Smooth surface          |
| warp       | 0.00  | No distortion           |
| zoom       | 0.50  | Zoomed out, large forms |
| brightness | 1.06  | Slightly bright         |

### Overlays

1. **Center darkening**: Radial gradient overlay keeping center dark for text readability
2. **Halftone dots**: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)` at 16x16px

### Fallback (no WebGL)

CSS gradient blobs with keyframe animation (the v2 approach).

---

## Nav Bar

Fixed, full-width, rounded glass bar with scroll-driven state transitions.

```
Position: fixed, top: 16px, left/right: 16px, max-width: 6xl, centered
Border-radius: rounded-2xl (16px)
Backdrop-filter: blur(20px)

Unscrolled state:
  Background: rgba(255,255,255,0.06), border: rgba(255,255,255,0.10)
  Text: white/55, hover: white/80
  Logo: green mark + "ConvertChat" text (white)
  Login button: glass variant

Scrolled state (scrollY > 20):
  Background: rgba(255,255,255,0.85), border: neutral-200/80, shadow-sm
  Text: neutral-500, hover: neutral-900
  Logo: green mark only ("ConvertChat" text collapses via max-width: 0 + opacity: 0)
  Login button: ghost variant

Scroll check runs on mount (handles restored scroll position).
```

---

## Animation / Motion

| Property            | Duration   | Easing                         | Usage                     |
| ------------------- | ---------- | ------------------------------ | ------------------------- |
| Hover transitions   | 200ms      | ease                           | Buttons, links, cards     |
| Card hover          | 250-300ms  | cubic-bezier(0.22, 1, 0.36, 1) | Card lift + shadow        |
| Entrance animations | 400ms      | cubic-bezier(0.22, 1, 0.36, 1) | Fade-in + slide on scroll |
| Liquid crystal      | continuous | ease-in-out                    | Hero shader (speed: 0.18) |
| Page transitions    | 250ms      | ease                           | Route changes             |

Use `framer-motion` for scroll reveals and page transitions. Liquid crystal shader pauses via IntersectionObserver when hero is out of viewport.

---

## Implementation Dependencies

| Package                     | Purpose                   |
| --------------------------- | ------------------------- |
| `framer-motion`             | Scroll animations, layout |
| `next-intl`                 | i18n (es/en)              |
| `@next/mdx` + `gray-matter` | Blog (MDX)                |
| Newsreader (Google Fonts)   | Heading font              |
| Satoshi (self-hosted woff2) | Body font                 |
