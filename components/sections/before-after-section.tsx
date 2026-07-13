"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";

const BOOKING_URL = "https://cal.com/architct/onboarding";

const GAP = 24; // matches gap-6 between the two cards
const PEEK = 28; // gray card peek (desktop, top-left)
const PEEK_MOBILE = 20; // gray card peek (mobile, top)
const TRAVEL_END = 0.75; // cards finish moving at 75% scroll; scribble draws in the rest

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function CheckIcon({ variant }: { variant: "before" | "after" }) {
  const bg = variant === "before" ? "#171717" : "#ffffff";
  const check = variant === "before" ? "#ffffff" : "#16a34a";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <rect width="24" height="24" rx="6" fill={bg} />
      <path d="M7 12.5l3 3 7-7" stroke={check} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BeforeCard() {
  const t = useTranslations("beforeAfter");
  const items = [t("before_1"), t("before_2"), t("before_3"), t("before_4")];

  return (
    <div className="flex h-full flex-col rounded-[24px] bg-neutral-100 p-8 md:p-10">
      <p className="text-center text-sm font-semibold tracking-wide text-neutral-500">{t("before_label")}</p>
      <h3 className="mt-4 whitespace-pre-line text-center font-serif text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-neutral-900 md:text-[48px]">
        {t("before_title")}
      </h3>

      <div className="mt-auto pt-12">
        <ul className="space-y-0">
          {items.map((item, i) => (
            <li key={i}>
              {i > 0 && <div className="h-px bg-neutral-200" />}
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.06em] text-neutral-700">{item}</span>
                <CheckIcon variant="before" />
              </div>
            </li>
          ))}
        </ul>

        <Button
          variant="secondary"
          size="lg"
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full"
        >
          {t("cta")}
        </Button>
      </div>
    </div>
  );
}

/**
 * Hand-drawn double loop around the after-card headline.
 * drawProgress is the stroke-dashoffset (1 = invisible, 0 = fully drawn); null renders it fully drawn.
 * Path, viewBox, inset and gradient stops come from the user-approved prototype.
 */
function RainbowScribble({ drawProgress }: { drawProgress: MotionValue<number> | null }) {
  return (
    <svg
      className="pointer-events-none absolute z-[2]"
      style={{
        inset: "-38px -50px -42px -50px",
        width: "calc(100% + 100px)",
        height: "calc(100% + 80px)",
        overflow: "visible",
      }}
      viewBox="0 0 560 240"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="scribble-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="45%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 306 18 C 420 -6 548 22 545 88 C 542 158 420 210 262 216 C 118 222 8 186 14 118 C 20 54 130 10 300 30 C 420 44 500 78 492 120"
        pathLength={1}
        fill="none"
        stroke="url(#scribble-rainbow)"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ strokeDasharray: 1, strokeDashoffset: drawProgress ?? 0 }}
      />
    </svg>
  );
}

function AfterCard({ drawProgress }: { drawProgress: MotionValue<number> | null }) {
  const t = useTranslations("beforeAfter");
  const items = [t("after_1"), t("after_2"), t("after_3"), t("after_4")];

  return (
    <div className="flex h-full flex-col rounded-[24px] bg-primary-500 p-8 md:p-10">
      <p className="text-center text-sm font-semibold tracking-wide text-white/70">{t("after_label")}</p>
      <div className="relative">
        <RainbowScribble drawProgress={drawProgress} />
        <h3 className="relative z-[1] mt-4 whitespace-pre-line text-center font-serif text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-white md:text-[48px]">
          {t("after_title")}
        </h3>
      </div>

      <div className="mt-auto pt-12">
        <ul className="space-y-0">
          {items.map((item, i) => (
            <li key={i}>
              {i > 0 && <div className="h-px bg-white/20" />}
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.06em] text-white">{item}</span>
                <CheckIcon variant="after" />
              </div>
            </li>
          ))}
        </ul>

        <Button
          variant="ghost"
          size="lg"
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full"
          style={{
            background: "#ffffff",
            color: "#171717",
            borderColor: "#ffffff",
          }}
        >
          {t("cta")}
        </Button>
      </div>
    </div>
  );
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

function AnimatedBeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Card travel: eased scrub over the first 75% of scroll
  const travel = useTransform(scrollYProgress, (p) => easeInOut(clamp01(p / TRAVEL_END)));
  // Scribble: dashoffset 1 -> 0 over the last 25%
  const draw = useTransform(scrollYProgress, [TRAVEL_END, 1], [1, 0]);

  // Green card: desktop slides left onto the center (with a playful tilt peaking ~2.5deg mid-flight);
  // mobile slides up from below the viewport onto the gray card, leaving a PEEK_MOBILE offset.
  const afterTransform = useTransform(travel, (t): string => {
    const tilt = Math.sin(t * Math.PI) * 2.5;
    return isDesktop
      ? `translateX(calc(${-50 * t}% - ${(GAP / 2) * t}px)) rotate(${tilt}deg)`
      : `translateY(calc(${100 * (1 - t)}% + ${20 * (1 - t)}svh + ${PEEK_MOBILE * t}px)) rotate(${tilt}deg)`;
  });

  // Gray card: desktop tucks toward the center behind the green one, peeking out top-left;
  // mobile stays put and just recedes (scale + dim).
  const beforeTransform = useTransform(travel, (t): string =>
    isDesktop
      ? `translate(calc(${50 * t}% + ${(GAP / 2 - PEEK) * t}px), ${-PEEK * t}px) scale(${1 - 0.03 * t})`
      : `scale(${1 - 0.03 * t})`,
  );
  const beforeOpacity = useTransform(travel, (t) => 1 - 0.15 * t);

  return (
    <section ref={sectionRef} className="relative h-[250vh] bg-white">
      <div className="sticky top-0 flex min-h-svh items-center px-6 py-6" style={{ overflowX: "clip" }}>
        <div className="relative mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-2">
          <motion.div className="relative z-[1]" style={{ transform: beforeTransform, opacity: beforeOpacity }}>
            <BeforeCard />
          </motion.div>
          <motion.div
            className="absolute inset-x-0 top-0 z-[2] grid min-h-full md:static"
            style={{ transform: afterTransform }}
          >
            <AfterCard drawProgress={draw} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StaticBeforeAfter() {
  return (
    <section className="bg-white px-6 py-20 md:py-28" style={{ overflowX: "clip" }}>
      <div className="relative mx-auto max-w-[600px]">
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${-PEEK}px, ${-PEEK}px) scale(0.97)`,
            opacity: 0.85,
          }}
        >
          <BeforeCard />
        </div>
        <div className="relative z-[1]">
          <AfterCard drawProgress={null} />
        </div>
      </div>
    </section>
  );
}

export function BeforeAfterSection() {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // useReducedMotion is null during SSR; swap to the static variant only after mount to avoid a hydration mismatch
  return mounted && reducedMotion ? <StaticBeforeAfter /> : <AnimatedBeforeAfter />;
}
