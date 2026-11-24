"use client";

import { useId, useRef, useState } from "react";
import type { SiteBuilt } from "@/content/sites-built";

// One project on /projects (Brittany, 2026-11-23): a big preview with 6 slides, dots to click through them
// (no arrows; swipe works on phones too), then a "Project details" button that reveals Service, Vibe and Components.

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
      </div>

      {/* Below the image: the dots, then the centered details toggle; the name lives in the alt text and a screen-reader
          heading, and the site link sits inside the reveal (Brittany, 2026-11-23). */}
      <div className="px-5 pt-2.5 pb-3 sm:px-6 flex flex-col items-center gap-1">
        <h2 className="sr-only">{site.name}</h2>
        <div className="flex justify-center" role="group" aria-label="Choose a screen">
          {site.shots.map((label, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Screen ${i + 1}: ${label}`}
              aria-current={i === idx}
              className="group grid place-items-center w-7 h-7"
            >
              <span className={`block w-2.5 h-2.5 rounded-full border-2 border-foreground transition ${i === idx ? "bg-foreground" : "bg-transparent group-hover:bg-foreground/30"}`} />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={detailsId}
          className="inline-flex items-center gap-1.5 text-[15px] font-bold underline underline-offset-4 decoration-2 hover:decoration-cyan"
        >
          Project details
          <svg viewBox="0 0 20 20" aria-hidden="true" className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}>
            <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div id={detailsId} hidden={!open} className="self-stretch mt-2 border-t-2 border-line pt-4 pb-2 flex flex-col gap-3">
          <dl className="grid gap-2.5 text-[16px] leading-snug">
            <div><dt className="inline font-bold">Service: </dt><dd className="inline">{site.service}</dd></div>
            <div><dt className="inline font-bold">Vibe: </dt><dd className="inline">{site.vibe}</dd></div>
            <div>
              <dt className="font-bold">Components:</dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {site.components.map((c) => <span key={c} className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[13px] font-bold">{c}</span>)}
              </dd>
            </div>
          </dl>
          <a href={site.url} target="_blank" rel="noopener noreferrer" className="self-start font-bold underline underline-offset-4 decoration-2 hover:decoration-cyan">
            Visit {site.url.replace(/^https:\/\/(www\.)?/, "")} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}
