import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { getDictionary } from "@/content";
import { PageShell } from "@/components/PageShell";
import { ProductBand } from "@/components/ProductBand";
import { LoopVideo } from "@/components/LoopVideo";
import { Parallax } from "@/components/Parallax";
import { StarBackdrop, Starfield } from "@/components/home/Starfield";
import { LogoOrbit } from "@/components/home/LogoOrbit";
import { BinaryRain } from "@/components/orison/BinaryRain";
import { PixelEye } from "@/components/orison/PixelEye";
import { OsWindow } from "@/components/orison/OsWindow";
import { TrailerPlayer } from "@/components/orison/TrailerPlayer";

export default function HomePage() {
  const t = getDictionary();
  const h = t.home;

  return (
    <PageShell theme="studio">
      {/* ── Hero: the logo with its galaxy ring and the statement, together in one screen.
          Stacked on phones and portrait tablets, side by side on landscape screens from 768px.
          Sizes live in globals.css (.home-hero). ── */}
      <Parallax className="home-hero relative isolate flex min-h-svh flex-col items-center justify-center gap-4 overflow-hidden pb-6 pt-14 md:gap-6 md:pb-10">
        <div data-parallax="0.3" className="absolute -inset-y-[10%] inset-x-0 -z-10">
          <Starfield />
        </div>
        <h1 className="sr-only">{t.meta.siteName}</h1>
        <div data-parallax="0.12" className="home-hero-logo aspect-[640/328] shrink-0">
          <LogoOrbit words={h.hero.orbit} alt={h.hero.logoAlt} />
        </div>
        <p
          aria-label={h.statement.lines.join(" ")}
          className="home-hero-statement w-full max-w-6xl px-5 font-semibold uppercase leading-[0.92] tracking-[-0.03em] md:px-8"
        >
          {h.statement.lines.map((line, i) => (
            <span
              key={line}
              aria-hidden="true"
              className={`block ${i === h.statement.lines.length - 1 ? "text-accent" : ""} ${
                i % 2 ? "md:pl-[0.9em]" : ""
              }`}
            >
              {line}
            </span>
          ))}
        </p>
      </Parallax>

      {/* Everything under the hero shares one starry sky (the product bands paint over it,
          and it shows again through their faded edges) */}
      <div className="relative isolate">
        <StarBackdrop />

        {/* ── Intro: short enough (4 lines) to centre under the hero on tablet and desktop ── */}
        <section className="mx-auto max-w-[60ch] px-5 pb-20 pt-12 text-lg md:px-0 md:pb-28 md:pt-20 md:text-center">
          <p className="leading-relaxed text-fg/85">{h.statement.intro}</p>
          <Link href="/about" className="link mt-4 inline-block text-fg">
            {h.statement.aboutLink}
          </Link>
        </section>

        {/* ── Projects: a studio heading, then one band per product, each switching to its
            product's own world. The gap between bands is plain studio black: with the band
            edges faded (ProductBand), each project gets its own air instead of the two worlds
            butting into each other. ── */}
        <section id="products" aria-labelledby="products-title" className="scroll-mt-20">
          <h2
            id="products-title"
            className="mx-auto max-w-6xl px-5 text-[clamp(2.25rem,9vw,6rem)] font-semibold uppercase leading-[0.95] tracking-[-0.03em] md:px-8"
          >
            {h.products.title}
          </h2>
          <div className="mt-4 flex flex-col gap-12 md:mt-8 md:gap-20">
            <ProductBand
              theme="orison"
              backdrop={
                <>
                  <div className="absolute inset-0 bg-bg" />
                  {/* Rain and eyes only at the edges, the middle stays black (deltarune-style framing) */}
                  <BinaryRain className="[mask-image:linear-gradient(90deg,#000_0,transparent_22%,transparent_78%,#000_100%)]" />
                  <PixelEye className="absolute left-[3%] top-[8%] opacity-80" size={44} />
                  <PixelEye className="absolute bottom-[6%] right-[4%] opacity-70" size={56} />
                  <div className="scanlines absolute inset-0" />
                </>
              }
              name={
                <Image
                  src="/media/orison/wordmark.png"
                  alt={h.products.orison.name}
                  width={900}
                  height={190}
                  className="h-auto w-full max-w-sm [image-rendering:pixelated]"
                />
              }
              kind={h.products.orison.kind}
              status={h.products.orison.status}
              description={h.products.orison.description}
              media={
                <OsWindow title="TRAILER.WEBM">
                  {site.orison.youtubeTrailerId ? (
                    <TrailerPlayer
                      videoId={site.orison.youtubeTrailerId}
                      poster="/media/orison/trailer-poster.webp"
                      playLabel={t.buttons.watchTrailer}
                      title={h.products.orison.mediaLabel}
                    />
                  ) : (
                    <div className="aspect-video">
                      <LoopVideo src="/media/orison/clip" poster="/media/orison/clip-poster.webp" />
                    </div>
                  )}
                </OsWindow>
              }
              moreHref="/orison"
              moreLabel={t.buttons.more}
              storeHref={site.orison.steamUrl}
              storeLabel={t.buttons.steam}
            />

            <ProductBand
              theme="silentium"
              reverse
              backdrop={
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-[var(--brick-deep)] via-bg to-bg" />
                  <div className="grain absolute inset-0" />
                </>
              }
              name={
                <span className="block text-[clamp(2rem,9vw,3.5rem)] font-normal uppercase leading-none tracking-[0.2em]">
                  {h.products.silentium.name}
                </span>
              }
              kind={h.products.silentium.kind}
              status={h.products.silentium.status}
              description={h.products.silentium.description}
              media={
                <figure className="relative aspect-[4/3] overflow-hidden md:aspect-video">
                  <Image
                    src="/media/silentium/hand.webp"
                    alt={h.products.silentium.mediaAlt}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                  <div className="grain absolute inset-0" />
                </figure>
              }
              moreHref="/silentium"
              moreLabel={t.buttons.more}
              storeHref={site.silentium.spotifyUrl}
              storeLabel={t.buttons.spotify}
            />
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────────── */}
        {/* Centred from 768px like the intro above; flush left on phones */}
        <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 md:px-8 md:py-36 md:text-center">
          <h2 className="text-[clamp(2.25rem,9vw,6rem)] font-semibold uppercase leading-[0.95] tracking-[-0.03em]">
            {h.contact.title}
          </h2>
          <p className="mt-8 max-w-prose text-fg/80 md:mx-auto">{h.contact.text}</p>
          <a
            href={`mailto:${site.contactEmail}`}
            className="link mt-10 inline-block text-[clamp(1.05rem,5.2vw,2.25rem)] text-accent"
          >
            {site.contactEmail}
          </a>
          <p className="mt-6 text-sm text-muted">
            {h.contact.pressLabel}{" "}
            <a href={`mailto:${site.pressEmail}`} className="link text-fg">
              {site.pressEmail}
            </a>
          </p>
        </section>
      </div>
    </PageShell>
  );
}
