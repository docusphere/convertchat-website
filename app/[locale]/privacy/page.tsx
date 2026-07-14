import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getLegalDoc } from "@/lib/legal";
import { LegalArticle } from "@/components/legal/legal-article";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/routes";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const doc = getLegalDoc(locale, "privacy");
  const t = await getTranslations({ locale, namespace: "legal" });
  return pageMetadata("/privacy", locale as Locale, {
    title: `${doc.title} | ConvertChat`,
    description: t("privacyMetaDescription"),
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const doc = getLegalDoc(locale, "privacy");

  return (
    <section className="bg-neutral-50 px-6 pb-24 pt-36">
      <LegalArticle doc={doc} />
    </section>
  );
}
