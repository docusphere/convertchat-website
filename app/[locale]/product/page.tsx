import { setRequestLocale } from "next-intl/server";
import { BuyingSection } from "@/components/sections/buying-section";
import { CtaSection } from "@/components/sections/cta-section";

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
