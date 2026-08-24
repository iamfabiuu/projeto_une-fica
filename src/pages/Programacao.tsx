import { useState, useMemo, useRef, useCallback } from "react";
import { Heart, User, CalendarX } from "lucide-react";
import { SCHEDULE } from "../data/content";
import { STAGE_COLOR, type Stage } from "../data/types";
import { useApp, useArtists } from "../store/useApp";
import { ZigZagDivider } from "../brand/ZigZagDivider";

type Day = 1 | 2 | 3;

const DAYS = [
  { n: 1 as const, label: "Dia 1", date: "Sex, 18 set", iso: "2026-09-18" },
  { n: 2 as const, label: "Dia 2", date: "Sáb, 19 set", iso: "2026-09-19" },
  { n: 3 as const, label: "Dia 3", date: "Dom, 20 set", iso: "2026-09-20" },
];

export default function Programacao() {
  const [day, setDay] = useState<Day>(1);
  const [onlyFavs, setOnlyFavs] = useState(false);
  const tablistRef = useRef<HTMLDivElement>(null);

  const artists = useArtists();
  const favorites = useApp((s) => s.favorites);
  const toggleFavorite = useApp((s) => s.toggleFavorite);

  /* Mapa O(1) em vez de .find() por slot */
  const artistName = useMemo(
    () => new Map((artists ?? []).map((a) => [a.id, a.name])),
    [artists],
  );

  const byDay = useMemo(() => {
    const map = new Map<Day, typeof SCHEDULE>();
    for (const d of DAYS) {
      map.set(
        d.n,
        SCHEDULE.filter((s) => s.day === d.n).sort((a, b) => a.start.localeCompare(b.start)),
      );
    }
    return map;
  }, []);

  const favSet = useMemo(() => new Set(favorites), [favorites]);
  const daySlots = byDay.get(day) ?? [];
  const favCountOfDay = daySlots.filter((s) => favSet.has(s.id)).length;
  const slots = onlyFavs ? daySlots.filter((s) => favSet.has(s.id)) : daySlots;

  const dayIso = DAYS.find((d) => d.n === day)!.iso;

  /* Sai do modo "só favoritos" se o dia escolhido não tem nenhum */
  const pickDay = useCallback(
    (n: Day) => {
      setDay(n);
      const has = (byDay.get(n) ?? []).some((s) => favSet.has(s.id));
      if (!has) setOnlyFavs(false);
    },
    [byDay, favSet],
  );

  /* Navegação por setas nas abas (padrão ARIA) */
  const onTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      const nextIdx = (DAYS.findIndex((d) => d.n === day) + dir + DAYS.length) % DAYS.length;
      const next = DAYS[nextIdx].n;
      pickDay(next);
      tablistRef.current?.querySelector<HTMLButtonElement>(`[data-day="${next}"]`)?.focus();
    },
    [day, pickDay],
  );

  const panelId = `painel-dia-${day}`;

  return (
    <>
      <section className="bg-night py-14 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="display text-3xl sm:text-4xl">Programação</h1>
          <div className="mt-4 h-1 w-24 bg-sun" aria-hidden="true" />
          <p className="mt-4 text-white/80">Três dias, quatro palcos, um só bairro.</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Abas de dia */}
        <div
          ref={tablistRef}
          role="tablist"
          aria-label="Dias do festival"
          onKeyDown={onTabKeyDown}
          className="flex flex-wrap gap-3"
        >
          {DAYS.map((d) => {
            const active = day === d.n;
            const favs = (byDay.get(d.n) ?? []).filter((s) => favSet.has(s.id)).length;
            return (
              <button
                key={d.n}
                data-day={d.n}
                role="tab"
                id={`aba-dia-${d.n}`}
                aria-selected={active}
                aria-controls={active ? panelId : undefined}
                tabIndex={active ? 0 : -1}
                onClick={() => pickDay(d.n)}
                className={`relative rounded-2xl px-6 py-3 text-left font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-une focus-visible:ring-offset-2 ${
                  active ? "bg-une text-white shadow-soft" : "bg-night/5 text-night hover:bg-night/10"
                }`}
              >
                <span className="display block text-lg">{d.label}</span>
                <span className="text-xs opacity-80">{d.date}</span>
                {favs > 0 && (
                  <span
                    className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-heart px-1.5 text-[11px] font-bold text-white"
                    aria-label={`${favs} ${favs === 1 ? "favorito" : "favoritos"} neste dia`}
                  >
                    {favs}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filtro de favoritos */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm font-semibold text-night/60">
            {slots.length} {slots.length === 1 ? "atração" : "atrações"}
          </p>
          <button
            onClick={() => setOnlyFavs((v) => !v)}
            aria-pressed={onlyFavs}
            disabled={!favCountOfDay && !onlyFavs}
            title={!favCountOfDay ? "Toque no coração de uma atração para montar seu roteiro" : undefined}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
              onlyFavs ? "bg-heart text-white" : "bg-night/5 text-night hover:bg-heart/10 hover:text-heart"
            }`}
          >
            <Heart className="h-4 w-4" fill={onlyFavs ? "currentColor" : "none"} aria-hidden="true" />
            Meu roteiro
            {favCountOfDay > 0 && <span className="opacity-70">({favCountOfDay})</span>}
          </button>
        </div>

        {/* Timeline */}
        <div
          role="tabpanel"
          id={panelId}
          aria-labelledby={`aba-dia-${day}`}
          tabIndex={0}
          className="relative mt-8 pl-10 focus-visible:outline-none"
        >
          <div
            className="pointer-events-none absolute bottom-0 left-2 top-0 w-6 text-une/20"
            aria-hidden="true"
          >
            <ZigZagDivider teeth={Math.max(slots.length * 3, 9)} />
          </div>

          {slots.length ? (
            <ul className="space-y-4">
              {slots.map((s) => {
                const fav = favSet.has(s.id);
                return (
                  <li key={s.id} className="card animate-rise flex items-start gap-4 p-5">
                    <div className="min-w-[74px] text-center">
                      <p className="display text-xl text-night">
                        <time dateTime={`${dayIso}T${s.start}`}>{s.start}</time>
                      </p>
                      <p className="text-xs font-semibold text-night/50">
                        até <time dateTime={`${dayIso}T${s.end}`}>{s.end}</time>
                      </p>
                    </div>

                    <div className="min-w-0 flex-1">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold text-white ${
                          STAGE_COLOR[s.stage as Stage]
                        }`}
                      >
                        {s.stage}
                      </span>
                      <h3 className="mt-2 font-extrabold leading-tight text-night">{s.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-night/60">
                        <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {artistName.get(s.artistId) ?? "A definir"}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleFavorite(s.id)}
                      aria-pressed={fav}
                      aria-label={`${fav ? "Remover dos" : "Adicionar aos"} favoritos: ${s.title}`}
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-all active:scale-90 ${
                        fav ? "bg-heart text-white" : "bg-night/5 text-night/40 hover:bg-heart/10 hover:text-heart"
                      }`}
                    >
                      <Heart className="h-5 w-5" fill={fav ? "currentColor" : "none"} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-12 text-center">
              <CalendarX className="mx-auto h-14 w-14 text-night/20" aria-hidden="true" />
              <p className="display mt-4 text-lg text-night">
                {onlyFavs ? "Nenhum favorito neste dia" : "Programação em breve"}
              </p>
              {onlyFavs && (
                <button onClick={() => setOnlyFavs(false)} className="btn-sun mt-5">
                  Ver tudo do dia
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
