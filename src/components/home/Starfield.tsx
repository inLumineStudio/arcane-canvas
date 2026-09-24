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

// The same sky for the rest of the Home page, behind the intro, the gaps between the product
// bands and the contact section. A 0–100 viewBox stretched over a tall page would scale the
// stars with the section (huge on a 5000px column, cropped away on a phone), so here the
// stars are sized in pixels, in tiles repeated as a CSS background: same size and density on
// every screen, drawn once by the browser, no JS. Two tiles of coprime-ish sizes overlap so
// the repeat does not read as a grid; a third, sparse one breathes slowly (the "twinkle").

function tile(size: number, count: number, seed: number) {
  const rand = seeded(seed);
  const dots = Array.from({ length: count }, () => {
    const r = rand() < 0.9 ? 0.7 + rand() * 0.7 : 1.8;
    return `<circle cx="${(rand() * size).toFixed(1)}" cy="${(rand() * size).toFixed(1)}" r="${r.toFixed(2)}" fill-opacity="${(0.25 + rand() * 0.6).toFixed(2)}"/>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><g fill="#e4eef9">${dots}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const STATIC_SKY = [tile(420, 13, 7), tile(610, 17, 13)].join(", ");
const TWINKLE_SKY = tile(530, 6, 29);

export function StarBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0" style={{ backgroundImage: STATIC_SKY }} />
      <div className="twinkle absolute inset-0" style={{ backgroundImage: TWINKLE_SKY, animationDuration: "7s" }} />
    </div>
  );
}
