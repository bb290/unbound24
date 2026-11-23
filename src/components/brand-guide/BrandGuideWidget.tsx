"use client";

import { useEffect, useRef, useState } from "react";
import { PROMPTS, PROMPTS_INTRO, STEPS, type Answers, type Field } from "@/content/brand-guide";
import { fileSlug, parse, runs } from "./markdown";

// Free Brand Guide (Brittany, 2026-11-14): the home page's primary CTA. a few short steps (about 5 minutes; Brittany 2026-11-17: never promise a number of questions), no email, the guide is written
// live (OpenRouter via /api/brand-guide), then downloads as PDF and .md with prompts. The call to action on the
// finished guide is "Submit for Mock Up" (Brittany 2026-11-17). Headlines never start with "Your" (Brittany 2026-11-17).
// Answers are kept in this browser only (localStorage) so a refresh doesn't lose them.

type Stage = "intro" | "ask" | "writing" | "done" | "error";
const KEY = "ub-brand-guide-v1";

function load(): { answers: Answers; guide: string } {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { answers: {}, guide: "" };
}
function save(answers: Answers, guide: string) {
  try { localStorage.setItem(KEY, JSON.stringify({ answers, guide })); } catch {}
}

function filled(f: Field, a: Answers) {
  const v = a[f.id];
  return Array.isArray(v) ? v.length > 0 : typeof v === "string" && v.trim().length > 0;
}

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Buttons elsewhere on a page start the guide by sending this event (Brittany, 2026-11-17: the Website Dev hero button
// "When they click this, start the brand guide"). See StartGuideLink.
export const START_EVENT = "ub-brand-guide-start";

// The Website Dev page uses its own intro (Brittany, 2026-11-17): no label, "Start Here", the numbered path, no
// "No email required." The home page keeps the original intro.
const MOCKUP_PATH = ["Answer questions", "Download guide + prompts", "Use right away", "Submit for site mock up", "Book more jobs", "Retire young 😎"];

// introless (Local + Loud, Brittany 2026-11-18: "remove this box"): no intro box at rest; the widget appears at its
// first question when a "Get Free Mock Up" button is clicked, and scrolls itself into view.
export function BrandGuideWidget({ variant = "home", introless = false }: { variant?: "home" | "websites"; introless?: boolean }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [guide, setGuide] = useState("");
  const [error, setError] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);
  const [status, setStatus] = useState<{ ready: boolean; leads: boolean } | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);
  const wantStart = useRef(false);

  useEffect(() => {
    const saved = load();
    setAnswers(saved.answers ?? {});
    if (saved.guide) { setGuide(saved.guide); setStage("done"); }
  }, []);

  useEffect(() => () => abort.current?.abort(), []);

  useEffect(() => {
    fetch("/api/brand-guide", { cache: "no-store" })
      .then((r) => r.json())
      .then((s) => setStatus({ ready: Boolean(s.ready), leads: Boolean(s.leads) }))
      .catch(() => setStatus({ ready: false, leads: false }));
  }, []);

  // A start button elsewhere on the page: open the first question (only from the intro; a finished guide stays put).
  useEffect(() => {
    const onStart = () => { wantStart.current = true; setStage((s) => (s === "intro" && status?.ready ? "ask" : s)); };
    window.addEventListener(START_EVENT, onStart);
    return () => window.removeEventListener(START_EVENT, onStart);
  }, [status]);
  useEffect(() => {
    if (wantStart.current && status?.ready) setStage((s) => (s === "intro" ? "ask" : s));
  }, [status]);

  function set(id: string, v: string | string[]) {
    setAnswers((a) => {
      const next = { ...a, [id]: v };
      save(next, "");
      return next;
    });
  }

  function scrollTop() {
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 80) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const current = STEPS[step];
  const ready = current?.fields.every((f) => f.optional || filled(f, answers));

  async function write() {
    setStage("writing");
    setGuide("");
    setError("");
    scrollTop();
    const ctrl = new AbortController();
    abort.current = ctrl;
    try {
      const res = await fetch("/api/brand-guide", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }), signal: ctrl.signal });
      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error === "rate-limited" ? "You've made a few guides already. Try again in an hour." : body.error === "not-configured" ? "The guide writer isn't switched on yet. Check back soon." : "Something went wrong writing your guide. Try again.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        setGuide(text);
      }
      if (!text.trim()) throw new Error("Something went wrong writing your guide. Try again.");
      save(answers, text);
      setStage("done");
    } catch (e) {
      if (ctrl.signal.aborted) return;
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setStage("error");
    }
  }

  function next() {
    if (!ready) return;
    if (step < STEPS.length - 1) { setStep(step + 1); scrollTop(); }
    else void write();
  }

  function restart() {
    abort.current?.abort();
    setGuide("");
    setStep(0);
    save(answers, "");
    setStage("ask");
  }

  const business = typeof answers.name === "string" ? answers.name : "";
  const slug = fileSlug(business);

  function mdFile() {
    const md = `${guide.trim()}\n\n## Prompts to put it to work\n\n${PROMPTS_INTRO}\n\n${PROMPTS.map((p, i) => `### ${i + 1}. ${p.title}\n\n${p.text}`).join("\n\n")}\n\n---\nMade with the free brand guide at unbound24.com\n`;
    download(`${slug}-brand-guide.md`, new Blob([md], { type: "text/markdown;charset=utf-8" }));
  }

  async function pdfFile() {
    setPdfBusy(true);
    try {
      const { guidePdf } = await import("./pdf");
      download(`${slug}-brand-guide.pdf`, await guidePdf(guide));
    } catch (e) {
      console.error(e);
      setError("The PDF didn't build. The .md download still works.");
    } finally {
      setPdfBusy(false);
    }
  }

  useEffect(() => {
    if (introless && stage === "ask" && wantStart.current) requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [introless, stage]);

  if (introless && stage === "intro") return null;

  return (
    <div ref={top} data-bg-widget className="sticker rounded-[28px] bg-cyan text-ink p-6 sm:p-10 flex flex-col gap-5 scroll-mt-24">
      {stage === "intro" && variant === "home" && (
        <>
          <span className="label inline-block self-start rounded-full bg-[#FFFDF8] text-ink px-3 py-[7px]">Free brand guide</span>
          <h2 className="font-display font-extrabold text-[36px] leading-[1.02] tracking-[-0.02em] sm:text-[52px]">Marketing Starts Here</h2>
          <p className="sticker self-start rounded-2xl bg-teal text-ink px-4 py-2 font-display font-extrabold text-[26px] leading-tight sm:text-[32px]">No email required.</p>
          <p className="text-[19px] leading-relaxed max-w-[44ch]">Answer a few questions about your business (about 5 minutes) and download your brand guide on the spot, with prompts to put it to work.</p>
          <button type="button" onClick={() => setStage("ask")} disabled={!status?.ready} className="btn btn-secondary self-start disabled:opacity-80 disabled:cursor-default">{status && !status.ready ? "Coming soon" : "Start"}</button>
        </>
      )}

      {stage === "intro" && variant === "websites" && (
        <>
          <h2 className="font-display font-extrabold text-[44px] leading-[1.02] tracking-[-0.02em] sm:text-[60px] text-center">Start Here</h2>
          <ol className="grid gap-3 sm:grid-cols-2 mx-auto">
            {MOCKUP_PATH.map((step, i) => (
              <li key={step} className="flex items-center gap-3 text-[19px] font-bold leading-snug">
                <span className="grid place-items-center shrink-0 w-9 h-9 rounded-full border-2 border-ink bg-[#FFFDF8] font-mono text-[15px]">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <button type="button" onClick={() => setStage("ask")} disabled={!status?.ready} className="btn btn-cta self-center disabled:opacity-80 disabled:cursor-default">{status && !status.ready ? "Coming soon" : "Get Free Mock Up"}</button>
        </>
      )}

      {stage === "ask" && current && (
        <>
          <div className="flex items-center justify-between gap-3">
            <span className="label">Free brand guide<span className="sr-only">, step {step + 1} of {STEPS.length}</span></span>
            <div className="flex gap-1.5" aria-hidden="true">
              {STEPS.map((_, i) => <span key={i} className={`w-2.5 h-2.5 rounded-full border-2 border-ink ${i <= step ? "bg-ink" : "bg-transparent"}`} />)}
            </div>
          </div>
          <h2 className="font-display font-extrabold text-[30px] leading-[1.05] tracking-[-0.02em] sm:text-[40px]">{current.title}</h2>
          <div className="flex flex-col gap-5">
            {current.fields.map((f) => <FieldInput key={f.id} field={f} value={answers[f.id]} onChange={(v) => set(f.id, v)} />)}
          </div>
          <div className="flex items-center gap-3 pt-1">
            {step > 0 && <button type="button" onClick={() => { setStep(step - 1); scrollTop(); }} className="btn btn-secondary">Back</button>}
            <button type="button" onClick={next} disabled={!ready} className="btn btn-secondary bg-ink! text-[#FFFDF8]! disabled:opacity-50 disabled:cursor-not-allowed">
              {step < STEPS.length - 1 ? "Next" : "Write my brand guide"}
            </button>
          </div>
        </>
      )}

      {(stage === "writing" || stage === "done") && (
        <>
          <span className="label">{stage === "writing" ? "Writing your brand guide..." : "Brand guide"}</span>
          <div className="rounded-[20px] border-2 border-ink bg-[#FFFDF8] text-ink p-5 sm:p-6 max-h-[520px] overflow-y-auto" aria-live="polite" aria-busy={stage === "writing"}>
            {guide ? <Preview markdown={guide} /> : <p className="text-[17px]">Reading your answers...</p>}
          </div>
          {stage === "done" && (
            <>
              {status?.leads && <MockUp business={business} guide={guide} cta={variant === "websites"} />}
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={pdfFile} disabled={pdfBusy} className="btn btn-secondary bg-ink! text-[#FFFDF8]!">{pdfBusy ? "Building PDF..." : "Download PDF"}</button>
                <button type="button" onClick={mdFile} className="btn btn-secondary">Download .md</button>
                <button type="button" onClick={restart} className="text-sm font-bold underline underline-offset-4 self-center">Start over</button>
              </div>
              <p className="text-sm opacity-80">Both downloads come with {PROMPTS.length} prompts for using your guide in ChatGPT or Claude.</p>
              {error && <p className="text-sm font-bold">{error}</p>}
            </>
          )}
        </>
      )}

      {stage === "error" && (
        <>
          <span className="label">Hmm</span>
          <p className="text-[19px] font-bold">{error}</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => void write()} className="btn btn-secondary">Try again</button>
            <button type="button" onClick={() => { setStep(STEPS.length - 1); setStage("ask"); }} className="text-sm font-bold underline underline-offset-4">Back to my answers</button>
          </div>
        </>
      )}
    </div>
  );
}

const inputCls = "w-full rounded-xl border-2 border-ink bg-[#FFFDF8] text-ink px-3.5 text-[16px] placeholder:text-[#6b6d75] focus:outline-none focus:shadow-[0_0_0_4px_rgba(18,19,24,.25)]";

function FieldInput({ field: f, value, onChange }: { field: Field; value: string | string[] | undefined; onChange: (v: string | string[]) => void }) {
  const id = `bg-${f.id}`;
  const label = (
    <label htmlFor={f.kind === "chips" || f.kind === "choice" ? undefined : id} className="font-bold text-[17px] leading-snug">
      {f.label} {f.optional && <span className="font-normal opacity-70">(optional)</span>}
    </label>
  );
  if (f.kind === "text" || f.kind === "textarea") {
    if (f.kind === "textarea") {
      return <div className="flex flex-col gap-2">{label}<textarea id={id} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder ?? "Type or use voice dictation. Rambling is fine."} maxLength={f.max} rows={4} className={`${inputCls} py-3 leading-relaxed resize-y`} /></div>;
    }
    return <div className="flex flex-col gap-2">{label}<input id={id} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} maxLength={f.max} className={`${inputCls} h-12`} /></div>;
  }
  if (f.kind === "choice") {
    return (
      <fieldset className="flex flex-col gap-2">
        <legend className="font-bold text-[17px] mb-2">{f.label} {f.optional && <span className="font-normal opacity-70">(optional)</span>}</legend>
        <div className="flex flex-wrap gap-2">
          {f.options.map((o) => <Chip key={o} on={value === o} onClick={() => onChange(value === o ? "" : o)}>{o}</Chip>)}
        </div>
      </fieldset>
    );
  }
  if (f.kind === "chips") return <ChipsInput field={f} value={Array.isArray(value) ? value : []} onChange={onChange} />;
  return null;
}

function ChipsInput({ field: f, value, onChange }: { field: Extract<Field, { kind: "chips" }>; value: string[]; onChange: (v: string[]) => void }) {
  const [own, setOwn] = useState("");
  const max = f.pick ?? Infinity;
  const full = value.length >= max;
  const extras = value.filter((v) => !f.options.includes(v));
  function toggle(o: string) {
    if (value.includes(o)) onChange(value.filter((v) => v !== o));
    else if (!full) onChange([...value, o]);
  }
  function addOwn() {
    const v = own.trim().slice(0, 40);
    if (v && !value.includes(v) && !full) onChange([...value, v]);
    setOwn("");
  }
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-bold text-[17px] mb-2">{f.label} <span className="font-normal opacity-70">{f.pick ? `(${value.length} of ${f.pick})` : f.optional ? "(optional)" : ""}</span></legend>
      <div className="flex flex-wrap gap-2">
        {[...f.options, ...extras].map((o) => <Chip key={o} on={value.includes(o)} disabled={full && !value.includes(o)} onClick={() => toggle(o)}>{o}</Chip>)}
      </div>
      {f.other && (
        <div className="flex gap-2 pt-1">
          <label htmlFor={`bg-${f.id}-own`} className="sr-only">Add your own</label>
          <input id={`bg-${f.id}-own`} value={own} onChange={(e) => setOwn(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addOwn(); } }} placeholder="Add your own" maxLength={40} disabled={full} className={`${inputCls} h-11 flex-1 min-w-0 disabled:opacity-50`} />
          <button type="button" onClick={addOwn} disabled={full || !own.trim()} className="btn btn-secondary !h-11 !px-4 disabled:opacity-50">Add</button>
        </div>
      )}
    </fieldset>
  );
}

function Chip({ on, disabled, onClick, children }: { on: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={on}
      className={`rounded-full border-2 border-ink px-3.5 py-1.5 font-bold text-[14px] transition ${on ? "bg-ink text-[#FFFDF8]" : "bg-[#FFFDF8] text-ink hover:bg-white"} disabled:opacity-40 disabled:cursor-not-allowed`}>
      {children}
    </button>
  );
}

function Rich({ text }: { text: string }) {
  return <>{runs(text).map((r, i) => (r.bold ? <strong key={i}>{r.text}</strong> : <span key={i}>{r.text}</span>))}</>;
}

function Preview({ markdown }: { markdown: string }) {
  const blocks = parse(markdown);
  const out: React.ReactNode[] = [];
  let list: React.ReactNode[] = [];
  const flush = (k: number) => {
    if (list.length) out.push(<ul key={`ul${k}`} className="list-disc pl-5 flex flex-col gap-1 mb-3">{list}</ul>);
    list = [];
  };
  blocks.forEach((b, i) => {
    if (b.type === "li") { list.push(<li key={i} className={b.sub ? "ml-5" : undefined}><Rich text={b.text} /></li>); return; }
    flush(i);
    if (b.type === "h1") out.push(<h3 key={i} className="font-display font-extrabold text-[26px] leading-tight mb-3">{b.text}</h3>);
    else if (b.type === "h2") out.push(<h4 key={i} className="font-display font-bold text-[20px] mt-4 mb-1.5">{b.text}</h4>);
    else if (b.type === "h3") out.push(<h5 key={i} className="font-bold text-[17px] mt-3 mb-1">{b.text}</h5>);
    else out.push(<p key={i} className="mb-3 leading-relaxed"><Rich text={b.text} /></p>);
  });
  flush(blocks.length);
  return <div className="text-[16px]">{out}</div>;
}

// Optional photos for the mock up (Brittany, 2026-11-17): shrunk in the browser, sent one at a time to
// /api/brand-guide/photo (Notion file storage), then attached to the lead by /api/brand-guide/submit.
const MAX_PHOTOS = 10;
const SENDABLE = ["image/jpeg", "image/png", "image/webp"];

async function shrink(file: File): Promise<Blob | null> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    if (blob) return blob;
  } catch {}
  // Couldn't decode it here (e.g. HEIC outside Safari): send the original only if it's a type and size we take.
  return SENDABLE.includes(file.type) && file.size <= 4 * 1024 * 1024 ? file : null;
}

type Photo = { file: File; url: string };

// What a mock-up lead gets back (Brittany, 2026-11-17).
const MOCKUP_GETS = ["Website mock up", "Review Strategy", "Social Media Plan", "SEO/AEO Plan"];

function MockUp({ business, guide, cta = false }: { business: string; guide: string; cta?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [progress, setProgress] = useState("");
  const [msg, setMsg] = useState("");
  const [note, setNote] = useState("");
  const [missed, setMissed] = useState(0);
  const picker = useRef<HTMLInputElement>(null);
  const photosRef = useRef(photos);
  useEffect(() => { photosRef.current = photos; }, [photos]);
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  function add(list: FileList | null) {
    const chosen = Array.from(list ?? []).filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    const room = MAX_PHOTOS - photos.length;
    setNote(chosen.length > room ? `Up to ${MAX_PHOTOS} photos. We kept the first ${Math.max(room, 0)}.` : "");
    setPhotos([...photos, ...chosen.slice(0, Math.max(room, 0)).map((file) => ({ file, url: URL.createObjectURL(file) }))]);
    if (picker.current) picker.current.value = "";
  }

  function remove(i: number) {
    URL.revokeObjectURL(photos[i].url);
    setPhotos(photos.filter((_, j) => j !== i));
    setNote("");
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setMsg("");
    try {
      const photoIds: string[] = [];
      let failed = 0;
      for (let i = 0; i < photos.length; i++) {
        setProgress(`Sending photo ${i + 1} of ${photos.length}...`);
        const blob = await shrink(photos[i].file);
        if (!blob) { failed++; continue; }
        const form = new FormData();
        form.append("photo", blob, blob.type === "image/jpeg" ? "photo.jpg" : photos[i].file.name);
        const res = await fetch("/api/brand-guide/photo", { method: "POST", body: form }).catch(() => null);
        const body = res ? await res.json().catch(() => ({})) : {};
        if (res?.ok && body.id) photoIds.push(body.id);
        else failed++;
      }
      setProgress("Submitting...");
      const res = await fetch("/api/brand-guide/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, business, guide, photoIds }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(res.status === 400 && body.error ? body.error : "That didn't go through. Try again in a minute.");
      setMissed(failed);
      setState("sent");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "That didn't go through.");
      setState("error");
    } finally {
      setProgress("");
    }
  }

  if (state === "sent") {
    return (
      <div className="sticker rounded-[20px] bg-teal text-ink p-5 sm:p-6 flex flex-col gap-2">
        <p className="font-display font-extrabold text-[24px] leading-snug">Got it. Mock up coming.</p>
        <p className="leading-relaxed">We&apos;ll email your website mock up, review strategy, social media plan and SEO/AEO plan to {email} within 3 days. Meanwhile, download your brand guide below.</p>
        {missed > 0 && <p className="leading-relaxed font-bold">{missed === 1 ? "1 photo" : `${missed} photos`} didn&apos;t go through. Reply to our email with {missed === 1 ? "it" : "them"} and we&apos;ll use {missed === 1 ? "it" : "them"} too.</p>}
      </div>
    );
  }

  const sending = state === "sending";
  return (
    <form onSubmit={send} className="sticker rounded-[20px] bg-[#FFFDF8] text-ink p-5 sm:p-6 flex flex-col gap-3">
      <span className="label">Free</span>
      <p className="font-display font-extrabold text-[26px] leading-[1.05] sm:text-[32px]">See it built</p>
      <p className="leading-relaxed text-[17px] font-bold">Submit, wait ~3 days &amp; get:</p>
      <ul className="flex flex-col gap-2">
        {MOCKUP_GETS.map((g) => (
          <li key={g} className="flex gap-2.5 text-[17px] leading-snug">
            <svg viewBox="0 0 20 20" aria-hidden="true" className="w-5 h-5 shrink-0 mt-[2px]"><circle cx="10" cy="10" r="9" fill="#40e0d0" stroke="#121318" strokeWidth="1.5" /><path d="M6 10.5l2.6 2.6L14 7.6" fill="none" stroke="#121318" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {g}
          </li>
        ))}
      </ul>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bg-up-name" className="font-bold text-sm">Name</label>
          <input id="bg-up-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} autoComplete="name" className={`${inputCls} h-12`} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bg-up-email" className="font-bold text-sm">Email (where we send the mock up)</label>
          <input id="bg-up-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={200} autoComplete="email" className={`${inputCls} h-12`} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold text-sm">Photos (optional)</p>
        <p className="text-[15px] leading-relaxed">Upload 5-10 actual photos of your work.{" "}<strong>Real Photos = Better Mock Up</strong></p>
        {photos.length > 0 && (
          <ul className="grid grid-cols-5 gap-2 max-w-[420px]" aria-label="Photos to send">
            {photos.map((p, i) => (
              <li key={p.url} className="relative aspect-square rounded-lg border-2 border-ink overflow-hidden bg-[#f8f0e3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => remove(i)} disabled={sending} aria-label={`Remove photo ${i + 1}`} className="absolute top-0.5 right-0.5 w-6 h-6 rounded-full bg-ink text-[#FFFDF8] text-[14px] leading-none font-bold">×</button>
              </li>
            ))}
          </ul>
        )}
        <input ref={picker} id="bg-up-photos" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => add(e.target.files)} tabIndex={-1} />
        {photos.length < MAX_PHOTOS && (
          <button type="button" onClick={() => picker.current?.click()} disabled={sending} className="btn btn-secondary self-start">{photos.length ? `Add more (${photos.length} of ${MAX_PHOTOS})` : "Add photos"}</button>
        )}
        {note && <p className="text-sm font-bold">{note}</p>}
        {photos.length > 0 && <p className="text-sm opacity-80">By sending photos, you&apos;re OK with us using them in your mock up.</p>}
      </div>
      <button type="submit" disabled={sending} className={`btn self-start ${cta ? "btn-cta" : "btn-secondary bg-ink! text-[#FFFDF8]!"}`}>{sending ? progress || "Submitting..." : "Submit for Mock Up"}</button>
      {msg && <p className="text-sm font-bold">{msg}</p>}
    </form>
  );
}
