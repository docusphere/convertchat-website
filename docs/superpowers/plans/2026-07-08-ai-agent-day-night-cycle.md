# AI Agent Day/Night Chat Cycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static nighttime chat in the AI Agent section with an animated day/night cycle showing two conversations (daytime FAQ, nighttime sale) to reinforce "Your store never closes."

**Architecture:** CSS keyframes handle the sky crossfade, sun/moon movement, and stars. Framer Motion `AnimatePresence` + `useEffect` timers drive message sequencing (same pattern as `hero-phone.tsx`). A `useInView` hook starts the animation only when scrolled into view.

**Tech Stack:** React, Framer Motion (AnimatePresence, useReducedMotion, useInView), next-intl, Tailwind CSS v4, lucide-react (Bot icon)

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `messages/en.json` | Modify | Add `aiAgent.chat.*` i18n keys (English) |
| `messages/es.json` | Modify | Add `aiAgent.chat.*` i18n keys (Spanish) |
| `app/globals.css` | Modify | Add `night-fade`, `sun-cycle`, `moon-cycle`, `stars-fade`, `twinkle` keyframes |
| `components/sections/ai-agent-chat.tsx` | Create | The animated day/night chat component |
| `components/sections/ai-agent-section.tsx` | Modify | Replace inline chat markup with `<AiAgentChat />` |

---

### Task 1: Add i18n keys

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/es.json`

- [ ] **Step 1: Add English chat keys to `messages/en.json`**

Inside the existing `"aiAgent"` object (after `"bullet4"` on line 151), add a `"chat"` sub-object:

```json
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
```

- [ ] **Step 2: Add Spanish chat keys to `messages/es.json`**

Inside the existing `"aiAgent"` object (after `"bullet4"` on line 151), add a `"chat"` sub-object:

```json
"chat": {
  "day_time": "10:15",
  "day_customer1": "Enviáis iPhone 15 Pro Max a Alemania? Cuál es el pedido mínimo?",
  "day_ai1": "Sí! Enviamos a Alemania por DHL Express (3-5 días). Pedido mínimo: 25 unidades. Stock actual: 340 unidades.",
  "day_customer2": "Precio unitario por 50 unidades?",
  "day_ai2": "1.089 EUR/unidad por 50x. También tenemos 128GB a 989 EUR — popular en tu zona. Quieres presupuesto de ambos?",
  "day_status": "Respondido en menos de 5 segundos",
  "night_time": "2:30",
  "night_customer1": "Necesito 100x Samsung A55 urgente. Disponible?",
  "night_ai1": "En stock! 100x Samsung A55 128GB a 285 EUR/unidad. Total: 28.500 EUR. Listo para enviar mañana.",
  "night_customer2": "Perfecto. Envíame el enlace de pedido.",
  "night_ai2": "Listo! Aquí tu pedido:",
  "night_link": "pedido.techsupply.com/SA55-100",
  "night_status": "Venta cerrada a las 2:31",
  "ai_label": "ConvertChat IA"
}
```

- [ ] **Step 3: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); JSON.parse(require('fs').readFileSync('messages/es.json','utf8')); console.log('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/es.json
git commit -m "feat: add i18n keys for AI agent day/night chat"
```

---

### Task 2: Add CSS keyframes

**Files:**
- Modify: `app/globals.css` (append after line 143)

- [ ] **Step 1: Add all day/night keyframes to `app/globals.css`**

Append the following after the existing `@media (prefers-reduced-motion)` block at the end of the file:

```css
/* --- AI Agent Day/Night Cycle --- */

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

@keyframes sun-cycle {
  0%   { top: 14px; opacity: 0; }
  3%   { top: 14px; opacity: 1; }
  42%  { top: 18px; opacity: 1; }
  47%  { top: 70px; opacity: 0; }
  92%  { top: 70px; opacity: 0; }
  97%  { top: 14px; opacity: 1; }
  100% { top: 14px; opacity: 1; }
}

@keyframes moon-cycle {
  0%   { top: 70px; opacity: 0; }
  42%  { top: 70px; opacity: 0; }
  47%  { top: 16px; opacity: 0.85; }
  92%  { top: 18px; opacity: 0.85; }
  97%  { top: 70px; opacity: 0; }
  100% { top: 70px; opacity: 0; }
}

@keyframes stars-fade {
  0%   { opacity: 0; }
  42%  { opacity: 0; }
  48%  { opacity: 1; }
  92%  { opacity: 1; }
  96%  { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes twinkle {
  0%   { opacity: 0.3; }
  100% { opacity: 0.8; }
}

```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build 2>&1 | tail -5`
Expected: Build completes without CSS errors.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add day/night cycle keyframes to globals.css"
```

---

### Task 3: Create the `AiAgentChat` component

**Files:**
- Create: `components/sections/ai-agent-chat.tsx`

This is the main component. It contains:
- Sky layers (day base + night overlay)
- Sun, moon, stars
- Two conversation containers with message bubbles
- Typing indicators
- Animation orchestration via `useEffect` timers
- `useInView` to start animation on scroll
- `useReducedMotion` for accessibility fallback

- [ ] **Step 1: Create `components/sections/ai-agent-chat.tsx`**

```tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Bot } from "lucide-react";

// --- Constants ---

const CYCLE_DURATION = 20; // seconds — must match CSS keyframe durations

type Phase = "typing1" | "msg1" | "typing2" | "msg2" | "typing3" | "msg3" | "typing4" | "msg4" | "hold" | "done";

const DAY_TIMELINE: { phase: Phase; delay: number }[] = [
  { phase: "typing1", delay: 600 },
  { phase: "msg1", delay: 1800 },
  { phase: "typing2", delay: 800 },
  { phase: "msg2", delay: 2000 },
  { phase: "typing3", delay: 600 },
  { phase: "msg3", delay: 1200 },
  { phase: "typing4", delay: 800 },
  { phase: "msg4", delay: 2000 },
  { phase: "hold", delay: 1000 },
  { phase: "done", delay: 0 },
];

const NIGHT_TIMELINE: { phase: Phase; delay: number }[] = [
  { phase: "typing1", delay: 600 },
  { phase: "msg1", delay: 1500 },
  { phase: "typing2", delay: 800 },
  { phase: "msg2", delay: 1800 },
  { phase: "typing3", delay: 600 },
  { phase: "msg3", delay: 1200 },
  { phase: "typing4", delay: 800 },
  { phase: "msg4", delay: 2000 },
  { phase: "hold", delay: 1000 },
  { phase: "done", delay: 0 },
];

const TRANSITION_MS = 2000;

const PHASE_ORDER: Phase[] = ["typing1", "msg1", "typing2", "msg2", "typing3", "msg3", "typing4", "msg4", "hold", "done"];

function phaseGte(current: Phase | null, target: Phase): boolean {
  if (!current) return false;
  return PHASE_ORDER.indexOf(current) >= PHASE_ORDER.indexOf(target);
}

// --- Sub-components ---

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-1 self-start rounded-2xl rounded-tl-sm bg-white/[0.92] px-3 py-2.5"
    >
      {[0, 0.15, 0.3].map((delay, i) => (
        <span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-neutral-400"
          style={{ animation: `dot-bounce 1s ease-in-out ${delay}s infinite` }}
        />
      ))}
    </motion.div>
  );
}

function AiTypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-1 self-end rounded-2xl rounded-tr-sm bg-green-600 px-3 py-2.5"
    >
      {[0, 0.15, 0.3].map((delay, i) => (
        <span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-white/60"
          style={{ animation: `dot-bounce 1s ease-in-out ${delay}s infinite` }}
        />
      ))}
    </motion.div>
  );
}

function AiBadge({ label }: { label: string }) {
  return (
    <span className="mb-1 inline-flex items-center gap-1 rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold text-white/70">
      <Bot size={10} />
      {label}
    </span>
  );
}

function CustomerBubble({ children, time }: { children: React.ReactNode; time: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[82%] self-start rounded-2xl rounded-tl-sm bg-white/[0.92] px-3 py-2"
    >
      <p className="text-[12.5px] leading-[1.4] text-neutral-900">{children}</p>
      <p className="mt-0.5 text-right text-[9px] text-neutral-500/60">{time}</p>
    </motion.div>
  );
}

function AiBubble({ children, time, label }: { children: React.ReactNode; time: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[82%] self-end rounded-2xl rounded-tr-sm bg-green-600 px-3 py-2"
    >
      <AiBadge label={label} />
      <div className="text-[12.5px] leading-[1.4] text-white">{children}</div>
      <p className="mt-0.5 text-right text-[9px] text-white/50">{time}</p>
    </motion.div>
  );
}

// --- Conversation runner hook ---

function useConversationSequence(
  timeline: { phase: Phase; delay: number }[],
  active: boolean,
  onDone: () => void,
) {
  const [phase, setPhase] = useState<Phase | null>(null);

  useEffect(() => {
    if (!active) {
      setPhase(null);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    let step = 0;

    function advance() {
      if (step >= timeline.length) {
        onDone();
        return;
      }
      const entry = timeline[step];
      setPhase(entry.phase);
      step++;
      if (entry.delay > 0) {
        timeoutId = setTimeout(advance, entry.delay);
      } else {
        onDone();
      }
    }

    timeoutId = setTimeout(advance, timeline[0].delay);

    return () => clearTimeout(timeoutId);
  }, [active, timeline, onDone]);

  return phase;
}

// --- Main component ---

type Mode = "day" | "day-to-night" | "night" | "night-to-day";

export function AiAgentChat() {
  const t = useTranslations("aiAgent.chat");
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  const [mode, setMode] = useState<Mode>("day");
  const [animating, setAnimating] = useState(false);

  // Start animation when in view
  useEffect(() => {
    if (isInView && !prefersReducedMotion) {
      setAnimating(true);
    }
  }, [isInView, prefersReducedMotion]);

  const handleDayDone = useCallback(() => {
    setMode("day-to-night");
    setTimeout(() => setMode("night"), TRANSITION_MS);
  }, []);

  const handleNightDone = useCallback(() => {
    setMode("night-to-day");
    setTimeout(() => setMode("day"), TRANSITION_MS);
  }, []);

  const dayPhase = useConversationSequence(DAY_TIMELINE, animating && mode === "day", handleDayDone);
  const nightPhase = useConversationSequence(NIGHT_TIMELINE, animating && mode === "night", handleNightDone);

  const showDayMsg = (target: Phase) => phaseGte(dayPhase, target);
  const showNightMsg = (target: Phase) => phaseGte(nightPhase, target);

  // Reduced motion: static night view
  if (prefersReducedMotion) {
    return (
      <div ref={containerRef} aria-hidden="true" className="relative overflow-hidden rounded-2xl bg-neutral-950 p-5 md:p-6">
        {/* Night sky */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #111827 40%, #1e293b 100%)" }} />
        {/* Moon */}
        <div className="pointer-events-none absolute right-4 top-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#fde68a" />
          </svg>
        </div>
        {/* Stars */}
        <div className="pointer-events-none absolute right-14 top-3 h-1 w-1 rounded-full bg-amber-100/40" />
        <div className="pointer-events-none absolute right-10 top-8 h-0.5 w-0.5 rounded-full bg-amber-100/30" />
        <div className="pointer-events-none absolute right-20 top-6 h-0.5 w-0.5 rounded-full bg-amber-100/25" />

        {/* Static night messages */}
        <div className="relative z-10 flex flex-col gap-2 pt-10">
          <div className="self-center rounded-lg bg-black/[0.12] px-2.5 py-1 text-[11px] text-white/70 backdrop-blur-sm">{t("night_time")}</div>
          <div className="max-w-[82%] self-start rounded-2xl rounded-tl-sm bg-white/[0.92] px-3 py-2">
            <p className="text-[12.5px] leading-[1.4] text-neutral-900">{t("night_customer1")}</p>
            <p className="mt-0.5 text-right text-[9px] text-neutral-500/60">{t("night_time")}</p>
          </div>
          <div className="max-w-[82%] self-end rounded-2xl rounded-tr-sm bg-green-600 px-3 py-2">
            <AiBadge label={t("ai_label")} />
            <p className="text-[12.5px] leading-[1.4] text-white">{t("night_ai1")}</p>
            <p className="mt-0.5 text-right text-[9px] text-white/50">{t("night_time")}</p>
          </div>
          <div className="max-w-[82%] self-start rounded-2xl rounded-tl-sm bg-white/[0.92] px-3 py-2">
            <p className="text-[12.5px] leading-[1.4] text-neutral-900">{t("night_customer2")}</p>
            <p className="mt-0.5 text-right text-[9px] text-neutral-500/60">{t("night_time")}</p>
          </div>
          <div className="max-w-[82%] self-end rounded-2xl rounded-tr-sm bg-green-600 px-3 py-2">
            <AiBadge label={t("ai_label")} />
            <p className="text-[12.5px] leading-[1.4] text-white">{t("night_ai2")}</p>
            <div className="mt-1 rounded-md border-l-2 border-white/50 bg-white/15 px-2 py-1.5 text-[11px] text-white/80">{t("night_link")}</div>
            <p className="mt-0.5 text-right text-[9px] text-white/50">{t("night_time")}</p>
          </div>
          <p className="mt-2 text-center text-[10px] text-white/25">{t("night_status")}</p>
        </div>
      </div>
    );
  }

  const cycleStyle = animating ? `${CYCLE_DURATION}s` : "0s";

  return (
    <div ref={containerRef} aria-hidden="true" className="relative overflow-hidden rounded-2xl bg-neutral-950 p-5 md:p-6" style={{ minHeight: 380 }}>
      {/* Sky layers */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #3b82f6 0%, #87CEEB 40%, #bfdbfe 100%)" }} />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0a0e1a 0%, #111827 40%, #1e293b 100%)",
          animation: animating ? `night-fade ${cycleStyle} ease-in-out infinite` : "none",
          opacity: animating ? undefined : 0,
        }}
      />

      {/* Sun */}
      <div
        className="pointer-events-none absolute right-5 z-[1]"
        style={{ animation: animating ? `sun-cycle ${cycleStyle} ease-in-out infinite` : "none", top: animating ? undefined : 14, opacity: animating ? undefined : 1 }}
      >
        <div className="absolute left-1/2 top-1/2 h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)" }} />
        <div className="h-[26px] w-[26px] rounded-full" style={{ background: "radial-gradient(circle at 40% 35%, #fde68a, #f59e0b)", boxShadow: "0 0 20px rgba(251,191,36,0.5)" }} />
      </div>

      {/* Moon */}
      <div
        className="pointer-events-none absolute right-[22px] z-[1]"
        style={{ animation: animating ? `moon-cycle ${cycleStyle} ease-in-out infinite` : "none", top: animating ? undefined : 70, opacity: animating ? undefined : 0 }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#fde68a" />
        </svg>
      </div>

      {/* Stars */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ animation: animating ? `stars-fade ${cycleStyle} ease-in-out infinite` : "none", opacity: animating ? undefined : 0 }}
      >
        <div className="absolute right-[55px] top-[14px] h-[2.5px] w-[2.5px] rounded-full bg-amber-100" style={{ animation: "twinkle 3s ease-in-out infinite alternate" }} />
        <div className="absolute right-[75px] top-[28px] h-[2px] w-[2px] rounded-full bg-amber-100" style={{ animation: "twinkle 3s ease-in-out 0.8s infinite alternate" }} />
        <div className="absolute right-[95px] top-[10px] h-[1.5px] w-[1.5px] rounded-full bg-amber-100" style={{ animation: "twinkle 3s ease-in-out 1.5s infinite alternate" }} />
        <div className="absolute right-[40px] top-[38px] h-[1.5px] w-[1.5px] rounded-full bg-amber-100" style={{ animation: "twinkle 3s ease-in-out 0.5s infinite alternate" }} />
        <div className="absolute left-[30px] top-[18px] h-[2px] w-[2px] rounded-full bg-amber-100" style={{ animation: "twinkle 3s ease-in-out 1.2s infinite alternate" }} />
        <div className="absolute left-[60px] top-[30px] h-[1.5px] w-[1.5px] rounded-full bg-amber-100" style={{ animation: "twinkle 3s ease-in-out 2s infinite alternate" }} />
        <div className="absolute left-[100px] top-[12px] h-[2px] w-[2px] rounded-full bg-amber-100" style={{ animation: "twinkle 3s ease-in-out 0.3s infinite alternate" }} />
      </div>

      {/* Chat content */}
      <div className="relative z-10 flex flex-col pt-10" style={{ minHeight: 320 }}>
        {/* Day conversation */}
        {mode === "day" && (
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="self-center rounded-lg bg-black/[0.12] px-2.5 py-1 text-[11px] text-white/70 backdrop-blur-sm">{t("day_time")}</div>

          <AnimatePresence mode="popLayout">
            {dayPhase === "typing1" && <TypingIndicator key="dt1" />}
          </AnimatePresence>
          <AnimatePresence>
            {showDayMsg("msg1") && <CustomerBubble key="dm1" time={t("day_time")}>{t("day_customer1")}</CustomerBubble>}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {dayPhase === "typing2" && <AiTypingIndicator key="dt2" />}
          </AnimatePresence>
          <AnimatePresence>
            {showDayMsg("msg2") && (
              <AiBubble key="dm2" time={t("day_time")} label={t("ai_label")}>{t("day_ai1")}</AiBubble>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {dayPhase === "typing3" && <TypingIndicator key="dt3" />}
          </AnimatePresence>
          <AnimatePresence>
            {showDayMsg("msg3") && <CustomerBubble key="dm3" time={t("day_time")}>{t("day_customer2")}</CustomerBubble>}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {dayPhase === "typing4" && <AiTypingIndicator key="dt4" />}
          </AnimatePresence>
          <AnimatePresence>
            {showDayMsg("msg4") && (
              <AiBubble key="dm4" time={t("day_time")} label={t("ai_label")}>{t("day_ai2")}</AiBubble>
            )}
          </AnimatePresence>

          {showDayMsg("hold") && <p className="mt-2 text-center text-[10px] text-white/25">{t("day_status")}</p>}
        </motion.div>
        )}

        {/* Night conversation */}
        {mode === "night" && (
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="self-center rounded-lg bg-black/[0.12] px-2.5 py-1 text-[11px] text-white/70 backdrop-blur-sm">{t("night_time")}</div>

          <AnimatePresence mode="popLayout">
            {nightPhase === "typing1" && <TypingIndicator key="nt1" />}
          </AnimatePresence>
          <AnimatePresence>
            {showNightMsg("msg1") && <CustomerBubble key="nm1" time={t("night_time")}>{t("night_customer1")}</CustomerBubble>}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {nightPhase === "typing2" && <AiTypingIndicator key="nt2" />}
          </AnimatePresence>
          <AnimatePresence>
            {showNightMsg("msg2") && (
              <AiBubble key="nm2" time={t("night_time")} label={t("ai_label")}>{t("night_ai1")}</AiBubble>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {nightPhase === "typing3" && <TypingIndicator key="nt3" />}
          </AnimatePresence>
          <AnimatePresence>
            {showNightMsg("msg3") && <CustomerBubble key="nm3" time={t("night_time")}>{t("night_customer2")}</CustomerBubble>}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {nightPhase === "typing4" && <AiTypingIndicator key="nt4" />}
          </AnimatePresence>
          <AnimatePresence>
            {showNightMsg("msg4") && (
              <AiBubble key="nm4" time={t("night_time")} label={t("ai_label")}>
                {t("night_ai2")}
                <div className="mt-1 rounded-md border-l-2 border-white/50 bg-white/15 px-2 py-1.5 text-[11px] text-white/80">{t("night_link")}</div>
              </AiBubble>
            )}
          </AnimatePresence>

          {showNightMsg("hold") && <p className="mt-2 text-center text-[10px] text-white/25">{t("night_status")}</p>}
        </motion.div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors related to `ai-agent-chat.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/sections/ai-agent-chat.tsx
git commit -m "feat: create AiAgentChat component with day/night cycle"
```

---

### Task 4: Wire up `AiAgentChat` in the AI Agent section

**Files:**
- Modify: `components/sections/ai-agent-section.tsx`

- [ ] **Step 1: Add import**

At the top of `components/sections/ai-agent-section.tsx`, add after the existing imports:

```tsx
import { AiAgentChat } from "@/components/sections/ai-agent-chat";
```

- [ ] **Step 2: Replace the inline chat markup**

Replace the entire `SectionReveal` block on lines 74-119 (from `<SectionReveal delay={0.15} className="w-full">` to its closing `</SectionReveal>`) with:

```tsx
          <SectionReveal delay={0.15} className="w-full">
            <AiAgentChat />
          </SectionReveal>
```

- [ ] **Step 3: Verify build succeeds**

Run: `npm run build 2>&1 | tail -10`
Expected: Build completes successfully.

- [ ] **Step 4: Visual verification**

Run: `npm run dev` and navigate to `http://localhost:3002`. Scroll to the AI Agent section. Verify:
- Day sky with sun appears first
- Messages appear one by one with typing indicators
- Sky crossfades to night (no red/orange sunset colors)
- Sun fades down, moon fades up
- Stars appear and twinkle
- Night conversation plays with typing indicators
- Cycle loops back to day smoothly

- [ ] **Step 5: Commit**

```bash
git add components/sections/ai-agent-section.tsx
git commit -m "feat: wire AiAgentChat into AI agent section"
```
