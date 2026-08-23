type Corner = "tl" | "tr" | "bl" | "br";

type Props = {
  corner?: Corner;
  /** classes de tamanho (default h-24 w-40) */
  size?: string;
  color?: string;
  /** segunda camada deslocada, cria profundidade */
  shadowColor?: string;
  /** entra deslizando ao montar */
  animate?: boolean;
  className?: string;
};

/** silhueta base, ancorada no canto superior-esquerdo */
const SHAPE = "0,0 100,0 100,22 72,40 78,66 46,60 30,86 0,72";

const POS: Record<Corner, { cls: string; flip: string; hue: string }> = {
  tl: { cls: "left-0 top-0", flip: "none", hue: "var(--une-blue)" },
  tr: { cls: "right-0 top-0", flip: "scaleX(-1)", hue: "var(--une-orange)" },
  bl: { cls: "bottom-0 left-0", flip: "scaleY(-1)", hue: "var(--une-orange)" },
  br: { cls: "bottom-0 right-0", flip: "scale(-1,-1)", hue: "var(--une-blue)" },
};

const SLIDE: Record<Corner, string> = {
  tl: "-translate-x-4 -translate-y-4",
  tr: "translate-x-4 -translate-y-4",
  bl: "-translate-x-4 translate-y-4",
  br: "translate-x-4 translate-y-4",
};

/** Recorte serrilhado decorativo de canto. */
export function BlockCut({
  corner = "tl",
  size = "h-24 w-40",
  color,
  shadowColor,
  animate = false,
  className = "",
}: Props) {
  const { cls, flip, hue } = POS[corner];

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      style={{ transform: flip }}
      className={[
        "pointer-events-none absolute",
        cls,
        size,
        animate &&
          `${SLIDE[corner]} opacity-0 animate-[bc-in_.7s_cubic-bezier(.22,1,.36,1)_forwards]`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {shadowColor && (
        <polygon
          points={SHAPE}
          fill={shadowColor}
          opacity={0.5}
          transform="translate(-6 -6)"
        />
      )}
      <polygon points={SHAPE} fill={color ?? hue} />
      {animate && (
        <style>{`
          @keyframes bc-in { to { opacity:1; transform:translate(0,0) } }
          @media (prefers-reduced-motion: reduce) {
            svg { animation: none !important; opacity: 1 !important; transform: none }
          }
        `}</style>
      )}
    </svg>
  );
}
