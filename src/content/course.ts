import lessonData from "./course-lessons.json";

// Lesson content started from the Own Your 24 lesson scripts in Notion.
// The course library (2026-11-02, matches Notion): Hands-On AI as a Power Tool is the Start Here course
// (Own Your 24 is its lesson 1.2), then Get It Out of Your Head (the foundation), then the four pillars in CODE order: Capture + Obtain, Deliver, Extend (2026-11-08).
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
  // Numbered steps shown above the prompt, when the action is more than "paste this prompt".
  steps?: { title: string; text: string }[];
  // A short screen-recorded walkthrough of the action (YouTube video id).
  helper?: { label: string; video: string };
};

export type Lesson = {
  num: string;
  title: string;
  // Which course the lesson belongs to (a COURSES slug).
  course: string;
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

export type Course = {
  slug: string;
  num: number;
  title: string;
  // What part of the business it covers, in plain words.
  topic: string;
  description: string;
};

export const COURSES: Course[] = [
  {
    slug: "hands-on-ai",
    num: 1,
    title: "Hands-On AI as a Power Tool",
    topic: "Start here",
    description:
      "Hands-on AI for home service owners. Break your business down, focus on one project at a time, set up Claude, and build the scaffolding that holds it all together. AI is a power tool: it helps you build, it doesn't build for you.",
  },
  {
    slug: "get-it-out-of-your-head",
    num: 2,
    title: "Get It Out of Your Head",
    topic: "Documentation & Data",
    description:
      "Write down how your business runs and track the numbers that matter, so your team (and AI) can follow along without calling you. Then turn it into Claude skills that do the work with you.",
  },
  {
    slug: "book-the-right-customers",
    num: 3,
    title: "Book the Right Customers",
    topic: "Capture, Obtain & Brand",
    description:
      "Know who you serve, be easy to find, and make it easy to say yes. Your brand, website, Google, and social media basics.",
  },
  {
    slug: "same-great-job",
    num: 4,
    title: "Same Great Job, Every Time",
    topic: "Deliver",
    description: "Define your services, do them the same way every time, and own it when something goes wrong.",
  },
  {
    slug: "customers-for-life",
    num: 5,
    title: "Customers for Life",
    topic: "Extend",
    description:
      "Keep the relationship going after the job: ask for feedback, earn five-star reviews, get referrals, and be the one they call next time.",
  },
];

export const LESSONS = lessonData as Lesson[];

export const READY_LESSONS = LESSONS.filter((lesson) => lesson.status === "ready");

// One illustration per finished lesson (keyed by slug); falls back to the brick stack.
const LESSON_ART: Record<string, { src: string; alt: string; width: number; height: number }> = {
  "business-breakdown": { src: "/brick-house.webp", alt: "A proud stick figure leaning on a small house built from cyan bricks", width: 1000, height: 833 },
  "own-your-24": { src: "/relaxed.webp", alt: "A happy stick figure relaxing in a lawn chair with a coffee, everything it was juggling packed in a cyan box beside it", width: 1000, height: 624 },
  "job-site-prep": { src: "/calc-crystal.webp", alt: "A stick figure in a cap and glasses holding a calculator in one hand and a glowing crystal ball in the other", width: 875, height: 890 },
  "lay-the-foundation": { src: "/inspect-foundation.webp", alt: "A stick figure in a cap kneeling with a magnifying glass, inspecting cracks in a foundation", width: 934, height: 868 },
  "nerd-alert": { src: "/nerd-alert.webp", alt: "A smiling stick figure in round glasses, a cap, and a bow tie, reading an open book", width: 581, height: 1048 },
  "boss-skill": { src: "/boss-coach.webp", alt: "A cheerful stick figure coach with a whistle, holding a clipboard checklist", width: 829, height: 1048 },
  "custom-skills": { src: "/brick-house.webp", alt: "A proud stick figure leaning on a small house built from cyan bricks", width: 1000, height: 833 },
};

export function lessonArt(lesson: Lesson) {
  return LESSON_ART[lesson.slug] ?? { src: "/brick-stack.webp", alt: "A stick figure placing a cyan brick on a short stack of bricks", width: 1000, height: 889 };
}

export function getLesson(slug: string) {
  return READY_LESSONS.find((lesson) => lesson.slug === slug);
}

export function getCourse(slug: string) {
  return COURSES.find((course) => course.slug === slug);
}

export function lessonsInCourse(courseSlug: string) {
  return LESSONS.filter((lesson) => lesson.course === courseSlug);
}

export function courseOf(lesson: Lesson) {
  return getCourse(lesson.course)!;
}

// Prev/next run through every live lesson in course order, so the last lesson of one course
// leads into the next course.
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
