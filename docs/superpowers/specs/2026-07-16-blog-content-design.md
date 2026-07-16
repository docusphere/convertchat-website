# Blog Content Wave 1 — Design

**Date:** 2026-07-16 (S16)
**Status:** Approved by Frank (post list, sequencing, anti-slop pipeline, image strategy)
**Owner:** Frank / ConvertChat

## Goal

Blog content is the main SEO ranking lever (S13/S14 conclusion: site is technically sound, 1 post live, no ranking data). Ship 7 commodity guides (en + es) that capture existing search demand around WhatsApp marketing mechanics, funneling readers to the Cal.com booking and /pricing.

Keyword research (DataForSEO, 2026-07-16, ~$0.26) confirmed: the category term "lead reactivation" has near-zero volume (20/mo EN, ~10 ES). People search the mechanics, not the category. Commodity guides catch demand; flagship posts (phase 2) define the category.

## Strategy (locked in S15/S16)

- **Strategy C:** commodity how-to guides now + flagship posts from Frank's real campaign data later
- **Bylines:** "ConvertChat Team" (commodity), "Francisco Nillard — Founder, ConvertChat" (flagship)
- **Flagships deferred:** only directional data exists today (no publishable metrics). Phase 2, separate spec, once campaign numbers can be published
- **Languages:** en + es via the existing MDX blog framework. Spanish is a native adaptation targeting es keyword data — never a literal translation
- **Sequencing:** quick wins first (wave 1a), then pillar + remaining spokes (wave 1b)

## Keyword data (DataForSEO Labs, Google, 2026-07-16)

EN = US (2840), ES = Spain (2724). vol = monthly searches, diff = keyword difficulty 0–100.

| Cluster | EN vol/diff | ES vol/diff |
|---|---|---|
| whatsapp business api | 2,900/40 | 1,300/18 |
| whatsapp business api pricing/cost | 480/22, 50/8 | 50/–, 20/– |
| whatsapp broadcast limit | 1,600/19 | – |
| whatsapp broadcast message(s) | 590/0–9 | – |
| whatsapp (ai) chatbot | 590–720/35–38 | 390/14 |
| whatsapp marketing | 390/28 (CPC $32) | 170/0 |
| whatsapp marketing messages / template | 170/3, 90/6 | – |
| whatsapp marketing examples/campaigns/strategies | 50–70/0–3 | – |
| whatsapp automation / tools | 260/21, 110/1 | 70/0 (automatizar mensajes) |
| whatsapp marketing automation | 50/2 | – |
| mensajes masivos whatsapp (+ "como enviar", "sin que te bloqueen") | – | 40/49 + longtails 10–30 |
| abandoned cart whatsapp (+ template) | 10/– | – |
| lead reactivation / reactivar clientes inactivos | 20/– | 10/– |

Notes: US volumes are structurally modest (WhatsApp is a minor US channel) but CPCs of $15–42 signal high commercial value per visitor. ES/Spain chosen for the es market; can re-run for MX/LatAm when GSC shows where es traffic comes from.

**Target markets (S16 decision): UK + Spain primary; US informational-only.** UK check (2026-07-16, keyword_overview): volumes comparable, difficulty often lower (whatsapp marketing 320/10 UK vs 390/28 US; broadcast message 590/11; business api 1,000/64). Same English posts rank in both markets — generic `en` hreflang, no site changes.

**US restriction (verified 2026-07-16):** Meta has paused ALL marketing template messages to US phone numbers since 2025-04-01 (error 131049); still in force, no end date. Restriction is on recipient numbers (+1), not business location. Utility/auth templates, 24h service-window replies, and Click-to-WhatsApp ads (72h window) still work to US numbers. Non-US destinations unaffected. Consequences:
- ConvertChat's core use case (reactivation broadcasts) does not work for US-recipient lists → US is not a sales target; UK + Spain are
- The pillar (post 4) and pricing post (post 3) each get an explicit "WhatsApp marketing in the US" section covering the pause — required for accuracy (compliance-first stance) and a trust/differentiation win over competitor content that ignores it

Content implications:
- International English; no US-only assumptions
- Pricing post (3): worked examples in £ and € alongside $ (Meta bills per destination country — include UK + Spain rates)
- Compliance sections lean into GDPR/opt-in — a real differentiator vs the India/US-centric content that ranks today, and directly relevant to UK + Spanish businesses

## The 7 posts

Hub-and-spoke: post 4 is the pillar (hub); the rest are spokes.

### Wave 1a — quick wins

**1. WhatsApp broadcast limits — and how to send compliant broadcasts at scale**
- Slugs: `whatsapp-broadcast-limits` / `limites-difusion-whatsapp`
- Primary: whatsapp broadcast limit (1,600/19). Secondary: broadcast message cluster (590/0), broadcast list (260/0), how to send broadcast messages (140/0)
- Intent: informational → commercial bridge. The honest answer to "why won't my broadcast arrive" (saved-contact requirement, 256-recipient list cap) leads naturally to the API tier system
- Outline: current limits by product (WhatsApp app / Business app / Business API) → why broadcasts don't arrive → limits comparison table → messaging tiers on the API → how to scale without getting flagged → FAQ
- Images: hero + limits comparison table (native markdown) + 1 chat mockup (broadcast example)

**2. Best WhatsApp automation tools compared**
- Slugs: `whatsapp-automation-tools` / `herramientas-automatizacion-whatsapp`
- Primary: whatsapp automation (260/21), whatsapp automation tools (110/1). Secondary: whatsapp marketing automation (50/2); es: automatizar mensajes whatsapp (70/0), automatizar whatsapp con ia (20/–)
- Intent: commercial. Honest listicle: ConvertChat included and positioned where it genuinely wins (lead reactivation, done-for-you AI agent); competitors (e.g. Manychat, Wati, respond.io, Twilio, Zapier-based flows) described fairly with real strengths
- Outline: what you can automate on WhatsApp → evaluation criteria → tool-by-tool review → comparison table → which tool for which use case → FAQ
- Images: hero + comparison table + 1 chat mockup (automated flow example)

**3. WhatsApp Business API pricing, explained**
- Slugs: `whatsapp-business-api-pricing` / `precios-whatsapp-business-api`
- Primary: whatsapp business api pricing (480/22); es: whatsapp business api (1,300/18) + precio cluster. Secondary: api cost (50/8), providers (170/19–42)
- Intent: commercial. Meta's per-message pricing, template categories (marketing/utility/authentication), BSP markups, worked examples. Links hard to /pricing (the costs-explainer section already exists there — reuse the same numbers, never contradict them)
- Dependency: the pricing-page currency switch (£ on en, € on es — S16 decision, tracked in scratchpad) must land before this post ships, so the post's £/€ examples match the page
- Outline: how Meta bills → message categories with prices → what providers add on top → worked example (1,000-contact campaign) → hidden costs checklist → how ConvertChat pricing maps to this → FAQ
- Images: hero + pricing tables (native markdown)

### Wave 1b — pillar + remaining spokes

**4. WhatsApp marketing: the complete guide (PILLAR)**
- Slugs: `whatsapp-marketing-guide` / `guia-marketing-whatsapp`
- Primary: whatsapp marketing (390/28; es 170/0). Secondary H2s capture: strategies (50/3), examples (70/0), campaigns (70/0–3), marketing messages (170/3)
- Outline: why WhatsApp beats email/SMS for existing lists → building an opt-in list from existing contacts → campaign types (broadcast promos, reactivation, abandoned cart, back-in-stock) → strategies → real-world examples → measuring results → tools → compliance rules → FAQ
- Links to all 5 spokes. Longest post (2,000–2,500 words)
- Images: hero + Higgsfield concept illustration + 2 chat mockups

**5. 25 WhatsApp marketing message templates**
- Slugs: `whatsapp-marketing-message-templates` / `plantillas-mensajes-whatsapp`
- Primary: whatsapp marketing messages (170/3), whatsapp marketing message template (90/6). Secondary: abandoned cart whatsapp message template (10/–)
- Intent: informational, high link/bookmark value. Copy-paste templates grouped: reactivation/win-back, abandoned cart, promos, back-in-stock, order updates, follow-ups
- Outline: template approval rules on the API → personalization principles → 25 templates by category (each with the copy + when to send) → common rejection reasons → FAQ
- Images: hero + 4–6 chat mockups (templates rendered as WhatsApp bubbles — the core visual asset of this post)

**6. How to send bulk WhatsApp messages without getting banned**
- Slugs: `send-bulk-whatsapp-messages` / `enviar-mensajes-masivos-whatsapp`
- ES-first: como enviar mensajes masivos por whatsapp (40/49), "...sin que te bloqueen" (10/–), enviar mensajes masivos whatsapp gratis (30/–); EN: whatsapp business api for bulk messaging (140/33)
- Intent: informational with a compliance twist — most ranking content teaches spam tools; we teach the safe path. This IS the differentiator
- Outline: why accounts get banned → the wrong ways (unofficial mods, browser extensions, Excel senders) and their real risks → the right way (API + opt-in) → step-by-step → quality rating and tier limits → FAQ
- Images: hero + Higgsfield concept illustration + 1 chat mockup

**7. WhatsApp AI agent: answer FAQs and close sales 24/7 (S16 addition)**
- Slugs: `whatsapp-ai-chatbot` / `chatbot-whatsapp-ia`
- Primary: whatsapp ai chatbot (590/38 US, 260/25 UK); es: chatbot whatsapp (390/14), chatbot whatsapp gratis (50/6). Secondary: ai chatbot for whatsapp (50/32), best whatsapp ai chatbot (50/–), automatizar whatsapp con ia (20/–)
- Intent: mixed builder/commercial. Differentiation: ranking content is "how to build a chatbot" tutorials; we write the outcome post — an AI agent that answers repeat FAQs at 2am, qualifies leads, and closes sales on autopilot. Reuses the homepage AI Agent day/night narrative and links to that section. The ONLY post that directly sells the AI add-on
- Honesty requirements: what AI can and can't close; human-escalation paths; "free chatbot" options covered honestly with their limits (captures "gratis" intent); AI-disclosure note (EU transparency — users must know they're talking to AI)
- Outline: what a WhatsApp AI agent actually does (vs. menu-tree chatbots) → answering FAQs 24/7 → qualifying and closing leads (day/night scenario) → free options and where they stop → build vs. buy → setup requirements (API) → AI disclosure and compliance → FAQ
- Images: hero + Higgsfield concept illustration (night-shift agent scene — strongest illustration story of the set) + 2 chat mockups (FAQ answer + closed sale)

### Internal linking rules

- Every spoke → pillar (once it exists) + at least 1 sibling spoke + exactly 1 money page (/pricing or /)
- Pillar → all 6 spokes
- Wave 1a posts ship without pillar links; retrofit them in one edit when the pillar ships (wave 1b)
- CTA placement per post: one mid-article contextual CTA + one end CTA (Cal.com booking `https://cal.com/architct/onboarding` or /pricing, whichever fits the post's intent). CTA blocks do NOT count toward the "exactly 1 money page" rule — that rule governs in-prose links only
- Length targets: pillar 2,000–2,500 words; all spokes 1,200–1,800 words

## Editorial pipeline (anti-slop)

Every post, both languages: **SERP check → outline → draft → humanizer edit pass → Frank review**.

- **SERP check (pre-draft):** pull the live Google top-10 for the post's primary keyword via DataForSEO SERP API (~$0.002/query; account has ~$49 credits) in both markets. The outline must answer what the ranking pages answer, and beat them on at least one axis (compliance depth, honest comparison, copy-paste templates)

- **Humanizer skill** (`~/.claude/skills/humanizer`, blader/humanizer v2.8+, installed S16) is a mandatory edit pass on every draft. It removes generic AI tells: inflated significance, promotional language, rule-of-three, em-dash overuse, negative parallelisms, AI vocabulary, uniform rhythm
- **Pass mechanics:** the edit pass runs in a fresh subagent that receives only the humanizer skill, the draft, and the voice guide — never the drafting session's context (self-review rubber-stamps). For the first post, the before/after changes are shown to Frank to calibrate the pass; afterwards it runs silently
- **Voice calibration (optional):** if Frank provides a sample of his own writing (en or es), the pass matches that voice instead of the generic default
- **ConvertChat voice guide** (the brand layer humanizer can't infer):
  - Practitioner writing for store owners and marketers — not content written for Google
  - Direct. Short declaratives mixed with longer sentences. Contractions fine. Second person ("you" / "tú" — matches site copy register)
  - Opinions allowed and encouraged ("Most bulk senders get banned because they deserve to")
  - Numbers and specifics over adjectives. Banned: "revolutionary", "game-changing", "seamless", "unlock", "elevate" and superlative cousins
  - Compliance-first stance everywhere: official API vs unofficial tools always distinguished; never teach spam mechanics; opt-in assumed
  - Every stat is either sourced (linked) or cut. No invented benchmarks
  - Spanish posts written natively against es keyword data; idioms and examples localized, not translated
- **Frontmatter:** existing fields (`title`, `description`, `date`, `author`, `tags`) plus the new required `image` field (see Technical integration). Author: "ConvertChat Team". Tags per cluster (e.g. `whatsapp-marketing`, `automation`, `pricing`)

## Images

Three tiers, all localizable:

1. **WhatsApp chat mockups** (inline) — the `ChatMockup` renderer component (see Blog article renderer), styled in the site's existing chat visual language (hero phone / AI agent chat aesthetic). Text is per-locale, authored in the MDX
2. **Branded hero/OG per post** — template-based, consistent with existing `public/og/og-{en,es}.png` style; doubles as the post's OG image
3. **Higgsfield concept illustrations** — cartoon/flat editorial illustration, explicitly NOT photorealistic. One master style prompt defined in the implementation plan; every illustration derives from it:
   - Flat vector cartoon, bold shapes, limited palette from brand tokens (neutrals, accent purple, WhatsApp green; rainbow gradient sparingly)
   - No text baked into images (en/es share assets)
   - No faces requiring realism; stylized characters or object-scenes
   - Workflow: Claude writes prompts → Frank generates in Higgsfield → Claude places + optimizes (WebP, ≤150KB, width ≤1600px)
   - Async: posts ship with mockups + hero; illustrations slot in when generated. Only posts 4 and 6 get one in wave 1

## Blog article renderer (required, wave 1a prerequisite)

Discovery (S16): the current post page renders `post.content` as raw text via `whitespace-pre-line` (`app/[locale]/blog/[slug]/page.tsx:50`) — no markdown at all. Long-form guides need a real article renderer before any post ships. Follow the `components/legal/legal-article.tsx` pattern (custom renderer, existing precedent).

Required elements, all within the existing design system (Satoshi body / Newsreader serif / Clash Display stats — no new fonts):

- Markdown basics: serif H2/H3, paragraphs, lists, links, **tables** (posts 1–3 depend on them), inline code
- `ArticleImage` — body images with optional caption
- `ChatMockup` — WhatsApp bubbles in the site's chat visual language, text per-locale
- `PullQuote` — Newsreader serif editorial quote treatment ("sayings")
- `StatHighlight` — big Clash Display number + label (matches homepage stats)
- `Callout` — tip/warning box (compliance notes)
- `CtaBlock` — mid-article and end CTA

**Visual rhythm rule:** a visual element (image, mockup, table, pull quote, stat, callout) roughly every 300–400 words. No full-viewport text walls. Verified per post at review time (dev server + Playwright screenshots at key breakpoints; note: scroll into view — SectionReveal-style full-page screenshots show empty gaps).

## Technical integration

Per post: 2 MDX files (`content/blog/{en,es}/<slug>.mdx`) + 2 static imports & registry entries in `lib/blog.ts` + 1 translation pair in `lib/blog-slugs.ts`. Sitemap, hreflang, canonical, and BlogPosting JSON-LD derive automatically (S12/S13 architecture). Prettier via explicit flags (`--print-width 120 --semi --no-single-quote --trailing-comma all`) — repo has no .prettierrc.

**Per-post OG image (required, wave 1):** add `image` to post frontmatter and wire it through `blogPostMetadata()` and BlogPosting JSON-LD so each branded hero doubles as the post's OG card (also closes the known SEO minor: BlogPosting `image`/`dateModified`). Exact frontmatter shape resolved in the implementation plan.

## Out of scope

- Flagship posts (phase 2 — needs publishable campaign data; separate spec)
- Blog index redesign, categories/tag pages, RSS
- New keyword markets (MX/LatAm re-run waits for GSC signal)
- Product page videos

## Success criteria

- 12 MDX posts live (6 en + 6 es), each passing the humanizer edit pass and Frank's review before commit
- GSC: impressions on target queries within 2–4 weeks of each wave; titles/content iterated in SEO round 2
- Zero contradictions with /pricing numbers or positioning copy (`docs/website-copy-positioning.md`)

## Review workflow

- Claude drafts, wires each post into the framework, and hands Frank rendered URLs on the dev server (port 3002): `localhost:3002/blog/<slug>` + `/es/blog/<slug>`, with 2–3 specific review points per post (claims accuracy, tone, CTA placement)
- **Cadence: first post reviewed solo** (calibrates voice, humanizer output, mockup style), **then per wave** (remaining 1a batch, then 1b batch)
- Frank comments in chat → Claude revises → Frank approves → commit. Nothing commits without Frank's sign-off (never auto-commit)
