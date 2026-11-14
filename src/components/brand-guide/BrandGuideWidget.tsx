"use client";

import { useEffect, useRef, useState } from "react";
import { BOOKING_URL, PROMPTS, PROMPTS_INTRO, STEPS, type Answers, type Field } from "@/content/brand-guide";
import { fileSlug, parse, runs } from "./markdown";

// Free Brand Guide (Brittany, 2026-11-14): the home page's primary CTA. 7 questions, no email, the guide is written
// live (OpenRouter via /api/brand-guide), then downloads as PDF and .md with prompts. Optional upgrade sends it to us.
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

export function BrandGuideWidget() {
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [guide, setGuide] = useState("");
  const [error, setError] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);
  const [status, setStatus] = useState<{ ready: boolean; leads: boolean } | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);

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
    const md = `${guide.trim()}\n\n## Prompts to use with your brand guide\n\n${PROMPTS_INTRO}\n\n${PROMPTS.map((p, i) => `### ${i + 1}. ${p.title}\n\n${p.text}`).join("\n\n")}\n\n---\nMade with the free brand guide at unbound24.com\n`;
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

  return (
    <div ref={top} className="sticker rounded-[28px] bg-cyan text-ink p-6 sm:p-10 flex flex-col gap-5 scroll-mt-24">
      {stage === "intro" && (
        <>
          <span className="label inline-block self-start rounded-full bg-[#FFFDF8] text-ink px-3 py-[7px]">Free brand guide</span>
          <h2 className="font-display font-extrabold text-[36px] leading-[1.02] tracking-[-0.02em] sm:text-[52px]">Your brand guide in 7 questions.</h2>
          <p className="text-[19px] leading-relaxed max-w-[44ch]">No email needed. Answer 7 questions and download your brand guide on the spot, with prompts to put it to work.</p>
          <button type="button" onClick={() => setStage("ask")} disabled={!status?.ready} className="btn btn-secondary self-start disabled:opacity-80 disabled:cursor-default">{status && !status.ready ? "Coming soon" : "Start"}</button>
          <p className="text-sm max-w-[52ch] opacity-80">Your answers go to an AI model to write the guide. We only see them if you choose to send us your guide at the end.</p>
        </>
      )}

      {stage === "ask" && current && (
        <>
          <div className="flex items-center justify-between gap-3">
            <span className="label">Question {step + 1} of {STEPS.length}</span>
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
          <span className="label">{stage === "writing" ? "Writing your brand guide..." : "Your brand guide"}</span>
          <div className="rounded-[20px] border-2 border-ink bg-[#FFFDF8] text-ink p-5 sm:p-6 max-h-[520px] overflow-y-auto" aria-live="polite" aria-busy={stage === "writing"}>
            {guide ? <Preview markdown={guide} /> : <p className="text-[17px]">Reading your answers...</p>}
          </div>
          {stage === "done" && (
            <>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={pdfFile} disabled={pdfBusy} className="btn btn-secondary bg-ink! text-[#FFFDF8]!">{pdfBusy ? "Building PDF..." : "Download PDF"}</button>
                <button type="button" onClick={mdFile} className="btn btn-secondary">Download .md</button>
                <button type="button" onClick={restart} className="text-sm font-bold underline underline-offset-4 self-center">Start over</button>
              </div>
              <p className="text-sm opacity-80">Both downloads come with {PROMPTS.length} prompts for using your guide in ChatGPT or Claude.</p>
              {error && <p className="text-sm font-bold">{error}</p>}
              {status?.leads && <Upgrade business={business} guide={guide} />}
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
  const full = value.length >= f.pick;
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
      <legend className="font-bold text-[17px] mb-2">{f.label} <span className="font-normal opacity-70">({value.length} of {f.pick})</span></legend>
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
    if (b.type === "li") { list.push(<li key={i}><Rich text={b.text} /></li>); return; }
    flush(i);
    if (b.type === "h1") out.push(<h3 key={i} className="font-display font-extrabold text-[26px] leading-tight mb-3">{b.text}</h3>);
    else if (b.type === "h2") out.push(<h4 key={i} className="font-display font-bold text-[20px] mt-4 mb-1.5">{b.text}</h4>);
    else if (b.type === "h3") out.push(<h5 key={i} className="font-bold text-[17px] mt-3 mb-1">{b.text}</h5>);
    else out.push(<p key={i} className="mb-3 leading-relaxed"><Rich text={b.text} /></p>);
  });
  flush(blocks.length);
  return <div className="text-[16px]">{out}</div>;
}

function Upgrade({ business, guide }: { business: string; guide: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setMsg("");
    try {
      const res = await fetch("/api/brand-guide/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, business, guide }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(res.status === 400 && body.error ? body.error : "That didn't go through. Try again in a minute.");
      setState("sent");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "That didn't go through.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-[20px] border-2 border-ink bg-teal p-5 sm:p-6 flex flex-col gap-3">
        <p className="font-display font-bold text-[22px] leading-snug">Got it. We&apos;re on your marketing plan.</p>
        {BOOKING_URL ? (
          <>
            <p>Pick a time for your 20-minute review, and we&apos;ll go over your plan and website redesign together.</p>
            <a href={BOOKING_URL} target="_blank" rel="noopener" className="btn btn-secondary self-start">Pick a time</a>
          </>
        ) : (
          <p>We&apos;ll email you to set up your 20-minute review, where we go over your plan and website redesign together.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={send} className="rounded-[20px] border-2 border-ink bg-[#FFFDF8] text-ink p-5 sm:p-6 flex flex-col gap-3">
      <p className="font-display font-bold text-[22px] leading-snug">Want us to take it further?</p>
      <p className="leading-relaxed">Send us your brand guide and we&apos;ll put together a free marketing plan and website redesign for your business, then go over it with you on a 20-minute call.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bg-up-name" className="font-bold text-sm">Your name</label>
          <input id="bg-up-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} autoComplete="name" className={`${inputCls} h-12`} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bg-up-email" className="font-bold text-sm">Email</label>
          <input id="bg-up-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={200} autoComplete="email" className={`${inputCls} h-12`} />
        </div>
      </div>
      <button type="submit" disabled={state === "sending"} className="btn btn-secondary bg-ink! text-[#FFFDF8]! self-start">{state === "sending" ? "Sending..." : "Send my brand guide"}</button>
      {msg && <p className="text-sm font-bold">{msg}</p>}
    </form>
  );
}
