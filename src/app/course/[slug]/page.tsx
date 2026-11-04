import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COURSES, READY_LESSONS, courseOf, getCourse, getLesson, lessonArt, neighbors, readingMinutes, type Lesson } from "@/content/course";
import CoursePage from "../CoursePage";
import PromptBox from "../PromptBox";
import { LessonCta } from "../Account";
import Feedback from "../Feedback";
import { feedbackEnabled } from "@/lib/feedback";

export const dynamicParams = false;

// /course/<slug> is either a course page or a lesson; their slugs never overlap.
export function generateStaticParams() {
  return [...COURSES, ...READY_LESSONS].map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (course) {
    return {
      title: `${course.title}: a free course for home service owners | Unbound24`,
      description: course.description,
      alternates: { canonical: `/course/${course.slug}` },
      openGraph: { url: `/course/${course.slug}`, images: [{ url: `/og/course-${course.slug}.png`, width: 1200, height: 630, alt: course.title }] },
      twitter: { card: "summary_large_image", images: [`/og/course-${course.slug}.png`] },
    };
  }
  const lesson = getLesson(slug);
  if (!lesson) return {};
  // Link previews (iMessage, Slack, social): a 1200x630 card per lesson in public/og/.
  const image = { url: `https://www.unbound24.com/og/${lesson.slug}.png`, width: 1200, height: 630, alt: `Lesson ${lesson.num}: ${lesson.title}` };
  return {
    title: `${lesson.title} | ${courseOf(lesson).title}`,
    description: lesson.summary,
    alternates: { canonical: `/course/${lesson.slug}` },
    openGraph: { title: `${lesson.title} | ${courseOf(lesson).title}`, description: lesson.summary, url: `https://www.unbound24.com/course/${lesson.slug}`, type: "article", images: [image] },
    twitter: { card: "summary_large_image", images: [image.url] },
  };
}

export default async function CourseOrLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (course) return <CoursePage course={course} />;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return <LessonPage lesson={lesson} />;
}

function LessonPage({ lesson }: { lesson: Lesson }) {
  const course = courseOf(lesson);
  const { prev, next } = neighbors(lesson);
  const art = lessonArt(lesson);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LearningResource",
        name: `${lesson.num} ${lesson.title}`,
        description: lesson.summary,
        url: `https://www.unbound24.com/course/${lesson.slug}`,
        isAccessibleForFree: true,
        learningResourceType: "Lesson",
        isPartOf: { "@type": "Course", name: course.title, url: `https://www.unbound24.com/course/${course.slug}` },
        author: { "@type": "Person", name: "Brittany French" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Courses", item: "https://www.unbound24.com/course" },
          { "@type": "ListItem", position: 2, name: course.title, item: `https://www.unbound24.com/course/${course.slug}` },
          { "@type": "ListItem", position: 3, name: lesson.title, item: `https://www.unbound24.com/course/${lesson.slug}` },
        ],
      },
    ],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p className="text-sm font-bold text-muted">
        <Link href="/course" className="hover:text-foreground">Courses</Link>
        <span aria-hidden="true"> / </span>
        <Link href={`/course/${course.slug}`} className="hover:text-foreground">{course.title}</Link>
      </p>

      <header className="mt-4 grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-magenta-text text-sm font-extrabold tracking-widest uppercase">Lesson {lesson.num}</p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight sm:text-5xl">{lesson.title}</h1>
          <p className="mt-4 text-sm font-bold text-muted">
            {readingMinutes(lesson)} min read{lesson.action ? " · 1 Action" : ""}
          </p>
          {lesson.summary && <p className="mt-5 text-lg text-muted leading-relaxed sm:text-xl">{lesson.summary}</p>}
        </div>
        <Image src={art.src} alt={art.alt} width={art.width} height={art.height} priority className="w-full max-w-[14rem] md:max-w-xs h-auto max-h-56 md:max-h-64 object-contain mx-auto" />
      </header>

      {lesson.video && (
        <div className="mt-10 aspect-video rounded-3xl overflow-hidden border border-line">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${lesson.video}`}
            title={`Video: ${lesson.title}`}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}

      {lesson.takeaways && (
        <section className="mt-12 max-w-3xl" aria-labelledby="takeaways">
          <h2 id="takeaways" className="text-magenta-text text-sm font-extrabold tracking-widest uppercase">
            Key Takeaways
          </h2>
          <ol className="mt-4 divide-y divide-line border-y border-line">
            {lesson.takeaways.map((takeaway, i) => (
              <li key={i} className="flex gap-5 py-4">
                <span className={`w-8 shrink-0 text-3xl font-black leading-none ${i % 2 ? "text-magenta-text" : "text-cyan-text"}`}>
                  {i + 1}
                </span>
                <span className="text-lg font-bold leading-snug">{takeaway}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {lesson.action && <ActionBox lesson={lesson} />}

      {lesson.shape === "glossary" ? (
        <Glossary lesson={lesson} />
      ) : (
        <div className="mt-16 max-w-3xl">
          {lesson.sections.map((section, i) => (
            <section key={i} className="mt-14 first:mt-0 pt-8 border-t-4 border-magenta">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                <span className="text-magenta-text">{i + 1}.</span> {section.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {section.bullets.map((bullet, j) => (
                  <li key={j} className="flex gap-3 text-lg leading-relaxed">
                    <span className="mt-[0.7rem] w-2 h-2 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
                    <span>
                      <Bullet text={bullet} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {lesson.action && <ActionBox lesson={lesson} />}

      {feedbackEnabled() && <Feedback slug={lesson.slug} />}

      <LessonCta slug={lesson.slug} />

      <nav aria-label="Lesson navigation" className="mt-8 grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link href={`/course/${prev.slug}`} className="p-5 rounded-3xl border border-line hover:border-cyan transition">
            <p className="text-sm font-bold text-muted">&larr; Previous</p>
            <p className="mt-1 font-extrabold">{prev.num} {prev.title}</p>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/course/${next.slug}`} className="p-5 rounded-3xl bg-cyan hover:brightness-95 transition sm:text-right">
            <p className="text-sm font-bold">Next lesson &rarr;</p>
            <p className="mt-1 font-extrabold">{next.num} {next.title}</p>
          </Link>
        )}
      </nav>
    </article>
  );
}

function ActionBox({ lesson }: { lesson: Lesson }) {
  const action = lesson.action!;
  return (
    <section className="mt-16 rounded-3xl bg-highlight border border-cyan p-6 sm:p-8">
      <p className="text-magenta-text text-sm font-extrabold tracking-widest uppercase">Your Action</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{action.title}</h2>
      <p className="mt-3 text-lg leading-relaxed">{action.text}</p>
      {action.steps && (
        <ol className="mt-6 space-y-4">
          {action.steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className={`w-8 shrink-0 text-3xl font-black leading-none ${i % 2 ? "text-magenta-text" : "text-cyan-text"}`}>{i + 1}</span>
              <span className="text-lg leading-relaxed">
                <strong className="font-extrabold">{step.title}.</strong> {step.text}
              </span>
            </li>
          ))}
        </ol>
      )}
      {action.helper && (
        <div className="mt-6">
          <p className="text-sm font-extrabold tracking-widest uppercase text-magenta-text">{action.helper.label}</p>
          <div className="mt-2 aspect-video rounded-2xl overflow-hidden border border-line">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${action.helper.video}`}
              title={`${action.helper.label}: ${lesson.title}`}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
      {action.skill && (
        <a
          href={action.skill.href}
          download
          className="inline-flex items-center gap-3 mt-6 px-7 py-3.5 rounded-full bg-cyan text-lg font-extrabold hover:brightness-95 transition"
        >
          {action.skill.label} <span aria-hidden="true">&darr;</span>
        </a>
      )}
      {action.prompt && (
        <PromptBox
          prompt={action.prompt}
          title={action.promptLabel}
          filename={`unbound24-${lesson.slug}-${action.skill ? "SKILL.md" : "prompt.txt"}`}
        />
      )}
      {action.prompts?.map((item, i) => (
        <PromptBox
          key={item.title}
          prompt={item.prompt}
          title={item.title}
          filename={`unbound24-${lesson.slug}-prompt-${i + 1}.txt`}
        />
      ))}
    </section>
  );
}

// Renders a bullet's optional bold lead-in: "**Plan:** step back..."
function Bullet({ text }: { text: string }) {
  const match = text.match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/);
  if (!match) return <>{text}</>;
  return (
    <>
      <strong className="font-extrabold">{match[1]}</strong> {match[2]}
    </>
  );
}

function Glossary({ lesson }: { lesson: Lesson }) {
  return (
    <div className="mt-12">
      {lesson.sections.map((section) => (
        <section key={section.title} className="mt-14 first:mt-0 pt-8 border-t-4 border-magenta">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{section.title}</h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {section.bullets.map((bullet) => {
              const match = bullet.match(/^\*\*(.+?):\*\*\s*([\s\S]*)$/);
              return (
                <div key={bullet} className="p-5 rounded-3xl bg-card border border-line">
                  <dt className="text-lg font-extrabold">{match ? match[1] : bullet}</dt>
                  {match && (
                    <dd className="mt-2 text-muted leading-relaxed">
                      {match[2].charAt(0).toUpperCase() + match[2].slice(1)}
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </section>
      ))}
      {lesson.resources && (
        <section className="mt-14 pt-8 border-t-4 border-magenta">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Resources</h2>
          <p className="mt-3 text-lg text-muted">Free, if you want to go deeper. All optional.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {lesson.resources.map((resource) => (
              <a
                key={resource.href}
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-3xl bg-highlight border border-cyan hover:brightness-[0.98] transition"
              >
                <p className="text-lg font-extrabold group-hover:underline">
                  {resource.title} <span aria-hidden="true">&#8599;</span>
                </p>
                <p className="mt-2 text-muted leading-relaxed">{resource.desc}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
