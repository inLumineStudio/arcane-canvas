import "server-only";
import { site } from "@/config/site";
import { fallbackEpisodes, type Episode } from "@/data/silentium-episodes";

// Where the SILENTIUM episode list comes from, first that works:
//   1. The Spotify Web API, when a Spotify app's credentials are set (Client Credentials flow:
//      SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET). Everything is automatic, episode IDs included.
//   2. The podcast's public RSS feed (site.silentium.rssUrl): titles, dates, lengths and
//      descriptions update on their own as episodes are published. The feed has no Spotify
//      IDs, so they are matched by title from data/silentium-episodes.ts; a new episode with
//      no ID yet still plays, through the whole-show player (the page says so).
//   3. The static list in data/silentium-episodes.ts, if both fail.
// The API only returns metadata; playback goes through the Spotify Embed iframe (brief §7),
// loaded on request (see EpisodePlayer).

const DAY = 60 * 60 * 24;
const HOUR = 60 * 60;

async function getAccessToken(id: string, secret: string): Promise<string> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    next: { revalidate: 3000 }, // tokens last one hour
  });
  if (!res.ok) throw new Error(`Spotify token request failed: ${res.status}`);
  return (await res.json()).access_token;
}

type ApiEpisode = {
  id: string;
  name: string;
  description: string;
  release_date: string;
  duration_ms: number;
};

async function fromSpotifyApi(id: string, secret: string): Promise<Episode[]> {
  const token = await getAccessToken(id, secret);
  const res = await fetch(
    `https://api.spotify.com/v1/shows/${site.silentium.spotifyShowId}/episodes?market=US&limit=50`,
    { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: DAY } },
  );
  if (!res.ok) throw new Error(`Spotify episodes request failed: ${res.status}`);
  const items: ApiEpisode[] = (await res.json()).items.filter(Boolean);

  // The API lists newest first; the page reads as a case archive, oldest first.
  return items.reverse().map((ep) => ({
    id: ep.id,
    title: ep.name,
    description: ep.description,
    date: ep.release_date,
    minutes: Math.round(ep.duration_ms / 60000),
  }));
}

// ── RSS ──────────────────────────────────────────────────────────────────────

const tag = (xml: string, name: string) =>
  xml
    .match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1]
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .trim() ?? "";

const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

/** "00:23:05" or "1385" (seconds) → minutes */
function minutes(duration: string) {
  const parts = duration.split(":").map(Number);
  const seconds = parts.length > 1 ? parts.reduce((acc, n) => acc * 60 + n, 0) : parts[0];
  return Number.isFinite(seconds) ? Math.round(seconds / 60) : 0;
}

async function fromRss(): Promise<Episode[]> {
  const res = await fetch(site.silentium.rssUrl, { next: { revalidate: HOUR } });
  if (!res.ok) throw new Error(`SILENTIUM RSS request failed: ${res.status}`);
  const xml = await res.text();
  const known = new Map(fallbackEpisodes.map((e) => [e.title.toLowerCase(), e]));

  const episodes = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const title = text(tag(item, "title"));
    const match = known.get(title.toLowerCase());
    // The first paragraph is the teaser; after it come the content warning, links and credits
    const teaser = text(tag(item, "description").split(/<p>\s*-{3,}\s*<\/p>|-{6,}/)[0]);
    const date = new Date(tag(item, "pubDate"));
    return {
      id: match?.id ?? null,
      title,
      description: teaser || match?.description || "",
      date: Number.isNaN(date.getTime()) ? (match?.date ?? "") : date.toISOString().slice(0, 10),
      minutes: minutes(tag(item, "itunes:duration")) || match?.minutes || 0,
    };
  });
  if (!episodes.length) throw new Error("SILENTIUM RSS has no episodes");
  // The feed lists newest first; the page reads as a case archive, oldest first.
  return episodes.reverse();
}

export async function getSilentiumEpisodes(): Promise<Episode[]> {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
  if (id && secret) {
    try {
      return await fromSpotifyApi(id, secret);
    } catch (err) {
      console.error(err);
    }
  }
  try {
    return await fromRss();
  } catch (err) {
    console.error(err);
    return fallbackEpisodes;
  }
}
