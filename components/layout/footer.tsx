"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden px-6 py-16">
      {/* Purple gradient background — matches hero */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 20%, #a78bfa 40%, #7dd3fc 60%, #c4b5fd 80%, #e9d5ff 100%)",
        }}
      />

      {/* Halftone dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)",
          backgroundSize: "7px 7px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-[7px] bg-white" />
              <span className="font-sans text-sm font-bold text-white">ConvertChat</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-white/50">{t("tagline")}</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-start gap-6 text-sm text-white/50">
            <Link href="/precios" className="transition-colors hover:text-white">
              {t("pricing")}
            </Link>
            <Link href="/blog" className="transition-colors hover:text-white">
              {t("blog")}
            </Link>
            <Link href="/privacidad" className="transition-colors hover:text-white">
              {t("privacy")}
            </Link>
            <Link href="/terminos" className="transition-colors hover:text-white">
              {t("terms")}
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/20 pt-8 text-xs text-white/40 md:flex-row md:justify-between">
          <p>
            &copy; {year} ConvertChat. {t("rights")}
          </p>
          <p>{t("company")}</p>
        </div>
      </div>
    </footer>
  );
}
