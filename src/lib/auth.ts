import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Passwordless sign-in for saving course progress: a signed, short-lived link
// is emailed, and clicking it sets a signed session cookie holding the email.

export const SESSION_COOKIE = "oy24_session";
const LINK_MINUTES = 30;
const SESSION_DAYS = 365;

type TokenPayload = { e: string; x: number; t: "link" | "session" };

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is not set");
  return value;
}

function sign(data: string) {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

function makeToken(payload: TokenPayload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

function readToken(token: string, type: TokenPayload["t"]): string | null {
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;
  const expected = Buffer.from(sign(data));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as TokenPayload;
    if (payload.t !== type || payload.x < Date.now()) return null;
    return payload.e;
  } catch {
    return null;
  }
}

export function makeLinkToken(email: string) {
  return makeToken({ e: email, x: Date.now() + LINK_MINUTES * 60_000, t: "link" });
}

export function readLinkToken(token: string) {
  return readToken(token, "link");
}

export function makeSessionToken(email: string) {
  return makeToken({ e: email, x: Date.now() + SESSION_DAYS * 86_400_000, t: "session" });
}

export const SESSION_MAX_AGE = SESSION_DAYS * 86_400;

export async function sessionEmail() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? readToken(token, "session") : null;
}

export function normalizeEmail(raw: unknown) {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254 ? email : null;
}

// The sign-in feature turns on only once every secret it needs is set in the environment.
export function accountsEnabled() {
  return Boolean(
    process.env.AUTH_SECRET && process.env.NOTION_TOKEN && process.env.NOTION_CRM_DATABASE_ID && process.env.RESEND_API_KEY,
  );
}
