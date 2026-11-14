import { STEPS, type Answers } from "@/content/brand-guide";

// Writes the free brand guide through OpenRouter and streams it back as plain text (Markdown).
// Needs OPENROUTER_API_KEY (Vercel env). OPENROUTER_MODEL overrides the model. Nothing is saved here:
// answers only reach us if the visitor sends their guide (see ./submit).

export const maxDuration = 120;

const MODEL = process.env.OPENROUTER_MODEL || "anthropic/claude-sonnet-5.5";

// Light abuse guard: per-instance, per-IP. Each guide costs a few cents.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}

function clean(raw: unknown): { answers: Answers; missing: string[] } {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const answers: Answers = {};
  const missing: string[] = [];
  for (const step of STEPS) {
    for (const f of step.fields) {
      const v = src[f.id];
      if (f.kind === "chips") {
        const list = (Array.isArray(v) ? v : []).map((x) => String(x).trim().slice(0, 60)).filter(Boolean).slice(0, f.pick + 1);
        if (list.length) answers[f.id] = list;
        else if (!f.optional) missing.push(f.id);
      } else {
        const max = f.kind === "choice" ? 80 : (f.max ?? 500);
        const s = typeof v === "string" ? v.trim().slice(0, max) : "";
        if (s) answers[f.id] = s;
        else if (!f.optional) missing.push(f.id);
      }
    }
  }
  return { answers, missing };
}

const SYSTEM = `You are a brand strategist at Unbound, a marketing agency for local service businesses. A business owner answered 7 short questions. Write their brand guide from those answers.

RULES
- Use only what they told you. Never invent facts: no years in business, numbers, awards, team size, prices, guarantees or stories they did not give. If something is missing, leave it out and list it under "Gaps to fill".
- Plain, everyday words. No marketing cliches (premier, solutions, top-notch, elevate, seamless, unparalleled, one-stop shop).
- Never use em dashes or en dashes. Use commas, colons or periods.
- Write about the business as "we" (the business's own voice), except where you address the owner directly in "Gaps to fill".
- Keep their own words where they're good. Tidy rambling answers; don't polish the personality out.
- Stances are drafts built from their answers. Each is one bold line they could say in public, plus one line on what it means in practice.
- Under 900 words total.

FORMAT: Markdown only, using just these elements: "# " for the title, "## " for sections, "- " for bullets, **bold**, and plain paragraphs. No tables, no links, no code blocks, no horizontal rules.

# {Business name} Brand Guide
## At a glance
2 or 3 sentences: what we do, where, and who for.
## Our story
A short paragraph.
## Who we serve
"Best fit" bullets, then "Not a fit" bullets (only if they told you).
## Values
Each of their values as a bullet: **Value**: what it looks like on a real job, from their answers. If an answer doesn't support it, keep it to a short, plain line.
## Where we stand
2 to 4 stances (draft, for the owner to confirm).
## Our promise
One or two sentences.
## How we sound
Bullets: 3 voice traits with a "do this, not that" for each; words we use; words we never use (include anything they said makes them cringe).
Then 3 sample lines in their voice: a phone greeting, the first line of a Google post, and a 2-sentence reply to a 5-star review.
## Look and feel
Colors (only what they gave), photo style, and how the website should feel in the first 5 seconds.
## Gaps to fill
Bullets addressed to the owner: what's missing that would make this guide stronger. Skip the section if nothing important is missing.`;

function userMessage(a: Answers) {
  const get = (k: string) => {
    const v = a[k];
    return Array.isArray(v) ? v.join(", ") : (v ?? "(skipped)");
  };
  return [
    `Business name: ${get("name")}`,
    `What we do: ${get("what")}`,
    `Where: ${get("where")}`,
    `Website: ${get("site")}`,
    `Why they started / what they did before: ${get("story")}`,
    `Best customer ever: ${get("best")}`,
    `Would never take on again: ${get("never")}`,
    `Values (picked): ${get("values")}`,
    `What makes them mad about the industry / what customers get wrong: ${get("mad")}`,
    `Promise to every customer: ${get("promise")}`,
    `Voice (picked): ${get("voice")}`,
    `Marketing words that make them cringe: ${get("cringe")}`,
    `Colors already in use: ${get("colors")}`,
    `First 5 seconds on the website should feel: ${get("feel")}`,
    `Photos: ${get("photos")}`,
  ].join("\n");
}

// The widget asks this first, so visitors never answer 7 questions for a writer that isn't switched on.
export function GET() {
  return Response.json(
    { ready: Boolean(process.env.OPENROUTER_API_KEY), leads: Boolean(process.env.NOTION_TOKEN && process.env.NOTION_CRM_DATABASE_ID) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (!process.env.OPENROUTER_API_KEY) return Response.json({ error: "not-configured" }, { status: 503 });
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return Response.json({ error: "rate-limited" }, { status: 429 });

  const body = await request.json().catch(() => ({}));
  const { answers, missing } = clean(body?.answers);
  if (missing.length) return Response.json({ error: "missing", missing }, { status: 400 });

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://www.unbound24.com",
      "X-Title": "Unbound24 Brand Guide",
    },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      max_tokens: 2500,
      temperature: 0.6,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userMessage(answers) },
      ],
    }),
    signal: request.signal,
  });
  if (!upstream.ok || !upstream.body) {
    console.error("openrouter failed", upstream.status, await upstream.text().catch(() => ""));
    return Response.json({ error: "ai-failed" }, { status: 502 });
  }

  // OpenRouter streams SSE; pass only the text deltas through.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta.replace(/\s*—\s*/g, ", ")));
          } catch {}
        }
      },
    }),
  );
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
