import Link from "next/link";
import type { ReactNode } from "react";

// The look comes from .btn / .btn-quiet in globals.css, which change per theme
// (silver slab on studio pages, bevelled system button on ORISON, thin outline on SILENTIUM).

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "quiet";
  /** Opens in a new tab (Steam, Spotify, YouTube, Dropbox) */
  external?: boolean;
  className?: string;
};

export function Button({ href, children, variant = "primary", external, className = "" }: Props) {
  const cls = `btn ${variant === "quiet" ? "btn-quiet" : ""} ${className}`;

  // mailto: links open the mail client, never a new tab
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
