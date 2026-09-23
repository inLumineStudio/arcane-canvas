"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavLink = { href: string; label: string };

// Mobile first: a "Menu" button opens a full-screen sheet with big, thumb-sized links.
// From 768px up the links sit inline in the bar.
export function NavLinks({ links, menuLabel, closeLabel }: { links: NavLink[]; menuLabel: string; closeLabel: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock page scroll and close on Escape while the sheet is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => href === pathname;

  return (
    <nav aria-label="Main">
      <button
        type="button"
        className="nav-link -mr-2 min-h-11 px-2 text-sm md:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? closeLabel : menuLabel}
      </button>

      {open && (
        <ul
          id="mobile-nav"
          className="fixed flex flex-col gap-2 bg-bg px-5 pt-8 md:hidden"
          // No backdrop-filter on the header: it would trap this fixed sheet inside the bar.
          style={{
            top: "calc(var(--crt-top, 0px) + 3.5rem)",
            left: "var(--crt-side, 0px)",
            right: "var(--crt-side, 0px)",
            bottom: "var(--crt-bottom, 0px)",
          }}
        >
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`nav-link block py-2 text-4xl font-medium ${isActive(l.href) ? "text-accent" : ""}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

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
      </ul>
    </nav>
  );
}
