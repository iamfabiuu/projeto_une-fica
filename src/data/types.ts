/* ═══════════════════ Fonte única de verdade ═══════════════════ */

export const CATEGORIES = [
  "Cantor",
  "Cozinheiro",
  "Artesão",
  "Oficineiro",
  "Artista Visual",
] as const;

export const COMMUNITIES = [
  "Ibura de Baixo",
  "UR-2",
  "UR-5",
  "UR-7",
  "Jordão Baixo",
  "Jordão Alto",
  "Cohab",
  "Alto do Reservatório",
] as const;

export const STAGES = [
  "Palco Principal",
  "Tenda Gastronômica",
  "Espaço Artesanato",
  "Arena COMPAZ",
] as const;

export const STATUSES = ["pendente", "aprovado", "rejeitado"] as const;
export const GRANT_STATUSES = ["aberto", "breve", "encerrado"] as const;
export const DAYS = [1, 2, 3] as const;

/* Tipos derivados — impossível divergir */
export type Category = (typeof CATEGORIES)[number];
export type Community = (typeof COMMUNITIES)[number];
export type Stage = (typeof STAGES)[number];
export type Status = (typeof STATUSES)[number];
export type GrantStatus = (typeof GRANT_STATUSES)[number];
export type Day = (typeof DAYS)[number];

/* Tuplas prontas pro Zod: chega de `as [X, ...X[]]` */
export const CATEGORY_TUPLE = CATEGORIES as unknown as [Category, ...Category[]];
export const COMMUNITY_TUPLE = COMMUNITIES as unknown as [Community, ...Community[]];

/* ═══════════════════ Utilitários de tipo ═══════════════════ */

/** "HH:MM" — pega `"9h"` ou `"19:6"` em tempo de compilação (literais) */
export type TimeHHMM = `${number}${number}:${number}${number}`;
/** ISO 8601 com data (e opcionalmente hora) */
export type ISODate = string & { readonly __iso?: unique symbol };
export type Url = string & { readonly __url?: unique symbol };

/** IDs nominais: não dá mais pra passar um artistId onde se espera slotId */
declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };

export type ArtistId = Brand<string, "ArtistId">;
export type SlotId = Brand<string, "SlotId">;
export type MentorId = Brand<string, "MentorId">;
export type GuideId = Brand<string, "GuideId">;
export type GrantId = Brand<string, "GrantId">;

export const artistId = (v: string) => v as ArtistId;
export const slotId = (v: string) => v as SlotId;

/* ═══════════════════ Entidades ═══════════════════ */

export interface Socials {
  instagram?: Url;
  spotify?: Url;
  youtube?: Url;
  /** Só dígitos, com DDI: 5581999990000 */
  whatsapp?: string;
  tiktok?: Url;
  site?: Url;
}

export interface Artist {
  readonly id: ArtistId;
  name: string;
  /** kebab-case derivado do name */
  slug: string;
  category: Category;
  community: Community;
  photoUrl: string;
  bio: string;
  gallery: readonly string[];
  socials: Socials;
  pixKey: string;
  status: Status;
  certified: boolean;
  readonly createdAt: ISODate;
  updatedAt?: ISODate;
}

/** Payload de inscrição: sem campos que o sistema gera */
export type ArtistDraft = Omit<
  Artist,
  "id" | "slug" | "status" | "certified" | "createdAt" | "updatedAt"
>;

export interface Slot {
  readonly id: SlotId;
  day: Day;
  start: TimeHHMM;
  end: TimeHHMM;
  stage: Stage;
  artistId: ArtistId;
  title: string;
  description?: string;
}

export interface Guide {
  readonly id: GuideId;
  title: string;
  slug: string;
  category: string;
  /** minutos */
  readTime: number;
  excerpt: string;
  /** Markdown */
  content: string;
}

export interface Mentor {
  readonly id: MentorId;
  name: string;
  avatarUrl: string;
  role: string;
  bio: string;
  specialties: readonly string[];
  isFree: boolean;
  /** 0–5 */
  rating: number;
  calendarUrl: Url;
  slots: readonly string[];
}

export interface Grant {
  readonly id: GrantId;
  title: string;
  organizer: string;
  deadline: ISODate;
  category: string;
  status: GrantStatus;
  link: Url;
  requirements: readonly string[];
  /** em reais, quando divulgado */
  amount?: number;
}

/* ═══════════════════ Tokens visuais ═══════════════════ */

/** Classes de badge (fundo + texto legível) */
export const CATEGORY_COLOR = {
  Cantor: "bg-une text-white",
  Cozinheiro: "bg-sun text-night",
  Artesão: "bg-fica text-night",
  Oficineiro: "bg-night text-white",
  "Artista Visual": "bg-heart text-white",
} as const satisfies Record<Category, string>;

export const STAGE_COLOR = {
  "Palco Principal": "bg-une",
  "Tenda Gastronômica": "bg-sun",
  "Espaço Artesanato": "bg-fica",
  "Arena COMPAZ": "bg-night",
} as const satisfies Record<Stage, string>;

export const STATUS_COLOR = {
  aprovado: "bg-emerald-100 text-emerald-800",
  pendente: "bg-amber-100 text-amber-800",
  rejeitado: "bg-night/10 text-night/60",
} as const satisfies Record<Status, string>;

export const STATUS_LABEL = {
  aprovado: "Aprovado",
  pendente: "Em análise",
  rejeitado: "Não aprovado",
} as const satisfies Record<Status, string>;

export const GRANT_STATUS_COLOR = {
  aberto: "bg-emerald-100 text-emerald-800",
  breve: "bg-amber-100 text-amber-800",
  encerrado: "bg-night/10 text-night/60",
} as const satisfies Record<GrantStatus, string>;

/** Ícone por categoria (nome do ícone lucide) */
export const CATEGORY_ICON = {
  Cantor: "Mic2",
  Cozinheiro: "ChefHat",
  Artesão: "Scissors",
  Oficineiro: "GraduationCap",
  "Artista Visual": "Palette",
} as const satisfies Record<Category, string>;

/* ═══════════════════ Type guards ═══════════════════ */

export const isCategory = (v: unknown): v is Category =>
  CATEGORIES.includes(v as Category);
export const isCommunity = (v: unknown): v is Community =>
  COMMUNITIES.includes(v as Community);
export const isStatus = (v: unknown): v is Status =>
  STATUSES.includes(v as Status);
export const isStage = (v: unknown): v is Stage => STAGES.includes(v as Stage);
export const isDay = (v: unknown): v is Day => DAYS.includes(v as Day);

/** Garante que todo case foi tratado num switch */
export const exhaustive = (v: never): never => {
  throw new Error(`Valor não tratado: ${String(v)}`);
};
