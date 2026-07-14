import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { pageAlternates } from "@/lib/seo";
import type { Locale } from "@/lib/routes";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: pageAlternates("/blog", locale as Locale) };
}
import { getAllPosts } from "@/lib/blog";
import { Link } from "@/i18n/navigation";

export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getAllPosts(locale);

  return (
    <section className="bg-neutral-50 px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-4xl font-normal tracking-[-0.03em] text-neutral-700 md:text-5xl">Blog</h1>

        {posts.length === 0 ? (
          <p className="mt-8 text-neutral-400">{locale === "es" ? "Próximamente" : "Coming soon"}</p>
        ) : (
          <div className="mt-12 grid gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}` as any}
                className="group block rounded-3xl border border-neutral-200 bg-white p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <time className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">{post.date}</time>
                <h2 className="mt-2 font-serif text-2xl font-medium text-neutral-700 transition-colors group-hover:text-primary-600">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-neutral-500">{post.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
