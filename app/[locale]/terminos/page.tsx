import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getLegalDoc } from "@/lib/legal";
import { LegalArticle } from "@/components/legal/legal-article";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const doc = getLegalDoc(locale, "terms");
  return { title: `${doc.title} | ConvertChat` };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const doc = getLegalDoc(locale, "terms");

  return (
    <section className="bg-neutral-50 px-6 pb-24 pt-36">
      <LegalArticle doc={doc} />
    </section>
  );
}
