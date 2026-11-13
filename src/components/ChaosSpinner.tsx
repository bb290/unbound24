"use client";

import { useEffect, useRef, useState } from "react";
import { SPINNER_THINGS, SPINNER_VERDICTS } from "@/content/spinner";

// Slice fills are the brand palette plus ink and cream; they read the same in both themes.
const FILLS = ["#03C0E8", "#40E0D0", "#D3D3FF", "#C4C4C4", "#121318", "#F8F0E3"];
const INK = "#121318";
const CREAM = "#F8F0E3";
const N = SPINNER_THINGS.length;
const A = 360 / N;

// Seeded shuffle so the wheel looks chaotic but the same every load; no two neighbors match.
const SLICE: number[] = (() => {
  let seed = 24;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const out: number[] = [];
  for (let i = 0; i < N; i++) {
    let c;
    do c = Math.floor(rnd() * FILLS.length);
    while (c === out[i - 1] || (i === N - 1 && c === out[0]));
    out.push(c);
  }
  return out;
})();

function draw(cv: HTMLCanvasElement, hit: number) {
  const ctx = cv.getContext("2d");
  if (!ctx) return;
  const r = cv.width / 2;
  ctx.clearRect(0, 0, cv.width, cv.height);
  for (let i = 0; i < N; i++) {
    const a0 = ((i * A - 90) * Math.PI) / 180, a1 = (((i + 1) * A - 90) * Math.PI) / 180;
    ctx.beginPath(); ctx.moveTo(r, r); ctx.arc(r, r, r, a0, a1); ctx.closePath();
    ctx.fillStyle = i === hit ? FILLS[0] : FILLS[SLICE[i]]; ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = i === hit ? 5 : 1.5; ctx.stroke();
    const mid = (((i + 0.5) * A - 90) * Math.PI) / 180;
    ctx.save(); ctx.translate(r + Math.cos(mid) * r * 0.9, r + Math.sin(mid) * r * 0.9); ctx.rotate(mid + Math.PI / 2);
    ctx.fillStyle = SLICE[i] === 4 && i !== hit ? CREAM : INK;
    ctx.font = "700 17px Figtree, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(String(i + 1), 0, 0); ctx.restore();
  }
  ctx.beginPath(); ctx.arc(r, r, r * 0.66, 0, Math.PI * 2); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
}

export function ChaosSpinner({ ctaHref }: { ctaHref: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const rot = useRef(0);
  const [busy, setBusy] = useState(false);
  const [spins, setSpins] = useState(0);
  const [last, setLast] = useState(-1);
  const [pop, setPop] = useState(0);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    draw(cv, -1);
    document.fonts?.ready.then(() => draw(cv, -1));
  }, []);

  function spin() {
    const cv = canvas.current;
    if (busy || !cv) return;
    setBusy(true);
    let i;
    do i = Math.floor(Math.random() * N);
    while (i === last);
    const target = ((((-(i + 0.5) * A) % 360) + 360) % 360);
    rot.current += 360 * 5 + ((target - (rot.current % 360) + 360) % 360);
    draw(cv, -1);
    cv.style.transform = `rotate(${rot.current}deg)`;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      draw(cv, i);
      setLast(i);
      setSpins((s) => s + 1);
      setPop((p) => p + 1);
      setBusy(false);
    }, reduce ? 650 : 4250);
  }

  const verdict = SPINNER_VERDICTS.filter((v) => spins >= v[0]).pop()?.[1] ?? "";

  return (
    <div className="grid gap-10 items-center lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col gap-5 min-w-0">
        <span className="label self-start rounded-full bg-lilac px-3 py-[7px] text-ink">Try it</span>
        <h2 className="font-display font-extrabold text-[38px] leading-none tracking-[-0.02em] sm:text-[56px]">
          Are you running your business{" "}
          <span className="torn bg-lilac">like this?</span>
        </h2>
        <p className="text-lg leading-relaxed max-w-[44ch]">
          Spin the wheel. Do whatever it says. Repeat until the business runs itself.
        </p>

        <div
          key={pop}
          aria-live="polite"
          className="rounded-[20px] bg-surface sticker-sm p-5 min-h-[132px] flex flex-col gap-2 motion-safe:animate-[ub-pop_.45s_cubic-bezier(.2,1.6,.4,1)]"
        >
          <span className="label text-muted">{last < 0 ? "Today's task" : `Slice ${last + 1} of ${N}`}</span>
          <span className={`font-display font-bold text-[26px] leading-[1.05] sm:text-[32px] ${last < 0 ? "text-muted" : ""}`}>
            {last < 0 ? "Hit spin to find out." : SPINNER_THINGS[last]}
          </span>
        </div>

        <div className="flex flex-col gap-1.5" aria-label="Chaos meter">
          <div className="flex justify-between text-sm font-semibold">
            <span>Chaos meter</span>
            <span className="font-mono">{spins} {spins === 1 ? "spin" : "spins"}</span>
          </div>
          <div className="h-4 rounded-full border-2 border-border bg-surface overflow-hidden">
            <i
              className="block h-full transition-[width] duration-500"
              style={{ width: `${Math.min(100, spins * 9)}%`, background: "repeating-linear-gradient(-45deg, #121318 0 6px, #03C0E8 6px 12px)" }}
            />
          </div>
        </div>
        <p className="font-display font-bold text-lg min-h-[2.6em] m-0">{verdict}</p>
        {spins >= 5 && (
          <a href={ctaHref} className="btn btn-secondary self-start">
            Trade the wheel for a system
          </a>
        )}
      </div>

      <div className="flex justify-center min-w-0">
        <div className="relative w-full max-w-[480px] aspect-square">
          <span
            aria-hidden="true"
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-[2] w-0 h-0 border-x-[16px] border-x-transparent border-t-[30px]"
            style={{ borderTopColor: "var(--text)" }}
          />
          <canvas
            ref={canvas}
            width={960}
            height={960}
            role="img"
            aria-label={`A spinning wheel with ${N} slices, one for each thing a business owner could do`}
            className="w-full h-full block rounded-full border-[3px] border-border will-change-transform transition-transform duration-[4200ms] ease-[cubic-bezier(.12,.72,.08,1)] motion-reduce:duration-[600ms]"
          />
          <button
            type="button"
            onClick={spin}
            disabled={busy}
            className="absolute inset-0 m-auto w-[30%] h-[30%] rounded-full border-[3px] border-ink bg-cyan text-ink font-display font-extrabold text-[clamp(22px,4vw,34px)] tracking-[.04em] z-[3] shadow-[0_5px_0_#121318] hover:bg-teal active:translate-y-1 active:shadow-[0_1px_0_#121318] disabled:bg-lilac disabled:cursor-progress"
          >
            SPIN
          </button>
        </div>
      </div>
    </div>
  );
}
