import { StarBadge } from "../brand/StarBadge";
import { CATEGORY_COLOR, type Artist } from "../data/types";
import { MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { ArtistPhoto } from "./ArtistPhoto";

export function ArtistCard({
  artist,
  onOpen,
  priority = false,
}: {
  artist: Artist;
  onOpen?: () => void;
  /** true nos ~4 primeiros cards: carrega sem lazy e evita "flash" */
  priority?: boolean;
}) {
  const pending = artist.status === "pendente";

  return (
    <article className="card group relative overflow-hidden transition-shadow focus-within:ring-2 focus-within:ring-une hover:shadow-soft">
      <div className="relative aspect-[4/5] overflow-hidden bg-night/10">
        <ArtistPhoto
          src={artist.photoUrl}
          name={artist.name}
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent"
          aria-hidden="true"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${CATEGORY_COLOR[artist.category]}`}
        >
          {artist.category}
        </span>
        {artist.certified && (
          <div className="absolute right-2 top-2">
            <StarBadge size={44}>
              <span className="display text-[7px] text-fica" aria-hidden="true">
                UF
              </span>
            </StarBadge>
            <span className="sr-only">Perfil profissionalizado UNE&FICA</span>
          </div>
        )}
        {pending && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
            <Clock className="h-3 w-3" aria-hidden="true" /> Em análise
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="display line-clamp-2 text-base leading-tight text-night">
          {onOpen ? (
            <button
              onClick={onOpen}
              className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {artist.name}
              <span className="sr-only"> — ver perfil completo</span>
            </button>
          ) : (
            <Link
              to={`/artista/${artist.slug}`}
              className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {artist.name}
              <span className="sr-only"> — ver perfil completo</span>
            </Link>
          )}
        </h3>

        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-night/60">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{artist.community}</span>
        </p>

        <span
          aria-hidden="true"
          className="btn-une mt-4 flex w-full justify-center text-sm transition-transform group-hover:-translate-y-0.5"
        >
          Ver Perfil
        </span>
      </div>
    </article>
  );
}
