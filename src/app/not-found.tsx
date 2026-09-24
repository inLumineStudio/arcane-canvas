import type { Metadata } from "next";
import { getDictionary } from "@/content";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/Button";
import { EyeWall } from "@/components/orison/EyeWall";
import { GyroPrompt } from "@/components/orison/GyroPrompt";

// 404, for unknown URLs and for notFound() (e.g. a transcript that does not exist).
// In ORISON's language: the page is gone, but a wall of eyes is still looking, and they all
// follow the visitor (see EyeWall for the mobile behaviour). The middle of the wall is
// cleared (.eye-wall mask) so the message stays readable. Next adds noindex to 404s itself.

export const metadata: Metadata = { title: getDictionary().meta.notFoundTitle };

export default function NotFound() {
  const t = getDictionary();
  const n = t.notFound;

  return (
    <PageShell theme="orison">
      <section className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-5 pb-16 pt-24">
        <EyeWall />
        <div className="scanlines pointer-events-none absolute inset-0" />
        <div className="relative flex max-w-md flex-col items-center gap-4 text-center">
          <p className="font-pixel text-[clamp(6rem,30vw,11rem)] leading-none text-accent">{n.code}</p>
          <h1 className="font-pixel text-3xl leading-tight md:text-4xl">{n.title}</h1>
          <p className="text-fg/80">{n.text}</p>
          <Button href="/" className="mt-4">
            {n.home}
          </Button>
          <GyroPrompt label={t.orison.gyroPrompt} />
        </div>
      </section>
    </PageShell>
  );
}
