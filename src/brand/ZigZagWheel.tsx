function zigzagCircle(teeth: number, rOuter: number, rInner: number) {
  const pts: string[] = [];
  const step = Math.PI / teeth;
  for (let i = 0; i < teeth * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = i * step - Math.PI / 2;
    pts.push(
      `${(100 + r * Math.cos(a)).toFixed(2)},${(100 + r * Math.sin(a)).toFixed(2)}`,
    );
  }
  return `M${pts.join("L")}Z`;
}

type Props = { className?: string; teeth?: number };

export function ZigZagWheel({ className = "", teeth = 30 }: Props) {
  const layers = [
    { fill: "#f5921e", ro: 100, ri: 88, dur: 75, dir: "normal" },
    { fill: "#1e6ff5", ro: 94, ri: 82, dur: 60, dir: "reverse" },
    { fill: "#14425c", ro: 87, ri: 87, dur: 60, dir: "normal" },
  ];

  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className}>
      <style>{`
        @keyframes zzwheel { to { transform: rotate(360deg); } }
        .zz { transform-origin: 100px 100px; transform-box: view-box; }
      `}</style>
      {layers.map((l, i) => (
        <path
          key={i}
          className="zz"
          d={zigzagCircle(teeth, l.ro, l.ri)}
          fill={l.fill}
          style={{
            animation: `zzwheel ${l.dur}s linear infinite ${l.dir}`,
            willChange: "transform",
          }}
        />
      ))}
    </svg>
  );
}

export default ZigZagWheel;
