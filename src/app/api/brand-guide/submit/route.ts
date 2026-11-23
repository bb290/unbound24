// "Submit for Mock Up": the visitor sends their guide (name + email); within ~3 days we send back a website mock up,
// review strategy, social media plan and SEO/AEO plan (Brittany, 2026-11-17).
// Saves a lead in the Unbound24 Notion CRM (Unbound leads go to Notion, never HubSpot; Brittany 2026-11-12).
// Needs NOTION_TOKEN and NOTION_CRM_DATABASE_ID. Without them it answers 503.
// Then emails Brittany (RESEND_API_KEY + LEAD_ALERT_TO, see sendLeadAlert); the dashboard to-do comes from the
// daily run in tools/unbound-hq (sync/brand-guide-leads.mjs).

import { sendLeadAlert } from "@/lib/email";

const text = (content: string) => ({ type: "text", text: { content } });
const para = (content: string) => ({ object: "block", type: "paragraph", paragraph: { rich_text: [text(content)] } });

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const business = String(body.business ?? "").trim().slice(0, 120);
  const guide = String(body.guide ?? "").slice(0, 20000);
  // Optional photos, already in Notion's file storage (see ./photo). Only well-formed ids, at most 10.
  const photoIds = (Array.isArray(body.photoIds) ? body.photoIds : [])
    .map((x: unknown) => String(x))
    .filter((x: string) => /^[0-9a-f-]{32,36}$/i.test(x))
    .slice(0, 10) as string[];
  if (!name) return Response.json({ error: "Add your name." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Add a valid email." }, { status: 400 });
  if (!guide.trim()) return Response.json({ error: "No brand guide to send." }, { status: 400 });
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_CRM_DATABASE_ID) return Response.json({ error: "not-configured" }, { status: 503 });

  // The guide becomes real Notion headings, bullets and paragraphs so it reads well in the CRM.
  // Notion caps a text block at 2000 characters and a create call at 100 blocks.
  const rich = (content: string) => {
    const out: object[] = [];
    for (const piece of content.slice(0, 1900).split(/(\*\*[^*]+\*\*)/g).filter(Boolean)) {
      const bold = piece.startsWith("**") && piece.endsWith("**");
      out.push({ type: "text", text: { content: bold ? piece.slice(2, -2) : piece.replace(/\*\*/g, "") }, annotations: { bold } });
    }
    return out;
  };
  const blocks: object[] = [];
  let para_: string[] = [];
  const flush = () => { if (para_.length) blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: rich(para_.join(" ")) } }); para_ = []; };
  for (const raw of guide.split("\n")) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    const li = /^[-*•]\s+(.*)$/.exec(line);
    if (h) { flush(); const t = (["heading_1", "heading_2", "heading_3"] as const)[h[1].length - 1]; blocks.push({ object: "block", type: t, [t]: { rich_text: rich(h[2]) } }); }
    else if (li) { flush(); blocks.push({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: rich(li[1]) } }); }
    else para_.push(line);
  }
  flush();
  const photoNote = photoIds.length ? ` Sent ${photoIds.length} photo${photoIds.length === 1 ? "" : "s"} for it (at the bottom of this page).` : " No photos sent.";
  const photoBlocks = photoIds.length
    ? [
        { object: "block", type: "heading_2", heading_2: { rich_text: [text("Their photos")] } },
        ...photoIds.map((id) => ({ object: "block", type: "image", image: { type: "file_upload", file_upload: { id } } })),
      ]
    : [];
  // Notion takes 100 blocks per create call: the note, the guide, then the photos.
  const children = [
    para(`${new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" })}: sent their brand guide from unbound24.com${business ? ` (${business})` : ""}. Wants the free website mock up, review strategy, social media plan and SEO/AEO plan.${photoNote}`),
    ...blocks.slice(0, 99 - photoBlocks.length),
    ...photoBlocks,
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
        Photos: { number: photoIds.length },
      },
      children,
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    console.error("saving brand guide lead failed", response.status, await response.text());
    return Response.json({ error: "save-failed" }, { status: 500 });
  }
  const page = await response.json().catch(() => ({}));
  const due = new Date(Date.now() + 3 * 864e5).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/Chicago" });
  await sendLeadAlert({ name, email, business, guide, notionUrl: page?.url, due, photos: photoIds.length });
  return Response.json({ ok: true });
}
