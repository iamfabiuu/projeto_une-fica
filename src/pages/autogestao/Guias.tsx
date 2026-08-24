import { useState, useEffect, useMemo, useRef, useId, useCallback } from "react";
import { createPortal } from "react-dom";
import { Clock, Check, X, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { GUIDES } from "../../data/content";
import { useApp } from "../../store/useApp";
import type { Guide } from "../../data/types";

/** Categorias derivadas do conteúdo: nenhum guia fica órfão */
const CATS = [...new Set(GUIDES.map((g) => g.category))];

export default function Guias() {
  const [cat, setCat] = useState(CATS[0]);
  const [open, setOpen] = useState<Guide | null>(null);
  const completedGuides = useApp((s) => s.completedGuides);
  const toggleGuide = useApp((s) => s.toggleGuide);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const doneSet = useMemo(() => new Set(completedGuides), [completedGuides]);
  const list = useMemo(() => GUIDES.filter((g) => g.category === cat), [cat]);

  const stats = useMemo(() => {
    const m = new Map<string, { done: number; total: number }>();
    for (const g of GUIDES) {
      const s = m.get(g.category) ?? { done: 0, total: 0 };
      s.total++;
      if (doneSet.has(g.id)) s.done++;
      m.set(g.category, s);
    }
    return m;
  }, [doneSet]);

  const catDone = stats.get(cat) ?? { done: 0, total: 0 };
  const catPct = catDone.total ? Math.round((catDone.done / catDone.total) * 100) : 0;
  const totalPct = Math.round((doneSet.size / GUIDES.length) * 100);

  /** Próximo guia não lido, priorizando a mesma categoria */
  const nextOf = useCallback(
    (g: Guide) =>
      GUIDES.filter((x) => x.id !== g.id && !doneSet.has(x.id)).sort(
        (a, b) => Number(b.category === g.category) - Number(a.category === g.category),
      )[0] ?? null,
    [doneSet],
  );

  /* Navegação por setas nas abas (padrão ARIA) */
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const map: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowLeft: i - 1,
      Home: 0,
      End: CATS.length - 1,
    };
    const t = map[e.key];
    if (t === undefined) return;
    e.preventDefault();
    const idx = (t + CATS.length) % CATS.length;
    setCat(CATS[idx]);
    tabsRef.current[idx]?.focus();
  };

  const tabId = (c: string) => `${baseId}-tab-${CATS.indexOf(c)}`;
  const panelId = (c: string) => `${baseId}-panel-${CATS.indexOf(c)}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="display text-3xl text-night sm:text-4xl">Trilhas da Autogestão</h1>
      <div className="mt-4 h-1 w-24 bg-sun" aria-hidden="true" />
      <p className="mt-4 max-w-2xl text-night/70">
        Microlearning direto ao ponto. Leia em 5 minutos, aplique hoje.
      </p>

      {/* Progresso total */}
      <div className="mt-6 max-w-sm">
        <div className="flex justify-between text-xs font-bold text-night">
          <span>
            {doneSet.size} de {GUIDES.length} guias concluídos
          </span>
          <span className={totalPct === 100 ? "text-emerald-600" : "text-une"}>{totalPct}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={totalPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso total nas trilhas"
          className="mt-1.5 h-2 overflow-hidden rounded-full bg-night/10"
        >
          <div
            className={`h-full rounded-full transition-[width] duration-700 ${
              totalPct === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-une to-sun"
            }`}
            style={{ width: `${totalPct}%` }}
          />
        </div>
      </div>

      {/* Abas */}
      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Categorias de guias">
        {CATS.map((c, i) => {
          const active = cat === c;
          const s = stats.get(c)!;
          const full = s.done === s.total;
          return (
            <button
              key={c}
              ref={(el) => (tabsRef.current[i] = el)}
              role="tab"
              id={tabId(c)}
              aria-selected={active}
              aria-controls={panelId(c)}
              tabIndex={active ? 0 : -1}
              onClick={() => setCat(c)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                active ? "bg-une text-white" : "bg-night/5 text-night hover:bg-night/10"
              }`}
            >
              {full && (
                <CheckCircle2
                  className={`h-4 w-4 ${active ? "text-white" : "text-emerald-500"}`}
                  aria-hidden="true"
                />
              )}
              {c}
              <span className={active ? "text-white/70" : "text-night/40"}>
                {s.done}/{s.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Painel */}
      <div role="tabpanel" id={panelId(cat)} aria-labelledby={tabId(cat)} tabIndex={-1}>
        {catDone.total > 0 && (
          <p className="mt-6 text-xs font-bold text-night/50">
            {catPct === 100
              ? "Trilha concluída! Escolha a próxima categoria. 🎉"
              : `${catPct}% desta trilha — faltam ${catDone.total - catDone.done} guia(s).`}
          </p>
        )}

        {list.length === 0 ? (
          <div className="mt-8 rounded-2xl border-2 border-dashed border-night/15 py-16 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-night/20" aria-hidden="true" />
            <p className="mt-3 font-bold text-night">Nenhum guia nesta trilha ainda</p>
            <p className="mt-1 text-sm text-night/60">Novos conteúdos toda semana.</p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((g) => {
              const done = doneSet.has(g.id);
              return (
                <li key={g.id}>
                  <article
                    className={`card flex h-full flex-col p-6 transition-shadow hover:shadow-soft ${
                      done ? "ring-1 ring-emerald-200" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex items-center gap-1 text-xs font-bold text-night/50">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {g.readTime} min
                      </span>
                      {done && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                          <Check className="h-3 w-3" aria-hidden="true" /> Concluído
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 font-extrabold leading-tight text-night">{g.title}</h2>
                    <p className="mt-2 flex-1 text-sm text-night/70">{g.excerpt}</p>
                    <div
                      className="mt-4 h-2 overflow-hidden rounded-full bg-night/10"
                      aria-hidden="true"
                    >
                      <div
                        className={`h-full rounded-full transition-[width] duration-500 ${
                          done ? "bg-emerald-500" : "bg-sun"
                        }`}
                        style={{ width: done ? "100%" : "0%" }}
                      />
                    </div>
                    <button
                      onClick={() => setOpen(g)}
                      className="btn-une mt-4 w-full justify-center text-sm"
                    >
                      {done ? "Reler guia" : "Abrir guia"}
                      <span className="sr-only">: {g.title}</span>
                    </button>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {open && (
        <GuideModal
          guide={open}
          done={doneSet.has(open.id)}
          next={nextOf(open)}
          onToggle={toggleGuide}
          onNavigate={(g) => {
            setCat(g.category);
            setOpen(g);
          }}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

/* ─────────── Modal do guia ─────────── */

function GuideModal({
  guide,
  done,
  next,
  onToggle,
  onNavigate,
  onClose,
}: {
  guide: Guide;
  done: boolean;
  next: Guide | null;
  onToggle: (id: string) => void;
  onNavigate: (g: Guide) => void;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const [read, setRead] = useState(0);
  const [justDone, setJustDone] = useState(false);
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

  /* Reset de scroll e estado ao trocar de guia sem fechar o modal */
  useEffect(() => {
    panel.current?.scrollTo({ top: 0 });
    setRead(0);
    setJustDone(false);
  }, [guide.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const els = [...panel.current.querySelectorAll<HTMLElement>("a[href],button")].filter(
        (el) => el.offsetParent !== null,
      );
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

  /* Barra de leitura */
  const onScroll = () => {
    const el = panel.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setRead(max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 100);
  };

  const complete = () => {
    onToggle(guide.id);
    if (!done) setJustDone(true);
    else onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-night/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panel}
        onScroll={onScroll}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-rise relative max-h-[85dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-2xl bg-white p-8"
      >
        <div className="sticky -top-8 -mx-8 -mt-8 h-1 bg-night/5" aria-hidden="true">
          <div
            className="h-full bg-sun transition-[width] duration-150"
            style={{ width: `${read}%` }}
          />
        </div>

        <div className="mt-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-une">{guide.category}</p>
            <h2 id={titleId} className="display mt-2 text-2xl text-night">
              {guide.title}
            </h2>
            <p className="mt-1 flex items-center gap-1 text-xs font-bold text-night/50">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {guide.readTime} min de leitura
            </p>
          </div>
          <button
            ref={closeBtn}
            onClick={onClose}
            aria-label="Fechar guia"
            className="shrink-0 rounded-full p-1 transition-colors hover:bg-night/5"
          >
            <X className="h-6 w-6 text-night/50" aria-hidden="true" />
          </button>
        </div>

        <div className="prose-guide mt-6 whitespace-pre-wrap text-[15px] leading-relaxed text-night/80">
          {guide.content}
        </div>

        {justDone ? (
          <div className="mt-8 rounded-2xl bg-emerald-50 p-5 text-center ring-1 ring-emerald-200">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" aria-hidden="true" />
            <p className="mt-2 font-extrabold text-emerald-900">Guia concluído! 🎉</p>
            {next ? (
              <>
                <p className="mt-1 text-sm text-emerald-800">
                  Próximo: <strong>{next.title}</strong> · {next.readTime} min
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button onClick={() => onNavigate(next)} className="btn-sun text-sm">
                    Continuar <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-full bg-white px-5 py-3 text-sm font-bold text-night"
                  >
                    Depois
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-1 text-sm text-emerald-800">
                  Você zerou todas as trilhas. Hora de encarar um edital!
                </p>
                <button onClick={onClose} className="btn-sun mt-4 text-sm">
                  Fechar
                </button>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={complete}
            className={`mt-8 w-full justify-center ${done ? "btn bg-night/10 text-night" : "btn-sun"}`}
          >
            {done ? "Desmarcar conclusão" : "Marcar como concluído"}
          </button>
        )}

        <span aria-live="polite" className="sr-only">
          {justDone ? "Guia marcado como concluído" : ""}
        </span>
      </div>
    </div>,
    document.body,
  );
}
