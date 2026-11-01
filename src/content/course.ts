import lessonData from "./course-lessons.json";

// Lesson content started from the Own Your 24 lesson scripts in Notion.
// The course library (2026-11-01): Own Your 24 is the Start Here course, then one course per part of the house.
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
    slug: "own-your-24",
    num: 1,
    title: "Own Your 24",
    topic: "Start here",
    description:
      "You only have 24 hours in a day. Get the most out of them: one project at a time, an Idea Bank for every great idea, and fallback tasks for the days you can't focus. Plus the Business Breakdown, so you know which project comes next.",
  },
  {
    slug: "put-ai-to-work",
    num: 2,
    title: "Put AI to Work",
    topic: "AI",
    description:
      "Essential AI skills for home service owners. Set up Claude, connect your tools, and build skills that do real work. AI is only as good as what you've written down, so this course pairs with Get It Out of Your Head.",
  },
  {
    slug: "get-it-out-of-your-head",
    num: 3,
    title: "Get It Out of Your Head",
    topic: "Documentation & Data",
    description:
      "Write down how your business runs and track the numbers that matter, so your team (and AI) can follow along without calling you.",
  },
  {
    slug: "same-great-job",
    num: 4,
    title: "Same Great Job, Every Time",
    topic: "Delivery",
    description: "Define your services, do them the same way every time, and own it when something goes wrong.",
  },
  {
    slug: "earn-the-5-stars",
    num: 5,
    title: "Earn the 5 Stars",
    topic: "Reputation",
    description: "Keep your promises, earn five-star reviews, put them to work, and handle the bad ones with class.",
  },
  {
    slug: "book-the-right-customers",
    num: 6,
    title: "Book the Right Customers",
    topic: "Attract, Convert & Brand",
    description:
      "Know who you serve, be easy to find, and make it easy to say yes. Your brand, website, Google, and social media basics.",
  },
  {
    slug: "customers-for-life",
    num: 7,
    title: "Customers for Life",
    topic: "Retain",
    description: "Keep customers coming back, and sending their friends.",
  },
];

export const LESSONS = lessonData as Lesson[];

export const READY_LESSONS = LESSONS.filter((lesson) => lesson.status === "ready");

// One illustration per finished lesson (keyed by slug); falls back to the brick stack.
const LESSON_ART: Record<string, { src: string; alt: string; width: number; height: number }> = {
  "business-breakdown": { src: "/brick-house.webp", alt: "A proud stick figure leaning on a small house built from cyan bricks", width: 1000, height: 833 },
  "ai-set-up": { src: "/hello-wave.webp", alt: "A smiling stick figure waving hello, holding a laptop", width: 1000, height: 951 },
  "nerd-alert": { src: "/nerd-alert.webp", alt: "A smiling stick figure in round glasses, a cap, and a bow tie, reading an open book", width: 581, height: 1048 },
  "connectors": { src: "/connectors-laptop.webp", alt: "A happy stick figure plugging cords into a laptop", width: 1048, height: 675 },
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
