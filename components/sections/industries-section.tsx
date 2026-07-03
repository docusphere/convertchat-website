"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Overline } from "@/components/ui/overline";
import { RainbowBorder } from "@/components/ui/rainbow-border";

const industries = ["electronics", "realEstate", "health", "auto"] as const;

export function IndustriesSection() {
  const t = useTranslations("industries");

  return (
    <section className="bg-white px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <Overline className="text-primary-600/60">{t("label")}</Overline>
          <h2 className="mt-4 max-w-3xl font-serif text-3xl font-normal tracking-[-0.02em] text-neutral-900 md:text-[44px] md:leading-[1.1]">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-500">{t("lead")}</p>
        </SectionReveal>

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
      </div>
    </section>
  );
}
