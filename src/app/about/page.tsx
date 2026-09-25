import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import { aboutPage, breadcrumbs, graph, owner } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/Button";
import { Starfield } from "@/components/home/Starfield";

const t = getDictionary();

export const metadata: Metadata = pageMetadata({
  title: t.meta.aboutTitle,
  description: t.meta.aboutDescription,
  path: "/about",
});

// Arcane Canvas is a solo developer, so this page is a letter rather than a corporate
// "about us": first person, like the developer notes of Toby Fox or Lucas Pope, followed by
// a plain index of the work (dukope.com style) and the press/contact addresses.

const workThumbs: Record<string, string> = {
  ORISON: "/media/orison/capsule.webp",
  SILENTIUM: "/media/silentium/cover.webp",
  "ORISON mini CD": "/media/orison/minicd-disc.webp",
};

export default function AboutPage() {
  const a = t.about;

  return (
    <PageShell theme="studio">
      <JsonLd data={graph(aboutPage(), owner(), breadcrumbs([{ name: t.nav.about, path: "/about" }]))} />
      {/* ── The letter ───────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <Starfield count={50} seed={5} className="-z-10 opacity-60" />
        <div className="mx-auto grid max-w-6xl gap-16 px-5 pb-24 pt-36 md:px-8 md:pt-44 lg:grid-cols-[18rem_1fr] lg:gap-24">
          {/* Polaroid-style snapshot, pinned slightly crooked */}
          <figure className="ml-2 w-52 -rotate-3 md:w-60 bg-[#e4eef9] p-3 pb-2 shadow-[0_20px_60px_rgb(0_0_0/0.6)] lg:sticky lg:top-32 lg:ml-0 lg:mt-4 lg:self-start">
            <Image
              src="/media/brand/about-portrait.webp"
              alt={a.letter.portraitAlt}
              width={720}
              height={960}
              sizes="(min-width: 768px) 15rem, 13rem"
              className="aspect-[3/4] h-auto w-full object-cover"
            />
            <figcaption className="pt-2 text-center font-hand text-xl leading-tight text-[#1b2330]">
              {a.letter.portraitCaption}
            </figcaption>
          </figure>

          <div className="max-w-[62ch]">
            <h1 className="text-[clamp(2.25rem,8vw,4.5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.03em]">{a.letter.title}</h1>
            <div className="mt-10 space-y-6 text-lg leading-relaxed text-fg/85">
              {a.letter.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-10 italic text-muted">{a.letter.signoff}</p>
            <p className="mt-3 -rotate-2 font-hand text-4xl text-accent">{a.letter.signature}</p>
          </div>
        </div>
      </section>

      {/* ── Index of the work ────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <h2 className="mb-8 text-2xl font-medium md:text-3xl">{a.works.title}</h2>
        <ul className="border-t border-line">
          {a.works.items.map((w) => {
            const row = (
              <>
                <Image
                  src={workThumbs[w.title]}
                  alt=""
                  width={96}
                  height={96}
                  className="size-14 shrink-0 object-cover md:size-16"
                />
                <span className="w-12 shrink-0 text-sm tabular-nums text-muted">{w.year}</span>
                <span className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
                  <span className="text-xl font-medium tracking-wide transition-colors group-hover:text-accent">
                    {w.title}
                  </span>
                  <span className="text-sm text-muted">{w.kind}</span>
                </span>
                {w.status && <span className="hidden text-sm text-muted md:inline">{w.status}</span>}
                {w.href && (
                  <span aria-hidden="true" className="text-accent transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </>
            );
            const cls = "group flex items-center gap-4 border-b border-line py-4 md:gap-6";
            return (
              <li key={w.title}>
                {w.href ? (
                  <Link href={w.href} className={`${cls} hover:bg-bg-raised/60`}>
                    {row}
                  </Link>
                ) : (
                  <div className={cls}>{row}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Press & contact ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-28 pt-8 md:px-8">
        <div className="grid gap-10 border border-line p-6 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <h2 className="text-2xl font-medium">{a.press.title}</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-fg/75">{a.press.text}</p>
            <p className="mt-6 text-sm text-muted">
              <a href={`mailto:${site.pressEmail}`} className="text-fg underline-offset-4 hover:text-accent hover:underline">
                {site.pressEmail}
              </a>
              <span className="mx-3">·</span>
              {a.hello}{" "}
              <a href={`mailto:${site.contactEmail}`} className="text-fg underline-offset-4 hover:text-accent hover:underline">
                {site.contactEmail}
              </a>
            </p>
          </div>
          <Button href={site.orison.pressKitUrl} external>
            {a.press.orisonKit}
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
