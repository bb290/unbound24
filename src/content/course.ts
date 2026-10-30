import lessonData from "./course-lessons.json";

// Lesson content comes from the Own Your 24 lesson scripts in Notion.
// Sections are the scripts' talk tracks: "part" starts a new part of the lesson, "step" is one idea.

export type LessonSection = {
  kind: "part" | "step";
  title: string;
  paras: string[];
};

export type LessonAction = {
  title: string;
  text: string;
  prompt?: string;
};

export type Lesson = {
  num: string;
  title: string;
  area: string;
  module: number;
  slug: string;
  status: "ready" | "soon";
  summary?: string;
  intro?: string;
  note?: string;
  sections: LessonSection[];
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
  "0.1": { src: "/brick-house.webp", alt: "A proud stick figure leaning on a small house built from cyan bricks", width: 1000, height: 833 },
  "0.2": { src: "/hero-juggling.webp", alt: "A stick figure juggling a phone, a clipboard, a wrench, a calendar, a mug, a house and papers", width: 960, height: 724 },
  "0.3": { src: "/hello-wave.webp", alt: "A smiling stick figure waving hello, holding a laptop", width: 1000, height: 951 },
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
  const words = [lesson.intro ?? "", ...lesson.sections.flatMap((section) => section.paras)]
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
