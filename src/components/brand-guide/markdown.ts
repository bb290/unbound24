// Tiny reader for the limited Markdown the brand guide model is told to write: # / ## / ### headings, "- " bullets,
// **bold** and plain paragraphs. Used by both the on-page preview and the PDF.

export type Block = { type: "h1" | "h2" | "h3" | "li" | "p"; text: string };
export type Run = { text: string; bold: boolean };

export function parse(md: string): Block[] {
  const out: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) out.push({ type: "p", text: para.join(" ") });
    para = [];
  };
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) { flush(); out.push({ type: (["h1", "h2", "h3"] as const)[h[1].length - 1], text: h[2] }); continue; }
    const li = /^[-*•]\s+(.*)$/.exec(line) ?? /^\d+[.)]\s+(.*)$/.exec(line);
    if (li) { flush(); out.push({ type: "li", text: li[1] }); continue; }
    para.push(line);
  }
  flush();
  return out;
}

export function runs(text: string): Run[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((s) => (s.startsWith("**") && s.endsWith("**") ? { text: s.slice(2, -2), bold: true } : { text: s.replace(/\*\*/g, ""), bold: false }));
}

export function fileSlug(name: string) {
  return (name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "my-business").slice(0, 40);
}
