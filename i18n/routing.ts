import { defineRouting } from "next-intl/routing";
import { locales, staticRoutes, type RouteKey } from "@/lib/routes";

// pathnames derives from the central registry (lib/routes.ts). Internal keys
// are the English paths and MUST match the app/[locale]/ directory names.
const staticPathnames = Object.fromEntries(
  (Object.keys(staticRoutes) as RouteKey[]).map((key) => [key, { en: key, es: staticRoutes[key].es }]),
) as { [K in RouteKey]: { en: K; es: (typeof staticRoutes)[K]["es"] } };

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // Persist the visitor's language choice for a year (default cookie is session-only)
  localeCookie: { maxAge: 60 * 60 * 24 * 365 },
  pathnames: {
    ...staticPathnames,
    "/blog/[slug]": "/blog/[slug]",
  },
});
