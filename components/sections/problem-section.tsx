"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Overline } from "@/components/ui/overline";
import { RainbowBorder } from "@/components/ui/rainbow-border";

export function ProblemSection() {
  const t = useTranslations("problem");

  return (
    <section id="problem" className="bg-white px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          {/* Left — headline + lead */}
          <SectionReveal>
            <div>
              <Overline className="text-primary-600/60">{t("label")}</Overline>
              <h2 className="mt-4 font-serif text-3xl font-normal tracking-[-0.02em] text-neutral-900 md:text-[38px] md:leading-[1.15]">
                {t("title")}
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-neutral-400">{t("lead")}</p>
            </div>
          </SectionReveal>

          {/* Right — gradient-bordered card */}
          <SectionReveal delay={0.15}>
            <RainbowBorder>
              <div className="rounded-2xl bg-white px-8 py-7 md:px-10">
              {/* Featured pair: WhatsApp vs Email */}
              <div className="flex items-center gap-4">
                <div className="flex-1 py-4 text-center">
                  <span className="font-serif text-[38px] font-normal leading-none text-green-600">{t("wa_num")}</span>
                  <p className="mt-2 text-xs font-medium text-neutral-400">{t("wa_label")}</p>
                </div>
                <span className="text-[13px] font-semibold text-neutral-300">vs</span>
                <div className="flex-1 py-4 text-center">
                  <span className="font-serif text-[38px] font-normal leading-none text-red-600">{t("email_num")}</span>
                  <p className="mt-2 text-xs font-medium text-neutral-400">{t("email_label")}</p>
                </div>
              </div>

              <div className="my-5 h-px bg-neutral-100" />

              {/* Secondary stats */}
              <div className="flex gap-4">
                <div className="flex-1 text-center">
                  <span className="font-serif text-[28px] font-normal leading-none text-neutral-900">
                    {t("stat1_num")}
                  </span>
                  <p className="mt-1.5 text-[11px] leading-snug text-neutral-400">{t("stat1_desc")}</p>
                </div>
                <div className="w-px self-stretch bg-neutral-100" />
                <div className="flex-1 text-center">
                  <span className="font-serif text-[28px] font-normal leading-none text-neutral-900">
                    {t("stat2_num")}
                  </span>
                  <p className="mt-1.5 text-[11px] leading-snug text-neutral-400">{t("stat2_desc")}</p>
                </div>
              </div>

              <div className="my-5 h-px bg-neutral-100" />

              {/* Callout */}
              <div className="flex items-center gap-3 rounded-xl bg-primary-50/50 px-4 py-3">
                <span className="text-lg">💬</span>
                <p className="text-[12px] font-medium leading-snug text-primary-700">{t("callout")}</p>
              </div>
              </div>
            </RainbowBorder>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
