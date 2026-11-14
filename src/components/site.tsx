import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { COURSES, lessonsInCourse } from "@/content/course";

export const COURSE_URL = "/course";

const NAV_LINKS = [
  { label: "Local + Loud", href: "/local-loud" },
  { label: "Resources", href: "/resources" },
];

export function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" aria-label="Unbound24 home" className="logo-chip shrink-0">
      <Image
        src="/unbound-logo.png"
        alt="Unbound"
        width={500}
        height={150}
        priority={!small}
        className={small ? "h-7 w-auto" : "h-7 w-auto sm:h-10"}
      />
    </Link>
  );
}

export function SiteNav({ active }: { active: string }) {
  return (
    <nav className="sticky top-0 z-30 bg-background/95 backdrop-blur-[2px] border-b-2 border-border">
      <div className="flex items-center justify-between gap-4 px-4 py-3 max-w-[1200px] mx-auto sm:px-8">
        <div className="flex items-center gap-8 lg:gap-10">
          <Wordmark />
          <div className="hidden items-center gap-7 text-[15px] font-bold lg:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={link.href === active ? "text-foreground" : "text-muted hover:text-foreground transition"}>
                {link.label}
              </Link>
            ))}
            <CoursesMenu active={active === COURSE_URL} />
          </div>
        </div>
        <div className="flex items-center gap-2 min-[400px]:gap-2.5 sm:gap-4">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={`whitespace-nowrap text-[13px] min-[400px]:text-[14px] sm:text-[15px] font-bold transition lg:hidden ${link.href === active ? "text-foreground" : "text-muted hover:text-foreground"}`}>
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="py-10 border-t-2 border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 flex flex-col items-center justify-between gap-5 sm:flex-row">
        <Wordmark small />
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Unbound Consulting LLC
        </p>
      </div>
    </footer>
  );
}

// Hover or keyboard focus opens the list; it works without JavaScript.
function CoursesMenu({ active }: { active: boolean }) {
  return (
    <div className="relative group">
      <Link
        href={COURSE_URL}
        aria-haspopup="true"
        className={`inline-flex items-center gap-1.5 ${active ? "text-foreground" : "text-muted hover:text-foreground transition"}`}
      >
        Courses
        <svg viewBox="0 0 20 20" aria-hidden="true" className="w-4 h-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180">
          <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition absolute left-1/2 -translate-x-1/2 top-full z-20 pt-3">
        <ul className="w-80 p-2 rounded-2xl bg-surface sticker">
          {COURSES.map((course) => {
            const live = lessonsInCourse(course.slug).some((lesson) => lesson.status === "ready");
            return (
              <li key={course.slug}>
                <Link href={`/course/${course.slug}`} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-card transition">
                  <span className="flex-1">
                    <span className="block font-extrabold text-foreground">{course.title}</span>
                    <span className="block text-sm font-semibold text-muted">{course.topic}</span>
                  </span>
                  {!live && (
                    <span className="shrink-0 mt-0.5 rounded-full bg-card border border-line px-2 py-0.5 text-[11px] font-bold text-muted">
                      Soon
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
          <li className="mt-1 pt-1 border-t border-line">
            <Link href={COURSE_URL} className="block px-3 py-2.5 rounded-xl font-extrabold text-cyan-text hover:bg-card transition">
              All courses &rarr;
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
