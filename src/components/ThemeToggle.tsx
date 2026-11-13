"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function current(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Sun/moon switch. Follows the device until clicked, then remembers the choice.
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(current());
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(current());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("ub-theme", next); } catch {}
    setTheme(next);
    window.dispatchEvent(new Event("ub-theme"));
  }

  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      className="relative inline-flex items-center w-[64px] h-[36px] rounded-full sticker-sm bg-surface shrink-0"
    >
      <span
        aria-hidden="true"
        className={`absolute top-[3px] left-[3px] grid place-items-center w-[26px] h-[26px] rounded-full border-2 border-border transition-transform duration-200 ${dark ? "translate-x-[28px] bg-lilac" : "bg-teal"}`}
        style={{ color: "var(--ink)" }}
      >
        {dark ? (
          <svg viewBox="0 0 20 20" className="w-[14px] h-[14px]"><path d="M15.5 12.5A6.5 6.5 0 0 1 7.5 4.5a6.5 6.5 0 1 0 8 8z" fill="currentColor" /></svg>
        ) : (
          <svg viewBox="0 0 20 20" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="10" cy="10" r="3.5" fill="currentColor" stroke="none" />
            <path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6L16 16M4 16l1.4-1.4M14.6 5.4L16 4" />
          </svg>
        )}
      </span>
    </button>
  );
}
