# Stats Section Redesign

## Goal
Replace the dark-card/gradient/glass stats section with a clean editorial layout on white. Add Clash Display as a display font for stat numbers only.

## Design Decisions

- **Layout**: White background, Newsreader serif headline centered, four stats in a horizontal row with vertical dividers
- **Font**: Clash Display (Semibold 600) for stat numbers only. All other headings remain Newsreader. Body stays Satoshi.
- **Headline**: "Your buyers are already there. You just need the bridge." in Newsreader, centered
- **Stats**: 4-column grid — "2B+" (green, larger), "100B+", "23x", "180+" (neutral-900). Labels below each in small sans.
- **No dark card, no glows, no glass effects, no gradient text**
- **Count-up animation**: Keep the existing useCountUp hook for numbers
- **Mobile**: 2x2 grid on small screens

## Changes Required

1. **Add Clash Display font** — Download from Fontshare, add to `fonts/` directory, register in layout
2. **Rewrite `messaging-stat-section.tsx`** — Replace dark card layout with editorial strip
3. **No i18n changes needed** — Same translation keys, same content

## What NOT to change
- No changes to other sections (before/after cards stay Newsreader)
- No changes to DESIGN_SYSTEM.md font hierarchy beyond documenting Clash Display as display accent
- No changes to i18n files
