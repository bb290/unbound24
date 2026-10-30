import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LESSONS, MODULES, READY_LESSONS, lessonsInModule } from "@/content/course";

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
  provider: { "@type": "Organization", name: "Unbound24", url: "https://unbound24.com" },
  isAccessibleForFree: true,
  inLanguage: "en",
  hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT10H" },
  hasPart: READY_LESSONS.map((lesson) => ({
    "@type": "LearningResource",
    name: `${lesson.num} ${lesson.title}`,
    url: `https://unbound24.com/course/${lesson.slug}`,
  })),
};

export default function CourseHome() {
  const first = READY_LESSONS[0];
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />

      <section className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-cyan-text text-sm font-extrabold tracking-widest uppercase mb-4">The free course</p>
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
                      <p className="text-sm font-extrabold text-cyan-text">{lesson.num}</p>
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
