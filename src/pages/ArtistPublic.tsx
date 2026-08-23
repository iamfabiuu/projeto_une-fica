import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useApp } from "../store/useApp";
import { StarBadge } from "../brand/StarBadge";
import { CATEGORY_COLOR } from "../data/types";

export default function ArtistPublic() {
  const { slug } = useParams();
  const artist = useApp((s) => s.artists.find((a) => a.slug === slug));

  if (!artist) {
    return (
      <div className="grid place-items-center px-6 py-32 text-center">
        <p className="display text-2xl text-night">Perfil não encontrado</p>
        <Link to="/vitrine" className="btn-une mt-6">
          <ArrowLeft className="h-4 w-4" /> Voltar à Vitrine
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <Link
        to="/vitrine"
        className="inline-flex items-center gap-1 text-sm font-bold text-une hover:gap-2 transition-all"
      >
        <ArrowLeft className="h-4 w-4" /> Vitrine
      </Link>

      <header className="mt-8 flex flex-wrap items-center gap-6">
        <img
          src={artist.photoUrl}
          alt={artist.name}
          className="h-32 w-32 rounded-2xl object-cover shadow-soft"
        />
        <div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_COLOR[artist.category]}`}
          >
            {artist.category}
          </span>
          <h1 className="display mt-3 text-3xl text-night">{artist.name}</h1>
          <p className="text-sm font-semibold text-night/60">
            {artist.community} · Ibura, Recife/PE
          </p>
        </div>
        {artist.certified && (
          <StarBadge size={80} className="ml-auto">
            <span className="display text-[7px] leading-tight text-fica">
              PERFIL
              <br />
              PRO
            </span>
          </StarBadge>
        )}
      </header>

      <p className="mt-8 text-lg leading-relaxed text-night/80">{artist.bio}</p>

      {artist.gallery.length > 0 && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {artist.gallery.map((g) => (
            <img
              key={g}
              src={g}
              alt=""
              loading="lazy"
              className="aspect-square rounded-2xl object-cover"
            />
          ))}
        </div>
      )}

      <footer className="mt-12 rounded-2xl bg-night p-8 text-white">
        <p className="display text-lg">Contrate esse talento</p>
        <p className="mt-2 text-sm text-white/70">PIX: {artist.pixKey}</p>
        {artist.socials.whatsapp && (
          <a
            href={`https://wa.me/${artist.socials.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="btn-sun mt-5"
          >
            Falar no WhatsApp
          </a>
        )}
      </footer>
    </article>
  );
}
