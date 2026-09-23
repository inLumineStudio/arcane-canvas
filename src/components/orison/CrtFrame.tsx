// The ORISON page is viewed through a big early-2000s CRT monitor: a fixed plastic bezel
// around the viewport, rounded tube corners, vignette and faint scanlines. The page
// scrolls "inside the screen". Sizes come from --crt-* in globals.css ([data-crt]).

export function CrtFrame({ label }: { label: string }) {
  return (
    <div aria-hidden="true" className="crt-frame">
      <div className="crt-screen" />
      <div className="crt-chin">
        <span className="crt-brand">{label}</span>
        <span className="crt-buttons">
          <span />
          <span />
          <span />
          <span className="crt-led" />
        </span>
      </div>
    </div>
  );
}
