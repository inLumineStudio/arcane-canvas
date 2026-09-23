"use client";

import { useRef, useState } from "react";
import type { Episode } from "@/data/silentium-episodes";
import type { Dictionary } from "@/content";

// Episode list + a single Spotify Embed (brief §5, §7). Picking an episode swaps the iframe,
// so only one player is ever loaded. Logged-out visitors can still listen.

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
        <p className="text-sm text-muted">{t.nowPlaying}</p>
        <p className="mb-4 mt-1 text-lg font-medium">{ep ? splitTitle(ep.title).name : ""}</p>
        <iframe
          key={src}
          title={`${t.playerTitle}: ${ep?.title ?? ""}`}
          src={src}
          width="100%"
          height="232"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="block rounded-xl border-0"
        />
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
