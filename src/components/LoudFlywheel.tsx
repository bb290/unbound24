"use client";

import { useEffect, useState } from "react";

// The Local + Loud loop, redesigned as a figure 8 (Brittany, 2026-11-18: "work creates content; content creates
// work"). Left loop: the work the business already does creates content (do the job, capture it, close it out for a
// review). Right loop: that content creates work (repurpose it, get found, qualify and book). Monthly website updates
// feed the right loop from outside. An orange dot rides the line; with reduced motion it stays put.
// Phones get the same story as two stacked cards. The "Exponential Growth" graph sits under it.

const WORK = [
  { n: 1, title: "Do the job", body: "Great service, start to finish. Every job is a commercial." },
  { n: 2, title: "Capture it", body: "Photos, videos and the story, pulled from the apps you already use." },
  { n: 3, title: "Close it out", body: "A thoughtful close-out: ask for feedback, then a Google review." },
];
const CONTENT = [
  { n: 4, title: "Repurpose it", body: "Reviews, photos, videos and stories become website pages and social posts." },
  { n: 5, title: "Get found", body: "More website traffic from Google, Maps and AI search." },
  { n: 6, title: "Qualify and book", body: "Your site answers questions and books the right customers." },
];
const UPDATES = { title: "+ Website updates", body: "Every month: FAQs, blog posts, SEO/AEO pages." };

const TEAL = "#40E0D0", CYAN = "#03C0E8", LILAC = "#D3D3FF", ORANGE = "#FFB27A", INK = "#121318";

// Figure 8 (lemniscate of Bernoulli), stretched taller. t from pi/2 to 5pi/2 starts at the crossing, runs the left
// loop (1, 2, 3), crosses, then runs the right loop (4, 5, 6) and comes back to the crossing.
const W = 1240, H = 690, CX = 620, CY = 340, A = 380, S = 1.42;
const pt = (t: number): [number, number] => {
  const d = 1 + Math.sin(t) ** 2;
  return [CX + (A * Math.cos(t)) / d, CY + (S * A * Math.sin(t) * Math.cos(t)) / d];
};
const PI = Math.PI;
const PATH = (() => {
  const N = 200, out: string[] = [];
  for (let i = 0; i <= N; i++) {
    const [x, y] = pt(PI / 2 + (i / N) * 2 * PI);
    out.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return "M" + out.join(" L");
})();
const NODE_T = [3 * PI / 4, PI, 5 * PI / 4, 7 * PI / 4, 2 * PI, 9 * PI / 4];
const NODES = NODE_T.map(pt);
// Direction chevrons between stops.
const CHEVRONS = [5, 7, 9, 11, 13, 15, 17, 19].map((k) => {
  const t = (k * PI) / 8;
  const [x, y] = pt(t), [x2, y2] = pt(t + 0.002);
  return { x, y, a: (Math.atan2(y2 - y, x2 - x) * 180) / PI };
});
const UPDATE_TARGET = pt(15 * PI / 8);
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(2)}%`;

// Where each stop's label sits around its circle: above, left, below (left loop); above, right, below (right loop).
const LABEL: { dx: number; dy: number; tx: string; w: string; align: string }[] = [
  { dx: 0, dy: -44, tx: "translate(-50%,-100%)", w: "21%", align: "text-center" },
  { dx: -44, dy: 0, tx: "translate(-100%,-50%)", w: "15%", align: "text-right" },
  { dx: 0, dy: 44, tx: "translate(-50%,0)", w: "21%", align: "text-center" },
  { dx: 0, dy: -44, tx: "translate(-50%,-100%)", w: "21%", align: "text-center" },
  { dx: 44, dy: 0, tx: "translate(0,-50%)", w: "15%", align: "text-left" },
  { dx: 0, dy: 44, tx: "translate(-50%,0)", w: "21%", align: "text-center" },
];

function Stop({ n, title, body, fill }: { n: number; title: string; body: string; fill: string }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="grid place-items-center shrink-0 w-9 h-9 rounded-full border-2 border-ink font-display font-extrabold text-ink" style={{ background: fill }}>{n}</span>
      <span><span className="block font-display font-extrabold text-[18px] leading-tight">{title}</span><span className="block text-[15px] leading-snug text-muted mt-0.5">{body}</span></span>
    </li>
  );
}

// Growth chart: x = time, y = happy customers; slow start, then exponential. Illustrative only, so no numbers on the
// axes. Each line has its own dash so color isn't the only cue (colors: --line-1..3 in globals.css, validated).
const LINES = [
  { label: "5-star reviews", color: "var(--line-2)", k: 4.6, amp: 1.0, dash: undefined, dot: true, wob: 3.1 },
  { label: "Social posts", color: "var(--line-1)", k: 4.2, amp: 0.82, dash: undefined, dot: false, wob: 4.3 },
  { label: "Website updates", color: "var(--line-3)", k: 3.6, amp: 0.62, dash: "10 7", dot: false, wob: 5.2 },
];
const X0 = 40, X1 = 340, Y0 = 190, Y1 = 18;
const noise = (i: number, seed: number) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};
const curve = (k: number, amp: number, wob = 0) => {
  const pts: string[] = [];
  const N = 28;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const base = amp * (Math.exp(k * t) - 1) / (Math.exp(k) - 1);
    const jitter = i === 0 || i === N ? 0 : noise(i, wob) * (0.012 + base * 0.22);
    const v = Math.max(0, base + jitter);
    pts.push(`${(X0 + t * (X1 - X0)).toFixed(1)},${(Y0 - v * (Y0 - Y1)).toFixed(1)}`);
  }
  return "M" + pts.join(" L");
};

export function LoudFlywheel() {
  const [still, setStill] = useState(false);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setStill(true);
  }, []);
  useEffect(() => {
    if (still) return;
    const t = setInterval(() => setFrame((f) => f + 1), 2000);
    return () => clearInterval(t);
  }, [still]);
  const progress = still ? 1 : ((frame % 8) + 1) / 8;
  const stops = [...WORK, ...CONTENT];

  return (
    <div className="flex flex-col gap-12">
      {/* Tablet and up: the figure 8 */}
      <div className="hidden md:block relative w-full max-w-[1180px] mx-auto" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full overflow-visible text-[color:var(--text)]" aria-hidden="true">
          <path d={PATH} fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="18 14" strokeLinecap="round" />
          {CHEVRONS.map((c, i) => (
            <path key={i} d="M-8,-9 L6,0 L-8,9" transform={`translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) rotate(${c.a.toFixed(1)})`} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {/* monthly website updates feed the content loop */}
          <path d={`M1070,150 Q1010,190 ${(UPDATE_TARGET[0] + 18).toFixed(1)},${(UPDATE_TARGET[1] + 6).toFixed(1)}`} fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 7" strokeLinecap="round" />
          <circle cx={UPDATE_TARGET[0] + 18} cy={UPDATE_TARGET[1] + 6} r="6" fill={LILAC} stroke={INK} strokeWidth="2.5" />
          {NODES.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="30" fill={i < 3 ? TEAL : CYAN} stroke={INK} strokeWidth="3" />
              <text x={x} y={y + 8} textAnchor="middle" fontSize="24" fontWeight="800" fill={INK}>{i + 1}</text>
            </g>
          ))}
          {!still && (
            <circle r="11" fill={ORANGE} stroke={INK} strokeWidth="3">
              <animateMotion dur="20s" repeatCount="indefinite" path={PATH} />
            </circle>
          )}
        </svg>

        {/* the point, inside each loop */}
        {[{ x: 400, text: ["Work creates", "content"], fill: TEAL }, { x: 840, text: ["Content creates", "work"], fill: CYAN }].map((l) => (
          <p key={l.x} className="absolute font-display font-extrabold leading-[1.02] text-center text-[clamp(20px,2.5vw,32px)] -translate-x-1/2 -translate-y-1/2 w-[19%]" style={{ left: pct(l.x, W), top: pct(CY, H) }}>
            {l.text[0]}<br /><span className="torn px-1 text-ink" style={{ background: l.fill }}>{l.text[1]}</span>
          </p>
        ))}

        {stops.map((s, i) => {
          const [x, y] = NODES[i], L = LABEL[i];
          return (
            <div key={s.n} className={`absolute ${L.align}`} style={{ left: pct(x + L.dx, W), top: pct(y + L.dy, H), width: L.w, transform: L.tx }}>
              <p className="font-display font-extrabold text-[clamp(15px,1.6vw,20px)] leading-tight">{s.title}</p>
              <p className="text-[clamp(12px,1.2vw,15px)] leading-snug text-muted mt-1">{s.body}</p>
            </div>
          );
        })}

        <div className="absolute sticker rounded-[14px] text-ink px-3 py-2" style={{ left: pct(1060, W), top: pct(22, H), width: "15%", background: LILAC }}>
          <p className="font-display font-extrabold text-[clamp(13px,1.4vw,17px)] leading-tight">{UPDATES.title}</p>
          <p className="text-[clamp(11px,1.1vw,14px)] leading-snug mt-0.5">{UPDATES.body}</p>
        </div>
      </div>

      {/* Phones: the same story, stacked */}
      <div className="md:hidden flex flex-col items-stretch gap-3">
        <div className="sticker rounded-[20px] bg-surface p-5">
          <p className="font-display font-extrabold text-[26px] leading-tight mb-4">Work creates <span className="torn px-1 text-ink" style={{ background: TEAL }}>content</span></p>
          <ol className="grid gap-4">{WORK.map((s) => <Stop key={s.n} {...s} fill={TEAL} />)}</ol>
        </div>
        <p className="text-center font-display font-extrabold text-[28px] leading-none" aria-hidden="true">↓</p>
        <div className="sticker rounded-[20px] bg-surface p-5">
          <p className="font-display font-extrabold text-[26px] leading-tight mb-4">Content creates <span className="torn px-1 text-ink" style={{ background: CYAN }}>work</span></p>
          <ol className="grid gap-4">{CONTENT.map((s) => <Stop key={s.n} {...s} fill={CYAN} />)}</ol>
          <div className="mt-4 rounded-[14px] border-2 border-ink text-ink px-3 py-2" style={{ background: LILAC }}>
            <p className="font-display font-extrabold text-[16px] leading-tight">{UPDATES.title}</p>
            <p className="text-[14px] leading-snug">{UPDATES.body}</p>
          </div>
        </div>
        <p className="text-center font-display font-extrabold text-[17px]">↺ Booked jobs, back to step 1</p>
      </div>

      {/* Screen readers: the loop once, in order */}
      <ol className="sr-only">
        {stops.map((s) => <li key={s.n}>{s.title}: {s.body}</li>)}
        <li>Website updates every month feed steps 4 to 6. Booked jobs go back to step 1, and it repeats.</li>
      </ol>

      <figure className="rounded-[20px] border-2 border-border bg-surface p-5 flex flex-col gap-3 m-0 w-full max-w-[620px] mx-auto">
        <figcaption className="font-display font-extrabold text-[20px]">Exponential Growth</figcaption>
        <svg viewBox="0 0 360 222" className="w-full h-auto text-[color:var(--text)]" role="img" aria-label="Line graph: social posts, 5-star reviews and website updates grow slowly at first, then sharply, as happy customers add up over time.">
          <defs>
            <clipPath id="ub-growth-reveal">
              <rect x="0" y="0" height="222" width={X0 + progress * (X1 - X0) + 8} style={{ transition: "width 900ms ease" }} />
            </clipPath>
          </defs>
          {[0.33, 0.66].map((f) => <line key={f} x1={X0} x2={X1} y1={Y0 - f * (Y0 - Y1)} y2={Y0 - f * (Y0 - Y1)} stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />)}
          <line x1={X0} y1={Y1 - 6} x2={X0} y2={Y0} stroke="currentColor" strokeWidth="1.5" />
          <line x1={X0} y1={Y0} x2={X1 + 6} y2={Y0} stroke="currentColor" strokeWidth="1.5" />
          <text x={X1 + 6} y={Y0 + 20} textAnchor="end" fontSize="12" fontWeight="700" fill="currentColor">Time →</text>
          <text x={14} y={(Y0 + Y1) / 2} textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor" transform={`rotate(-90 14 ${(Y0 + Y1) / 2})`}>Happy customers →</text>
          <g opacity="0.25">
            {LINES.map((l) => <path key={l.label} d={curve(l.k, l.amp, l.wob)} fill="none" stroke={l.color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={l.dash} />)}
          </g>
          <g clipPath="url(#ub-growth-reveal)">
            {LINES.map((l) => (
              <g key={l.label}>
                <path d={curve(l.k, l.amp, l.wob)} fill="none" stroke={l.color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={l.dash} />
                {l.dot && <circle cx={X1} cy={Y0 - l.amp * (Y0 - Y1)} r="7" fill={l.color} stroke="var(--surface)" strokeWidth="2.5" />}
              </g>
            ))}
          </g>
        </svg>
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[14px] font-bold" aria-label="Legend">
          {LINES.map((l) => (
            <li key={l.label} className="flex items-center gap-2">
              <svg viewBox="0 0 28 10" className="w-7 h-2.5" aria-hidden="true"><line x1="2" y1="5" x2={l.dot ? 19 : 26} y2="5" stroke={l.color} strokeWidth="4.5" strokeLinecap="round" strokeDasharray={l.dash} />{l.dot && <circle cx="23" cy="5" r="4" fill={l.color} />}</svg>
              {l.label}
            </li>
          ))}
        </ul>
      </figure>
    </div>
  );
}
