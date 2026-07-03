import { setRequestLocale } from "next-intl/server";

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="bg-neutral-50 px-6 py-24">
      <div className="prose mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl font-normal tracking-[-0.03em] text-neutral-700">
          {locale === "es" ? "Términos de Servicio" : "Terms of Service"}
        </h1>
        <p className="text-neutral-500">{locale === "es" ? "Contenido próximo." : "Content coming soon."}</p>
      </div>
    </section>
  );
}
