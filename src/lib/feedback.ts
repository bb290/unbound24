// Lesson feedback goes to the Unbound24 Notion "Course feedback" database.
// Needs NOTION_TOKEN (the same integration as the CRM) and NOTION_FEEDBACK_DATABASE_ID.

import { FEEDBACK_QUESTIONS, OTHER } from "@/content/feedback";

export type FeedbackAnswer = { choice: string; other: string };

export function feedbackEnabled() {
  return Boolean(process.env.NOTION_TOKEN && process.env.NOTION_FEEDBACK_DATABASE_ID);
}

const text = (content: string) => ({ rich_text: content ? [{ type: "text", text: { content: content.slice(0, 1900) } }] : [] });

export async function saveFeedback(lesson: { num: string; title: string; url: string }, answers: Record<string, FeedbackAnswer>) {
  const properties: Record<string, unknown> = {
    Response: { title: [{ type: "text", text: { content: `${lesson.num} ${lesson.title}` } }] },
    Lesson: { select: { name: `${lesson.num} ${lesson.title}` } },
    Submitted: { date: { start: new Date().toISOString() } },
    Page: { url: lesson.url },
  };
  for (const question of FEEDBACK_QUESTIONS) {
    const answer = answers[question.id];
    if (!answer?.choice) continue;
    properties[question.column] = { select: { name: answer.choice } };
    if (answer.choice === OTHER) properties[`${question.column} (other)`] = text(answer.other.trim());
  }
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ parent: { database_id: process.env.NOTION_FEEDBACK_DATABASE_ID }, properties }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Notion feedback save failed: ${response.status}`);
}
