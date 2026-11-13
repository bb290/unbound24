"use client";

import { useEffect, useState } from "react";
import { WISDOM } from "@/content/wisdom";

// The Penguin of Wisdom (2026-11-13): pops up from the bottom right of every page, over everything.
// Click him for a real, attributed quote. "go away penguin" hides him; "i miss the penguin" brings him back (remembered).

const KEY = "ub-penguin";

export function PenguinOfWisdom() {
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [idx, setIdx] = useState(-1);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<number[]>([]);

  useEffect(() => {
    try { setHidden(localStorage.getItem(KEY) === "hidden"); } catch {}
    // A shuffled deck, so quotes don't repeat until he's said them all.
    const deck = WISDOM.map((_, i) => i);
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    setOrder(deck);
    setReady(true);
  }, []);

  function setGone(gone: boolean) {
    setHidden(gone);
    setOpen(false);
    try { localStorage.setItem(KEY, gone ? "hidden" : "shown"); } catch {}
  }

  function wisdom() {
    if (!order.length) return;
    setIdx((i) => (i + 1) % order.length);
    setOpen(true);
  }

  if (!ready) return null;
  const q = idx >= 0 ? WISDOM[order[idx]] : null;
  const link = "text-[11px] font-semibold text-muted underline decoration-1 underline-offset-2 hover:text-foreground";

  return (
    <>
      {hidden && (
        <button type="button" onClick={() => setGone(false)} className={`fixed bottom-2 right-3 z-50 bg-background/80 px-1.5 rounded ${link}`}>
          i miss the penguin
        </button>
      )}

      <div
        aria-hidden={hidden}
        className={`fixed bottom-0 right-2 sm:right-6 z-50 flex flex-col items-end transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] ${hidden ? "translate-y-[110%] pointer-events-none" : "translate-y-0"}`}
      >
        {/* Speech bubble */}
        <div
          aria-live="polite"
          className={`mb-2 mr-2 max-w-[min(300px,calc(100vw-32px))] rounded-[18px] sticker-sm bg-surface px-4 py-3 origin-bottom-right transition-all duration-200 ${open ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}
        >
          {q && (
            <>
              <p className="font-display font-bold text-[16px] leading-snug">&ldquo;{q.quote}&rdquo;</p>
              <p className="mt-1.5 label text-muted normal-case tracking-normal">{q.who}</p>
              <div className="mt-2 flex gap-4">
                <button type="button" onClick={wisdom} className={link}>more wisdom</button>
                <button type="button" onClick={() => setOpen(false)} className={link}>thanks, penguin</button>
              </div>
            </>
          )}
        </div>

        <div className="flex items-end gap-2">
          <button type="button" onClick={() => setGone(true)} tabIndex={hidden ? -1 : 0} className={`mb-2 bg-background/80 px-1.5 rounded ${link}`}>
            go away penguin
          </button>
          <button
            type="button"
            onClick={wisdom}
            tabIndex={hidden ? -1 : 0}
            aria-label="Penguin of Wisdom. Click for a quote."
            title="Click for wisdom"
            className="group relative w-[138px] h-[144px] sm:w-[168px] sm:h-[174px] translate-y-[18%] hover:translate-y-[6%] transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] cursor-pointer"
          >
            <Penguin />
          </button>
        </div>
      </div>
    </>
  );
}

function Penguin() {
  const line = "var(--border)";
  return (
    <svg viewBox="0 0 120 124" className="w-full h-full overflow-visible" aria-hidden="true">
      {/* tuft: the skater's mohawk colors */}
      <path d="M52 22 L49 6 L57 19 Z" fill="#03C0E8" stroke={line} strokeWidth="2" strokeLinejoin="round" />
      <path d="M58 19 L60 1 L64 19 Z" fill="#40E0D0" stroke={line} strokeWidth="2" strokeLinejoin="round" />
      <path d="M65 19 L73 6 L69 22 Z" fill="#D3D3FF" stroke={line} strokeWidth="2" strokeLinejoin="round" />
      {/* left flipper */}
      <path d="M22 70 C8 82 6 98 12 108 C20 100 26 90 28 80 Z" fill="#121318" stroke={line} strokeWidth="2.5" strokeLinejoin="round" />
      {/* right flipper waves on hover */}
      <g className="origin-[92px_74px] transition-transform duration-300 group-hover:-rotate-[35deg]">
        <path d="M98 70 C112 82 114 98 108 108 C100 100 94 90 92 80 Z" fill="#121318" stroke={line} strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      {/* body */}
      <path d="M60 18 C30 18 18 44 18 76 L18 130 L102 130 L102 76 C102 44 90 18 60 18 Z" fill="#121318" stroke={line} strokeWidth="2.5" />
      {/* face and belly */}
      <path d="M60 34 C44 34 34 46 36 60 C30 70 30 86 32 130 L88 130 C90 86 90 70 84 60 C86 46 76 34 60 34 Z" fill="#F8F0E3" />
      {/* eyes */}
      <circle cx="49" cy="54" r="5.5" fill="#121318" />
      <circle cx="71" cy="54" r="5.5" fill="#121318" />
      <circle cx="51" cy="52" r="1.8" fill="#F8F0E3" />
      <circle cx="73" cy="52" r="1.8" fill="#F8F0E3" />
      {/* cheeks */}
      <ellipse cx="42" cy="66" rx="5" ry="3" fill="#D3D3FF" />
      <ellipse cx="78" cy="66" rx="5" ry="3" fill="#D3D3FF" />
      {/* beak */}
      <path d="M53 62 L67 62 L60 72 Z" fill="#FF7A59" stroke="#121318" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
