"use client";

import { useTranslations } from "next-intl";
import { Laptop, Building2, HeartPulse, Cog, type LucideIcon } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { RainbowBorder } from "@/components/ui/rainbow-border";

const industries = ["electronics", "realEstate", "health", "auto"] as const;

const INDUSTRY_ICONS: { icon: LucideIcon; gradient: string; glow: string }[] = [
  { icon: Laptop, gradient: "from-[#22c55e] to-[#16a34a]", glow: "rgba(34,197,94,0.3)" },
  { icon: Building2, gradient: "from-[#8b5cf6] to-[#7c3aed]", glow: "rgba(139,92,246,0.3)" },
  { icon: HeartPulse, gradient: "from-[#06b6d4] to-[#0891b2]", glow: "rgba(6,182,212,0.3)" },
  { icon: Cog, gradient: "from-[#22c55e] to-[#16a34a]", glow: "rgba(34,197,94,0.3)" },
];

export function IndustriesSection() {
  const t = useTranslations("industries");

  return (
    <section className="bg-white px-6 py-16 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="max-w-3xl font-serif text-3xl font-semibold tracking-[-0.02em] text-neutral-900 md:text-[44px] md:leading-[1.1]">
            {t("title")}<span className="text-green-500">.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-500">{t("lead")}</p>
        </SectionReveal>

        <RainbowBorder className="mt-16">
          <div className="grid overflow-hidden rounded-2xl bg-white sm:grid-cols-2">
            {industries.map((key, i) => (
              <SectionReveal key={key} delay={i * 0.08}>
                <div className={`p-6 md:p-8 ${i < 2 ? "border-b border-neutral-200" : ""} ${i % 2 === 0 ? "sm:border-r sm:border-neutral-200" : ""} ${i === 2 ? "border-b border-neutral-200 sm:border-b-0" : ""}`}>
                  <div
                    className={`flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gradient-to-br ${INDUSTRY_ICONS[i].gradient}`}
                    style={{ boxShadow: `0 8px 20px ${INDUSTRY_ICONS[i].glow}, inset 0 1px 0 rgba(255,255,255,0.2)` }}
                    aria-hidden="true"
                  >
                    {(() => { const Icon = INDUSTRY_ICONS[i].icon; return <Icon className="h-7 w-7 text-white" strokeWidth={1.75} />; })()}
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-medium text-neutral-900">{t(`${key}.title`)}</h3>
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
