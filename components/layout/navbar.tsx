"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const BOOKING_URL = "https://cal.com/architct/onboarding";

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 20);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    if (!mobileOpen) return;
    const close = () => setMobileOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [mobileOpen]);

  const navLinks = [
    { href: "#problem", label: t("problem") },
    { href: "#how-it-works", label: t("howItWorks") },
    { href: "/precios" as const, label: t("pricing") },
    { href: "/blog" as const, label: t("blog") },
  ];

  return (
    <nav className="fixed left-4 right-4 top-4 z-50 mx-auto max-w-6xl">
      <div
        className={`flex items-center gap-2 rounded-2xl px-5 py-3 pr-3 backdrop-blur-[20px] transition-all duration-300 md:px-7 md:py-3.5 md:pr-3.5 ${
          scrolled || mobileOpen
            ? "border border-neutral-200/80 bg-white/85 shadow-sm"
            : "border border-white/[0.10] bg-white/[0.06]"
        }`}
      >
        <Link href="/" className="mr-auto flex shrink-0 items-center md:mr-6">
          <img
            src="/logo-full-white.png"
            alt="ConvertChat"
            className={`h-7 w-auto transition-all duration-300 md:h-8 ${
              scrolled || mobileOpen ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100 md:max-w-[180px]"
            }`}
          />
          <img
            src="/logo-icon-color.png"
            alt="ConvertChat"
            className={`h-7 w-auto transition-all duration-300 md:h-8 ${
              scrolled || mobileOpen ? "max-w-[28px] opacity-100 md:max-w-[32px]" : "max-w-0 opacity-0"
            }`}
          />
        </Link>

        {/* Desktop nav links */}
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

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2.5 md:flex">
          <Button variant="primary" size="md" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
            {t("cta")}
          </Button>
        </div>

        {/* Mobile CTA + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="primary" size="sm" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
            {t("cta")}
          </Button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              scrolled || mobileOpen ? "text-neutral-600 hover:bg-neutral-100" : "text-white/70 hover:bg-white/10"
            }`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`mt-2 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/95 backdrop-blur-[20px] transition-all duration-300 md:hidden ${
          mobileOpen ? "max-h-80 opacity-100 shadow-lg" : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <div className="flex flex-col px-5 py-4">
          {navLinks.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 font-sans text-[15px] text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href as "/precios" | "/blog"}
                onClick={() => setMobileOpen(false)}
                className="py-3 font-sans text-[15px] text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </nav>
  );
}
