"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Overline } from "@/components/ui/overline";
import { Button } from "@/components/ui/button";
import { GrainHeroBg } from "./grain-hero-bg";

const WHATSAPP_URL = "#request-access";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <GrainHeroBg />

      {/* Content — two-column grid: text left, 3D object right */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 md:px-12 lg:px-16">
        <div className="grid items-center lg:grid-cols-2">
          {/* Left column — text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Overline className="text-white/60">{t("overline")}</Overline>
            </motion.div>

            <motion.h1
              className="mt-6 font-serif text-5xl font-normal tracking-[-0.03em] text-white md:text-7xl lg:text-[80px] lg:leading-[0.95] lg:tracking-[-0.04em]"
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
                href={WHATSAPP_URL}
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
          </div>

          {/* Right column — reserved for 3D object */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
