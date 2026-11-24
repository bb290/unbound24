"use client";

import { useId, useRef, useState } from "react";
import type { SiteBuilt } from "@/content/sites-built";

// One project on /projects (Brittany, 2026-11-23): a big preview with 6 slides and arrows to click through them
// (swipe works on phones too), then a "Project details" button that reveals Service, Vibe and Components.

export function ProjectCard({ site }: { site: SiteBuilt }) {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const detailsId = useId();
  const n = site.shots.length;

  const go = (i: number) => {
    const next = (i + n) % n;
    const el = track.current;
    if (el) el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setIdx(next);
  };
  const onScroll = () => {
    const el = track.current;
    if (el && el.clientWidth) setIdx(Math.round(el.scrollLeft / el.clientWidth));
  };

  const arrow = "absolute top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 sm:w-12 sm:h-12 rounded-full border-2 border-ink bg-[#FFFDF8] text-ink shadow-[3px_3px_0_#121318] hover:bg-cyan transition";

  return (
    <article className="sticker rounded-[28px] overflow-hidden bg-surface">
      <div className="relative border-b-2 border-border bg-surface-2" aria-roledescription="carousel" aria-label={`${site.name} screens`}>
        <div ref={track} onScroll={onScroll} className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {site.shots.map((label, i) => (
            <div key={i} className="w-full shrink-0 snap-start" aria-roledescription="slide" aria-label={`${i + 1} of ${n}`} aria-hidden={i !== idx}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/projects/${site.slug}-${i + 1}.jpg`}
                alt={`${site.name}: ${label}`}
                width={1280}
                height={800}
                loading={i === 0 ? "eager" : "lazy"}
                className="w-full h-auto block aspect-[16/10] object-cover object-top"
              />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => go(idx - 1)} aria-label="Previous screen" className={`${arrow} left-2 sm:left-4`}>
          <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true"><path d="M12.5 4.5L7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" onClick={() => go(idx + 1)} aria-label="Next screen" className={`${arrow} right-2 sm:right-4`}>
          <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true"><path d="M7.5 4.5L13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 rounded-full border-2 border-ink bg-[#FFFDF8] px-2.5 py-1.5" role="group" aria-label="Choose a screen">
          {site.shots.map((label, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Screen ${i + 1}: ${label}`}
              aria-current={i === idx}
              className={`w-2.5 h-2.5 rounded-full border border-ink transition ${i === idx ? "bg-ink" : "bg-transparent hover:bg-ink/30"}`}
            />
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-7 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <h2 className="font-display font-extrabold text-[26px] sm:text-[32px] leading-tight">{site.name}</h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls={detailsId}
              className="inline-flex items-center gap-1.5 font-bold underline underline-offset-4 decoration-2 hover:decoration-cyan"
            >
              Project details
              <svg viewBox="0 0 20 20" aria-hidden="true" className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}>
                <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a href={site.url} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4 decoration-2 hover:decoration-cyan">
              Visit {site.url.replace(/^https:\/\/(www\.)?/, "")} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <dl id={detailsId} hidden={!open} className="grid gap-2.5 text-[16px] leading-snug border-t-2 border-line pt-4">
          <div><dt className="inline font-bold">Service: </dt><dd className="inline">{site.service}</dd></div>
          <div><dt className="inline font-bold">Vibe: </dt><dd className="inline">{site.vibe}</dd></div>
          <div>
            <dt className="font-bold">Components:</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {site.components.map((c) => <span key={c} className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[13px] font-bold">{c}</span>)}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
