import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, ArrowLeft, Compass } from "lucide-react";

const SUGGESTIONS = [
  { to: "/vitrine", label: "Vitrine de Artistas" },
  { to: "/programacao", label: "Programação" },
  { to: "/autogestao", label: "Hub de Autogestão" },
  { to: "/inscricao", label: "Fazer inscrição" },
];

export default function NotFound() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  return (
    <section className="mx-auto grid max-w-2xl place-items-center px-6 py-24 text-center">
      <Compass className="h-16 w-16 text-night/15" aria-hidden="true" />
      <p className="display mt-6 text-6xl text-une">404</p>
      <h1 className="display mt-2 text-2xl text-night sm:text-3xl">
        Essa página não existe (ainda)
      </h1>
      <div className="mt-4 h-1 w-16 bg-sun" aria-hidden="true" />
      <p className="mt-4 text-night/70">
        Não encontramos <code className="font-bold text-night">{pathname}</code>. Mas
        tem muita coisa boa rolando por aqui.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={() => nav(-1)} className="btn bg-night/10 text-night">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar
        </button>
        <Link to="/" className="btn-une">
          <Home className="h-4 w-4" aria-hidden="true" /> Ir para o início
        </Link>
      </div>

      <ul className="mt-10 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              className="rounded-full bg-night/5 px-4 py-2 text-sm font-bold text-night transition-colors hover:bg-sun"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
