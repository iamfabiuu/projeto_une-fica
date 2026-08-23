import { Check, X, Clock, Users } from "lucide-react";
import { useApp } from "../store/useApp";
import type { Status } from "../data/types";

const BADGE: Record<Status, string> = {
  aprovado: "bg-emerald-100 text-emerald-800",
  pendente: "bg-amber-100 text-amber-800",
  rejeitado: "bg-night/10 text-night/60",
};

export default function Admin() {
  const { artists, setStatus } = useApp();
  const total = artists.length;
  const pend = artists.filter((a) => a.status === "pendente").length;
  const apr = artists.filter((a) => a.status === "aprovado").length;
  const rate = total ? Math.round((apr / total) * 100) : 0;

  const KPIS = [
    {
      label: "Total de inscrições",
      value: total,
      icon: Users,
      color: "text-une",
    },
    { label: "Pendentes", value: pend, icon: Clock, color: "text-sun" },
    { label: "Aprovados", value: apr, icon: Check, color: "text-emerald-600" },
    {
      label: "Taxa de aprovação",
      value: `${rate}%`,
      icon: Check,
      color: "text-fica",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="display text-3xl text-night sm:text-4xl">
        Painel de Gestão
      </h1>
      <div className="mt-4 h-1 w-24 bg-sun" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-6">
            <Icon className={`h-6 w-6 ${color}`} />
            <p className={`display mt-3 text-3xl ${color}`}>{value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-night/50">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl ring-1 ring-night/10">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-night text-white">
            <tr>
              {[
                "Artista",
                "Categoria",
                "Comunidade",
                "Envio",
                "Status",
                "Ações",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-4 text-xs font-bold uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-night/10 bg-white">
            {artists.map((a) => (
              <tr key={a.id} className="transition-colors hover:bg-night/[.03]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={a.photoUrl}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="font-bold text-night">{a.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-night/70">{a.category}</td>
                <td className="px-5 py-4 text-night/70">{a.community}</td>
                <td className="px-5 py-4 text-night/70">
                  {new Date(a.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${BADGE[a.status]}`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStatus(a.id, "aprovado")}
                      disabled={a.status === "aprovado"}
                      aria-label={`Aprovar ${a.name}`}
                      className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-30"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setStatus(a.id, "rejeitado")}
                      disabled={a.status === "rejeitado"}
                      aria-label={`Rejeitar ${a.name}`}
                      className="grid h-9 w-9 place-items-center rounded-full bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-30"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
