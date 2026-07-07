"use client";

import { useTranslations } from "next-intl";
import { CloudUpload, Mail, MousePointerClick, Megaphone, type LucideIcon } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { RainbowBorder } from "@/components/ui/rainbow-border";

const steps = ["step1", "step2", "step3", "step4"] as const;

const STEP_ICONS: { icon: LucideIcon; gradient: string; glow: string }[] = [
  { icon: CloudUpload, gradient: "from-[#22c55e] to-[#16a34a]", glow: "rgba(34,197,94,0.3)" },
  { icon: Mail, gradient: "from-[#8b5cf6] to-[#7c3aed]", glow: "rgba(139,92,246,0.3)" },
  { icon: MousePointerClick, gradient: "from-[#06b6d4] to-[#0891b2]", glow: "rgba(6,182,212,0.3)" },
  { icon: Megaphone, gradient: "from-[#22c55e] to-[#16a34a]", glow: "rgba(34,197,94,0.3)" },
];

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section id="how-it-works" className="bg-white px-6 py-16 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="max-w-3xl font-serif text-3xl font-normal tracking-[-0.02em] text-neutral-900 md:text-[44px] md:leading-[1.1]">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-500">{t("lead")}</p>
        </SectionReveal>

        <RainbowBorder className="mt-16">
          <div className="grid gap-px overflow-hidden rounded-2xl bg-neutral-200 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((key, i) => (
              <SectionReveal key={key} delay={i * 0.1}>
                <div className="flex h-full flex-col bg-white p-8">
                  <span className="text-xs font-medium text-neutral-400">{t(`${key}.num`)}</span>
                  <div
                    className={`mt-2 flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gradient-to-br ${STEP_ICONS[i].gradient}`}
                    style={{ boxShadow: `0 8px 20px ${STEP_ICONS[i].glow}, inset 0 1px 0 rgba(255,255,255,0.2)` }}
                    aria-hidden="true"
                  >
                    {(() => { const Icon = STEP_ICONS[i].icon; return <Icon className="h-7 w-7 text-white" strokeWidth={1.75} />; })()}
                  </div>
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
