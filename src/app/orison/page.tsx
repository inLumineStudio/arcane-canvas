import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/config/site";
import { getDictionary } from "@/content";
import { OG, pageMetadata } from "@/lib/metadata";
import { breadcrumbs, game, graph } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { Parallax } from "@/components/Parallax";
import { RichText } from "@/components/RichText";
import { StickyCta } from "@/components/StickyCta";
import { EyeCanvas } from "@/components/orison/EyeCanvas";
import { PixelEye } from "@/components/orison/PixelEye";
import { EyeField } from "@/components/orison/EyeField";
import { BinaryRain } from "@/components/orison/BinaryRain";
import { OsWindow } from "@/components/orison/OsWindow";
import { TrailerPlayer } from "@/components/orison/TrailerPlayer";
import { ScreenshotGallery } from "@/components/orison/ScreenshotGallery";
import { Terminal } from "@/components/orison/Terminal";
import { GlitchTrigger } from "@/components/orison/Glitch";
import { SourceComment } from "@/components/orison/SourceComment";
import { ConsoleWhisper } from "@/components/orison/ConsoleWhisper";
import { GyroPrompt } from "@/components/orison/GyroPrompt";

const t = getDictionary();

export const metadata: Metadata = pageMetadata({
  title: t.meta.orisonTitle,
  description: t.meta.orisonDescription,
  path: "/orison",
  image: OG.orison,
});

// Visual language: the game's own 90s OS and the client's print mockups (README.TXT,
// DOS listings, bevelled buttons), with lots of black around the eye (after deltarune.com).

export default function OrisonPage() {
  const o = t.orison;
  const shots = o.gallery.alts.map((alt, i) => ({ alt, src: `/media/orison/shot-${i + 1}.webp`, file: `SHOT_0${i + 1}.PNG` }));

  return (
    <PageShell theme="orison" crt={o.monitorLabel}>
      <JsonLd data={graph(game(), breadcrumbs([{ name: "ORISON", path: "/orison" }]))} />
      <SourceComment />
      <ConsoleWhisper />

      {/* ── Hero: multi-layer parallax around the eye ────────────────── */}
      {/* Exactly one "screen" tall: the viewport minus the CRT bezel */}
      <Parallax className="relative isolate min-h-[calc(100dvh-var(--crt-top,0px)-var(--crt-bottom,0px))] overflow-hidden">
        <div data-parallax="0.3" className="absolute inset-0 -z-20">
          <BinaryRain columns={36} seed={3} className="[mask-image:linear-gradient(90deg,#000_0,transparent_30%,transparent_70%,#000_100%)]" />
        </div>
        {/* Mobile first: the canvas is wider than the phone so the eye fills the screen width */}
        <div
          data-parallax="0.15"
          className="absolute -inset-x-[30%] top-[10%] -z-10 mx-auto h-[55vh] max-w-6xl md:inset-x-0 md:top-[8%] md:h-[62vh]"
        >
          <EyeCanvas />
        </div>

        <div data-parallax="-0.35" aria-hidden="true" className="absolute inset-0 -z-10">
          <PixelEye className="absolute left-[7%] top-[22%]" size={64} />
          <PixelEye className="absolute right-[9%] top-[30%] opacity-80" size={48} />
          <PixelEye className="absolute left-[6%] top-[46%] opacity-60 md:bottom-[18%] md:left-[16%] md:top-auto" size={36} />
        </div>
        <div data-parallax="-0.6" aria-hidden="true" className="absolute inset-0 -z-10">
          <PixelEye className="absolute right-[6%] top-[9%] md:bottom-[26%] md:right-[18%] md:top-auto" size={88} />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-5 pb-28 text-center md:pb-16">
          {/* 32rem: the vector logo is taller than the old PNG; this keeps it at the same height */}
          <h1 className="w-full max-w-[32rem]" data-parallax="-0.1">
            <Image
              src="/media/orison/wordmark.svg"
              alt={o.hero.wordmarkAlt}
              width={1170}
              height={280}
              priority
              unoptimized
              className="mx-auto h-auto w-full"
            />
          </h1>
          {/* The full stop is the hidden glitch trigger. */}
          <div className="font-pixel text-3xl text-accent md:text-4xl">
            {o.hero.tagline.slice(0, -1)}
            <GlitchTrigger t={t.glitch}>{o.hero.tagline.slice(-1)}</GlitchTrigger>
          </div>
          {/* Release status (empty until the demo is out, see orisonStatus in en.ts), then languages */}
          <p className="font-pixel text-xl leading-tight text-muted">
            {o.hero.status && <span className="block">{o.hero.status}</span>}
            <span className="block">{o.hero.languages}</span>
          </p>
          <GyroPrompt label={o.gyroPrompt} />
        </div>

        <div className="scanlines pointer-events-none absolute inset-0" />
      </Parallax>

      {/* ── README: the short description, straight from the print mockups ── */}
      <Section className="max-w-3xl">
        <EyeField
          gutter
          spots={[
            { top: "14%", side: "left", size: 40 },
            { top: "68%", side: "right", size: 30, opacity: 0.7 },
          ]}
        />
        <OsWindow title={o.intro.file}>
          <p className="p-5 leading-relaxed md:p-8 md:text-lg">
            <RichText text={o.intro.text} />
          </p>
        </OsWindow>
        {/* Press kit right under the description: it's what press and creators come looking for */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={site.orison.steamUrl} external>
            {t.buttons.wishlist}
          </Button>
          <Button href={site.orison.pressKitUrl} external variant="quiet">
            {t.buttons.pressKit}
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted">
          <span className="text-fg">{o.press.label}</span> {o.press.text}
        </p>
      </Section>

      {/* ── Trailer: its YouTube cover until play is pressed, then the trailer itself ── */}
      <Section className="pt-0 md:pt-0">
        <EyeField gutter spots={[{ top: "30%", side: "right", size: 44, opacity: 0.8 }]} />
        <OsWindow title={o.clips.file}>
          <TrailerPlayer
            videoId={site.orison.youtubeTrailerId}
            poster="/media/orison/trailer-poster.webp"
            playLabel={t.buttons.watchTrailer}
            title={t.home.products.orison.mediaLabel}
          />
        </OsWindow>
        <p className="mt-3 font-pixel text-lg text-muted">{o.clips.caption}</p>
      </Section>

      {/* ── Screenshots: a folder of windows ─────────────────────────── */}
      <section className="relative py-12 md:py-20">
        <EyeField
          spots={[
            { top: "8%", side: "left", size: 36, opacity: 0.75 },
            { top: "82%", side: "right", size: 28, opacity: 0.6 },
          ]}
        />
        <div className="mx-auto max-w-6xl px-5 font-pixel text-xl text-muted md:px-8">
          <p>
            {o.gallery.folder}&gt;DIR <span className="ml-4">{o.gallery.count}</span>
          </p>
        </div>

        <ScreenshotGallery shots={shots} labels={o.gallery.viewer} />
      </section>

      {/* ── Terminal (easter egg codes) ──────────────────────────────── */}
      <Section id="terminal" className="max-w-3xl">
        <EyeField gutter spots={[{ top: "40%", side: "left", size: 44, opacity: 0.85 }]} />
        <Terminal t={t.terminal} />
      </Section>

      {/* ── Final CTA (the sticky one steps aside while this is on screen) ── */}
      <section data-hide-sticky-cta className="relative isolate overflow-hidden">
        <BinaryRain columns={20} seed={11} className="-z-10 [mask-image:linear-gradient(90deg,#000_0,transparent_30%,transparent_70%,#000_100%)]" />
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-5 py-28 text-center">
          <PixelEye size={96} />
          <h2 className="font-pixel text-5xl leading-none text-accent md:text-6xl">{o.cta.title}</h2>
          <p className="text-fg/80">{o.cta.text}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button href={site.orison.steamUrl} external>
              {t.buttons.wishlist}
            </Button>
            <Button href={site.orison.pressKitUrl} external variant="quiet">
              {t.buttons.pressKit}
            </Button>
          </div>
        </div>
      </section>

      <StickyCta href={site.orison.steamUrl} label={t.buttons.wishlist} sub={o.hero.status} />
    </PageShell>
  );
}
