const PALETTE = ["#1D4ED8", "#F59E0B", "#E11D48", "#0E7490", "#7C3AED"];

export function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 2 || /^[A-Z]/.test(w))
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Data URL SVG — zero requisição, zero arquivo, sempre funciona */
export function avatarFallback(name: string) {
  const bg = PALETTE[hash(name) % PALETTE.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 380">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${bg}99"/>
</linearGradient></defs>
<rect width="300" height="380" fill="url(#g)"/>
<text x="150" y="205" font-family="system-ui,sans-serif" font-size="110"
 font-weight="800" fill="#fff" fill-opacity=".92" text-anchor="middle">${initials(name)}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
