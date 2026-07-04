"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";
import { RainbowBorder } from "@/components/ui/rainbow-border";

const CASES = [
  { company: "case1_company", type: "case1_type", result: "case1_result" },
  { company: "case2_company", type: "case2_type", result: "case2_result" },
  { company: "case3_company", type: "case3_type", result: "case3_result" },
  { company: "case4_company", type: "case4_type", result: "case4_result" },
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
          {CASES.map(({ company, type, result }, index) => (
            <SectionReveal key={company} delay={0.1 + index * 0.08}>
              <RainbowBorder borderRadius="18px" padding="3px">
                <article className="rounded-[15px] bg-white p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 font-serif text-sm font-medium text-neutral-700">
                      {t(company).charAt(0)}
                    </div>
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
