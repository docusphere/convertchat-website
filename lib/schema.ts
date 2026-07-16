import { BASE_URL, localizedUrl, type Locale } from "./routes";
import { blogPostUrl } from "./seo";
import type { BlogPost } from "./blog";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ConvertChat",
    url: BASE_URL,
    logo: `${BASE_URL}/logo-full-color.png`,
  };
}

export function webSiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ConvertChat",
    url: localizedUrl("/", locale),
    inLanguage: locale,
  };
}

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function blogPostingSchema(locale: Locale, post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: locale,
    url: blogPostUrl(locale, post.slug),
    author: { "@type": "Organization", name: "ConvertChat", url: BASE_URL },
    ...(post.image ? { image: post.image.startsWith("http") ? post.image : `${BASE_URL}${post.image}` } : {}),
    ...(post.updated ? { dateModified: post.updated } : {}),
  };
}
