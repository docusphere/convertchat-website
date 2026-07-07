"use client";

import { useTranslations } from "next-intl";
import { Users, Send, Radio, MessageCircle, BarChart3, ShieldCheck, type LucideIcon } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";

const FEATURE_KEYS = ["feature1", "feature2", "feature3", "feature4", "feature5", "feature6"] as const;

const FEATURE_ICONS: { icon: LucideIcon; gradient: string; glow: string }[] = [
  { icon: Users, gradient: "from-[#22c55e] to-[#16a34a]", glow: "rgba(34,197,94,0.3)" },
  { icon: Send, gradient: "from-[#8b5cf6] to-[#7c3aed]", glow: "rgba(139,92,246,0.3)" },
  { icon: Radio, gradient: "from-[#06b6d4] to-[#0891b2]", glow: "rgba(6,182,212,0.3)" },
  { icon: MessageCircle, gradient: "from-[#22c55e] to-[#16a34a]", glow: "rgba(34,197,94,0.3)" },
  { icon: BarChart3, gradient: "from-[#8b5cf6] to-[#7c3aed]", glow: "rgba(139,92,246,0.3)" },
  { icon: ShieldCheck, gradient: "from-[#06b6d4] to-[#0891b2]", glow: "rgba(6,182,212,0.3)" },
];

export function PlatformSection() {
  const t = useTranslations("platform");

  return (
    <section className="bg-white px-6 py-16 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="max-w-3xl font-serif text-3xl font-normal tracking-[-0.02em] text-neutral-900 md:text-[44px] md:leading-[1.1]">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-500">{t("lead")}</p>
        </SectionReveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_KEYS.map((key, i) => (
            <SectionReveal key={key} delay={i * 0.08}>
              <article className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-200 will-change-transform hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md">
                <div
                  className={`flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gradient-to-br ${FEATURE_ICONS[i].gradient}`}
                  style={{ boxShadow: `0 8px 20px ${FEATURE_ICONS[i].glow}, inset 0 1px 0 rgba(255,255,255,0.2)` }}
                  aria-hidden="true"
                >
                  {(() => { const Icon = FEATURE_ICONS[i].icon; return <Icon className="h-7 w-7 text-white" strokeWidth={1.75} />; })()}
                </div>
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
