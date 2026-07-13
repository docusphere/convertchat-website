import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";

export function PricingCosts() {
  const t = useTranslations("pricing.costs");

  return (
    <section className="bg-white px-6 pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="font-serif text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] text-neutral-900 md:text-[44px] md:leading-[1.1]">
            {t("title")}
          </h2>
        </SectionReveal>
        <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <SectionReveal key={i} delay={i * 0.05}>
              <h3 className="text-lg font-semibold text-neutral-900">{t(`c${i}Title`)}</h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-500">{t(`c${i}Body`)}</p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
