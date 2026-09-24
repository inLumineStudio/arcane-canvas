import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { getDictionary } from "@/content";
import { getTranscript, getTranscriptSeasons, LEXICON } from "@/lib/transcripts";
import { PageShell } from "@/components/PageShell";
import { StickyCta } from "@/components/StickyCta";

// One SILENTIUM transcript (or the Lexicon), read from the client's archive repo.
// Built for reading on a phone first: one column of ~65 characters, generous line height,
// the case file as a short credits-style list (label and value on one row), and previous /
// next case as full-width tap targets at the end, side by side from 768px.

const t = getDictionary();

// Refetched from GitHub at most once an hour; new episodes render on first request.
export const revalidate = 3600;

export async function generateStaticParams() {
  const seasons = await getTranscriptSeasons();
  return [...seasons.flatMap((s) => s.entries.map((e) => ({ slug: e.slug }))), { slug: LEXICON }];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const transcript = await getTranscript((await params).slug);
  if (!transcript) return {};
  return {
    title: `${transcript.title} - ${t.silentium.transcripts.metaTitle}`,
    openGraph: { images: ["/media/silentium/cover.webp"] },
  };
}

export default async function TranscriptPage({ params }: Props) {
  const transcript = await getTranscript((await params).slug);
  if (!transcript) notFound();
  const tr = t.silentium.transcripts;
  const { prev, next } = transcript;

  return (
    <PageShell theme="silentium">
      <article className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-[var(--brick-deep)] to-transparent" />
        <div className="grain absolute inset-x-0 top-0 -z-10 h-80 [mask-image:linear-gradient(black,transparent)]" />

        <div className="mx-auto max-w-[68ch] px-5 pb-24 pt-24 md:px-0 md:pb-32 md:pt-32">
          <Link href="/silentium#transcripts" className="link inline-flex min-h-11 items-center text-sm text-muted">
            ← {tr.back}
          </Link>
          <h1 className="mt-4 text-3xl font-medium leading-tight md:text-5xl">{transcript.title}</h1>

          {/* Trusted source (the client's own repo), and cut to an allowlist in lib/transcripts */}
          <div className="transcript mt-10 md:mt-14" dangerouslySetInnerHTML={{ __html: transcript.html }} />

          <p className="mt-16 border-t border-line pt-6 text-sm text-muted">{tr.credit}</p>

          {(prev || next) && (
            <nav aria-label={tr.back} className="mt-10 grid gap-3 md:grid-cols-2">
              {prev && (
                <Link href={`/silentium/transcripts/${prev.slug}`} className="transcript-step">
                  <span className="text-sm text-muted">← {tr.prev}</span>
                  <span>{prev.title}</span>
                </Link>
              )}
              {next && (
                <Link href={`/silentium/transcripts/${next.slug}`} className="transcript-step md:col-start-2 md:text-right">
                  <span className="text-sm text-muted">{tr.next} →</span>
                  <span>{next.title}</span>
                </Link>
              )}
            </nav>
          )}
        </div>
      </article>

      <StickyCta href={site.silentium.spotifyUrl} label={t.buttons.listen} />
    </PageShell>
  );
}
