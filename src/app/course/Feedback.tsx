"use client";

import { useRef, useState } from "react";
import { FEEDBACK_QUESTIONS, OTHER } from "@/content/feedback";

type Answers = Record<string, { choice: string; other: string }>;

// "Love it or hate it?" button on every lesson page; answers land in the Notion "Course feedback" database.
export default function Feedback({ slug }: { slug: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function open() {
    setStatus("idle");
    setError("");
    dialog.current?.showModal();
  }

  function pick(id: string, choice: string) {
    setAnswers((current) => ({ ...current, [id]: { choice, other: current[id]?.other ?? "" } }));
  }

  function setOther(id: string, other: string) {
    setAnswers((current) => ({ ...current, [id]: { choice: OTHER, other } }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (Object.keys(answers).length === 0) {
      setError("Pick at least one answer.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/course/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, answers }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Couldn't send that right now.");
      setStatus("sent");
      setAnswers({});
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't send that right now.");
    }
  }

  return (
    <>
      <section className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-magenta bg-magenta-soft p-6 sm:p-8">
        <div>
          <p className="text-2xl font-black tracking-tight sm:text-3xl">Love it or hate it?</p>
          <p className="mt-1 text-lg text-muted">Three quick taps. It helps me make the next lesson better.</p>
        </div>
        <button
          type="button"
          onClick={open}
          className="px-7 py-3.5 rounded-full bg-magenta text-ink text-lg font-extrabold hover:brightness-95 transition"
        >
          Tell me!
        </button>
      </section>

      <dialog
        ref={dialog}
        aria-labelledby="feedback-title"
        className="m-auto w-[min(36rem,calc(100%-2rem))] max-h-[90dvh] overflow-y-auto rounded-3xl border border-line bg-background p-0 text-foreground backdrop:bg-black/50"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id="feedback-title" className="text-2xl font-black tracking-tight">
              {status === "sent" ? "Thank you!" : "Love it or hate it?"}
            </h2>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close"
              className="w-10 h-10 shrink-0 rounded-full border border-line text-xl font-bold hover:bg-card transition"
            >
              &times;
            </button>
          </div>

          {status === "sent" ? (
            <>
              <p className="mt-3 text-lg text-muted">Got it. I read every one of these.</p>
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                className="mt-6 px-7 py-3 rounded-full bg-cyan text-ink text-lg font-extrabold hover:brightness-95 transition"
              >
                Back to the lesson
              </button>
            </>
          ) : (
            <form onSubmit={submit} className="mt-2">
              {FEEDBACK_QUESTIONS.map((question) => {
                const answer = answers[question.id];
                return (
                  <fieldset key={question.id} className="mt-6">
                    <legend className="text-lg font-extrabold">{question.label}</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[...question.options, OTHER].map((option) => {
                        const checked = answer?.choice === option;
                        return (
                          <label
                            key={option}
                            className={`cursor-pointer rounded-full border-2 px-4 py-2 font-bold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cyan ${
                              checked ? "border-magenta bg-magenta-soft text-magenta-text" : "border-line hover:border-cyan"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`feedback-${question.id}`}
                              value={option}
                              checked={checked}
                              onChange={() => pick(question.id, option)}
                              className="sr-only"
                            />
                            {option}
                          </label>
                        );
                      })}
                    </div>
                    {answer?.choice === OTHER && (
                      <input
                        id={`feedback-${question.id}-other`}
                        type="text"
                        value={answer.other}
                        onChange={(event) => setOther(question.id, event.target.value)}
                        placeholder="Tell me more"
                        aria-label={`${question.label} Other`}
                        maxLength={1000}
                        autoFocus
                        className="mt-3 w-full rounded-2xl border-2 border-line bg-background px-4 py-3 text-lg focus:border-cyan focus:outline-none"
                      />
                    )}
                  </fieldset>
                );
              })}

              {error && <p className="mt-5 font-bold text-magenta-text" role="alert">{error}</p>}

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-7 w-full px-7 py-3.5 rounded-full bg-cyan text-ink text-lg font-extrabold hover:brightness-95 transition disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send"}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
