# Hero Phone Component — Design Spec

## Goal

Add a realistic phone mockup to the hero section's right column, showing an animated WhatsApp conversation that demonstrates the ConvertChat product value prop. The conversation loops continuously, with typing indicators between messages for realism.

## Approach

**CSS 3D perspective phone with PNG frame + HTML chat overlay + Framer Motion animations.**

No React Three Fiber or WebGL. The premium feel comes from:
- Realistic iPhone PNG frame with transparent screen (StickPNG iPhone X mockup)
- CSS `perspective` for 3D tilt
- CSS keyframe for floating animation (defined in `app/globals.css`)
- Framer Motion for message sequencing, typing indicators, and loop

## Files

| Action | Path | Purpose |
|--------|------|---------|
| Create | `components/hero/hero-phone.tsx` | `"use client"` — Phone mockup with animated WhatsApp conversation |
| Modify | `components/hero/hero-section.tsx` | Import HeroPhone into right column |
| Modify | `app/globals.css` | Add `@keyframes phone-float` and `@keyframes dot-bounce` |
| Asset  | `public/phone-frame.png` | iPhone X frame with transparent screen (already downloaded, 1076x1628, 40KB) |

## Component: `<HeroPhone />`

### Structure

```
"use client"

<div>  (perspective wrapper — CSS perspective: 1000px)
  <div>  (phone container — CSS 3D tilt + float animation)
    <div>  (screen content — positioned absolutely, behind frame)
      <WhatsAppHeader />
      <ChatArea>
        <TypingIndicator />  (conditionally rendered)
        <ChatMessage />      (animated in sequence)
      </ChatArea>
      <InputBar />
    </div>
    <img>  (phone-frame.png — z-index on top, pointer-events: none)
  </div>
</div>
```

### Phone Frame Layering

Measured from `phone-frame.png` (1076×1628px):

- Screen content: `z-index: 1`, positioned `absolute` with these insets relative to the full image:
  - `top: 6.2%`
  - `bottom: 6.3%`
  - `left: 18.6%`
  - `right: 18.0%`
- Screen area uses `border-radius: 28px` and `overflow: hidden`
- Phone frame PNG: `z-index: 2`, `pointer-events: none`, `width: 100%`, sits on top so bezels cover screen edges

### CSS 3D Effect

Add to `app/globals.css` alongside existing `@keyframes blob` and `@keyframes rainbow-shift`:

```css
@keyframes phone-float {
  0%, 100% { transform: rotateY(-8deg) rotateX(3deg) translateY(0); }
  50% { transform: rotateY(-8deg) rotateX(3deg) translateY(-12px); }
}

@keyframes dot-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}
```

Applied via inline styles or Tailwind arbitrary values on the component. The `prefers-reduced-motion` media query in `globals.css` already disables animations globally — the float keyframe will respect that.

## Animation Sequence

The conversation plays as a looping sequence managed by a `useEffect` timer chain with cleanup on unmount. Use Framer Motion's `useReducedMotion()` hook: if `true`, skip the timer chain entirely and render all three messages at full opacity immediately (static view).

### Timeline

| Time | Event | Side |
|------|-------|------|
| 0.0s | Empty chat visible (just header + input bar) | — |
| 1.0s | Typing indicator appears | Business (right) |
| 2.5s | Typing gone, Message 1 slides in (broadcast) | Business (right) |
| 4.0s | Typing indicator appears | Buyer (left) |
| 5.0s | Typing gone, Message 2 slides in (reply) | Buyer (left) |
| 6.5s | Typing indicator appears | Business (right) |
| 7.5s | Typing gone, Message 3 slides in (close) | Business (right) |
| 10.0s | All messages fade out | — |
| 11.0s | Loop restarts from 0.0s | — |

Total cycle: ~11 seconds.

### Typing Indicator

Three bouncing dots in a chat bubble, matching WhatsApp's native typing UX:

- Business typing: green bubble (`#dcf8c6`), aligned right
- Buyer typing: white bubble, aligned left
- Each dot is a small `<span>` circle with `@keyframes dot-bounce`, staggered by `animation-delay: 0s / 0.15s / 0.3s`
- Indicator unmounts when the actual message mounts

### Message Animation

Each message enters with Framer Motion:
- `opacity: 0 → 1`
- `y: 8 → 0` (subtle slide up)
- `duration: 0.3s`
- Blue checkmarks (✓✓) appear 0.3s after message arrives

Only the individual `<ChatMessage>` and `<TypingIndicator>` elements animate. The chat background, header, and input bar remain at full opacity throughout the loop.

### Loop Reset

At 10.0s, all visible messages fade out (`opacity → 0`, `duration: 0.5s`). After a 0.5s pause (11.0s), the component resets state and the sequence restarts. Implementation: a single `cycle` state counter that increments to trigger re-render, clearing all message visibility states.

## Chat Content (Spanish)

### Message 1 — Business broadcast
- Product image: emoji placeholder `📱` on muted background (`#c8e6b0`)
- Text: **iPhone 15 Pro 256GB** / €890/ud — 40% bajo retail / Stock limitado. Pedido mín: 10 uds
- Time: 14:32 ✓✓

### Message 2 — Buyer reply
- Text: Me llevo 30 unidades 👍
- Time: 14:33

### Message 3 — Business close
- Text: Hecho. Factura en camino 🤝
- Time: 14:34 ✓✓

### WhatsApp Header
- Avatar: green circle (`#25d366`) with white "C"
- Name: "ConvertChat"
- Status: "en línea"

### Chat Styling
- Business messages: `#dcf8c6` (WhatsApp green), right-aligned
- Buyer messages: `#ffffff`, left-aligned
- No bubble tails — use squared-off corner on the origin side (`border-radius: 0 10px 10px 10px` for business, `10px 0 10px 10px` for buyer) as simplified WhatsApp approximation
- Chat background: `#ece5dd` (WhatsApp beige)
- Header: `#075e54` (WhatsApp dark green)
- Blue checkmarks: `#53bdeb`
- Font: `system-ui`, sizes 11-13px for messages

## Responsive Behavior

- **Desktop (lg+):** Phone visible in right column of hero grid
- **Tablet/mobile (<lg):** Phone hidden (`hidden lg:flex`), matching current right column behavior
- Phone container max-width: ~320px, centered in column

## Accessibility

- Use Framer Motion's `useReducedMotion()` hook. If `true`: skip `useEffect` timer chain, render all messages immediately at full opacity, omit the float animation class from the phone container
- Phone frame image: decorative, `alt=""`
- Chat content is decorative/illustrative, not interactive — `aria-hidden="true"` on the whole component

## Performance

- Phone frame PNG: ~40KB, loaded with standard `<img>` (above the fold, no lazy loading)
- No WebGL, no canvas, no heavy dependencies
- Framer Motion already in bundle (used across site)
- CSS float animation is GPU-composited (`transform` only, no layout thrash)
- Single `useEffect` manages the timer sequence — cleanup on unmount clears all timeouts

## Integration

In `hero-section.tsx`, replace the empty right column:

```tsx
{/* Right column — phone mockup */}
<div className="hidden lg:flex lg:justify-center">
  <HeroPhone />
</div>
```

Note: the parent grid already has `items-center` so vertical centering is handled at the grid level. Only `justify-center` is needed on the column.
