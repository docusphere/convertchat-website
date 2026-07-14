import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { pageAlternates } from "@/lib/seo";
import type { Locale } from "@/lib/routes";
import { BuyingSection } from "@/components/sections/buying-section";
import { CtaSection } from "@/components/sections/cta-section";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: pageAlternates("/product", locale as Locale) };
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <BuyingSection />
      <CtaSection />
    </>
  );
}
