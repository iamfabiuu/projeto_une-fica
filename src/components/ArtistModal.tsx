import { useState } from "react";
import { X, Check, Copy, MessageCircle, Music2 } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa6";
import type { ComponentType, SVGProps } from "react";
import { CATEGORY_COLOR, type Artist } from "../data/types";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export function ArtistModal({
  artist,
  onClose,
}: {
  artist: Artist;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const copyPix = async () => {
    await navigator.clipboard.writeText(artist.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal
      aria-label={artist.name}
      className="fixed inset-0 z-[60] grid place-items-center bg-night/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-rise max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-soft"
      >
        <div className="relative">
          <img
            src={artist.photoUrl}
            alt={artist.name}
            className="h-56 w-full object-cover"
          />
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 hover:bg-white"
          >
            <X className="h-5 w-5 text-night" />
          </button>
        </div>

        <div className="p-7">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_COLOR[artist.category]}`}
          >
            {artist.category}
          </span>
          <h2 className="display mt-3 text-2xl text-night">{artist.name}</h2>
          <p className="text-sm font-semibold text-night/60">
            {artist.community} · Ibura, Recife
          </p>
          <p className="mt-5 leading-relaxed text-night/80">{artist.bio}</p>

          {artist.gallery.length > 1 && (
            <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
              {artist.gallery.map((g) => (
                <button
                  key={g}
                  onClick={() => setLightbox(g)}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-xl ring-2 ring-transparent hover:ring-sun"
                >
                  <img
                    src={g}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {artist.socials.instagram && (
              <Social
                href={artist.socials.instagram}
                icon={FaInstagram}
                label="Instagram"
              />
            )}
            {artist.socials.spotify && (
              <Social
                href={artist.socials.spotify}
                icon={Music2}
                label="Spotify"
              />
            )}
            {artist.socials.youtube && (
              <Social
                href={artist.socials.youtube}
                icon={FaYoutube}
                label="YouTube"
              />
            )}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button onClick={copyPix} className="btn-sun justify-center">
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Chave copiada!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Apoiar via PIX
                </>
              )}
            </button>
            {artist.socials.whatsapp && (
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://wa.me/${artist.socials.whatsapp}?text=${encodeURIComponent(
                  `Olá, ${artist.name}! Vi seu perfil no UneHUB e quero contratar seu trabalho.`,
                )}`}
                className="btn-une justify-center"
              >
                <MessageCircle className="h-4 w-4" /> Contratar / Contato
              </a>
            )}
          </div>
          <p className="mt-3 text-center text-xs text-night/50">
            PIX: {artist.pixKey}
          </p>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-night/95 p-6"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt=""
            className="max-h-[85dvh] max-w-full rounded-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

function Social({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: IconType;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-night/5 px-4 py-2 text-sm font-semibold text-night hover:bg-night hover:text-white"
    >
      <Icon className="h-4 w-4" /> {label}
    </a>
  );
}
