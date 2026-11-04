import { READY_LESSONS } from "@/content/course";
import { FEEDBACK_QUESTIONS, OTHER } from "@/content/feedback";
import { feedbackEnabled, saveFeedback, type FeedbackAnswer } from "@/lib/feedback";

export async function POST(request: Request) {
  if (!feedbackEnabled()) return Response.json({ error: "Feedback isn't switched on yet." }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  const lesson = READY_LESSONS.find((item) => item.slug === body.slug);
  if (!lesson) return Response.json({ error: "Unknown lesson." }, { status: 400 });

  // Keep only known options; "Other" carries its own text.
  const answers: Record<string, FeedbackAnswer> = {};
  for (const question of FEEDBACK_QUESTIONS) {
    const raw = body.answers?.[question.id] ?? {};
    const choice = String(raw.choice ?? "");
    if (choice === OTHER || question.options.includes(choice)) {
      answers[question.id] = { choice, other: choice === OTHER ? String(raw.other ?? "").slice(0, 1000) : "" };
    }
  }
  if (Object.keys(answers).length === 0) return Response.json({ error: "Pick at least one answer." }, { status: 400 });

  try {
    await saveFeedback({ num: lesson.num, title: lesson.title, url: `https://www.unbound24.com/course/${lesson.slug}` }, answers);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("saving lesson feedback failed", error);
    return Response.json({ error: "Couldn't send that right now. Try again in a minute." }, { status: 500 });
  }
}
