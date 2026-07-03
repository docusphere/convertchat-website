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
        className={`flex items-center gap-1 rounded-2xl px-7 py-2.5 pr-2.5 backdrop-blur-[20px] transition-all duration-300 ${
          scrolled
            ? "border border-neutral-200/80 bg-white/85 shadow-sm"
            : "border border-white/[0.10] bg-white/[0.06]"
        }`}
      >
        <Link href="/" className="mr-6 flex items-center gap-2">
          <div className="h-6 w-6 shrink-0 rounded-[7px] bg-primary-500" />
          <span
            className={`overflow-hidden whitespace-nowrap font-sans text-sm font-bold transition-all duration-300 ${
              scrolled ? "max-w-0 opacity-0" : "max-w-[120px] opacity-100"
            }`}
            style={{ color: scrolled ? "var(--neutral-900)" : "white" }}
          >
            ConvertChat
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 font-sans text-sm transition-colors ${
                  scrolled ? "text-neutral-500 hover:text-neutral-900" : "text-white/55 hover:text-white/80"
                }`}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href as "/precios" | "/blog"}
                className={`px-3 py-1.5 font-sans text-sm transition-colors ${
                  scrolled ? "text-neutral-500 hover:text-neutral-900" : "text-white/55 hover:text-white/80"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={scrolled ? "ghost" : "glass"}
            size="sm"
            href="https://app.convertchat.co"
          >
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
