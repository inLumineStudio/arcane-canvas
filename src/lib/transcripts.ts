import "server-only";
import { site } from "@/config/site";

// SILENTIUM transcripts, read from the client's archive repo (a static GitHub Pages site,
// see site.silentium.transcripts). Nothing is copied into this repo: the pages fetch the raw
// HTML from GitHub and are regenerated at most once an hour (ISR), so publishing a new
// transcript there is all it takes for it to show up here.
//
//   index.html     → the list of cases (title, case/date/status line, summary), by season
//   episodeN.html  → one transcript; only its <main> is used
//   lexicon.html   → the glossary of the Tongue, shown like a transcript
//
// The markup is cut down to an allowlist of tags and of the archive's own classes, which
// are restyled in globals.css (.transcript). Inline styles are dropped, except the two the
// archive uses for meaning (the red "redacted" status and the translation summary box),
// which become classes. If GitHub cannot be reached the list is empty and the SILENTIUM
// page links to the archive site instead.

const HOUR = 60 * 60;
const { repo, ref } = site.silentium.transcripts;
const SLUG = /^[a-z0-9_-]+$/;
export const LEXICON = "lexicon";

export type TranscriptEntry = {
  slug: string;
  title: string;
  /** "Case: TM-2024-047", "Date: October 2024", "Status: Translated", as plain text */
  meta: string[];
  summary: string;
};

export type TranscriptSeason = { title: string; entries: TranscriptEntry[] };

export type Transcript = {
  slug: string;
  title: string;
  /** The case summary from the archive's index ("" for the Lexicon), for link previews */
  summary: string;
  /** Sanitised HTML of the transcript body */
  html: string;
  prev: TranscriptEntry | null;
  next: TranscriptEntry | null;
};

async function fetchFile(file: string): Promise<string | null> {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${repo}/${ref}/${file}`, {
      next: { revalidate: HOUR },
    });
    if (!res.ok) throw new Error(`Transcript archive: ${file} returned ${res.status}`);
    return await res.text();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ── Text helpers ─────────────────────────────────────────────────────────────

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  mdash: "—", ndash: "–", hellip: "…", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
};

function decode(s: string) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

/** Tags stripped, entities decoded, whitespace collapsed: for text rendered by React */
function toText(html: string) {
  return decode(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

// ── Index ────────────────────────────────────────────────────────────────────

export async function getTranscriptSeasons(): Promise<TranscriptSeason[]> {
  const html = await fetchFile("index.html");
  if (!html) return [];
  const section = html.match(/<section class="episodes">([\s\S]*?)<\/section>/)?.[1] ?? "";

  // Season headings and episode blocks, in document order
  const seasons: TranscriptSeason[] = [];
  const token = /<h2[^>]*>([\s\S]*?)<\/h2>|<div class="episode">([\s\S]*?)<\/div>/g;
  for (const m of section.matchAll(token)) {
    if (m[1] !== undefined) {
      seasons.push({ title: toText(m[1]), entries: [] });
      continue;
    }
    const block = m[2];
    const link = block.match(/<a[^>]*href="([^"]+)\.html"[^>]*>([\s\S]*?)<\/a>/);
    if (!link || !SLUG.test(link[1])) continue;
    const meta = toText(block.match(/<p class="episode-meta">([\s\S]*?)<\/p>/)?.[1] ?? "");
    if (!seasons.length) seasons.push({ title: "", entries: [] });
    seasons.at(-1)!.entries.push({
      slug: link[1],
      title: toText(link[2]),
      meta: meta ? meta.split("|").map((s) => s.trim()).filter(Boolean) : [],
      summary: toText(block.match(/<p class="episode-summary">([\s\S]*?)<\/p>/)?.[1] ?? ""),
    });
  }
  return seasons.filter((s) => s.entries.length);
}

// ── Transcript ───────────────────────────────────────────────────────────────

const TAGS = new Set([
  "p", "br", "hr", "em", "i", "strong", "b", "span", "div", "section", "h2", "h3", "h4",
  "ul", "ol", "li", "blockquote", "a", "sup", "sub",
]);
const CLASSES = new Set([
  "speaker", "sound-effect", "tongue", "note", "warning", "intro",
  "transcript-header", "case-info", "transcript-body",
  "lexicon-entry", "lexicon-word", "lexicon-pronunciation", "lexicon-tier",
]);

function rewriteHref(href: string): { href: string; external: boolean } | null {
  const local = href.match(/^([a-z0-9_-]+)\.html(#[\w-]+)?$/i);
  if (local) {
    if (local[1] === "index") return { href: "/silentium#transcripts", external: false };
    if (local[1] === "about") return null;
    return { href: `/silentium/transcripts/${local[1].toLowerCase()}${local[2] ?? ""}`, external: false };
  }
  if (/^https?:\/\/[^\s"'<>]+$/.test(href)) return { href, external: true };
  return null;
}

function sanitize(html: string) {
  let out = html
    .replace(/<!--[\s\S]*?-->/g, "")
    // Elements whose content must go too (the tag pass below only drops the tags)
    .replace(/<(script|style|iframe|object|form|template|svg|audio|video|noscript)\b[\s\S]*?<\/\1\s*>/gi, "")
    // The archive's own "Back to Episodes" line: this site has its own navigation
    .replace(/<p[^>]*>\s*<a[^>]*href="index\.html"[^>]*>[\s\S]*?<\/a>\s*<\/p>/gi, "");

  // Links to pages we do not carry lose their <a> but keep their text: track which ones
  const dropped: boolean[] = [];
  out = out.replace(/<(\/?)([a-z][a-z0-9]*)\b([^>]*)>/gi, (_, close: string, name: string, attrs: string) => {
    const tag = name.toLowerCase();
    if (!TAGS.has(tag)) return "";
    if (close) {
      if (tag === "a") return dropped.pop() ? "" : "</a>";
      return `</${tag}>`;
    }
    if (tag === "br" || tag === "hr") return `<${tag}>`;

    const classes = (attrs.match(/class="([^"]*)"/)?.[1] ?? "").split(/\s+/).filter((c) => CLASSES.has(c));
    const style = attrs.match(/style="([^"]*)"/)?.[1] ?? "";
    if (tag === "span" && /color/.test(style)) classes.push("redacted");
    if (tag === "div" && /background/.test(style)) classes.push("case-box");
    const cls = classes.length ? ` class="${classes.join(" ")}"` : "";

    if (tag === "a") {
      const link = rewriteHref(attrs.match(/href="([^"]*)"/)?.[1] ?? "");
      dropped.push(!link);
      if (!link) return "";
      return link.external
        ? `<a href="${link.href}" target="_blank" rel="noopener noreferrer"${cls}>`
        : `<a href="${link.href}"${cls}>`;
    }
    return `<${tag}${cls}>`;
  });
  // Empty paragraphs are the archive's pause markers between beats; one is enough
  return out.replace(/(<p[^>]*>\s*<\/p>\s*)+/g, '<p class="beat"></p>').trim();
}

export async function getTranscript(slug: string): Promise<Transcript | null> {
  if (!SLUG.test(slug)) return null;
  const seasons = await getTranscriptSeasons();
  const entries = seasons.flatMap((s) => s.entries);
  const i = entries.findIndex((e) => e.slug === slug);
  if (i < 0 && slug !== LEXICON) return null;

  const page = await fetchFile(`${slug}.html`);
  const main = page?.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1];
  if (!main) return null;

  // The first heading is the page title; it becomes our <h1>
  const heading = main.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  const title = heading ? toText(heading[1]) : toText(page!.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? slug);
  const body = heading ? main.replace(heading[0], "") : main;

  return {
    slug,
    title,
    summary: i >= 0 ? entries[i].summary : "",
    html: sanitize(body),
    prev: i > 0 ? entries[i - 1] : null,
    next: i >= 0 && i < entries.length - 1 ? entries[i + 1] : null,
  };
}
