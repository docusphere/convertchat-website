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
