// Single source of truth for static routes. i18n/routing.ts (pathnames),
// app/sitemap.ts, and lib/seo.ts (hreflang) all derive from this registry.
// Adding a static page = add one entry here + create app/[locale]/<key>/.

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const BASE_URL = "https://convertchat.co";

type RouteDef = {
  es: string; // Spanish path (English path IS the key — en is the default, unprefixed locale)
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

export const staticRoutes = {
  "/": { es: "/", changeFrequency: "weekly", priority: 1 },
  "/product": { es: "/producto", changeFrequency: "monthly", priority: 0.8 },
  "/pricing": { es: "/precios", changeFrequency: "monthly", priority: 0.7 },
  "/blog": { es: "/blog", changeFrequency: "weekly", priority: 0.6 },
  "/privacy": { es: "/privacidad", changeFrequency: "yearly", priority: 0.3 },
  "/terms": { es: "/terminos", changeFrequency: "yearly", priority: 0.3 },
} as const satisfies Record<string, RouteDef>;

export type RouteKey = keyof typeof staticRoutes;

// Absolute URL for a static route in a locale. en is unprefixed; es lives under /es.
export function localizedUrl(key: RouteKey, locale: Locale): string {
  if (locale === "en") return key === "/" ? BASE_URL : `${BASE_URL}${key}`;
  const esPath = staticRoutes[key].es;
  return esPath === "/" ? `${BASE_URL}/es` : `${BASE_URL}/es${esPath}`;
}
