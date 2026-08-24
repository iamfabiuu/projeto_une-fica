import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, SearchX, X } from "lucide-react";
import { useApprovedArtists } from "../store/useApp";
import { ArtistCard } from "../components/ArtistCard";
import { ArtistModal } from "../components/ArtistModal";
import { CATEGORIES, COMMUNITIES, type Artist } from "../data/types";

/** Remove acentos e normaliza para busca tolerante */
const norm = (s: string) =>
  (s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export default function Vitrine() {
  const approved = useApprovedArtists();
  const [params, setParams] = useSearchParams();

  const cat = params.get("cat") ?? "todos";
  const com = params.get("com") ?? "todos";
  const [raw, setRaw] = useState(params.get("q") ?? "");
  const [q, setQ] = useState(() => norm(params.get("q") ?? ""));
  const [selected, setSelected] = useState<Artist | null>(null);

  // debounce da busca + sincronia com a URL
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(norm(raw));
      setParams(
        (p) => {
          const next = new URLSearchParams(p);
          raw.trim() ? next.set("q", raw.trim()) : next.delete("q");
          return next;
        },
        { replace: true },
      );
    }, 250);
    return () => clearTimeout(t);
  }, [raw, setParams]);

  const setFilter = useCallback(
    (key: "cat" | "com", value: string) =>
      setParams(
        (p) => {
          const next = new URLSearchParams(p);
          value === "todos" ? next.delete(key) : next.set(key, value);
          return next;
        },
        { replace: true },
      ),
    [setParams],
  );

  // índice de busca pré-normalizado — evita normalizar a cada tecla
  const indexed = useMemo(
    () =>
      approved.map((a) => ({
        artist: a,
        haystack: norm(
          [a.name, a.category, a.community, a.bio, ...(a.tags ?? [])].join(" "),
        ),
      })),
    [approved],
  );

  const list = useMemo(
    () =>
      indexed
        .filter(
          ({ artist: a, haystack }) =>
            (cat === "todos" || a.category === cat) &&
            (com === "todos" || a.community === com) &&
            (!q || haystack.includes(q)),
        )
        .map(({ artist }) => artist),
    [indexed, q, cat, com],
  );

  const hasFilters = Boolean(raw || cat !== "todos" || com !== "todos");

  const clearAll = useCallback(() => {
    setRaw("");
    setParams(new URLSearchParams(), { replace: true });
  }, [setParams]);

  return (
    <>
      <section className="bg-night py-14 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="display text-3xl sm:text-4xl">Vitrine de Artistas</h1>
          <div className="mt-4 h-1 w-24 bg-sun" aria-hidden="true" />
          <p className="mt-4 max-w-xl text-white/80">
            {approved.length}{" "}
            {approved.length === 1 ? "talento" : "talentos"} do Ibura, prontos
            para se apresentar, vender e ensinar.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Filtros */}
        <search>
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-night/40"
                aria-hidden="true"
              />
              <input
                type="search"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setRaw("")}
                aria-label="Buscar artistas"
                placeholder="Buscar por nome, arte ou comunidade..."
                className="w-full rounded-full border-2 border-night/15 py-3 pl-12 pr-11 font-medium outline-none transition-colors focus:border-une"
              />
              {raw && (
                <button
                  type="button"
                  onClick={() => setRaw("")}
                  aria-label="Limpar busca"
                  className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-night/40 transition-colors hover:bg-night/5 hover:text-night"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <Select
              value={cat}
              onChange={(v) => setFilter("cat", v)}
              options={CATEGORIES}
              label="Todas as categorias"
            />
            <Select
              value={com}
              onChange={(v) => setFilter("com", v)}
              options={COMMUNITIES}
              label="Todas as comunidades"
            />
          </div>
        </search>

        {/* Contagem + chips ativos */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p
            aria-live="polite"
            className="flex items-center gap-2 text-sm font-semibold text-night/60"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            {list.length} {list.length === 1 ? "resultado" : "resultados"}
          </p>

          {cat !== "todos" && <Chip label={cat} onRemove={() => setFilter("cat", "todos")} />}
          {com !== "todos" && <Chip label={com} onRemove={() => setFilter("com", "todos")} />}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-sm font-semibold text-une underline decoration-2 underline-offset-2 hover:text-night"
            >
              Limpar tudo
            </button>
          )}
        </div>

        {list.length ? (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((a) => (
              <li key={a.id}>
                <ArtistCard artist={a} onOpen={() => setSelected(a)} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-16 text-center">
            <SearchX className="mx-auto h-16 w-16 text-night/20" aria-hidden="true" />
            <p className="display mt-4 text-xl text-night">Nada encontrado por aqui</p>
            <p className="mt-2 text-night/60">
              {approved.length
                ? "Tente outro termo ou limpe os filtros."
                : "A vitrine abre quando as primeiras inscrições forem aprovadas."}
            </p>
            {hasFilters && (
              <button onClick={clearAll} className="btn-sun mt-6">
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {selected && <ArtistModal artist={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-une/10 py-1 pl-3 pr-1.5 text-sm font-semibold text-une">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remover filtro ${label}`}
        className="grid h-5 w-5 place-items-center rounded-full transition-colors hover:bg-une hover:text-white"
      >
        <X className="h-3 w-3" aria-hidden="true" />
      </button>
    </span>
  );
}

function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  label: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="cursor-pointer rounded-full border-2 border-night/15 bg-white px-5 py-3 font-semibold outline-none transition-colors focus:border-une"
    >
      <option value="todos">{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
