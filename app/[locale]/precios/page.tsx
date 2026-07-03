"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const TYPEFORM_URL = "#request-access";

export default function PricingPage() {
  const t = useTranslations("pricing");

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-neutral-50 px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-4xl font-normal tracking-[-0.03em] text-neutral-700 md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-neutral-500">{t("comingSoon")}</p>
        <p className="mt-2 text-sm text-neutral-400">{t("ctaSub")}</p>
        <div className="mt-8">
          <Button variant="primary" size="lg" href={TYPEFORM_URL}>
            {t("cta")}
          </Button>
        </div>
      </div>
    </section>
  );
}
