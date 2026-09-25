"use client";

import { useRef, type ReactNode } from "react";
import type { Dictionary } from "@/content";

// Hidden trigger (brief §4): an invisible click/tap target that glitches the whole page and
// then opens a panel. What the panel reveals is TBD with Marco; the copy is a placeholder.
//
// The trigger wraps a piece of ordinary text (the full stop of the hero tagline), so it looks
// like punctuation. Its hit area is enlarged to ~44px so it can be tapped on a phone.

const GLITCH_MS = 900;

type Props = { t: Dictionary["glitch"]; children: ReactNode };

export function GlitchTrigger({ t, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  // The glitch runs inside the monitor glass (data-glitching on the CRT page shell, the same
  // effect as the monitor's power button, see CrtFrame): the bezel itself never moves.
  function trigger() {
    const shell = document.querySelector<HTMLElement>("[data-crt]");
    if (!shell || shell.hasAttribute("data-glitching")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return dialog.current?.showModal();
    navigator.vibrate?.([30, 40, 30, 40, 80]); // a short stutter on Android phones
    shell.setAttribute("data-glitching", "");
    setTimeout(() => {
      shell.removeAttribute("data-glitching");
      dialog.current?.showModal();
    }, GLITCH_MS);
  }

  return (
    <>
      {/* Not in the tab order and no cursor change: it must look like plain text. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={trigger}
        className="relative inline cursor-default bg-transparent p-0 text-inherit [font:inherit] after:absolute after:-inset-x-4 after:-inset-y-3 after:content-['']"
      >
        {children}
      </button>
      <dialog
        ref={dialog}
        className="m-auto w-[min(92vw,34rem)] border border-accent bg-bg p-0 text-left text-fg backdrop:bg-black/80"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        <div className="border-b border-line bg-bg-raised px-4 py-2 font-pixel text-lg text-[#ff6b7f]">
          !! SYSTEM FAULT 0x0000DEAD
        </div>
        <div className="space-y-4 p-6">
          <h2 className="font-pixel text-3xl leading-none text-accent">{t.title}</h2>
          <p className="font-sans text-sm leading-relaxed text-muted">{t.body}</p>
          <form method="dialog">
            <button className="min-h-11 border border-line px-4 py-2 font-sans text-xs uppercase tracking-[0.18em] hover:border-accent hover:text-accent">
              {t.close}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
