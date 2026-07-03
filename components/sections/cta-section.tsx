"use client";

import { useTranslations } from "next-intl";
import { MeshGradient } from "@paper-design/shaders-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Overline } from "@/components/ui/overline";

const WHATSAPP_URL = "#request-access";

export function CtaSection() {
  const t = useTranslations("ctaSection");

  return (
    <section className="relative overflow-hidden px-6 py-28 md:py-36">
      {/* Purple gradient background — matches hero */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 20%, #a78bfa 40%, #7dd3fc 60%, #c4b5fd 80%, #e9d5ff 100%)",
        }}
      />

      {/* Subtle MeshGradient glow */}
      <div className="absolute left-0 top-0 h-full w-[55%] opacity-30 blur-[40px]">
        <MeshGradient
          colors={["#c084fc", "#e879f9", "#7dd3fc", "#a78bfa", "#f0abfc"]}
          speed={0.2}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {/* Halftone dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)",
          backgroundSize: "7px 7px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <SectionReveal>
          <Overline className="text-white/60">{t("label")}</Overline>
          <h2 className="mt-4 font-serif text-3xl font-normal tracking-[-0.02em] text-white md:text-[44px] md:leading-[1.1]">
            {t("title")}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">{t("subtitle")}</p>
          <div className="mt-10">
            <Button
              variant="secondary"
              size="lg"
              href={WHATSAPP_URL}
              style={{ background: "#ffffff", color: "#171717" }}
            >
              {t("cta")}
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
