// Faint stars, like the specks inside the logo's galaxy ring. Seeded so server and
// client markup match; a few of them twinkle (CSS, off under reduced motion).

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export function Starfield({ count = 90, seed = 21, className = "" }) {
  const rand = seeded(seed);
  const stars = Array.from({ length: count }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    r: rand() < 0.9 ? 0.12 + rand() * 0.12 : 0.3,
    o: 0.25 + rand() * 0.6,
    twinkle: rand() < 0.2,
    delay: rand() * 6,
  }));

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#e4eef9"
          opacity={s.o}
          className={s.twinkle ? "twinkle" : undefined}
          style={s.twinkle ? { animationDelay: `${s.delay}s` } : undefined}
        />
      ))}
    </svg>
  );
}
