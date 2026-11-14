"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Resource, ResourceSection } from "@/content/resources";

// Resources: two columns of sections. Each shows its first 2 cards; the header opens the rest (Brittany, 2026-11-14).
// A card opens a pop-up with the longer note and the link.

const FILL: Record<ResourceSection["fill"], string> = {
  cyan: "var(--cyan)",
  teal: "var(--teal)",
  lilac: "var(--lilac)",
  gray: "var(--gray)",
};
const SHOWN = 2;

export function ResourceSections({ sections }: { sections: ResourceSection[] }) {
  const [active, setActive] = useState<{ item: Resource; section: ResourceSection } | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <>
      <div className="grid gap-6 items-start md:grid-cols-2">
        {sections.map((s) => (
          <Section key={s.key} section={s} onPick={(item) => setActive({ item, section: s })} />
        ))}
      </div>

      {active && createPortal(
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#121318]/60 p-4" onClick={() => setActive(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="res-title" onClick={(e) => e.stopPropagation()} className="sticker rounded-[24px] bg-surface w-full max-w-[440px] p-6 flex flex-col gap-4 motion-safe:animate-[ub-pop_.35s_cubic-bezier(.2,1.6,.4,1)]">
            <div className="flex items-start justify-between gap-4">
              <span className="label rounded-full px-3 py-[7px] text-ink" style={{ background: FILL[active.section.fill] }}>More about it</span>
              <button type="button" onClick={() => setActive(null)} aria-label="Close" className="w-9 h-9 grid place-items-center rounded-full border-2 border-border text-lg leading-none">&times;</button>
            </div>
            <div className="flex flex-col gap-1">
              <h3 id="res-title" className="font-display font-extrabold text-[26px] leading-tight">{active.item.title}</h3>
              {active.item.by && <p className="text-sm font-semibold text-muted">{active.item.by}</p>}
            </div>
            <p>{active.item.more}</p>
            <a
              href={active.item.href}
              target="_blank"
              rel={active.item.affiliate ? "sponsored noopener" : "noopener"}
              className="btn btn-primary !h-auto min-h-[52px] py-3 text-center leading-tight"
            >
              {active.item.linkLabel}
            </a>
            {active.item.affiliate && <p className="text-xs text-muted">Affiliate link</p>}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function Section({ section, onPick }: { section: ResourceSection; onPick: (item: Resource) => void }) {
  const [open, setOpen] = useState(false);
  const extra = section.items.length - SHOWN;
  const items = open ? section.items : section.items.slice(0, SHOWN);

  return (
    <div className="sticker rounded-[24px] bg-surface overflow-hidden">
      <button
        type="button"
        onClick={() => extra > 0 && setOpen(!open)}
        aria-expanded={extra > 0 ? open : undefined}
        className={`w-full flex items-center justify-between gap-4 px-5 py-4 border-b-2 border-border text-left ${extra > 0 ? "cursor-pointer" : "cursor-default"}`}
        style={{ background: FILL[section.fill] }}
      >
        <span className="font-display font-extrabold text-[22px] text-ink">{section.title}</span>
        <span className="flex items-center gap-2 text-ink">
          <span className="font-mono text-[12px] tracking-[.08em]">{section.items.length}</span>
          {extra > 0 && (
            <svg viewBox="0 0 20 20" aria-hidden="true" className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}>
              <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </button>

      <ul className="flex flex-col gap-3 p-4">
        {items.map((item, i) => (
          <li key={`${item.title}-${i}`}>
            <button
              type="button"
              onClick={() => onPick(item)}
              className="lift w-full text-left rounded-2xl border-2 border-border bg-card px-4 py-3 flex flex-col gap-1"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="font-display font-bold text-[18px] leading-snug">{item.title}</span>
                {item.placeholder && <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[11px] font-bold text-muted">Placeholder</span>}
              </span>
              <span className="text-[15px] text-muted leading-snug">{item.short}</span>
            </button>
          </li>
        ))}
      </ul>

      {extra > 0 && (
        <button type="button" onClick={() => setOpen(!open)} className="w-full px-5 pb-4 -mt-1 text-left text-sm font-bold text-muted hover:text-foreground transition">
          {open ? "Show less" : `Show all ${section.items.length}`}
        </button>
      )}
    </div>
  );
}
