"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Overline } from "@/components/ui/overline";

const industries = ["electronics", "realEstate", "health", "auto"] as const;

export function IndustriesSection() {
  const t = useTranslations("industries");

  return (
    <section className="bg-dark-base px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <Overline>{t("label")}</Overline>
          <h2 className="mt-4 max-w-3xl font-serif text-3xl font-normal tracking-[-0.02em] text-white md:text-[44px] md:leading-[1.1]">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/50">{t("lead")}</p>
        </SectionReveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {industries.map((key, i) => (
            <SectionReveal key={key} delay={i * 0.08}>
              <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06]">
                <h3 className="font-serif text-xl font-medium text-white">{t(`${key}.title`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{t(`${key}.description`)}</p>
                <p className="mt-4 text-sm font-medium text-primary-400">{t(`${key}.outcome`)}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
