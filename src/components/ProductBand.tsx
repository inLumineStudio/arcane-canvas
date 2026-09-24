import type { ReactNode } from "react";
import { Button } from "./Button";

// One full-bleed band per product on the Home page. Each band leaves the studio palette and
// wears its product's colours and assets (`backdrop`, and a `media` element framed in the
// product's own style), but every band has the same structure (brief §3):
// name · kind/status · media · description · [More] [store]
//
// Mobile first: everything stacks in reading order. From 1024px the media takes seven
// columns and the text five (mirrored with `reverse`).

type Props = {
  theme: "orison" | "silentium";
  /** Small line above the name ("Project 01"), set in the product's typeface (.band-label) */
  label: string;
  backdrop: ReactNode;
  media: ReactNode;
  /** The product name, as text or as a logo/wordmark element */
  name: ReactNode;
  kind: string;
  status: string;
  description: string;
  moreHref: string;
  moreLabel: string;
  storeHref: string;
  storeLabel: string;
  reverse?: boolean;
};

export function ProductBand(p: Props) {
  return (
    <article data-theme={p.theme} className="product-band relative isolate overflow-hidden">
      <div className="band-fade absolute inset-0 -z-10">{p.backdrop}</div>
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:items-center lg:gap-12">
        <header className={`lg:col-span-5 lg:row-start-1 lg:self-end ${p.reverse ? "lg:col-start-8" : "lg:col-start-1"}`}>
          <p className="band-label mb-3">{p.label}</p>
          <h3>{p.name}</h3>
          <p className="mt-4 text-sm text-muted">
            {p.kind} <span className="text-fg">· {p.status}</span>
          </p>
        </header>

        <div className={`lg:col-span-7 lg:row-span-2 lg:row-start-1 ${p.reverse ? "lg:col-start-1" : "lg:col-start-6"}`}>
          {p.media}
        </div>

        <div className={`lg:col-span-5 lg:row-start-2 lg:self-start ${p.reverse ? "lg:col-start-8" : "lg:col-start-1"}`}>
          <p className="max-w-prose leading-relaxed text-fg/85">{p.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={p.moreHref}>{p.moreLabel}</Button>
            <Button href={p.storeHref} external variant="quiet">
              {p.storeLabel}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
