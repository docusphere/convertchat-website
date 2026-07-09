# AI Agent Section — Day/Night Chat Cycle

## Goal

Replace the static nighttime WhatsApp chat in the AI Agent section with an animated day/night cycle showing two separate conversations. Reinforces the "Your store never closes" / 24/7 messaging.

## Architecture

A single React component (`AiAgentChat`) replaces the current inline chat markup in `ai-agent-section.tsx`. Uses CSS keyframe animations (in `app/globals.css`) for the sky crossfade and sun/moon movement. Uses Framer Motion `AnimatePresence` + `useEffect` timers for message sequencing (same pattern as `hero-phone.tsx`). Animation starts only when the component enters the viewport via Framer Motion's `useInView`.

## Design Decisions

- **Two separate conversations** — daytime FAQ + product recommendation, nighttime sale closure. Different customers, both served instantly. Proves 24/7.
- **Electronics wholesaler context** — matches the industries section, different from the hero's fashion store.
- **CSS keyframe sky + Framer Motion messages** — sky transitions are purely CSS (performant, continuous loop). Messages use the proven hero phone timer + AnimatePresence pattern.
- **Clean crossfade transitions** — no sunset/sunrise colors. Night sky opacity-fades directly over day sky. Sun fades down, moon fades up. Fast transitions (~2s) to maximize time on conversion-relevant content.
- **AI badge on responses** — small "ConvertChat AI" tag inside each AI bubble (top, before message text) using the `Bot` icon from `lucide-react`.
- **Viewport-triggered start** — animation timers begin only when the component scrolls into view (`useInView` from Framer Motion), so the user always sees the cycle from the start.

## Conversation Content

All text via `next-intl` keys under `aiAgent.chat.*`.

### Day Conversation (10:15 AM)

| Role | Message |
|------|---------|
| Customer | Do you ship iPhone 15 Pro Max to Germany? What's the MOQ? |
| AI | Yes! We ship to Germany via DHL Express (3-5 days). MOQ is 25 units. Current stock: 340 units. |
| Customer | Unit price for 50 units? |
| AI | EUR 1,089/unit for 50x. Also have 128GB at EUR 989 — popular in your region. Want a quote for both? |

Status line: "Answered in under 5 seconds"

### Night Conversation (2:30 AM)

| Role | Message |
|------|---------|
| Customer | Need 100x Samsung A55 urgently. Available? |
| AI | In stock! 100x Samsung A55 128GB at EUR 285/unit. Total: EUR 28,500. Ready to ship tomorrow. |
| Customer | Perfect. Send me the order link. |
| AI | Done! Here's your order: [link card] |

Link card text: i18n key `aiAgent.chat.night_link` → `order.techsupply.com/SA55-100`
Status line: "Sale closed at 2:31 AM"

## State Machine

A single `mode` state controls which phase the component is in:

```
type Mode = "day" | "day-to-night" | "night" | "night-to-day";
```

Each mode triggers different behavior:

1. **`day`**: Run the day message sequence (typing → msg1 → typing → msg2 → typing → msg3 → typing → msg4 → hold). When complete, wait 1s then set mode to `day-to-night`.
2. **`day-to-night`**: Day messages fade out. CSS sky crossfade runs (~2s). Sun fades down, moon fades up. After 2s, set mode to `night`.
3. **`night`**: Run the night message sequence (same pattern). When complete, wait 1s then set mode to `night-to-day`.
4. **`night-to-day`**: Night messages fade out. Sky crossfade reverses. Moon fades down, sun fades up. After 2s, set mode to `day` (loop restarts).

The sky CSS animation runs independently as a continuous loop synced to the total cycle duration. The JS timer drives message sequencing within each mode.

### Message Timeline (per conversation)

Each conversation runs ~8 seconds:

```typescript
// Day conversation timeline
const DAY_TIMELINE = [
  { phase: "typing1",  delay: 600  },  // show typing
  { phase: "msg1",     delay: 1800 },  // customer asks FAQ
  { phase: "typing2",  delay: 800  },  // AI typing
  { phase: "msg2",     delay: 2000 },  // AI answers + recommends
  { phase: "typing3",  delay: 600  },  // customer typing
  { phase: "msg3",     delay: 1200 },  // customer asks price
  { phase: "typing4",  delay: 800  },  // AI typing
  { phase: "msg4",     delay: 2000 },  // AI gives quote
  { phase: "hold",     delay: 1000 },  // pause before transition
];

// Night conversation timeline (same structure)
const NIGHT_TIMELINE = [
  { phase: "typing1",  delay: 600  },
  { phase: "msg1",     delay: 1500 },
  { phase: "typing2",  delay: 800  },
  { phase: "msg2",     delay: 1800 },
  { phase: "typing3",  delay: 600  },
  { phase: "msg3",     delay: 1200 },
  { phase: "typing4",  delay: 800  },
  { phase: "msg4",     delay: 2000 },
  { phase: "hold",     delay: 1000 },
];
```

Total cycle: ~8s day + ~2s transition + ~8s night + ~2s transition = **~20 seconds**.

## Animation Specification

### Sky Implementation

Two stacked `div` layers inside the chat container:

```css
/* Base layer — always visible */
.sky-day {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #3b82f6 0%, #87CEEB 40%, #bfdbfe 100%);
}

/* Overlay — fades in/out */
.sky-night {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #0a0e1a 0%, #111827 40%, #1e293b 100%);
  animation: night-fade 20s ease-in-out infinite;
}

@keyframes night-fade {
  0%   { opacity: 0; }
  3%   { opacity: 0; }
  42%  { opacity: 0; }
  47%  { opacity: 1; }
  50%  { opacity: 1; }
  92%  { opacity: 1; }
  97%  { opacity: 0; }
  100% { opacity: 0; }
}
```

All `@keyframes` go in `app/globals.css`, consistent with existing keyframes (`dot-bounce`, `phone-float`, `rainbow-shift`).

### Celestial Bodies

- **Sun**: SVG — circle with radial gradient fill + glow div. Animates `top` (14px → 70px) and `opacity` (1 → 0) during day-to-night, reverse for night-to-day.
- **Moon**: SVG crescent path (same as current). Animates `top` (70px → 16px) and `opacity` (0 → 0.85) during day-to-night, reverse for night-to-day.
- **Stars**: 5-7 small `div` circles (`bg-amber-100`) with CSS `twinkle` keyframe (opacity oscillation). Container fades in/out with night sky.

### Reduced Motion

When `useReducedMotion()` returns `true`:
- Sky fixed to night gradient (no animation)
- Moon visible, no sun
- Stars visible, no twinkle animation
- All 4 night messages rendered statically (no typing indicators, no sequencing)
- Day conversation not shown
- This matches the current static behavior

## Component Structure

### Files to Create

- `components/sections/ai-agent-chat.tsx` — The animated day/night chat component

### Files to Modify

- `components/sections/ai-agent-section.tsx` — Replace inline chat markup (lines 75-118) with `<AiAgentChat />`
- `messages/en.json` — Add `aiAgent.chat` keys
- `messages/es.json` — Add Spanish translations
- `app/globals.css` — Add `night-fade`, `sun-cycle`, `moon-cycle`, `stars-fade`, `twinkle` keyframes

### i18n Keys

```json
{
  "aiAgent": {
    "chat": {
      "day_time": "10:15 AM",
      "day_customer1": "Do you ship iPhone 15 Pro Max to Germany? What's the MOQ?",
      "day_ai1": "Yes! We ship to Germany via DHL Express (3-5 days). MOQ is 25 units. Current stock: 340 units.",
      "day_customer2": "Unit price for 50 units?",
      "day_ai2": "EUR 1,089/unit for 50x. Also have 128GB at EUR 989 — popular in your region. Want a quote for both?",
      "day_status": "Answered in under 5 seconds",
      "night_time": "2:30 AM",
      "night_customer1": "Need 100x Samsung A55 urgently. Available?",
      "night_ai1": "In stock! 100x Samsung A55 128GB at EUR 285/unit. Total: EUR 28,500. Ready to ship tomorrow.",
      "night_customer2": "Perfect. Send me the order link.",
      "night_ai2": "Done! Here's your order:",
      "night_link": "order.techsupply.com/SA55-100",
      "night_status": "Sale closed at 2:31 AM",
      "ai_label": "ConvertChat AI"
    }
  }
}
```

## Visual Details

- Chat container: `rounded-2xl bg-neutral-950 overflow-hidden relative` (same as current)
- Customer bubbles: `bg-white/[0.92] text-neutral-900 rounded-2xl rounded-tl-sm` — max-width 82%
- AI bubbles: `bg-green-600 text-white rounded-2xl rounded-tr-sm` — max-width 82%
- AI badge: inside the bubble, top, before message text. `inline-flex items-center gap-1 text-[9px] font-semibold text-white/70 bg-white/15 rounded px-1.5 py-0.5 mb-1`. Icon: `Bot` from `lucide-react` at 10px.
- Time badge: centered, `bg-black/[0.12] backdrop-blur-sm rounded-lg px-2.5 py-1 text-[11px] text-white/70`
- Status line: centered, `text-white/25 text-[10px] mt-auto`
- Link card (night convo): `bg-white/15 border-l-2 border-white/50 rounded-md px-2 py-1.5 mt-1 text-[11px] text-white/80`
- Message timestamps: `text-[9px] opacity-45 text-right mt-0.5`
