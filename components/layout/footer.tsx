"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-[7px] bg-primary-500" />
              <span className="font-sans text-sm font-bold text-neutral-900">ConvertChat</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-neutral-500">{t("tagline")}</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-start gap-6 text-sm text-neutral-500">
            <Link href="/precios" className="transition-colors hover:text-neutral-900">
              {t("pricing")}
            </Link>
            <Link href="/blog" className="transition-colors hover:text-neutral-900">
              {t("blog")}
            </Link>
            <Link href="/privacidad" className="transition-colors hover:text-neutral-900">
              {t("privacy")}
            </Link>
            <Link href="/terminos" className="transition-colors hover:text-neutral-900">
              {t("terms")}
            </Link>
          </div>
        </div>

        {/* Meta badge + bottom row */}
        <div className="mt-12 flex flex-col gap-6 border-t border-neutral-200 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src="/mvtp.png" alt={t("meta_partner")} className="h-12 w-auto" loading="lazy" />
          </div>
          <div className="flex flex-col gap-1 text-xs text-neutral-400 md:flex-row md:gap-4 md:text-right">
            <p>
              &copy; {year} ConvertChat. {t("rights")}
            </p>
            <p>{t("company")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
