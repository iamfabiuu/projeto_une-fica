import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { Logo } from "../brand/Logo";
import { ZigZagDivider } from "../brand/ZigZagDivider";
import { useApp } from "../store/useApp";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/vitrine", label: "Vitrine" },
  { to: "/programacao", label: "Programação" },
  { to: "/inscricao", label: "Inscrição" },
  { to: "/autogestao", label: "Autogestão" },
  { to: "/admin", label: "Admin" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const favorites = useApp((s) => s.favorites);

  const link = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 text-sm font-bold transition-colors ${
      isActive ? "text-sun" : "text-night hover:text-une"
    } after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:bg-sun after:transition-all ${
      isActive ? "after:w-full" : "after:w-0"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-night/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3">
        <Link to="/" aria-label="UNE&FICA — página inicial">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"} className={link}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/programacao"
            className="relative hidden rounded-full p-2 hover:bg-night/5 sm:block"
            aria-label={`${favorites.length} atrações favoritadas`}
          >
            <Heart
              className="h-5 w-5 text-heart"
              fill={favorites.length ? "currentColor" : "none"}
            />
            {favorites.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-heart text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>
          <a href="#ingresso" className="btn-sun hidden text-sm md:inline-flex">
            Garantir Ingresso
          </a>
          <button
            onClick={() => setOpen(true)}
            className="rounded-full p-2 hover:bg-night/5 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-night text-white lg:hidden">
          <div className="absolute right-0 top-0 h-full w-10 opacity-90">
            <ZigZagDivider teeth={20} />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="display text-lg">
              <span className="text-fica">UNE</span>
              <span className="text-sun">&</span>FICA
            </span>
            <button onClick={() => setOpen(false)} aria-label="Fechar menu">
              <X className="h-7 w-7" />
            </button>
          </div>
          <nav className="mt-8 flex flex-col gap-2 px-8">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `display text-3xl ${isActive ? "text-sun" : "text-white"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <a
              href="#ingresso"
              onClick={() => setOpen(false)}
              className="btn-sun mt-8 justify-center"
            >
              Garantir Ingresso
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
