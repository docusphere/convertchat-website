# Navbar "Log in" Link → web.convertchat.co

**Date:** 2026-07-15
**Status:** Approved by Frank (S15 brainstorm)

## Problem

The site has no path to the app. The original parked plan (S8) was a shared-PIN
"velvet rope" page on the marketing site, but brainstorming concluded it would be
decoration: anyone typing web.convertchat.co directly skips it, and the app
currently allows open self-signup. The real gate belongs in the app.

## Decision

- **App side (separate codebase, Frank handles via its own Claude Code session):**
  signup requires an invite code, validated server-side; Google OAuth must not
  auto-create accounts; no-code path shows a book-a-call CTA. Brief delivered in chat.
- **Marketing site (this repo):** just a "Log in" navbar link to
  `https://web.convertchat.co`. No PIN page, no cookie, no new route.

This supersedes the S8 parked PIN-gate plan — that item is dropped (YAGNI).

## Design

`components/layout/navbar.tsx` only:

- `APP_URL` constant next to `BOOKING_URL`.
- **Desktop (`lg:` up):** quiet text link "Log in" between the locale switcher slot
  and the CTA button (placed left of the switcher), styled exactly like the nav
  links — `text-white/55` over the transparent hero navbar, `text-neutral-500`
  when solid/scrolled.
- **Mobile hamburger:** a "Log in" row after the nav links, above the language row,
  same styling as the other rows; closes the menu on tap.
- Plain `<a>` (external URL), same tab. Copy via existing i18n keys `nav.login`
  ("Log in" / "Iniciar sesión") — already present in both message files.
- Not added to `lib/routes.ts`/sitemap (external link, not a page).

## Verification

- `npm run typecheck` + `npm run build` pass.
- Playwright: link visible and pointing at web.convertchat.co on desktop (home
  transparent + scrolled/interior solid) and inside the mobile menu, both locales.
