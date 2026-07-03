# Website Polish Pass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform ConvertChat's working-but-generic marketing site into a premium $10K website with visual cohesion, rainbow borders, dark section moments, FAQ, navbar redesign, and 3D elements.

**Architecture:** P0 foundation first (tokens, reusable components), then section-by-section upgrades, then P1 polish (icons, hero phones). Each task produces a buildable site — no task leaves the build broken.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4 (`@theme inline`), Framer Motion, next-intl, @paper-design/shaders-react

**Spec:** `docs/superpowers/specs/2026-07-03-website-polish-pass-design.md`

---

## File Map

### New Files
| File | Responsibility |
|------|---------------|
| `components/ui/rainbow-border.tsx` | Reusable animated rainbow gradient border wrapper |
| `components/sections/faq-section.tsx` | FAQ accordion with dark bg, Framer Motion height animation |
| `components/hero/hero-phones.tsx` | Floating 3D phone mockups with notification animations |

### Modified Files
| File | Changes |
|------|---------|
| `app/globals.css` | New neutral tokens, accent tokens, rainbow gradient, shadow updates, dark-base update, rainbow keyframes |
| `app/[locale]/page.tsx` | Add FaqSection import |
| `components/layout/navbar.tsx` | Full redesign: full-width, scroll states, logo collapse |
| `components/layout/footer.tsx` | White bg, Meta badge, restructured layout |
| `components/hero/hero-section.tsx` | Add HeroPhones + Meta partner badge |
| `components/sections/problem-section.tsx` | Swap GradientCard to RainbowBorder |
| `components/sections/how-it-works.tsx` | RainbowBorder wrapper on grid |
| `components/sections/platform-section.tsx` | Hover effects upgrade |
| `components/sections/ai-agent-section.tsx` | Card-as-section on white bg, purple overline, RainbowBorder preview |
| `components/sections/industries-section.tsx` | White bg, RainbowBorder 2x2 grid, inner dividers |
| `components/sections/proof-section.tsx` | RainbowBorder per card, styled company initials |
| `components/sections/cta-section.tsx` | Rounded card on white bg |
| `components/sections/messaging-stat-section.tsx` | Neutral color class updates |
| `components/sections/before-after-section.tsx` | Neutral color class updates |
| `messages/en.json` | FAQ strings, meta partner text |
| `messages/es.json` | FAQ strings (ES), meta partner text |
| `DESIGN_SYSTEM.md` | Update button radius, new color tokens, navbar spec |

### Delete
| File | Reason |
|------|--------|
| `components/sections/feature-cards.tsx` | Unused, superseded by platform-section.tsx |
| `components/sections/buying-section.tsx` | Unused |

---

## Task 1: Update Color Tokens & CSS Foundation

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Update neutral tokens from green-tinted to true neutral**

In `app/globals.css`, replace the `:root` CSS custom properties:

```css
:root {
  /* Primary (Green) — unchanged */
  --primary-400: #4ade80;
  --primary-500: #22c55e;
  --primary-600: #16a34a;
  --primary-700: #15803d;

  /* Neutral (true neutral — no green tint) */
  --neutral-50: #fafafa;
  --neutral-100: #f2f2f5;
  --neutral-200: #e5e5ea;
  --neutral-400: #8b8b92;
  --neutral-500: #5a5a65;
  --neutral-700: #1a1a2e;
  --neutral-900: #0d0d1f;

  /* Dark base (true neutral) */
  --dark-base: #06060f;

  /* Accent (Purple) */
  --accent-300: #c4b5fd;
  --accent-400: #a78bfa;
  --accent-500: #8b5cf6;
  --accent-600: #7c3aed;
  --accent-700: #6d28d9;

  /* Rainbow gradient */
  --rainbow-gradient: linear-gradient(
    135deg, #7c3aed 0%, #ec4899 20%, #f97316 35%,
    #eab308 50%, #22c55e 65%, #06b6d4 80%, #3b82f6 100%
  );

  /* Gradient palette — unchanged */
  --gradient-green: #22c55e;
  --gradient-teal: #14b8a6;
  --gradient-cyan: #06b6d4;
  --gradient-lime: #84cc16;
  --gradient-blue: #3b82f6;
}
```

- [ ] **Step 2: Add accent tokens to @theme inline block**

Add after the existing gradient-blue line in the `@theme inline` block:

```css
  --color-accent-300: var(--accent-300);
  --color-accent-400: var(--accent-400);
  --color-accent-500: var(--accent-500);
  --color-accent-600: var(--accent-600);
  --color-accent-700: var(--accent-700);
```

- [ ] **Step 3: Update shadow tokens to true-neutral rgba**

Replace the shadow values in `@theme inline`:

```css
  /* Shadows (true neutral) */
  --shadow-xs: 0 1px 2px rgba(13, 13, 31, 0.04);
  --shadow-sm: 0 2px 8px rgba(13, 13, 31, 0.06);
  --shadow-md: 0 8px 24px rgba(13, 13, 31, 0.08);
  --shadow-lg: 0 16px 48px rgba(13, 13, 31, 0.1);
  --shadow-xl: 0 24px 64px rgba(13, 13, 31, 0.12);
```

Keep glow tokens unchanged (intentionally green).

- [ ] **Step 4: Add rainbow border keyframes and hover speed-up**

Add after the existing `@utility animate-blob` block at end of file:

```css
@keyframes rainbow-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.rainbow-border-animated:hover {
  animation-duration: 4s;
}

@media (prefers-reduced-motion: reduce) {
  .rainbow-border-animated {
    animation: none !important;
  }
}
```

Note: Hover speed-up (12s → 4s) is defined in CSS, not in the component — keeps the component simple and the hover behavior centralized.

- [ ] **Step 5: Build and verify**

Run: `npm run build`
Expected: Build succeeds. All existing styles resolve correctly with new token values.

- [ ] **Step 6: Commit**

```
git add app/globals.css
git commit -m "feat: update color tokens to true neutral, add accent purple and rainbow gradient"
```

---

## Task 2: Create RainbowBorder Component

**Files:**
- Create: `components/ui/rainbow-border.tsx`

- [ ] **Step 1: Create the component**

```tsx
import type { ReactNode } from "react";

export function RainbowBorder({
  children,
  className = "",
  padding = "4px",
  borderRadius = "20px",
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
  borderRadius?: string;
}) {
  const innerRadius = `calc(${borderRadius} - ${padding})`;

  return (
    <div
      className={`rainbow-border-animated group/rainbow ${className}`}
      style={{
        padding,
        borderRadius,
        background: "var(--rainbow-gradient)",
        backgroundSize: "200% 200%",
        // Spec §5 says 8s; §8 says 12s. Using 12s per §8 Motion Spec (more subtle).
        animation: "rainbow-shift 12s ease-in-out infinite",
        willChange: "background-position",
      }}
    >
      <div style={{ borderRadius: innerRadius }}>{children}</div>
    </div>
  );
}
```

**Important:** Children MUST provide their own opaque background (`bg-white`, `bg-neutral-900`, etc.) or the rainbow gradient will bleed through. This is by design — allows both light and dark card interiors.

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Component compiles without errors.

- [ ] **Step 3: Commit**

```
git add components/ui/rainbow-border.tsx
git commit -m "feat: add RainbowBorder reusable component with animated gradient"
```

---

## Task 3: Problem Section — Swap to RainbowBorder

**Files:**
- Modify: `components/sections/problem-section.tsx`

- [ ] **Step 1: Replace GradientCard with RainbowBorder**

Replace the `GradientCard` component and its usage. Remove the `GradientCard` function entirely. Import `RainbowBorder` from `@/components/ui/rainbow-border`. Replace:

```tsx
<GradientCard>
  {/* card content */}
</GradientCard>
```

With:

```tsx
<RainbowBorder>
  <div className="rounded-2xl bg-white px-8 py-7 md:px-10">
    {/* card content — keep all inner content exactly as-is */}
  </div>
</RainbowBorder>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Problem section renders with animated rainbow border instead of static gradient.

- [ ] **Step 3: Commit**

```
git add components/sections/problem-section.tsx
git commit -m "feat: problem section uses RainbowBorder with animated gradient"
```

---

## Task 4: How It Works — RainbowBorder Grid

**Files:**
- Modify: `components/sections/how-it-works.tsx`

- [ ] **Step 1: Wrap grid in RainbowBorder**

Import `RainbowBorder`. Replace the current grid div:

```tsx
<div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 md:grid-cols-2 lg:grid-cols-4">
```

With:

```tsx
<RainbowBorder className="mt-16">
  <div className="grid overflow-hidden rounded-2xl bg-white md:grid-cols-2 lg:grid-cols-4">
```

And close the `</RainbowBorder>` after the grid's closing `</div>`.

Keep the existing `gap-px` + `bg-neutral-200` technique for dividers (it uses background-show-through and works correctly across all breakpoints). Update the grid bg:

```tsx
<RainbowBorder className="mt-16">
  <div className="grid gap-px overflow-hidden rounded-2xl bg-neutral-200 md:grid-cols-2 lg:grid-cols-4">
    {steps.map((key, i) => (
      <SectionReveal key={key} delay={i * 0.1}>
        <div className="flex h-full flex-col bg-white p-8">
          {/* Keep the existing step content inside this div exactly as-is:
              step number, title via t(), description via t(), etc.
              Only the outer wrapper (RainbowBorder + grid bg) changes. */}
        </div>
      </SectionReveal>
    ))}
  </div>
</RainbowBorder>
```

**Important:** Read the existing file first. The inner content of each step card (step number badge, title `{t(...)}`, description `{t(...)}`) must be preserved exactly. Only the outer grid wrapper and RainbowBorder are new.

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds. How It Works grid now wrapped in rainbow border.

- [ ] **Step 3: Commit**

```
git add components/sections/how-it-works.tsx
git commit -m "feat: how it works grid wrapped in RainbowBorder"
```

---

## Task 5: Industries Section — White BG + RainbowBorder Grid

**Files:**
- Modify: `components/sections/industries-section.tsx`

- [ ] **Step 1: Switch to white bg and add RainbowBorder**

Import `RainbowBorder`. Change the section background from `bg-dark-base` to `bg-white` (or `bg-neutral-50`). Update all text colors from white to dark:

- Section bg: `bg-white px-6 py-28 md:py-36`
- Overline: `className="text-primary-600/60"` (green on light)
- h2: `text-neutral-900` instead of `text-white`
- Lead: `text-neutral-500` instead of `text-white/50`

Wrap the grid in RainbowBorder. Replace the current grid:

```tsx
<div className="mt-16 grid gap-6 sm:grid-cols-2">
  {industries.map(...)}
</div>
```

With:

```tsx
<RainbowBorder className="mt-16">
  <div className="grid overflow-hidden rounded-2xl bg-white sm:grid-cols-2">
    {industries.map((key, i) => (
      <SectionReveal key={key} delay={i * 0.08}>
        <div className={`p-8 ${i < 2 ? "border-b border-neutral-200" : ""} ${i % 2 === 0 ? "border-r border-neutral-200" : ""}`}>
          <h3 className="font-serif text-xl font-medium text-neutral-900">{t(`${key}.title`)}</h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">{t(`${key}.description`)}</p>
          <p className="mt-4 text-sm font-medium text-primary-500">{t(`${key}.outcome`)}</p>
        </div>
      </SectionReveal>
    ))}
  </div>
</RainbowBorder>
```

Remove the `group` class and hover effects from the old dark cards (they'll be replaced by the rainbow border hover).

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Industries section is now white with rainbow-bordered 2x2 grid.

- [ ] **Step 3: Commit**

```
git add components/sections/industries-section.tsx
git commit -m "feat: industries section switched to white bg with RainbowBorder grid"
```

---

## Task 6: AI Agent — Card-as-Section on White BG

**Files:**
- Modify: `components/sections/ai-agent-section.tsx`

- [ ] **Step 1: Restructure to card-as-section pattern**

Change the outer section from dark bg to white. Wrap the content in a dark rounded card:

The restructuring wraps the existing content in three new layers. Read the current file first to understand the existing structure. The transformation is:

1. Change outer `<section>` bg from dark to `className="bg-white px-6 py-28 md:py-36"`
2. Add `<div className="mx-auto max-w-6xl">` container
3. Add `<div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-16 md:px-14 md:py-20">` dark card wrapper
4. Add the purple glow div (new element, before existing content)
5. Wrap the existing two-column grid in `<div className="relative z-10">` for z-ordering above glow

The purple glow element (add inside the dark card, before the grid):

```tsx
<div
  className="pointer-events-none absolute -right-1/4 -top-1/4 h-3/4 w-3/4 rounded-full opacity-[0.07] blur-[80px]"
  style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
  aria-hidden
/>
```

The existing left column content (SectionReveal, Overline, h2, p, Button) stays exactly as-is inside the grid. The right column content gets wrapped in RainbowBorder (see below).

Update the overline from `text-primary-400/60` to `text-accent-600/60`. Find the `<Overline>` (or overline `<span>`) element that currently uses a green/primary class on dark background, and change it:

Before: `className="text-primary-400/60"` (or similar green-on-dark class)
After: `className="text-accent-600/60"` (purple-on-dark)

Wrap the AI preview placeholder in `RainbowBorder`:

```tsx
<RainbowBorder borderRadius="16px" padding="3px">
  <div className="flex h-80 w-full items-center justify-center rounded-[13px] bg-neutral-900 md:h-96">
    <span className="text-sm text-white/30">AI Agent Preview</span>
  </div>
</RainbowBorder>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds. AI Agent is now a rounded dark card on white page bg with purple glow and rainbow-bordered preview.

- [ ] **Step 3: Commit**

```
git add components/sections/ai-agent-section.tsx
git commit -m "feat: AI agent section as dark card-as-section on white bg"
```

---

## Task 7: Proof Section — RainbowBorder Cards + Company Initials

**Files:**
- Modify: `components/sections/proof-section.tsx`

- [ ] **Step 1: Wrap each card in RainbowBorder, add styled initials**

Import `RainbowBorder`. Company logos are deferred per spec §9 Assets (brand permission required). Styled initials serve as placeholder. When logos are provided, replace the initial `<div>` with `<img src="/logos/{company}.png" alt={t(company)} className="h-10 w-10 rounded-xl object-contain" />`.

Replace each article with:

```tsx
<RainbowBorder borderRadius="18px" padding="3px">
  <article className="rounded-[15px] bg-white p-6 md:p-8">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 font-serif text-sm font-medium text-neutral-700">
        {t(company).charAt(0)}
      </div>
      <div>
        <p className="font-serif text-lg font-medium text-neutral-900">{t(company)}</p>
        <p className="text-xs uppercase tracking-wide text-neutral-400">{t(type)}</p>
      </div>
    </div>
    <div className="my-4 h-px bg-neutral-200" role="separator" />
    <p className="text-sm leading-relaxed text-neutral-600">{t(result)}</p>
  </article>
</RainbowBorder>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Each proof card has its own animated rainbow border with a styled company initial.

- [ ] **Step 3: Commit**

```
git add components/sections/proof-section.tsx
git commit -m "feat: proof section cards with individual RainbowBorders and company initials"
```

---

## Task 8: CTA Section — Rounded Card on White BG

**Files:**
- Modify: `components/sections/cta-section.tsx`

- [ ] **Step 1: Restructure to card on white bg**

Change the outer section to white bg. Move the gradient into a rounded inner card:

Read the current file first to understand the existing structure. The transformation is:

1. Change outer `<section>` from full-bleed gradient bg to `className="bg-white px-6 py-28 md:py-36"`
2. Move the gradient into a new inner card div: `<div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl">`
3. Apply the gradient as an inline style on this card div: `style={{ background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 20%, #a78bfa 40%, #7dd3fc 60%, #c4b5fd 80%, #e9d5ff 100%)" }}`
4. Keep all inner content (MeshGradient, halftone dots overlay, SectionReveal, Overline, h2, p, Button elements) exactly as they are
5. Ensure the content div has `className="relative z-10 mx-auto max-w-3xl px-8 py-20 text-center md:py-24"`

Only the outermost wrapper changes. All inner JSX stays identical.

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds. CTA is now a rounded gradient card sitting on white page bg.

- [ ] **Step 3: Commit**

```
git add components/sections/cta-section.tsx
git commit -m "feat: CTA section as rounded gradient card on white bg"
```

---

## Task 9: Footer — Clean White + Meta Badge

**Files:**
- Modify: `components/layout/footer.tsx`

- [ ] **Step 1: Copy Meta badge to public**

Verify the source asset exists first:
Run: `ls docs/some_assets/mvtp.png`
Expected: File listed. If not found, the asset must be obtained before this task can proceed.

Run: `cp "docs/some_assets/mvtp.png" "public/mvtp.png"`

- [ ] **Step 2: Rewrite footer to white bg**

Remove the purple gradient background and halftone dots. Replace with clean white:

```tsx
// At the top of the component function:
const year = new Date().getFullYear();

// JSX return:
<footer className="border-t border-neutral-200 bg-white px-6 py-16">
  <div className="mx-auto max-w-6xl">
    <div className="flex flex-col gap-10 md:flex-row md:justify-between">
      {/* Logo + tagline */}
      <div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-[7px] bg-primary-500" />
          <span className="font-sans text-sm font-bold text-neutral-900">ConvertChat</span>
        </div>
        <p className="mt-3 max-w-xs text-sm text-neutral-500">{t("tagline")}</p>
      </div>

      {/* Links — preserve existing link elements from current footer,
         but change text color to text-neutral-500 and hover to hover:text-neutral-900 */}
      <div className="flex flex-wrap items-start gap-6 text-sm text-neutral-500">
        <a href="#" className="transition-colors hover:text-neutral-900">{t("privacy")}</a>
        <a href="#" className="transition-colors hover:text-neutral-900">{t("terms")}</a>
      </div>
    </div>

    {/* Meta badge + bottom row */}
    <div className="mt-12 flex flex-col gap-6 border-t border-neutral-200 pt-8 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <img src="/mvtp.png" alt={t("meta_partner")} className="h-12 w-auto" loading="lazy" />
      </div>
      <div className="flex flex-col gap-1 text-xs text-neutral-400 md:flex-row md:gap-4 md:text-right">
        <p>&copy; {year} ConvertChat. {t("rights")}</p>
        <p>{t("company")}</p>
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Add i18n key for meta_partner**

Add to `messages/en.json` under `footer`:
```json
"meta_partner": "Official Meta Tech Partner"
```

Add to `messages/es.json` under `footer`:
```json
"meta_partner": "Meta Tech Partner Oficial"
```

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Footer is clean white with Meta badge.

- [ ] **Step 5: Commit**

```
git add public/mvtp.png components/layout/footer.tsx messages/en.json messages/es.json
git commit -m "feat: clean white footer with Meta Tech Partner badge"
```

---

## Task 10: FAQ Section — New Component + i18n

**Files:**
- Create: `components/sections/faq-section.tsx`
- Modify: `messages/en.json`
- Modify: `messages/es.json`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Add FAQ strings to en.json**

Add a new `faq` key at the root level of `messages/en.json`:

```json
"faq": {
  "label": "FAQ",
  "title": "Questions you might have",
  "q1": "Will my WhatsApp number get banned?",
  "a1": "No. ConvertChat uses Meta's official WhatsApp Business API — the same infrastructure used by brands like Unilever and Tata. We enforce a two-stage opt-in flow (click = pending, message = confirmed) so every contact in your list has explicitly consented. No spam, no bans.",
  "q2": "Do I need a WhatsApp Business API account?",
  "a2": "Not yet. If you don't have one, we'll set it up for you. We handle the Meta Business verification, phone number registration, and API connection as part of our onboarding — one-time setup fee. See our pricing page for details.",
  "q3": "How does the email-to-WhatsApp opt-in actually work?",
  "a3": "You send a product email through ConvertChat. Each email includes a green \"Message us on WhatsApp\" button. When a contact clicks it, they're redirected to your WhatsApp with a pre-filled message. The moment they send that message, they're automatically tagged as opted-in. You now own that WhatsApp contact — legally and permanently.",
  "q4": "What happens when a contact replies on WhatsApp?",
  "a4": "Two options. You can handle conversations manually through our built-in WhatsApp inbox — real-time chat with media support and read receipts. Or, if you have our AI Agent enabled (Beta), it handles the conversation automatically: answers product questions, qualifies the lead, and routes hot buyers to you.",
  "q5": "Is this GDPR compliant?",
  "a5": "Yes. Our two-stage consent flow is designed for GDPR compliance. A click registers interest (pending). An actual WhatsApp message from the contact confirms consent (opted-in). We track and store consent status per contact with full audit trail. No unsolicited messages ever go out.",
  "q6": "How many contacts can I import?",
  "a6": "No hard limit. Upload CSV or Excel files with thousands of contacts. We auto-detect channels (email, mobile, landline), filter invalid entries, remove duplicates, and split into optimized send batches. Most customers start with 1,000-10,000 contacts."
}
```

- [ ] **Step 2: Add FAQ strings to es.json**

Add the equivalent `faq` key to `messages/es.json`:

```json
"faq": {
  "label": "Preguntas frecuentes",
  "title": "Preguntas que podrías tener",
  "q1": "¿Se va a banear mi número de WhatsApp?",
  "a1": "No. ConvertChat usa la API oficial de WhatsApp Business de Meta — la misma infraestructura que usan marcas como Unilever y Tata. Aplicamos un flujo de opt-in en dos etapas (clic = pendiente, mensaje = confirmado) para que cada contacto en tu lista haya dado su consentimiento explícito. Sin spam, sin baneos.",
  "q2": "¿Necesito una cuenta de WhatsApp Business API?",
  "a2": "Todavía no. Si no tienes una, te la configuramos. Nos encargamos de la verificación de Meta Business, el registro del número de teléfono y la conexión a la API como parte de nuestro onboarding — tarifa única de configuración. Consulta nuestra página de precios para más detalles.",
  "q3": "¿Cómo funciona exactamente el opt-in de email a WhatsApp?",
  "a3": "Envías un email de producto a través de ConvertChat. Cada email incluye un botón verde \"Escríbenos por WhatsApp\". Cuando un contacto hace clic, es redirigido a tu WhatsApp con un mensaje prellenado. En el momento en que envía ese mensaje, se etiqueta automáticamente como opt-in. Ahora ese contacto de WhatsApp es tuyo — legal y permanentemente.",
  "q4": "¿Qué pasa cuando un contacto responde por WhatsApp?",
  "a4": "Dos opciones. Puedes manejar las conversaciones manualmente a través de nuestro buzón de WhatsApp integrado — chat en tiempo real con soporte multimedia y confirmaciones de lectura. O, si tienes nuestro Agente IA activado (Beta), maneja la conversación automáticamente: responde preguntas sobre productos, cualifica el lead y te redirige los compradores calientes.",
  "q5": "¿Es esto compatible con el GDPR?",
  "a5": "Sí. Nuestro flujo de consentimiento en dos etapas está diseñado para cumplir con el GDPR. Un clic registra interés (pendiente). Un mensaje real de WhatsApp del contacto confirma el consentimiento (opt-in). Rastreamos y almacenamos el estado de consentimiento por contacto con un registro de auditoría completo. Nunca se envían mensajes no solicitados.",
  "q6": "¿Cuántos contactos puedo importar?",
  "a6": "Sin límite fijo. Sube archivos CSV o Excel con miles de contactos. Detectamos automáticamente los canales (email, móvil, fijo), filtramos entradas inválidas, eliminamos duplicados y dividimos en lotes de envío optimizados. La mayoría de clientes empiezan con 1.000-10.000 contactos."
}
```

- [ ] **Step 3: Create the FAQ section component**

Create `components/sections/faq-section.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Overline } from "@/components/ui/overline";

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FaqItem({ questionKey, answerKey }: { questionKey: string; answerKey: string }) {
  const t = useTranslations("faq");
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const panelId = `faq-panel-${questionKey}`;

  return (
    <div className="border-b border-white/[0.08]">
      <button
        id={`faq-btn-${questionKey}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-6 text-left"
        style={{ minHeight: "48px" }}
      >
        <span className="font-serif text-lg font-medium text-white md:text-xl">{t(questionKey)}</span>
        <ChevronIcon open={open} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={`faq-btn-${questionKey}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-base leading-relaxed text-white/50">{t(answerKey)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  const t = useTranslations("faq");

  return (
    <section className="bg-neutral-900 px-6 py-28 md:py-36">
      <div className="mx-auto max-w-3xl">
        <SectionReveal>
          <Overline className="text-accent-600/60">{t("label")}</Overline>
          <h2 className="mt-4 font-serif text-3xl font-normal tracking-[-0.02em] text-white md:text-[44px] md:leading-[1.1]">
            {t("title")}
          </h2>
        </SectionReveal>

        <div className="mt-12">
          {FAQ_KEYS.map((key) => (
            <FaqItem key={key} questionKey={key} answerKey={`a${key.slice(1)}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Note:** Spec §10 mentions `nav.faq` as a conditional i18n key ("if adding FAQ to nav links"). FAQ is not being added to nav links in this pass — it's accessible by scrolling. The `nav.faq` key is intentionally omitted.

- [ ] **Step 4: Add FaqSection to homepage**

In `app/[locale]/page.tsx`, add the import and place it between ProofSection and CtaSection:

```tsx
import { FaqSection } from "@/components/sections/faq-section";

// In the JSX, after <ProofSection />:
<FaqSection />
<CtaSection />
```

- [ ] **Step 5: Build and verify**

Run: `npm run build`
Expected: Build succeeds. FAQ section renders on the homepage with dark bg and accordion.

- [ ] **Step 6: Commit**

```
git add components/sections/faq-section.tsx messages/en.json messages/es.json app/\[locale\]/page.tsx
git commit -m "feat: add FAQ section with accordion, dark bg, EN/ES translations"
```

---

## Task 11: Navbar Redesign — Full Width + Scroll States

**Files:**
- Modify: `components/layout/navbar.tsx`

- [ ] **Step 1: Rewrite navbar with scroll-driven states**

**Pre-check:** Before starting, read `components/ui/button.tsx` and confirm that `variant="glass"` exists. If it doesn't, add a `glass` variant (semi-transparent white bg, white text, for use on dark/transparent backgrounds) or fall back to `variant="ghost"` with custom className for the unscrolled state.

Replace the entire `Navbar` component. Key changes:
- Full-width bar with `rounded-2xl` (not pill)
- Check `scrollY` on mount AND on scroll
- Logo text collapses via `max-width` + `opacity` transition
- Colors transition from transparent/white-text to frosted/dark-text

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const WHATSAPP_URL = "#request-access";

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 20);
    check(); // Check on mount for restored scroll position
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  const navLinks = [
    { href: "#problem", label: t("problem") },
    { href: "#how-it-works", label: t("howItWorks") },
    { href: "/precios" as const, label: t("pricing") },
    { href: "/blog" as const, label: t("blog") },
  ];

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl">
      <div
        className={`flex items-center gap-1 rounded-2xl px-7 py-2.5 pr-2.5 backdrop-blur-[20px] transition-all duration-300 ${
          scrolled
            ? "border border-neutral-200/80 bg-white/85 shadow-sm"
            : "border border-white/[0.10] bg-white/[0.06]"
        }`}
      >
        <Link href="/" className="mr-6 flex items-center gap-2">
          <div className="h-6 w-6 shrink-0 rounded-[7px] bg-primary-500" />
          <span
            className={`overflow-hidden whitespace-nowrap text-sm font-bold font-sans transition-all duration-300 ${
              scrolled ? "max-w-0 opacity-0" : "max-w-[120px] opacity-100"
            }`}
            style={{ color: scrolled ? "var(--neutral-900)" : "white" }}
          >
            ConvertChat
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm font-sans transition-colors ${
                  scrolled ? "text-neutral-500 hover:text-neutral-900" : "text-white/55 hover:text-white/80"
                }`}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href as "/precios" | "/blog"}
                className={`px-3 py-1.5 text-sm font-sans transition-colors ${
                  scrolled ? "text-neutral-500 hover:text-neutral-900" : "text-white/55 hover:text-white/80"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={scrolled ? "ghost" : "glass"}
            size="sm"
            href="https://app.convertchat.co"
          >
            {t("login")}
          </Button>
          <Button variant="primary" size="sm" href={WHATSAPP_URL}>
            {t("cta")}
          </Button>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Navbar is full-width rounded-2xl with scroll-driven state transitions.

- [ ] **Step 3: Commit**

```
git add components/layout/navbar.tsx
git commit -m "feat: navbar redesign with full-width translucent bar and scroll-driven logo collapse"
```

---

## Task 12: Hero — Meta Partner Badge

**Files:**
- Modify: `components/hero/hero-section.tsx`
- Modify: `messages/en.json`
- Modify: `messages/es.json`

- [ ] **Step 1: Add i18n keys**

Add to `hero` in `messages/en.json`:
```json
"meta_partner": "Official Meta Tech Partner"
```

Add to `hero` in `messages/es.json`:
```json
"meta_partner": "Meta Tech Partner Oficial"
```

- [ ] **Step 2: Add badge below note line in hero**

After the note `<motion.p>` in hero-section.tsx, add:

```tsx
<motion.div
  className="mt-4 flex items-center gap-2"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.95 }}
>
  <img src="/mvtp.png" alt={t("meta_partner")} className="h-8 w-auto opacity-60" />
</motion.div>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Meta partner badge appears in hero.

- [ ] **Step 4: Commit**

```
git add components/hero/hero-section.tsx messages/en.json messages/es.json
git commit -m "feat: add Meta Tech Partner badge to hero section"
```

---

## Task 13: Minor Section Updates — Neutral Colors

**Files:**
- Modify: `components/sections/before-after-section.tsx`
- Modify: `components/sections/messaging-stat-section.tsx`

- [ ] **Step 1: Before/After — update neutral classes**

The neutral tokens have already been updated in globals.css (Task 1), so the Tailwind classes (`bg-neutral-100`, `text-neutral-500`, etc.) will automatically pick up the new true-neutral values. No class name changes needed here — the token update propagates automatically.

Verify visually: the "Before" card background (`bg-neutral-100`) should now be a true gray `#f2f2f5` instead of green-tinted `#f1f5f2`.

- [ ] **Step 2: Messaging Stats — same approach**

Same as above — token update propagates via Tailwind. No code changes needed. Verify visually.

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: Build succeeds. All sections use true-neutral colors.

- [ ] **Step 4: Commit** (skip if no code changes needed — tokens already committed in Task 1)

---

## Task 14: Platform Section — Hover Effects

**Files:**
- Modify: `components/sections/platform-section.tsx`

- [ ] **Step 1: Upgrade hover effects on feature cards**

Update the article element in the card render:

```tsx
<article className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-200 will-change-transform hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md">
```

This adds: `hover:-translate-y-1` (lift), `hover:shadow-md` (shadow increase), `hover:border-neutral-300` (border darkens).

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Feature cards lift and shadow on hover.

- [ ] **Step 3: Commit**

```
git add components/sections/platform-section.tsx
git commit -m "feat: platform feature cards with hover lift and shadow"
```

---

## Task 15: Dead Code Cleanup

**Files:**
- Delete: `components/sections/feature-cards.tsx`
- Delete: `components/sections/buying-section.tsx`

- [ ] **Step 1: Verify files are not imported anywhere**

Run: `grep -r "feature-cards\|buying-section" --include="*.tsx" --include="*.ts" app/ components/`

Expected: No results (neither file is imported).

- [ ] **Step 2: Delete unused files and commit**

```bash
git rm components/sections/feature-cards.tsx components/sections/buying-section.tsx
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: Build succeeds. No missing import errors.

- [ ] **Step 4: Commit**

```
git commit -m "chore: remove unused feature-cards and buying-section components"
```

---

## Task 16: Hero Phones — 3D Floating Component (P1)

**Files:**
- Create: `components/hero/hero-phones.tsx`
- Modify: `components/hero/hero-section.tsx`

- [ ] **Step 1: Use 21st.dev Magic MCP to generate component**

Use the `mcp__magic__21st_magic_component_builder` tool to generate a floating phones component with:
- 2-3 phone mockups at slight angles using CSS 3D transforms
- WhatsApp-style green notification badges with pulse animation
- Subtle green pulse rings emanating from center
- `prefers-reduced-motion` support

Save the output to `components/hero/hero-phones.tsx`.

The component must support `prefers-reduced-motion` — when the user prefers reduced motion, show a static phone image/mockup instead of animations.

If Magic MCP output is unsatisfactory, build a simple CSS-only fallback:
- Single phone mockup with CSS border/shadows
- Green notification badge with CSS pulse keyframe
- No 3D transforms

- [ ] **Step 2: Import in hero section with lazy loading**

In `hero-section.tsx`, lazy-load the component to avoid blocking initial render (spec §8 Performance Rules):

```tsx
import dynamic from "next/dynamic";

const HeroPhones = dynamic(() => import("@/components/hero/hero-phones").then(m => ({ default: m.HeroPhones })), {
  ssr: false,
  loading: () => <div className="h-96 w-full" />,
});
```

Place it in the right column:

```tsx
{/* Right column — 3D phones */}
<div className="hidden lg:block">
  <HeroPhones />
</div>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Hero right column shows animated phone mockups.

- [ ] **Step 4: Commit**

```
git add components/hero/hero-phones.tsx components/hero/hero-section.tsx
git commit -m "feat: add floating 3D phone mockups to hero section"
```

---

## Task 17: 3D Icons for Cards (P1)

**Files:**
- Modify: `components/sections/how-it-works.tsx`
- Modify: `components/sections/industries-section.tsx`
- Modify: `components/sections/platform-section.tsx`

- [ ] **Step 1: Use 21st.dev Magic MCP to generate icon components**

Use `mcp__magic__21st_magic_component_builder` to generate 3D-style illustrated icons for each section. Request consistent style across all icons.

If Magic MCP output is inconsistent, use Lucide icons with styled containers as fallback. Example fallback pattern for a How It Works step:

```tsx
import { Upload, Send, BarChart3, MessageCircle } from "lucide-react";

const STEP_ICONS = [Upload, Send, BarChart3, MessageCircle];

// Inside the step render, before the step number:
const Icon = STEP_ICONS[i];
<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10">
  <Icon className="h-6 w-6 text-primary-500" />
</div>
```

- [ ] **Step 2: Integrate icons into How It Works steps**

Add icon component/element before each step's number.

- [ ] **Step 3: Integrate icons into Industries cards**

Add icon component/element before each industry card's title.

- [ ] **Step 4: Integrate icons into Platform feature cards**

Replace the numbered `FeatureIcon` with the 3D icon components.

- [ ] **Step 5: Build and verify**

Run: `npm run build`
Expected: Build succeeds. All card sections show consistent 3D-style icons.

- [ ] **Step 6: Commit**

```
git add components/sections/how-it-works.tsx components/sections/industries-section.tsx components/sections/platform-section.tsx
git commit -m "feat: add 3D illustrated icons to How It Works, Industries, and Platform sections"
```

---

## Task 18: DESIGN_SYSTEM.md Update (P2)

**Files:**
- Modify: `DESIGN_SYSTEM.md`

- [ ] **Step 1: Update button radius**

Change the Buttons section from "Pill-shaped (border-radius: 9999px)" to:

```
Rounded (border-radius: 12px / rounded-xl). Satoshi font for all buttons.
Note: Pill shape was rejected as "AI-looking". Nav bar container remains pill-shaped; buttons use softer rounded-xl.
```

- [ ] **Step 2: Add purple accent tokens, rainbow gradient, navbar spec, and true neutral note**

Add new sections documenting the accent palette, rainbow gradient border component, updated neutral palette rationale, and navbar scroll states.

- [ ] **Step 3: Commit**

```
git add DESIGN_SYSTEM.md
git commit -m "docs: update DESIGN_SYSTEM.md with new tokens, rainbow borders, navbar spec"
```

---

## Task 19: Final Build + Typecheck

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: Build succeeds with zero errors.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: No TypeScript errors.

- [ ] **Step 3: Visual review**

Run: `npm run dev`
Manually scroll through all sections and verify:
- Rainbow borders animate on Problem, How It Works, Industries, Proof cards
- AI Agent is a dark card on white bg with rainbow-bordered preview
- FAQ accordion opens/closes smoothly on dark bg
- CTA is a rounded gradient card on white
- Footer is clean white with Meta badge
- Navbar transitions from transparent to frosted on scroll
- Logo text collapses on scroll
- All text is readable (proper contrast on light and dark backgrounds)

---

## Deferred Items (Address During Implementation)

These spec items are intentionally deferred from explicit plan steps — they should be applied as natural parts of the implementation:

- **`will-change` hints:** Already applied to RainbowBorder (`willChange: "background-position"`) and platform cards (`will-change-transform`). If other animated elements show jank during testing, add `will-change` there too.
- **Lazy loading for images:** Use `loading="lazy"` on the Meta badge `<img>` in footer since it's below the fold. The hero badge is above the fold so `loading="lazy"` is unnecessary there.
- **AI Agent preview icon:** Spec §7 lists "AI brain/robot for preview area" as P1. Task 6 uses a text placeholder. When 3D icons are generated in Task 17, also generate one for the AI Agent preview and replace the text placeholder in the RainbowBorder div.
- **`section-transition.tsx`:** The spec mentions this as a potential component. Not needed — section spacing is handled via standard padding. Only create if visual gaps emerge during review.
