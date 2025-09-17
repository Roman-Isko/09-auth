import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setAuthenticated: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  logout: () => set({ isAuthenticated: false }),
}));
