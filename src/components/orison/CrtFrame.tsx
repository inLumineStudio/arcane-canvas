// The ORISON page is viewed through a 90s beige CRT monitor, the kind the game's machine
// runs on (made by Audeo, the in-game manufacturer): a fixed plastic bezel around the
// viewport, a recessed lip around rounded, vignetted glass with faint scanlines, and a chin
// with the brand, the front-panel buttons and the power button with its LED. The page
// scrolls "inside the screen", and the monitor powers on (line, picture, static) each time
// the page opens. Sizes come from --crt-* in globals.css ([data-crt]).

export function CrtFrame({ label }: { label: string }) {
  return (
    <div aria-hidden="true" className="crt-frame">
      <div className="crt-screen" />
      <div className="crt-boot">
        <div className="crt-boot-noise" />
        <div className="crt-boot-roll" />
        <div className="crt-boot-line" />
      </div>
      <div className="crt-chin">
        <span className="crt-brand">{label}</span>
        <span className="crt-controls">
          <span className="crt-knob" />
          <span className="crt-knob" />
          <span className="crt-knob" />
          <span className="crt-knob" />
          <span className="crt-power" />
          <span className="crt-led" />
        </span>
      </div>
    </div>
  );
}