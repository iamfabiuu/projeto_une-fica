// src/pages/Privacidade.tsx
export default function Privacidade() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="display text-3xl text-night">Política de Privacidade</h1>
      <div className="mt-4 h-1 w-24 bg-sun" aria-hidden="true" />
      <div className="mt-8 space-y-4 text-night/70">
        <p>
          O UneHUB coleta apenas os dados informados voluntariamente na inscrição
          da Vitrine (nome artístico, contato, portfólio) para fins de curadoria
          cultural.
        </p>
        <p>
          Progresso de trilhas, media kit e favoritos ficam salvos apenas no seu
          navegador (<code>localStorage</code>) e não são enviados a terceiros.
        </p>
        <p>
          Para solicitar exclusão de dados:{" "}
          <a href="mailto:contato@unefica.org" className="font-bold text-une hover:underline">
            contato@unefica.org
          </a>
          .
        </p>
      </div>
    </section>
  );
}
