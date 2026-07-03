"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Overline } from "@/components/ui/overline";

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0"
    >
      <circle cx="9" cy="9" r="9" fill="#22c55e" fillOpacity="0.15" />
      <path
        d="M5.5 9.25l2.5 2.5 4.5-5"
        stroke="#22c55e"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const BULLET_KEYS = ["bullet1", "bullet2", "bullet3", "bullet4"] as const;

export function AiAgentSection() {
  const t = useTranslations("aiAgent");

  return (
    <section className="bg-neutral-900 px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-16 md:grid-cols-2 md:gap-12 lg:gap-20">
          {/* Left column — text */}
          <div>
            <SectionReveal>
              <div className="flex flex-wrap items-center gap-3">
                <Overline className="text-primary-400/60">{t("label")}</Overline>
                <span className="inline-block rounded-full border border-primary-500/20 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-400">
                  {t("badge")}
                </span>
              </div>

              <h2 className="mt-5 max-w-lg font-serif text-3xl font-normal tracking-[-0.02em] text-white md:text-[44px] md:leading-[1.1]">
                {t("title")}
              </h2>

              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">{t("lead")}</p>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              <ul className="mt-10 space-y-4" role="list">
                {BULLET_KEYS.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-base leading-relaxed text-white/80">{t(key)}</span>
                  </li>
                ))}
              </ul>
            </SectionReveal>
          </div>

          {/* Right column — visual placeholder */}
          <SectionReveal delay={0.15} className="w-full">
            <div
              aria-hidden="true"
              className="flex h-80 w-full items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm md:h-96"
            >
              <span className="text-sm text-white/30">AI Agent Preview</span>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
