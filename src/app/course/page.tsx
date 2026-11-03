import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { COURSES, LESSONS, READY_LESSONS, lessonsInCourse } from "@/content/course";
import AboutCards, { type AboutBlock } from "./AboutCards";
import { ProgressSummary } from "./Progress";
import { SaveProgress } from "./Account";

export const metadata: Metadata = {
  title: "Free courses for home service business owners | Unbound24",
  description:
    "Free, step-by-step courses for plumbers, electricians, HVAC techs and roofers. Start with Hands-On AI as a Power Tool, then pick the course for the part of your business that needs you most.",
  alternates: { canonical: "/course" },
};

const libraryJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Unbound24 courses",
  itemListElement: COURSES.map((course, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `https://www.unbound24.com/course/${course.slug}`,
    name: course.title,
  })),
};

// Who the courses are for and how they work. "Why it's called Own Your 24" is now lesson 1.2's first section (2026-11-02).
const ABOUT: AboutBlock[] = [
  {
    title: "Who it's for",
    bullets: [
      "Home service trades: plumbers, electricians, HVAC, roofers.",
      "You've been in business at least a year. You know how to do the job, get paid, and keep customers happy, so I won't teach you business basics.",
      "You're the expert at your craft. Where most of us struggle is the computer side: websites, SEO, CRMs, invoicing, and systems.",
      "It's not for product businesses, e-commerce, online businesses, or coaches and consultants. Under a year in? Focus on getting jobs and doing great work first, then come back.",
    ],
  },
  {
    title: "How it works",
    bullets: [
      "Step by step, at your own pace. There's no timeline: three months or the rest of your life are both fine.",
      "Start with Hands-On AI as a Power Tool, then pick the course for the part of your business that needs you most. The courses link to each other, because everything in your business is connected.",
      "AI runs through all of it. Claude asks you the questions and writes it all down. You learn AI by using it on your own business.",
      "No \"have to's.\" I'll walk you through the pros and cons of each choice, and you decide what fits your business.",
    ],
  },
];

export default function CourseLibrary() {
  const [start, ...topics] = COURSES;
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(libraryJsonLd) }} />

      <section className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-magenta-text text-sm font-extrabold tracking-widest uppercase mb-4">Free courses</p>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">Build it brick by brick</h1>
          <p className="mt-5 text-lg text-muted leading-relaxed sm:text-xl">
            Start with Hands-On AI as a Power Tool, then pick the course for the part of your business that needs you most. Short
            lessons, one Action each, and a Claude prompt that does the writing for you. Free, no sign-up, go at
            your own pace.
          </p>
          <Link
            href={`/course/${start.slug}`}
            className="inline-flex items-center gap-3 mt-8 px-8 py-4 rounded-full bg-cyan text-lg font-extrabold hover:brightness-95 transition"
          >
            Start with {start.title} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <Image
          src="/brick-house.webp"
          alt="A proud stick figure leaning on a small house built from cyan bricks"
          width={1000}
          height={833}
          priority
          className="w-full max-w-sm h-auto mx-auto"
        />
      </section>

      <ProgressSummary />
      <div className="mt-4">
        <SaveProgress />
      </div>

      <section className="mt-16" aria-labelledby="start-here">
        <h2 id="start-here" className="text-magenta-text text-sm font-extrabold tracking-widest uppercase">
          Start here
        </h2>
        <div className="mt-4">
          <CourseCard course={start} featured />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="topic-courses">
        <h2 id="topic-courses" className="text-2xl font-black tracking-tight sm:text-3xl">
          Then pick your next project
        </h2>
        <p className="mt-2 text-muted">One course for each part of your business.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {topics.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>

      <div className="mt-16">
        <AboutCards blocks={ABOUT} />
      </div>

      <p className="mt-12 text-sm text-muted">
        {`${READY_LESSONS.length} of ${LESSONS.length} lessons are live. New lessons are added as they're finished.`}
      </p>
    </div>
  );
}

function CourseCard({ course, featured = false }: { course: (typeof COURSES)[number]; featured?: boolean }) {
  const lessons = lessonsInCourse(course.slug);
  const live = lessons.filter((lesson) => lesson.status === "ready").length;
  return (
    <Link
      href={`/course/${course.slug}`}
      className={`group block p-6 rounded-3xl border transition ${
        featured ? "bg-highlight border-cyan hover:brightness-[0.98]" : "bg-card border-line hover:border-cyan"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold text-magenta-text">
          Course {course.num} &middot; {course.topic}
        </p>
        <span className="shrink-0 rounded-full bg-background border border-line px-2.5 py-0.5 text-xs font-bold text-muted">
          {live > 0 ? `${live} of ${lessons.length} lessons live` : "Coming soon"}
        </span>
      </div>
      <h3 className={`mt-2 font-black tracking-tight group-hover:underline ${featured ? "text-3xl" : "text-2xl"}`}>
        {course.title}
      </h3>
      <p className="mt-2 text-muted leading-relaxed">{course.description}</p>
    </Link>
  );
}
