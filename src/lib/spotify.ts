import "server-only";
import { site } from "@/config/site";
import { fallbackEpisodes, type Episode } from "@/data/silentium-episodes";

// The Spotify Web API only returns metadata; playback goes through the Spotify Embed iframe,
// which works without login (brief §7). Credentials come from a Spotify app (Client Credentials flow):
//   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET
// Without them, or if the API fails, the static list in data/silentium-episodes.ts is used.

const DAY = 60 * 60 * 24;

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

export async function getSilentiumEpisodes(): Promise<Episode[]> {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
  if (!id || !secret) return fallbackEpisodes;

  try {
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
  } catch (err) {
    console.error(err);
    return fallbackEpisodes;
  }
}
