"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GdprBadge } from "@/components/ui/gdpr-badge";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-10 text-center md:flex-row md:items-start md:justify-between md:text-left">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start">
            <img src="/logo-full-color.png" alt="ConvertChat" className="h-8 w-auto md:-ml-1" />
            <p className="mt-3 max-w-xs text-sm text-neutral-500">{t("tagline")}</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-start justify-center gap-6 text-sm text-neutral-500">
            <Link href="/pricing" className="transition-colors hover:text-neutral-900">
              {t("pricing")}
            </Link>
            <Link href="/blog" className="transition-colors hover:text-neutral-900">
              {t("blog")}
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-neutral-900">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-neutral-900">
              {t("terms")}
            </Link>
          </div>
        </div>

        {/* Meta badge + bottom row */}
        <div className="mt-12 flex flex-col items-center gap-6 border-t border-neutral-200 pt-8 md:flex-row md:justify-between">
          <div className="flex items-center justify-center gap-5">
            <img src="/mvtp.png" alt={t("meta_partner")} className="h-16 w-auto" loading="lazy" />
            <div className="h-10 w-px bg-neutral-200" />
            <GdprBadge acronym={t("gdpr_acronym")} label={t("gdpr_label")} className="text-neutral-700" />
          </div>
          <div className="flex flex-col gap-1 text-center text-xs text-neutral-400 md:flex-row md:gap-4 md:text-right">
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
