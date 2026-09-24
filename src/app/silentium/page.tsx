import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/config/site";
import { getDictionary } from "@/content";
import { OG, pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { getSilentiumEpisodes } from "@/lib/spotify";
import { getTranscriptSeasons, LEXICON } from "@/lib/transcripts";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { Parallax } from "@/components/Parallax";
import { StickyCta } from "@/components/StickyCta";
import { EpisodePlayer } from "@/components/silentium/EpisodePlayer";

const t = getDictionary();

export const metadata: Metadata = pageMetadata({
  title: t.meta.silentiumTitle,
  description: t.meta.silentiumDescription,
  path: "/silentium",
  image: OG.silentium,
});

// Refresh the episode list from Spotify once a day; the transcript list (from the client's
// archive repo) asks for an hourly refresh, and the page follows the shorter of the two.
export const revalidate = 86400;

export default async function SilentiumPage() {
  const s = t.silentium;
  const [episodes, seasons] = await Promise.all([getSilentiumEpisodes(), getTranscriptSeasons()]);
  const tr = s.transcripts;

  return (
    <PageShell theme="silentium">
      {/* ── Hero: the vertical poster split into horizontal layers ───── */}
      <Parallax className="relative isolate flex min-h-dvh items-end overflow-hidden">
        <div className="absolute inset-0 -z-30 bg-gradient-to-b from-[var(--brick-deep)] to-bg" />
        <div data-parallax="0.35" className="absolute -inset-y-[15%] inset-x-0 -z-20">
          <Image
            src="/media/silentium/band-hands.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_40%] opacity-80"
          />
        </div>
        {/* The shadow hands from the top of the poster creep in faster than the background */}
        <div
          data-parallax="-0.25"
          className="absolute inset-x-0 -top-[10%] -z-10 h-[70%] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        >
          <Image
            src="/media/silentium/band-shadows.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top opacity-70 mix-blend-multiply"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
        <div className="grain absolute inset-0 -z-10" />

        <div className="mx-auto w-full max-w-7xl px-5 pb-28 md:px-8 md:pb-20">
          <h1 className="text-[clamp(2.25rem,11vw,8rem)] font-normal uppercase tracking-[0.2em] md:tracking-[0.3em]">SILENTIUM</h1>
          <p className="mt-6 font-hand text-3xl text-accent md:text-4xl">{s.hero.tagline}</p>
        </div>
      </Parallax>

      {/* ── Format ───────────────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-medium leading-tight md:text-5xl">{s.format.title}</h2>
            <p className="mt-8 max-w-prose text-lg leading-relaxed text-fg/80">{s.format.text}</p>
            {/* Set like closing credits: label on the left, value on the right */}
            <dl className="mt-12 border-t border-line">
              {s.format.facts.map((f) => (
                <div key={f.label} className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:gap-8">
                  <dt className="text-sm text-muted sm:w-28 sm:shrink-0">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 font-hand text-2xl text-accent">{s.format.forFansOf}</p>
          </div>
          <Parallax className="lg:col-span-5">
            <figure data-parallax="-0.08" className="relative mx-auto max-w-sm lg:max-w-none">
              <Image
                src="/media/silentium/cover.webp"
                alt={s.hero.coverAlt}
                width={900}
                height={1200}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-auto w-full"
              />
              <div className="grain absolute inset-0" />
            </figure>
          </Parallax>
        </div>
      </Section>

      {/* ── Episodes ─────────────────────────────────────────────────── */}
      <Section id="episodes" title={s.episodes.title}>
        <p className="-mt-6 text-muted md:-mt-8">{s.episodes.intro}</p>
        {/* The embed is Spotify's, but the show is everywhere: the other ways in, right here */}
        <p className="mb-10 mt-1 text-sm text-muted">
          {s.episodes.alsoOn}{" "}
          <a href={site.silentium.appleUrl} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center text-fg md:min-h-0">
            {s.episodes.applePodcasts}
          </a>
          {" · "}
          <a href={site.silentium.rssUrl} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center text-fg md:min-h-0">
            {s.episodes.rss}
          </a>
        </p>
        <EpisodePlayer episodes={episodes} showId={site.silentium.spotifyShowId} t={s.episodes} />
      </Section>

      {/* ── Transcripts: every case as a whole-row link (big tap target on phones), read on
          its own page. If the archive can't be reached, a link to it instead. ── */}
      <Section id="transcripts" title={tr.title}>
        <div className="-mt-6 mb-10 max-w-prose md:-mt-8">
          <p className="text-muted">{tr.intro}</p>
          <p className="mt-3 text-sm text-accent">{tr.warning}</p>
        </div>

        {seasons.length ? (
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              {seasons.map((season) => (
                <section key={season.title} aria-label={season.title || tr.title} className="mb-10 last:mb-0">
                  {season.title && <h3 className="mb-2 font-hand text-3xl text-accent">{season.title}</h3>}
                  <ul className="border-t border-line">
                    {season.entries.map((e) => (
                      <li key={e.slug} className="border-b border-line">
                        <Link href={`/silentium/transcripts/${e.slug}`} className="group block py-5 md:py-6">
                          <span className="block text-lg font-medium transition-colors group-hover:text-accent md:text-xl">
                            {e.title}
                          </span>
                          {/* Case, date, status: each wraps as a whole, never mid-item */}
                          {e.meta.length > 0 && (
                            <span className="mt-1 flex flex-wrap gap-x-4 text-sm text-muted">
                              {e.meta.map((m) => (
                                <span key={m}>{m}</span>
                              ))}
                            </span>
                          )}
                          {e.summary && <span className="mt-3 block max-w-prose leading-relaxed text-fg/80">{e.summary}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            {/* The Lexicon: under the list on phones, alongside it from 1024px */}
            <aside className="lg:col-span-4">
              <Link
                href={`/silentium/transcripts/${LEXICON}`}
                className="group block border border-line bg-bg-raised p-6 transition-colors hover:border-accent lg:sticky lg:top-24"
              >
                <span className="block text-xl font-medium group-hover:text-accent">{tr.lexicon} →</span>
                <span className="mt-2 block text-sm leading-relaxed text-muted">{tr.lexiconNote}</span>
              </Link>
            </aside>
          </div>
        ) : (
          <div>
            <p className="mb-6 max-w-prose text-fg/80">{tr.unavailable}</p>
            <Button href={site.silentium.transcripts.siteUrl} external>
              {tr.archive}
            </Button>
          </div>
        )}
      </Section>

      {/* ── Final CTA (the sticky one steps aside while this is on screen) ── */}
      <section data-hide-sticky-cta className="relative isolate overflow-hidden">
        <Image
          src="/media/silentium/band-hands.webp"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover opacity-25"
        />
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-5 py-28 text-center">
          <h2 className="text-4xl font-medium md:text-5xl">{s.cta.title}</h2>
          <p className="text-fg/80">{s.cta.text}</p>
          {/* Spotify first (the main platform), then the other podcast apps */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button href={site.silentium.spotifyUrl} external>
              {t.buttons.listen}
            </Button>
            <Button href={site.silentium.appleUrl} external variant="quiet">
              {s.cta.apple}
            </Button>
          </div>
          <a href={site.silentium.rssUrl} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center text-sm text-muted">
            {s.cta.rss}
          </a>
        </div>
      </section>

      <StickyCta href={site.silentium.spotifyUrl} label={t.buttons.listen} />
    </PageShell>
  );
}
