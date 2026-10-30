// Course sign-ups and progress live in the Unbound24 Notion CRM database.
// Columns used: Email, Source, Course progress, Lesson emails, Signed up, Last active, Last sign-in link.

const NOTION_API = "https://api.notion.com/v1";
const SOURCE = "Own Your 24 course";

type NotionPage = { id: string; properties: Record<string, any> }; // eslint-disable-line @typescript-eslint/no-explicit-any

async function notion(path: string, method: string, body?: unknown) {
  const response = await fetch(`${NOTION_API}/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Notion ${method} ${path} failed: ${response.status}`);
  return response.json();
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function findContact(email: string): Promise<NotionPage | null> {
  const result = await notion(`databases/${process.env.NOTION_CRM_DATABASE_ID}/query`, "POST", {
    filter: { property: "Email", email: { equals: email } },
    page_size: 1,
  });
  return result.results[0] ?? null;
}

// Creates the CRM row on first sign-up; otherwise records the new link time and email preference.
// Returns false when a link was sent less than a minute ago, to stop repeated sends.
export async function recordSignIn(email: string, lessonEmails: boolean): Promise<boolean> {
  const now = new Date().toISOString();
  const contact = await findContact(email);
  if (!contact) {
    await notion("pages", "POST", {
      parent: { database_id: process.env.NOTION_CRM_DATABASE_ID },
      properties: {
        Name: { title: [] },
        Email: { email },
        Source: { select: { name: SOURCE } },
        "Lesson emails": { checkbox: lessonEmails },
        "Signed up": { date: { start: today() } },
        "Last sign-in link": { date: { start: now } },
      },
    });
    return true;
  }
  const lastLink = contact.properties["Last sign-in link"]?.date?.start;
  if (lastLink && Date.now() - new Date(lastLink).getTime() < 60_000) return false;
  const properties: Record<string, unknown> = { "Last sign-in link": { date: { start: now } } };
  if (lessonEmails) properties["Lesson emails"] = { checkbox: true };
  await notion(`pages/${contact.id}`, "PATCH", { properties });
  return true;
}

export function parseProgress(contact: NotionPage | null): string[] {
  const text = (contact?.properties["Course progress"]?.rich_text ?? [])
    .map((part: { plain_text: string }) => part.plain_text)
    .join("");
  return text.split(",").map((item: string) => item.trim()).filter(Boolean);
}

export async function saveProgress(email: string, progress: string[]) {
  const contact = await findContact(email);
  if (!contact) return;
  await notion(`pages/${contact.id}`, "PATCH", {
    properties: {
      "Course progress": { rich_text: [{ type: "text", text: { content: progress.join(", ") } }] },
      "Last active": { date: { start: today() } },
    },
  });
}
