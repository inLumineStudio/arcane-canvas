// Store CTA that stays on screen on the product pages (brief §4). It uses the page's own
// button style (.btn: bevelled on ORISON, outlined on SILENTIUM).
// Mobile first: a bar along the bottom of the screen with a full-width button (easy to
// reach with a thumb); from 768px up only the button remains, in the bottom-right corner.
// Offsets follow the CRT bezel on the ORISON page (--crt-*), and are 0 elsewhere.
export function StickyCta({ href, label, sub }: { href: string; label: string; sub?: string }) {
  return (
    <div
      className="sticky-cta fixed z-30 border-t border-line bg-bg/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:!left-auto md:mb-6 md:mr-6 md:border-0 md:bg-transparent md:p-0"
      style={{
        bottom: "var(--crt-bottom, 0px)",
        left: "var(--crt-side, 0px)",
        right: "var(--crt-side, 0px)",
      }}
    >
      <a href={href} target="_blank" rel="noopener noreferrer" className="btn w-full md:w-auto">
        {label}
        {sub && <span className="hidden text-[0.8em] opacity-70 md:inline">· {sub}</span>}
      </a>
    </div>
  );
}
