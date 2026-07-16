// Parses the blog article dialect: markdown subset (h2/h3, paragraphs, ul/ol,
// GFM tables, images) plus ::: directive blocks (chat, quote, stat, callout,
// cta). Inline formatting (**bold**, *italic*, `code`, [links]) is rendered by
// components/blog/blog-article.tsx — this module only tokenizes blocks.

export type ChatMessage = { from: "customer" | "biz" | "ai"; text: string };

export type ArticleBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "chat"; messages: ChatMessage[] }
  | { type: "quote"; text: string }
  | { type: "stat"; value: string; label: string }
  | { type: "callout"; variant: "tip" | "warning"; text: string }
  | { type: "cta"; text: string; button: string; href: string };

export function parseArticle(content: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  // Split into raw chunks: ::: directives are multi-line and may contain blank
  // lines, so extract them first, then split the rest on blank lines.
  const chunks = splitChunks(content);
  for (const chunk of chunks) {
    const block = parseChunk(chunk);
    if (block) blocks.push(block);
  }
  return blocks;
}

function splitChunks(content: string): string[] {
  const lines = content.split("\n");
  const chunks: string[] = [];
  let current: string[] = [];
  let inDirective = false;

  const flush = () => {
    const text = current.join("\n").trim();
    if (text) chunks.push(text);
    current = [];
  };

  for (const line of lines) {
    if (line.trimEnd().startsWith(":::")) {
      if (!inDirective) {
        flush();
        inDirective = true;
        current.push(line);
      } else {
        current.push(line);
        inDirective = false;
        flush();
      }
    } else if (!inDirective && line.trim() === "") {
      flush();
    } else {
      current.push(line);
    }
  }
  flush();
  return chunks;
}

function parseChunk(chunk: string): ArticleBlock | null {
  if (chunk.startsWith(":::")) return parseDirective(chunk);
  if (chunk.startsWith("### ")) return { type: "h3", text: chunk.slice(4).trim() };
  if (chunk.startsWith("## ")) return { type: "h2", text: chunk.slice(3).trim() };

  const lines = chunk.split("\n").map((l) => l.trim());

  const image = chunk.match(/^!\[(.*?)\]\((\S+?)(?:\s+"(.+?)")?\)$/);
  if (image) return { type: "image", alt: image[1], src: image[2], caption: image[3] };

  if (lines.every((l) => l.startsWith("- "))) {
    return { type: "ul", items: lines.map((l) => l.slice(2)) };
  }
  if (lines.every((l) => /^\d+\.\s/.test(l))) {
    return { type: "ol", items: lines.map((l) => l.replace(/^\d+\.\s/, "")) };
  }
  if (lines.length >= 2 && lines.every((l) => l.startsWith("|")) && /^\|[\s:|-]+\|$/.test(lines[1])) {
    const parseRow = (l: string) =>
      l
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((c) => c.trim());
    return { type: "table", header: parseRow(lines[0]), rows: lines.slice(2).map(parseRow) };
  }

  return { type: "p", text: lines.join(" ") };
}

function parseDirective(chunk: string): ArticleBlock | null {
  const lines = chunk.split("\n");
  const [, name, arg] = lines[0].trim().match(/^:::(\w+)(?:\s+(.*))?$/) ?? [];
  const body = lines.slice(1, -1).join("\n").trim();
  const bodyLines = body
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  switch (name) {
    case "quote":
      return { type: "quote", text: body };
    case "chat": {
      const messages: ChatMessage[] = [];
      for (const line of bodyLines) {
        const m = line.match(/^(customer|biz|ai):\s*(.+)$/);
        if (m) messages.push({ from: m[1] as ChatMessage["from"], text: m[2] });
      }
      return { type: "chat", messages };
    }
    case "stat": {
      const value =
        bodyLines
          .find((l) => l.startsWith("value:"))
          ?.slice(6)
          .trim() ?? "";
      const label =
        bodyLines
          .find((l) => l.startsWith("label:"))
          ?.slice(6)
          .trim() ?? "";
      return { type: "stat", value, label };
    }
    case "callout":
      return { type: "callout", variant: arg === "warning" ? "warning" : "tip", text: body };
    case "cta": {
      const get = (key: string) =>
        bodyLines
          .find((l) => l.startsWith(`${key}:`))
          ?.slice(key.length + 1)
          .trim() ?? "";
      return { type: "cta", text: get("text"), button: get("button"), href: get("href") };
    }
    default:
      return null;
  }
}
