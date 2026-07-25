import { type ReactNode } from 'react';

/** Sello circular decorativo con el eslogan de marca en texto curvo. */
export function CuringSeal(): ReactNode {
  return (
    <svg
      viewBox="0 0 240 240"
      className="h-64 w-64 text-cream md:h-80 md:w-80"
      role="img"
      aria-label="Sello El Charcu — sin aditivos, sin atajos"
    >
      <defs>
        <path
          id="seal-text-path"
          d="M 120,120 m -92,0 a 92,92 0 1,1 184,0 a 92,92 0 1,1 -184,0"
          fill="none"
        />
      </defs>

      <circle
        cx="120"
        cy="120"
        r="112"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <circle
        cx="120"
        cy="120"
        r="96"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.9"
      />

      <text
        fill="currentColor"
        className="font-sans"
        fontSize="12"
        letterSpacing="4"
        opacity="0.85"
      >
        <textPath href="#seal-text-path" startOffset="0%">
          SIN ADITIVOS · SIN ATAJOS · CURADO A MANO ·
        </textPath>
      </text>

      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M 96,150 C 96,120 144,120 144,150" opacity="0.9" />
        <line x1="120" y1="92" x2="120" y2="150" />
        <circle cx="120" cy="86" r="6" fill="currentColor" stroke="none" />
      </g>

      <text
        x="120"
        y="172"
        textAnchor="middle"
        fill="currentColor"
        className="font-serif"
        fontSize="15"
        letterSpacing="2"
      >
        EST. 2026
      </text>
    </svg>
  );
}
