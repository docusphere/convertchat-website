"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const BOOKING_URL = "https://cal.com/architct/onboarding";

const LOCALE_LABELS = { en: "English", es: "Español" } as const;
type Locale = keyof typeof LOCALE_LABELS;

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

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocaleSwitcher({
  scrolled,
  variant,
  onNavigate,
}: {
  scrolled: boolean;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const switchTo = (next: Locale) => {
    setOpen(false);
    onNavigate?.();
    if (next === locale) return;
    // @ts-expect-error -- params type is route-specific; next-intl maps localized pathnames at runtime
    router.replace({ pathname, params }, { locale: next });
  };

  if (variant === "mobile") {
    return (
      <div className="mt-2 flex items-center justify-between border-t border-neutral-200/60 pt-3">
        <span className="font-sans text-[15px] text-neutral-600">{t("language")}</span>
        <div className="flex items-center gap-1">
          {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => switchTo(l)}
              className={`px-2.5 py-1.5 font-sans text-[15px] transition-colors ${
                l === locale ? "font-medium text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={t("language")}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center gap-1 px-2.5 py-2 font-sans text-[15px] transition-colors ${
          scrolled ? "text-neutral-500 hover:text-neutral-900" : "text-white/55 hover:text-white/80"
        }`}
      >
        {locale.toUpperCase()}
        <ChevronIcon className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`absolute right-0 top-full mt-2 w-40 rounded-xl border border-neutral-200/80 bg-white/95 py-1.5 shadow-lg backdrop-blur-[20px] transition-all duration-200 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
        role="listbox"
      >
        {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => (
          <button
            key={l}
            onClick={() => switchTo(l)}
            role="option"
            aria-selected={l === locale}
            className={`flex w-full items-center justify-between px-4 py-2 text-left font-sans text-[15px] transition-colors ${
              l === locale ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {LOCALE_LABELS[l]}
            {l === locale && <CheckIcon className="text-neutral-900" />}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  // Transparent white-text navbar only works over the homepage's dark hero;
  // every other page has a light background, so force the solid style there.
  const solid = scrolled || pathname !== "/";

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

  // Section anchors live on the homepage — plain <a> with a locale-aware absolute
  // href ("/#problem" / "/es#problem") so they work from any page. Bare "#problem"
  // resolved against the current page and went nowhere off-home; Next's <Link>
  // mangles same-page hash changes (/es#problem#how-it-works), so native anchors it is.
  const homeHref = locale === "en" ? "/" : `/${locale}`;
  const navLinks = [
    { key: "problem", anchor: `${homeHref}#problem`, label: t("problem") },
    { key: "how-it-works", anchor: `${homeHref}#how-it-works`, label: t("howItWorks") },
    { key: "pricing", href: "/pricing" as const, label: t("pricing") },
    { key: "blog", href: "/blog" as const, label: t("blog") },
  ] as const;

  return (
    <nav className="fixed left-4 right-4 top-4 z-50 mx-auto max-w-6xl">
      <div
        className={`flex items-center gap-2 rounded-2xl px-5 py-3 pr-3 backdrop-blur-[20px] transition-all duration-300 md:px-7 md:py-3.5 md:pr-3.5 ${
          solid || mobileOpen
            ? "border border-neutral-200/80 bg-white/85 shadow-sm"
            : "border border-white/[0.10] bg-white/[0.06]"
        }`}
      >
        <Link
          href="/"
          className="mr-auto flex shrink-0 items-center lg:mr-6"
          onClick={(e) => {
            // Already on the homepage — smooth-scroll to the hero instead of re-navigating
            if (pathname === "/") {
              e.preventDefault();
              setMobileOpen(false);
              // No explicit behavior — inherits CSS scroll-behavior (smooth, respects reduced motion)
              window.scrollTo({ top: 0 });
            }
          }}
        >
          <img
            src={pathname === "/" ? "/logo-full-white.png" : "/logo-full-color.png"}
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
        <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const className = `whitespace-nowrap px-3.5 py-2 font-sans text-[15px] transition-colors ${
              solid ? "text-neutral-500 hover:text-neutral-900" : "text-white/55 hover:text-white/80"
            }`;
            return "anchor" in link ? (
              <a key={link.key} href={link.anchor} className={className}>
                {link.label}
              </a>
            ) : (
              <Link key={link.key} href={link.href} className={className}>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <LocaleSwitcher scrolled={solid} variant="desktop" />
          <Button variant="primary" size="md" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
            {t("cta")}
          </Button>
        </div>

        {/* Mobile CTA + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button variant="primary" size="sm" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
            {t("cta")}
          </Button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              solid || mobileOpen ? "text-neutral-600 hover:bg-neutral-100" : "text-white/70 hover:bg-white/10"
            }`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`mt-2 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/95 backdrop-blur-[20px] transition-all duration-300 lg:hidden ${
          mobileOpen ? "max-h-96 opacity-100 shadow-lg" : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <div className="flex flex-col px-5 py-4">
          {navLinks.map((link) =>
            "anchor" in link ? (
              <a
                key={link.key}
                href={link.anchor}
                onClick={() => setMobileOpen(false)}
                className="py-3 font-sans text-[15px] text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 font-sans text-[15px] text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </Link>
            ),
          )}
          <LocaleSwitcher scrolled={solid} variant="mobile" onNavigate={() => setMobileOpen(false)} />
        </div>
      </div>
    </nav>
  );
}
