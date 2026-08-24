import { useState, useEffect, useMemo, useCallback, useRef, useId } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays, ExternalLink, X, AlertTriangle, Search, Inbox, CheckCircle2,
} from "lucide-react";
import { GRANTS } from "../../data/content";
import type { Grant, GrantStatus } from "../../data/types";

const BADGE = {
  aberto: { cls: "bg-emerald-100 text-emerald-800", label: "Inscrições Abertas" },
  breve: { cls: "bg-amber-100 text-amber-800", label: "Em Breve" },
  encerrado: { cls: "bg-night/10 text-night/60", label: "Encerrado" },
} as const satisfies Record<GrantStatus, { cls: string; label: string }>;

const ORDER: Record<GrantStatus, number> = { aberto: 0, breve: 1, encerrado: 2 };
const FILTERS = ["todos", "aberto", "breve", "encerrado"] as const;
const STORE_KEY = "unefica:editais:checklist";
const DAY = 86_400_000;

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

const daysLeft = (d: string) => Math.ceil((+new Date(d) - Date.now()) / DAY);

const countdown = (n: number) =>
  n < 0 ? "Prazo encerrado" : n === 0 ? "Encerra hoje!" : n === 1 ? "Encerra amanhã" : `${n} dias restantes`;

/* Checklist persistido: o artista não perde o progresso ao fechar a aba */
function useChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(checked));
    } catch {
      /* modo privado: segue sem persistir */
    }
  }, [checked]);

  const toggle = useCallback(
    (key: string) => setChecked((s) => ({ ...s, [key]: !s[key] })),
    [],
  );
  return { checked, toggle };
}

const keyOf = (id: string, i: number) => `${id}#${i}`;

export default function Editais() {
  const [open, setOpen] = useState<Grant | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("todos");
  const [q, setQ] = useState("");
  const { checked, toggle } = useChecklist();

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return GRANTS.filter(
      (g) =>
        (filter === "todos" || g.status === filter) &&
        (!term ||
          `${g.title} ${g.organizer} ${g.category}`.toLowerCase().includes(term)),
    ).sort(
      (a, b) =>
        ORDER[a.status] - ORDER[b.status] || a.deadline.localeCompare(b.deadline),
    );
  }, [filter, q]);

  const counts = useMemo(() => {
    const c = { todos: GRANTS.length, aberto: 0, breve: 0, encerrado: 0 };
    for (const g of GRANTS) c[g.status]++;
    return c;
  }, []);

  const progressOf = useCallback(
    (g: Grant) => {
      const total = g.requirements.length;
      const n = g.requirements.filter((_, i) => checked[keyOf(g.id, i)]).length;
      return { n, total, pct: total ? Math.round((n / total) * 100) : 0 };
    },
    [checked],
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="display text-3xl text-night sm:text-4xl">Radar de Editais</h1>
      <div className="mt-4 h-1 w-24 bg-sun" aria-hidden="true" />
      <p className="mt-4 max-w-2xl text-night/70">
        Oportunidades de fomento, prêmios e residências. Atualizado semanalmente — e
        seu checklist fica salvo neste navegador.
      </p>

      {/* Controles */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por situação">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  active ? "bg-une text-white" : "bg-night/5 text-night hover:bg-night/10"
                }`}
              >
                {f === "todos" ? "Todos" : BADGE[f].label}{" "}
                <span className={active ? "text-white/70" : "text-night/40"}>{counts[f]}</span>
              </button>
            );
          })}
        </div>
        <div className="relative ml-auto min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-night/40" aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar edital"
            placeholder="Buscar edital..."
            className="w-full rounded-full border-2 border-night/15 py-2 pl-10 pr-4 text-sm font-medium outline-none focus:border-une"
          />
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-12 rounded-2xl border-2 border-dashed border-night/15 py-20 text-center">
          <Inbox className="mx-auto h-14 w-14 text-night/20" aria-hidden="true" />
          <p className="display mt-4 text-lg text-night">Nenhum edital encontrado</p>
          <p className="mt-2 text-sm text-night/60">Tente outro termo ou remova os filtros.</p>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((g) => {
            const b = BADGE[g.status];
            const d = daysLeft(g.deadline);
            const urgent = g.status === "aberto" && d >= 0 && d <= 7;
            const { n, total, pct } = progressOf(g);
            return (
              <li key={g.id}>
                <article
                  className={`card flex h-full flex-col p-6 transition-shadow hover:shadow-soft ${
                    g.status === "encerrado" ? "opacity-60" : ""
                  } ${urgent ? "ring-2 ring-amber-400" : ""}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${b.cls}`}>
                      {b.label}
                    </span>
                    {urgent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white">
                        <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Últimos dias
                      </span>
                    )}
                  </div>

                  <h2 className="mt-3 font-extrabold leading-tight text-night">{g.title}</h2>
                  <p className="mt-1 text-sm text-night/60">{g.organizer}</p>

                  <p className="mt-4 flex items-center gap-1.5 text-sm font-bold text-night">
                    <CalendarDays className="h-4 w-4 shrink-0 text-une" aria-hidden="true" />
                    <time dateTime={g.deadline}>{fmt(g.deadline)}</time>
                  </p>
                  {g.status !== "encerrado" && (
                    <p className={`mt-1 text-xs font-bold ${urgent ? "text-amber-600" : "text-night/50"}`}>
                      {countdown(d)}
                    </p>
                  )}

                  <span className="mt-3 w-fit rounded-full bg-night/5 px-3 py-1 text-[11px] font-bold text-night/70">
                    {g.category}
                  </span>

                  {n > 0 && (
                    <div className="mt-4">
                      <p className="flex items-center gap-1.5 text-[11px] font-bold text-night/60">
                        {n === total ? (
                          <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" /> Checklist completo!</>
                        ) : (
                          `Checklist: ${n}/${total}`
                        )}
                      </p>
                      <div
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Checklist de ${g.title}`}
                        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-night/10"
                      >
                        <div
                          className={`h-full rounded-full transition-[width] duration-500 ${n === total ? "bg-emerald-500" : "bg-une"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setOpen(g)}
                    className="btn-une mt-auto w-full justify-center pt-0 text-sm"
                    style={{ marginTop: "auto" }}
                  >
                    Ver detalhes
                  </button>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      {open && (
        <GrantModal
          grant={open}
          checked={checked}
          onToggle={toggle}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

/* ─────────── Modal acessível ─────────── */

function GrantModal({
  grant,
  checked,
  onToggle,
  onClose,
}: {
  grant: Grant;
  checked: Record<string, boolean>;
  onToggle: (k: string) => void;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const titleId = useId();

  const d = daysLeft(grant.deadline);
  const total = grant.requirements.length;
  const n = grant.requirements.filter((_, i) => checked[keyOf(grant.id, i)]).length;
  const ready = n === total && total > 0;

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
        ...panel.current.querySelectorAll<HTMLElement>('a[href],button,input:not([disabled])'),
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
        className="animate-rise max-h-[85dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl bg-white p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${BADGE[grant.status].cls}`}>
              {BADGE[grant.status].label}
            </span>
            <h2 id={titleId} className="display mt-3 text-xl text-night">
              {grant.title}
            </h2>
            <p className="text-sm text-night/60">{grant.organizer}</p>
          </div>
          <button
            ref={closeBtn}
            onClick={onClose}
            aria-label="Fechar detalhes"
            className="shrink-0 rounded-full p-1 transition-colors hover:bg-night/5"
          >
            <X className="h-6 w-6 text-night/50" aria-hidden="true" />
          </button>
        </div>

        <div className={`mt-6 rounded-xl p-4 ${d >= 0 && d <= 7 ? "bg-amber-50 ring-1 ring-amber-200" : "bg-night/5"}`}>
          <p className="text-sm font-bold text-night">
            Prazo final: <time dateTime={grant.deadline}>{fmt(grant.deadline)}</time>
          </p>
          {grant.status !== "encerrado" && (
            <p className={`mt-0.5 text-xs font-bold ${d <= 7 ? "text-amber-700" : "text-night/50"}`}>
              {countdown(d)}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-une">
            Checklist de preparação
          </p>
          <span className={`text-xs font-bold ${ready ? "text-emerald-600" : "text-night/50"}`}>
            {n}/{total}
          </span>
        </div>

        <ul className="mt-3 space-y-1">
          {grant.requirements.map((r, i) => {
            const k = keyOf(grant.id, i);
            const on = !!checked[k];
            return (
              <li key={k}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl p-3 transition-colors hover:bg-night/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-une">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => onToggle(k)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-une"
                  />
                  <span className={`text-sm ${on ? "text-night/40 line-through" : "text-night/80"}`}>
                    {r}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        {ready && (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            Tudo pronto! Agora é só enviar. 🚀
          </p>
        )}

        <a
          href={grant.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-sun mt-6 w-full justify-center"
        >
          Acessar edital <ExternalLink className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
    </div>,
    document.body,
  );
}
