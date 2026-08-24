import { Link } from "react-router-dom";
import { ShieldAlert, LogOut } from "lucide-react";
import { useApp, useUser } from "../store/useApp";

export default function SemAcesso() {
  const user = useUser();
  const signOut = useApp((s) => s.signOut);

  return (
    <section className="mx-auto grid max-w-lg place-items-center px-6 py-24 text-center">
      <ShieldAlert className="h-14 w-14 text-heart" aria-hidden="true" />
      <h1 className="display mt-6 text-2xl text-night sm:text-3xl">
        Acesso restrito
      </h1>
      <div className="mt-4 h-1 w-16 bg-sun" aria-hidden="true" />
      <p className="mt-4 text-night/70">
        {user
          ? `Sua conta (${user.email}) não tem permissão de administração. Se isso parece errado, fale com a coordenação.`
          : "Você precisa entrar com uma conta autorizada."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/autogestao" className="btn-une">
          Ir para meu Hub
        </Link>
        {user && (
          <button onClick={signOut} className="btn bg-night/10 text-night">
            <LogOut className="h-4 w-4" aria-hidden="true" /> Trocar de conta
          </button>
        )}
      </div>
    </section>
  );
}
