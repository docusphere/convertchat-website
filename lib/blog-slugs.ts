import type { Locale } from "./routes";

// Translation pairs linking each blog post across locales. Client-safe: no MDX
// imports, so client components (navbar locale switcher) can import it without
// bundling post content. When adding a post, add its pair here AND its raw
// content to the registry in lib/blog.ts. A locale key may be absent when the
// post has no translation.
export const postSlugPairs: ReadonlyArray<Partial<Record<Locale, string>>> = [
  { en: "welcome", es: "bienvenido" },
  { en: "whatsapp-broadcast-limits", es: "limites-difusion-whatsapp" },
  { en: "whatsapp-automation-tools", es: "herramientas-automatizacion-whatsapp" },
];

export function getTranslatedSlug(fromLocale: Locale, slug: string, toLocale: Locale): string | null {
  const pair = postSlugPairs.find((p) => p[fromLocale] === slug);
  return pair?.[toLocale] ?? null;
}
