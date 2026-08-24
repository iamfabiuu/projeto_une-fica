import { useState, useEffect, useMemo, useRef, useCallback, useId } from "react";
import {
  Star, Calendar, X, ExternalLink, UserSearch, Check, Clock, CalendarPlus,
} from "lucide-react";
import { createPortal } from "react-dom";
import { MENTORS } from "../../data/content";
import type { Mentor } from "../../data/types";

/** Especialidades derivadas dos dados: nenhum filtro fica órfão */
const SPECS = [...new Set(MENTORS.flatMap((m) => m.specialties))].sort();
const TYPES = [
  ["todos", "Todos"],
  ["free", "Gratuito"],
  ["paid", "Pago"],
] as const;
const SESSION_MIN = 45;
const FALLBACK = "/assets/avatar.jpg";

export default function Mentores() {
  const [spec, setSpec] = useState("todas");
  const [type, setType] = useState<(typeof TYPES)[number][0]>("todos");
  const [open, setOpen] = useState<Mentor | null>(null);

  const list = useMemo(
    () =>
      MENTORS.filter(
        (m) =>
          (spec === "todas" || m.specialties.includes(spec)) &&
          (type === "todos" || (type === "free" ? m.isFree : !m.isFree)),
      ).sort(
        (a, b) => Number(b.slots.length > 0) - Number(a.slots.length > 0) || b.rating - a.rating,
      ),
    [spec, type],
  );

  const clear = () => {
    setSpec("todas");
    setType("todos");
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="display text-3xl text-night sm:text-4xl">Mural de Mentores</h1>
      <div className="mt-4 h-1 w-24 bg-sun" aria-hidden="true" />
      <p className="mt-4 max-w-2xl text-night/70">
        Conversas de {SESSION_MIN} minutos que podem mudar a rota da sua carreira.
      </p>

      {/* Filtros */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <select
          value={spec}
          onChange={(e) => setSpec(e.target.value)}
          aria-label="Filtrar por especialidade"
          className="rounded-full border-2 border-night/15 px-5 py-3 font-semibold outline-none focus:border-une"
        >
          <option value="todas">Todas as especialidades</option>
          {SPECS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="flex rounded-full bg-night/5 p-1" role="group" aria-label="Filtrar por tipo">
          {TYPES.map(([v, l]) => (
            <button
              key={v}
              onClick={() => setType(v)}
              aria-pressed={type === v}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                type === v ? "bg-une text-white" : "text-night hover:text-une"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <p className="text-sm font-bold text-night/50" aria-live="polite">
          {list.length} {list.length === 1 ? "mentor" : "mentores"}
        </p>
      </div>

      {list.length === 0 ? (
        <div className="mt-12 rounded-2xl border-2 border-dashed border-night/15 py-20 text-center">
          <UserSearch className="mx-auto h-14 w-14 text-night/20" aria-hidden="true" />
          <p className="display mt-4 text-lg text-night">Nenhum mentor com esses filtros</p>
          <p className="mt-2 text-sm text-night/60">
            Tente outra especialidade — novos mentores entram toda semana.
          </p>
          <button onClick={clear} className="btn-une mt-6 text-sm">
            Limpar filtros
          </button>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => {
            const free = m.slots.length;
            return (
              <li key={m.id}>
                <article className="card flex h-full flex-col p-6 transition-shadow hover:shadow-soft">
                  <div className="flex items-center gap-4">
                    <img
                      src={m.avatarUrl || FALLBACK}
                      alt=""
                      width={64}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK;
                        e.currentTarget.onerror = null;
                      }}
                      className="h-16 w-16 shrink-0 rounded-full bg-night/10 object-cover ring-4 ring-fica/20"
                    />
                    <div className="min-w-0">
                      <h2 className="font-extrabold leading-tight text-night">{m.name}</h2>
                      <p className="text-xs font-semibold text-night/60">{m.role}</p>
                    </div>
                  </div>

                  <p className="mt-4 flex-1 text-sm text-night/70">{m.bio}</p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {m.specialties.map((s) => (
                      <li key={s}>
                        <button
                          onClick={() => setSpec(s)}
                          className="rounded-full bg-fica/15 px-2.5 py-1 text-[11px] font-bold text-night transition-colors hover:bg-fica/35"
                          title={`Filtrar por ${s}`}
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-sm font-bold text-night">
                      <Star className="h-4 w-4 fill-sun text-sun" aria-hidden="true" />
                      {m.rating.toFixed(1)}
                      <span className="sr-only">de 5 em avaliação</span>
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                        m.isFree ? "bg-emerald-100 text-emerald-800" : "bg-sun/20 text-night"
                      }`}
                    >
                      {m.isFree ? "Gratuito" : "Mentoria Paga"}
                    </span>
                  </div>

                  <p
                    className={`mt-3 flex items-center gap-1.5 text-xs font-bold ${
                      free ? "text-emerald-600" : "text-night/40"
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {free
                      ? `${free} horário${free > 1 ? "s" : ""} disponível${free > 1 ? "eis" : ""}`
                      : "Agenda lotada no momento"}
                  </p>

                  <button
                    onClick={() => setOpen(m)}
                    disabled={!free}
                    className="btn-une mt-4 w-full justify-center text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    {free ? "Agendar Sessão" : "Sem horários"}
                    <span className="sr-only"> com {m.name}</span>
                  </button>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      {open && <BookingModal mentor={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

/* ─────────── Modal de agendamento ─────────── */

function BookingModal({ mentor, onClose }: { mentor: Mentor; onClose: () => void }) {
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const titleId = useId();

  useEffect(() => {
    opener.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const els = [
        ...panel.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])"),
      ].filter((el) => el.offsetParent !== null);
      if (!els.length) return;
      const [first, last] = [els[0], els[els.length - 1]];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Link .ics real — o horário escolhido vira compromisso de verdade */
  const calendarHref = useCallback(() => {
    if (!slot) return mentor.calendarUrl;
    const text = encodeURIComponent(`Mentoria com ${mentor.name} — UneHUB`);
    const details = encodeURIComponent(
      `Sessão de ${SESSION_MIN} min com ${mentor.name} (${mentor.role}).\nAgendado via UNE&FICA UneHUB.`,
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}`;
  }, [slot, mentor]);

  return createPortal(
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-night/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-rise max-h-[85dvh] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl bg-white p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={mentor.avatarUrl || FALLBACK}
              alt=""
              className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-fica/30"
            />
            <div>
              <h2 id={titleId} className="display text-lg leading-tight text-night">
                Agendar com {mentor.name}
              </h2>
              <p className="text-xs text-night/60">
                {mentor.role} · {SESSION_MIN} min
              </p>
            </div>
          </div>
          <button
            ref={closeBtn}
            onClick={onClose}
            aria-label="Fechar agendamento"
            className="shrink-0 rounded-full p-1 transition-colors hover:bg-night/5"
          >
            <X className="h-6 w-6 text-night/50" aria-hidden="true" />
          </button>
        </div>

        {confirmed ? (
          <div className="mt-8 rounded-2xl bg-emerald-50 p-6 text-center ring-1 ring-emerald-200">
            <Check className="mx-auto h-9 w-9 text-emerald-500" aria-hidden="true" />
            <p className="mt-2 font-extrabold text-emerald-900">Horário reservado!</p>
            <p className="mt-1 text-sm text-emerald-800">
              <strong>{slot}</strong> com {mentor.name}. Você receberá a confirmação por e-mail.
            </p>
            <a
              href={calendarHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sun mt-5 w-full justify-center text-sm"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden="true" /> Adicionar à agenda
            </a>
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-full py-3 text-sm font-bold text-night/60 hover:text-night"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <fieldset className="mt-6">
              <legend className="text-xs font-bold uppercase tracking-wider text-une">
                Horários disponíveis
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {mentor.slots.map((s) => {
                  const active = slot === s;
                  return (
                    <label
                      key={s}
                      className={`cursor-pointer rounded-xl border-2 py-3 text-center font-bold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-une ${
                        active
                          ? "border-une bg-une text-white"
                          : "border-night/15 text-night hover:border-une hover:bg-une/5"
                      }`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        value={s}
                        checked={active}
                        onChange={() => setSlot(s)}
                        className="sr-only"
                      />
                      {s}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <button
              onClick={() => setConfirmed(true)}
              disabled={!slot}
              className="btn-une mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
            >
              {slot ? `Confirmar ${slot}` : "Escolha um horário"}
            </button>

            <a
              href={mentor.calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-1.5 py-2 text-sm font-bold text-night/60 hover:text-une"
            >
              Ver agenda completa <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </>
        )}

        <span aria-live="polite" className="sr-only">
          {confirmed ? `Sessão reservada para ${slot}` : slot ? `${slot} selecionado` : ""}
        </span>
      </div>
    </div>,
    document.body,
  );
}
