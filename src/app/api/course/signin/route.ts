import { accountsEnabled, makeLinkToken, normalizeEmail } from "@/lib/auth";
import { recordSignIn } from "@/lib/crm";
import { sendSignInLink } from "@/lib/email";

export async function POST(request: Request) {
  if (!accountsEnabled()) return Response.json({ error: "Saving progress isn't available yet." }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  // Hidden "website" field: people never fill it in, form-filling bots do.
  if (body.website) return Response.json({ ok: true });

  const email = normalizeEmail(body.email);
  if (!email) return Response.json({ error: "Please enter a valid email address." }, { status: 400 });

  try {
    const shouldSend = await recordSignIn(email, body.lessonEmails === true);
    if (shouldSend) {
      const link = `${new URL(request.url).origin}/api/course/verify?token=${encodeURIComponent(makeLinkToken(email))}`;
      await sendSignInLink(email, link);
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("course sign-in failed", error);
    return Response.json({ error: "Something went wrong. Please try again in a minute." }, { status: 500 });
  }
}
