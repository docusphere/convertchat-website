/**
 * Blog post hero card — renders the post title inside a dark gradient card
 * matching the OG template aesthetic (green/purple blobs, rainbow bar, logo).
 * Replaces the static OG image on the page itself (OG PNGs still used for
 * social sharing via meta tags).
 */

export function BlogPostHero({ title }: { title: string }) {
  return (
    <div className="relative mt-10 overflow-hidden rounded-2xl bg-[#06060f]" style={{ aspectRatio: "1200 / 630" }}>
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -left-20 -top-[140px] h-[520px] w-[520px] rounded-full opacity-[0.72] blur-[90px]"
        style={{ background: "radial-gradient(circle, #22c55e 0%, #16a34a 40%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-[160px] -right-[100px] h-[500px] w-[580px] rounded-full opacity-75 blur-[90px]"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, #6d28d9 35%, transparent 70%)" }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 70% at 60% 50%, transparent 30%, rgba(6,6,15,0.55) 100%)" }}
      />

      {/* Rainbow bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background:
            "linear-gradient(90deg, #7c3aed 0%, #ec4899 18%, #f97316 32%, #eab308 48%, #22c55e 63%, #06b6d4 80%, #3b82f6 100%)",
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-[52px_72px_48px]">
        {/* Top: logo + blog pill */}
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-full-white.png" alt="ConvertChat" className="h-6 w-auto brightness-0 invert sm:h-8 lg:h-9" />
          <span className="inline-block rounded-md border border-green-400/35 bg-green-500/[0.08] px-2.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-[0.06em] text-green-400 sm:ml-2 sm:px-3 sm:py-1 sm:text-xs">
            Blog
          </span>
        </div>

        {/* Middle: title */}
        <div className="flex flex-1 items-center py-4 sm:py-6">
          <h1 className="line-clamp-3 max-w-[960px] font-serif text-2xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-[56px]">
            {title}
          </h1>
        </div>

        {/* Bottom: site URL + tagline */}
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs text-white/45 sm:text-sm">
            convertchat.co
            <span className="mx-2 inline-block h-1 w-1 rounded-full bg-white/30 align-middle" />
            blog
          </span>
          <span className="hidden font-sans text-xs text-white/35 sm:inline sm:text-sm">
            WhatsApp remarketing for B2B
          </span>
        </div>
      </div>
    </div>
  );
}
