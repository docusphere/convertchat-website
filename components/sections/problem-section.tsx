"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";
import { RainbowBorder } from "@/components/ui/rainbow-border";

export function ProblemSection() {
  const t = useTranslations("problem");

  return (
    <section id="problem" className="bg-white px-6 py-16 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-stretch gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          {/* Left — headline + lead */}
          <SectionReveal>
            <div>
              <h2 className="font-serif text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] text-neutral-900 md:text-[38px]">
                {t("title").split(".").map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    <span key={i}>{part}<span className="text-green-500">.</span></span>
                  ) : part ? (
                    <span key={i}>{part}<span className="text-green-500">.</span></span>
                  ) : null
                )}
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-neutral-400">{t("lead")}</p>
            </div>
          </SectionReveal>

          {/* Right — gradient-bordered card */}
          <SectionReveal delay={0.15} className="h-full">
            <RainbowBorder className="h-full">
              <div className="flex h-full flex-col justify-center rounded-2xl bg-white px-8 py-7 md:px-10">
              {/* Featured pair: WhatsApp vs Email */}
              <div className="flex items-center gap-4">
                <div className="flex-1 py-4 text-center">
                  <span className="text-[48px] leading-none text-green-600" style={{ fontFamily: "var(--font-clash-display)", fontWeight: 600 }}>{t("wa_num")}</span>
                  <p className="mt-2 text-xs font-medium text-neutral-400">{t("wa_label")}</p>
                </div>
                <span className="text-[18px] font-semibold text-neutral-300">vs</span>
                <div className="flex-1 py-4 text-center">
                  <span className="text-[48px] leading-none text-red-600" style={{ fontFamily: "var(--font-clash-display)", fontWeight: 600 }}>{t("email_num")}</span>
                  <p className="mt-2 text-xs font-medium text-neutral-400">{t("email_label")}</p>
                </div>
              </div>

              <div className="my-5 h-px bg-neutral-100" />

              {/* Secondary stats */}
              <div className="flex gap-4">
                <div className="flex-1 text-center">
                  <span className="text-[36px] leading-none text-neutral-900" style={{ fontFamily: "var(--font-clash-display)", fontWeight: 600 }}>
                    {t("stat1_num")}
                  </span>
                  <p className="mt-1.5 text-[11px] leading-snug text-neutral-400">{t("stat1_desc")}</p>
                </div>
                <div className="w-px self-stretch bg-neutral-100" />
                <div className="flex-1 text-center">
                  <span className="text-[36px] leading-none text-neutral-900" style={{ fontFamily: "var(--font-clash-display)", fontWeight: 600 }}>
                    {t("stat2_num")}
                  </span>
                  <p className="mt-1.5 text-[11px] leading-snug text-neutral-400">{t("stat2_desc")}</p>
                </div>
              </div>

              </div>
            </RainbowBorder>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
