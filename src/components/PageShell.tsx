import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { CrtFrame } from "./orison/CrtFrame";

export type Theme = "studio" | "orison" | "silentium";

type Props = {
  theme: Theme;
  /** Frame the whole page in a CRT monitor bezel; the value is the label on the monitor chin. */
  crt?: string;
  /** No header or footer: a page that is only its content (the ORISON secret page) */
  bare?: boolean;
  children: ReactNode;
};

export function PageShell({ theme, crt, bare = false, children }: Props) {
  return (
    <div data-theme={theme} data-crt={crt ? "" : undefined} className="flex min-h-dvh flex-col">
      {!bare && <SiteHeader />}
      <main id="content" className="flex-1">
        {children}
      </main>
      {!bare && <SiteFooter />}
      {crt && <CrtFrame label={crt} />}
    </div>
  );
}
