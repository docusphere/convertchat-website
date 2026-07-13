# Before/After Scroll Stack — Design Spec

**Date:** 2026-07-12
**Component:** `components/sections/before-after-section.tsx`
**Prototype (user-approved):** `.superpowers/brainstorm/53454-1783891575/before-after-scroll.html`

## Goal

Replace the static fade-in of the before/after comparison cards with a Manychat-style scroll-linked animation: as the user scrolls through the section, the green "With ConvertChat" card slides on top of the gray "Without ConvertChat" card, and a hand-drawn rainbow-gradient scribble draws itself around the green card's headline. Playful, scrubbed (reversible), and on-message: ConvertChat replaces the old way.

## Non-Goals

- No copy or i18n changes — all existing `beforeAfter.*` keys stay as-is
- No changes to card content, buttons, or the CheckIcon component
- No new dependencies — Framer Motion (already installed) drives everything

## Scroll Structure

- The `<section>` grows to `250vh` on desktop; inside it, a sticky stage (`position: sticky; top: 0; height: 100vh; overflow: hidden`) centers the cards vertically. The user scrolls "through" the animation while the cards stay on screen. `overflow: hidden` keeps the tilted/translated cards from spilling horizontally.
- On short viewports where a card is taller than the stage (cards are content-tall, ~640px+), the stage must not clip the card: center with `min-height: 100vh` semantics and allow vertical scroll of the card within the stage to be avoided by scaling the card down slightly (`transform-origin: center`) or letting the stage align to `flex-start` with padding — implementer picks whichever keeps the full card visible at 390×690 and 1280×700.
- Scroll progress (0→1) comes from Framer Motion `useScroll({ target: sectionRef, offset: ["start start", "end end"] })`.
- All motion values derive from that progress via `useTransform` — fully scrubbed, reverses when scrolling up.

### Timeline (progress → phases)

| Progress | Phase |
|----------|-------|
| 0 → 0.75 | Card travel (easeInOut on the travel fraction) |
| 0.75 → 1 | Scribble draws on |

## Card Motion (desktop, `md:` up)

Cards start in the current side-by-side grid (`grid-cols-2`, 24px gap). Both converge on the horizontal center of the container; `dist = (cardWidth + gap) / 2`:

- **Green card (after, z-index 2):** `translateX(-dist * travel)`, plus a playful tilt `rotate(sin(travel * π) * 2.5deg)` — peaks ~2.5° mid-flight, lands at 0°.
- **Gray card (before, z-index 1):** `translate((dist - peek) * travel, -peek * travel)` with `peek = 28px`, `scale(1 - 0.03 * travel)`, `opacity 1 → 0.85`. Final state: tucked behind the green card, peeking out top-left by ~28px.
- Card width is measured at runtime (`offsetWidth` via ref + resize observer or Framer's layout measurement) so the travel distance stays correct across viewport sizes.

## Rainbow Scribble

- Inline SVG absolutely positioned around the after-card `<h3>` ("Less chasing, more closing"): the `<h3>` sits in a relatively-positioned `title-wrap` and the SVG uses `inset: -38px -50px -42px -50px` (values from the prototype). `overflow: visible`, `pointer-events: none`, `aria-hidden="true"`. The loop draws **over** the text where they cross (scribble `z-index: 2`, `<h3>` `z-index: 1` — matching the approved prototype).
- Path: hand-drawn double loop encircling the headline (exact path from the prototype: `M 306 18 C 420 -6 548 22 545 88 C 542 158 420 210 262 216 C 118 222 8 186 14 118 C 20 54 130 10 300 30 C 420 44 500 78 492 120`, viewBox `0 0 560 240`, `preserveAspectRatio="none"`).
- Stroke: `linearGradient` with pastel brand-rainbow stops — `#a7f3d0` (0%) → `#c4b5fd` (45%) → `#67e8f9` (100%) — 5px width, round caps/joins. Pastels chosen for contrast on the green card (full-saturation brand colors disappear against `primary-500`).
- Draw-on: `pathLength="1"` + `stroke-dasharray: 1`; `stroke-dashoffset` maps `1 → 0` across progress 0.75→1 via `useTransform`.

## Mobile (below `md:`)

Same sticky mechanic, vertical:

- Sticky stage shows the gray card centered alone; the green card starts translated below the viewport.
- As the user scrolls, the green card slides up over the gray card, ending with a ~20px peek of gray at the top (gray also gets the same scale/opacity treatment).
- Same timeline split (travel 0→0.75, scribble 0.75→1). Section height ~250vh.

## Reduced Motion & Fallbacks

- `useReducedMotion()` → render the final stacked composition statically: green card on top, gray peeking, scribble fully drawn. Section at normal height (no 250vh scroll runway, no sticky).
- SSR/first paint: cards render at progress 0 (side by side) — no layout flash, transforms apply client-side.

## Files

- **Rewrite:** `components/sections/before-after-section.tsx` — keeps `BeforeCard`/`AfterCard`/`CheckIcon`, replaces the `SectionReveal` wrappers with the sticky stage + motion values. The scribble lives as a small component in the same file.
- No other files change.

## Testing / Verification

- `npm run typecheck` passes
- Playwright (port 3002): scroll through the section at 1280px and 390px — verify (a) cards scrub with scroll in both directions, (b) green lands on top with gray peeking, (c) scribble draws in the final stretch, (d) no layout shift in surrounding sections
- Reduced-motion emulation: static final composition, normal section height
