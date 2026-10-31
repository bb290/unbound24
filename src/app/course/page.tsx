import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LESSONS, MODULES, READY_LESSONS, lessonsInModule } from "@/content/course";
import { ProgressSummary } from "./Progress";
import { SaveProgress } from "./Account";

export const metadata: Metadata = {
  title: "Own Your 24: A free business course for home service owners",
  description:
    "A free, step-by-step course for plumbers, electricians, HVAC techs and roofers. Document how your business runs, one short lesson at a time, with Claude doing the writing.",
  alternates: { canonical: "/course" },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Own Your 24",
  description:
    "A free course for home service business owners: document your processes, systems and numbers one lesson at a time, using Claude to do the writing.",
  provider: { "@type": "Organization", name: "Unbound24", url: "https://www.unbound24.com" },
  isAccessibleForFree: true,
  inLanguage: "en",
  hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT10H" },
  hasPart: READY_LESSONS.map((lesson) => ({
    "@type": "LearningResource",
    name: `${lesson.num} ${lesson.title}`,
    url: `https://www.unbound24.com/course/${lesson.slug}`,
  })),
};

// What this course is and who it's for (moved here from the old lesson 0.2, 2026-10-31).
const ABOUT = [
  {
    title: "Why it's called Own Your 24",
    bullets: [
      "There are only 24 hours in a day, and at least half of them go to doing the actual work. You also have your family, your health, and your responsibilities at home.",
      "This course is about using the time you do have to build the business, instead of spending it on countless courses, new systems, and getting pulled in 200 directions.",
      "I've been in business since 2010, and I've spent my share of time and money on courses, templates, and apps that never quite fit. If that sounds familiar, you're in the right place.",
      "I'm giving this course away for free because local service businesses are the backbone of our economy.",
    ],
  },
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
      "You cycle through the same coursework, and each pass builds on the foundation you've already laid. Grow as big as you want, or keep it small and tight.",
      "This is also an AI course. Claude asks you the questions and writes it all down. You learn AI by using it on your own business.",
      "No \"have to's.\" I'll walk you through the pros and cons of each choice, and you decide what fits your business.",
    ],
  },
];

export default function CourseHome() {
  const first = READY_LESSONS[0];
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />

      <section className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-magenta-text text-sm font-extrabold tracking-widest uppercase mb-4">The free course</p>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">Own Your 24</h1>
          <p className="mt-5 text-lg text-muted leading-relaxed sm:text-xl">
            Build your business one brick at a time. Short lessons, one Action each, and a Claude
            prompt that does the writing for you. Free, no sign-up, go at your own pace.
          </p>
          {first && (
            <Link
              href={`/course/${first.slug}`}
              className="inline-flex items-center gap-3 mt-8 px-8 py-4 rounded-full bg-cyan text-lg font-extrabold hover:brightness-95 transition"
            >
              Start with lesson {first.num} <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
        <Image
          src="/brick-stack.webp"
          alt="A stick figure placing a cyan brick on a short stack of bricks"
          width={1000}
          height={889}
          priority
          className="w-full max-w-sm h-auto mx-auto"
        />
      </section>

      <ProgressSummary />
      <div className="mt-4">
        <SaveProgress />
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {ABOUT.map((block, i) => (
          <section key={block.title} className="p-6 rounded-3xl bg-card border border-line">
            <h2 className="text-2xl font-black tracking-tight">
              <span className={i % 2 ? "text-magenta-text" : "text-cyan-text"}>{i + 1}.</span> {block.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {block.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 leading-relaxed">
                  <span className="mt-[0.6rem] w-2 h-2 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-16 flex flex-col gap-10">
        {MODULES.map((module) => {
          const lessons = lessonsInModule(module.id);
          return (
            <section key={module.id}>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{module.title}</h2>
              <p className="mt-2 text-muted">{module.description}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {lessons.map((lesson) =>
                  lesson.status === "ready" ? (
                    <Link
                      key={lesson.num}
                      href={`/course/${lesson.slug}`}
                      className="group p-5 rounded-3xl bg-card border border-line hover:border-cyan transition"
                    >
                      <p className="text-sm font-extrabold text-magenta-text">{lesson.num}</p>
                      <h3 className="mt-1 text-lg font-extrabold group-hover:underline">{lesson.title}</h3>
                      {lesson.summary && <p className="mt-2 text-muted leading-relaxed">{lesson.summary}</p>}
                    </Link>
                  ) : (
                    <div key={lesson.num} className="p-5 rounded-3xl border border-dashed border-line">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-extrabold text-muted">{lesson.num}</p>
                        <span className="rounded-full bg-card border border-line px-2.5 py-0.5 text-xs font-bold text-muted">
                          Coming soon
                        </span>
                      </div>
                      <h3 className="mt-1 text-lg font-extrabold text-muted">{lesson.title}</h3>
                      {lesson.note && <p className="mt-2 text-muted leading-relaxed">{lesson.note}</p>}
                    </div>
                  ),
                )}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-12 text-sm text-muted">
        {`${READY_LESSONS.length} of ${LESSONS.length} lessons are live. New lessons are added as they're finished.`}
      </p>
    </div>
  );
}
