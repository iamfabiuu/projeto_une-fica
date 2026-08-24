import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Heart, Ticket, LogIn, LogOut, User, ShieldCheck } from "lucide-react";
import { Logo } from "../brand/Logo";
import { ZigZagDivider } from "../brand/ZigZagDivider";
import { useApp, useUser, useIsAdmin } from "../store/useApp";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/vitrine", label: "Vitrine" },
  { to: "/programacao", label: "Programação" },
  { to: "/inscricao", label: "Inscrição" },
  { to: "/autogestao", label: "Autogestão", authOnly: true },
  { to: "/admin", label: "Admin", adminOnly: true },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const favCount = useApp((s) => s.favorites.length);
  const user = useUser();
  const isAdmin = useIsAdmin();
  const signOut = useApp((s) => s.signOut);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () => NAV.filter((n) => (!("adminOnly" in n) || isAdmin) && (!("authOnly" in n) || !!user)),
    [isAdmin, user],
  );

  useEffect(() => setOpen(false), [pathname, hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Faz o /#ingresso funcionar de fato ao chegar de outra rota */
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() =>
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }),
    );
  }, [hash, pathname]);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      openerRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab" || !panelRef.current) return;
      const els = [
        ...panelRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])"),
      ].filter((el) => el.offsetParent !== null);
      if (!els.length) return;
      const [first, last] = [els[0], els[els.length - 1]];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const goTicket = useCallback(() => {
    setOpen(false);
    if (pathname === "/") {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document
        .getElementById("ingresso")
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    } else {
      navigate("/#ingresso");
    }
  }, [pathname, navigate]);

  const logout = useCallback(() => {
    signOut();
    setOpen(false);
    navigate("/", { replace: true });
  }, [signOut, navigate]);

  const link = ({ isActive }: { isActive: boolean }) =>
    [
      "relative py-2 text-sm font-bold transition-colors",
      "after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:bg-sun after:transition-all",
      "rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-une focus-visible:ring-offset-4",
      isActive ? "text-une after:w-full" : "text-night after:w-0 hover:text-une hover:after:w-full",
    ].join(" ");

  const first = user?.name.split(" ")[0] ?? "";

  return (
    <>
      {/* Skip link vive no SiteLayout apontando pra #main — não duplicar aqui */}
      <header
        className={`sticky top-0 z-50 border-b border-night/10 bg-white/90 backdrop-blur-md transition-shadow ${
          scrolled ? "shadow-soft" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3">
          <Link
            to="/"
            aria-label="UNE&FICA — página inicial"
            className="shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-une"
          >
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
            {items.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === "/"} className={link}>
                {n.label}
                {n.to === "/admin" && (
                  <ShieldCheck className="ml-1 inline h-3.5 w-3.5 text-une" aria-hidden="true" />
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/programacao"
              className="relative hidden rounded-full p-2 transition-colors hover:bg-night/5 sm:block"
              aria-label={
                favCount
                  ? `Meu roteiro: ${favCount} ${favCount === 1 ? "atração" : "atrações"}`
                  : "Meu roteiro (vazio)"
              }
            >
              <Heart
                className="h-5 w-5 text-heart"
                fill={favCount ? "currentColor" : "none"}
                aria-hidden="true"
              />
              {favCount > 0 && (
                <span
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-heart px-1 text-[10px] font-bold text-white"
                  aria-hidden="true"
                >
                  {favCount > 9 ? "9+" : favCount}
                </span>
              )}
            </Link>

            <button onClick={goTicket} className="btn-sun hidden text-sm md:inline-flex">
              <Ticket className="h-4 w-4" aria-hidden="true" /> Garantir Ingresso
            </button>

            {/* Sessão */}
            {user ? (
              <div className="hidden items-center gap-2 lg:flex">
                <span
                  className="flex items-center gap-1.5 rounded-full bg-night/5 px-3 py-1.5 text-sm font-bold text-night"
                  title={user.email}
                >
                  <User className="h-3.5 w-3.5 text-une" aria-hidden="true" />
                  {first}
                </span>
                <button
                  onClick={logout}
                  className="rounded-full p-2 text-night/50 transition-colors hover:bg-night/5 hover:text-heart"
                  aria-label={`Sair da conta de ${user.name}`}
                  title="Sair"
                >
                  <LogOut className="h-4.5 w-4.5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-night transition-colors hover:bg-night/5 hover:text-une lg:inline-flex"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" /> Entrar
              </Link>
            )}

            <button
              ref={openerRef}
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={open}
              aria-controls="menu-mobile"
              className="rounded-full p-2 transition-colors hover:bg-night/5 lg:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="animate-rise fixed inset-0 z-[60] overflow-y-auto bg-night text-white lg:hidden"
          >
            <div
              className="pointer-events-none absolute right-0 top-0 h-full w-10 text-sun opacity-90"
              aria-hidden="true"
            >
              <ZigZagDivider teeth={20} />
            </div>

            <div className="relative flex items-center justify-between px-5 py-4">
              <span className="display text-lg">
                <span className="text-fica">UNE</span>
                <span className="text-sun">&</span>FICA
              </span>
              <button
                ref={closeRef}
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="rounded-full p-1 transition-colors hover:bg-white/10"
              >
                <X className="h-7 w-7" aria-hidden="true" />
              </button>
            </div>

            {user && (
              <p className="relative px-8 text-sm text-white/60">
                Olá, <strong className="text-fica">{first}</strong>
                {isAdmin && <span className="ml-2 text-xs font-bold text-sun">· ADMIN</span>}
              </p>
            )}

            <nav
              className="relative mt-4 flex flex-col gap-1 px-8 pb-12"
              aria-label="Navegação principal"
            >
              {items.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `display py-2 text-3xl transition-colors ${
                      isActive ? "text-sun" : "text-white hover:text-fica"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}

              {favCount > 0 && (
                <Link
                  to="/programacao"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold"
                >
                  <Heart className="h-4 w-4 text-heart" fill="currentColor" aria-hidden="true" />
                  Meu roteiro ({favCount})
                </Link>
              )}

              <button onClick={goTicket} className="btn-sun mt-8 justify-center">
                <Ticket className="h-4 w-4" aria-hidden="true" /> Garantir Ingresso
              </button>

              {user ? (
                <button
                  onClick={logout}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/20 py-3 font-bold text-white/80 transition-colors hover:border-heart hover:text-heart"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Sair da conta
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/20 py-3 font-bold text-white/80 transition-colors hover:border-sun hover:text-sun"
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" /> Entrar
                </Link>
              )}
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
