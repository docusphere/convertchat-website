"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";
import { RainbowBorder } from "@/components/ui/rainbow-border";

const CASES = [
  { company: "case1_company", type: "case1_type", result: "case1_result", logo: "/logos/smilodox.png" },
  { company: "case2_company", type: "case2_type", result: "case2_result", logo: "/logos/tata-cliq.png" },
  { company: "case3_company", type: "case3_type", result: "case3_result", logo: "/logos/bgc-wholesale.png" },
  { company: "case4_company", type: "case4_type", result: "case4_result", logo: "/logos/unilever.png" },
] as const;

export function ProofSection() {
  const t = useTranslations("proof");

  return (
    <section className="bg-white px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="font-serif text-3xl font-normal tracking-[-0.02em] text-neutral-900 md:text-[44px] md:leading-[1.1]">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">{t("lead")}</p>
        </SectionReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {CASES.map(({ company, type, result, logo }, index) => (
            <SectionReveal key={company} delay={0.1 + index * 0.08} className="h-full">
              <RainbowBorder borderRadius="18px" padding="3px" className="h-full">
                <article className="flex h-full flex-col rounded-[15px] bg-white p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt={t(company)} className="h-7 w-auto shrink-0" loading="lazy" />
                    <div>
                      <p className="font-serif text-lg font-medium text-neutral-900">{t(company)}</p>
                      <p className="text-xs uppercase tracking-wide text-neutral-400">{t(type)}</p>
                    </div>
                  </div>
                  <div className="my-4 h-px bg-neutral-200" role="separator" />
                  <p className="text-sm leading-relaxed text-neutral-600">{t(result)}</p>
                </article>
              </RainbowBorder>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
