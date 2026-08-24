// src/pages/Acessibilidade.tsx
const ITEMS = [
  "Navegação completa por teclado, com indicador de foco visível",
  "Link “Pular para o conteúdo” no início de cada página",
  "Contraste mínimo AA (4.5:1) em textos e botões",
  "Rótulos ARIA em ícones, modais e campos de formulário",
  "Respeito à preferência prefers-reduced-motion",
  "Textos alternativos em imagens de artistas e atrações",
];

export default function Acessibilidade() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="display text-3xl text-night">Acessibilidade</h1>
      <div className="mt-4 h-1 w-24 bg-sun" aria-hidden="true" />
      <p className="mt-6 text-night/70">
        Cultura que FICA é cultura para todo mundo. O UneHUB segue as diretrizes
        WCAG 2.1 nível AA:
      </p>
      <ul className="mt-6 space-y-3">
        {ITEMS.map((i) => (
          <li key={i} className="flex gap-3 text-night/80">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-fica" aria-hidden="true" />
            {i}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-night/60">
        Encontrou uma barreira?{" "}
        <a href="mailto:contato@unefica.org" className="font-bold text-une hover:underline">
          Avise a gente
        </a>{" "}
        — corrigimos e creditamos.
      </p>
    </section>
  );
}
