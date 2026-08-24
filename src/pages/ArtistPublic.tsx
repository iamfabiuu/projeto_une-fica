import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, Share2, MapPin, X, Clock } from "lucide-react";
import { FaInstagram, FaSpotify, FaWhatsapp } from "react-icons/fa6";
import { useApp, useArtistBySlug } from "../store/useApp";
import { StarBadge } from "../brand/StarBadge";
import { CATEGORY_COLOR } from "../data/types";

const FALLBACK = "/assets/a3.jpg";

export default function ArtistPublic() {
  const { slug } = useParams();
  const artist = useArtistBySlug(slug);
  const isAdmin = useApp((s) => s.isAdmin ?? false);

  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);

  const visible = Boolean(artist && (artist.status === "aprovado" || isAdmin));

  /* <title> + meta description (SEO e preview de link) */
  useEffect(() => {
    if (!visible || !artist) return;
    const prev = document.title;
    document.title = `${artist.name} · ${artist.category} | UNE&FICA`;
    const meta =
      document.querySelector('meta[name="description"]') ??
      document.head.appendChild(
        Object.assign(document.createElement("meta"), { name: "description" }),
      );
    const prevDesc = meta.getAttribute("content");
    meta.setAttribute("content", (artist.bio ?? "").slice(0, 155));
    return () => {
      document.title = prev;
      if (prevDesc) meta.setAttribute("content", prevDesc);
    };
  }, [visible, artist]);

  /* Esc fecha o lightbox + trava scroll */
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [zoom]);

  const copyPix = useCallback(async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard bloqueado — usuário ainda vê a chave na tela */
    }
  }, []);

  const share = useCallback(async () => {
    if (!artist) return;
    const data = {
      title: `${artist.name} · UNE&FICA`,
      text: `Conheça ${artist.name}, ${artist.category} do Ibura!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* cancelado */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(data.url);
      setShared(true);
      setTimeout(() => setShared(false), 2200);
    } catch {
      /* sem clipboard */
    }
  }, [artist]);

  /* --- Estados de exceção --- */
  if (!artist) return <NotFound />;

  if (!visible) {
    return (
      <div className="mx-auto grid max-w-md place-items-center px-6 py-32 text-center">
        <Clock className="h-14 w-14 text-night/20" aria-hidden="true" />
        <p className="display mt-4 text-2xl text-night">Perfil em análise</p>
        <p className="mt-2 text-night/60">
          Este artista ainda está aguardando aprovação da organização.
        </p>
        <Link to="/vitrine" className="btn-une mt-6">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar à Vitrine
        </Link>
      </div>
    );
  }

  const s = artist.socials ?? {};
  const gallery = artist.gallery ?? [];

  const socials = [
    { key: s.instagram, Icon: FaInstagram, label: "Instagram" },
    { key: s.spotify, Icon: FaSpotify, label: "Spotify" },
    { key: s.whatsapp && `https://wa.me/${s.whatsapp}`, Icon: FaWhatsapp, label: "WhatsApp" },
  ].filter((x): x is { key: string; Icon: typeof FaInstagram; label: string } => !!x.key);

  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-14">
        <nav className="flex items-center justify-between gap-4">
          <Link
            to="/vitrine"
            className="inline-flex items-center gap-1 text-sm font-bold text-une transition-all hover:gap-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Vitrine
          </Link>
          <button
            onClick={share}
            className="inline-flex items-center gap-2 rounded-full bg-night/5 px-4 py-2 text-sm font-bold text-night transition-colors hover:bg-night/10"
          >
            {shared ? (
              <Check className="h-4 w-4 text-une" aria-hidden="true" />
            ) : (
              <Share2 className="h-4 w-4" aria-hidden="true" />
            )}
            {shared ? "Link copiado!" : "Compartilhar"}
          </button>
        </nav>

        <header className="mt-8 flex flex-wrap items-center gap-6">
          <img
            src={artist.photoUrl || FALLBACK}
            alt={`Retrato de ${artist.name}`}
            width={128}
            height={128}
            onError={(e) => {
              e.currentTarget.src = FALLBACK;
              e.currentTarget.onerror = null;
            }}
            className="h-32 w-32 shrink-0 rounded-2xl bg-night/5 object-cover shadow-soft"
          />
          <div className="min-w-0">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_COLOR[artist.category]}`}
            >
              {artist.category}
            </span>
            <h1 className="display mt-3 text-3xl text-night">{artist.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-night/60">
              <MapPin className="h-4 w-4 shrink-0 text-sun" aria-hidden="true" />
              {artist.community} · Ibura, Recife/PE
            </p>
          </div>
          {artist.certified && (
            <StarBadge size={80} className="ml-auto shrink-0">
              <span className="display text-[7px] leading-tight text-fica">
                PERFIL
                <br />
                PRO
              </span>
            </StarBadge>
          )}
        </header>

        {socials.length > 0 && (
          <ul className="mt-7 flex gap-3">
            {socials.map(({ key, Icon, label }) => (
              <li key={label}>
                <a
                  href={key}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} de ${artist.name}`}
                  title={label}
                  className="grid h-11 w-11 place-items-center rounded-full bg-night/5 text-night transition-all hover:-translate-y-0.5 hover:bg-une hover:text-white"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}

        {artist.bio && (
          <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-night/80">
            {artist.bio}
          </p>
        )}

        {gallery.length > 0 && (
          <section className="mt-10">
            <h2 className="sr-only">Galeria de {artist.name}</h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {gallery.map((g, i) => (
                <li key={g}>
                  <button
                    onClick={() => setZoom(g)}
                    className="group block w-full overflow-hidden rounded-2xl bg-night/5"
                    aria-label={`Ampliar foto ${i + 1} de ${gallery.length}`}
                  >
                    <img
                      src={g}
                      alt={`${artist.name} — foto ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="mt-12 rounded-2xl bg-night p-8 text-white">
          <p className="display text-lg">Contrate esse talento</p>
          <p className="mt-2 text-sm text-white/70">
            Cachê e disponibilidade direto com o artista. Todo apoio fica no Ibura. 💛
          </p>

          {artist.pixKey && (
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Chave PIX</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <code className="min-w-0 break-all rounded-lg bg-white/10 px-3 py-2 text-sm">
                  {artist.pixKey}
                </code>
                <button
                  onClick={() => copyPix(artist.pixKey!)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-bold transition-colors hover:bg-sun hover:text-night"
                >
                  {copied ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  {copied ? "Copiada!" : "Copiar"}
                </button>
              </div>
              <span aria-live="polite" className="sr-only">
                {copied ? "Chave PIX copiada" : ""}
              </span>
            </div>
          )}

          {s.whatsapp && (
            <a
              href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(
                `Olá, ${artist.name}! Vi seu perfil na Vitrine do UNE&FICA e quero falar sobre um trabalho.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sun mt-6"
            >
              <FaWhatsapp className="h-4 w-4" aria-hidden="true" /> Falar no WhatsApp
            </a>
          )}
        </footer>
      </article>

      {/* Lightbox */}
      {zoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          onClick={() => setZoom(null)}
          className="fixed inset-0 z-[90] grid place-items-center bg-night/90 p-6 backdrop-blur-sm"
        >
          <button
            onClick={() => setZoom(null)}
            aria-label="Fechar"
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <img
            src={zoom}
            alt={`${artist.name} — foto ampliada`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-soft"
          />
        </div>
      )}
    </>
  );
}

function NotFound() {
  return (
    <div className="grid place-items-center px-6 py-32 text-center">
      <p className="display text-2xl text-night">Perfil não encontrado</p>
      <p className="mt-2 text-night/60">
        Esse link pode ter expirado ou o artista mudou de nome.
      </p>
      <Link to="/vitrine" className="btn-une mt-6">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar à Vitrine
      </Link>
    </div>
  );
}
