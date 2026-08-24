import type { Artist, Category, Community } from "./types";

/* ---------- helpers ---------- */

const PHOTO_COUNT = 8;

const img = (n: number) => {
  const i = ((n - 1) % PHOTO_COUNT) + 1; // nunca aponta pra arquivo inexistente
  return `/assets/a${i}.jpg`;
};

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const wa = (n: number) => `558199999${String(n).padStart(4, "0")}`;
const ig = (h: string) => `https://instagram.com/${h}`;
const sp = (h: string) => `https://open.spotify.com/artist/${h}`;
const yt = (h: string) => `https://youtube.com/@${h}`;
const at = (d: string, t = "09:00") => `${d}T${t}:00-03:00`; // Recife

/** Entrada enxuta: só o que é conteúdo de verdade */
type Seed = {
  n: number;
  name: string;
  category: Category;
  community: Community;
  bio: string;
  gallery?: number[];
  handle?: string;
  socials?: Partial<Artist["socials"]>;
  pix?: string;
  status?: Artist["status"];
  certified?: boolean;
  createdAt: string;
  time?: string;
};

const SEED: Seed[] = [
  {
    n: 1,
    name: "Mestra Dona Maria",
    category: "Artesão",
    community: "UR-2",
    bio: "Bordadeira há 42 anos, Mestra Dona Maria transforma retalhos em memória viva do Ibura. Ensina ponto-cruz e richelieu a mais de 60 mulheres da comunidade.",
    gallery: [1, 2, 3],
    handle: "mestradonamaria",
    socials: { instagram: ig("mestradonamaria"), whatsapp: wa(1) },
    pix: "donamaria",
    certified: true,
    createdAt: "2026-02-10",
    time: "08:20",
  },
  {
    n: 2,
    name: "Cozinha da Tia Ana",
    category: "Cozinheiro",
    community: "Jordão Baixo",
    bio: "Sabor de casa em forma de negócio: bolo de rolo, cartola e o famoso baião da Tia Ana alimentam o bairro há 15 anos.",
    gallery: [2, 4],
    socials: { instagram: ig("cozinhadatiaana"), whatsapp: wa(2) },
    pix: "tiaana",
    certified: true,
    createdAt: "2026-02-12",
    time: "14:05",
  },
  {
    n: 3,
    name: "João do Forró",
    category: "Cantor",
    community: "UR-5",
    bio: "Forró pé de serra puro: sanfona, zabumba e triângulo. Já abriu shows no Marco Zero e leva o nome do Ibura para o São João do interior.",
    socials: { spotify: sp("joaodoforro"), youtube: yt("joaodoforro"), whatsapp: wa(3) },
    pix: "joaoforro",
    createdAt: "2026-02-14",
    time: "19:40",
  },
  {
    n: 4,
    name: "Coletivo Maracatu Nação Ibura",
    category: "Cantor",
    community: "Alto do Reservatório",
    bio: "Trinta batuqueiros, uma só batida. O Coletivo mantém vivo o maracatu de baque virado no alto do morro, com oficinas gratuitas todo sábado.",
    gallery: [4, 1],
    socials: { instagram: ig("nacaoibura"), youtube: yt("nacaoibura"), whatsapp: wa(4) },
    pix: "nacaoibura",
    certified: true,
    createdAt: "2026-02-15",
    time: "10:15",
  },
  {
    n: 5,
    name: "MC Nino do Ibura",
    category: "Cantor",
    community: "UR-7",
    bio: "Rap com cheiro de mangue. Nino escreve sobre o que vê da janela e virou voz de uma geração que não aceita mais ser resumida a estatística.",
    socials: { spotify: sp("mcnino"), instagram: ig("mcninodoibura"), whatsapp: wa(5) },
    pix: "mcnino",
    createdAt: "2026-02-16",
    time: "22:30",
  },
  {
    n: 6,
    name: "Ateliê Cores da Ladeira",
    category: "Artista Visual",
    community: "Cohab",
    bio: "Muralismo comunitário: já coloriu 38 fachadas e 4 escolas. Cada parede é decidida em assembleia com os moradores da rua.",
    gallery: [6, 2, 5],
    socials: { instagram: ig("coresdaladeira"), whatsapp: wa(6) },
    pix: "coresdaladeira",
    certified: true,
    createdAt: "2026-02-18",
    time: "11:50",
  },
  {
    n: 7,
    name: "Cia. Teatro Passo Firme",
    category: "Oficineiro",
    community: "Ibura de Baixo",
    bio: "Teatro do oprimido aplicado à realidade do bairro. Formam jovens atores e levam espetáculos de rua para praças sem palco.",
    socials: { instagram: ig("passofirmecia"), whatsapp: wa(7) },
    pix: "passofirme",
    status: "pendente",
    createdAt: "2026-03-02",
    time: "16:00",
  },
  {
    n: 8,
    name: "Léa Sanfoneira",
    category: "Cantor",
    community: "Jordão Alto",
    bio: "Aprendeu com o pai aos 9 anos. Hoje é a primeira mulher sanfoneira a liderar trio no Ibura e dá aula para 20 meninas.",
    gallery: [8, 3],
    socials: { spotify: sp("leasanfoneira"), whatsapp: wa(8) },
    pix: "lea",
    status: "pendente",
    createdAt: "2026-03-05",
    time: "09:25",
  },
  {
    n: 9,
    name: "DJ Vitrola do Morro",
    category: "Cantor",
    community: "UR-2",
    bio: "Discotecagem de brega, funk e manguebeat em vinil. Roda cultural na laje toda última sexta, com entrada franca e caixa coletiva.",
    socials: { instagram: ig("vitroladomorro"), whatsapp: wa(9) },
    pix: "vitrola",
    status: "rejeitado", // documentação viva do fluxo do Admin
    createdAt: "2026-03-06",
    time: "23:10",
  },
];

/* ---------- build: campos derivados, zero digitação manual ---------- */

export const ARTISTS = SEED.map<Artist>((s) => ({
  id: `a${s.n}`,
  name: s.name,
  slug: slugify(s.name),
  category: s.category,
  community: s.community,
  photoUrl: img(s.n),
  bio: s.bio,
  gallery: (s.gallery ?? [s.n]).map(img),
  socials: s.socials ?? {},
  pixKey: `${s.pix ?? slugify(s.name)}@unefica.org`,
  status: s.status ?? "aprovado",
  certified: s.certified ?? false,
  createdAt: at(s.createdAt, s.time),
})).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) satisfies Artist[];

/* ---------- índices prontos: O(1) nas telas ---------- */

export const ARTISTS_BY_ID = new Map(ARTISTS.map((a) => [a.id, a]));
export const ARTISTS_BY_SLUG = new Map(ARTISTS.map((a) => [a.slug, a]));

/* Guarda-corpo em dev: pega slug/id duplicado antes do bug aparecer */
if (import.meta.env.DEV) {
  const dupes = (arr: string[]) => arr.filter((v, i) => arr.indexOf(v) !== i);
  const badSlug = dupes(ARTISTS.map((a) => a.slug));
  const badId = dupes(ARTISTS.map((a) => a.id));
  if (badSlug.length) console.error("[seed] slugs duplicados:", badSlug);
  if (badId.length) console.error("[seed] ids duplicados:", badId);
}
