import type { Metadata } from "next";
import Image from "next/image";
import { orisonPressKitHref, site } from "@/config/site";
import { getDictionary } from "@/content";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { Parallax } from "@/components/Parallax";
import { LoopVideo } from "@/components/LoopVideo";
import { RichText } from "@/components/RichText";
import { StickyCta } from "@/components/StickyCta";
import { EyeCanvas } from "@/components/orison/EyeCanvas";
import { PixelEye } from "@/components/orison/PixelEye";
import { BinaryRain } from "@/components/orison/BinaryRain";
import { OsWindow } from "@/components/orison/OsWindow";
import { Terminal } from "@/components/orison/Terminal";
import { GlitchTrigger } from "@/components/orison/Glitch";
import { SourceComment } from "@/components/orison/SourceComment";
import { ConsoleWhisper } from "@/components/orison/ConsoleWhisper";
import { GyroPrompt } from "@/components/orison/GyroPrompt";

const t = getDictionary();

export const metadata: Metadata = {
  title: t.meta.orisonTitle,
  description: t.meta.orisonDescription,
  openGraph: { images: ["/media/orison/capsule.webp"] },
};

// Visual language: the game's own 90s OS and the client's print mockups (README.TXT,
// DOS listings, bevelled buttons), with lots of black around the eye (after deltarune.com).

export default function OrisonPage() {
  const o = t.orison;
  const shots = o.gallery.alts.map((alt, i) => ({ alt, src: `/media/orison/shot-${i + 1}.webp`, file: `SHOT_0${i + 1}.PNG` }));

  return (
    <PageShell theme="orison" crt={o.monitorLabel}>
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
          <h1 className="w-full max-w-xl" data-parallax="-0.1">
            <Image
              src="/media/orison/wordmark.png"
              alt={o.hero.wordmarkAlt}
              width={900}
              height={190}
              priority
              className="mx-auto h-auto w-full [image-rendering:pixelated]"
            />
          </h1>
          {/* The full stop is the hidden glitch trigger. */}
          <div className="font-pixel text-3xl text-accent md:text-4xl">
            {o.hero.tagline.slice(0, -1)}
            <GlitchTrigger t={t.glitch}>{o.hero.tagline.slice(-1)}</GlitchTrigger>
          </div>
          <p className="font-pixel text-xl text-muted">{o.hero.status}</p>
          <GyroPrompt label={o.gyroPrompt} />
        </div>

        <div className="scanlines pointer-events-none absolute inset-0" />
      </Parallax>

      {/* ── README: the short description, straight from the print mockups ── */}
      <Section className="max-w-3xl">
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
          <Button href={orisonPressKitHref} external variant="quiet">
            {t.buttons.pressKit}
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted">
          <span className="text-fg">{o.press.label}</span> {o.press.text}
        </p>
      </Section>

      {/* ── What you do in there, as the game's own HELP output ──────── */}
      <Section className="max-w-3xl pt-0 md:pt-0">
        <OsWindow title={o.features.window}>
          <div className="p-5 font-pixel text-xl leading-snug md:p-8 md:text-2xl">
            <p className="text-muted">C:\ORISON&gt;{o.features.command}</p>
            <dl className="mt-4 grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-2 md:grid-cols-[8rem_1fr]">
              {o.features.items.map((f) => (
                <div key={f.cmd} className="contents">
                  <dt className="text-accent">{f.cmd}</dt>
                  <dd>{f.text}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-muted">{o.features.footer}</p>
            <p className="caret mt-4 text-muted">C:\ORISON&gt;</p>
          </div>
        </OsWindow>
      </Section>

      {/* ── Clips from the trailer ───────────────────────────────────── */}
      <Section className="pt-0 md:pt-0">
        <OsWindow title={o.clips.file}>
          <div className="relative aspect-video">
            <LoopVideo src="/media/orison/clip" poster="/media/orison/clip-poster.webp" />
          </div>
        </OsWindow>
        <p className="mt-3 font-pixel text-lg text-muted">{o.clips.caption}</p>
        {/* TODO: remove once the real Steam trailer clips are in public/media/orison */}
        <p className="text-xs text-muted/60">{o.clips.placeholderNote}</p>
      </Section>

      {/* ── Screenshots: a folder of windows ─────────────────────────── */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-5 font-pixel text-xl text-muted md:px-8">
          <p>
            {o.gallery.folder}&gt;DIR <span className="ml-4">{o.gallery.count}</span>
          </p>
        </div>

        {/* Mobile first: a swipeable row of windows */}
        <ul className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:hidden">
          {shots.map((s) => (
            <li key={s.src} className="w-[85%] shrink-0 snap-center">
              <OsWindow title={s.file}>
                <Image src={s.src} alt={s.alt} width={1280} height={720} sizes="85vw" className="h-auto w-full" />
              </OsWindow>
            </li>
          ))}
        </ul>

        {/* From 768px: windows scattered across the desktop, each column on its own parallax layer */}
        <Parallax className="mx-auto mt-10 hidden max-w-6xl grid-cols-3 gap-8 px-8 md:grid">
          {[0, 1, 2].map((col) => (
            <div
              key={col}
              data-parallax={[0.06, -0.08, 0.12][col]}
              data-parallax-desktop
              className={`flex flex-col gap-10 ${col === 1 ? "mt-24" : ""} ${col === 2 ? "mt-10" : ""}`}
            >
              {shots
                .filter((_, i) => i % 3 === col)
                .map((s, j) => (
                  <OsWindow key={s.src} title={s.file} className={j % 2 ? "-rotate-1" : "rotate-1"}>
                    <Image src={s.src} alt={s.alt} width={1280} height={720} sizes="33vw" className="h-auto w-full" />
                  </OsWindow>
                ))}
            </div>
          ))}
        </Parallax>
      </section>

      {/* ── Terminal (easter egg codes) ──────────────────────────────── */}
      <Section id="terminal" className="max-w-3xl">
        <Terminal t={t.terminal} />
      </Section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <BinaryRain columns={20} seed={11} className="-z-10 [mask-image:linear-gradient(90deg,#000_0,transparent_30%,transparent_70%,#000_100%)]" />
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-5 py-28 text-center">
          <PixelEye size={96} />
          <h2 className="font-pixel text-5xl leading-none text-accent md:text-6xl">{o.cta.title}</h2>
          <p className="text-fg/80">{o.cta.text}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button href={site.orison.steamUrl} external>
              {t.buttons.wishlist}
            </Button>
            <Button href={orisonPressKitHref} external variant="quiet">
              {t.buttons.pressKit}
            </Button>
          </div>
        </div>
      </section>

      <StickyCta href={site.orison.steamUrl} label={t.buttons.wishlist} sub={o.hero.status} />
    </PageShell>
  );
}
