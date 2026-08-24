// App.tsx
import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { RequireAuth } from "./components/RequireAuth";

/* Rotas de entrada: eager */
import Home from "./pages/Home";
import Vitrine from "./pages/Vitrine";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

/* O resto sob demanda */
const Programacao = lazy(() => import("./pages/Programacao"));
const Inscricao = lazy(() => import("./pages/Inscricao"));
const ArtistPublic = lazy(() => import("./pages/ArtistPublic"));
const Admin = lazy(() => import("./pages/Admin"));
const SemAcesso = lazy(() => import("./pages/SemAcesso"));
const Privacidade = lazy(() => import("./pages/Privacidade"));
const Acessibilidade = lazy(() => import("./pages/Acessibilidade"));

/* Hub de Autogestão */
const Dashboard = lazy(() => import("./pages/autogestao/Dashboard"));
const Guias = lazy(() => import("./pages/autogestao/Guias"));
const MediaKit = lazy(() => import("./pages/autogestao/MediaKit"));
const Mentores = lazy(() => import("./pages/autogestao/Mentores"));
const Editais = lazy(() => import("./pages/autogestao/Editais"));

/* Sobe a página e devolve o foco ao conteúdo a cada navegação */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return; // deixa o Header cuidar do scroll até a âncora
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}

function Fallback() {
  return (
    <div className="grid min-h-[60dvh] place-items-center" role="status" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-night/10 border-t-une" />
      <span className="sr-only">Carregando…</span>
    </div>
  );
}

/** Layout público: Header + Footer + skip link */
function SiteLayout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-sun focus:px-5 focus:py-3 focus:font-bold focus:text-night"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="min-h-[60dvh] outline-none">
        <Suspense fallback={<Fallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Login em tela cheia, sem Header/Footer */}
        <Route
          path="/login"
          element={
            <Suspense fallback={<Fallback />}>
              <Login />
            </Suspense>
          }
        />

        <Route element={<SiteLayout />}>
          {/* Público */}
          <Route index element={<Home />} />
          <Route path="vitrine" element={<Vitrine />} />
          <Route path="programacao" element={<Programacao />} />
          <Route path="inscricao" element={<Inscricao />} />
          <Route path="artista/:slug" element={<ArtistPublic />} />
          <Route path="privacidade" element={<Privacidade />} />
          <Route path="acessibilidade" element={<Acessibilidade />} />
          <Route path="sem-acesso" element={<SemAcesso />} />

          {/* Hub — requer sessão */}
          <Route path="autogestao" element={<RequireAuth />}>
            <Route index element={<Dashboard />} />
            <Route path="guias" element={<Guias />} />
            <Route path="media-kit" element={<MediaKit />} />
            <Route path="mentores" element={<Mentores />} />
            <Route path="editais" element={<Editais />} />
            <Route path="*" element={<Navigate to="/autogestao" replace />} />
          </Route>

          {/* Admin — requer papel admin */}
          <Route path="admin" element={<RequireAuth role="admin" />}>
            <Route index element={<Admin />} />
          </Route>

          {/* Aliases */}
          <Route path="hub/*" element={<Navigate to="/autogestao" replace />} />
          <Route path="artistas" element={<Navigate to="/vitrine" replace />} />
          <Route path="agenda" element={<Navigate to="/programacao" replace />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
