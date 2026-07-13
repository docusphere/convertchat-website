import type { ReactNode } from "react";
import type { LegalDoc } from "@/lib/legal";

// Renders the limited markdown subset used by the legal documents:
// ## / ### headings, "- " bullet lists, paragraphs, **bold**, and bare URLs/emails.

const URL_OR_EMAIL = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g;

function renderInline(text: string): ReactNode[] {
  // Split on **bold** first, then linkify URLs/emails inside each fragment
  return text.split(/\*\*(.+?)\*\*/g).map((fragment, i) => {
    const linkified = fragment.split(URL_OR_EMAIL).map((part, j) => {
      if (/^https?:\/\//.test(part)) {
        return (
          <a
            key={j}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-700 underline decoration-primary-700/30 underline-offset-2 transition-colors hover:decoration-primary-700"
          >
            {part}
          </a>
        );
      }
      if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
        return (
          <a
            key={j}
            href={`mailto:${part}`}
            className="text-primary-700 underline decoration-primary-700/30 underline-offset-2 transition-colors hover:decoration-primary-700"
          >
            {part}
          </a>
        );
      }
      return part;
    });
    // Odd indices are the captured bold contents
    return i % 2 === 1 ? (
      <strong key={i} className="font-medium text-neutral-800">
        {linkified}
      </strong>
    ) : (
      <span key={i}>{linkified}</span>
    );
  });
}

export function LegalArticle({ doc }: { doc: LegalDoc }) {
  const blocks = doc.content.split(/\n\s*\n/);

  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="font-serif text-4xl font-normal tracking-[-0.03em] text-neutral-800 md:text-5xl">{doc.title}</h1>
      {doc.effectiveDate && <p className="mt-4 text-sm text-neutral-400">{doc.effectiveDate}</p>}
      <div className="mt-12">
        {blocks.map((block, i) => {
          const trimmed = block.trim();
          if (trimmed.startsWith("### ")) {
            return (
              <h3 key={i} className="mt-10 font-serif text-xl font-normal tracking-[-0.02em] text-neutral-800">
                {renderInline(trimmed.slice(4))}
              </h3>
            );
          }
          if (trimmed.startsWith("## ")) {
            return (
              <h2 key={i} className="mt-14 font-serif text-2xl font-normal tracking-[-0.02em] text-neutral-800">
                {renderInline(trimmed.slice(3))}
              </h2>
            );
          }
          const lines = trimmed.split("\n");
          if (lines.every((l) => l.trim().startsWith("- "))) {
            return (
              <ul
                key={i}
                className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 marker:text-neutral-300"
              >
                {lines.map((l, j) => (
                  <li key={j}>{renderInline(l.trim().slice(2))}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} className="mt-4 text-[15px] leading-relaxed text-neutral-600">
              {renderInline(trimmed.replace(/\n/g, " "))}
            </p>
          );
        })}
      </div>
    </article>
  );
}
