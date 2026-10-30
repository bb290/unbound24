"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useStored } from "./useStored";

// Optional sign-in: progress always lives in this browser; once signed in it is also
// saved to the visitor's row in the CRM so it follows them to other devices.

type AccountState = {
  enabled: boolean;
  email: string | null;
  notice: "signed-in" | "expired" | null;
  signOut: () => Promise<void>;
};

const AccountContext = createContext<AccountState>({
  enabled: false,
  email: null,
  notice: null,
  signOut: async () => {},
});

export function useAccount() {
  return useContext(AccountContext);
}

function parse(raw: string): string[] {
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.map(String) : [];
  } catch {
    return [];
  }
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [rawProgress, setRawProgress] = useStored("oy24-progress-v2", "[]");
  const [enabled, setEnabled] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [notice, setNotice] = useState<AccountState["notice"]>(null);
  const synced = useRef<string | null>(null);

  // Load the account once, merge saved progress into this browser, and read the sign-in result.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("signin");
    if (result) {
      setNotice(result === "done" ? "signed-in" : "expired");
      params.delete("signin");
      const query = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : ""));
    }

    fetch("/api/course/progress")
      .then((response) => response.json())
      .then((data) => {
        setEnabled(Boolean(data.enabled));
        if (!data.email) return;
        const local = parse(window.localStorage.getItem("oy24-progress-v2") ?? "[]");
        const merged = [...new Set([...local, ...(data.progress ?? [])])].sort();
        synced.current = JSON.stringify(data.progress ?? []);
        setRawProgress(JSON.stringify(merged));
        setEmail(data.email);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While signed in, save every change to the CRM.
  useEffect(() => {
    if (!email) return;
    const progress = [...parse(rawProgress)].sort();
    const key = JSON.stringify(progress);
    if (key === synced.current) return;
    const timer = setTimeout(() => {
      fetch("/api/course/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress }),
      })
        .then((response) => {
          if (response.ok) synced.current = key;
        })
        .catch(() => {});
    }, 600);
    return () => clearTimeout(timer);
  }, [email, rawProgress]);

  async function signOut() {
    await fetch("/api/course/signout", { method: "POST" }).catch(() => {});
    setEmail(null);
    setNotice(null);
  }

  return (
    <AccountContext.Provider value={{ enabled, email, notice, signOut }}>{children}</AccountContext.Provider>
  );
}

export function SaveProgress({ compact = false }: { compact?: boolean }) {
  const { enabled, email, notice, signOut } = useAccount();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  if (!enabled) {
    return compact ? <p className="text-sm text-muted">Your progress is saved in this browser.</p> : null;
  }

  if (email) {
    return (
      <p className="text-sm text-muted">
        {notice === "signed-in" && <span className="font-bold text-foreground">You&rsquo;re signed in. </span>}
        Progress saved to <span className="font-bold text-foreground">{email}</span>.{" "}
        <button type="button" onClick={signOut} className="font-bold text-cyan-text hover:underline">
          Sign out
        </button>
      </p>
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/course/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          lessonEmails: form.get("lessonEmails") === "on",
          website: form.get("website"),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm">
        <span className="font-extrabold">Check your email.</span> Tap the link I sent to save your progress.
      </p>
    );
  }

  if (!open) {
    return (
      <p className="text-sm text-muted">
        {notice === "expired" && <span className="font-bold text-magenta-text">That link expired. </span>}
        Saved in this browser.{" "}
        <button type="button" onClick={() => setOpen(true)} className="font-bold text-cyan-text hover:underline">
          Save your progress to any device
        </button>
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md p-5 rounded-3xl bg-card border border-line">
      <p className="font-extrabold">Save your progress</p>
      <p className="mt-1 text-sm text-muted">
        Enter your email and I&rsquo;ll send you a link. No password needed.
      </p>
      <label className="sr-only" htmlFor="save-email">Email</label>
      <input
        id="save-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@yourbusiness.com"
        className="mt-4 w-full px-4 py-3 rounded-2xl border border-line bg-background text-base focus:outline-none focus:border-cyan"
      />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className="mt-3 flex items-start gap-2 text-sm">
        <input type="checkbox" name="lessonEmails" className="mt-1 accent-[#0B9CB0]" />
        Email me when new lessons go up.
      </label>
      {error && <p className="mt-3 text-sm font-bold text-magenta-text">{error}</p>}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="px-6 py-2.5 rounded-full bg-cyan font-extrabold hover:brightness-95 transition disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send my link"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm font-bold text-muted hover:text-foreground">
          Cancel
        </button>
      </div>
    </form>
  );
}
