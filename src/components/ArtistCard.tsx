import { StarBadge } from "../brand/StarBadge";
import { CATEGORY_COLOR, type Artist } from "../data/types";
import { MapPin } from "lucide-react";

export function ArtistCard({
  artist,
  onOpen,
}: {
  artist: Artist;
  onOpen?: () => void;
}) {
  return (
    <article className="card group overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-night/10">
        <img
          src={artist.photoUrl}
          alt={`${artist.name}, ${artist.category} do ${artist.community}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_COLOR[artist.category]}`}
        >
          {artist.category}
        </span>
        {artist.certified && (
          <div
            className="absolute right-2 top-2"
            title="Perfil Profissionalizado"
          >
            <StarBadge size={44}>
              <span className="display text-[7px] text-fica">UF</span>
            </StarBadge>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="display text-base leading-tight text-night">
          {artist.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-night/60">
          <MapPin className="h-3.5 w-3.5" /> {artist.community}
        </p>
        <button
          onClick={onOpen}
          className="btn-une mt-4 w-full justify-center text-sm"
        >
          Ver Perfil
        </button>
      </div>
    </article>
  );
}
