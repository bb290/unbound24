import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE, accountsEnabled, makeSessionToken, readLinkToken } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = accountsEnabled() ? readLinkToken(url.searchParams.get("token") ?? "") : null;
  if (!email) return Response.redirect(new URL("/course?signin=expired", url.origin), 303);

  (await cookies()).set(SESSION_COOKIE, makeSessionToken(email), {
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return Response.redirect(new URL("/course?signin=done", url.origin), 303);
}
