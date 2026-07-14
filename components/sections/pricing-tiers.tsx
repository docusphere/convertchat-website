import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/ui/section-reveal";

const BOOKING_URL = "https://cal.com/architct/onboarding";

const TIERS = [
  { key: "starter", featureCount: 4, highlight: false },
  { key: "growth", featureCount: 5, highlight: true },
  { key: "pro", featureCount: 5, highlight: false },
] as const;

function TierCard({ tierKey, featureCount, highlight }: { tierKey: string; featureCount: number; highlight: boolean }) {
  const t = useTranslations(`pricing.tiers.${tierKey}`);
  const tp = useTranslations("pricing");

  return (
    <div
      className={`relative flex flex-col rounded-3xl p-8 ${
        highlight
          ? "rainbow-border-animated order-first md:order-none md:-translate-y-2"
          : "border border-neutral-200 bg-white"
      }`}
      style={
        highlight
          ? {
              background: "var(--rainbow-gradient)",
              backgroundSize: "200% 200%",
              animation: "rainbow-shift 12s ease-in-out infinite",
              boxShadow: "0 24px 48px -16px rgba(124, 58, 237, 0.35)",
            }
          : undefined
      }
    >
      {/* Dark tint so white text stays legible over the yellow/green stops of the gradient */}
      {highlight && <div className="absolute inset-0 rounded-3xl bg-neutral-900/25" aria-hidden />}

      {highlight && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-neutral-900 px-4 py-1 text-xs font-semibold text-white">
          {tp("popular")}
        </span>
      )}

      <div className="relative z-10 flex flex-1 flex-col">
        <h3 className={`text-lg font-semibold ${highlight ? "text-white" : "text-neutral-900"}`}>{t("name")}</h3>
        <p className={`mt-1 text-sm ${highlight ? "text-white/75" : "text-neutral-400"}`}>{t("persona")}</p>

        <div className="mt-6">
          <span className={`font-serif text-5xl tracking-[-0.03em] ${highlight ? "text-white" : "text-neutral-900"}`}>
            {t("price")}
          </span>
          <span className={`ml-1 text-sm ${highlight ? "text-white/75" : "text-neutral-400"}`}>{t("period")}</span>
        </div>

        <ul
          className={`mt-6 space-y-2 border-t pt-6 text-sm ${
            highlight ? "border-white/25 text-white/90" : "border-neutral-100 text-neutral-600"
          }`}
        >
          {[1, 2, 3].map((i) => (
            <li key={i}>
              {t.rich(`allowances.a${i}`, {
                b: (chunks) => (
                  <span className={`text-[15px] font-semibold ${highlight ? "text-white" : "text-neutral-900"}`}>
                    {chunks}
                  </span>
                ),
              })}
            </li>
          ))}
        </ul>

        <ul className={`mt-6 space-y-2.5 text-sm ${highlight ? "text-white/85" : "text-neutral-500"}`}>
          {Array.from({ length: featureCount }, (_, i) => i + 1).map((i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check
                className={`mt-0.5 h-4 w-4 shrink-0 ${highlight ? "text-white" : "text-primary-500"}`}
                strokeWidth={2.5}
              />
              {t(`features.f${i}`)}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          {highlight ? (
            // Plain anchor instead of Button: the white-on-rainbow CTA would need to fight Button's variant styles
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-xl bg-white px-7 py-3.5 font-sans text-[15px] font-semibold text-neutral-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-100"
            >
              {tp("cta")}
            </a>
          ) : (
            <Button
              variant="ghost"
              size="md"
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              {tp("cta")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function PricingTiers() {
  const t = useTranslations("pricing");

  return (
    <section className="bg-neutral-50 px-6 pb-16 pt-36 md:pb-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-500">
              {t("pill")}
            </span>
            <h1 className="mt-6 font-serif text-[42px] font-semibold leading-[1.1] tracking-[-0.03em] text-neutral-900 md:text-6xl">
              {t("title")}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 md:text-lg">{t("subtitle")}</p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-14 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-3">
            {TIERS.map((tier) => (
              <TierCard key={tier.key} tierKey={tier.key} featureCount={tier.featureCount} highlight={tier.highlight} />
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white px-8 py-6 text-center md:flex-row md:text-left">
            <p className="text-base text-neutral-600">
              <span className="font-semibold text-neutral-900">{t("enterprise.title")}</span> {t("enterprise.body")}
            </p>
            <Button variant="secondary" size="sm" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              {t("enterprise.cta")}
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
