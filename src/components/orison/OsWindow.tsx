import type { ReactNode } from "react";

// A window from the game's own 90s operating system: bevelled frame, title bar with the
// file name, and the three little system buttons. Used for anything "on screen" in ORISON.
export function OsWindow({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`os-window ${className}`}>
      <div className="os-titlebar">
        <span className="truncate">{title}</span>
        <span aria-hidden="true" className="os-controls">
          <span>_</span>
          <span>□</span>
          <span>×</span>
        </span>
      </div>
      <div className="os-body">{children}</div>
    </div>
  );
}
