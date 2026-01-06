import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthStore, User } from '../types/user.types';


export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token: string, user?: User) =>
        set({
          token,
          user: user || null,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-store',
    }
  )
);