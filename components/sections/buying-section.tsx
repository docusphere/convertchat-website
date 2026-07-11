"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";

export function BuyingSection() {
  const t = useTranslations("buying");

  return (
    <section className="bg-white px-6 py-16 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="max-w-3xl font-serif text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] text-neutral-900 md:text-[44px] md:leading-[1.1]">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">{t("lead")}</p>
        </SectionReveal>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {/* What you get */}
          <SectionReveal delay={0.1}>
            <div>
              <h3 className="mb-8 text-xs font-semibold uppercase tracking-[0.12em] text-primary-600">What you get</h3>
              <div className="space-y-6">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                  <h4 className="font-serif text-lg font-medium text-neutral-900">{t("get1_title")}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">{t("get1_desc")}</p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                  <h4 className="font-serif text-lg font-medium text-neutral-900">{t("get2_title")}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">{t("get2_desc")}</p>
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* What you don't spend */}
          <SectionReveal delay={0.2}>
            <div>
              <h3 className="mb-8 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                What you don&apos;t spend
              </h3>
              <div className="space-y-6">
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-6">
                  <h4 className="font-serif text-lg font-medium text-neutral-700">{t("dont1_title")}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{t("dont1_desc")}</p>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-6">
                  <h4 className="font-serif text-lg font-medium text-neutral-700">{t("dont2_title")}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{t("dont2_desc")}</p>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
