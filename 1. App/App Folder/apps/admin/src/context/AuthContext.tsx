import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AdminUser } from '../types';
import { getAuthToken, setAuthData, clearAuthData, ensureAdminAuth } from '../services/api';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('parishak_admin_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return {
      id: 'adm-demo',
      workerId: 'ADM-9001',
      fullName: 'Dr. Anita Roy',
      email: 'admin@parishak.safety',
      role: 'ADMIN',
      organizationName: 'Bharat Minerals & Steel Heavy Industries'
    };
  });

  const refreshAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeToken = await ensureAdminAuth();
      if (activeToken) {
        setToken(activeToken);
        const savedUser = localStorage.getItem('parishak_admin_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
    } catch (err) {
      console.warn('Admin auth initialization notice:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = (newToken: string, newUser: AdminUser) => {
    setToken(newToken);
    setUser(newUser);
    setAuthData(newToken, newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    clearAuthData();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        refreshAuth,
        isAuthenticated: !!token || !!user,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AuthProvider');
  return context;
};
