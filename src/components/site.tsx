import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

// Services (Brittany, 2026-11-17): Local + Loud and Website Dev, in a dropdown on desktop and a group in the phone menu.
export const SERVICES = [
  { label: "Local + Loud", sub: "Your whole marketing department", href: "/local-loud" },
  { label: "Website Dev", sub: "A branded website from $1,000", href: "/websites" },
];

// Resources moved from the top nav to the footer; Projects added (Brittany, 2026-11-23).
const NAV_LINKS: { label: string; href: string }[] = [{ label: "Projects", href: "/projects" }];

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
    <nav className="sticky top-0 z-[55] bg-background/95 backdrop-blur-[2px] border-b-2 border-border">
      <div className="flex items-center justify-between gap-4 px-4 py-3 max-w-[1200px] mx-auto sm:px-8">
        <div className="flex items-center gap-8 lg:gap-10">
          <Wordmark />
          <div className="hidden items-center gap-7 text-[15px] font-bold lg:flex">
            <ServicesMenu active={SERVICES.some((service) => service.href === active)} />
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={link.href === active ? "text-foreground" : "text-muted hover:text-foreground transition"}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        {/* Below lg: one slim row; the Menu button opens a panel of big tap targets (MobileMenu). */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <MobileMenu
            services={SERVICES}
            links={NAV_LINKS}
            active={active}
          />
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
        <Link href="/resources" className="text-sm font-bold text-muted hover:text-foreground transition">
          Resources
        </Link>
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Unbound Consulting LLC
        </p>
      </div>
    </footer>
  );
}

// Hover or keyboard focus opens the list; it works without JavaScript. There's no Services page, so the trigger is a button.
function ServicesMenu({ active }: { active: boolean }) {
  return (
    <div className="relative group">
      <button
        type="button"
        aria-haspopup="true"
        className={`inline-flex items-center gap-1.5 font-bold ${active ? "text-foreground" : "text-muted hover:text-foreground transition"}`}
      >
        Services
        <svg viewBox="0 0 20 20" aria-hidden="true" className="w-4 h-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180">
          <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition absolute left-1/2 -translate-x-1/2 top-full z-20 pt-3">
        <ul className="w-72 p-2 rounded-2xl bg-surface sticker">
          {SERVICES.map((service) => (
            <li key={service.href}>
              <Link href={service.href} className="block px-3 py-2.5 rounded-xl hover:bg-card transition">
                <span className="block font-extrabold text-foreground">{service.label}</span>
                <span className="block text-sm font-semibold text-muted">{service.sub}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
