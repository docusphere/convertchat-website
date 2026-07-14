import type { MetadataRoute } from "next";
import { locales, localizedUrl, staticRoutes, type Locale, type RouteKey } from "@/lib/routes";
import { getAllSlugs } from "@/lib/blog";
import { getTranslatedSlug } from "@/lib/blog-slugs";
import { blogPostUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = (Object.keys(staticRoutes) as RouteKey[]).flatMap((key) => {
    const { changeFrequency, priority } = staticRoutes[key];
    const alternates = {
      languages: { en: localizedUrl(key, "en"), es: localizedUrl(key, "es"), "x-default": localizedUrl(key, "en") },
    };
    return [
      { url: localizedUrl(key, "en"), lastModified: new Date(), changeFrequency, priority, alternates },
      // Spanish entries rank one notch below their English counterparts (existing convention)
      {
        url: localizedUrl(key, "es"),
        lastModified: new Date(),
        changeFrequency,
        priority: Math.round((priority - 0.1) * 10) / 10,
        alternates,
      },
    ];
  });

  const blogPages = getAllSlugs().map(({ locale, slug }) => {
    const l = locale as Locale;
    const languages: Record<string, string> = { [l]: blogPostUrl(l, slug) };
    for (const other of locales) {
      if (other === l) continue;
      const translated = getTranslatedSlug(l, slug, other);
      if (translated) languages[other] = blogPostUrl(other, translated);
    }
    if (languages.en) languages["x-default"] = languages.en;
    return {
      url: blogPostUrl(l, slug),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
      alternates: { languages },
    };
  });

  return [...staticPages, ...blogPages];
}
