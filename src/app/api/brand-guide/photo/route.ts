// Optional photos for "Submit for Mock Up" (Brittany, 2026-11-17): the visitor's work, team or shop, for the mock up.
// The browser shrinks each photo (about 2000 px, JPEG) and sends them one at a time, before the lead itself. Each one
// goes straight into Notion's file storage and we return its file-upload id; ./submit then attaches the ids to the
// lead's CRM page as images. Nothing is kept here and nothing is public. Notion drops an upload that isn't attached
// within an hour, so stray uploads clean themselves up.

export const maxDuration = 30;

const NOTION = { "Notion-Version": "2022-06-28" };
const TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 4 * 1024 * 1024; // Vercel caps a request at 4.5 MB; shrunk photos are about 0.5 MB.

// Light abuse guard: per-instance, per-IP. A full set is 10.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 40;
}

export async function POST(request: Request) {
  if (!process.env.NOTION_TOKEN) return Response.json({ error: "not-configured" }, { status: 503 });
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return Response.json({ error: "Too many photos for now. Try again later." }, { status: 429 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("photo");
  if (!(file instanceof File)) return Response.json({ error: "No photo." }, { status: 400 });
  if (!TYPES.includes(file.type)) return Response.json({ error: "Photos only (JPG, PNG or WebP)." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "That photo is too big." }, { status: 400 });

  const auth = { Authorization: `Bearer ${process.env.NOTION_TOKEN}`, ...NOTION };
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `mockup-photo-${Date.now()}.${ext}`;

  const created = await fetch("https://api.notion.com/v1/file_uploads", {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ filename, content_type: file.type }),
    cache: "no-store",
  });
  const upload = await created.json().catch(() => ({}));
  if (!created.ok || !upload?.id) {
    console.error("notion file upload create failed", created.status, JSON.stringify(upload).slice(0, 300));
    return Response.json({ error: "upload-failed" }, { status: 502 });
  }

  const body = new FormData();
  body.append("file", new Blob([await file.arrayBuffer()], { type: file.type }), filename);
  const sent = await fetch(`https://api.notion.com/v1/file_uploads/${upload.id}/send`, { method: "POST", headers: auth, body, cache: "no-store" });
  if (!sent.ok) {
    console.error("notion file upload send failed", sent.status, (await sent.text().catch(() => "")).slice(0, 300));
    return Response.json({ error: "upload-failed" }, { status: 502 });
  }
  return Response.json({ id: upload.id });
}
