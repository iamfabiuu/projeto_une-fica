import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal, SearchX } from "lucide-react";
import { useApp } from "../store/useApp";
import { ArtistCard } from "../components/ArtistCard";
import { ArtistModal } from "../components/ArtistModal";
import { CATEGORIES, COMMUNITIES, type Artist } from "../data/types";

export default function Vitrine() {
  const artists = useApp((s) => s.artists);
  const [raw, setRaw] = useState("");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("todos");
  const [com, setCom] = useState<string>("todos");
  const [selected, setSelected] = useState<Artist | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setQ(raw.toLowerCase().trim()), 250);
    return () => clearTimeout(t);
  }, [raw]);

  const list = useMemo(
    () =>
      artists.filter(
        (a) =>
          a.status === "aprovado" &&
          (cat === "todos" || a.category === cat) &&
          (com === "todos" || a.community === com) &&
          (!q ||
            `${a.name} ${a.category} ${a.community} ${a.bio}`
              .toLowerCase()
              .includes(q)),
      ),
    [artists, q, cat, com],
  );

  return (
    <>
      <section className="bg-night py-14 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="display text-3xl sm:text-4xl">Vitrine de Artistas</h1>
          <div className="mt-4 h-1 w-24 bg-sun" />
          <p className="mt-4 max-w-xl text-white/80">
            {artists.filter((a) => a.status === "aprovado").length} talentos do
            Ibura, prontos para se apresentar, vender e ensinar.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-night/40" />
            <input
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="Buscar por nome, arte ou comunidade..."
              className="w-full rounded-full border-2 border-night/15 py-3 pl-12 pr-4 font-medium outline-none focus:border-une"
            />
          </label>
          <Select
            value={cat}
            onChange={setCat}
            options={CATEGORIES}
            label="Todas as categorias"
          />
          <Select
            value={com}
            onChange={setCom}
            options={COMMUNITIES}
            label="Todas as comunidades"
          />
        </div>

        <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-night/60">
          <SlidersHorizontal className="h-4 w-4" /> {list.length} resultado(s)
        </p>

        {list.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((a) => (
              <ArtistCard key={a.id} artist={a} onOpen={() => setSelected(a)} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <SearchX className="mx-auto h-16 w-16 text-night/20" />
            <p className="display mt-4 text-xl text-night">
              Nada encontrado por aqui
            </p>
            <p className="mt-2 text-night/60">
              Tente outro termo ou limpe os filtros.
            </p>
            <button
              onClick={() => {
                setRaw("");
                setCat("todos");
                setCom("todos");
              }}
              className="btn-sun mt-6"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {selected && (
        <ArtistModal artist={selected} onClose={() => setSelected(null)} />
      )}
    </>
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
      className="rounded-full border-2 border-night/15 bg-white px-5 py-3 font-semibold outline-none focus:border-une"
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
