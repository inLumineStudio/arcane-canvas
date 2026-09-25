import Link from "next/link";
import { getDictionary } from "@/content";
import { NavLinks } from "./NavLinks";

// A plain solid bar (deltarune.com keeps its nav this simple). The logo is the way home.
export function SiteHeader() {
  const t = getDictionary();
  const projects = {
    label: t.nav.projects,
    items: [
      { href: "/orison", label: t.nav.orison, note: t.home.products.orison.kind },
      { href: "/silentium", label: t.nav.silentium, note: t.home.products.silentium.kind },
    ],
  };
  const links = [
    { href: "/about", label: t.nav.about },
    { href: "/#contact", label: t.nav.contact },
  ];

  return (
    <header className="site-header fixed z-40 border-b border-line/60 bg-bg/95">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
      >
        {t.nav.skipToContent}
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${t.meta.siteName}, ${t.nav.home}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- a 4 KB raster made for this size, nothing to optimise */}
          <img src="/media/brand/logo-96.webp" alt="" width={32} height={25} className="h-6 w-auto" />
          <span className="text-sm font-medium">{t.meta.siteName}</span>
        </Link>
        <NavLinks projects={projects} links={links} menuLabel={t.nav.menu} closeLabel={t.nav.close} />
      </div>
    </header>
  );
}
