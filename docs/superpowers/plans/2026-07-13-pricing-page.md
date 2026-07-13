# Pricing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "coming soon" placeholder at `/precios` (`/pricing`) with a full pricing page: 3 tiers (rainbow-highlighted Growth card), Enterprise banner, AI add-on strip, costs explainer, FAQ, CTA.

**Architecture:** Server-component page (like `producto`) assembling 4 new section components plus the existing `CtaSection`. All copy lives in `messages/en.json` / `messages/es.json` under a rebuilt `pricing` namespace (USD on en, EUR on es). Only the FAQ needs a client component (accordion state); everything else is RSC + the existing `SectionReveal` client wrapper.

**Tech Stack:** Next.js 16 App Router, next-intl, Tailwind v4, Framer Motion (via existing `SectionReveal`), lucide-react (`Check` icon).

**Spec:** `docs/superpowers/specs/2026-07-13-pricing-page-design.md` — read it if anything here is ambiguous. The spec wins on content questions.

**Repo conventions that override defaults:**
- This repo has NO test framework. Verification = `npm run typecheck` + Playwright MCP browser checks + prettier with explicit flags (no `.prettierrc` exists): `npx prettier --check --print-width 120 --semi --trailing-comma all <files>`
- Work directly on `main` (established project pattern). Commit per task; the user ships with `/ship` at the end — NEVER push.
- Buttons are `rounded-xl`, never pill. Headings: Newsreader serif (`font-serif`). Body: Satoshi (`font-sans`, default). No uppercase overline labels.
- Dev server runs on port **3002** (`npm run dev` — 3000/3001 are other projects).

**Design tokens you'll reuse (already exist):**
- `var(--rainbow-gradient)` + `@keyframes rainbow-shift` — `app/globals.css:30,142`
- `SectionReveal` — `components/ui/section-reveal.tsx`
- `Button` — `components/ui/button.tsx` (variants: primary/secondary/ghost/glass)
- Dark-card pattern — see `components/sections/faq-section.tsx:73`
- `primary-500` = green #22c55e

---

### Task 1: i18n copy (en + es)

**Files:**
- Modify: `messages/en.json` (replace the existing `"pricing"` block, currently keys `title/comingSoon/cta/ctaSub` at ~line 221)
- Modify: `messages/es.json` (replace the equivalent `"pricing"` block)

The old 4 keys are deleted — nothing else references them (only `app/[locale]/precios/page.tsx`, which Task 5 rewrites).

- [ ] **Step 1: Replace the `pricing` block in `messages/en.json`** with:

```json
"pricing": {
  "metaTitle": "Pricing | ConvertChat",
  "pill": "Early access pricing",
  "title": "Simple pricing. No contracts.",
  "subtitle": "No seat minimums. Cancel anytime. 0% markup on WhatsApp messages.",
  "popular": "Most popular",
  "cta": "Get set up with us",
  "tiers": {
    "starter": {
      "name": "Starter",
      "persona": "For solo operators",
      "price": "$49",
      "period": "/mo",
      "allowances": { "a1": "1,000 contacts", "a2": "500 WhatsApp campaign messages/mo", "a3": "3,000 emails/mo" },
      "features": { "f1": "1 WhatsApp number", "f2": "Shared inbox", "f3": "Campaign stats", "f4": "Email support" }
    },
    "growth": {
      "name": "Growth",
      "persona": "For growing businesses",
      "price": "$99",
      "period": "/mo",
      "allowances": { "a1": "5,000 contacts", "a2": "2,000 WhatsApp campaign messages/mo", "a3": "10,000 emails/mo" },
      "features": { "f1": "1 WhatsApp number", "f2": "Shared inbox", "f3": "Full funnel analytics", "f4": "Priority support", "f5": "AI Agent available (+$49/mo)" }
    },
    "pro": {
      "name": "Pro",
      "persona": "For serious senders",
      "price": "$199",
      "period": "/mo",
      "allowances": { "a1": "25,000 contacts", "a2": "10,000 WhatsApp campaign messages/mo", "a3": "50,000 emails/mo" },
      "features": { "f1": "1 WhatsApp number (more on request)", "f2": "Shared inbox", "f3": "Full funnel analytics", "f4": "Dedicated onboarding", "f5": "AI Agent available (+$49/mo)" }
    }
  },
  "enterprise": {
    "title": "Need more?",
    "body": "Higher volumes, multiple numbers, tailored onboarding — we'll build you a custom plan on the call.",
    "cta": "Talk to us"
  },
  "aiAddon": {
    "title": "Add the AI Agent when you're ready.",
    "body": "It replies, qualifies and sells while you sleep.",
    "price": "+$49",
    "period": "/mo",
    "note": "Available on Growth and Pro."
  },
  "costs": {
    "title": "What messaging actually costs.",
    "c1Title": "WhatsApp fees go straight to Meta",
    "c1Body": "You pay Meta at cost for every message. We add 0% markup — ever.",
    "c2Title": "About $0.06 per marketing message",
    "c2Body": "That's the typical Meta rate in most markets. Replies within the 24-hour window are free.",
    "c3Title": "Email sending is included",
    "c3Body": "Your plan covers your monthly email volume. No extra bills."
  },
  "faq": {
    "title": "Frequently asked questions",
    "q1": "What happens on the call?",
    "a1": "In 30 minutes we connect your WhatsApp, import your contacts and set up your first campaign together.",
    "q2": "Are there contracts or minimums?",
    "a2": "No. Monthly billing, cancel anytime, no seat minimums.",
    "q3": "What do WhatsApp messages cost?",
    "a3": "Meta bills you directly at cost — a marketing message costs roughly $0.06 in most markets. Replies within the 24-hour window are free. We add 0% markup.",
    "q4": "Can I change plans later?",
    "a4": "Yes — switch up or down anytime; changes apply at your next billing cycle.",
    "q5": "Do I need a new phone number?",
    "a5": "Your existing number or a new one both work; we set it up together on the call."
  }
}
```

- [ ] **Step 2: Replace the `pricing` block in `messages/es.json`** with (Spanish is the primary market — this copy gets flagged for user review at the end):

```json
"pricing": {
  "metaTitle": "Precios | ConvertChat",
  "pill": "Precios de acceso anticipado",
  "title": "Precios simples. Sin permanencia.",
  "subtitle": "Sin mínimos de usuarios. Cancela cuando quieras. 0% de comisión en mensajes de WhatsApp.",
  "popular": "El más elegido",
  "cta": "Empieza con nosotros",
  "tiers": {
    "starter": {
      "name": "Starter",
      "persona": "Para quien trabaja solo",
      "price": "€49",
      "period": "/mes",
      "allowances": { "a1": "1.000 contactos", "a2": "500 mensajes de campaña de WhatsApp al mes", "a3": "3.000 emails al mes" },
      "features": { "f1": "1 número de WhatsApp", "f2": "Bandeja de entrada compartida", "f3": "Estadísticas de campañas", "f4": "Soporte por email" }
    },
    "growth": {
      "name": "Growth",
      "persona": "Para negocios en crecimiento",
      "price": "€99",
      "period": "/mes",
      "allowances": { "a1": "5.000 contactos", "a2": "2.000 mensajes de campaña de WhatsApp al mes", "a3": "10.000 emails al mes" },
      "features": { "f1": "1 número de WhatsApp", "f2": "Bandeja de entrada compartida", "f3": "Analítica de embudo completa", "f4": "Soporte prioritario", "f5": "Agente IA disponible (+€49/mes)" }
    },
    "pro": {
      "name": "Pro",
      "persona": "Para grandes volúmenes",
      "price": "€199",
      "period": "/mes",
      "allowances": { "a1": "25.000 contactos", "a2": "10.000 mensajes de campaña de WhatsApp al mes", "a3": "50.000 emails al mes" },
      "features": { "f1": "1 número de WhatsApp (más bajo petición)", "f2": "Bandeja de entrada compartida", "f3": "Analítica de embudo completa", "f4": "Onboarding dedicado", "f5": "Agente IA disponible (+€49/mes)" }
    }
  },
  "enterprise": {
    "title": "¿Necesitas más?",
    "body": "Más volumen, varios números, onboarding a medida — montamos un plan personalizado en la llamada.",
    "cta": "Habla con nosotros"
  },
  "aiAddon": {
    "title": "Añade el Agente IA cuando estés listo.",
    "body": "Responde, cualifica y vende mientras duermes.",
    "price": "+€49",
    "period": "/mes",
    "note": "Disponible en Growth y Pro."
  },
  "costs": {
    "title": "Lo que cuesta enviar mensajes.",
    "c1Title": "Las tarifas de WhatsApp van directas a Meta",
    "c1Body": "Pagas a Meta a precio de coste por cada mensaje. Nosotros añadimos un 0% de comisión — siempre.",
    "c2Title": "Unos 0,05 € por mensaje de marketing",
    "c2Body": "Es la tarifa habitual de Meta en España. Las respuestas dentro de la ventana de 24 horas son gratis.",
    "c3Title": "El envío de emails está incluido",
    "c3Body": "Tu plan cubre tu volumen mensual de emails. Sin facturas extra."
  },
  "faq": {
    "title": "Preguntas frecuentes",
    "q1": "¿Qué pasa en la llamada?",
    "a1": "En 30 minutos conectamos tu WhatsApp, importamos tus contactos y dejamos lista tu primera campaña.",
    "q2": "¿Hay permanencia o mínimos?",
    "a2": "No. Pago mensual, cancela cuando quieras y sin mínimos de usuarios.",
    "q3": "¿Cuánto cuestan los mensajes de WhatsApp?",
    "a3": "Meta te factura directamente a precio de coste — en España un mensaje de marketing cuesta alrededor de 0,05 €. Las respuestas dentro de la ventana de 24 horas son gratis. Nosotros añadimos un 0% de comisión.",
    "q4": "¿Puedo cambiar de plan más adelante?",
    "a4": "Sí — puedes subir o bajar de plan en cualquier momento; el cambio se aplica en el siguiente ciclo de facturación.",
    "q5": "¿Necesito un número de teléfono nuevo?",
    "a5": "Funciona con tu número actual o con uno nuevo; lo configuramos juntos en la llamada."
  }
}
```

- [ ] **Step 3: Verify both files are valid JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); JSON.parse(require('fs').readFileSync('messages/es.json','utf8')); console.log('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/es.json
git commit -m "feat: pricing page i18n copy (en/es)"
```

---

### Task 2: Tiers section (hero + cards + Enterprise banner)

**Files:**
- Create: `components/sections/pricing-tiers.tsx`

Server component (next-intl's `useTranslations` works in RSC; `SectionReveal` is the only client boundary). One `bg-neutral-50` section holds hero, cards, and banner — no mid-page background seams.

- [ ] **Step 1: Create `components/sections/pricing-tiers.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/ui/section-reveal";

const BOOKING_URL = "https://cal.com/architct/onboarding";

const TIERS = [
  { key: "starter", featureCount: 4, highlight: false },
  { key: "growth", featureCount: 5, highlight: true },
  { key: "pro", featureCount: 5, highlight: false },
] as const;

function TierCard({ tierKey, featureCount, highlight }: { tierKey: string; featureCount: number; highlight: boolean }) {
  const t = useTranslations(`pricing.tiers.${tierKey}`);
  const tp = useTranslations("pricing");

  return (
    <div
      className={`relative flex flex-col rounded-3xl p-8 ${
        highlight ? "rainbow-border-animated order-first md:order-none md:-translate-y-2" : "border border-neutral-200 bg-white"
      }`}
      style={
        highlight
          ? {
              background: "var(--rainbow-gradient)",
              backgroundSize: "200% 200%",
              animation: "rainbow-shift 12s ease-in-out infinite",
              boxShadow: "0 24px 48px -16px rgba(124, 58, 237, 0.35)",
            }
          : undefined
      }
    >
      {/* Dark tint so white text stays legible over the yellow/green stops of the gradient */}
      {highlight && <div className="absolute inset-0 rounded-3xl bg-neutral-900/25" aria-hidden />}

      {highlight && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-neutral-900 px-4 py-1 text-xs font-semibold text-white">
          {tp("popular")}
        </span>
      )}

      <div className="relative z-10 flex flex-1 flex-col">
        <h3 className={`text-lg font-semibold ${highlight ? "text-white" : "text-neutral-900"}`}>{t("name")}</h3>
        <p className={`mt-1 text-sm ${highlight ? "text-white/75" : "text-neutral-400"}`}>{t("persona")}</p>

        <div className="mt-6">
          <span className={`font-serif text-5xl tracking-[-0.03em] ${highlight ? "text-white" : "text-neutral-900"}`}>
            {t("price")}
          </span>
          <span className={`ml-1 text-sm ${highlight ? "text-white/75" : "text-neutral-400"}`}>{t("period")}</span>
        </div>

        <ul
          className={`mt-6 space-y-2 border-t pt-6 text-sm ${
            highlight ? "border-white/25 text-white/90" : "border-neutral-100 text-neutral-600"
          }`}
        >
          {[1, 2, 3].map((i) => (
            <li key={i}>{t(`allowances.a${i}`)}</li>
          ))}
        </ul>

        <ul className={`mt-6 space-y-2.5 text-sm ${highlight ? "text-white/85" : "text-neutral-500"}`}>
          {Array.from({ length: featureCount }, (_, i) => i + 1).map((i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check
                className={`mt-0.5 h-4 w-4 shrink-0 ${highlight ? "text-white" : "text-primary-500"}`}
                strokeWidth={2.5}
              />
              {t(`features.f${i}`)}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          {highlight ? (
            // Plain anchor instead of Button: the white-on-rainbow CTA would need to fight Button's variant styles
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-xl bg-white px-7 py-3.5 font-sans text-[15px] font-semibold text-neutral-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-100"
            >
              {tp("cta")}
            </a>
          ) : (
            <Button variant="ghost" size="md" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="w-full">
              {tp("cta")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function PricingTiers() {
  const t = useTranslations("pricing");

  return (
    <section className="bg-neutral-50 px-6 pb-16 pt-36 md:pb-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-500">
              {t("pill")}
            </span>
            <h1 className="mt-6 font-serif text-[42px] font-semibold leading-[1.1] tracking-[-0.03em] text-neutral-900 md:text-6xl">
              {t("title")}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 md:text-lg">{t("subtitle")}</p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-14 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-3">
            {TIERS.map((tier) => (
              <TierCard key={tier.key} tierKey={tier.key} featureCount={tier.featureCount} highlight={tier.highlight} />
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white px-8 py-6 text-center md:flex-row md:text-left">
            <p className="text-base text-neutral-600">
              <span className="font-semibold text-neutral-900">{t("enterprise.title")}</span> {t("enterprise.body")}
            </p>
            <Button variant="secondary" size="sm" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              {t("enterprise.cta")}
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
```

Notes for the implementer:
- `pt-36` clears the fixed navbar (navbar renders solid automatically on non-home pages).
- `order-first md:order-none` puts Growth first when the grid stacks on mobile (spec requirement).
- The tint overlay div is REQUIRED — without it, white text fails contrast on the gradient's yellow stop.
- The `rainbow-border-animated` class on the highlight card is REQUIRED — `app/globals.css:151` uses it to kill the animation under `prefers-reduced-motion` (`animation: none !important` overrides the inline style).

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: clean (component isn't imported anywhere yet — that's fine).

- [ ] **Step 3: Commit**

```bash
git add components/sections/pricing-tiers.tsx
git commit -m "feat: pricing tiers section with rainbow Growth card + enterprise banner"
```

---

### Task 3: AI add-on strip + costs explainer

**Files:**
- Create: `components/sections/pricing-ai-addon.tsx`
- Create: `components/sections/pricing-costs.tsx`

- [ ] **Step 1: Create `components/sections/pricing-ai-addon.tsx`** (dark card on white, mirrors the FAQ-section card style; informational — NO CTA):

```tsx
import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";

export function PricingAiAddon() {
  const t = useTranslations("pricing.aiAddon");

  return (
    <section className="bg-white px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-12 md:px-14 md:py-16">
            <div
              className="pointer-events-none absolute -right-1/4 -top-1/2 h-full w-3/4 rounded-full opacity-[0.07] blur-[80px]"
              style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
              aria-hidden
            />
            <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-xl">
                <h2 className="font-serif text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-[36px]">
                  {t("title")}
                </h2>
                <p className="mt-3 text-base text-white/50">{t("body")}</p>
              </div>
              <div className="shrink-0 md:text-right">
                <div className="font-serif text-4xl tracking-[-0.03em] text-white md:text-5xl">
                  {t("price")}
                  <span className="ml-1 font-sans text-base text-white/50">{t("period")}</span>
                </div>
                <p className="mt-2 text-sm text-white/50">{t("note")}</p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/sections/pricing-costs.tsx`** (3 plain columns on white):

```tsx
import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";

export function PricingCosts() {
  const t = useTranslations("pricing.costs");

  return (
    <section className="bg-white px-6 pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="font-serif text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] text-neutral-900 md:text-[44px] md:leading-[1.1]">
            {t("title")}
          </h2>
        </SectionReveal>
        <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <SectionReveal key={i} delay={i * 0.05}>
              <h3 className="text-lg font-semibold text-neutral-900">{t(`c${i}Title`)}</h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-500">{t(`c${i}Body`)}</p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: clean

- [ ] **Step 4: Commit**

```bash
git add components/sections/pricing-ai-addon.tsx components/sections/pricing-costs.tsx
git commit -m "feat: pricing AI add-on strip and messaging costs explainer"
```

---

### Task 4: Pricing FAQ accordion

**Files:**
- Create: `components/sections/pricing-faq.tsx`
- Reference: `components/sections/faq-section.tsx` (copy its structure/styles exactly — dark card, chevron, motion)

- [ ] **Step 1: Create `components/sections/pricing-faq.tsx`** — identical structure to `faq-section.tsx` with three changes: namespace `pricing.faq`, keys `q1..q5` (5 items, not 6), unique element id prefix (`pricing-faq-`) so both FAQs could coexist on a page without id collisions:

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionReveal } from "@/components/ui/section-reveal";

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5"] as const;

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <span
      className="shrink-0 rounded-full p-px"
      style={{ background: "linear-gradient(135deg, #22c55e, #7c3aed, #06b6d4)" }}
      aria-hidden
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </span>
  );
}

function FaqItem({ questionKey, answerKey }: { questionKey: string; answerKey: string }) {
  const t = useTranslations("pricing.faq");
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const panelId = `pricing-faq-panel-${questionKey}`;

  return (
    <div className="border-b border-white/[0.08]">
      <button
        id={`pricing-faq-btn-${questionKey}`}
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
            aria-labelledby={`pricing-faq-btn-${questionKey}`}
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

export function PricingFaq() {
  const t = useTranslations("pricing.faq");

  return (
    <section className="bg-white px-6 pb-16 md:pb-36">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-16 md:px-14 md:py-20">
          <div
            className="pointer-events-none absolute -left-1/4 -top-1/4 h-3/4 w-3/4 rounded-full opacity-[0.07] blur-[80px]"
            style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-3xl">
            <SectionReveal>
              <h2 className="font-serif text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-[44px] md:leading-[1.1]">
                {t("title")}
                <span className="text-green-500">.</span>
              </h2>
            </SectionReveal>
            <div className="mt-12">
              {FAQ_KEYS.map((key) => (
                <FaqItem key={key} questionKey={key} answerKey={`a${key.slice(1)}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: clean

- [ ] **Step 3: Commit**

```bash
git add components/sections/pricing-faq.tsx
git commit -m "feat: pricing FAQ accordion"
```

---

### Task 5: Assemble the page

**Files:**
- Modify: `app/[locale]/precios/page.tsx` (full rewrite — replaces the "coming soon" placeholder)

- [ ] **Step 1: Rewrite `app/[locale]/precios/page.tsx`**:

```tsx
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PricingTiers } from "@/components/sections/pricing-tiers";
import { PricingAiAddon } from "@/components/sections/pricing-ai-addon";
import { PricingCosts } from "@/components/sections/pricing-costs";
import { PricingFaq } from "@/components/sections/pricing-faq";
import { CtaSection } from "@/components/sections/cta-section";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return { title: t("metaTitle") };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PricingTiers />
      <PricingAiAddon />
      <PricingCosts />
      <PricingFaq />
      <CtaSection />
    </>
  );
}
```

- [ ] **Step 2: Typecheck + prettier**

Run: `npm run typecheck`
Expected: clean

Run: `npx prettier --check --print-width 120 --semi --trailing-comma all "app/[locale]/precios/page.tsx" components/sections/pricing-tiers.tsx components/sections/pricing-ai-addon.tsx components/sections/pricing-costs.tsx components/sections/pricing-faq.tsx messages/en.json messages/es.json`
Expected: all files pass. If not, run the same command with `--write` and re-check.

- [ ] **Step 3: Commit**

```bash
git add "app/[locale]/precios/page.tsx"
git commit -m "feat: assemble pricing page with metadata"
```

---

### Task 6: Browser verification (Playwright MCP)

No file changes expected unless bugs are found. Dev server: `npm run dev` (port 3002; check whether it's already running first — `lsof -i :3002`).

- [ ] **Step 1: Desktop EN** — navigate to `http://localhost:3002/pricing` at 1280×800. Verify: `<title>` is "Pricing | ConvertChat"; hero pill + H1 + subtitle; 3 cards with $49/$99/$199 and "/mo"; Growth card has rainbow background, white text, "Most popular" pill, white CTA; Starter shows NO AI Agent line; Enterprise banner below cards; dark AI add-on strip with "+$49/mo"; costs columns with "$0.06"; FAQ card with 5 questions; CtaSection at bottom.

- [ ] **Step 2: Desktop ES** — navigate to `http://localhost:3002/es/precios`. Verify: `<title>` is "Precios | ConvertChat"; €49/€99/€199 with "/mes"; "0,05 €" in costs + FAQ 3; all copy Spanish.

- [ ] **Step 3: CTAs** — verify all three tier CTAs and the Enterprise banner button are links to `https://cal.com/architct/onboarding` with `target="_blank"` (check hrefs in the accessibility snapshot rather than clicking through).

- [ ] **Step 4: FAQ accordion** — click FAQ question 1: panel expands with answer text; click again: collapses.

- [ ] **Step 5: Mobile 390×844** — cards stack with Growth FIRST; no layout breakage. Then 320×700: verify no horizontal overflow — run `document.documentElement.scrollWidth <= 320` via browser evaluate. (Known pre-existing overflow bugs exist on the HOMEPAGE; the pricing page itself must be clean.)

- [ ] **Step 6: Fix anything found, re-verify, commit fixes**

```bash
git add <changed files>
git commit -m "fix: pricing page verification fixes"
```

---

### Task 7: User review handoff

- [ ] Present both locales to the user for copy review (spec requires flagging es + en copy before shipping — Spanish is the beachhead, drafted by implementer).
- [ ] Remind: shipping happens via `/ship` (user-invoked), which also updates activity.md/scratchpad.md via `/log`. Do NOT push.
