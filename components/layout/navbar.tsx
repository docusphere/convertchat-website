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
    const check = () => setScrolled(window.scrollY > 20);
    check(); // Check on mount for restored scroll position
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  const navLinks = [
    { href: "#problem", label: t("problem") },
    { href: "#how-it-works", label: t("howItWorks") },
    { href: "/precios" as const, label: t("pricing") },
    { href: "/blog" as const, label: t("blog") },
  ];

  return (
    <nav className="fixed left-4 right-4 top-4 z-50 mx-auto max-w-6xl">
      <div
        className={`flex items-center gap-2 rounded-2xl px-7 py-3.5 pr-3.5 backdrop-blur-[20px] transition-all duration-300 ${
          scrolled
            ? "border border-neutral-200/80 bg-white/85 shadow-sm"
            : "border border-white/[0.10] bg-white/[0.06]"
        }`}
      >
        <Link href="/" className="mr-6 flex shrink-0 items-center">
          {/* Full logo (unscrolled) → icon only (scrolled) */}
          <img
            src="/logo-full-white.png"
            alt="ConvertChat"
            className={`h-8 w-auto transition-all duration-300 ${
              scrolled ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100"
            }`}
          />
          <img
            src="/logo-icon-color.png"
            alt="ConvertChat"
            className={`h-8 w-auto transition-all duration-300 ${
              scrolled ? "max-w-[32px] opacity-100" : "max-w-0 opacity-0"
            }`}
          />
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {navLinks.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 font-sans text-[15px] transition-colors ${
                  scrolled ? "text-neutral-500 hover:text-neutral-900" : "text-white/55 hover:text-white/80"
                }`}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href as "/precios" | "/blog"}
                className={`px-3.5 py-2 font-sans text-[15px] transition-colors ${
                  scrolled ? "text-neutral-500 hover:text-neutral-900" : "text-white/55 hover:text-white/80"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <Button
            variant={scrolled ? "ghost" : "glass"}
            size="md"
            href="https://app.convertchat.co"
          >
            {t("login")}
          </Button>
          <Button variant="primary" size="md" href={WHATSAPP_URL}>
            {t("cta")}
          </Button>
        </div>
      </div>
    </nav>
  );
}
