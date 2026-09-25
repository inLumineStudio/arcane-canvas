import type { Metadata } from "next";
import { getDictionary } from "@/content";
import { PageShell } from "@/components/PageShell";
import { Watcher } from "@/components/orison/Watcher";

// The reward for the monitor-button sequence (1 1 4 2 3 1, see CrtFrame): what was watching
// through the machine. Still inside the CRT (the power-on plays again as you arrive), but
// with no site header or footer, so nothing familiar is left on screen; the only way out is
// the "Close your eyes" link. A secret: noindex, and not in the sitemap.

const t = getDictionary();

export const metadata: Metadata = {
  title: t.orison.watcher.metaTitle,
  robots: { index: false, follow: false },
};

export default function WatcherPage() {
  const w = t.orison.watcher;
  return (
    <PageShell theme="orison" crt={t.orison.monitorLabel} bare>
      <Watcher lines={w.lines} exit={w.exit} />
    </PageShell>
  );
}
