# UNE&FICA 🎪

Plataforma do festival **UNE&FICA** — vitrine de artistas, programação de palcos e painel de curadoria do Ibura, Recife/PE.

> Três dias, quatro palcos, um só bairro.

---

## ✨ Funcionalidades

| Módulo | Descrição |
| --- | --- |
| **Vitrine** | Catálogo público de artistas aprovados, com busca e filtro por categoria |
| **Perfil do Artista** | Bio, galeria com lightbox, redes sociais, chave PIX e contato via WhatsApp |
| **Programação** | Timeline por dia (3 dias), abas acessíveis via teclado e "Meu Roteiro" com favoritos |
| **Inscrição** | Formulário de submissão de artistas com upload de mídia |
| **Painel de Gestão** | KPIs, moderação (aprovar/rejeitar) com _undo_, busca, ordenação e exportação CSV |
| **Trilhas** | Guias de formação com progresso ponderado (60% trilhas + 40% media kit) |

---

## 🛠 Stack

- **React 19** + **TypeScript**
- **Vite** — build e dev server
- **Tailwind CSS** — design system com tokens da marca
- **Zustand** (+ `persist`) — estado global em `localStorage`
- **React Router** — navegação SPA
- **Lucide React** / **React Icons** — ícones

---

## 🚀 Como rodar

```bash
# instalar dependências
npm install

# ambiente de desenvolvimento
npm run dev

# build de produção
npm run build

# pré-visualizar o build
npm run preview

# checagem de tipos e lint
npm run typecheck
npm run lint
Acesse http://localhost:5173.

📁 Estrutura


src/
├── brand/          # Componentes visuais da marca (StarBadge, ZigZagDivider)
├── components/     # UI reutilizável (Navbar, Footer, Cards)
├── data/
│   ├── content.ts  # SCHEDULE, ARTISTS, GUIDES (dados seed)
│   └── types.ts    # Artist, Status, Stage, CATEGORY_COLOR, STAGE_COLOR
├── pages/
│   ├── Vitrine.tsx
│   ├── ArtistPublic.tsx
│   ├── Programacao.tsx
│   ├── Inscricao.tsx
│   └── Admin.tsx
├── store/
│   └── useApp.ts   # Store Zustand + seletores derivados
└── main.tsx
🧠 Arquitetura do estado
O store não armazena a lista completa de artistas. O catálogo é derivado:



catálogo = submissions (locais) + ARTISTS (seed) com statusOverrides aplicados
Isso mantém o localStorage enxuto e evita duplicar o seed. Consuma sempre pelos hooks seletores, nunca acessando state.artists (que não existe):

tsx


import {
  useArtists,          // catálogo completo
  useApprovedArtists,  // apenas status "aprovado"
  useArtistBySlug,     // busca por slug
  usePendingCount,     // badge de moderação
  useIsFavorite,
  useIsGuideDone,
  useOverallProgress,
  useIsAdmin,
  useUser,
} from "./store/useApp";
⚠️ Boas práticas de seletores
Nunca crie objetos ou arrays dentro de um seletor inline (.find(), .filter(), .map()) — isso retorna uma referência nova a cada render e causa re-render infinito. Use os hooks com useMemo.
Fallbacks precisam de referência estável: use constantes de módulo (const EMPTY = []) em vez de ?? [] dentro do seletor.
🎨 Tokens de design
Cores customizadas no Tailwind:




Token	Uso
une	Primária — ações e links
fica	Secundária — destaques
sun	Acento — CTAs e detalhes
night	Texto e fundos escuros
heart	Favoritos
Utilitários: .display (fonte de títulos), .card, .btn-une, .btn-sun, .shadow-soft, .animate-rise.

♿ Acessibilidade
Abas da programação seguem o padrão ARIA (role="tablist", navegação por setas, tabIndex roving)
Estados dinâmicos anunciados com aria-live="polite"
Toggles com aria-pressed; ícones decorativos com aria-hidden
Lightbox como role="dialog" com aria-modal, fechamento por Esc e travamento de scroll
Foco visível em todos os elementos interativos (focus-visible:ring)
💾 Persistência e migrações
O estado é salvo em localStorage sob a chave unefica. Ao alterar o shape do estado, suba a version no persist e trate o merge — snapshots antigos podem sobrescrever o estado inicial com undefined.

Para resetar durante o desenvolvimento:

js


localStorage.clear(); location.reload();
📤 Exportação CSV
O painel exporta as inscrições filtradas em CSV com separador ; e BOM UTF-8 — abre corretamente no Excel em português sem quebrar acentuação.

🤝 Contribuindo
Crie uma branch: git checkout -b feat/minha-feature
Garanta que npm run typecheck e npm run lint passam
Abra um Pull Request descrevendo a mudança
Feito com 💛 no Ibura, Recife/PE.
