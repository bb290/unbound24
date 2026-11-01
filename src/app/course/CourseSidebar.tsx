"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COURSES, LESSONS, lessonsInCourse } from "@/content/course";
import { useProgress, useStored, useStoredList } from "./useStored";

export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <circle cx="10" cy="10" r="10" fill="#2ED4E8" />
      <path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#0A1C33" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={`w-4 h-4 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}>
      <path d="M7 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LessonList({ headerAction }: { headerAction?: React.ReactNode }) {
  const pathname = usePathname();
  const progress = useProgress();
  // The course you're in starts open and the rest start closed; a click flips that and is remembered.
  const flipped = useStoredList("oy24-flipped-courses");
  const currentSlug = pathname.split("/")[2];
  const currentCourse = COURSES.find((course) => course.slug === currentSlug)?.slug ??
    LESSONS.find((lesson) => lesson.slug === currentSlug)?.course;

  return (
    <nav aria-label="Course lessons" className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/course"
          className={`font-extrabold ${pathname === "/course" ? "text-cyan-text" : "hover:text-cyan-text"}`}
        >
          All courses
        </Link>
        {headerAction}
      </div>
      {COURSES.map((course) => {
        const lessons = lessonsInCourse(course.slug);
        const ready = lessons.filter((lesson) => lesson.status === "ready");
        const done = ready.filter((lesson) => progress.has(lesson.slug)).length;
        const open = (course.slug === currentCourse) !== flipped.has(course.slug);
        const listId = `course-${course.slug}-lessons`;
        const courseHref = `/course/${course.slug}`;
        return (
          <div key={course.slug}>
            <button
              type="button"
              onClick={() => flipped.toggle(course.slug)}
              aria-expanded={open}
              aria-controls={listId}
              className="w-full flex items-center gap-2 py-1 text-left text-xs font-extrabold tracking-widest uppercase text-muted hover:text-foreground transition"
            >
              <Chevron open={open} />
              <span className="flex-1">{course.title}</span>
              {ready.length > 0 ? (
                <span className="normal-case tracking-normal font-bold">
                  {done}/{ready.length}
                </span>
              ) : (
                <span className="normal-case tracking-normal font-bold">Soon</span>
              )}
            </button>
            {open && (
              <ul id={listId} className="mt-2 flex flex-col gap-1">
                <li>
                  <Link
                    href={courseHref}
                    aria-current={pathname === courseHref ? "page" : undefined}
                    className={`block px-3 py-2 rounded-xl text-sm leading-snug transition ${
                      pathname === courseHref ? "bg-highlight font-extrabold" : "font-semibold text-muted hover:bg-card"
                    }`}
                  >
                    Course overview
                  </Link>
                </li>
                {lessons.map((lesson) => {
                  const href = `/course/${lesson.slug}`;
                  const active = pathname === href;
                  if (lesson.status !== "ready") {
                    return (
                      <li key={lesson.num} className="flex items-start gap-3 px-3 py-2 text-muted">
                        <span className="w-8 shrink-0 text-sm font-bold">{lesson.num}</span>
                        <span className="flex-1 text-sm leading-snug">{lesson.title}</span>
                        <span className="shrink-0 rounded-full bg-card border border-line px-2 py-0.5 text-[11px] font-bold">
                          Soon
                        </span>
                      </li>
                    );
                  }
                  const finished = progress.has(lesson.slug);
                  return (
                    <li key={lesson.num}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-start gap-3 px-3 py-2 rounded-xl text-sm leading-snug transition ${
                          active ? "bg-highlight font-extrabold" : "font-semibold hover:bg-card"
                        }`}
                      >
                        <span className={`w-8 shrink-0 font-bold ${active ? "text-cyan-text" : "text-muted"}`}>
                          {lesson.num}
                        </span>
                        <span className="flex-1">{lesson.title}</span>
                        {finished && (
                          <>
                            <CheckIcon className="w-4 h-4 shrink-0 mt-0.5" />
                            <span className="sr-only">(complete)</span>
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default function CourseShell({ children }: { children: React.ReactNode }) {
  const [collapsedRaw, setCollapsed] = useStored("oy24-sidebar-collapsed", "0");
  const collapsed = collapsedRaw === "1";

  return (
    <div
      className={`px-4 pt-6 pb-24 max-w-6xl mx-auto grid gap-8 sm:px-8 lg:items-start ${
        collapsed ? "lg:grid-cols-[2.75rem_1fr] lg:gap-10" : "lg:grid-cols-[17rem_1fr] lg:gap-14"
      }`}
    >
      {/* Phones and tablets: a tap-to-open list above the lesson */}
      <details className="lg:hidden rounded-2xl border border-line bg-card px-5 py-4">
        <summary className="cursor-pointer font-extrabold">All lessons</summary>
        <div className="mt-5">
          <LessonList />
        </div>
      </details>

      {/* Desktop: side panel that can be minimized */}
      <aside className="hidden lg:block sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
        {collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed("0")}
            aria-label="Show lessons"
            title="Show lessons"
            className="w-11 h-11 rounded-full border border-line bg-card flex items-center justify-center hover:border-cyan transition"
          >
            <Chevron open={false} />
          </button>
        ) : (
          <div className="pr-2">
            <LessonList
              headerAction={
                <button
                  type="button"
                  onClick={() => setCollapsed("1")}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-muted hover:bg-card hover:text-foreground transition"
                >
                  <span className="rotate-180">
                    <Chevron open={false} />
                  </span>
                  Hide
                </button>
              }
            />
          </div>
        )}
      </aside>

      <main className="min-w-0">{children}</main>
    </div>
  );
}
