"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Button } from "@/components/ui/button";

const WHATSAPP_URL = "#request-access";

function CheckIcon({ variant }: { variant: "before" | "after" }) {
  const bg = variant === "before" ? "#171717" : "#ffffff";
  const check = variant === "before" ? "#ffffff" : "#16a34a";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <rect width="24" height="24" rx="6" fill={bg} />
      <path d="M7 12.5l3 3 7-7" stroke={check} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BeforeCard() {
  const t = useTranslations("beforeAfter");
  const items = [t("before_1"), t("before_2"), t("before_3"), t("before_4")];

  return (
    <div className="flex h-full flex-col rounded-[24px] bg-neutral-100 p-8 md:p-10">
      <p className="text-center text-sm font-semibold tracking-wide text-neutral-500">{t("before_label")}</p>
      <h3 className="mt-4 whitespace-pre-line text-center font-serif text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-neutral-900 md:text-[48px]">
        {t("before_title")}
      </h3>

      <div className="mt-auto pt-12">
        <ul className="space-y-0">
          {items.map((item, i) => (
            <li key={i}>
              {i > 0 && <div className="h-px bg-neutral-200" />}
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.06em] text-neutral-700">{item}</span>
                <CheckIcon variant="before" />
              </div>
            </li>
          ))}
        </ul>

        <Button variant="secondary" size="lg" href={WHATSAPP_URL} className="mt-6 w-full">
          {t("cta")}
        </Button>
      </div>
    </div>
  );
}

function AfterCard() {
  const t = useTranslations("beforeAfter");
  const items = [t("after_1"), t("after_2"), t("after_3"), t("after_4")];

  return (
    <div className="flex h-full flex-col rounded-[24px] bg-primary-500 p-8 md:p-10">
      <p className="text-center text-sm font-semibold tracking-wide text-white/70">{t("after_label")}</p>
      <h3 className="mt-4 whitespace-pre-line text-center font-serif text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-white md:text-[48px]">
        {t("after_title")}
      </h3>

      <div className="mt-auto pt-12">
        <ul className="space-y-0">
          {items.map((item, i) => (
            <li key={i}>
              {i > 0 && <div className="h-px bg-white/20" />}
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.06em] text-white">{item}</span>
                <CheckIcon variant="after" />
              </div>
            </li>
          ))}
        </ul>

        <Button
          variant="ghost"
          size="lg"
          href={WHATSAPP_URL}
          className="mt-6 w-full"
          style={{ background: "#ffffff", color: "#171717", borderColor: "#ffffff" }}
        >
          {t("cta")}
        </Button>
      </div>
    </div>
  );
}

export function BeforeAfterSection() {
  return (
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <SectionReveal>
          <BeforeCard />
        </SectionReveal>
        <SectionReveal delay={0.1}>
          <AfterCard />
        </SectionReveal>
      </div>
    </section>
  );
}
