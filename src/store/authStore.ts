import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface AuthState {
  accessToken: string | undefined;
  setAccessToken: (token?: string) => void;
  clearAuth: () => void;
  authError: string | null;
  setAuthError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        accessToken: undefined,
        setAccessToken: (token?: string) => set({ accessToken: token }),
        clearAuth: () => set({ accessToken: undefined }),
        authError: null,
        setAuthError: (error: string | null) => set({ authError: error }),
      }),
      {
        name: 'auth-storage',
        partialize: (state: AuthState) => ({
          accessToken: state.accessToken,
        }),
      },
    ),
  ),
);
