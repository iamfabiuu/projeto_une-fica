import { Link } from "react-router-dom";
import {
  Music,
  UtensilsCrossed,
  Palette,
  Users,
  ArrowRight,
  QrCode,
} from "lucide-react";
import { ZigZagDivider } from "../brand/ZigZagDivider";
import { StarBadge } from "../brand/StarBadge";
import { BlockCut } from "../brand/BlockCut";
import { CountUp } from "../components/CountUp";
import { ZigZagWheel } from "../brand/ZigZagWheel";
import { Reveal } from "../components/Reveal";
import { motion } from "framer-motion";

const EXPECT = [
  {
    icon: Music,
    title: "Música ao Vivo",
    text: "Forró, maracatu, rap e frevo em três palcos comunitários.",
  },
  {
    icon: UtensilsCrossed,
    title: "Gastronomia Local",
    text: "A cozinha do Ibura na Tenda Gastronômica, do bolo de rolo ao baião.",
  },
  {
    icon: Palette,
    title: "Artesanato Autêntico",
    text: "Bordado, cerâmica e muralismo feitos por mestras e mestres do bairro.",
  },
  {
    icon: Users,
    title: "Oficinas Comunitárias",
    text: "Formação gratuita com certificado emitido pelo UneHUB.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-night text-white">
        {/* glow ambiente */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 bg-[url('/assets/header-background.jpg')] bg-cover bg-center opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-52 left-1/4 h-[30rem] w-[30rem] rounded-full bg-sun/15 blur-[120px]"
        />

        <div className="relative mx-auto grid max-w-7xl items-stretch lg:grid-cols-[1.05fr_1fr]">
          {/* ── COLUNA TEXTO ── */}
          <div className="relative z-20 px-6 py-24 sm:px-10 lg:py-32 lg:pr-20">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] text-fica backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sun" />
              </span>
              IBURA · RECIFE/PE · 3 DIAS DE FESTA
            </p>

            <h1 className="display text-balance text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight">
              <span className="block">
                Orgulho que{" "}
                <span className="relative inline-block text-fica">
                  UNE
                  <svg
                    aria-hidden
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 h-2 w-full text-sun/70"
                  >
                    <path
                      d="M0 6 Q25 0 50 5 T100 3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
              <span className="mt-1 block">
                Cultura que <span className="text-sun">FICA</span>
              </span>
            </h1>

            <p className="mt-7 max-w-md text-pretty text-lg leading-relaxed text-white/75">
              O Ibura é muito mais do que os rótulos que recebe. Aqui, cultura é{" "}
              <strong className="font-semibold text-white">economia</strong>, é{" "}
              <strong className="font-semibold text-white">currículo</strong> e
              é{" "}
              <strong className="font-semibold text-white">
                pertencimento
              </strong>
              .
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/inscricao"
                className="btn-sun group shadow-[0_8px_30px_-8px] shadow-sun/50"
              >
                Quero Participar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/programacao" className="btn-ghost">
                Ver Programação
              </Link>
            </div>
          </div>

          <div className="relative min-h-[700px] lg:min-h-[900px]">
            {/* A MULHER */}
            <img
              src="/assets/woman-background (1).png"
              alt="Foliã em cortejo de carnaval no Ibura"
              className="absolute inset-0 z-10 h-full w-full origin-bottom scale-[1.3] object-contain object-bottom"
            />
          </div>

          {/* ── RODA SERRILHADA (recorte animado) ── */}
          <ZigZagWheel
            teeth={30}
            className="pointer-events-none absolute left-0 top-1/2 z-10 hidden h-[170vh] w-[170vh] -translate-x-[48%] -translate-y-1/2 lg:block"
          />
        </div>

        {/* grão sutil */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </section>

      {/* CONTADOR */}
      <section className="border-b border-night/10 bg-white">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-14 text-center sm:grid-cols-3">
          {[
            { v: 50, pre: "+", suf: "", l: "Artistas do Ibura", c: "text-une" },
            { v: 3, pre: "", suf: "", l: "Dias de Festa", c: "text-sun" },
            { v: 100, pre: "", suf: "%", l: "Comunitário", c: "text-fica" },
          ].map((k) => (
            <div key={k.l}>
              <p className={`display text-5xl ${k.c}`}>
                <CountUp to={k.v} prefix={k.pre} suffix={k.suf} />
              </p>
              <p className="mt-2 text-sm font-bold uppercase tracking-wider text-night/60">
                {k.l}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEMÁTICA */}
      <section className="relative overflow-hidden bg-night text-white">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <motion.div
            className="relative h-72 overflow-hidden lg:h-auto"
            initial={{ opacity: 0, scale: 1.08 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/assets/agosto31ateurbanaibura-840x560.jpg"
              alt="Família no mirante do Ibura com mural Eu Amo Ibura"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {/* emenda com o fundo escuro */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-night/40 via-transparent to-night lg:to-night"
            />
          </motion.div>

          <div className="relative px-6 py-16 lg:px-14">
            <Reveal>
              <span className="display text-5xl text-une">01</span>
              <h2 className="display mt-2 text-3xl sm:text-4xl">
                Problemática
              </h2>
            </Reveal>

            <motion.div
              className="mt-4 h-1 bg-une"
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            />

            <Reveal delay={0.35}>
              <p className="mt-8 text-lg leading-relaxed text-white/85">
                O Ibura é muito mais do que os rótulos que recebe. O{" "}
                <b className="text-sun">preconceito</b> territorial reduz
                oportunidades, <b className="text-sun">invisibiliza</b> talentos
                e <b className="text-sun">enfraquece</b> o orgulho de quem chama
                esse lugar de lar.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DADOS */}
      <section className="relative overflow-hidden bg-night py-24 text-white">
        <BlockCut corner="tl" />
        <BlockCut corner="br" />

        {/* glow ambiente */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-une/20 blur-[130px]"
        />

        <div className="relative mx-auto max-w-4xl px-6">
          <Reveal>
            <span className="display text-5xl text-une">02</span>
            <h2 className="display mt-2 text-3xl sm:text-4xl">Dados</h2>
          </Reveal>

          <motion.div
            className="mt-4 h-1 bg-une"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />

          {/* CITAÇÃO EM DESTAQUE */}
          <Reveal delay={0.15}>
            <figure className="relative mt-12 rounded-2xl border-l-4 border-sun bg-white/[0.04] p-8 backdrop-blur-sm sm:p-10">
              <span
                aria-hidden
                className="display pointer-events-none absolute -top-8 left-4 select-none text-[8rem] leading-none text-sun/15"
              >
                "
              </span>
              <blockquote className="display relative text-balance text-2xl leading-snug text-sun sm:text-3xl">
                Quando digo que sou do Ibura, perguntam se só tem violência.
                Morar aqui é um ato de resistência, mas também é arte e poesia.
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 text-sm text-white/60">
                <span className="h-px w-8 bg-sun/60" />
                <span className="italic">
                  Jovem morador · iniciativa{" "}
                  <b className="not-italic text-white/80">
                    #AgendaCidadeUNICEF
                  </b>
                </span>
              </figcaption>
            </figure>
          </Reveal>

          {/* MÉTRICAS */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { v: 2022, suf: "–24", l: "período do relatório" },
              { v: 1, pre: "#", l: "estigma como maior barreira" },
              { v: 100, suf: "%", l: "de talento invisibilizado" },
            ].map((k, i) => (
              <Reveal key={k.l} delay={0.3 + i * 0.1}>
                <div className="group h-full rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-sun/40">
                  <p className="display text-3xl text-sun">
                    {k.pre}
                    <CountUp to={k.v} suffix={k.suf ?? ""} />
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/50">
                    {k.l}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <p className="mt-12 max-w-2xl text-lg leading-relaxed text-white/85">
              O relatório da <b className="text-sun">UNICEF</b>, realizado entre
              2022 e 2024, aponta que jovens do Ibura enfrentam o estigma
              recorrente de morar em um bairro associado à violência — o que
              afeta diretamente sua <b className="text-sun">autoestima</b> e
              limita o acesso a <b className="text-sun">oportunidades</b>{" "}
              sociais e profissionais.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="relative overflow-hidden bg-white py-24">
        {/* textura de fundo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full bg-fica/10 blur-[120px]"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[auto_1fr]">
          {/* SELO PNG COM ENTRADA GIRANDO */}
          <motion.div
            className="mx-auto"
            initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.img
              src="../../public/assets/une-fica-celo.png"
              alt="Selo Une & Fica"
              width={400}
              height={400}
              loading="lazy"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="h-auto w-[300px] select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)] sm:w-[260px]"
            />
          </motion.div>

          <div>
            <Reveal>
              <span className="display text-5xl text-une">03</span>
              <h2 className="display mt-2 text-3xl text-night sm:text-4xl">
                Solução
              </h2>
            </Reveal>

            <motion.div
              className="mt-4 h-1 bg-une"
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />

            <Reveal delay={0.2}>
              <p className="mt-8 text-xl leading-relaxed text-night/80">
                Transformamos espaços públicos, como o{" "}
                <b className="text-une">COMPAZ</b>, em pontos de encontro,
                cultura e oportunidades — conectando pessoas para fortalecer o{" "}
                <b className="text-une">orgulho</b>, a economia criativa e o
                sentimento de <b className="text-une">pertencimento</b>.
              </p>
            </Reveal>

            {/* PILARES */}
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                {
                  t: "Ocupar",
                  d: "espaços públicos viram palco",
                  c: "border-une",
                },
                {
                  t: "Conectar",
                  d: "artistas, moradores e cidade",
                  c: "border-sun",
                },
                {
                  t: "Prosperar",
                  d: "economia criativa local",
                  c: "border-fica",
                },
              ].map((p, i) => (
                <Reveal key={p.t} delay={0.35 + i * 0.1}>
                  <div
                    className={`h-full rounded-xl border-l-4 ${p.c} bg-night/[0.03] p-4 transition-transform hover:-translate-y-1`}
                  >
                    <p className="display text-lg text-night">{p.t}</p>
                    <p className="mt-1 text-sm leading-snug text-night/60">
                      {p.d}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* O QUE ESPERAR */}
      <section className="relative overflow-hidden bg-white pb-24">
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="display text-center text-3xl text-night sm:text-4xl">
              O que esperar
            </h2>
          </Reveal>

          <motion.div
            className="mx-auto mt-4 h-1 bg-sun"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {EXPECT.map(({ icon: Icon, title, text }, i) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -8 }}
                className="card group relative overflow-hidden p-7"
              >
                {/* número fantasma */}
                <span
                  aria-hidden
                  className="display pointer-events-none absolute -right-1 -top-3 select-none text-6xl leading-none text-night/[0.06] transition-colors group-hover:text-sun/25"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* brilho que atravessa no hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-x-10 -top-20 h-40 -rotate-12 bg-gradient-to-r from-transparent via-sun/20 to-transparent opacity-0 transition-all duration-700 group-hover:translate-y-64 group-hover:opacity-100"
                />

                <motion.div
                  whileHover={{ rotate: -8, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="relative grid h-14 w-14 place-items-center rounded-2xl bg-night transition-colors group-hover:bg-sun"
                >
                  <Icon className="h-7 w-7 text-white transition-colors group-hover:text-night" />
                </motion.div>

                <h3 className="display relative mt-5 text-lg text-night">
                  {title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-night/70">
                  {text}
                </p>

                {/* barra que cresce na base */}
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-1 w-0 bg-sun transition-all duration-500 group-hover:w-full"
                />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* UNEHUB */}
      <section className="relative overflow-hidden bg-night py-24 text-white">
        <BlockCut corner="tl" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-une/25 blur-[120px]"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal>
              <span className="display text-5xl text-une">05</span>
              <h2 className="display mt-2 text-3xl sm:text-4xl">
                Une<span className="text-sun">HUB</span>
              </h2>
            </Reveal>

            <motion.div
              className="mt-4 h-1 bg-une"
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />

            <Reveal delay={0.15}>
              <p className="mt-6 max-w-md text-lg text-white/70">
                É tipo uma feira do bairro, mas que{" "}
                <b className="text-sun">nunca fecha</b> e não tem fila no caixa.
              </p>
            </Reveal>

            {/* PILLS QUE ENTRAM PULANDO */}
            <div className="mt-8 space-y-4">
              {[
                {
                  t: "Vitrine Virtual Permanente",
                  j: "seu talento em exposição 24h — sem precisar de toldo",
                  c: "bg-sun text-night",
                },
                {
                  t: "Ponte para Investimentos e Parcerias",
                  j: "porque boa ideia sem grana é só um bom papo",
                  c: "bg-une text-white",
                },
                {
                  t: "Central de Cadastros e Certificados",
                  j: "adeus, pasta de plástico com papel amassado",
                  c: "bg-sun text-night",
                },
              ].map((p, i) => (
                <motion.div
                  key={p.t}
                  initial={{ opacity: 0, x: -30, rotate: -3 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 14,
                    delay: 0.25 + i * 0.12,
                  }}
                  whileHover={{ x: 8, rotate: 1 }}
                  className="group cursor-default"
                >
                  <p className={`pill ${p.c}`}>{p.t}</p>
                  <p className="mt-1 max-h-0 overflow-hidden pl-1 text-xs italic text-white/50 transition-all duration-500 group-hover:max-h-10">
                    ↳ {p.j}
                  </p>
                </motion.div>
              ))}
            </div>

            <Reveal delay={0.6}>
              <Link to="/autogestao" className="btn-ghost group mt-8">
                Entrar no Hub de Autogestão
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </Reveal>
          </div>

          {/* MOCKUP */}
          <motion.div
            className="mx-auto flex items-center gap-6"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* QR com legenda safada */}
            <motion.div
              whileHover={{ scale: 1.06, rotate: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="group relative"
            >
              <div className="grid h-32 w-32 place-items-center rounded-2xl bg-white">
                <QrCode
                  className="h-24 w-24 text-night"
                  aria-label="QR Code de acesso ao UneHUB"
                />
              </div>
              <p className="absolute -bottom-9 left-0 w-32 text-center text-[11px] font-bold uppercase tracking-wide text-white/40 transition-colors group-hover:text-sun">
                aponta a câmera aí 👀
              </p>
            </motion.div>

            {/* "celular" flutuando */}
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 1.5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.04 }}
              className="grid h-72 w-40 place-items-center rounded-[2rem] border-8 border-white/90 bg-white shadow-soft"
            >
              <div className="text-center">
                <span className="display text-xl">
                  <span className="text-une">UNE</span>
                  <span className="text-sun">HUB</span>
                </span>
                <p className="mt-2 px-3 text-[10px] leading-tight text-night/40">
                  100% livre de
                  <br />
                  bateria em 1%
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CHAMADA ARTISTAS */}
      <section
        id="ingresso"
        className="relative overflow-hidden bg-une py-20 text-white"
      >
        <div className="absolute inset-y-0 left-0 w-12 opacity-80">
          <ZigZagDivider teeth={18} />
        </div>
        <div className="absolute inset-y-0 right-0 w-12 rotate-180 opacity-80">
          <ZigZagDivider teeth={18} />
        </div>

        {/* holofote */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-sun/25 blur-[100px]"
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <p className="mb-4 inline-block rounded-full border border-sun/50 bg-night/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-sun">
              inscrições abertas · vagas limitadas
            </p>
            <h2 className="display text-balance text-4xl leading-tight sm:text-5xl">
              Sua arte merece{" "}
              <span className="relative inline-block">
                esse palco
                <motion.span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-1.5 rounded-full bg-sun"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                />
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/90">
              Inscreva-se <b className="text-sun">de graça</b>, monte seu Media
              Kit e apareça na vitrine que conecta o Ibura ao mundo. Sim, o
              mundo todo — incluindo sua tia que duvidava.
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 320, damping: 16 }}
              >
                <Link
                  to="/inscricao"
                  className="btn-sun group relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                >
                  <span className="relative z-10">Fazer minha inscrição</span>
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-white/40 transition-transform duration-700 group-hover:translate-x-full"
                  />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 320, damping: 16 }}
              >
                <Link to="/vitrine" className="btn-ghost group">
                  Conhecer os artistas
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </Link>
              </motion.div>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <p className="mt-6 text-xs text-white/50">
              Leva menos tempo que escolher série na Netflix. ⏱️
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
