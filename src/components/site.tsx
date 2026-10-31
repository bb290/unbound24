import Link from "next/link";

export const COURSE_URL = "/course";

// TODO: the Mission page doesn't exist yet.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Mission", href: "#" },
  { label: "Course", href: COURSE_URL },
];

export function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className={`font-black tracking-tight ${small ? "text-base" : "text-2xl"}`}>
      <span>Unbound</span>
      <span className="text-cyan-text">24</span>
    </Link>
  );
}

export function SiteNav({ active }: { active: string }) {
  return (
    <nav className="flex items-center justify-between gap-4 px-4 py-5 max-w-6xl mx-auto sm:px-8">
      <div className="flex items-center gap-8 sm:gap-12">
        <Wordmark />
        <div className="hidden items-center gap-8 text-base font-bold sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={link.href === active ? "text-foreground" : "text-muted hover:text-foreground transition"}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-4 py-8 border-t border-line sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Wordmark small />
        <p className="text-sm text-muted">
          Questions?{" "}
          <a href="mailto:brittany@unbound24.com" className="text-cyan-text font-bold hover:underline">
            brittany@unbound24.com
          </a>
        </p>
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Unbound Consulting LLC
        </p>
      </div>
    </footer>
  );
}
