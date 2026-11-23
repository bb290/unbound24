"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Phones and tablets (below lg): one slim bar with a Menu button that opens a panel of big tap targets
// (Brittany, 2026-11-17: "mobile optimize the menu"). Desktop keeps the inline links and the Courses hover menu.
// Closes on a link tap, Escape, a tap outside, or a page change.

type Item = { label: string; href: string };
type Service = { label: string; sub: string; href: string };
type Course = { title: string; href: string; soon: boolean };

export function MobileMenu({ services, links, courses, active }: { services: Service[]; links: Item[]; courses: Course[]; active: string }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); button.current?.focus(); }
    };
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const row = (href: string) =>
    `flex items-center justify-between min-h-[56px] px-1 font-display font-extrabold text-[22px] ${href === active ? "text-foreground" : "text-foreground/80"}`;

  return (
    <div ref={wrap} className="lg:hidden">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex items-center gap-2 h-[40px] pl-3 pr-3.5 rounded-full sticker-sm bg-surface text-foreground font-bold text-[15px]"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 5.5h14M3 10h14M3 14.5h14" />}
        </svg>
        {open ? "Close" : "Menu"}
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute left-0 right-0 top-full bg-background border-b-2 border-border shadow-[0_8px_0_rgba(18,19,24,.08)] max-h-[calc(100dvh-64px)] overflow-y-auto"
      >
        <ul className="max-w-[1200px] mx-auto px-4 pt-2 pb-5 sm:px-8">
          <li className="border-b border-line pb-3">
            <p className="flex items-center min-h-[56px] px-1 font-display font-extrabold text-[22px] text-foreground/80">Services</p>
            <ul className="flex flex-col gap-1">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    onClick={() => setOpen(false)}
                    aria-current={service.href === active ? "page" : undefined}
                    className="flex flex-col justify-center min-h-[56px] px-3 py-2 rounded-xl bg-card text-foreground"
                  >
                    <span className="text-[17px] font-extrabold">{service.label}</span>
                    <span className="text-[14px] font-semibold text-muted">{service.sub}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          {links.map((link) => (
            <li key={link.href} className="border-b border-line">
              <Link href={link.href} onClick={() => setOpen(false)} aria-current={link.href === active ? "page" : undefined} className={row(link.href)}>
                {link.label}
                <span aria-hidden="true" className="text-muted text-[18px]">&rarr;</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/course" onClick={() => setOpen(false)} aria-current={active === "/course" ? "page" : undefined} className={row("/course")}>
              Courses
              <span aria-hidden="true" className="text-muted text-[18px]">&rarr;</span>
            </Link>
            <ul className="flex flex-col gap-1 pb-1">
              {courses.map((course) => (
                <li key={course.href}>
                  <Link
                    href={course.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-3 min-h-[48px] px-3 py-2 rounded-xl bg-card text-[16px] font-bold text-foreground"
                  >
                    {course.title}
                    {course.soon && (
                      <span className="shrink-0 rounded-full bg-surface border border-line px-2 py-0.5 text-[11px] font-bold text-muted">Soon</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
