"use client";

import { useState } from "react";

export default function PromptBox({
  prompt,
  filename,
  title = "Your Claude prompt",
}: {
  prompt: string;
  filename: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);
  // Long prompts start folded, since each lesson shows its action twice.
  const long = prompt.length > 600;
  const [expanded, setExpanded] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const url = URL.createObjectURL(new Blob([prompt], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-6 rounded-2xl bg-background border border-line overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-line">
        <p className="text-sm font-extrabold">{title}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copy}
            className="px-4 py-2 rounded-full bg-cyan text-sm font-extrabold hover:brightness-95 transition"
          >
            {copied ? "Copied!" : "Copy prompt"}
          </button>
          <button
            type="button"
            onClick={download}
            className="px-4 py-2 rounded-full border border-line text-sm font-extrabold hover:bg-card transition"
          >
            Download
          </button>
        </div>
      </div>
      <div className="relative">
        <pre
          className={`px-5 py-4 whitespace-pre-wrap font-sans text-base leading-relaxed ${
            long && !expanded ? "max-h-56 overflow-hidden" : ""
          }`}
        >
          {prompt}
        </pre>
        {long && !expanded && (
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />
        )}
      </div>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="w-full px-5 py-3 border-t border-line text-sm font-extrabold text-cyan-text hover:bg-card transition"
        >
          {expanded ? "Show less" : "Show the full prompt"}
        </button>
      )}
    </div>
  );
}
