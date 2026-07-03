"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionReveal } from "@/components/ui/section-reveal";

const icons = {
  campaigns: (
    <svg className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
      />
    </svg>
  ),
  inbox: (
    <svg className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-17.5 0V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0113.548 0c1.131.094 1.976 1.057 1.976 2.192V13.5"
      />
    </svg>
  ),
  ai: (
    <svg className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
      />
    </svg>
  ),
};

const features = ["campaigns", "inbox", "ai"] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: i * 0.12 },
  }),
};

export function FeatureCards() {
  const t = useTranslations("features");

  return (
    <section className="bg-dark-base px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="text-center font-serif text-3xl font-medium tracking-[-0.02em] text-white md:text-[40px]">
            {t("title")}
          </h2>
        </SectionReveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((key, i) => (
            <motion.div
              key={key}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="group rounded-3xl border border-white/[0.08] bg-white/[0.04] p-8 backdrop-blur-3xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.08]"
            >
              <div className="mb-4 inline-flex rounded-xl bg-white/[0.06] p-3">{icons[key]}</div>
              <h3 className="font-serif text-xl font-medium text-white">{t(`${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{t(`${key}.description`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
