import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Vitrine from "./pages/Vitrine";
import Programacao from "./pages/Programacao";
import Inscricao from "./pages/Inscricao";
import Admin from "./pages/Admin";
import ArtistPublic from "./pages/ArtistPublic";
import HubDashboard from "./pages/autogestao/Dashboard";
import Guias from "./pages/autogestao/Guias";
import MediaKit from "./pages/autogestao/MediaKit";
import Mentores from "./pages/autogestao/Mentores";
import Editais from "./pages/autogestao/Editais";

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vitrine" element={<Vitrine />} />
          <Route path="/programacao" element={<Programacao />} />
          <Route path="/inscricao" element={<Inscricao />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/artista/:slug" element={<ArtistPublic />} />
          <Route path="/autogestao" element={<HubDashboard />} />
          <Route path="/autogestao/guias" element={<Guias />} />
          <Route path="/autogestao/media-kit" element={<MediaKit />} />
          <Route path="/autogestao/mentores" element={<Mentores />} />
          <Route path="/autogestao/editais" element={<Editais />} />
          <Route
            path="*"
            element={
              <div className="p-24 text-center display text-3xl">
                404 — Página não encontrada
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
