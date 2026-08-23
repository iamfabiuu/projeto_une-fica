export type Category =
  | "Cantor"
  | "Cozinheiro"
  | "Artesão"
  | "Oficineiro"
  | "Artista Visual";
export type Community =
  | "Ibura de Baixo"
  | "UR-2"
  | "UR-5"
  | "UR-7"
  | "Jordão Baixo"
  | "Jordão Alto"
  | "Cohab"
  | "Alto do Reservatório";
export type Status = "aprovado" | "pendente" | "rejeitado";
export type Stage =
  | "Palco Principal"
  | "Tenda Gastronômica"
  | "Espaço Artesanato"
  | "Arena COMPAZ";

export interface Artist {
  id: string;
  name: string;
  slug: string;
  category: Category;
  community: Community;
  photoUrl: string;
  bio: string;
  gallery: string[];
  socials: {
    instagram?: string;
    spotify?: string;
    youtube?: string;
    whatsapp?: string;
  };
  pixKey: string;
  status: Status;
  certified: boolean;
  createdAt: string;
}
export interface Slot {
  id: string;
  day: 1 | 2 | 3;
  start: string;
  end: string;
  stage: Stage;
  artistId: string;
  title: string;
}
export interface Guide {
  id: string;
  title: string;
  category: string;
  readTime: number;
  excerpt: string;
  content: string;
}
export interface Mentor {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  bio: string;
  specialties: string[];
  isFree: boolean;
  rating: number;
  calendarUrl: string;
  slots: string[];
}
export interface Grant {
  id: string;
  title: string;
  organizer: string;
  deadline: string;
  category: string;
  status: "aberto" | "breve" | "encerrado";
  link: string;
  requirements: string[];
}

export const CATEGORY_COLOR: Record<Category, string> = {
  Cantor: "bg-une text-white",
  Cozinheiro: "bg-sun text-night",
  Artesão: "bg-fica text-night",
  Oficineiro: "bg-night text-white",
  "Artista Visual": "bg-heart text-white",
};
export const STAGE_COLOR: Record<Stage, string> = {
  "Palco Principal": "bg-une",
  "Tenda Gastronômica": "bg-sun",
  "Espaço Artesanato": "bg-fica",
  "Arena COMPAZ": "bg-night",
};
export const COMMUNITIES: Community[] = [
  "Ibura de Baixo",
  "UR-2",
  "UR-5",
  "UR-7",
  "Jordão Baixo",
  "Jordão Alto",
  "Cohab",
  "Alto do Reservatório",
];
export const CATEGORIES: Category[] = [
  "Cantor",
  "Cozinheiro",
  "Artesão",
  "Oficineiro",
  "Artista Visual",
];
