import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  hostName: string | null;
  isLoggedIn: boolean;
  login: (name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hostName: null,
      isLoggedIn: false,
      login: (name: string) =>
        set({ hostName: name.trim(), isLoggedIn: true }),
      logout: () => set({ hostName: null, isLoggedIn: false }),
    }),
    {
      name: "scorex-auth",
    }
  )
);
