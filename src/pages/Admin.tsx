import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  Check,
  X,
  Clock,
  Users,
  TrendingUp,
  Search,
  Undo2,
  Inbox,
  Download,
  ArrowUpDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp, useArtists } from "../store/useApp";
import type { Status, Artist } from "../data/types";

const BADGE: Record<Status, string> = {
  aprovado: "bg-emerald-100 text-emerald-800",
  pendente: "bg-amber-100 text-amber-800",
  rejeitado: "bg-night/10 text-night/60",
};

const FILTERS = ["pendente", "aprovado", "rejeitado", "todos"] as const;
type Filter = (typeof FILTERS)[number];

const norm = (s: string) =>
  (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      })
    : "—";

export default function Admin() {
  const artists = useArtists();
  const setStatus = useApp((s) => s.setStatus);

  const [filter, setFilter] = useState<Filter>("pendente");
  const [raw, setRaw] = useState("");
  const [q, setQ] = useState("");
  const [asc, setAsc] = useState(false);
  const [undo, setUndo] = useState<{
    artist: Artist;
    from: Status;
    to: Status;
  } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const t = setTimeout(() => setQ(norm(raw)), 200);
    return () => clearTimeout(t);
  }, [raw]);

  /* Uma única varredura para todos os KPIs */
  const stats = useMemo(() => {
    const acc = { total: 0, pendente: 0, aprovado: 0, rejeitado: 0 };
    for (const a of artists ?? []) {
      acc.total++;
      acc[a.status]++;
    }
    const decided = acc.aprovado + acc.rejeitado;
    return {
      ...acc,
      rate: decided ? Math.round((acc.aprovado / decided) * 100) : 0,
    };
  }, [artists]);

  const rows = useMemo(() => {
    const list = (artists ?? []).filter(
      (a) =>
        (filter === "todos" || a.status === filter) &&
        (!q || norm(`${a.name} ${a.category} ${a.community}`).includes(q)),
    );
    return [...list].sort((a, b) => {
      const d = (a.createdAt || "").localeCompare(b.createdAt || "");
      return asc ? d : -d;
    });
  }, [artists, filter, q, asc]);

  const act = useCallback(
    (artist: Artist, to: Status) => {
      if (
        to === "rejeitado" &&
        !window.confirm(`Rejeitar a inscrição de ${artist.name}?`)
      )
        return;
      const from = artist.status;
      setStatus(artist.id, to);
      setUndo({ artist, from, to });
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setUndo(null), 6000);
    },
    [setStatus],
  );

  const doUndo = useCallback(() => {
    if (!undo) return;
    setStatus(undo.artist.id, undo.from);
    setUndo(null);
    clearTimeout(timer.current);
  }, [undo, setStatus]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const exportCsv = useCallback(() => {
    const head = [
      "Nome",
      "Categoria",
      "Comunidade",
      "Status",
      "WhatsApp",
      "Envio",
    ];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      head.join(";"),
      ...rows.map((a) =>
        [
          a.name,
          a.category,
          a.community,
          a.status,
          a.socials?.whatsapp ?? "",
          a.createdAt,
        ]
          .map(esc)
          .join(";"),
      ),
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }),
    );
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `unefica-inscricoes-${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
    URL.revokeObjectURL(url);
  }, [rows]);

  const KPIS = [
    {
      label: "Total de inscrições",
      value: stats.total,
      Icon: Users,
      color: "text-une",
    },
    {
      label: "Aguardando análise",
      value: stats.pendente,
      Icon: Clock,
      color: "text-sun",
    },
    {
      label: "Aprovados",
      value: stats.aprovado,
      Icon: Check,
      color: "text-emerald-600",
    },
    {
      label: "Taxa de aprovação",
      value: `${stats.rate}%`,
      Icon: TrendingUp,
      color: "text-fica",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl text-night sm:text-4xl">
            Painel de Gestão
          </h1>
          <div className="mt-4 h-1 w-24 bg-sun" aria-hidden="true" />
        </div>
        <button
          onClick={exportCsv}
          disabled={!rows.length}
          className="inline-flex items-center gap-2 rounded-full bg-night/5 px-4 py-2.5 text-sm font-bold text-night transition-colors hover:bg-night/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download className="h-4 w-4" aria-hidden="true" /> Exportar CSV
        </button>
      </div>

      {/* KPIs */}
      <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map(({ label, value, Icon, color }) => (
          <div key={label} className="card p-6">
            <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />
            <dd className={`display mt-3 text-3xl ${color}`}>{value}</dd>
            <dt className="mt-1 text-xs font-bold uppercase tracking-wider text-night/50">
              {label}
            </dt>
          </div>
        ))}
      </dl>

      {/* Controles */}
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filtrar por status"
        >
          {FILTERS.map((f) => {
            const count = f === "todos" ? stats.total : stats[f];
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition-colors ${
                  active
                    ? "bg-une text-white"
                    : "bg-night/5 text-night hover:bg-night/10"
                }`}
              >
                {f === "todos" ? "Todos" : `${f}s`}{" "}
                <span className={active ? "text-white/70" : "text-night/40"}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative ml-auto min-w-[220px] flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-night/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setRaw("")}
            aria-label="Buscar inscrição"
            placeholder="Buscar artista..."
            className="w-full rounded-full border-2 border-night/15 py-2 pl-10 pr-4 text-sm font-medium outline-none transition-colors focus:border-une"
          />
        </div>
      </div>

      <p
        aria-live="polite"
        className="mt-4 text-sm font-semibold text-night/50"
      >
        {rows.length} {rows.length === 1 ? "inscrição" : "inscrições"}
      </p>

      {rows.length === 0 ? (
        <div className="mt-10 rounded-2xl border-2 border-dashed border-night/15 py-20 text-center">
          <Inbox
            className="mx-auto h-14 w-14 text-night/20"
            aria-hidden="true"
          />
          <p className="display mt-4 text-lg text-night">
            {q ? "Nenhum resultado para essa busca" : "Nada por aqui ainda"}
          </p>
          <p className="mt-2 text-sm text-night/60">
            {filter === "pendente" && !q
              ? "Tudo analisado. Bom trabalho! 🎉"
              : "Ajuste os filtros."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: tabela */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl ring-1 ring-night/10 md:block">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Inscrições de artistas</caption>
              <thead className="bg-night text-white">
                <tr>
                  {["Artista", "Categoria", "Comunidade"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-5 py-4 text-xs font-bold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="px-5 py-4 text-xs font-bold uppercase tracking-wider"
                  >
                    <button
                      onClick={() => setAsc((v) => !v)}
                      aria-label={`Ordenar por data (${asc ? "mais antigos" : "mais recentes"} primeiro)`}
                      className="inline-flex items-center gap-1.5 hover:text-sun"
                    >
                      Envio{" "}
                      <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </th>
                  {["Status", "Ações"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-5 py-4 text-xs font-bold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-night/10 bg-white">
                {rows.map((a) => (
                  <tr
                    key={a.id}
                    className="transition-colors hover:bg-night/[.03]"
                  >
                    <th
                      scope="row"
                      className="px-5 py-4 text-left font-bold text-night"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar artist={a} />
                        <Link
                          to={`/artista/${a.slug}`}
                          className="hover:text-une hover:underline"
                        >
                          {a.name}
                        </Link>
                      </div>
                    </th>
                    <td className="px-5 py-4 text-night/70">{a.category}</td>
                    <td className="px-5 py-4 text-night/70">{a.community}</td>
                    <td className="px-5 py-4 text-night/70">
                      <time dateTime={a.createdAt}>{fmtDate(a.createdAt)}</time>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${BADGE[a.status]}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Actions artist={a} onAct={act} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards (sem scroll horizontal) */}
          <ul className="mt-6 space-y-3 md:hidden">
            {rows.map((a) => (
              <li key={a.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <Avatar artist={a} />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/artista/${a.slug}`}
                      className="font-bold text-night hover:text-une"
                    >
                      {a.name}
                    </Link>
                    <p className="truncate text-xs text-night/60">
                      {a.category} · {a.community}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${BADGE[a.status]}`}
                      >
                        {a.status}
                      </span>
                      <span className="text-[11px] text-night/40">
                        {fmtDate(a.createdAt)}
                      </span>
                    </div>
                  </div>
                  <Actions artist={a} onAct={act} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Undo */}
      {undo && (
        <div
          role="status"
          className="animate-rise fixed bottom-6 left-1/2 z-[80] flex w-[min(92vw,30rem)] -translate-x-1/2 items-center gap-4 rounded-2xl bg-night px-5 py-4 text-white shadow-soft"
        >
          <p className="min-w-0 flex-1 text-sm">
            <strong className="font-bold">{undo.artist.name}</strong> agora está{" "}
            <span className="font-bold capitalize">{undo.to}</span>.
          </p>
          <button
            onClick={doUndo}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-sm font-bold transition-colors hover:bg-sun hover:text-night"
          >
            <Undo2 className="h-4 w-4" aria-hidden="true" /> Desfazer
          </button>
        </div>
      )}
    </div>
  );
}

function Avatar({ artist }: { artist: Artist }) {
  return (
    <img
      src={artist.photoUrl || "/assets/a3.jpg"}
      alt=""
      width={40}
      height={40}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.src = "/assets/a3.jpg";
        e.currentTarget.onerror = null;
      }}
      className="h-10 w-10 shrink-0 rounded-full bg-night/5 object-cover"
    />
  );
}

function Actions({
  artist,
  onAct,
}: {
  artist: Artist;
  onAct: (a: Artist, to: Status) => void;
}) {
  return (
    <div className="flex shrink-0 gap-2">
      <button
        onClick={() => onAct(artist, "aprovado")}
        disabled={artist.status === "aprovado"}
        aria-label={`Aprovar ${artist.name}`}
        title="Aprovar"
        className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700 transition-all hover:bg-emerald-200 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Check className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        onClick={() => onAct(artist, "rejeitado")}
        disabled={artist.status === "rejeitado"}
        aria-label={`Rejeitar ${artist.name}`}
        title="Rejeitar"
        className="grid h-9 w-9 place-items-center rounded-full bg-red-100 text-red-700 transition-all hover:bg-red-200 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
