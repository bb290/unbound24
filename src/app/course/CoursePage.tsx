import Image from "next/image";
import Link from "next/link";
import { COURSES, lessonsInCourse, type Course } from "@/content/course";
import AboutCards, { type AboutBlock } from "./AboutCards";
import LessonCards from "./LessonCards";
import { ProgressSummary } from "./Progress";

// Own Your 24 is the Start Here course, so its page explains the name (moved from the library page, 2026-11-01).
const WHY_OWN_YOUR_24: AboutBlock = {
  title: "Why it's called Own Your 24",
  bullets: [
    "There are only 24 hours in a day, and at least half of them go to doing the actual work. You also have your family, your health, and your responsibilities at home.",
    "This course is about using the time you do have to build the business, instead of spending it on countless courses, new systems, and getting pulled in 200 directions.",
    "I've been in business since 2010, and I've spent my share of time and money on courses, templates, and apps that never quite fit. If that sounds familiar, you're in the right place.",
    "I'm giving this course away for free because local service businesses are the backbone of our economy.",
  ],
};

export default function CoursePage({ course }: { course: Course }) {
  const lessons = lessonsInCourse(course.slug);
  const ready = lessons.filter((lesson) => lesson.status === "ready");
  const first = ready[0];
  const index = COURSES.indexOf(course);
  const nextCourse = COURSES[index + 1];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: `https://www.unbound24.com/course/${course.slug}`,
    provider: { "@type": "Organization", name: "Unbound24", url: "https://www.unbound24.com" },
    isAccessibleForFree: true,
    inLanguage: "en",
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
    hasPart: ready.map((lesson) => ({
      "@type": "LearningResource",
      name: lesson.title,
      url: `https://www.unbound24.com/course/${lesson.slug}`,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p className="text-sm font-bold text-muted">
        <Link href="/course" className="hover:text-foreground">All courses</Link>
      </p>

      <section className="mt-4 grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-magenta-text text-sm font-extrabold tracking-widest uppercase">
            Course {course.num} &middot; {course.topic}
          </p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight sm:text-6xl">{course.title}</h1>
          <p className="mt-5 text-lg text-muted leading-relaxed sm:text-xl">{course.description}</p>
          {first ? (
            <Link
              href={`/course/${first.slug}`}
              className="inline-flex items-center gap-3 mt-8 px-8 py-4 rounded-full bg-cyan text-lg font-extrabold hover:brightness-95 transition"
            >
              Start with {first.title} <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            <p className="inline-flex mt-8 rounded-full bg-card border border-line px-5 py-2 font-extrabold text-muted">
              Coming soon
            </p>
          )}
        </div>
        <Image
          src="/brick-stack.webp"
          alt="A stick figure placing a cyan brick on a short stack of bricks"
          width={1000}
          height={889}
          priority
          className="w-full max-w-xs h-auto mx-auto"
        />
      </section>

      <ProgressSummary courseSlug={course.slug} />

      {course.slug === "own-your-24" && (
        <div className="mt-12">
          <AboutCards blocks={[WHY_OWN_YOUR_24]} />
        </div>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Lessons</h2>
        <p className="mt-2 text-muted">
          {ready.length > 0
            ? `${ready.length} of ${lessons.length} lessons are live. New lessons are added as they're finished.`
            : "Lessons are on the way. Here's what's coming."}
        </p>
        <div className="mt-5">
          <LessonCards lessons={lessons} />
        </div>
      </section>

      {nextCourse && (
        <Link
          href={`/course/${nextCourse.slug}`}
          className="mt-12 block p-5 rounded-3xl border border-line hover:border-cyan transition sm:text-right"
        >
          <p className="text-sm font-bold text-muted">Next course &rarr;</p>
          <p className="mt-1 font-extrabold">{nextCourse.title}</p>
        </Link>
      )}
    </div>
  );
}
