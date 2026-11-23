"use client";

import { useEffect, useRef, useState } from "react";
import { START_EVENT } from "./brand-guide/BrandGuideWidget";

// Each demo has its label centered above the box (Brittany, 2026-11-17).
// label is optional: the website check has none (Brittany, 2026-11-18).
function Framed({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 w-full min-w-0">
      {label ? <span className="label rounded-full bg-lilac text-ink px-3 py-[7px]">{label}</span> : null}
      <div className="w-full">{children}</div>
    </div>
  );
}

// Live examples for the Website Dev add-ons (Brittany, 2026-11-17: "show examples"). Made-up numbers, clearly
// labelled as examples; they don't save or send anything.

// Unbranded roofer instant estimate (Brittany, 2026-11-17): works like the instant roof quote we built for a roofing
// client (size, material, roof shape, extras, then a range and "Book Free Roof Assessment"), with our own copy and
// made-up prices. Never their brand, product names or numbers.
// Small line icons for every roof option (Brittany, 2026-11-17: "add icons on every option").
function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className="w-10 h-10 shrink-0" fill="none" stroke="#121318" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
function House({ w }: { w: number }) {
  const x0 = 20 - w / 2, x1 = 20 + w / 2, h = w * 0.55, roof = w * 0.45;
  return (
    <Svg>
      <path d={`M${x0 - 2} ${34 - h} L20 ${34 - h - roof} L${x1 + 2} ${34 - h}`} />
      <path d={`M${x0} ${34 - h} V34 H${x1} V${34 - h}`} fill="#40e0d0" />
      <path d={`M18 34 v-${Math.max(5, h * 0.5)} h4 V34`} />
    </Svg>
  );
}
function Stars({ n }: { n: number }) {
  const star = (cx: number) => `M${cx} 13 l2.4 5 5.4.6 -4 3.7 1.1 5.3 -4.9-2.7 -4.9 2.7 1.1-5.3 -4-3.7 5.4-.6z`;
  const xs = n === 1 ? [20] : n === 2 ? [13, 27] : [8, 20, 32];
  return <Svg>{xs.map((x) => <path key={x} d={star(x)} fill="#40e0d0" strokeWidth="1.6" />)}</Svg>;
}
const SHAPE_ICONS = [
  <Svg key="s"><path d="M4 28 L20 18 L36 28" /><path d="M8 26 V34 H32 V26" /></Svg>,
  <Svg key="m"><path d="M4 28 L20 14 L36 28" /><path d="M8 25 V34 H32 V25" /><path d="M22 22 l5-5 5 5 v4 h-10z" fill="#d3d3ff" /></Svg>,
  <Svg key="c"><path d="M3 30 L13 10 L21 24 L28 8 L37 30" /><path d="M6 27 V35 H34 V27" /></Svg>,
];
const EXTRA_ICONS = [
  <Svg key="g"><path d="M6 12 h28" /><path d="M8 12 v5 a3 3 0 0 0 3 3 h18 a3 3 0 0 0 3-3 v-5" fill="#40e0d0" /><path d="M30 20 v12" /><path d="M14 26 v3 M20 25 v4" /></Svg>,
  <Svg key="k"><path d="M4 30 L20 10 L36 30" /><path d="M16 20 l7-3 3 6 -7 3z" fill="#03c0e8" /></Svg>,
];
const SIZE_ICONS = [14, 18, 22, 26].map((w) => <House key={w} w={w} />);
const MATERIAL_ICONS = [1, 2, 3].map((n) => <Stars key={n} n={n} />);

const SIZES = [
  { label: "Small", hint: "Cottage, ranch home or garage", squares: 12 },
  { label: "Medium", hint: "Most single-story homes", squares: 20 },
  { label: "Large", hint: "Bigger single-story or most two-story", squares: 30 },
  { label: "Extra large", hint: "Big two-story or lots of sections", squares: 40 },
];
const MATERIALS = [
  { label: "Good", hint: "Standard architectural shingle", x: 1 },
  { label: "Better", hint: "Thicker shingle, richer color", x: 1.2 },
  { label: "Best", hint: "Designer shingle with a shake look", x: 1.5 },
];
const SHAPES = [
  { label: "Simple", hint: "Easy to walk, few angles", x: 1 },
  { label: "Some angles", hint: "A few valleys or dormers", x: 1.15 },
  { label: "Steep and busy", hint: "Steep, multi-level, lots going on", x: 1.3 },
];
const EXTRAS = [
  { label: "New gutters", price: 2000 },
  { label: "Skylight swap", price: 900 },
];
const PER_SQUARE = 475;
const STEPS = ["How big is the roof?", "Pick a material", "What shape is it?", "Anything extra?"];
const money = (n: number) => `$${(Math.round(n / 100) * 100).toLocaleString("en-US")}`;

function Option({ label, hint, icon, on, onClick }: { label: string; hint: string; icon: React.ReactNode; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`flex items-center gap-3 text-left rounded-2xl border-2 border-ink px-3 py-3 min-h-[60px] transition ${on ? "bg-teal" : "bg-[#FFFDF8] hover:bg-[#f8f0e3]"}`}
    >
      {icon}
      <span className="min-w-0">
        <span className="block font-bold text-[16px]">{label}</span>
        <span className="block text-[14px] text-[#4a4c55]">{hint}</span>
      </span>
    </button>
  );
}

export function RoofEstimateDemo() {
  const [step, setStep] = useState(0);
  const [size, setSize] = useState<number | null>(null);
  const [material, setMaterial] = useState<number | null>(null);
  const [shape, setShape] = useState<number | null>(null);
  const [extras, setExtras] = useState<number[]>([]);
  const [booked, setBooked] = useState(false);
  const done = step === STEPS.length;

  const pick = (set: (i: number) => void) => (i: number) => { set(i); setStep(step + 1); };
  const reset = () => { setStep(0); setSize(null); setMaterial(null); setShape(null); setExtras([]); setBooked(false); };

  let low = 0, high = 0;
  if (done && size !== null && material !== null && shape !== null) {
    const base = SIZES[size].squares * PER_SQUARE * MATERIALS[material].x * SHAPES[shape].x;
    const add = extras.reduce((sum, i) => sum + EXTRAS[i].price, 0);
    low = base * 0.85 + add;
    high = base * 1.15 + add;
  }

  return (
    <Framed label="Example: a roofer">
    <div className="rounded-[20px] border-2 border-ink bg-[#FFFDF8] text-ink p-5 sm:p-6 flex flex-col gap-5">
      <div className="text-center">
        <p className="font-display font-extrabold text-[26px] leading-tight">Instant roof estimate</p>
        <p className="text-[16px] text-[#4a4c55] mt-1">A ballpark price in under a minute. Email NOT required.</p>
      </div>

      <div className="flex gap-1.5" aria-hidden="true">
        {STEPS.map((_, i) => <span key={i} className={`h-2 flex-1 rounded-full border border-ink ${i < step || done ? "bg-ink" : i === step ? "bg-cyan" : "bg-[#f8f0e3]"}`} />)}
      </div>

      <div aria-live="polite" className="flex flex-col gap-3 min-h-[260px]">
        {!done && <p className="font-bold text-[17px] text-center">{STEPS[step]}</p>}
        {step === 0 && <div className="grid gap-2 sm:grid-cols-2">{SIZES.map((o, i) => <Option key={o.label} {...o} icon={SIZE_ICONS[i]} on={size === i} onClick={() => pick(setSize)(i)} />)}</div>}
        {step === 1 && <div className="grid gap-2">{MATERIALS.map((o, i) => <Option key={o.label} {...o} icon={MATERIAL_ICONS[i]} on={material === i} onClick={() => pick(setMaterial)(i)} />)}</div>}
        {step === 2 && <div className="grid gap-2">{SHAPES.map((o, i) => <Option key={o.label} {...o} icon={SHAPE_ICONS[i]} on={shape === i} onClick={() => pick(setShape)(i)} />)}</div>}
        {step === 3 && (
          <div className="flex flex-col gap-2">
            {EXTRAS.map((o, i) => (
              <Option
                key={o.label}
                label={o.label}
                hint={`+${money(o.price)}`}
                icon={EXTRA_ICONS[i]}
                on={extras.includes(i)}
                onClick={() => setExtras(extras.includes(i) ? extras.filter((x) => x !== i) : [...extras, i])}
              />
            ))}
            <button type="button" onClick={() => setStep(4)} className="mt-1 self-center min-h-[44px] px-5 rounded-full bg-ink text-[#FFFDF8] font-bold">
              {extras.length ? "See my price" : "No extras, see my price"}
            </button>
          </div>
        )}
        {done && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border-2 border-ink bg-cyan p-4 text-center">
              <p className="text-sm font-bold">Your ballpark</p>
              <p className="font-display font-extrabold text-[34px] leading-tight">{money(low)} to {money(high)}</p>
              <p className="text-sm mt-1">
                {SIZES[size!].label} roof, {MATERIALS[material!].label.toLowerCase()} shingle, {SHAPES[shape!].label.toLowerCase()}
                {extras.length ? `, plus ${extras.map((i) => EXTRAS[i].label.toLowerCase()).join(" and ")}` : ""}. The free assessment gets you an exact price.
              </p>
            </div>
            <button type="button" onClick={() => setBooked(true)} className="btn btn-cta self-center">Book Free Roof Assessment</button>
            {booked && <p className="text-sm font-bold text-center">On a real roofer&apos;s site, this opens their booking calendar.</p>}
          </div>
        )}
      </div>

      {(step > 0 || done) && (
        <div className="flex justify-center gap-4 text-sm font-bold">
          {!done && <button type="button" onClick={() => setStep(step - 1)} className="underline underline-offset-4">Back</button>}
          <button type="button" onClick={reset} className="underline underline-offset-4">Start over</button>
        </div>
      )}
    </div>
    </Framed>
  );
}

// Website check (Brittany, 2026-11-17: "add 1 more widget"): an example of an assessment that also sends people to
// the one thing this page wants, the free website mock up (#brand-guide).
const CHECKS = [
  "It looks right on a phone.",
  "A stranger can tell what you do and where in 5 seconds.",
  "People can book or get a price without calling.",
  "It shows real photos of your work and your crew.",
  "Your reviews are right on it.",
  "You can change it yourself without waiting on anyone.",
];

// One question at a time: tap an answer and the next one shows (Brittany, 2026-11-17).
export function WebsiteCheckDemo() {
  const [answers, setAnswers] = useState<boolean[]>([]);
  const i = answers.length;
  const done = i === CHECKS.length;
  const yes = answers.filter(Boolean).length;
  // Result copy (Brittany, 2026-11-17): "Room for Improvement" / "You know it, I know it. It's ok. Lemme fix it:"
  const perfect = yes === CHECKS.length;
  const verdict = perfect ? "Pulling Its Weight" : "Room for Improvement";
  const verdictSub = perfect ? "Nice. Want to see it even better? Lemme show you:" : "You know it, I know it. It's ok. Lemme fix it:";

  return (
    <Framed>
    <div className="rounded-[20px] border-2 border-ink bg-[#FFFDF8] text-ink p-5 sm:p-6 flex flex-col gap-5">
      <div className="text-center">
        <p className="font-display font-extrabold text-[26px] leading-tight">Is your website costing you jobs?</p>
        <p className="text-[16px] text-[#4a4c55] mt-1">6 quick questions. Be Honest.</p>
      </div>
      <div className="flex gap-1.5" aria-hidden="true">
        {CHECKS.map((_, j) => <span key={j} className={`h-2 flex-1 rounded-full border border-ink ${j < i ? "bg-ink" : j === i ? "bg-cyan" : "bg-[#f8f0e3]"}`} />)}
      </div>
      <div aria-live="polite">
        {!done ? (
          <div className="flex flex-col items-center gap-4 text-center min-h-[150px] justify-center">
            <p className="text-sm font-bold text-[#4a4c55]">{i + 1} of {CHECKS.length}</p>
            <p className="font-display font-extrabold text-[22px] leading-snug max-w-[26ch]">{CHECKS[i]}</p>
            <div className="flex gap-3 w-full max-w-[320px]">
              <button type="button" onClick={() => setAnswers([...answers, true])} className="flex-1 min-h-[52px] rounded-full border-2 border-ink bg-teal text-ink text-[17px] font-bold">Yes</button>
              <button type="button" onClick={() => setAnswers([...answers, false])} className="flex-1 min-h-[52px] rounded-full border-2 border-ink bg-lilac text-ink text-[17px] font-bold">No</button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-ink bg-cyan p-5 flex flex-col items-center text-center gap-3">
            <p className="text-sm font-bold">{yes} of {CHECKS.length}</p>
            <p className="font-display font-extrabold text-[26px] leading-tight">{verdict}</p>
            <p className="text-[18px] font-bold">{verdictSub}</p>
            <a href="#brand-guide" onClick={() => window.dispatchEvent(new Event(START_EVENT))} className="btn btn-cta self-center">Get Free Mock Up</a>
          </div>
        )}
      </div>
      {i > 0 && (
        <div className="flex justify-center gap-4 text-sm font-bold">
          {!done && <button type="button" onClick={() => setAnswers(answers.slice(0, -1))} className="underline underline-offset-4">Back</button>}
          <button type="button" onClick={() => setAnswers([])} className="underline underline-offset-4">Start over</button>
        </div>
      )}
    </div>
    </Framed>
  );
}

export function BeforeAfterDemo() {
  const [pos, setPos] = useState(50);
  return (
    <Framed label="Razzle Dazzle Sample">
    <div className="rounded-[20px] border-2 border-ink bg-[#FFFDF8] text-ink p-5 sm:p-6 flex flex-col gap-4">
      <div className="text-center">
        <p className="font-display font-extrabold text-[26px] leading-tight">Before/after slider</p>
        <p className="text-[16px] text-[#4a4c55] mt-1">Drag the handle.</p>
      </div>
      <div className="relative aspect-[16/11] rounded-2xl border-2 border-ink overflow-hidden select-none has-[input:focus-visible]:shadow-[0_0_0_4px_rgba(18,19,24,.3)]">
        {/* After: a site in a real brand */}
        <div aria-hidden="true" className="absolute inset-0 bg-[#f8f0e3] p-[6%] flex flex-col gap-[5%]">
          <div className="flex items-center justify-between">
            <span className="font-display font-extrabold text-[clamp(12px,2.6vw,18px)]">Ridge Paint Co.</span>
            <span className="rounded-full bg-ink text-[#FFFDF8] px-[4%] py-[1.5%] text-[clamp(9px,1.8vw,13px)] font-bold">Get a price</span>
          </div>
          <p className="font-display font-extrabold leading-[0.95] text-[clamp(20px,5.2vw,40px)] max-w-[11ch]">
            Clean lines. <span className="bg-teal px-1">Fair prices.</span>
          </p>
          <div className="grid grid-cols-3 gap-[4%] flex-1">
            <span className="rounded-xl border-2 border-ink bg-cyan" />
            <span className="rounded-xl border-2 border-ink bg-teal" />
            <span className="rounded-xl border-2 border-ink bg-lilac" />
          </div>
          <span className="absolute right-[3%] bottom-[4%] rounded-full bg-ink text-[#FFFDF8] px-2.5 py-1 text-[11px] font-bold tracking-wide">AFTER</span>
        </div>
        {/* Before: the site they have now */}
        <div aria-hidden="true" className="absolute inset-0 bg-[#d9d9d9] p-[6%] flex flex-col gap-[4%] font-serif" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <p className="text-[#0000cc] underline text-[clamp(9px,1.8vw,13px)]">Home | About Us | Services | Contact | Links</p>
          <p className="text-center font-bold text-[#cc0000] text-[clamp(14px,3.4vw,26px)] leading-tight">WELCOME TO OUR WEBSITE!!!</p>
          <p className="text-[clamp(9px,1.7vw,12px)] leading-snug text-[#333]">We are a full service painting company offering interior and exterior painting solutions for all of your residential and commercial painting needs. Call for a free estimate today. Licensed bonded insured.</p>
          <div className="flex-1 border-2 border-dashed border-[#888] grid place-items-center text-[clamp(9px,1.7vw,12px)] text-[#666]">[ under construction ]</div>
          <span className="absolute left-[3%] bottom-[4%] rounded-full bg-[#555] text-white px-2.5 py-1 text-[11px] font-bold tracking-wide font-sans">BEFORE</span>
        </div>
        {/* Handle */}
        <div aria-hidden="true" className="absolute top-0 bottom-0 w-[3px] bg-ink -translate-x-1/2 pointer-events-none" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full border-2 border-ink bg-[#FFFDF8] text-[14px] font-bold">↔</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare the old website and the new one"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        />
      </div>
    </div>
    </Framed>
  );
}

// Review carousel (Brittany, 2026-11-17: "add a review carousel, branded like Unbound, as another widget example").
// Made-up reviews for a sample roofer, labelled as such: never present invented reviews as real ones.
const REVIEWS = [
  { text: "They showed up when they said, cleaned up every nail, and the price matched the estimate.", who: "Dana R.", when: "2 weeks ago", fill: "bg-cyan" },
  { text: "Storm took half our shingles. New roof in two days, and they handled the insurance photos.", who: "Marcus T.", when: "1 month ago", fill: "bg-teal" },
  { text: "No upsell. They fixed the flashing and told us the roof has ten good years left.", who: "Priya S.", when: "2 months ago", fill: "bg-lilac" },
  { text: "The crew was great with our dogs, and the yard looked better than before they came.", who: "Jim and Carol B.", when: "3 months ago", fill: "bg-cyan" },
];

export function ReviewCarouselDemo() {
  const [i, setI] = useState(0);
  const paused = useRef(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => { if (!paused.current) setI((n) => (n + 1) % REVIEWS.length); }, 6000);
    return () => clearInterval(t);
  }, []);
  const go = (n: number) => setI((n + REVIEWS.length) % REVIEWS.length);
  const r = REVIEWS[i];
  return (
    <Framed label="Review Carousel Sample">
    <div
      className="rounded-[20px] border-2 border-ink bg-[#FFFDF8] text-ink p-5 sm:p-6 flex flex-col gap-5"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <div className="text-center">
        <p className="font-display font-extrabold text-[26px] leading-tight">What the neighbors say</p>
        <p className="text-[16px] text-[#4a4c55] mt-1">Reviews with Style</p>
      </div>
      <figure aria-live="polite" className={`sticker rounded-[22px] ${r.fill} text-ink p-6 flex flex-col gap-4 min-h-[210px] transition-colors`}>
        <p className="text-[26px] leading-none tracking-[2px] text-[#FFF01F] [-webkit-text-stroke:1.5px_#121318]" aria-label="5 out of 5 stars">★★★★★</p>
        <blockquote className="font-display font-extrabold text-[22px] leading-snug">&ldquo;{r.text}&rdquo;</blockquote>
        <figcaption className="text-[15px] font-bold mt-auto">{r.who}{" "}<span className="font-medium">· {r.when} · sample review</span></figcaption>
      </figure>
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => go(i - 1)} aria-label="Previous review" className="grid place-items-center w-11 h-11 rounded-full border-2 border-ink bg-[#FFFDF8] text-[18px] font-bold">←</button>
        <div className="flex gap-2">
          {REVIEWS.map((_, n) => (
            <button key={n} type="button" onClick={() => go(n)} aria-label={`Review ${n + 1}`} aria-current={n === i} className={`w-3 h-3 rounded-full border-2 border-ink ${n === i ? "bg-ink" : "bg-transparent"}`} />
          ))}
        </div>
        <button type="button" onClick={() => go(i + 1)} aria-label="Next review" className="grid place-items-center w-11 h-11 rounded-full border-2 border-ink bg-[#FFFDF8] text-[18px] font-bold">→</button>
      </div>
    </div>
    </Framed>
  );
}

// Free download sample (Brittany, 2026-11-17: "a sample of a free download CTA that's kinda funny"). Demo only: the
// email never leaves the page.
export function FreeDownloadDemo() {
  const [done, setDone] = useState(false);
  return (
    <Framed label="Free Download Sample">
    <form
      onSubmit={(e) => { e.preventDefault(); setDone(true); }}
      className="rounded-[20px] border-2 border-ink bg-[#FFFDF8] text-ink p-5 sm:p-6 flex flex-col items-center text-center gap-4"
    >
      <p className="font-display font-extrabold text-[22px] leading-snug max-w-[30ch]">
        Get this incredibly valuable guide that will absolutely change your life for the better in multiple ways!
      </p>
      {done ? (
        <p aria-live="polite" className="text-[16px] font-bold">Just a sample. Nothing was sent, but your life is already better.</p>
      ) : (
        <div className="flex flex-col gap-3 w-full max-w-[360px]">
          <label htmlFor="fd-demo-email" className="font-bold text-sm text-left">Enter email:</label>
          <input id="fd-demo-email" type="email" required placeholder="you@example.com" className="w-full h-12 rounded-xl border-2 border-ink bg-[#FFFDF8] px-3.5 text-[16px] placeholder:text-[#6b6d75]" />
          <button type="submit" className="btn btn-primary self-center">Download</button>
        </div>
      )}
    </form>
    </Framed>
  );
}
