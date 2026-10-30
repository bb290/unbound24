import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MODULES, READY_LESSONS, getLesson, lessonArt, neighbors, readingMinutes } from "@/content/course";
import PromptBox from "../PromptBox";

export const dynamicParams = false;

export function generateStaticParams() {
  return READY_LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return {};
  return {
    title: `${lesson.num} ${lesson.title} | Own Your 24`,
    description: lesson.summary,
    alternates: { canonical: `/course/${lesson.slug}` },
  };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const lessonModule = MODULES.find((m) => m.id === lesson.module);
  const { prev, next } = neighbors(lesson);
  const art = lessonArt(lesson);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LearningResource",
        name: `${lesson.num} ${lesson.title}`,
        description: lesson.summary,
        url: `https://unbound24.com/course/${lesson.slug}`,
        isAccessibleForFree: true,
        learningResourceType: "Lesson",
        isPartOf: { "@type": "Course", name: "Own Your 24", url: "https://unbound24.com/course" },
        author: { "@type": "Person", name: "Brittany French" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Course", item: "https://unbound24.com/course" },
          { "@type": "ListItem", position: 2, name: lesson.title, item: `https://unbound24.com/course/${lesson.slug}` },
        ],
      },
    ],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p className="text-sm font-bold text-muted">
        <Link href="/course" className="hover:text-foreground">Course</Link>
        <span aria-hidden="true"> / </span>
        {lessonModule?.title}
      </p>

      <header className="mt-4 grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-cyan-text text-sm font-extrabold tracking-widest uppercase">Lesson {lesson.num}</p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight sm:text-5xl">{lesson.title}</h1>
          <p className="mt-4 text-sm font-bold text-muted">
            {readingMinutes(lesson)} min read{lesson.action ? " · 1 Action" : ""}
          </p>
          {lesson.intro && <p className="mt-5 text-lg text-muted leading-relaxed sm:text-xl">{lesson.intro}</p>}
        </div>
        <Image src={art.src} alt={art.alt} width={art.width} height={art.height} priority className="w-full max-w-[14rem] md:max-w-xs h-auto mx-auto" />
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

      <div className="mt-12 max-w-3xl">
        {lesson.sections.map((section, i) =>
          section.kind === "part" ? (
            <section key={i} className="mt-16 first:mt-0 pt-10 border-t-4 border-cyan">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{section.title}</h2>
              {section.paras.map((para, j) => (
                <p key={j} className="mt-4 text-lg text-muted leading-relaxed">{para}</p>
              ))}
            </section>
          ) : (
            <section key={i} className="mt-10 first:mt-0">
              <h3 className="text-xl font-extrabold sm:text-2xl">{section.title}</h3>
              {section.paras.map((para, j) => (
                <p key={j} className="mt-3 text-lg leading-relaxed">{para}</p>
              ))}
            </section>
          ),
        )}
      </div>

      {lesson.action && (
        <section className="mt-16 rounded-3xl bg-highlight border border-cyan p-6 sm:p-8">
          <p className="text-cyan-text text-sm font-extrabold tracking-widest uppercase">Your Action</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{lesson.action.title}</h2>
          <p className="mt-3 text-lg leading-relaxed">{lesson.action.text}</p>
          {lesson.action.prompt && (
            <PromptBox prompt={lesson.action.prompt} filename={`own-your-24-${lesson.num}-${lesson.slug}-prompt.txt`} />
          )}
        </section>
      )}

      <nav aria-label="Lesson navigation" className="mt-16 grid gap-4 sm:grid-cols-2">
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
