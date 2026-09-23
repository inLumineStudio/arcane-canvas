"use client";

import { useEffect, useRef } from "react";
import { useInView } from "@/lib/useInView";

// Muted, looping, autoplaying clip (brief §4).
//
// Mobile first: `${src}-sm.{webm,mp4}` (640px) is the default, `${src}.{webm,mp4}` (1280px)
// is used from 768px up. Sources are attached only when the video comes near the viewport,
// and playback pauses when it leaves. The poster stays up (and nothing downloads) with
// reduced motion or when the visitor has Data Saver on.

type Props = {
  /** Path without extension, e.g. "/media/orison/clip" */
  src: string;
  poster: string;
  className?: string;
  label?: string;
};

type NetworkInformation = { saveData?: boolean };

function shouldStayStill() {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData === true;
}

export function LoopVideo({ src, poster, className = "", label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, "300px");

  useEffect(() => {
    const v = ref.current!;
    if (shouldStayStill()) return;
    if (inView) {
      if (!v.dataset.loaded) {
        v.dataset.loaded = "1";
        const base = window.matchMedia("(min-width: 768px)").matches ? src : `${src}-sm`;
        v.innerHTML = `<source src="${base}.webm" type="video/webm"><source src="${base}.mp4" type="video/mp4">`;
        // iOS only autoplays inline videos that are muted at the attribute level
        v.muted = true;
        v.setAttribute("muted", "");
        v.load();
      }
      // Low Power Mode can still refuse: the poster simply stays up.
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`block h-full w-full object-cover ${className}`}
    />
  );
}
