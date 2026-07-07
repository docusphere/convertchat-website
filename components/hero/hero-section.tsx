"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GrainHeroBg } from "./grain-hero-bg";
import { HeroPhone } from "./hero-phone";

const BOOKING_URL = "https://cal.com/architct/onboarding";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24 md:pt-0">
      <GrainHeroBg />

      {/* Content — two-column grid: text left, 3D object right */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 md:px-12 lg:px-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column — text content */}
          <div>
            <motion.h1
              className="font-serif text-4xl font-normal tracking-[-0.03em] text-white sm:text-5xl md:text-7xl lg:text-[80px] lg:leading-[0.95] lg:tracking-[-0.04em]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              {t("title_line1")}
              <br />
              <span className="text-white">{t("title_line2")}</span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-lg text-lg text-white/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {t("subtitle")}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
            >
              <Button
                variant="secondary"
                size="lg"
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: "#ffffff", color: "#171717" }}
              >
                {t("cta_primary")}
              </Button>
              <Button variant="glass" size="lg" href="#how-it-works">
                {t("cta_secondary")}
              </Button>
            </motion.div>

            <motion.p
              className="mt-6 text-sm text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {t("note")}
            </motion.p>

            <motion.div
              className="mt-4 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.95 }}
            >
              <img src="/meta-partner-white.png" alt={t("meta_partner")} className="h-12 w-auto opacity-70 md:h-14" />
            </motion.div>
          </div>

          {/* Right column — phone mockup */}
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <HeroPhone />
          </div>
        </div>
      </div>
    </section>
  );
}
