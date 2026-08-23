import { useState } from "react";
import { Heart, Clock } from "lucide-react";
import { SCHEDULE } from "../data/content";
import { STAGE_COLOR, type Stage } from "../data/types";
import { useApp } from "../store/useApp";
import { ZigZagDivider } from "../brand/ZigZagDivider";

const DAYS = [
  { n: 1 as const, label: "Dia 1", date: "Sex, 18 set" },
  { n: 2 as const, label: "Dia 2", date: "Sáb, 19 set" },
  { n: 3 as const, label: "Dia 3", date: "Dom, 20 set" },
];

export default function Programacao() {
  const [day, setDay] = useState<1 | 2 | 3>(1);
  const { favorites, toggleFavorite, artists } = useApp();

  const slots = SCHEDULE.filter((s) => s.day === day).sort((a, b) =>
    a.start.localeCompare(b.start),
  );
  const nameOf = (id: string) =>
    artists.find((a) => a.id === id)?.name ?? "A definir";

  return (
    <>
      <section className="bg-night py-14 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="display text-3xl sm:text-4xl">Programação</h1>
          <div className="mt-4 h-1 w-24 bg-sun" />
          <p className="mt-4 text-white/80">
            Três dias, quatro palcos, um só bairro.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-wrap gap-3" role="tablist">
          {DAYS.map((d) => (
            <button
              key={d.n}
              role="tab"
              aria-selected={day === d.n}
              onClick={() => setDay(d.n)}
              className={`rounded-2xl px-6 py-3 text-left font-bold transition-all ${
                day === d.n
                  ? "bg-une text-white shadow-soft"
                  : "bg-night/5 text-night hover:bg-night/10"
              }`}
            >
              <span className="display block text-lg">{d.label}</span>
              <span className="text-xs opacity-80">{d.date}</span>
            </button>
          ))}
        </div>

        <div className="relative mt-10 pl-10">
          <div className="absolute bottom-0 left-2 top-0 w-6">
            <ZigZagDivider teeth={slots.length * 3} />
          </div>

          <ul className="space-y-4">
            {slots.map((s) => {
              const fav = favorites.includes(s.id);
              return (
                <li
                  key={s.id}
                  className="card animate-rise flex items-start gap-4 p-5"
                >
                  <div className="min-w-[74px] text-center">
                    <p className="display text-xl text-night">{s.start}</p>
                    <p className="text-xs font-semibold text-night/50">
                      até {s.end}
                    </p>
                  </div>
                  <div className="flex-1">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold text-white ${STAGE_COLOR[s.stage as Stage]}`}
                    >
                      {s.stage}
                    </span>
                    <h3 className="mt-2 font-extrabold leading-tight text-night">
                      {s.title}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-night/60">
                      <Clock className="h-3.5 w-3.5" /> {nameOf(s.artistId)}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(s.id)}
                    aria-pressed={fav}
                    aria-label={`${fav ? "Remover" : "Favoritar"} ${s.title}`}
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-all ${
                      fav
                        ? "bg-heart text-white"
                        : "bg-night/5 text-night/40 hover:bg-heart/10 hover:text-heart"
                    }`}
                  >
                    <Heart
                      className="h-5 w-5"
                      fill={fav ? "currentColor" : "none"}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
