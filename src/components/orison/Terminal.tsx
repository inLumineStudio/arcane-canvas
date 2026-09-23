"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { easterEggs, hashCode } from "@/content/easter-eggs";
import type { Dictionary } from "@/content";
import { OsWindow } from "./OsWindow";

// Console-style input where visitors type the codes hidden around the page (brief §4).
// Unlocked files are remembered in localStorage as a convenience; the page works without it.

const STORAGE_KEY = "orison.unlocked";

type Line = { text: string; tone?: "input" | "ok" | "error" | "dim" };

function loadUnlocked(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveUnlocked(hashes: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hashes));
  } catch {
    // Private mode or storage disabled: unlocks just won't persist.
  }
}

const tones = {
  input: "text-fg",
  ok: "text-accent",
  error: "text-[#ff6b7f]",
  dim: "text-muted",
};

export function Terminal({ t }: { t: Dictionary["terminal"] }) {
  const [lines, setLines] = useState<Line[]>(() => t.intro.map((text) => ({ text, tone: "dim" as const })));
  const [value, setValue] = useState("");
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const screen = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight });
  }, [lines]);

  const print = (...next: Line[]) => setLines((l) => [...l, ...next]);

  async function run(raw: string) {
    const cmd = raw.trim();
    print({ text: `${t.prompt}${cmd}`, tone: "input" });
    if (!cmd) return;

    // Merge what this session unlocked with what earlier visits stored
    const known = [...new Set([...unlocked, ...loadUnlocked()])];

    switch (cmd.toUpperCase()) {
      case "HELP":
        return print(...t.help.map((text) => ({ text })));
      case "CLEAR":
        return setLines([]);
      case "WHOAMI":
        return print({ text: t.whoami });
      case "CODES": {
        const files = easterEggs.filter((e) => known.includes(e.hash));
        if (!files.length) return print({ text: t.empty, tone: "dim" });
        return print(...files.map((f) => ({ text: `  ${f.file}`, tone: "ok" as const })));
      }
    }

    const hash = await hashCode(cmd);
    const egg = easterEggs.find((e) => e.hash === hash);
    if (!egg) return print({ text: t.unknown, tone: "error" }, { text: t.hint, tone: "dim" });
    if (known.includes(hash)) return print({ text: t.alreadyUnlocked, tone: "dim" });

    const next = [...known, hash];
    setUnlocked(next);
    saveUnlocked(next);
    print(
      { text: `${t.granted} · ${egg.file} (${next.length}/${easterEggs.length})`, tone: "ok" },
      ...egg.lines.map((text) => ({ text: `  ${text}` })),
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void run(value);
    setValue("");
  }

  return (
    <OsWindow title={t.title}>
      <div
        ref={screen}
        role="log"
        aria-live="polite"
        onClick={() => input.current?.focus()}
        className="h-80 overflow-y-auto whitespace-pre-wrap px-4 py-3 font-pixel text-xl leading-snug"
      >
        {lines.map((l, i) => (
          <div key={i} className={tones[l.tone ?? "input"]}>
            {l.text || " "}
          </div>
        ))}
        <form onSubmit={onSubmit} className="flex">
          <label htmlFor="terminal-input" className="shrink-0 text-fg">
            <span className="sr-only">{t.inputLabel} </span>
            {t.prompt}
          </label>
          <input
            ref={input}
            id="terminal-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-accent caret-accent outline-none"
          />
        </form>
      </div>
    </OsWindow>
  );
}
