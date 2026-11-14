"use client";

import { useEffect, useRef, useState } from "react";

// Beast Mode Timer (Brittany, 2026-11-14): an interval timer. 25 minutes on one thing, butt in seat,
// then a 5-minute break, repeated. 2 hours = 4 sessions. The last session ends the run (no trailing break).
// Timing runs off the clock (end time), so a background tab doesn't drift. Add ?beasttest to the URL to run in seconds.

const ON = 25;
const OFF = 5;
const LENGTHS = [
  { label: "30 min", sessions: 1 },
  { label: "1 hr", sessions: 2 },
  { label: "2 hr", sessions: 4 },
  { label: "3 hr", sessions: 6 },
  { label: "4 hr", sessions: 8 },
];
const TASKS = ["Emails", "Sales board", "Website", "Research", "Freestyle"];
const RULES = ["One thing only", "Phone away", "Email closed", "Butt in seat"];
const BREAKS = ["Stand up and stretch", "Look at something far away", "Bathroom and water", "20 jumping jacks", "Walk around the room", "Roll your shoulders and neck"];

type Phase = { kind: "on" | "off"; n: number };
type Run = { phases: Phase[]; idx: number; endAt: number; pausedLeft: number | null; task: string; done: boolean };

function plan(sessions: number): Phase[] {
  const out: Phase[] = [];
  for (let n = 1; n <= sessions; n++) {
    out.push({ kind: "on", n });
    if (n < sessions) out.push({ kind: "off", n });
  }
  return out;
}

function mmss(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function BeastModeTimer() {
  const [sessions, setSessions] = useState(4);
  const [task, setTask] = useState("");
  const [run, setRun] = useState<Run | null>(null);
  const [now, setNow] = useState(0);
  const [sound, setSound] = useState(true);
  const unit = useRef(60_000);
  const audio = useRef<AudioContext | null>(null);
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const runRef = useRef<Run | null>(null);
  runRef.current = run;

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("beasttest")) unit.current = 1000;
  }, []);

  const len = (p: Phase) => (p.kind === "on" ? ON : OFF) * unit.current;

  function beep(times: number) {
    const ctx = audio.current;
    if (!ctx || !soundRef.current) return;
    for (let i = 0; i < times; i++) {
      const t = ctx.currentTime + i * 0.32;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = i % 2 ? 660 : 880;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.26);
    }
  }

  // Tick: advance through phases when the clock passes the end time (catching up if the tab slept).
  useEffect(() => {
    if (!run || run.done || run.pausedLeft !== null) return;
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      const r = runRef.current;
      if (!r || r.done || r.pausedLeft !== null || t < r.endAt) return;
      let { idx, endAt } = r;
      while (t >= endAt) {
        idx++;
        if (idx >= r.phases.length) {
          beep(5);
          setRun({ ...r, idx: r.phases.length - 1, done: true });
          return;
        }
        endAt += len(r.phases[idx]);
      }
      beep(r.phases[idx].kind === "on" ? 3 : 2);
      setRun({ ...r, idx, endAt });
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run?.done, run?.pausedLeft, run !== null]);

  const phase = run ? run.phases[run.idx] : null;
  const left = run ? (run.pausedLeft ?? run.endAt - now) : 0;

  // Tab title shows the countdown while running.
  useEffect(() => {
    const base = document.title.replace(/^\d\d:\d\d [^|]*\| /, "");
    if (run && !run.done && phase) document.title = `${mmss(left)} ${phase.kind === "on" ? "Beast mode" : "Break"} | ${base}`;
    else document.title = base;
  }, [run, phase, left]);

  function start() {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audio.current ??= new AC();
      void audio.current.resume();
    } catch {}
    const phases = plan(sessions);
    const t = Date.now();
    setNow(t);
    setRun({ phases, idx: 0, endAt: t + len(phases[0]), pausedLeft: null, task: task.trim() || "Freestyle", done: false });
    beep(1);
  }

  function pause() {
    setRun((r) => (r && r.pausedLeft === null ? { ...r, pausedLeft: r.endAt - Date.now() } : r));
  }
  function resume() {
    const t = Date.now();
    setNow(t);
    setRun((r) => (r && r.pausedLeft !== null ? { ...r, endAt: t + r.pausedLeft, pausedLeft: null } : r));
  }
  function skip() {
    const t = Date.now();
    setNow(t);
    setRun((r) => {
      if (!r) return r;
      const idx = r.idx + 1;
      if (idx >= r.phases.length) return { ...r, done: true };
      return { ...r, idx, endAt: t + len(r.phases[idx]), pausedLeft: r.pausedLeft === null ? null : len(r.phases[idx]) };
    });
  }

  const total = sessions * ON;
  const isOn = phase?.kind === "on";
  const frac = phase && run ? 1 - Math.max(0, left) / len(phase) : 0;
  const breakIdea = phase && !isOn ? BREAKS[(phase.n - 1) % BREAKS.length] : "";

  return (
    <div className="flex flex-col gap-6 w-full max-w-[440px] mx-auto">
      <div className="flex flex-col gap-4 min-w-0">
        <span className="label self-start rounded-full bg-cyan px-3 py-[7px] text-ink">Beast Mode Timer</span>
        <h2 className="font-display font-extrabold text-[38px] leading-none tracking-[-0.02em] sm:text-[48px]">
          25 on. <span className="torn bg-cyan">5 off.</span>
        </h2>
        <p className="text-[17px] leading-relaxed">
          Pick one thing. Phone away, email closed, butt in seat for 25 minutes. Then a 5-minute break, and go again.
        </p>
      </div>

      <div className="sticker rounded-[28px] bg-surface p-5 sm:p-6 flex flex-col gap-5 min-w-0">
        {!run ? (
          <>
            <fieldset className="flex flex-col gap-2.5">
              <legend className="font-display font-bold text-[20px] mb-2.5">How long?</legend>
              <div className="flex flex-wrap gap-2">
                {LENGTHS.map((l) => (
                  <button key={l.label} type="button" onClick={() => setSessions(l.sessions)} aria-pressed={sessions === l.sessions}
                    className={`rounded-full border-2 border-border px-4 py-2 font-bold text-[15px] transition ${sessions === l.sessions ? "bg-cyan text-ink" : "bg-surface hover:bg-surface-2"}`}>
                    {l.label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted">
                {sessions} {sessions === 1 ? "session" : "sessions"} of {ON} on{sessions > 1 ? `, ${OFF} off between` : ""}. {total} minutes of focus.
              </p>
            </fieldset>

            <fieldset className="flex flex-col gap-2.5">
              <legend className="font-display font-bold text-[20px] mb-2.5">On what?</legend>
              <div className="flex flex-wrap gap-2">
                {TASKS.map((t) => (
                  <button key={t} type="button" onClick={() => setTask(task === t ? "" : t)} aria-pressed={task === t}
                    className={`rounded-full border-2 border-border px-4 py-2 font-bold text-[15px] transition ${task === t ? "bg-teal text-ink" : "bg-surface hover:bg-surface-2"}`}>
                    {t}
                  </button>
                ))}
              </div>
              <label htmlFor="beast-task" className="sr-only">Or type your one thing</label>
              <input id="beast-task" value={TASKS.includes(task) ? "" : task} onChange={(e) => setTask(e.target.value)} placeholder="Or type your one thing" maxLength={60}
                className="h-12 w-full rounded-xl border-2 border-border bg-surface px-3.5 text-[16px] text-foreground placeholder:text-muted focus:outline-none focus:shadow-[0_0_0_4px_var(--focus)]" />
            </fieldset>

            <button type="button" onClick={start} className="btn btn-primary w-full">Start</button>
          </>
        ) : run.done ? (
          <div className="flex flex-col items-center text-center gap-4 py-6" aria-live="polite">
            <span className="label rounded-full bg-teal px-3 py-[7px] text-ink">Done</span>
            <p className="font-display font-extrabold text-[40px] leading-none sm:text-[52px]">
              {run.phases.filter((p) => p.kind === "on").length * ON} minutes.
            </p>
            <p className="text-lg">{run.phases.filter((p) => p.kind === "on").length} {run.phases.length > 1 ? "sessions" : "session"} on {run.task === "Freestyle" ? "whatever was on your plate" : run.task}. Take a real break.</p>
            <button type="button" onClick={() => setRun(null)} className="btn btn-secondary">Again</button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
              <span className={`label rounded-full px-3 py-[7px] text-ink ${isOn ? "bg-cyan" : "bg-teal"}`} aria-live="polite">
                {isOn ? `Beast mode · ${phase!.n} of ${sessions}` : "Break"}
              </span>
              <button type="button" onClick={() => setSound(!sound)} aria-pressed={sound} className="text-sm font-bold text-muted hover:text-foreground transition">
                Sound {sound ? "on" : "off"}
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 py-2">
              <span className="font-mono font-medium text-[72px] leading-none tracking-[-0.03em] tabular-nums sm:text-[88px]" role="timer" aria-label={`${mmss(left)} left`}>
                {mmss(left)}
              </span>
              <p className="font-display font-bold text-[20px] text-center">
                {isOn ? (run.task === "Freestyle" ? "Knock as much off your plate as you can." : run.task) : breakIdea}
              </p>
              {run.pausedLeft !== null && <p className="text-sm font-bold text-muted">Paused</p>}
            </div>

            <div className="h-4 rounded-full border-2 border-border bg-surface overflow-hidden" aria-hidden="true">
              <span className={`block h-full transition-[width] duration-300 ${isOn ? "bg-cyan" : "bg-teal"}`} style={{ width: `${Math.min(100, frac * 100)}%` }} />
            </div>

            <div className="flex justify-center gap-2" aria-label={`Session ${phase!.n} of ${sessions}`}>
              {Array.from({ length: sessions }, (_, i) => {
                const n = i + 1;
                const doneN = isOn ? n < phase!.n : n <= phase!.n;
                const current = isOn && n === phase!.n;
                return <span key={n} className={`w-3.5 h-3.5 rounded-full border-2 border-border ${doneN ? "bg-foreground" : current ? "bg-cyan" : "bg-surface"}`} />;
              })}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {run.pausedLeft === null ? (
                <button type="button" onClick={pause} className="btn btn-primary !px-2">Pause</button>
              ) : (
                <button type="button" onClick={resume} className="btn btn-primary !px-2">Resume</button>
              )}
              <button type="button" onClick={skip} className="btn btn-secondary !px-2">Skip</button>
              <button type="button" onClick={() => setRun(null)} className="btn btn-secondary !px-2">End</button>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 grid-cols-2 px-1">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[12px] tracking-[.1em] uppercase text-muted">On</span>
          <ul className="flex flex-col gap-1.5 text-[15px]">{RULES.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[12px] tracking-[.1em] uppercase text-muted">Off</span>
          <ul className="flex flex-col gap-1.5 text-[15px]">{BREAKS.slice(0, 4).map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
