import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/routes";
import { BuyingSection } from "@/components/sections/buying-section";
import { CtaSection } from "@/components/sections/cta-section";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "product" });
  return pageMetadata("/product", locale as Locale, { title: t("metaTitle"), description: t("metaDescription") });
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
