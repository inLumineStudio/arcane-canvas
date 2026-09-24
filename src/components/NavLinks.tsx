"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavLink = { href: string; label: string };
type Project = NavLink & { note: string };
type Props = {
  projects: { label: string; items: Project[] };
  links: NavLink[];
  menuLabel: string;
  closeLabel: string;
};

// Mobile first: a "Menu" button opens a full-screen sheet with big, thumb-sized links.
// There the projects are simply listed under a "Projects" label (a dropdown inside a sheet
// is fiddly with a thumb). From 768px up the links sit inline in the bar and "Projects"
// becomes a dropdown: opens on click, closes on Escape, outside click or picking an item.

export function NavLinks({ projects, links, menuLabel, closeLabel }: Props) {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropdown = useRef<HTMLLIElement>(null);
  const dropButton = useRef<HTMLButtonElement>(null);

  // Mobile sheet: lock page scroll and close on Escape while open
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  // Desktop dropdown: close on Escape (focus back to the button) or on a click outside
  useEffect(() => {
    if (!dropOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setDropOpen(false);
      dropButton.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!dropdown.current?.contains(e.target as Node)) setDropOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [dropOpen]);

  const isActive = (href: string) => href === pathname;
  const inProjects = projects.items.some((p) => isActive(p.href));

  const sheetLink = (l: NavLink, size: string) => (
    <Link
      href={l.href}
      aria-current={isActive(l.href) ? "page" : undefined}
      onClick={() => setSheetOpen(false)}
      className={`nav-link block py-1.5 font-medium ${size} ${isActive(l.href) ? "text-accent" : ""}`}
    >
      {l.label}
    </Link>
  );

  return (
    <nav aria-label="Main">
      {/* ── Mobile ─────────────────────────────────────────────────── */}
      <button
        type="button"
        className="nav-link -mr-2 min-h-11 px-2 text-sm md:hidden"
        aria-expanded={sheetOpen}
        aria-controls="mobile-nav"
        onClick={() => setSheetOpen((o) => !o)}
      >
        {sheetOpen ? closeLabel : menuLabel}
      </button>

      {sheetOpen && (
        <div
          id="mobile-nav"
          className="fixed overflow-y-auto bg-bg px-5 pb-10 pt-8 md:hidden"
          // No backdrop-filter on the header: it would trap this fixed sheet inside the bar.
          style={{
            top: "calc(var(--crt-top, 0px) + 3.5rem)",
            left: "var(--crt-side, 0px)",
            right: "var(--crt-side, 0px)",
            bottom: "var(--crt-bottom, 0px)",
          }}
        >
          <ul>
            {links.map((l) => (
              <li key={l.href}>{sheetLink(l, "text-2xl")}</li>
            ))}
          </ul>
          <p className="mt-6 border-t border-line pt-6 text-sm text-muted">{projects.label}</p>
          <ul className="mt-2">
            {projects.items.map((p) => (
              <li key={p.href}>
                {sheetLink(p, "text-4xl")}
                <p className="pb-3 text-sm text-muted">{p.note}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Desktop ────────────────────────────────────────────────── */}
      <ul className="hidden items-center gap-7 md:flex">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`nav-link text-sm transition-colors hover:text-accent ${
                isActive(l.href) ? "text-accent" : "text-fg/75"
              }`}
            >
              {l.label}
            </Link>
          </li>
        ))}

        <li ref={dropdown} className="relative">
          <button
            ref={dropButton}
            type="button"
            aria-expanded={dropOpen}
            aria-controls="projects-menu"
            onClick={() => setDropOpen((o) => !o)}
            className={`nav-link flex items-center gap-1.5 text-sm transition-colors hover:text-accent ${
              inProjects || dropOpen ? "text-accent" : "text-fg/75"
            }`}
          >
            {projects.label}
            <svg
              aria-hidden="true"
              viewBox="0 0 10 6"
              className={`h-1.5 w-2.5 transition-transform ${dropOpen ? "rotate-180" : ""}`}
            >
              <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          {dropOpen && (
            <ul
              id="projects-menu"
              className="absolute right-0 top-full mt-4 w-72 border border-line bg-bg-raised p-1.5 shadow-[0_16px_40px_rgb(0_0_0/0.5)]"
            >
              {projects.items.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    aria-current={isActive(p.href) ? "page" : undefined}
                    onClick={() => setDropOpen(false)}
                    className="group block px-3 py-2.5 transition-colors hover:bg-bg"
                  >
                    <span
                      className={`nav-link block text-sm font-medium group-hover:text-accent ${
                        isActive(p.href) ? "text-accent" : ""
                      }`}
                    >
                      {p.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">{p.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}
