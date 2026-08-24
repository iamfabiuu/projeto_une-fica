// store/auth.ts
import type { StateCreator } from "zustand";

export type Role = "artista" | "admin";
export interface User {
  name: string;
  email: string;
  role: Role;
}

export interface AuthSlice {
  user: User | null;
  authLoading: boolean;
  authError: string | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => void;
}

/** Mock: substituir por chamada real. Senha demo: "ibura123" */
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

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  authLoading: false,
  authError: null,
  isAdmin: false,

  signIn: async (email, password) => {
    set({ authLoading: true, authError: null });
    await new Promise((r) => setTimeout(r, 700)); // simula rede
    const rec = FAKE_DB[email.trim().toLowerCase()];
    if (!rec || rec.pass !== password) {
      set({ authLoading: false, authError: "E-mail ou senha incorretos." });
      throw new Error("invalid_credentials");
    }
    set({ user: rec.user, isAdmin: rec.user.role === "admin", authLoading: false });
    return rec.user;
  },

  signOut: () => set({ user: null, isAdmin: false, authError: null }),
});
