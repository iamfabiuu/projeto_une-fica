import { Link } from "react-router-dom";
import { BookOpen, FileText, Users, Radar, ArrowRight } from "lucide-react";
import { StarBadge } from "../../brand/StarBadge";
import { BlockCut } from "../../brand/BlockCut";
import { useApp, useOverallProgress } from "../../store/useApp";
import { GUIDES, MENTORS, GRANTS } from "../../data/content";

export default function Dashboard() {
  const progress = useOverallProgress();
  const { completedGuides, kitProgress } = useApp();

  const CARDS = [
    {
      to: "/autogestao/guias",
      icon: BookOpen,
      title: "Trilhas de Estudo",
      badge: `${completedGuides.length}/${GUIDES.length} concluídos`,
      color: "bg-une",
    },
    {
      to: "/autogestao/media-kit",
      icon: FileText,
      title: "Gerador de Media Kit",
      badge: `${kitProgress}% completo`,
      color: "bg-sun",
    },
    {
      to: "/autogestao/mentores",
      icon: Users,
      title: "Mural de Mentores",
      badge: `${MENTORS.length} mentores`,
      color: "bg-fica",
    },
    {
      to: "/autogestao/editais",
      icon: Radar,
      title: "Radar de Editais",
      badge: `${GRANTS.filter((g) => g.status === "aberto").length} abertos`,
      color: "bg-night",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="display text-3xl text-night sm:text-4xl">
        Hub de Autogestão e Carreira Cultural
      </h1>
      <div className="mt-4 h-1 w-24 bg-sun" />
      <p className="mt-4 max-w-2xl text-night/70">
        Aprenda, organize sua carreira e acesse oportunidades. Tudo o que você
        precisa para transformar sua arte em profissão — sem sair do Ibura.
      </p>

      <div className="mt-8 max-w-xl">
        <div className="flex justify-between text-sm font-bold text-night">
          <span>Seu progresso geral</span>
          <span className="text-une">{progress}%</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-night/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-une to-sun transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ to, icon: Icon, title, badge, color }) => (
          <Link key={to} to={to} className="card group p-7">
            <div
              className={`grid h-14 w-14 place-items-center rounded-2xl ${color}`}
            >
              <Icon className="h-7 w-7 text-white" />
            </div>
            <h2 className="display mt-5 text-lg leading-tight text-night">
              {title}
            </h2>
            <span className="mt-3 inline-block rounded-full bg-night/5 px-3 py-1 text-xs font-bold text-night/70">
              {badge}
            </span>
            <span className="mt-4 flex items-center gap-1 text-sm font-bold text-une group-hover:gap-2 transition-all">
              Acessar <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <section className="relative mt-14 overflow-hidden rounded-2xl bg-night p-8 text-white sm:p-12">
        <BlockCut corner="br" />
        <div className="relative flex flex-col items-center gap-8 sm:flex-row">
          <StarBadge size={130}>
            <span className="display text-[9px] leading-tight text-fica">
              PERFIL
              <br />
              PRO
            </span>
          </StarBadge>
          <div>
            <h2 className="display text-2xl sm:text-3xl">
              Conclua seu Media Kit e receba o selo{" "}
              <span className="text-sun">"Perfil Profissionalizado"</span>
            </h2>
            <p className="mt-3 max-w-lg text-white/80">
              Perfis com selo aparecem em destaque na Vitrine e são priorizados
              nas indicações para contratantes e editais.
            </p>
            <Link to="/autogestao/media-kit" className="btn-sun mt-6">
              Completar Media Kit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
