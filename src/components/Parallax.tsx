"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/gaze";

// Multi-layer scroll parallax. Any descendant with data-parallax="<speed>" is shifted
// vertically by (distance of the scene from the viewport centre) × speed.
// Positive speeds lag behind the scroll (far layers), negative ones rush ahead (near layers).
// One rAF-throttled scroll listener per scene; nothing runs while the scene is off-screen.
//
// Mobile first: on phones every layer moves at half speed (shorter screens, smaller
// offsets, less GPU work). Layers marked data-parallax-desktop only move from 768px up,
// for layouts that stack on mobile (e.g. staggered columns that would overlap).

const DESKTOP = "(min-width: 768px)";

export function Parallax({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = ref.current!;
    if (prefersReducedMotion()) return;
    const layers = Array.from(scene.querySelectorAll<HTMLElement>("[data-parallax]")).map((el) => ({
      el,
      speed: parseFloat(el.dataset.parallax ?? "0"),
      desktopOnly: el.hasAttribute("data-parallax-desktop"),
    }));
    const desktop = window.matchMedia(DESKTOP);

    let raf = 0;
    let visible = false;

    const update = () => {
      raf = 0;
      const r = scene.getBoundingClientRect();
      const offset = r.top + r.height / 2 - window.innerHeight / 2;
      const factor = desktop.matches ? 1 : 0.5;
      for (const l of layers) {
        const y = l.desktopOnly && !desktop.matches ? 0 : -offset * l.speed * factor;
        l.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(scene);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
