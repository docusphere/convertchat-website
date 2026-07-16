import type { Metadata } from "next";
import { BASE_URL, localizedUrl, locales, type Locale, type RouteKey } from "./routes";
import { getTranslatedSlug } from "./blog-slugs";

// Canonical + hreflang alternates for a static page. x-default points at
// English (the unprefixed default locale).
export function pageAlternates(key: RouteKey, locale: Locale): Metadata["alternates"] {
  return {
    canonical: localizedUrl(key, locale),
    languages: {
      en: localizedUrl(key, "en"),
      es: localizedUrl(key, "es"),
      "x-default": localizedUrl(key, "en"),
    },
  };
}

export function blogPostUrl(locale: Locale, slug: string): string {
  return locale === "en" ? `${BASE_URL}/blog/${slug}` : `${BASE_URL}/es/blog/${slug}`;
}

// Alternates for a blog post — only includes locales where a translation exists.
export function blogPostAlternates(locale: Locale, slug: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    const s = l === locale ? slug : getTranslatedSlug(locale, slug, l);
    if (s) languages[l] = blogPostUrl(l, s);
  }
  if (languages.en) languages["x-default"] = languages.en;
  return { canonical: blogPostUrl(locale, slug), languages };
}

// ── Shared page metadata ─────────────────────────────────────────────────────
// Next.js does NOT deep-merge `openGraph` across segments: a page that defines
// it replaces the layout's object entirely. ALL pages must build metadata via
// pageMetadata()/blogPostMetadata() — never assemble openGraph piecemeal.

const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_ES" };
const OG_ALT: Record<Locale, string> = {
  en: "ConvertChat — Sell on WhatsApp. At scale.",
  es: "ConvertChat — Vende por WhatsApp. A escala.",
};

type PageMetaOpts = { title: string; description: string };

function ogImage(locale: Locale) {
  // Relative path — resolved against metadataBase (set in app/layout.tsx).
  return [
    {
      url: `/og/og-${locale}.png`,
      width: 1200,
      height: 630,
      alt: OG_ALT[locale],
    },
  ];
}

export function pageMetadata(key: RouteKey, locale: Locale, { title, description }: PageMetaOpts): Metadata {
  return {
    title,
    description,
    alternates: pageAlternates(key, locale),
    openGraph: {
      type: "website",
      url: localizedUrl(key, locale),
      title,
      description,
      siteName: "ConvertChat",
      locale: OG_LOCALE[locale],
      images: ogImage(locale),
    },
    twitter: { card: "summary_large_image" },
  };
}

export function blogPostMetadata(
  locale: Locale,
  slug: string,
  { title, description, publishedTime, image }: PageMetaOpts & { publishedTime?: string; image?: string },
): Metadata {
  return {
    title,
    description,
    alternates: blogPostAlternates(locale, slug),
    openGraph: {
      type: "article",
      url: blogPostUrl(locale, slug),
      title,
      description,
      siteName: "ConvertChat",
      locale: OG_LOCALE[locale],
      // per-post images must be 1200×630 (see scripts/og-blog.html)
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : ogImage(locale),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image" },
  };
}
