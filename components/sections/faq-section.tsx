"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionReveal } from "@/components/ui/section-reveal";

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
    <section className="bg-white px-6 py-16 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-16 md:px-14 md:py-20">
          {/* Subtle purple glow */}
          <div
            className="pointer-events-none absolute -left-1/4 -top-1/4 h-3/4 w-3/4 rounded-full opacity-[0.07] blur-[80px]"
            style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
            aria-hidden
          />

          <div className="relative z-10 mx-auto max-w-3xl">
            <SectionReveal>
              <h2 className="font-serif text-3xl font-normal tracking-[-0.02em] text-white md:text-[44px] md:leading-[1.1]">
                {t("title")}
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
