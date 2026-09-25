import { site } from "@/config/site";
import { getDictionary } from "@/content";
import type { Episode } from "@/data/silentium-episodes";

// Schema.org structured data (JSON-LD), one @graph per page. Entities have stable @ids so
// every page can point at the same studio, person, game and podcast instead of repeating
// them: Google joins the graph across pages.
//   Home        Organization (Arcane Canvas) · Person (the owner) · WebSite
//   /about      ProfilePage about the Person
//   /orison     VideoGame + its trailer (VideoObject) · breadcrumbs
//   /silentium  PodcastSeries + every PodcastEpisode · breadcrumbs
//   transcript  Article, part of the podcast · breadcrumbs
// Arcane Canvas is a brand, not a legal entity: the Organization is the brand, founded by
// the Person, and the Person is author of the works.
// Test with https://search.google.com/test/rich-results and https://validator.schema.org

const t = getDictionary();
const abs = (path: string) => `${site.url}${path}`;

export const ID = {
  studio: abs("/#studio"),
  owner: abs("/#owner"),
  website: abs("/#website"),
  game: abs("/orison#game"),
  podcast: abs("/silentium#podcast"),
};

type Node = Record<string, unknown>;

export function graph(...nodes: Node[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Home > … > page, for the breadcrumb trail in search results */
export function breadcrumbs(trail: { name: string; path: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: t.nav.home, path: "/" }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function studio(): Node {
  return {
    "@type": "Organization",
    "@id": ID.studio,
    name: t.meta.siteName,
    url: abs("/"),
    logo: { "@type": "ImageObject", url: abs("/icons/icon-512.png"), width: 512, height: 512 },
    description: t.meta.homeDescription,
    email: site.contactEmail,
    founder: { "@id": ID.owner },
    sameAs: [...site.socials.studio, ...site.socials.orison].map((s) => s.href),
  };
}

export function owner(): Node {
  return {
    "@type": "Person",
    "@id": ID.owner,
    name: site.owner,
    url: abs("/about"),
    brand: { "@id": ID.studio },
    sameAs: site.socials.studio.map((s) => s.href),
  };
}

export function website(): Node {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    name: t.meta.siteName,
    url: abs("/"),
    inLanguage: "en",
    publisher: { "@id": ID.studio },
  };
}

export function aboutPage(): Node {
  return {
    "@type": "ProfilePage",
    url: abs("/about"),
    name: t.meta.aboutTitle,
    isPartOf: { "@id": ID.website },
    mainEntity: { "@id": ID.owner },
  };
}

export function game(): Node {
  const o = site.orison;
  return {
    "@type": "VideoGame",
    "@id": ID.game,
    name: "ORISON",
    url: abs("/orison"),
    description: t.meta.orisonDescription,
    image: abs("/og/orison.jpg"),
    applicationCategory: "Game",
    genre: t.home.products.orison.kind,
    gamePlatform: "PC",
    inLanguage: [...o.languages],
    author: { "@id": ID.owner },
    publisher: { "@id": ID.studio },
    sameAs: [o.steamUrl],
    trailer: {
      "@type": "VideoObject",
      name: t.orison.trailerTitle,
      description: t.meta.orisonDescription,
      thumbnailUrl: [abs("/media/orison/trailer-poster.webp"), abs("/og/orison.jpg")],
      uploadDate: o.trailer.uploadDate,
      duration: o.trailer.duration,
      embedUrl: `https://www.youtube-nocookie.com/embed/${o.youtubeTrailerId}`,
      url: `https://www.youtube.com/watch?v=${o.youtubeTrailerId}`,
      publisher: { "@id": ID.studio },
    },
  };
}

export function podcast(episodes: Episode[]): Node {
  const s = site.silentium;
  return {
    "@type": "PodcastSeries",
    "@id": ID.podcast,
    name: "SILENTIUM",
    url: abs("/silentium"),
    description: t.meta.silentiumDescription,
    image: abs("/media/silentium/cover.webp"),
    genre: t.home.products.silentium.kind,
    inLanguage: "en",
    webFeed: s.rssUrl,
    author: { "@id": ID.owner },
    publisher: { "@id": ID.studio },
    sameAs: [s.spotifyUrl, s.appleUrl],
    hasPart: episodes.map((e) => ({
      "@type": "PodcastEpisode",
      name: e.title,
      description: e.description,
      datePublished: e.date,
      timeRequired: `PT${e.minutes}M`,
      url: e.id ? s.episodeUrl(e.id) : s.spotifyUrl,
      partOfSeries: { "@id": ID.podcast },
    })),
  };
}

export function transcript(tr: { slug: string; title: string; summary: string }): Node {
  return {
    "@type": "Article",
    headline: tr.title,
    description: tr.summary || t.silentium.transcripts.lexiconNote,
    url: abs(`/silentium/transcripts/${tr.slug}`),
    mainEntityOfPage: abs(`/silentium/transcripts/${tr.slug}`),
    image: abs("/og/silentium.jpg"),
    inLanguage: "en",
    isPartOf: { "@id": ID.podcast },
    author: { "@id": ID.owner },
    publisher: { "@id": ID.studio },
  };
}
