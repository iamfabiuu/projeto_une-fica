import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowUp, Send, Heart } from "lucide-react";
import { FaInstagram, FaWhatsapp, FaFacebookF, FaYoutube } from "react-icons/fa6";
import { ZigZagDivider } from "../brand/ZigZagDivider";
import { Logo } from "../brand/Logo";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/vitrine", label: "Vitrine de Artistas" },
  { to: "/programacao", label: "Programação" },
  { to: "/inscricao", label: "Inscrição" },
  { to: "/autogestao", label: "Hub de Autogestão" },
];

const LEGAL_LINKS = [
  { to: "/privacidade", label: "Privacidade" },
  { to: "/acessibilidade", label: "Acessibilidade" },
];

const PHONE_RAW = "5581999999999";
const EMAIL = "contato@unefica.org";

const CONTACT = [
  {
    Icon: MapPin,
    text: "Ibura, Recife — PE",
    href: "https://maps.google.com/?q=Ibura,+Recife+-+PE",
    external: true,
  },
  { Icon: Phone, text: "(81) 99999-9999", href: `tel:+${PHONE_RAW}` },
  { Icon: Mail, text: EMAIL, href: `mailto:${EMAIL}` },
];

/* E-mail sai daqui: já está em Contato. Entra o YouTube. */
const SOCIALS = [
  { Icon: FaInstagram, href: "https://instagram.com/unefica", label: "Instagram" },
  { Icon: FaWhatsapp, href: `https://wa.me/${PHONE_RAW}`, label: "WhatsApp" },
  { Icon: FaFacebookF, href: "https://facebook.com/unefica", label: "Facebook" },
  { Icon: FaYoutube, href: "https://youtube.com/@unefica", label: "YouTube" },
];

const focusRing =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun focus-visible:ring-offset-2 focus-visible:ring-offset-night";

export function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 4000);
  };

  const toTop = () =>
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });

  return (
    <footer className="relative bg-night text-white">
      {/* Assinatura visual da marca — o divisor que estava importado sem uso */}
      <div className="h-4 w-full overflow-hidden text-sun" aria-hidden="true">
        <ZigZagDivider teeth={40} />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Marca + newsletter */}
        <div>
          <Link to="/" aria-label="UNE&FICA — página inicial" className={`inline-block ${focusRing}`}>
            <Logo />
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            Orgulho que UNE, Cultura que FICA. Iniciativa cultural comunitária do
            Ibura, Recife/PE.
          </p>

          <form onSubmit={subscribe} className="mt-5 max-w-xs">
            <label htmlFor="footer-email" className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Receba a programação
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                className={`min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:bg-white/15 ${focusRing}`}
              />
              <button
                type="submit"
                aria-label="Inscrever-se na newsletter"
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sun text-night transition-transform hover:-translate-y-0.5 ${focusRing}`}
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p aria-live="polite" className="mt-2 min-h-4 text-xs font-semibold text-fica">
              {sent && "Pronto! Você está na lista. 🎉"}
            </p>
          </form>
        </div>

        {/* Navegação */}
        <nav aria-labelledby="footer-nav">
          <h2 id="footer-nav" className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
            Navegue
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={`inline-block py-0.5 text-white/80 transition-colors hover:text-sun ${focusRing}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contato */}
        <section aria-labelledby="footer-contact">
          <h2 id="footer-contact" className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
            Contato
          </h2>
          <address className="not-italic">
            <ul className="flex flex-col gap-3 text-sm text-white/70">
              {CONTACT.map(({ Icon, text, href, external }) => (
                <li key={text} className="flex items-start gap-2">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-sun" aria-hidden="true" />
                  <a
                    href={href}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    className={`transition-colors hover:text-sun ${focusRing}`}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </address>
        </section>

        {/* Selo + redes */}
        <section aria-labelledby="footer-social" className="sm:col-span-2 lg:col-span-1 lg:text-right">
          <h2 id="footer-social" className="sr-only">
            Redes sociais
          </h2>
          <p className="display text-2xl leading-tight">
            <span className="text-une">EU</span>{" "}
            <Heart className="inline h-5 w-5 fill-heart text-heart align-baseline" aria-label="amo" />
            <br />
            <span className="text-fica">IBURA</span>
          </p>
          <ul className="mt-4 flex gap-3 lg:justify-end">
            {SOCIALS.map(({ Icon, href, label }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={`${label} (abre em nova aba)`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-all hover:-translate-y-0.5 hover:bg-sun hover:text-night ${focusRing}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Base */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-5 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>
            © {year} UNE&amp;FICA · UneHUB · Feito no Ibura, para o Ibura.
          </p>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={`transition-colors hover:text-sun ${focusRing}`}>
                {label}
              </Link>
            ))}
            <button
              onClick={toTop}
              className={`inline-flex items-center gap-1 font-bold transition-colors hover:text-sun ${focusRing}`}
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" /> Ao topo
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
