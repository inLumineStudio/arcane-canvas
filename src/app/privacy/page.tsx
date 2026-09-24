import type { Metadata } from "next";
import { site } from "@/config/site";
import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/PageShell";

// Privacy notice, linked from the footer. Plain studio page, one readable column: it has to
// be easy to read on a phone, not designed. The copy lives in en.ts (privacy) and must
// describe what the site really does.

const t = getDictionary();

export const metadata: Metadata = pageMetadata({
  title: t.privacy.metaTitle,
  description: t.privacy.metaDescription,
  path: "/privacy",
});

/** Turns every "{email}" in a paragraph into a link to the contact address */
function withEmail(text: string) {
  return text.split("{email}").map((part, i) => (
    <span key={i}>
      {i > 0 && (
        <a href={`mailto:${site.contactEmail}`} className="link text-fg">
          {site.contactEmail}
        </a>
      )}
      {part}
    </span>
  ));
}

export default function PrivacyPage() {
  const p = t.privacy;

  return (
    <PageShell theme="studio">
      <article className="mx-auto max-w-[68ch] px-5 pb-24 pt-28 md:px-0 md:pb-32 md:pt-36">
        <h1 className="text-[clamp(2.25rem,9vw,4rem)] font-semibold uppercase leading-[0.95] tracking-[-0.03em]">
          {p.title}
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-fg/85">{p.intro}</p>

        {p.sections.map((s) => (
          <section key={s.title} className="mt-12">
            <h2 className="text-xl font-medium md:text-2xl">{s.title}</h2>
            {s.paragraphs.map((para) => (
              <p key={para.slice(0, 32)} className="mt-4 leading-relaxed text-fg/80">
                {withEmail(para)}
              </p>
            ))}
            {s.links.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm">
                {s.links.map((l) => (
                  <li key={l.key}>
                    <a href={site.legal[l.key as keyof typeof site.legal]} target="_blank" rel="noopener noreferrer" className="link text-muted">
                      {l.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className="mt-16 border-t border-line pt-6 text-sm text-muted">{p.updated}</p>
      </article>
    </PageShell>
  );
}
