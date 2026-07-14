import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/routes";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, webSiteSchema, faqPageSchema } from "@/lib/schema";
import { HeroSection } from "@/components/hero/hero-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { BeforeAfterSection } from "@/components/sections/before-after-section";
import { MessagingStatSection } from "@/components/sections/messaging-stat-section";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PlatformSection } from "@/components/sections/platform-section";
import { AiAgentSection } from "@/components/sections/ai-agent-section";
import { IndustriesSection } from "@/components/sections/industries-section";
import { ProofSection } from "@/components/sections/proof-section";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return pageMetadata("/", locale as Locale, { title: t("title"), description: t("description") });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "faq" });
  const faqItems = ([1, 2, 3, 4, 5, 6] as const).map((i) => ({ question: t(`q${i}`), answer: t(`a${i}`) }));

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={webSiteSchema(locale as Locale)} />
      <JsonLd data={faqPageSchema(faqItems)} />
      <HeroSection />
      <ProblemSection />
      <BeforeAfterSection />
      <MessagingStatSection />
      <HowItWorks />
      <PlatformSection />
      <AiAgentSection />
      <IndustriesSection />
      <ProofSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
