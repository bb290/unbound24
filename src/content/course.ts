import lessonData from "./course-lessons.json";

// Lesson content started from the Own Your 24 lesson scripts in Notion.
// Every lesson follows one format: 3-5 key takeaways, the action, one section per takeaway
// (written as bullets), the action again, then the save-progress box.

export type LessonSection = {
  title: string;
  // A bullet may open with a bold lead-in: "**Plan:** step back..."
  bullets: string[];
};

export type LessonAction = {
  title: string;
  text: string;
  prompt?: string;
  // Heading for the prompt box; defaults to "Your Claude prompt".
  promptLabel?: string;
  // Lessons with more than one prompt list them here instead.
  prompts?: { title: string; prompt: string }[];
  // A downloadable Claude skill (zip in public/downloads).
  skill?: { label: string; href: string };
};

export type Lesson = {
  num: string;
  title: string;
  area: string;
  module: number;
  slug: string;
  status: "ready" | "soon";
  summary?: string;
  note?: string;
  takeaways?: string[];
  sections: LessonSection[];
  // "glossary" lessons (Nerd Alert) skip takeaways and the action: vocab, key terms, then resources.
  shape?: "glossary";
  resources?: { title: string; desc: string; href: string }[];
  action?: LessonAction;
  // YouTube video id, once the lesson video exists.
  video?: string;
};

export type Module = {
  id: number;
  title: string;
  description: string;
};

export const MODULES: Module[] = [
  { id: 0, title: "Start Here", description: "The framework, your foundation, and getting set up with Claude." },
  { id: 1, title: "Level 1: The foundation", description: "One brick in every area of your business." },
  { id: 2, title: "Level 2: Grow on purpose", description: "Build on the foundation you've laid." },
];

export const LESSONS = lessonData as Lesson[];

export const READY_LESSONS = LESSONS.filter((lesson) => lesson.status === "ready");

// One illustration per finished lesson; falls back to the brick stack.
const LESSON_ART: Record<string, { src: string; alt: string; width: number; height: number }> = {
  "0.2": { src: "/brick-house.webp", alt: "A proud stick figure leaning on a small house built from cyan bricks", width: 1000, height: 833 },
  "0.3": { src: "/hello-wave.webp", alt: "A smiling stick figure waving hello, holding a laptop", width: 1000, height: 951 },
  "0.4": { src: "/hello-wave.webp", alt: "A smiling stick figure waving hello, holding a laptop", width: 1000, height: 951 },
  "1.3": { src: "/habits-phone.webp", alt: "A smiling stick figure on the phone, with a check mark in a speech bubble", width: 1000, height: 833 },
  "1.4": { src: "/relaxed.webp", alt: "A happy stick figure relaxing in a lawn chair with a coffee, everything packed neatly in a box", width: 1000, height: 624 },
  "1.12": { src: "/brick-house.webp", alt: "A proud stick figure leaning on a small house built from cyan bricks", width: 1000, height: 833 },
};

export function lessonArt(lesson: Lesson) {
  return LESSON_ART[lesson.num] ?? { src: "/brick-stack.webp", alt: "A stick figure placing a cyan brick on a short stack of bricks", width: 1000, height: 889 };
}

export function getLesson(slug: string) {
  return READY_LESSONS.find((lesson) => lesson.slug === slug);
}

export function lessonsInModule(moduleId: number) {
  return LESSONS.filter((lesson) => lesson.module === moduleId);
}

export function neighbors(lesson: Lesson) {
  const index = READY_LESSONS.indexOf(lesson);
  return {
    prev: index > 0 ? READY_LESSONS[index - 1] : undefined,
    next: index < READY_LESSONS.length - 1 ? READY_LESSONS[index + 1] : undefined,
  };
}

export function readingMinutes(lesson: Lesson) {
  const words = [...(lesson.takeaways ?? []), ...lesson.sections.flatMap((section) => section.bullets)]
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
