"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { site } from "@/config/site";
import type { Episode } from "@/data/silentium-episodes";
import type { Dictionary } from "@/content";

// Episode list + a single Spotify Embed (brief §5, §7). Picking an episode swaps the iframe,
// so only one player is ever loaded. Logged-out visitors can still listen.
//
// Click to load: the Spotify iframe can set third-party cookies, so nothing is requested
// from Spotify until the visitor asks for the player (Italian Garante guidelines: no
// non-essential third-party cookies before consent). Until then a local placeholder of the
// same size shows the chosen episode, says what loading the player implies (with the link
// to /privacy) and offers the episode on Spotify as a plain link instead.
// Picking episodes before that only updates the placeholder.

type Props = {
  episodes: Episode[];
  showId: string;
  t: Dictionary["silentium"]["episodes"];
};

// "Episode 5.5: Bellows" → { label: "Episode 5.5", name: "Bellows" }
function splitTitle(title: string) {
  const m = title.match(/^(Episode [\d.]+):\s*(.+)$/);
  return m ? { label: m[1], name: m[2] } : { label: "", name: title };
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function EpisodePlayer({ episodes, showId, t }: Props) {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const player = useRef<HTMLDivElement>(null);
  const ep = episodes[current];
  const src = ep?.id
    ? `https://open.spotify.com/embed/episode/${ep.id}?theme=0`
    : `https://open.spotify.com/embed/show/${showId}?theme=0`;

  function pick(i: number) {
    setCurrent(i);
    // Mobile first: the player sits above the list, so bring it back into view
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      player.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-14">
      <div ref={player} className="scroll-mt-20 lg:sticky lg:top-24 lg:order-2 lg:self-start">
        <p className="text-sm text-muted">{loaded ? t.nowPlaying : t.selected}</p>
        <p className="mb-4 mt-1 text-lg font-medium">{ep ? splitTitle(ep.title).name : ""}</p>
        {loaded ? (
          <iframe
            key={src}
            title={`${t.playerTitle}: ${ep?.title ?? ""}`}
            src={src}
            width="100%"
            height="232"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="block rounded-xl border-0"
          />
        ) : (
          // Same height as the Spotify embed (232px), so nothing jumps when it loads
          <div className="flex h-[232px] flex-col justify-between gap-3 rounded-xl border border-line bg-bg-raised p-4">
            <div className="flex items-start gap-4">
              <Image
                src="/media/silentium/cover.webp"
                alt=""
                width={96}
                height={128}
                className="h-24 w-[4.5rem] shrink-0 object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm text-muted">{ep ? splitTitle(ep.title).label : ""}</p>
                <button type="button" onClick={() => setLoaded(true)} className="btn mt-2 text-left">
                  ▶ {t.loadPlayer}
                </button>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              {t.consentNote}{" "}
              <Link href="/privacy" className="link text-fg">
                {t.privacyLink}
              </Link>
              {" · "}
              <a
                href={ep?.id ? site.silentium.episodeUrl(ep.id) : site.silentium.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link text-fg"
              >
                {t.openOnSpotify}
              </a>
            </p>
          </div>
        )}
        {!ep?.id && <p className="mt-3 text-xs text-muted">{t.showFallback}</p>}
      </div>

      <ol className="border-t border-line lg:order-1">
        {episodes.map((e, i) => {
          const active = i === current;
          const { label, name } = splitTitle(e.title);
          return (
            <li key={`${e.title}-${i}`} className="border-b border-line">
              <button
                type="button"
                onClick={() => pick(i)}
                aria-pressed={active}
                className={`group block w-full border-l-2 py-5 pl-4 pr-2 text-left transition-colors ${
                  active ? "border-accent" : "border-transparent hover:border-line"
                }`}
              >
                <span className="flex items-baseline justify-between gap-4 text-sm text-muted">
                  <span>{label}</span>
                  <span className="tabular-nums">
                    <time dateTime={e.date}>{dateFmt.format(new Date(e.date))}</time> · {e.minutes} {t.minutes}
                  </span>
                </span>
                <span
                  className={`mt-1 block text-lg font-medium md:text-xl ${active ? "text-accent" : "group-hover:text-accent"}`}
                >
                  {name}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-fg/65">{e.description}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
