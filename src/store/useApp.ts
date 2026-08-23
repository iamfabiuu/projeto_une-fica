import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ARTISTS } from "../data/artists";
import { GUIDES } from "../data/content";
import type { Artist, Status } from "../data/types";

interface AppState {
  artists: Artist[];
  favorites: string[];
  completedGuides: string[];
  kitProgress: number;
  addArtist: (
    a: Omit<Artist, "id" | "slug" | "status" | "certified" | "createdAt">,
  ) => void;
  setStatus: (id: string, status: Status) => void;
  toggleFavorite: (slotId: string) => void;
  toggleGuide: (id: string) => void;
  setKitProgress: (n: number) => void;
}

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      artists: ARTISTS,
      favorites: [],
      completedGuides: [],
      kitProgress: 0,

      addArtist: (a) =>
        set((s) => ({
          artists: [
            {
              ...a,
              id: crypto.randomUUID(),
              slug: slugify(a.name),
              status: "pendente",
              certified: false,
              createdAt: new Date().toISOString().slice(0, 10),
            },
            ...s.artists,
          ],
        })),

      setStatus: (id, status) =>
        set((s) => ({
          artists: s.artists.map((a) => (a.id === id ? { ...a, status } : a)),
        })),

      toggleFavorite: (slotId) =>
        set((s) => ({
          favorites: s.favorites.includes(slotId)
            ? s.favorites.filter((f) => f !== slotId)
            : [...s.favorites, slotId],
        })),

      toggleGuide: (id) =>
        set((s) => ({
          completedGuides: s.completedGuides.includes(id)
            ? s.completedGuides.filter((g) => g !== id)
            : [...s.completedGuides, id],
        })),

      setKitProgress: (n) => set({ kitProgress: n }),
    }),
    { name: "unefica-store", version: 1 },
  ),
);

export const useOverallProgress = () => {
  const { completedGuides, kitProgress } = useApp();
  const guidePct = (completedGuides.length / GUIDES.length) * 100;
  return Math.round(guidePct * 0.6 + kitProgress * 0.4);
};
