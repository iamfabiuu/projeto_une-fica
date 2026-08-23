import { useState } from "react";
import { Clock, Check, X } from "lucide-react";
import { GUIDES } from "../../data/content";
import { useApp } from "../../store/useApp";
import type { Guide } from "../../data/types";

const CATS = [
  "Redes Sociais & Algoritmo",
  "Precificação & Vendas",
  "Montagem de Portfólio",
  "Direito Autoral & Contratos",
];

export default function Guias() {
  const [cat, setCat] = useState(CATS[0]);
  const [open, setOpen] = useState<Guide | null>(null);
  const { completedGuides, toggleGuide } = useApp();

  const list = GUIDES.filter((g) => g.category === cat);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="display text-3xl text-night sm:text-4xl">
        Trilhas da Autogestão
      </h1>
      <div className="mt-4 h-1 w-24 bg-sun" />
      <p className="mt-4 text-night/70">
        Microlearning direto ao ponto. Leia em 5 minutos, aplique hoje.
      </p>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist">
        {CATS.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
              cat === c
                ? "bg-une text-white"
                : "bg-night/5 text-night hover:bg-night/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((g) => {
          const done = completedGuides.includes(g.id);
          return (
            <article key={g.id} className="card flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="flex items-center gap-1 text-xs font-bold text-night/50">
                  <Clock className="h-3.5 w-3.5" /> {g.readTime} min
                </span>
                {done && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                    <Check className="h-3 w-3" /> Concluído
                  </span>
                )}
              </div>
              <h2 className="mt-3 font-extrabold leading-tight text-night">
                {g.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-night/70">{g.excerpt}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-night/10">
                <div
                  className="h-full rounded-full bg-sun transition-all"
                  style={{ width: done ? "100%" : "0%" }}
                />
              </div>
              <button
                onClick={() => setOpen(g)}
                className="btn-une mt-4 w-full justify-center text-sm"
              >
                {done ? "Reler guia" : "Abrir guia"}
              </button>
            </article>
          );
        })}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-night/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-rise max-h-[85dvh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-une">
                  {open.category}
                </p>
                <h2 className="display mt-2 text-2xl text-night">
                  {open.title}
                </h2>
              </div>
              <button onClick={() => setOpen(null)} aria-label="Fechar">
                <X className="h-6 w-6 text-night/50" />
              </button>
            </div>
            <div className="mt-6 whitespace-pre-wrap leading-relaxed text-night/80">
              {open.content}
            </div>
            <button
              onClick={() => {
                toggleGuide(open.id);
                setOpen(null);
              }}
              className={`mt-8 w-full justify-center ${completedGuides.includes(open.id) ? "btn bg-night/10 text-night" : "btn-sun"}`}
            >
              {completedGuides.includes(open.id)
                ? "Desmarcar conclusão"
                : "Marcar como concluído"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
