import type { ReactNode } from "react";
import { Lightbulb, TriangleAlert } from "lucide-react";
import { parseArticle } from "@/lib/article";
import type { ArticleBlock } from "@/lib/article";
import { ChatMockup } from "@/components/blog/chat-mockup";
import { CtaBlock } from "@/components/blog/cta-block";

// ---------------------------------------------------------------------------
// Inline renderer: [link](href) → **bold** → *italic* → `code`
// Applied to: p, list items, table cells, h2/h3, quote, callout
// ---------------------------------------------------------------------------

function renderInline(text: string): ReactNode[] {
  // Step 1: split on markdown links [text](href)
  const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
  const segments: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(...renderBoldItalicCode(text.slice(lastIndex, match.index), `t-${lastIndex}`));
    }
    const linkText = match[1];
    const href = match[2];
    const isExternal = href.startsWith("http");
    segments.push(
      <a
        key={`link-${match.index}`}
        href={href}
        className="text-primary-700 underline decoration-primary-700/30 underline-offset-2 transition-colors hover:decoration-primary-700"
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {linkText}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push(...renderBoldItalicCode(text.slice(lastIndex), `t-${lastIndex}`));
  }
  return segments;
}

// Handles **bold**, *italic*, `code` within a plain-text fragment (no links).
function renderBoldItalicCode(text: string, keyPrefix: string): ReactNode[] {
  // Split on **bold** first
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-medium text-neutral-800">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={key} className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] text-neutral-800">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// ---------------------------------------------------------------------------
// Local sub-components
// ---------------------------------------------------------------------------

function ArticleImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full rounded-2xl" loading="lazy" />
      {caption && <figcaption className="mt-3 text-center text-sm text-neutral-400">{caption}</figcaption>}
    </figure>
  );
}

function PullQuote({ text }: { text: string }) {
  return (
    <blockquote className="my-10 border-l-2 border-primary-600 pl-6 font-serif text-2xl leading-snug tracking-[-0.02em] text-neutral-800 md:text-[28px]">
      {renderInline(text)}
    </blockquote>
  );
}

function StatHighlight({ value, label }: { value: string; label: string }) {
  return (
    <div className="my-10 rounded-2xl bg-neutral-950 px-6 py-10 text-center">
      <span className="font-heading font-semibold bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 bg-clip-text text-6xl tracking-[-0.02em] text-transparent md:text-7xl">
        {value}
      </span>
      <p className="mt-3 text-sm text-neutral-400">{label}</p>
    </div>
  );
}

function Callout({ variant, text }: { variant: "tip" | "warning"; text: string }) {
  const isTip = variant === "tip";
  return (
    <div
      className={`my-8 flex items-start gap-3 rounded-2xl border px-5 py-4 text-[15px] leading-relaxed ${
        isTip ? "border-neutral-200 bg-neutral-50 text-neutral-600" : "border-amber-200 bg-amber-50 text-amber-900"
      }`}
    >
      {isTip ? (
        <Lightbulb size={16} className="mt-0.5 shrink-0 text-neutral-400" />
      ) : (
        <TriangleAlert size={16} className="mt-0.5 shrink-0 text-amber-600" />
      )}
      <span>{renderInline(text)}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block renderer — exhaustive switch with never-check
// ---------------------------------------------------------------------------

function renderBlock(block: ArticleBlock, index: number): ReactNode {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={index}
          className="mt-14 font-serif text-2xl font-normal tracking-[-0.02em] text-neutral-800 md:text-3xl"
        >
          {renderInline(block.text)}
        </h2>
      );

    case "h3":
      return (
        <h3 key={index} className="mt-10 font-serif text-xl font-normal tracking-[-0.02em] text-neutral-800">
          {renderInline(block.text)}
        </h3>
      );

    case "p":
      return (
        <p key={index} className="mt-5 text-[15px] leading-relaxed text-neutral-600 md:text-base">
          {renderInline(block.text)}
        </p>
      );

    case "ul":
      return (
        <ul
          key={index}
          className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 marker:text-neutral-300"
        >
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol
          key={index}
          className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 marker:text-neutral-300"
        >
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ol>
      );

    case "table":
      return (
        <div key={index} className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                {block.header.map((cell, i) => (
                  <th
                    key={i}
                    className="bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500"
                  >
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-neutral-100">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-neutral-600">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "image":
      return <ArticleImage key={index} src={block.src} alt={block.alt} caption={block.caption} />;

    case "quote":
      return <PullQuote key={index} text={block.text} />;

    case "stat":
      return <StatHighlight key={index} value={block.value} label={block.label} />;

    case "callout":
      return <Callout key={index} variant={block.variant} text={block.text} />;

    case "chat":
      return <ChatMockup key={index} messages={block.messages} />;

    case "cta":
      return <CtaBlock key={index} text={block.text} button={block.button} href={block.href} />;

    default: {
      // Exhaustive check — TypeScript will error if a new block type is unhandled
      const _never: never = block;
      return null;
    }
  }
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function BlogArticle({ content }: { content: string }) {
  const blocks = parseArticle(content);
  return <div className="mt-12">{blocks.map((block, i) => renderBlock(block, i))}</div>;
}
