import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPost, getAllSlugs } from "@/lib/blog";
import { blogPostAlternates } from "@/lib/seo";
import type { Locale } from "@/lib/routes";

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getAllSlugs()
    .filter(({ locale }) => locale === params.locale)
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) return {};
  return {
    title: `${post.title} | ConvertChat`,
    description: post.description,
    alternates: blogPostAlternates(locale as Locale, slug),
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPost(locale, slug);
  if (!post) notFound();

  return (
    <section className="bg-neutral-50 px-6 py-24">
      <article className="mx-auto max-w-3xl">
        <time className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">{post.date}</time>
        <h1 className="mt-4 font-serif text-4xl font-normal tracking-[-0.03em] text-neutral-700 md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          {post.author} &middot; {post.tags.join(", ")}
        </p>
        <div className="prose mt-12 max-w-none whitespace-pre-line text-neutral-600">{post.content}</div>
      </article>
    </section>
  );
}
