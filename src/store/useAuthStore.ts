import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Worker } from '../types';

export interface AuthUser extends User {
  workerProfile?: Worker;
}

interface AuthState {
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
  updateWallet: (balance: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
      updateWallet: (balance) => set((state) => ({ 
          user: state.user ? { ...state.user, wallet_balance: balance } : null 
      }))
    }),
    {
      name: 'skillshare-auth',
    }
  )
);
