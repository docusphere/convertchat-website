import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/routes";
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

  return (
    <>
      <PricingTiers />
      <PricingAiAddon />
      <PricingCosts />
      <PricingFaq />
      <CtaSection />
    </>
  );
}
