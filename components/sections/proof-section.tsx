"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Overline } from "@/components/ui/overline";

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
          <Overline className="text-primary-600/60">{t("label")}</Overline>
          <h2 className="mt-4 font-serif text-3xl font-normal tracking-[-0.02em] text-neutral-900 md:text-[44px] md:leading-[1.1]">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">{t("lead")}</p>
        </SectionReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {CASES.map(({ company, type, result }, index) => (
            <SectionReveal key={company} delay={0.1 + index * 0.08}>
              <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 md:p-8">
                <p className="font-serif text-lg font-medium text-neutral-900">{t(company)}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-neutral-400">{t(type)}</p>
                <div className="my-4 h-px bg-neutral-200" role="separator" />
                <p className="text-sm leading-relaxed text-neutral-600">{t(result)}</p>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
