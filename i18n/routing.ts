import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // Persist the visitor's language choice for a year (default cookie is session-only)
  localeCookie: { maxAge: 60 * 60 * 24 * 365 },
  pathnames: {
    "/": "/",
    "/producto": {
      es: "/producto",
      en: "/product",
    },
    "/precios": {
      es: "/precios",
      en: "/pricing",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/privacidad": {
      es: "/privacidad",
      en: "/privacy",
    },
    "/terminos": {
      es: "/terminos",
      en: "/terms",
    },
  },
});
