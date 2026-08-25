// pages/Login.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "../brand/Logo";
import { ZigZagDivider } from "../brand/ZigZagDivider";
import { useApp } from "../store/useApp";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState({ email: false, pass: false });
  const emailRef = useRef<HTMLInputElement>(null);

  const signIn = useApp((s) => s.signIn);
  const loading = useApp((s) => s.authLoading);
  const error = useApp((s) => s.authError);
  const user = useApp((s) => s.user);

  const nav = useNavigate();
  const { state } = useLocation() as { state?: { from?: string } };
  const from = state?.from;

  useEffect(() => emailRef.current?.focus(), []);

  /* Já logado? Não faz sentido ver o login */
  useEffect(() => {
    if (user)
      nav(from ?? (user.role === "admin" ? "/admin" : "/autogestao"), {
        replace: true,
      });
  }, [user, from, nav]);

  const eErr =
    touched.email && !isEmail(email) ? "Informe um e-mail válido." : "";
  const pErr = touched.pass && pass.length < 6 ? "Mínimo de 6 caracteres." : "";
  const valid = isEmail(email) && pass.length >= 6;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, pass: true });
    if (!valid) return;
    try {
      const u = await signIn(email, pass);
      nav(from ?? (u.role === "admin" ? "/admin" : "/autogestao"), {
        replace: true,
      });
    } catch {
      /* erro já está no store */
    }
  };

  const fill = (m: string) => {
    setEmail(m);
    setPass("ibura123");
    setTouched({ email: false, pass: false });
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Lado marca */}
      <aside className="relative hidden overflow-hidden bg-night p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute right-0 top-0 h-full w-8 text-sun opacity-90"
          aria-hidden="true"
        >
          <ZigZagDivider teeth={24} />
        </div>
        <Logo variant="light" />
        <div>
          <p className="display text-4xl leading-tight">
            Orgulho que <span className="text-une">UNE</span>,
            <br />
            Cultura que <span className="text-fica">FICA</span>.
          </p>
          <p className="mt-4 max-w-sm text-white/70">
            Entre para gerenciar a programação, curar a Vitrine e acompanhar as
            inscrições do UneHUB.
          </p>
        </div>
        <p className="text-xs text-white/40">Ibura, Recife — PE</p>
      </aside>

      {/* Formulário */}
      <main className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>

          <h1 className="display mt-8 text-3xl text-night lg:mt-0">Entrar</h1>
          <div className="mt-3 h-1 w-16 bg-sun" aria-hidden="true" />
          <p className="mt-4 text-sm text-night/60">
            Acesse sua conta para continuar
            {from && <span className="font-bold text-night"> em {from}</span>}.
          </p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-bold text-night"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-night/40"
                  aria-hidden="true"
                />
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  aria-invalid={!!eErr}
                  aria-describedby={eErr ? "email-err" : undefined}
                  placeholder="voce@unefica.org"
                  className={`inp pl-11 ${eErr ? "border-heart" : ""}`}
                />
              </div>
              {eErr && (
                <p
                  id="email-err"
                  className="mt-1.5 text-xs font-semibold text-heart"
                >
                  {eErr}
                </p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="pass" className="text-sm font-bold text-night">
                  Senha
                </label>
                <Link
                  to="/recuperar-senha"
                  className="text-xs font-bold text-une hover:underline"
                >
                  Esqueci
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-night/40"
                  aria-hidden="true"
                />
                <input
                  id="pass"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, pass: true }))}
                  aria-invalid={!!pErr}
                  aria-describedby={pErr ? "pass-err" : undefined}
                  placeholder="••••••••"
                  className={`inp pl-11 pr-11 ${pErr ? "border-heart" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={show}
                  className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-night/40 hover:bg-night/5 hover:text-night"
                >
                  {show ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {pErr && (
                <p
                  id="pass-err"
                  className="mt-1.5 text-xs font-semibold text-heart"
                >
                  {pErr}
                </p>
              )}
            </div>

            {error && (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-xl bg-heart/10 p-3 text-sm font-semibold text-heart"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-une w-full justify-center disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />{" "}
                  Entrando…
                </>
              ) : (
                <>
                  Entrar <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>

            <span aria-live="polite" className="sr-only">
              {loading ? "Verificando credenciais" : ""}
            </span>
          </form>

          <p className="mt-6 text-center text-sm text-night/60">
            Ainda não tem conta?{" "}
            <Link
              to="/inscricao"
              className="font-bold text-une hover:underline"
            >
              Inscreva-se na Vitrine
            </Link>
          </p>

          {/* Acesso demo — remover em produção */}
          {import.meta.env.DEV && (
            <div className="mt-8 rounded-2xl bg-night/5 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-night/50">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />{" "}
                Acesso demo
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => fill("admin@unefica.org")}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-night hover:bg-sun"
                >
                  Entrar como Admin
                </button>
                <button
                  onClick={() => fill("artista@unefica.org")}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-night hover:bg-sun"
                >
                  Entrar como Artista
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
