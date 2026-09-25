"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ditherBar } from "@/lib/dither";

// A window from the game's own OS, matched to how it looks in-game: a flat window with a thin
// grey edge, a purple title bar that dithers into grey after the title (lib/dither.ts), and
// two flat grey buttons with a thick outline (minimise and close; there is no maximise in
// the game). Used for anything "on screen" in ORISON.
export function OsWindow({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => ditherBar(bar.current!), []);

  return (
    <div className={`os-window ${className}`}>
      <OsTitlebar ref={bar} title={title} />
      <div className="os-body">{children}</div>
    </div>
  );
}

/** The title bar alone, for windows that bring their own controls (the screenshot viewer) */
export function OsTitlebar({
  title,
  ref,
  controls,
}: {
  title: string;
  ref?: React.Ref<HTMLDivElement>;
  controls?: ReactNode;
}) {
  return (
    <div ref={ref} className="os-titlebar">
      <span data-dither-anchor className="truncate">
        {title}
      </span>
      <span data-dither-limit className="os-controls">
        {controls ?? (
          <>
            <span aria-hidden="true" className="os-btn os-btn-min" />
            <span aria-hidden="true" className="os-btn os-btn-close" />
          </>
        )}
      </span>
    </div>
  );
}
