import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { pageAlternates } from "@/lib/seo";
import type { Locale } from "@/lib/routes";
import { PricingTiers } from "@/components/sections/pricing-tiers";
import { PricingAiAddon } from "@/components/sections/pricing-ai-addon";
import { PricingCosts } from "@/components/sections/pricing-costs";
import { PricingFaq } from "@/components/sections/pricing-faq";
import { CtaSection } from "@/components/sections/cta-section";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return { title: t("metaTitle"), alternates: pageAlternates("/pricing", locale as Locale) };
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
