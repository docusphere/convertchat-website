import matter from "gray-matter";

// Static imports — Webpack processes these at build time via asset/source rule.
// Adding a post: (1) import its .mdx here and add it to postRegistry below,
// (2) add its translation pair to lib/blog-slugs.ts (links locales for the
// locale switcher, hreflang, and sitemap alternates).
import esBienvenido from "../content/blog/es/bienvenido.mdx";
import enWelcome from "../content/blog/en/welcome.mdx";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  locale: string;
  content: string;
  image: string;
  updated: string;
};

// Registry built from static imports. Fully synchronous, edge-compatible.
const postRegistry: Record<string, Record<string, string>> = {
  es: {
    bienvenido: esBienvenido,
  },
  en: {
    welcome: enWelcome,
  },
};

function parseFrontmatter(raw: string, slug: string, locale: string): BlogPost {
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: data.date ? String(data.date) : "",
    author: data.author || "",
    tags: data.tags || [],
    locale,
    content: content.trim(),
    image: data.image || "",
    updated: data.updated ? String(data.updated) : data.date ? String(data.date) : "",
  };
}

export function getAllPosts(locale: string): BlogPost[] {
  const entries = postRegistry[locale] || {};
  return Object.entries(entries)
    .map(([slug, raw]) => parseFrontmatter(raw, slug, locale))
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPost(locale: string, slug: string): BlogPost | null {
  const raw = postRegistry[locale]?.[slug];
  if (!raw) return null;
  return parseFrontmatter(raw, slug, locale);
}

export function getAllSlugs(): { locale: string; slug: string }[] {
  const slugs: { locale: string; slug: string }[] = [];
  for (const [locale, entries] of Object.entries(postRegistry)) {
    for (const slug of Object.keys(entries)) {
      slugs.push({ locale, slug });
    }
  }
  return slugs;
}
