"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BeastModeTimer } from "./BeastModeTimer";
import { HalfpipeSkater } from "./HalfpipeSkater";

// Two big card buttons (Brittany, 2026-11-14): "Get sh*t done" opens the Beast Mode Timer, "Take a break" opens the skater.
// The timer stays mounted after its first open, so closing the pop-up doesn't stop a running session.

type Which = "work" | "break" | null;

export function FocusOrBreak() {
  const [open, setOpen] = useState<Which>(null);
  const [timerMounted, setTimerMounted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);

  function show(w: Exclude<Which, null>) {
    if (w === "work") setTimerMounted(true);
    setOpen(w);
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <CardButton fill="bg-cyan" title="Get sh*t done" onClick={() => show("work")} />
        <CardButton fill="bg-lilac" title="Take a break" onClick={() => show("break")} />
      </div>

      {timerMounted && createPortal(
        <Modal hidden={open !== "work"} label="Beast Mode Timer" onClose={() => setOpen(null)} wide={false}>
          <BeastModeTimer />
        </Modal>,
        document.body,
      )}
      {open === "break" && createPortal(
        <Modal label="Skate break" onClose={() => setOpen(null)} wide>
          <HalfpipeSkater />
        </Modal>,
        document.body,
      )}
    </>
  );
}

function CardButton({ fill, title, onClick }: { fill: string; title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`lift sticker rounded-[28px] ${fill} text-ink text-center px-7 py-9 sm:px-9 sm:py-12 flex flex-col items-center justify-center min-h-[180px] sm:min-h-[240px]`}
    >
      <span className="font-display font-extrabold text-[40px] leading-[0.95] tracking-[-0.02em] sm:text-[56px]">{title}</span>
    </button>
  );
}

function Modal({ children, label, onClose, wide, hidden = false }: { children: React.ReactNode; label: string; onClose: () => void; wide: boolean; hidden?: boolean }) {
  return (
    <div className={`fixed inset-0 z-[60] overflow-y-auto bg-[#121318]/60 p-4 ${hidden ? "hidden" : ""}`} onClick={onClose}>
      <div className="min-h-full grid place-items-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full ${wide ? "max-w-[960px]" : "max-w-[500px]"} rounded-[28px] bg-background sticker p-5 pt-14 sm:p-8 sm:pt-14 motion-safe:animate-[ub-pop_.35s_cubic-bezier(.2,1.6,.4,1)]`}
        >
          <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 w-9 h-9 grid place-items-center rounded-full border-2 border-border bg-surface text-lg leading-none">&times;</button>
          {children}
        </div>
      </div>
    </div>
  );
}
