"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODULES, lessonsInModule } from "@/content/course";

function LessonList() {
  const pathname = usePathname();
  return (
    <nav aria-label="Course lessons" className="flex flex-col gap-7">
      <Link
        href="/course"
        className={`font-extrabold ${pathname === "/course" ? "text-cyan-text" : "hover:text-cyan-text"}`}
      >
        Course overview
      </Link>
      {MODULES.map((module) => (
        <div key={module.id}>
          <p className="text-xs font-extrabold tracking-widest uppercase text-muted mb-3">{module.title}</p>
          <ul className="flex flex-col gap-1">
            {lessonsInModule(module.id).map((lesson) => {
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
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function CourseSidebar() {
  return (
    <>
      {/* Phones and tablets: a tap-to-open list above the lesson */}
      <details className="lg:hidden rounded-2xl border border-line bg-card px-5 py-4">
        <summary className="cursor-pointer font-extrabold">All lessons</summary>
        <div className="mt-5">
          <LessonList />
        </div>
      </details>

      {/* Desktop: always-visible side panel */}
      <aside className="hidden lg:block sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto pr-2">
        <LessonList />
      </aside>
    </>
  );
}
