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
