import Link from "next/link";
import type { Lesson } from "@/content/course";

// The lesson list on a course page: live lessons link, the rest show as coming soon.
export default function LessonCards({ lessons }: { lessons: Lesson[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {lessons.map((lesson) =>
        lesson.status === "ready" ? (
          <Link
            key={lesson.slug}
            href={`/course/${lesson.slug}`}
            className="group p-5 rounded-3xl bg-card border border-line hover:border-cyan transition"
          >
            <p className="text-sm font-extrabold text-magenta-text">{lesson.num}</p>
            <h3 className="mt-1 text-lg font-extrabold group-hover:underline">{lesson.title}</h3>
            {lesson.summary && <p className="mt-2 text-muted leading-relaxed">{lesson.summary}</p>}
          </Link>
        ) : (
          <div key={lesson.slug} className="p-5 rounded-3xl border border-dashed border-line">
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
  );
}
