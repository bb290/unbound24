"use client";

import { useSyncExternalStore } from "react";

// Small per-visitor settings kept in this browser's localStorage (course progress, sidebar state).
// Storage can be blocked or empty, so every read and write falls back quietly.

const CHANGE_EVENT = "oy24-storage";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function read(key: string, fallback: string) {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function useStored(key: string, fallback: string): [string, (value: string) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key, fallback),
    () => fallback,
  );
  function set(next: string) {
    try {
      window.localStorage.setItem(key, next);
    } catch {
      // Storage unavailable: the change lasts until the page reloads.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
  return [value, set];
}

function parseList(raw: string): string[] {
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.map(String) : [];
  } catch {
    return [];
  }
}

// A stored list of ids, e.g. finished lesson numbers or closed modules.
export function useStoredList(key: string) {
  const [raw, setRaw] = useStored(key, "[]");
  const list = parseList(raw);
  function toggle(id: string) {
    setRaw(JSON.stringify(list.includes(id) ? list.filter((item) => item !== id) : [...list, id]));
  }
  return { list, has: (id: string) => list.includes(id), toggle };
}

export function useProgress() {
  // Finished lessons, by slug (slugs never change when lessons are renumbered).
  return useStoredList("oy24-progress-v2");
}
