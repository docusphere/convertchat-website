"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/section-reveal";

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
    <section className="bg-white px-6 py-16 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-16 md:px-14 md:py-20">
          {/* Subtle purple glow */}
          <div
            className="pointer-events-none absolute -right-1/4 -top-1/4 h-3/4 w-3/4 rounded-full opacity-[0.07] blur-[80px]"
            style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
            aria-hidden
          />

          <div className="relative z-10 grid items-center gap-16 md:grid-cols-2 md:gap-12 lg:gap-20">
          {/* Left column — text */}
          <div>
            <SectionReveal>
              <span className="inline-block rounded-full border border-primary-500/20 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-400">
                {t("badge")}
              </span>

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

          {/* Right column — nighttime chat visual */}
          <SectionReveal delay={0.15} className="w-full">
            <div aria-hidden="true" className="relative overflow-hidden rounded-2xl bg-neutral-950 p-5 md:p-6">
              {/* Moon/stars nighttime aesthetic */}
              <div className="pointer-events-none absolute right-4 top-4 text-2xl opacity-60">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#fbbf24" opacity="0.8" />
                </svg>
              </div>
              <div className="pointer-events-none absolute right-14 top-3 h-1 w-1 rounded-full bg-yellow-300/40" />
              <div className="pointer-events-none absolute right-10 top-8 h-0.5 w-0.5 rounded-full bg-yellow-300/30" />
              <div className="pointer-events-none absolute right-20 top-6 h-0.5 w-0.5 rounded-full bg-yellow-300/25" />

              {/* Chat bubbles */}
              <div className="space-y-3">
                {/* Customer message */}
                <div className="flex justify-start">
                  <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-neutral-800 px-4 py-2.5">
                    <p className="text-sm text-white/90">Do you have this in size M?</p>
                    <p className="mt-1 text-right text-[10px] text-white/30">3:40 AM</p>
                  </div>
                </div>

                {/* Brand (ConvertChat) reply */}
                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary-600 px-4 py-2.5">
                    <p className="text-sm text-white">Yes! Only 2 left. Here&apos;s your checkout link</p>
                    <div className="mt-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2">
                      <p className="text-xs text-white/70">checkout.store.com/size-m</p>
                    </div>
                    <p className="mt-1 text-right text-[10px] text-white/50">3:41 AM</p>
                  </div>
                </div>

                {/* Customer reply */}
                <div className="flex justify-start">
                  <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-neutral-800 px-4 py-2.5">
                    <p className="text-sm text-white/90">Just ordered! 🎉</p>
                    <p className="mt-1 text-right text-[10px] text-white/30">3:42 AM</p>
                  </div>
                </div>
              </div>

              {/* Subtle "3:42 AM" label at bottom */}
              <p className="mt-4 text-center text-xs text-white/20">Sale closed at 3:42 AM</p>
            </div>
          </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
