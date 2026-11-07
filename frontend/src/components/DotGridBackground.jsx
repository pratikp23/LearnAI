import React, { useId } from 'react';

/**
 * Reusable decorative dot-grid background component.
 * Faithfully implements the subtle SVG dotted-grid pattern with:
 * - 20px evenly spaced dots with 1px radius
 * - Subtle purple/lavender tint matching the Zepto/Swiggy palette
 * - Smooth vertical fade from top to bottom
 * - Absolutely positioned with pointer-events-none and z-0
 */
function DotGridBackground({
  className = "text-[#7C3AED]/18",
  spacing = 20,
  dotRadius = 1,
  mask = "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.45) 45%, transparent 85%)",
  style = {}
}) {
  const reactId = useId();
  // Sanitize id for SVG url reference
  const patternId = `dot-grid-${reactId.replace(/:/g, '')}`;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full select-none z-0 overflow-hidden ${className}`}
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
          <circle cx={1} cy={1} r={dotRadius} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export default DotGridBackground;
