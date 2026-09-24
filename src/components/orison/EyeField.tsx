import { PixelEye } from "./PixelEye";

// A few pixel eyes scattered around an ORISON section, never over its content.
// Mobile first: every eye peeks half-hidden from the edge of the screen, as if watching from
// behind the glass (the side gutters on phones are too narrow for a whole eye). In the 72rem
// sections (`gutter`), from 1360px the eyes step out, whole, into the empty space at the sides.
// The section must be position: relative; the field clips whatever pokes out, so the peeking
// eyes never cause horizontal scroll. In gutter mode the field widens past the (narrow)
// section to the whole screen, since the gutters are outside the section box.

type Spot = {
  /** Distance from the top of the section, e.g. "20%" */
  top: string;
  side: "left" | "right";
  size: number;
  opacity?: number;
};

export function EyeField({ spots, gutter = false }: { spots: Spot[]; gutter?: boolean }) {
  return (
    <div aria-hidden="true" data-gutter={gutter || undefined} className="eye-field pointer-events-none absolute inset-0 overflow-hidden">
      {spots.map((s, i) => (
        <span
          key={i}
          className="eye-spot"
          data-side={s.side}
          style={{ top: s.top, opacity: s.opacity }}
        >
          <PixelEye size={s.size} />
        </span>
      ))}
    </div>
  );
}
