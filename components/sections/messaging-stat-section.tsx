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
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return value;
}

function AnimatedStat({
  targetNum,
  suffix,
  label,
  large,
  inView,
}: {
  targetNum: number;
  suffix: string;
  label: string;
  large?: boolean;
  inView: boolean;
}) {
  const count = useCountUp(targetNum, large ? 2000 : 1400, inView);

  if (large) {
    return (
      <div className="text-center">
        <span className="font-serif text-[56px] font-normal tracking-[-0.04em] text-neutral-900 md:text-[72px] lg:text-[88px]">
          {count}
          {suffix}
        </span>
        <p className="mx-auto mt-3 max-w-sm text-[17px] leading-relaxed text-neutral-400 md:text-[19px]">{label}</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <span className="font-serif text-[32px] font-normal tracking-[-0.02em] text-neutral-900 md:text-[40px]">
        {count}
        {suffix}
      </span>
      <p className="mt-1.5 text-[13px] leading-snug text-neutral-400 md:text-[14px]">{label}</p>
    </div>
  );
}

export function MessagingStatSection() {
  const t = useTranslations("beforeAfter");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="bg-white px-6 py-20 md:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionReveal>
          <AnimatedStat
            targetNum={Number(t("bottom_stat_num"))}
            suffix={t("bottom_stat_suffix")}
            label={t("bottom_stat_label")}
            large
            inView={inView}
          />
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-8 border-t border-neutral-100 pt-10 md:mt-16 md:pt-12">
            <AnimatedStat
              targetNum={Number(t("bottom_sub1_num"))}
              suffix={t("bottom_sub1_suffix")}
              label={t("bottom_sub1_label")}
              inView={inView}
            />
            <AnimatedStat
              targetNum={Number(t("bottom_sub2_num"))}
              suffix={t("bottom_sub2_suffix")}
              label={t("bottom_sub2_label")}
              inView={inView}
            />
            <AnimatedStat
              targetNum={Number(t("bottom_sub3_num"))}
              suffix={t("bottom_sub3_suffix")}
              label={t("bottom_sub3_label")}
              inView={inView}
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
