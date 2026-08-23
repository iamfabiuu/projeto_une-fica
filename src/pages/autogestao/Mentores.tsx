import { useState } from "react";
import { Star, Calendar, X, ExternalLink } from "lucide-react";
import { MENTORS } from "../../data/content";
import type { Mentor } from "../../data/types";

const SPECS = [
  "Marketing Digital",
  "Editais & Leis de Incentivo",
  "Produção Musical/Visual",
];

export default function Mentores() {
  const [spec, setSpec] = useState("todas");
  const [type, setType] = useState<"todos" | "free" | "paid">("todos");
  const [open, setOpen] = useState<Mentor | null>(null);

  const list = MENTORS.filter(
    (m) =>
      (spec === "todas" || m.specialties.includes(spec)) &&
      (type === "todos" || (type === "free" ? m.isFree : !m.isFree)),
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="display text-3xl text-night sm:text-4xl">
        Mural de Mentores
      </h1>
      <div className="mt-4 h-1 w-24 bg-sun" />
      <p className="mt-4 text-night/70">
        Conversas de 45 minutos que podem mudar a rota da sua carreira.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <select
          value={spec}
          onChange={(e) => setSpec(e.target.value)}
          aria-label="Especialidade"
          className="rounded-full border-2 border-night/15 px-5 py-3 font-semibold outline-none focus:border-une"
        >
          <option value="todas">Todas as especialidades</option>
          {SPECS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <div className="flex rounded-full bg-night/5 p-1">
          {(
            [
              ["todos", "Todos"],
              ["free", "Gratuito"],
              ["paid", "Pago"],
            ] as const
          ).map(([v, l]) => (
            <button
              key={v}
              onClick={() => setType(v)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${type === v ? "bg-une text-white" : "text-night"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => (
          <article key={m.id} className="card flex flex-col p-6">
            <div className="flex items-center gap-4">
              <img
                src={m.avatarUrl}
                alt={m.name}
                loading="lazy"
                className="h-16 w-16 rounded-full object-cover ring-4 ring-fica/20"
              />
              <div>
                <h2 className="font-extrabold leading-tight text-night">
                  {m.name}
                </h2>
                <p className="text-xs font-semibold text-night/60">{m.role}</p>
              </div>
            </div>
            <p className="mt-4 flex-1 text-sm text-night/70">{m.bio}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {m.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-fica/15 px-2.5 py-1 text-[11px] font-bold text-night"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm font-bold text-night">
                <Star className="h-4 w-4 fill-sun text-sun" />{" "}
                {m.rating.toFixed(1)}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                  m.isFree
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-sun/20 text-night"
                }`}
              >
                {m.isFree ? "Gratuito" : "Mentoria Paga"}
              </span>
            </div>
            <button
              onClick={() => setOpen(m)}
              className="btn-une mt-5 w-full justify-center text-sm"
            >
              <Calendar className="h-4 w-4" /> Agendar Sessão
            </button>
          </article>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-night/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-rise w-full max-w-md rounded-2xl bg-white p-8"
          >
            <div className="flex items-start justify-between">
              <h2 className="display text-xl text-night">
                Agendar com {open.name}
              </h2>
              <button onClick={() => setOpen(null)} aria-label="Fechar">
                <X className="h-6 w-6 text-night/50" />
              </button>
            </div>
            <p className="mt-2 text-sm text-night/60">
              {open.role} · Sessões de 45 min
            </p>
            <p className="mt-6 text-xs font-bold uppercase tracking-wider text-une">
              Horários disponíveis
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {open.slots.map((s) => (
                <button
                  key={s}
                  className="rounded-xl border-2 border-night/15 py-3 font-bold text-night hover:border-une hover:bg-une/5"
                >
                  {s}
                </button>
              ))}
            </div>
            <a
              href={open.calendarUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-sun mt-6 w-full justify-center"
            >
              Ver agenda completa <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
