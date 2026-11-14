// Brand guide upgrade: the visitor sends their guide (name + email) for a free marketing plan and website redesign.
// Saves a lead in the Unbound24 Notion CRM (Unbound leads go to Notion, never HubSpot; Brittany 2026-11-12).
// Needs NOTION_TOKEN and NOTION_CRM_DATABASE_ID. Without them it answers 503.

const text = (content: string) => ({ type: "text", text: { content } });
const para = (content: string) => ({ object: "block", type: "paragraph", paragraph: { rich_text: [text(content)] } });

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const business = String(body.business ?? "").trim().slice(0, 120);
  const guide = String(body.guide ?? "").slice(0, 20000);
  if (!name) return Response.json({ error: "Add your name." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Add a valid email." }, { status: 400 });
  if (!guide.trim()) return Response.json({ error: "No brand guide to send." }, { status: 400 });
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_CRM_DATABASE_ID) return Response.json({ error: "not-configured" }, { status: 503 });

  // Notion caps a text block at 2000 characters and a create call at 100 blocks.
  const chunks: string[] = [];
  for (const part of guide.split(/\n{2,}/)) {
    for (let i = 0; i < part.length; i += 1900) chunks.push(part.slice(i, i + 1900));
  }
  const children = [
    para(`${new Date().toISOString().slice(0, 10)}: sent their brand guide from unbound24.com${business ? ` (${business})` : ""}. Wants the free marketing plan and website redesign, plus the 20-minute review.`),
    ...chunks.filter((c) => c.trim()).slice(0, 98).map(para),
  ];

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_CRM_DATABASE_ID },
      properties: {
        Name: { title: [text(business ? `${name} (${business})` : name)] },
        Email: { email },
        Source: { select: { name: "Brand Guide" } },
      },
      children,
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    console.error("saving brand guide lead failed", response.status, await response.text());
    return Response.json({ error: "save-failed" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
