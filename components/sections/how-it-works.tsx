"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Overline } from "@/components/ui/overline";
import { RainbowBorder } from "@/components/ui/rainbow-border";

const steps = ["step1", "step2", "step3", "step4"] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section id="how-it-works" className="bg-white px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <Overline className="text-primary-600/60">{t("label")}</Overline>
          <h2 className="mt-4 max-w-3xl font-serif text-3xl font-normal tracking-[-0.02em] text-neutral-900 md:text-[44px] md:leading-[1.1]">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-500">{t("lead")}</p>
        </SectionReveal>

        <RainbowBorder className="mt-16">
          <div className="grid gap-px overflow-hidden rounded-2xl bg-neutral-200 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((key, i) => (
              <SectionReveal key={key} delay={i * 0.1}>
                <div className="flex h-full flex-col bg-white p-8">
                  <span className="font-serif text-5xl font-normal text-primary-500/15">{t(`${key}.num`)}</span>
                  <h3 className="mt-3 font-serif text-lg font-medium text-neutral-900">{t(`${key}.title`)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-500">{t(`${key}.description`)}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </RainbowBorder>
      </div>
    </section>
  );
}
