import { useState, useEffect, useRef, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import { X, Check, Copy, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { FaInstagram, FaYoutube, FaSpotify, FaWhatsapp } from "react-icons/fa6";
import type { ComponentType, SVGProps } from "react";
import { CATEGORY_COLOR, type Artist } from "../data/types";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;
const FALLBACK = "/assets/a3.jpg";
const FOCUSABLE =
  'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

/** Copia com fallback para contextos sem Clipboard API (HTTP, WebView antiga) */
async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = Object.assign(document.createElement("textarea"), {
      value: text,
      style: "position:fixed;opacity:0",
    });
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

export function ArtistModal({
  artist,
  onClose,
}: {
  artist: Artist;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState<boolean | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<Element | null>(null);
  const titleId = useId();

  const gallery = artist.gallery.length ? artist.gallery : [artist.photoUrl];

  /* Trava scroll + guarda o gatilho + foco inicial */
  useEffect(() => {
    openerRef.current = document.activeElement;
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`; // evita "salto" do layout
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      (openerRef.current as HTMLElement | null)?.focus?.();
    };
  }, []);

  /* Esc + focus trap (Esc no lightbox fecha só o lightbox) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        zoom !== null ? setZoom(null) : onClose();
        return;
      }
      if (zoom !== null) {
        if (e.key === "ArrowRight") setZoom((i) => ((i ?? 0) + 1) % gallery.length);
        if (e.key === "ArrowLeft") setZoom((i) => ((i ?? 0) - 1 + gallery.length) % gallery.length);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onClose, zoom, gallery.length]);

  const copyPix = useCallback(async () => {
    const ok = await copyText(artist.pixKey);
    setCopied(ok);
    setTimeout(() => setCopied(null), 2400);
  }, [artist.pixKey]);

  const socials = [
    { href: artist.socials.instagram, Icon: FaInstagram, label: "Instagram" },
    { href: artist.socials.spotify, Icon: FaSpotify, label: "Spotify" },
    { href: artist.socials.youtube, Icon: FaYoutube, label: "YouTube" },
  ].filter((s): s is { href: string; Icon: IconType; label: string } => !!s.href);

  return createPortal(
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-night/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-rise max-h-[90dvh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-soft"
      >
        <div className="relative">
          <img
            src={artist.photoUrl || FALLBACK}
            alt={`Retrato de ${artist.name}`}
            className="h-56 w-full bg-night/5 object-cover"
            onError={(e) => {
              e.currentTarget.src = FALLBACK;
              e.currentTarget.onerror = null;
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent"
            aria-hidden="true"
          />
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Fechar perfil"
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-une"
          >
            <X className="h-5 w-5 text-night" aria-hidden="true" />
          </button>
        </div>

        <div className="p-7">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_COLOR[artist.category]}`}
          >
            {artist.category}
          </span>
          <h2 id={titleId} className="display mt-3 text-2xl text-night">
            {artist.name}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-night/60">
            <MapPin className="h-4 w-4 shrink-0 text-sun" aria-hidden="true" />
            {artist.community} · Ibura, Recife
          </p>
          <p className="mt-5 whitespace-pre-line leading-relaxed text-night/80">
            {artist.bio}
          </p>

          {gallery.length > 1 && (
            <ul className="mt-6 flex gap-3 overflow-x-auto pb-2" aria-label="Galeria de fotos">
              {gallery.map((g, i) => (
                <li key={g}>
                  <button
                    onClick={() => setZoom(i)}
                    aria-label={`Ampliar foto ${i + 1} de ${gallery.length}`}
                    className="block h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-night/5 ring-2 ring-transparent transition-all hover:ring-sun focus-visible:outline-none focus-visible:ring-une"
                  >
                    <img
                      src={g}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {socials.map(({ href, Icon, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-night/5 px-4 py-2 text-sm font-semibold text-night transition-colors hover:bg-night hover:text-white"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" /> {label}
                    <span className="sr-only"> de {artist.name} (abre em nova aba)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              onClick={copyPix}
              className="btn-sun justify-center"
              aria-label={`Copiar chave PIX de ${artist.name}`}
            >
              {copied === true ? (
                <><Check className="h-4 w-4" /> Chave copiada!</>
              ) : copied === false ? (
                <><Copy className="h-4 w-4" /> Copie manualmente abaixo</>
              ) : (
                <><Copy className="h-4 w-4" /> Apoiar via PIX</>
              )}
            </button>
            {artist.socials.whatsapp && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://wa.me/${artist.socials.whatsapp}?text=${encodeURIComponent(
                  `Olá, ${artist.name}! Vi seu perfil no UneHUB e quero contratar seu trabalho.`,
                )}`}
                className="btn-une justify-center"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden="true" /> Contratar / Contato
              </a>
            )}
          </div>

          <p className="mt-3 select-all text-center text-xs text-night/50">
            PIX: <code className="font-semibold">{artist.pixKey}</code>
          </p>
          <span aria-live="polite" className="sr-only">
            {copied === true ? "Chave PIX copiada" : copied === false ? "Falha ao copiar" : ""}
          </span>
        </div>
      </div>

      {/* Lightbox com navegação */}
      {zoom !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${zoom + 1} de ${gallery.length}`}
          className="fixed inset-0 z-[70] grid place-items-center bg-night/95 p-6"
          onMouseDown={(e) => e.target === e.currentTarget && setZoom(null)}
        >
          <img
            src={gallery[zoom]}
            alt={`${artist.name} — foto ${zoom + 1}`}
            className="max-h-[85dvh] max-w-full rounded-2xl object-contain"
          />
          <button
            onClick={() => setZoom(null)}
            aria-label="Fechar foto"
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          {gallery.length > 1 && (
            <>
              <NavBtn side="left" onClick={() => setZoom((i) => ((i ?? 0) - 1 + gallery.length) % gallery.length)} />
              <NavBtn side="right" onClick={() => setZoom((i) => ((i ?? 0) + 1) % gallery.length)} />
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white">
                {zoom + 1} / {gallery.length}
              </p>
            </>
          )}
        </div>
      )}
    </div>,
    document.body,
  );
}

function NavBtn({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Foto anterior" : "Próxima foto"}
      className={`absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 ${
        side === "left" ? "left-4" : "right-4"
      }`}
    >
      <Icon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
}
