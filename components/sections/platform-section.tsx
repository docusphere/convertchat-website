"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Overline } from "@/components/ui/overline";

const FEATURE_KEYS = ["feature1", "feature2", "feature3", "feature4", "feature5", "feature6"] as const;

type FeatureKey = (typeof FEATURE_KEYS)[number];

const FEATURE_ACCENT: Record<FeatureKey, string> = {
  feature1: "bg-primary-500/10 text-primary-600",
  feature2: "bg-primary-500/10 text-primary-600",
  feature3: "bg-primary-500/10 text-primary-600",
  feature4: "bg-primary-500/10 text-primary-600",
  feature5: "bg-primary-500/10 text-primary-600",
  feature6: "bg-primary-500/10 text-primary-600",
};

function FeatureIcon({ index, accentClass }: { index: number; accentClass: string }) {
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentClass}`} aria-hidden="true">
      <span className="font-serif text-base font-medium leading-none">{index + 1}</span>
    </div>
  );
}

export function PlatformSection() {
  const t = useTranslations("platform");

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

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_KEYS.map((key, i) => (
            <SectionReveal key={key} delay={i * 0.08}>
              <article className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-200 will-change-transform hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md">
                <FeatureIcon index={i} accentClass={FEATURE_ACCENT[key]} />
                <h3 className="mt-4 font-serif text-lg font-medium text-neutral-900">{t(`${key}_title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">{t(`${key}_desc`)}</p>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
