import { VENDING } from "@/content/vending";

// Value Vending Machine leads go to the Unbound24 Notion CRM (Brittany, 2026-11-12: Unbound leads go to Notion, never HubSpot).
// Needs NOTION_TOKEN and NOTION_CRM_DATABASE_ID; without them it answers 503 and the page still hands over the PDF.

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().slice(0, 200);
  const item = VENDING.find((v) => v.code === body.code);
  if (!item) return Response.json({ error: "Unknown slot." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Add a valid email." }, { status: 400 });
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_CRM_DATABASE_ID) return Response.json({ error: "not-configured" }, { status: 503 });

  const text = (content: string) => ({ type: "text", text: { content } });
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
        Name: { title: [text(email)] },
        Email: { email },
        Source: { select: { name: "Value Vending Machine" } },
      },
      children: [
        { object: "block", type: "paragraph", paragraph: { rich_text: [text(`${new Date().toISOString().slice(0, 10)}: took ${item.code}, ${item.headline}`)] } },
      ],
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    console.error("saving vending lead failed", response.status, await response.text());
    return Response.json({ error: "save-failed" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
