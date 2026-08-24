import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, FileText, Users, Radar, ArrowRight, Sparkles, CheckCircle2, AlertCircle,
} from "lucide-react";
import { StarBadge } from "../../brand/StarBadge";
import { BlockCut } from "../../brand/BlockCut";
import { useApp, useOverallProgress } from "../../store/useApp";
import { GUIDES, MENTORS, GRANTS } from "../../data/content";

const DAY = 86_400_000;

export default function Dashboard() {
  const progress = useOverallProgress();
  const completedGuides = useApp((s) => s.completedGuides);
  const kitProgress = useApp((s) => s.kitProgress);

  const done = progress >= 100;
  const started = progress > 0;

  const { openGrants, urgent } = useMemo(() => {
    const now = Date.now();
    const open = GRANTS.filter((g) => g.status === "aberto");
    return {
      openGrants: open.length,
      urgent: open
        .map((g) => ({ ...g, days: Math.ceil((+new Date(g.deadline) - now) / DAY) }))
        .filter((g) => g.days >= 0 && g.days <= 14)
        .sort((a, b) => a.days - b.days)[0],
    };
  }, []);

  /* Próximo passo sugerido — tira o usuário da paralisia de escolha */
  const next = useMemo(() => {
    if (kitProgress < 100)
      return {
        to: "/autogestao/media-kit",
        label: kitProgress === 0 ? "Comece pelo Media Kit" : "Termine seu Media Kit",
        hint: `${100 - kitProgress}% restantes para o selo Perfil PRO`,
      };
    if (completedGuides.length < GUIDES.length) {
      const g = GUIDES.find((x) => !completedGuides.includes(x.id));
      return {
        to: `/autogestao/guias/${g?.id ?? ""}`,
        label: `Continuar: ${g?.title ?? "Trilhas de Estudo"}`,
        hint: `${g?.readTime ?? 5} min de leitura`,
      };
    }
    return {
      to: "/autogestao/editais",
      label: "Inscreva-se em um edital",
      hint: `${openGrants} ${openGrants === 1 ? "oportunidade aberta" : "oportunidades abertas"}`,
    };
  }, [kitProgress, completedGuides, openGrants]);

  const CARDS = [
    {
      to: "/autogestao/guias",
      Icon: BookOpen,
      title: "Trilhas de Estudo",
      badge: `${completedGuides.length}/${GUIDES.length} concluídos`,
      color: "bg-une",
      complete: completedGuides.length === GUIDES.length,
    },
    {
      to: "/autogestao/media-kit",
      Icon: FileText,
      title: "Gerador de Media Kit",
      badge: `${kitProgress}% completo`,
      color: "bg-sun",
      complete: kitProgress === 100,
    },
    {
      to: "/autogestao/mentores",
      Icon: Users,
      title: "Mural de Mentores",
      badge: `${MENTORS.length} mentores`,
      color: "bg-fica",
    },
    {
      to: "/autogestao/editais",
      Icon: Radar,
      title: "Radar de Editais",
      badge: `${openGrants} ${openGrants === 1 ? "aberto" : "abertos"}`,
      color: "bg-night",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="display text-3xl text-night sm:text-4xl">
        Hub de Autogestão e Carreira Cultural
      </h1>
      <div className="mt-4 h-1 w-24 bg-sun" aria-hidden="true" />
      <p className="mt-4 max-w-2xl text-night/70">
        Aprenda, organize sua carreira e acesse oportunidades. Tudo o que você precisa
        para transformar sua arte em profissão — sem sair do Ibura.
      </p>

      {/* Progresso */}
      <div className="mt-8 max-w-xl">
        <div className="flex items-center justify-between text-sm font-bold text-night">
          <span>Seu progresso geral</span>
          <span className={done ? "text-emerald-600" : "text-une"}>
            {done && <CheckCircle2 className="mr-1 inline h-4 w-4" aria-hidden="true" />}
            {progress}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso geral na jornada de autogestão"
          className="mt-2 h-3 overflow-hidden rounded-full bg-night/10"
        >
          <div
            className={`h-full rounded-full transition-[width] duration-700 ease-out ${
              done ? "bg-emerald-500" : "bg-gradient-to-r from-une to-sun"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-night/50">
          {done
            ? "Jornada completa. Você está pronto pra disputar qualquer edital! 🎉"
            : started
              ? "Cada passo aqui vira argumento na sua próxima proposta."
              : "Comece por qualquer trilha — leva menos de 10 minutos."}
        </p>
      </div>

      {/* Próximo passo */}
      {!done && (
        <Link
          to={next.to}
          className="group mt-6 inline-flex max-w-xl items-center gap-4 rounded-2xl bg-une/10 p-4 ring-1 ring-une/20 transition-colors hover:bg-une/15"
        >
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-une">
            <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-une">Próximo passo</p>
            <p className="truncate font-bold text-night">{next.label}</p>
            <p className="truncate text-xs text-night/60">{next.hint}</p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-une transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}

      {/* Alerta de prazo */}
      {urgent && (
        <Link
          to="/autogestao/editais"
          className="mt-4 flex max-w-xl items-center gap-3 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200 transition-colors hover:bg-amber-100"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
          <p className="text-sm font-semibold text-amber-900">
            <strong>{urgent.title}</strong> encerra{" "}
            {urgent.days === 0 ? "hoje" : urgent.days === 1 ? "amanhã" : `em ${urgent.days} dias`}.
          </p>
        </Link>
      )}

      {/* Cards */}
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ to, Icon, title, badge, color, complete }) => (
          <li key={to}>
            <Link
              to={to}
              className="card group flex h-full flex-col p-7 transition-shadow hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-une"
            >
              <div className="flex items-start justify-between">
                <div className={`grid h-14 w-14 place-items-center rounded-2xl ${color}`}>
                  <Icon className="h-7 w-7 text-white" aria-hidden="true" />
                </div>
                {complete && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-label="Concluído" />
                )}
              </div>
              <h2 className="display mt-5 text-lg leading-tight text-night">{title}</h2>
              <span className="mt-3 inline-block w-fit rounded-full bg-night/5 px-3 py-1 text-xs font-bold text-night/70">
                {badge}
              </span>
              <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-bold text-une transition-all group-hover:gap-2">
                Acessar <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Selo */}
      <section className="relative mt-14 overflow-hidden rounded-2xl bg-night p-8 text-white sm:p-12">
        <BlockCut corner="br" />
        <div className="relative flex flex-col items-center gap-8 sm:flex-row">
          <div className="shrink-0">
            <StarBadge size={130}>
              <span className="display text-[9px] leading-tight text-fica">
                PERFIL<br />PRO
              </span>
            </StarBadge>
          </div>
          <div>
            {kitProgress === 100 ? (
              <>
                <h2 className="display text-2xl sm:text-3xl">
                  Selo <span className="text-sun">"Perfil Profissionalizado"</span> conquistado! 🎉
                </h2>
                <p className="mt-3 max-w-lg text-white/80">
                  Seu perfil já aparece em destaque na Vitrine. Agora é hora de aparecer:
                  mande seu Media Kit para contratantes e editais.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/vitrine" className="btn-sun">
                    Ver meu destaque <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/autogestao/editais"
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-bold transition-colors hover:bg-white/20"
                  >
                    Radar de Editais
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="display text-2xl sm:text-3xl">
                  Conclua seu Media Kit e receba o selo{" "}
                  <span className="text-sun">"Perfil Profissionalizado"</span>
                </h2>
                <p className="mt-3 max-w-lg text-white/80">
                  Perfis com selo aparecem em destaque na Vitrine e são priorizados nas
                  indicações para contratantes e editais.
                </p>
                <div className="mt-6 max-w-xs">
                  <div className="flex justify-between text-xs font-bold text-white/70">
                    <span>Media Kit</span>
                    <span className="text-sun">{kitProgress}%</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={kitProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Progresso do Media Kit"
                    className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/15"
                  >
                    <div
                      className="h-full rounded-full bg-sun transition-[width] duration-700"
                      style={{ width: `${kitProgress}%` }}
                    />
                  </div>
                </div>
                <Link to="/autogestao/media-kit" className="btn-sun mt-6">
                  {kitProgress > 0 ? "Continuar" : "Completar"} Media Kit{" "}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
