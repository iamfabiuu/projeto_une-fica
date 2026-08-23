import { useMemo } from "react";

type Props = {
  orientation?: "vertical" | "horizontal";
  /** nº de dentes ao longo do eixo maior */
  teeth?: number;
  /** profundidade do dente (0–100 no viewBox) */
  depth?: number;
  /** distância entre as duas faixas */
  gap?: number;
  /** espelha o lado de onde os dentes crescem */
  flip?: boolean;
  colors?: [string, string];
  /** segundos de deslize contínuo. 0 = parado */
  scroll?: number;
  className?: string;
};

/** Faixa zigue-zague dupla (azul + laranja) — assinatura visual da marca. */
export function ZigZagDivider({
  orientation = "vertical",
  teeth = 14,
  depth = 45,
  gap = 30,
  flip = false,
  colors = ["var(--une-orange)", "var(--une-blue)"],
  scroll = 0,
  className = "",
}: Props) {
  const vertical = orientation === "vertical";

  const paths = useMemo(() => {
    const step = 100 / teeth;

    const zig = (offset: number) => {
      let pts = "";
      // -1 e teeth+1 evitam dente cortado nas pontas
      for (let i = -1; i <= teeth + 1; i++) {
        const along = i * step;
        const across = i % 2 === 0 ? offset : offset + depth;
        pts += vertical ? `${across},${along} ` : `${along},${across} `;
      }
      // fecha a área em direção à borda oposta
      const tail = vertical
        ? `${flip ? -20 : 120},${100 + step} ${flip ? -20 : 120},${-step}`
        : `${100 + step},${flip ? -20 : 120} ${-step},${flip ? -20 : 120}`;
      return `${pts}${tail}`;
    };

    return [zig(0), zig(-gap)];
  }, [teeth, depth, gap, vertical, flip]);

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none block h-full w-full ${className}`}
      style={
        flip ? { transform: vertical ? "scaleX(-1)" : "scaleY(-1)" } : undefined
      }
    >
      <g
        style={
          scroll
            ? {
                animation: `zz-${vertical ? "y" : "x"} ${scroll}s linear infinite`,
              }
            : undefined
        }
      >
        {paths.map((d, i) => (
          <polygon key={i} points={d} fill={colors[i]} />
        ))}
      </g>

      {scroll > 0 && (
        <style>{`
          @keyframes zz-y { to { transform: translateY(${200 / teeth}px) } }
          @keyframes zz-x { to { transform: translateX(${200 / teeth}px) } }
          @media (prefers-reduced-motion: reduce) { g { animation: none !important } }
        `}</style>
      )}
    </svg>
  );
}
