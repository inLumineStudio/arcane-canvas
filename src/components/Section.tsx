import type { ReactNode } from "react";

export function Section({
  id,
  title,
  children,
  className = "",
}: {
  id?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative mx-auto max-w-6xl scroll-mt-20 px-5 py-20 md:px-8 md:py-28 ${className}`}>
      {title && <h2 className="mb-10 text-2xl font-medium md:mb-14 md:text-4xl">{title}</h2>}
      {children}
    </section>
  );
}
