import matter from "gray-matter";

// Static imports — processed at build time via the asset/source (webpack) and raw-loader (turbopack) rules.
import enPrivacy from "../content/legal/en/privacy.mdx";
import esPrivacy from "../content/legal/es/privacy.mdx";
import enTerms from "../content/legal/en/terms.mdx";
import esTerms from "../content/legal/es/terms.mdx";

export type LegalDoc = {
  title: string;
  effectiveDate: string;
  content: string;
};

const docRegistry: Record<string, Record<string, string>> = {
  en: { privacy: enPrivacy, terms: enTerms },
  es: { privacy: esPrivacy, terms: esTerms },
};

export function getLegalDoc(locale: string, doc: "privacy" | "terms"): LegalDoc {
  const raw = docRegistry[locale]?.[doc] ?? docRegistry.en[doc];
  const { data, content } = matter(raw);
  return {
    title: data.title || "",
    effectiveDate: data.effectiveDate || "",
    content: content.trim(),
  };
}
