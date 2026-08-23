import { useMemo, type ReactNode } from "react";

type Layer = { outer: number; inner: number; fill: string; offset?: number };

type Props = {
  size?: number;
  points?: number;
  children?: ReactNode;
  className?: string;
  /** graus/volta do serrilhado externo. 0 = parado */
  spin?: number;
  layers?: Layer[];
  label?: string;
};

const DEFAULT_LAYERS: Layer[] = [
  { outer: 50, inner: 43, fill: "var(--une-orange)" },
  { outer: 43, inner: 37, fill: "var(--une-blue)", offset: 0.5 },
  { outer: 37, inner: 31, fill: "var(--night)" },
];

/** Gera os pontos do polígono serrilhado. `offset` desloca em meio-dente. */
const ring = (points: number, outer: number, inner: number, offset = 0) => {
  const step = Math.PI / points;
  const base = -Math.PI / 2 + step * offset;
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = base + step * i;
    d += `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)} `;
  }
  return d.trim();
};

/** Selo serrilhado multicamadas: laranja → azul → night. */
export function StarBadge({
  size = 160,
  points = 24,
  children,
  className = "",
  spin = 0,
  layers = DEFAULT_LAYERS,
  label,
}: Props) {
  const rings = useMemo(
    () =>
      layers.map((l) => ({
        ...l,
        d: ring(points, l.outer, l.inner, l.offset),
      })),
    [layers, points],
  );

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full overflow-visible drop-shadow-[0_10px_25px_rgba(0,0,0,0.18)]"
        aria-hidden
      >
        {rings.map((r, i) => (
          <polygon
            key={i}
            points={r.d}
            fill={r.fill}
            style={
              i === 0 && spin
                ? {
                    transformOrigin: "50% 50%",
                    animation: `sb-spin ${spin}s linear infinite`,
                  }
                : undefined
            }
          />
        ))}
      </svg>

      <div className="absolute inset-0 grid place-items-center p-[26%] text-center leading-tight">
        {children}
      </div>

      {spin > 0 && (
        <style>{`
          @keyframes sb-spin { to { transform: rotate(360deg) } }
          @media (prefers-reduced-motion: reduce) {
            svg polygon { animation: none !important }
          }
        `}</style>
      )}
    </div>
  );
}
