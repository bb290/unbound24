import { READY_LESSONS } from "@/content/course";
import { accountsEnabled, sessionEmail } from "@/lib/auth";
import { findContact, parseProgress, saveProgress } from "@/lib/crm";

const LESSON_SLUGS = new Set(READY_LESSONS.map((lesson) => lesson.slug));

export async function GET() {
  if (!accountsEnabled()) return Response.json({ enabled: false });
  const email = await sessionEmail();
  if (!email) return Response.json({ enabled: true, email: null });
  try {
    return Response.json({ enabled: true, email, progress: parseProgress(await findContact(email)) });
  } catch (error) {
    console.error("loading course progress failed", error);
    return Response.json({ enabled: true, email, progress: [] });
  }
}

export async function POST(request: Request) {
  const email = accountsEnabled() ? await sessionEmail() : null;
  if (!email) return Response.json({ error: "Not signed in." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const progress = Array.isArray(body.progress)
    ? [...new Set(body.progress.map(String).filter((slug: string) => LESSON_SLUGS.has(slug)))].sort()
    : [];
  try {
    await saveProgress(email, progress as string[]);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("saving course progress failed", error);
    return Response.json({ error: "Couldn't save right now." }, { status: 500 });
  }
}
