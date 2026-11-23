"use client";

import { START_EVENT } from "./BrandGuideWidget";

// A link that scrolls to the brand guide and opens its first question (Brittany, 2026-11-17).
export function StartGuideLink({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <a href="#brand-guide" className={className} onClick={() => window.dispatchEvent(new Event(START_EVENT))}>
      {children}
    </a>
  );
}
