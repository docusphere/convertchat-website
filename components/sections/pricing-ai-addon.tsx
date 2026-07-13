import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";

export function PricingAiAddon() {
  const t = useTranslations("pricing.aiAddon");

  return (
    <section className="bg-white px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-12 md:px-14 md:py-16">
            <div
              className="pointer-events-none absolute -right-1/4 -top-1/2 h-full w-3/4 rounded-full opacity-[0.07] blur-[80px]"
              style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
              aria-hidden
            />
            <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-xl">
                <h2 className="font-serif text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-[36px]">
                  {t("title")}
                </h2>
                <p className="mt-3 text-base text-white/50">{t("body")}</p>
              </div>
              <div className="shrink-0 md:text-right">
                <div className="font-serif text-4xl tracking-[-0.03em] text-white md:text-5xl">
                  {t("price")}
                  <span className="ml-1 font-sans text-base text-white/50">{t("period")}</span>
                </div>
                <p className="mt-2 text-sm text-white/50">{t("note")}</p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
