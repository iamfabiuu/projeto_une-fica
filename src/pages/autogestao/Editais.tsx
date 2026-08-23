import { useState } from "react";
import { CalendarDays, ExternalLink, X } from "lucide-react";
import { GRANTS } from "../../data/content";
import type { Grant } from "../../data/types";

const BADGE = {
  aberto: {
    cls: "bg-emerald-100 text-emerald-800",
    label: "Inscrições Abertas",
  },
  breve: { cls: "bg-amber-100 text-amber-800", label: "Em Breve" },
  encerrado: { cls: "bg-night/10 text-night/60", label: "Encerrado" },
} as const;

export default function Editais() {
  const [open, setOpen] = useState<Grant | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="display text-3xl text-night sm:text-4xl">
        Radar de Editais
      </h1>
      <div className="mt-4 h-1 w-24 bg-sun" />
      <p className="mt-4 text-night/70">
        Oportunidades de fomento, prêmios e residências. Atualizado
        semanalmente.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GRANTS.map((g) => {
          const b = BADGE[g.status];
          return (
            <article
              key={g.id}
              className={`card flex flex-col p-6 ${g.status === "encerrado" ? "opacity-60" : ""}`}
            >
              <span
                className={`self-start rounded-full px-3 py-1 text-[11px] font-bold ${b.cls}`}
              >
                {b.label}
              </span>
              <h2 className="mt-3 font-extrabold leading-tight text-night">
                {g.title}
              </h2>
              <p className="mt-1 text-sm text-night/60">{g.organizer}</p>
              <p className="mt-4 flex items-center gap-1.5 text-sm font-bold text-night">
                <CalendarDays className="h-4 w-4 text-une" /> {fmt(g.deadline)}
              </p>
              <span className="mt-3 self-start rounded-full bg-night/5 px-3 py-1 text-[11px] font-bold text-night/70">
                {g.category}
              </span>
              <button
                onClick={() => setOpen(g)}
                className="btn-une mt-5 w-full justify-center text-sm"
              >
                Ver detalhes
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
            className="animate-rise max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold ${BADGE[open.status].cls}`}
                >
                  {BADGE[open.status].label}
                </span>
                <h2 className="display mt-3 text-xl text-night">
                  {open.title}
                </h2>
                <p className="text-sm text-night/60">{open.organizer}</p>
              </div>
              <button onClick={() => setOpen(null)} aria-label="Fechar">
                <X className="h-6 w-6 text-night/50" />
              </button>
            </div>

            <p className="mt-6 rounded-xl bg-night/5 p-4 text-sm font-bold text-night">
              Prazo final: {fmt(open.deadline)}
            </p>

            <p className="mt-6 text-xs font-bold uppercase tracking-wider text-une">
              Checklist de preparação
            </p>
            <ul className="mt-3 space-y-2">
              {open.requirements.map((r) => {
                const key = `${open.id}-${r}`;
                return (
                  <li key={key}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl p-3 hover:bg-night/5">
                      <input
                        type="checkbox"
                        checked={!!checked[key]}
                        onChange={() =>
                          setChecked((s) => ({ ...s, [key]: !s[key] }))
                        }
                        className="mt-0.5 h-5 w-5 shrink-0 accent-[#1E6FF5]"
                      />
                      <span
                        className={`text-sm ${checked[key] ? "text-night/40 line-through" : "text-night/80"}`}
                      >
                        {r}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>

            <a
              href={open.link}
              target="_blank"
              rel="noreferrer"
              className="btn-sun mt-6 w-full justify-center"
            >
              Acessar edital <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
