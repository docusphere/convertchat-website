# ConvertChat Website

Marketing website for ConvertChat — a B2B WhatsApp lead reactivation platform.

## Stack
- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4** with `@theme inline` design tokens
- **next-intl** for i18n (es/en)
- **Framer Motion** for animations
- **@paper-design/shaders-react** for WebGL effects
- **TypeScript**

## Key Files
- `DESIGN_SYSTEM.md` — Typography, colors, buttons, glassmorphism, motion specs
- `docs/website-copy-positioning.md` — Full copy and positioning guide for all sections
- `messages/en.json` + `messages/es.json` — All i18n strings
- `app/[locale]/page.tsx` — Homepage (assembles all sections)
- `components/` — All UI components and sections

## Conventions
- Follow `DESIGN_SYSTEM.md` for all visual decisions (fonts, colors, spacing, border radius)
- Use `next-intl` for all user-facing text — never hardcode strings
- Use `SectionReveal` for scroll animations on sections
- Button component uses `rounded-xl` (NOT pill shape — user rejected pill as "AI-looking")
- Serif font: Newsreader. Sans font: Satoshi.
- Section padding: `px-6 py-28 md:py-36` as default
- Max container width: `max-w-6xl` for content sections

## Commands
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run typecheck  # TypeScript check
```

## Formatting
- No tabs, only spaces
- Prettier: `{ "printWidth": 120, "semi": true, "singleQuote": false, "trailingComma": "all" }`

## Git
- Never auto-commit
- Never add Co-Authored-By headers
- Commit messages: one-line preferred
