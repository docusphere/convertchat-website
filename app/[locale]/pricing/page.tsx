import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/routes";
import { JsonLd } from "@/components/seo/json-ld";
import { faqPageSchema } from "@/lib/schema";
import { PricingTiers } from "@/components/sections/pricing-tiers";
import { PricingAiAddon } from "@/components/sections/pricing-ai-addon";
import { PricingCosts } from "@/components/sections/pricing-costs";
import { PricingFaq } from "@/components/sections/pricing-faq";
import { CtaSection } from "@/components/sections/cta-section";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return pageMetadata("/pricing", locale as Locale, { title: t("metaTitle"), description: t("metaDescription") });
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "pricing.faq" });
  const faqItems = ([1, 2, 3, 4, 5, 6] as const).map((i) => ({ question: t(`q${i}`), answer: t(`a${i}`) }));

  return (
    <>
      <JsonLd data={faqPageSchema(faqItems)} />
      <PricingTiers />
      <PricingAiAddon />
      <PricingCosts />
      <PricingFaq />
      <CtaSection />
    </>
  );
}
