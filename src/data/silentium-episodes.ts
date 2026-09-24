export type Episode = {
  /** Spotify episode ID. null when it isn't known yet: the player falls back to the whole show. */
  id: string | null;
  title: string;
  description: string;
  /** ISO date */
  date: string;
  minutes: number;
};

// Snapshot of the public show listing (Spotify / Apple Podcasts, September 2026). Episode IDs
// come from the show's Spotify for Creators page (creators.spotify.com/pod/profile/arcane-canvas),
// which lists every episode; the logged-out open.spotify.com page only shows the first six.
// A new episode needs its ID added here, or the player falls back to the whole show.
// Only used when the Spotify Web API credentials are missing or the API is unreachable.
export const fallbackEpisodes: Episode[] = [
  {
    id: "52Va4JwIcM5aNEu07Q8R9v",
    title: "Episode 1: Threshold-Witness",
    description: "A livestream goes dark with 10,247 viewers watching. Only 17 of them heard the language.",
    date: "2025-11-24",
    minutes: 20,
  },
  {
    id: "46w1ldMsHDYfPZP4szMYPY",
    title: "Episode 2: Tributaries",
    description: "A woman watched a river for 21 days and gained 12kg of pure water.",
    date: "2025-12-12",
    minutes: 26,
  },
  {
    id: "7wmdIByF7BY6V3gy4YpAL4",
    title: "Episode 3: The Crown",
    description: "In an old convent, a 12-year-old girl revered as a saint wears a halo of light.",
    date: "2026-01-12",
    minutes: 27,
  },
  {
    id: "6zs6KtQvrKqDEWBtITxW6F",
    title: "Episode 4: Substrate",
    description: "A man found completely covered in white fungal growth. Still conscious. Still alive.",
    date: "2026-02-14",
    minutes: 35,
  },
  {
    id: "6QH5BhwDiZaeeJixAuElJU",
    title: "Episode 5: The First Word",
    description: "A Roman soldier recalls what he heard on Golgotha in 33 AD.",
    date: "2026-03-12",
    minutes: 27,
  },
  {
    id: "2evMy919X9s1X4SpgvtQcJ",
    title: "Episode 5.5: Bellows",
    description: "An organist dies at the keys during Vespers in a Prague cathedral.",
    date: "2026-04-12",
    minutes: 16,
  },
  {
    id: "0Cf7sxXPUMw2NTgVjrznnU",
    title: "Episode 6: What Grows Unseen",
    description: "Father Tommaso returns from a meeting with the other members of the Custodia.",
    date: "2026-05-12",
    minutes: 20,
  },
  {
    id: "5hWKzoAruSJ299YUgkmGQ0",
    title: "Episode 7: Transaction",
    description: "A man bears the scars of more than one crucifixion.",
    date: "2026-06-24",
    minutes: 30,
  },
  {
    id: "1cnArFL8gSi6Pykv2g3TqZ",
    title: "Episode 8: Delivery",
    description: "[ERROR] [ERROR] [ERROR] God [ERROR] [ERROR] [ERROR]",
    date: "2026-07-24",
    minutes: 23,
  },
];
