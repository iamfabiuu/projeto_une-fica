import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaInstagram, FaWhatsapp, FaFacebookF } from "react-icons/fa6";
import { ZigZagDivider } from "../brand/ZigZagDivider";

export function Footer() {
  return (
    <footer className="bg-night text-white">
      <div className="h-8">
        <ZigZagDivider orientation="horizontal" teeth={40} />
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <p className="display text-2xl">
            <span className="text-fica">UNE</span>
            <span className="text-sun">&</span>
            <span className="text-fica">FICA</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-white/70">
            Orgulho que UNE, Cultura que FICA. Iniciativa cultural comunitária
            do Ibura, Recife/PE.
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <Link to="/vitrine" className="hover:text-sun">
            Vitrine de Artistas
          </Link>
          <Link to="/programacao" className="hover:text-sun">
            Programação
          </Link>
          <Link to="/inscricao" className="hover:text-sun">
            Inscrição
          </Link>
          <Link to="/autogestao" className="hover:text-sun">
            Hub de Autogestão
          </Link>
        </nav>
        <div className="sm:text-right">
          <p className="display text-2xl leading-tight">
            <span className="text-une">EU</span>{" "}
            <span className="text-heart">♥</span>
            <br />
            <span className="text-fica">IBURA</span>
          </p>
          <div className="mt-4 flex gap-3 justify-center sm:justify-end">
            {[
              { Icon: FaInstagram, href: "https://instagram.com/unefica" },
              { Icon: FaWhatsapp, href: "https://wa.me/5581999999999" },
              { Icon: FaFacebookF, href: "https://facebook.com/unefica" },
              { Icon: Mail, href: "mailto:contato@unefica.org" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-sun hover:text-night"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © 2026 UNE&FICA · UneHUB · Feito no Ibura, para o Ibura.
      </p>
    </footer>
  );
}
