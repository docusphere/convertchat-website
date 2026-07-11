"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useInView } from "framer-motion";
import { SectionReveal } from "@/components/ui/section-reveal";

function useCountUp(target: number, duration = 1800, inView: boolean) {
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return value;
}

function SubStat({ num, suffix, label }: { num: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const count = useCountUp(num, 1400, inView);

  return (
    <div ref={ref} className="text-center">
      <span className="text-[32px] tracking-[-0.03em] text-white md:text-[40px]" style={{ fontFamily: "var(--font-clash-display)", fontWeight: 600 }}>
        {count}
        {suffix}
      </span>
      <p className="mt-2 text-[14px] leading-snug text-white/60 md:text-[16px]">{label}</p>
    </div>
  );
}

export function MessagingStatSection() {
  const t = useTranslations("beforeAfter");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const heroCount = useCountUp(Number(t("bottom_stat_num")), 2000, inView);

  const subStats = [
    { num: Number(t("bottom_sub1_num")), suffix: t("bottom_sub1_suffix"), label: t("bottom_sub1_label") },
    { num: Number(t("bottom_sub2_num")), suffix: t("bottom_sub2_suffix"), label: t("bottom_sub2_label") },
    { num: Number(t("bottom_sub3_num")), suffix: t("bottom_sub3_suffix"), label: t("bottom_sub3_label") },
  ];

  return (
    <section ref={ref} className="bg-white px-6 py-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl bg-neutral-900 px-8 py-16 md:px-14 md:py-24">
          {/* Headline */}
          <SectionReveal>
            <h2 className="mx-auto max-w-xl text-center font-serif text-[34px] font-semibold leading-[1.2] tracking-[-0.02em] text-white md:text-[44px] md:leading-[1.1]">
              {t("callout").split(".").map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>{part}<span className="text-green-500">.</span></span>
                ) : part ? (
                  <span key={i}>{part}<span className="text-green-500">.</span></span>
                ) : null
              )}
            </h2>
          </SectionReveal>

          {/* Hero stat */}
          <SectionReveal delay={0.1}>
            <div className="mt-10 text-center">
              <span
                className="bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 bg-clip-text text-[56px] tracking-[-0.04em] text-transparent md:text-[72px] lg:text-[88px]"
                style={{ fontFamily: "var(--font-clash-display)", fontWeight: 600 }}
              >
                {heroCount}
                {t("bottom_stat_suffix")}
              </span>
              <p className="mt-3 text-[17px] text-white/60 md:text-[20px]">{t("bottom_stat_label")}</p>
            </div>
          </SectionReveal>

          {/* Sub-stats row */}
          <SectionReveal delay={0.2}>
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-4">
              {subStats.map((stat, i) => (
                <div key={i} className={i > 0 ? "border-l border-white/10" : ""}>
                  <SubStat num={stat.num} suffix={stat.suffix} label={stat.label} />
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
