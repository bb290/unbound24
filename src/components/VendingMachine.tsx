"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { VENDING, VENDING_COLS, VENDING_ROWS, type VendingItem } from "@/content/vending";

// The Value Vending Machine (2026-11-13): 12 free one-pagers on spiral coils, 3 across and 4 down.
// Punch a code (A1..D3) or double-click an item, the coil turns, the item drops into the tray, and a pop-up hands over the PDF.
// Free, no email gate (Brittany, 2026-11-14).
// Hover an item to see what it is and why you'd want it.

const FILL: Record<VendingItem["fill"], string> = { cyan: "#03C0E8", teal: "#40E0D0", lilac: "#D3D3FF", gray: "#C4C4C4" };
type Phase = "idle" | "spin" | "fall" | "tray";

function Coil({ spinning }: { spinning: boolean }) {
  // A side view of the spiral: loops drawn as one path; the dash moves when it turns.
  const loops = 6;
  let d = "M2 9";
  for (let i = 0; i < loops; i++) {
    const x = 2 + i * 13;
    d += ` C${x + 3} 1, ${x + 10} 1, ${x + 13} 9 C${x + 10} 17, ${x + 3} 17, ${x + 2} 9`;
  }
  return (
    <svg viewBox="0 0 82 18" className="w-full h-[16px] block" aria-hidden="true">
      <path
        d={d}
        fill="none"
        stroke="#121318"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="10 4"
        className={spinning ? "animate-[ub-coil_.35s_linear_infinite]" : ""}
      />
    </svg>
  );
}

function Booklet({ item, small = false }: { item: VendingItem; small?: boolean }) {
  return (
    <span
      className={`relative flex flex-col justify-between rounded-[6px] border-2 border-ink text-ink text-left shadow-[2px_2px_0_#121318] ${small ? "w-[46px] h-[56px] p-1" : "w-[58px] h-[72px] p-1.5 sm:w-[66px] sm:h-[80px]"}`}
      style={{ background: FILL[item.fill] }}
    >
      <span className={`font-display font-bold leading-[1.05] ${small ? "text-[7px]" : "text-[9px] sm:text-[10px]"}`}>{item.short}</span>
      <span className="flex items-center justify-between">
        <span className={`font-mono ${small ? "text-[7px]" : "text-[9px]"}`}>PDF</span>
        <span className={`rounded-sm bg-[#FFFBF4] border border-ink px-0.5 font-mono ${small ? "text-[7px]" : "text-[9px]"}`}>{item.code}</span>
      </span>
    </span>
  );
}

export function VendingMachine() {
  const [entry, setEntry] = useState("");
  const [msg, setMsg] = useState("PICK ONE");
  const [active, setActive] = useState<VendingItem | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [drop, setDrop] = useState(0);
  const [open, setOpen] = useState(false);
  const itemRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const tray = useRef<HTMLDivElement>(null);
  const getIt = useRef<HTMLAnchorElement>(null);
  const busy = phase !== "idle";

  useEffect(() => {
    if (open) setTimeout(() => getIt.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && open) close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function vend(code: string) {
    const item = VENDING.find((v) => v.code === code);
    if (!item) { setMsg("NO SUCH SLOT"); setEntry(""); return; }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = itemRefs.current[code];
    if (el && tray.current) {
      const a = el.getBoundingClientRect(), b = tray.current.getBoundingClientRect();
      setDrop(b.top + b.height / 2 - (a.top + a.height / 2));
    }
    setActive(item);
    setMsg("VENDING...");
    setPhase("spin");
    setTimeout(() => setPhase("fall"), reduce ? 100 : 1300);
    setTimeout(() => { setPhase("tray"); setMsg("ENJOY"); }, reduce ? 300 : 2000);
    setTimeout(() => { setOpen(true); }, reduce ? 500 : 2500);
  }

  function press(key: string) {
    if (busy) return;
    if (key === "CLR") { setEntry(""); setMsg("PICK ONE"); return; }
    if (VENDING_ROWS.includes(key)) { setEntry(key); setMsg("NOW A NUMBER"); return; }
    if (!entry) { setMsg("LETTER FIRST"); return; }
    const code = entry + key;
    setEntry(code);
    vend(code);
  }

  // Clicking an item picks its letter; a second click on it within half a second (a double-click or double-tap) vends it.
  const lastTap = useRef({ code: "", at: 0 });
  function pick(code: string) {
    if (busy) return;
    const now = Date.now();
    if (lastTap.current.code === code && now - lastTap.current.at < 500) {
      lastTap.current = { code: "", at: 0 };
      setEntry(code);
      vend(code);
      return;
    }
    lastTap.current = { code, at: now };
    setEntry(code[0]);
    setMsg(`PRESS ${code[1]}`);
  }

  function close() {
    setOpen(false);
    setPhase("idle");
    setActive(null);
    setEntry("");
    setMsg("PICK ONE");
  }

  const itemStyle = (code: string): React.CSSProperties => {
    if (!active || active.code !== code) return {};
    if (phase === "spin") return { transform: "translateY(4px) scale(1.08)", transition: "transform 1.2s cubic-bezier(.65,0,.35,1)" };
    if (phase === "fall") return { transform: `translateY(${drop}px) rotate(14deg) scale(1.08)`, transition: "transform .7s cubic-bezier(.55,0,1,.45)", zIndex: 20 };
    if (phase === "tray") return { opacity: 0 };
    return {};
  };

  const keyBtn = "h-10 rounded-lg border-2 border-ink bg-[#FFFBF4] text-ink font-display font-bold text-[16px] shadow-[2px_2px_0_#121318] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60";

  return (
    <div className="w-full max-w-[440px] mx-auto">
      <div className="sticker rounded-[28px] bg-cyan p-3 sm:p-4 flex flex-col gap-3">
        <div className="flex gap-3">
          {/* glass */}
          <div className="relative flex-1 min-w-0 rounded-[18px] border-2 border-ink bg-[#FFFBF4]/85 p-2 sm:p-3">
            <div className="grid grid-cols-3 gap-x-1.5 gap-y-2">
              {VENDING_ROWS.map((r, ri) =>
                VENDING_COLS.map((c, ci) => {
                  const item = VENDING.find((v) => v.code === r + c)!;
                  const spinning = phase === "spin" && active?.code === item.code;
                  const tipPos = ci === 0 ? "left-0" : ci === 2 ? "right-0" : "left-1/2 -translate-x-1/2";
                  const tipV = ri === 0 ? "top-full mt-1" : "bottom-full mb-1";
                  return (
                    <div key={item.code} className="group relative flex flex-col items-center">
                      <button
                        type="button"
                        aria-label={`${item.code}: ${item.headline}`}
                        onClick={() => pick(item.code)}
                        className="relative flex justify-center pt-1 focus-visible:outline-offset-1"
                      >
                        <span ref={(n) => { itemRefs.current[item.code] = n; }} className="relative block" style={itemStyle(item.code)}>
                          <Booklet item={item} />
                        </span>
                      </button>
                      <Coil spinning={spinning} />
                      <span className="mt-0.5 rounded bg-ink px-1 font-mono text-[9px] text-cream whitespace-nowrap">{item.code}<span className="hidden sm:inline"> · free</span></span>
                      {/* hover card */}
                      <div className={`pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition absolute ${tipPos} ${tipV} z-30 w-[220px] rounded-[14px] bg-surface text-foreground sticker-sm p-3 text-left`}>
                        <p className="font-display font-bold text-[15px] leading-tight">{item.headline}</p>
                        <p className="mt-1 text-[13px] leading-snug">{item.what}</p>
                        <p className="mt-1 text-[13px] leading-snug text-muted">{item.why}</p>
                      </div>
                    </div>
                  );
                }),
              )}
            </div>
          </div>

          {/* keypad */}
          <div className="w-[96px] sm:w-[108px] shrink-0 flex flex-col gap-2">
            <div className="rounded-[12px] border-2 border-ink bg-ink px-2 py-2 text-center" aria-live="polite">
              <p className="font-mono text-[26px] leading-none text-teal tracking-[.08em]">{entry.padEnd(2, "_")}</p>
              <p className="mt-1 font-mono text-[9px] leading-tight text-cream">{msg}</p>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {["A", "1", "B", "2", "C", "3", "D", "CLR"].map((k) => (
                <button key={k} type="button" disabled={busy} onClick={() => press(k)} className={`${keyBtn} ${k === "CLR" ? "!text-[11px]" : ""}`} aria-label={k === "CLR" ? "Clear" : `Key ${k}`}>
                  {k}
                </button>
              ))}
            </div>
            <div className="mt-auto rounded-lg border-2 border-ink bg-[#FFFBF4] h-8 grid place-items-center" aria-hidden="true">
              <span className="w-10 h-1.5 rounded-full bg-ink" />
            </div>
          </div>
        </div>

        {/* pickup tray */}
        <div ref={tray} className="relative h-[72px] rounded-[16px] border-2 border-ink bg-ink/90 flex items-center justify-center overflow-hidden">
          <span className="absolute left-3 top-2 font-mono text-[10px] text-cream tracking-[.1em]">PUSH</span>
          {phase === "tray" && active && (
            <span className="rotate-[8deg] motion-safe:animate-[ub-pop_.35s_cubic-bezier(.2,1.6,.4,1)]"><Booklet item={active} small /></span>
          )}
        </div>
      </div>

      {/* pop-up */}
      {open && active && createPortal(
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#121318]/60 p-4" onClick={close}>
          <div role="dialog" aria-modal="true" aria-labelledby="vend-title" onClick={(e) => e.stopPropagation()} className="sticker rounded-[24px] bg-surface w-full max-w-[440px] p-6 flex flex-col gap-4 motion-safe:animate-[ub-pop_.35s_cubic-bezier(.2,1.6,.4,1)]">
            <div className="flex items-start justify-between gap-4">
              <span className="label rounded-full px-3 py-[7px] text-ink" style={{ background: FILL[active.fill] }}>{active.code} · free</span>
              <button type="button" onClick={close} aria-label="Close" className="w-9 h-9 grid place-items-center rounded-full border-2 border-border text-lg leading-none">&times;</button>
            </div>
            <h3 id="vend-title" className="font-display font-extrabold text-[26px] leading-tight">{active.headline}</h3>
            <p>{active.what}</p>
            <p className="text-muted">{active.why}</p>

            <a
              ref={getIt}
              href={`/vending/${active.code.toLowerCase()}.pdf`}
              target="_blank"
              rel="noopener"
              className="btn btn-primary !h-auto min-h-[52px] py-3 text-center leading-tight"
            >
              {active.headline}
            </a>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
