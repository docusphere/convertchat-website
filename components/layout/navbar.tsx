"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const WHATSAPP_URL = "#request-access";

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#problem", label: t("problem") },
    { href: "#how-it-works", label: t("howItWorks") },
    { href: "/precios" as const, label: t("pricing") },
    { href: "/blog" as const, label: t("blog") },
  ];

  return (
    <nav className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
      <div
        className={`flex items-center gap-1 rounded-full border border-white/[0.10] px-7 py-2 pr-2 backdrop-blur-[20px] transition-all duration-300 ${
          scrolled ? "bg-neutral-900/80 border-white/[0.15]" : "bg-white/[0.06]"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="h-6 w-6 rounded-[7px] bg-primary-500" />
          <span className="text-sm font-bold text-white font-sans">ConvertChat</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm font-sans transition-colors text-white/55 hover:text-white/80"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href as "/precios" | "/blog"}
                className="px-3 py-1.5 text-sm font-sans transition-colors text-white/55 hover:text-white/80"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button variant="glass" size="sm" href="https://app.convertchat.co">
            {t("login")}
          </Button>
          <Button variant="primary" size="sm" href={WHATSAPP_URL}>
            {t("cta")}
          </Button>
        </div>
      </div>
    </nav>
  );
}
