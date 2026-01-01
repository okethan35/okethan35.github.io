export function FigmaNoiseOverlay() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 w-full h-full -z-10"
      aria-hidden="true"
    >
      <defs>
        {/* Paste your filter0_n_16_21 from the Figma export here */}
        <filter
          id="figmaNoise"
          x="0"
          y="0"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="2.5 2.5"
            stitchTiles="stitch"
            numOctaves="3"
            result="noise"
          />
          {/* simple alpha control; if you want pixel-perfect, paste the
               full <feComponentTransfer> stack from your export */}
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.15" />
          </feComponentTransfer>
        </filter>
      </defs>

      {/* this sits on top of your red and gives that grain */}
      <rect
        width="100%"
        height="100%"
        filter="url(#figmaNoise)"
        opacity="0.35"
      />
    </svg>
  );
}
