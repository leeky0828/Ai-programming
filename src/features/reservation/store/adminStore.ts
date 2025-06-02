'use client';

import { create } from 'zustand';
import { AdminCredentials } from '../lib/types';
import { checkAdminAuth, loginAdmin, logoutAdmin } from '../lib/storage';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  checkAuth: () => void;
  login: (credentials: AdminCredentials) => Promise<boolean>;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  (set, get) => ({
    isAuthenticated: false,
    loading: false,
    error: null,
    
    checkAuth: () => {
      const isAuthenticated = checkAdminAuth();
      set({ isAuthenticated });
    },
    
    login: async (credentials: AdminCredentials) => {
      set({ loading: true, error: null });
      
      try {
        const success = loginAdmin(credentials.username, credentials.password);
        
        if (success) {
          set({ isAuthenticated: true, loading: false });
          return true;
        } else {
          set({
            isAuthenticated: false,
            loading: false,
            error: '로그인 정보가 일치하지 않습니다.',
          });
          return false;
        }
      } catch (error) {
        set({
          isAuthenticated: false,
          loading: false,
          error: '로그인 중 오류가 발생했습니다.',
        });
        return false;
      }
    },
    
    logout: () => {
      logoutAdmin();
      set({ isAuthenticated: false });
    },
  })
); 