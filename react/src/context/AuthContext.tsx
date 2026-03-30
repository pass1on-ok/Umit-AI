import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { login as apiLogin, logout as apiLogout, register as apiRegister, type AuthResponse, type LoginPayload, type RegisterPayload, type AuthUser } from '@/services/api';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (payload: LoginPayload) => Promise<AuthUser>;
  signUp: (payload: RegisterPayload) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const StorageKeys = {
  token: 'umetaiToken',
  user: 'umetaiUser',
};

const readUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(StorageKeys.user);
    return raw ? JSON.parse(raw) as AuthUser : null;
  } catch {
    return null;
  }
};

const readToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(StorageKeys.token);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => readUser());
  const [token, setToken] = useState<string | null>(() => readToken());

  const setAuthState = useCallback((auth: AuthResponse) => {
    localStorage.setItem(StorageKeys.token, auth.token);
    localStorage.setItem(StorageKeys.user, JSON.stringify(auth.user));
    setToken(auth.token);
    setUser(auth.user);
  }, []);

  const clearAuthState = useCallback(() => {
    localStorage.removeItem(StorageKeys.token);
    localStorage.removeItem(StorageKeys.user);
    setToken(null);
    setUser(null);
  }, []);

  const signIn = useCallback(async (payload: LoginPayload) => {
    const auth = await apiLogin(payload);
    setAuthState(auth);
    return auth.user;
  }, [setAuthState]);

  const signUp = useCallback(async (payload: RegisterPayload) => {
    const auth = await apiRegister(payload);
    setAuthState(auth);
    return auth.user;
  }, [setAuthState]);

  const signOut = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.warn('Logout failed', error);
    }
    clearAuthState();
    toast.success('Logged out successfully');
  }, [clearAuthState]);

  useEffect(() => {
    const onLogout = () => {
      clearAuthState();
      toast.error('Session expired, please sign in again');
    };

    window.addEventListener('umetai-logout', onLogout);
    return () => window.removeEventListener('umetai-logout', onLogout);
  }, [clearAuthState]);

  const isAuthenticated = Boolean(user && token);
  const value = useMemo(
    () => ({ user, token, isAuthenticated, signIn, signUp, signOut, logout: signOut }),
    [user, token, isAuthenticated, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
