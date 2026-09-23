"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Parallax } from "@/components/Parallax";
import { OsWindow } from "./OsWindow";

// The ORISON screenshots as a folder of windows, with a full-screen viewer.
//
// Mobile first: a swipeable row of windows; a tap opens the viewer, where you swipe between
// shots. From 768px: windows scattered across the "desktop" on parallax columns; on hover a
// window straightens and grows a little, a click opens the viewer (← → to browse, Esc to close).
// The viewer is a native <dialog>, so focus is trapped and Esc works out of the box.

type Shot = { src: string; alt: string; file: string };
type Labels = { open: string; close: string; prev: string; next: string };

const SWIPE_PX = 50;

export function ScreenshotGallery({ shots, labels }: { shots: Shot[]; labels: Labels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const swipeStart = useRef<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + shots.length) % shots.length)), [shots.length]);

  // Arrow keys while open; the page behind must not scroll
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, step]);

  const onPointerDown = (e: ReactPointerEvent) => {
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > SWIPE_PX) step(dx < 0 ? 1 : -1);
  };

  const thumb = (s: Shot, i: number, sizes: string, tilt = "") => (
    <button
      type="button"
      onClick={() => open(i)}
      aria-label={`${labels.open}: ${s.file}`}
      className={`block w-full cursor-zoom-in text-left transition-[scale,rotate] duration-300 ease-out md:hover:rotate-0 md:hover:scale-[1.04] md:focus-visible:scale-[1.04] ${tilt}`}
    >
      <OsWindow title={s.file}>
        <Image src={s.src} alt={s.alt} width={1920} height={1080} sizes={sizes} className="h-auto w-full" />
      </OsWindow>
    </button>
  );

  const current = index === null ? null : shots[index];

  return (
    <>
      {/* Mobile: swipeable row */}
      <ul className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:hidden">
        {shots.map((s, i) => (
          <li key={s.src} className="w-[85%] shrink-0 snap-center">
            {thumb(s, i, "85vw")}
          </li>
        ))}
      </ul>

      {/* From 768px: scattered windows, each column on its own parallax layer */}
      <Parallax className="mx-auto mt-10 hidden max-w-6xl grid-cols-3 gap-8 px-8 md:grid">
        {[0, 1, 2].map((col) => (
          <div
            key={col}
            data-parallax={[0.06, -0.08, 0.12][col]}
            data-parallax-desktop
            className={`flex flex-col gap-10 ${col === 1 ? "mt-24" : ""} ${col === 2 ? "mt-10" : ""}`}
          >
            {shots.map((s, i) =>
              i % 3 === col ? <div key={s.src}>{thumb(s, i, "33vw", i % 2 ? "-rotate-1" : "rotate-1")}</div> : null,
            )}
          </div>
        ))}
      </Parallax>

      {/* Full-screen viewer */}
      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === dialog.current && close()}
        aria-label={current?.file}
        className="lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-3 text-fg backdrop:bg-black/90 md:p-8"
      >
        {current && (
          // Mobile first: the window hugs the image, centred; from 768px it takes the full height
          <div className="flex h-full flex-col justify-center" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="os-window flex max-h-full min-h-0 flex-col md:flex-1">
              <div className="os-titlebar">
                <span className="truncate">
                  {current.file} <span className="opacity-60">· {index! + 1}/{shots.length}</span>
                </span>
                <button type="button" autoFocus onClick={close} aria-label={labels.close} className="lightbox-close">
                  ×
                </button>
              </div>
              <div
                className="os-body relative flex min-h-0 touch-pan-y md:flex-1 items-center justify-center select-none"
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerCancel={() => (swipeStart.current = null)}
              >
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  width={1920}
                  height={1080}
                  sizes="100vw"
                  draggable={false}
                  className="lightbox-image max-h-full w-auto max-w-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={labels.prev}
                  className="btn btn-quiet absolute left-2 top-1/2 hidden -translate-y-1/2 md:inline-flex"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={labels.next}
                  className="btn btn-quiet absolute right-2 top-1/2 hidden -translate-y-1/2 md:inline-flex"
                >
                  →
                </button>
              </div>
            </div>
            <p className="mt-3 text-center font-pixel text-lg text-muted">{current.alt}</p>
          </div>
        )}
      </dialog>
    </>
  );
}
