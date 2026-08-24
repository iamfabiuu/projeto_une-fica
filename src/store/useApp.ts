import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useMemo } from "react";
import { ARTISTS } from "../data/artists";
import { GUIDES } from "../data/content";
import type { Artist, Status } from "../data/types";

/* ─────────── Tipos ─────────── */

export type Role = "artista" | "admin";
export interface User {
  name: string;
  email: string;
  role: Role;
}

interface AppState {
  /** Só artistas criados pelo usuário. O seed vem de ARTISTS e continua atualizável. */
  submissions: Artist[];
  /** Overrides de status por id — permite moderar artistas do seed sem duplicá-los. */
  statusOverrides: Record<string, Status>;
  favorites: string[];
  completedGuides: string[];
  kitProgress: number;
  grantChecklist: Record<string, boolean>;

  user: User | null;
  authLoading: boolean;
  authError: string | null;

  addArtist: (
    a: Omit<Artist, "id" | "slug" | "status" | "certified" | "createdAt">,
  ) => Artist;
  setStatus: (id: string, status: Status) => void;
  removeArtist: (id: string) => void;
  toggleFavorite: (slotId: string) => void;
  toggleGuide: (id: string) => void;
  setKitProgress: (n: number) => void;
  toggleGrantItem: (key: string) => void;
  resetProgress: () => void;

  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => void;
}

/* ─────────── Helpers ─────────── */

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n || 0)));

const toggleIn = (arr: string[], v: string) =>
  arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

/** Evita slug duplicado entre homônimos: "maria-silva", "maria-silva-2"... */
const uniqueSlug = (name: string, taken: Set<string>) => {
  const base = slugify(name) || "artista";
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
};

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/** Mock de auth — trocar por POST /auth/login. Senha demo: "ibura123" */
const FAKE_DB: Record<string, { pass: string; user: User }> = {
  "admin@unefica.org": {
    pass: "ibura123",
    user: { name: "Coordenação UNE&FICA", email: "admin@unefica.org", role: "admin" },
  },
  "artista@unefica.org": {
    pass: "ibura123",
    user: { name: "Artista do Ibura", email: "artista@unefica.org", role: "artista" },
  },
};

const INITIAL = {
  submissions: [] as Artist[],
  statusOverrides: {} as Record<string, Status>,
  favorites: [] as string[],
  completedGuides: [] as string[],
  kitProgress: 0,
  grantChecklist: {} as Record<string, boolean>,
};

/* ─────────── Store ─────────── */

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      user: null,
      authLoading: false,
      authError: null,

      addArtist: (a) => {
        const taken = new Set([
          ...ARTISTS.map((x) => x.slug),
          ...get().submissions.map((x) => x.slug),
        ]);
        const artist: Artist = {
          ...a,
          id: uid(),
          slug: uniqueSlug(a.name, taken),
          status: "pendente",
          certified: false,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        set((s) => ({ submissions: [artist, ...s.submissions] }));
        return artist;
      },

      setStatus: (id, status) =>
        set((s) => ({
          statusOverrides: { ...s.statusOverrides, [id]: status },
          submissions: s.submissions.map((a) => (a.id === id ? { ...a, status } : a)),
        })),

      removeArtist: (id) =>
        set((s) => ({ submissions: s.submissions.filter((a) => a.id !== id) })),

      toggleFavorite: (slotId) =>
        set((s) => ({ favorites: toggleIn(s.favorites, slotId) })),

      toggleGuide: (id) =>
        set((s) => ({ completedGuides: toggleIn(s.completedGuides, id) })),

      setKitProgress: (n) => {
        const v = clamp(n);
        if (get().kitProgress !== v) set({ kitProgress: v }); // evita set redundante em loop de efeito
      },

      toggleGrantItem: (key) =>
        set((s) => ({
          grantChecklist: { ...s.grantChecklist, [key]: !s.grantChecklist[key] },
        })),

      resetProgress: () => set({ ...INITIAL }),

      signIn: async (email, password) => {
        set({ authLoading: true, authError: null });
        await new Promise((r) => setTimeout(r, 700));
        const rec = FAKE_DB[email.trim().toLowerCase()];
        if (!rec || rec.pass !== password) {
          set({ authLoading: false, authError: "E-mail ou senha incorretos." });
          throw new Error("invalid_credentials");
        }
        set({ user: rec.user, authLoading: false });
        return rec.user;
      },

      signOut: () => set({ user: null, authError: null }),
    }),
    {
      name: "unefica-store",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      /** Nunca persistir o catálogo nem estados transitórios de auth */
      partialize: (s) => ({
        submissions: s.submissions,
        statusOverrides: s.statusOverrides,
        favorites: s.favorites,
        completedGuides: s.completedGuides,
        kitProgress: s.kitProgress,
        grantChecklist: s.grantChecklist,
        user: s.user,
      }),
      migrate: (state: any, from) => {
        if (from < 2) {
          const seed = new Set(ARTISTS.map((a) => a.id));
          const all: Artist[] = state?.artists ?? [];
          return {
            ...INITIAL,
            favorites: state?.favorites ?? [],
            completedGuides: state?.completedGuides ?? [],
            kitProgress: clamp(state?.kitProgress ?? 0),
            submissions: all.filter((a) => !seed.has(a.id)),
            statusOverrides: Object.fromEntries(
              all.filter((a) => seed.has(a.id)).map((a) => [a.id, a.status]),
            ),
            user: null,
          };
        }
        return state;
      },
      /** Migra o checklist que estava solto em localStorage (Editais) */
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        try {
          const legacy = localStorage.getItem("unefica:editais:checklist");
          if (legacy) {
            const parsed = JSON.parse(legacy);
            state.grantChecklist = { ...parsed, ...state.grantChecklist };
            localStorage.removeItem("unefica:editais:checklist");
          }
        } catch {
          /* ignora */
        }
      },
    },
  ),
);

/* ─────────── Seletores ─────────── */

/** Catálogo = seed (com status moderado) + submissões locais */
export const useArtists = () => {
  const submissions = useApp((s) => s.submissions);
  const overrides = useApp((s) => s.statusOverrides);
  return useMemo(
    () => [
      ...submissions,
      ...ARTISTS.map((a) => (overrides[a.id] ? { ...a, status: overrides[a.id] } : a)),
    ],
    [submissions, overrides],
  );
};

export const useApprovedArtists = () => {
  const all = useArtists();
  return useMemo(() => all.filter((a) => a.status === "aprovado"), [all]);
};

export const useArtistBySlug = (slug?: string) => {
  const all = useArtists();
  return useMemo(
    () => (slug ? all.find((a) => a.slug === slug) : undefined),
    [all, slug],
  );
};

export const usePendingCount = () => {
  const all = useArtists();
  return useMemo(() => all.filter((a) => a.status === "pendente").length, [all]);
};

/** Peso: 60% trilhas, 40% media kit */
export const useOverallProgress = () => {
  const done = useApp((s) => s.completedGuides.length);
  const kit = useApp((s) => s.kitProgress);
  return useMemo(
    () => clamp((GUIDES.length ? (done / GUIDES.length) * 100 : 0) * 0.6 + kit * 0.4),
    [done, kit],
  );
};

export const useIsFavorite = (slotId: string) =>
  useApp((s) => s.favorites.includes(slotId));

export const useIsGuideDone = (id: string) =>
  useApp((s) => s.completedGuides.includes(id));

export const useIsAdmin = () => useApp((s) => s.user?.role === "admin");
export const useUser = () => useApp((s) => s.user);
