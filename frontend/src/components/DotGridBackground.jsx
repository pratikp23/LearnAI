import React, { useId } from 'react';

/**
 * Reusable decorative dot-grid background component.
 * Features:
 * - Crisp, clearly visible dots (default 2px radius / 4px diameter)
 * - 24px clean grid spacing
 * - Rich vibrant purple/lavender tint matching the theme (text-[#7C3AED]/45)
 * - Smooth fade-out mask towards the bottom
 * - Absolutely positioned with pointer-events-none and z-0
 */
function DotGridBackground({
  className = "text-[#7C3AED]/45",
  spacing = 24,
  dotRadius = 2,
  mask = "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 55%, rgba(255,255,255,0.25) 85%, transparent 100%)",
  style = {}
}) {
  const reactId = useId();
  // Sanitize id for SVG url reference
  const patternId = `dot-grid-${reactId.replace(/:/g, '')}`;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full select-none z-0 overflow-hidden ${className}`}
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        ...style
      }}
    >
      <defs>
        <pattern
          id={patternId}
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={spacing / 2} cy={spacing / 2} r={dotRadius} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export default DotGridBackground;
