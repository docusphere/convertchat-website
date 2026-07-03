import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
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
