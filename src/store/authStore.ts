import { create } from 'zustand'; // Use named import
import { Session } from 'next-auth';

interface AuthState {
  user: Session | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (session: Session) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  login: (session: Session) => {
    set({ user: session, isAuthenticated: true });
    sessionStorage.setItem('userSession', 'true');
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    sessionStorage.removeItem('userSession');
  },
}));
