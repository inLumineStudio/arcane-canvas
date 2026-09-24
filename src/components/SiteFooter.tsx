import Link from "next/link";
import { site } from "@/config/site";
import { getDictionary } from "@/content";

export function SiteFooter() {
  const t = getDictionary();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-sm text-muted md:flex-row md:items-end md:justify-between md:px-8">
        <div className="space-y-1">
          <p className="text-fg">
            © {new Date().getFullYear()} {t.footer.owner}. {t.footer.rights}
          </p>
          <p>{t.footer.note}</p>
          <p>
            <a href={`mailto:${site.contactEmail}`} className="underline-offset-4 hover:text-accent hover:underline">
              {site.contactEmail}
            </a>
            {" · "}
            {t.footer.press}:{" "}
            <a href={`mailto:${site.pressEmail}`} className="underline-offset-4 hover:text-accent hover:underline">
              {site.pressEmail}
            </a>
          </p>
        </div>
        <div className="space-y-3 md:text-right">
          {/* Socials grouped by owner: the ORISON accounts are not the studio's. On phones
              each link is a 44px tap target; from 768px they sit on compact lines. */}
          <div aria-label={t.footer.follow} className="space-y-1 md:space-y-2">
            {(
              [
                [t.footer.orison, site.socials.orison],
                [t.footer.studio, site.socials.studio],
              ] as const
            ).map(([group, links]) => (
              <div key={group} className="flex flex-wrap items-center gap-x-5 md:justify-end">
                <span className="text-fg">{group}</span>
                <ul className="flex flex-wrap gap-x-5">
                  {links.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center hover:text-accent md:min-h-0"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p>
            <Link href="/privacy" className="underline-offset-4 hover:text-accent hover:underline">
              {t.footer.privacy}
            </Link>
            {" · "}
            {t.footer.builtBy}{" "}
            <a
              href={site.builtBy.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:text-accent hover:underline"
            >
              {site.builtBy.label}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
