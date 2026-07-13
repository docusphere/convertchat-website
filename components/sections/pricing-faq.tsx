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
