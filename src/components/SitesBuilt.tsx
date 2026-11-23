"use client";

import { useEffect, useRef, useState } from "react";
import { SITES_BUILT } from "@/content/sites-built";

// "Sites I've Built": a big link that opens a pop-up of real sites with a preview, Service, Vibe, Components and
// a link out (Brittany, 2026-11-17; status pills removed the same day).
export function SitesBuilt() {
  const [open, setOpen] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); opener.current?.focus(); };
  }, [open]);

  return (
    <>
      <button
        ref={opener}
        type="button"
        onClick={() => setOpen(true)}
        className="self-center inline-flex items-center gap-2 font-display font-extrabold text-[26px] sm:text-[30px] underline decoration-[3px] underline-offset-[6px] hover:decoration-cyan"
      >
        Sites I&apos;ve Built <span aria-hidden="true">→</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#121318]/60 p-4 sm:p-8" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sites-built-title"
            className="relative mx-auto max-w-[1100px] rounded-[28px] border-2 border-ink bg-[#FFFDF8] text-ink p-5 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 id="sites-built-title" className="font-display font-extrabold text-[30px] sm:text-[40px] leading-tight">Sites I&apos;ve Built</h2>
              <button ref={closeBtn} type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid place-items-center shrink-0 w-11 h-11 rounded-full border-2 border-ink bg-[#FFFDF8] text-[20px] font-bold">×</button>
            </div>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {SITES_BUILT.map((s) => (
                <li key={s.slug} className="flex flex-col rounded-[20px] border-2 border-ink overflow-hidden bg-[#FFFDF8]">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="block border-b-2 border-ink bg-[#f8f0e3]" aria-label={`Open ${s.name} (new tab)`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/sites/${s.slug}.jpg`} alt={`${s.name} homepage`} width={1280} height={530} loading="lazy" className="w-full h-auto block" />
                  </a>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <h3 className="font-display font-extrabold text-[22px] leading-tight">{s.name}</h3>
                    <dl className="grid gap-2 text-[15px] leading-snug">
                      <div><dt className="inline font-bold">Service: </dt><dd className="inline">{s.service}</dd></div>
                      <div><dt className="inline font-bold">Vibe: </dt><dd className="inline">{s.vibe}</dd></div>
                      <div>
                        <dt className="font-bold">Components:</dt>
                        <dd className="mt-1.5 flex flex-wrap gap-1.5">
                          {s.components.map((c) => <span key={c} className="rounded-full border border-ink bg-[#f8f0e3] px-2.5 py-0.5 text-[13px] font-bold">{c}</span>)}
                        </dd>
                      </div>
                    </dl>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-auto self-start font-bold underline underline-offset-4">
                      Visit {s.url.replace(/^https:\/\/(www\.)?/, "")} <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
