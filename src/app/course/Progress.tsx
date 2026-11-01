"use client";

import Link from "next/link";
import { READY_LESSONS } from "@/content/course";
import { CheckIcon } from "./CourseSidebar";
import { useProgress } from "./useStored";

export function CompleteButton({ slug }: { slug: string }) {
  const progress = useProgress();
  const done = progress.has(slug);
  return (
    <button
      type="button"
      onClick={() => progress.toggle(slug)}
      aria-pressed={done}
      className={`inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-lg font-extrabold transition ${
        done ? "bg-highlight border border-cyan hover:bg-card" : "bg-foreground text-background hover:bg-[#16304f]"
      }`}
    >
      {done ? (
        <>
          <CheckIcon className="w-6 h-6" /> Lesson complete
        </>
      ) : (
        "Mark lesson complete"
      )}
    </button>
  );
}

// Progress across every live lesson, or within one course when courseSlug is given.
export function ProgressSummary({ courseSlug }: { courseSlug?: string }) {
  const progress = useProgress();
  const lessons = courseSlug ? READY_LESSONS.filter((lesson) => lesson.course === courseSlug) : READY_LESSONS;
  const done = lessons.filter((lesson) => progress.has(lesson.slug)).length;
  const nextLesson = lessons.find((lesson) => !progress.has(lesson.slug));
  if (done === 0) return null;
  const percent = Math.round((done / lessons.length) * 100);
  return (
    <div className="mt-8 p-5 rounded-3xl bg-highlight border border-cyan">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-extrabold">
          You&rsquo;ve finished {done} of {lessons.length} lessons
        </p>
        {nextLesson && (
          <Link href={`/course/${nextLesson.slug}`} className="font-extrabold text-cyan-text hover:underline">
            Continue with {nextLesson.num} &rarr;
          </Link>
        )}
      </div>
      <div
        className="mt-3 h-3 rounded-full bg-background border border-line overflow-hidden"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={courseSlug ? "Course progress" : "Progress across all courses"}
      >
        <div className="h-full bg-cyan rounded-full" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
