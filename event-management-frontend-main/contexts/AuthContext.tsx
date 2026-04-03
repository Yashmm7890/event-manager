// frontend/contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function subscribeToTokenStore(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === "token") {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
  };
}

function getClientTokenSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("token");
}

function subscribeToHydrationState() {
  return () => {};
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokenOverride, setTokenOverride] = useState<string | null | undefined>(
    undefined
  );
  const router = useRouter();
  const storedToken = useSyncExternalStore(
    subscribeToTokenStore,
    getClientTokenSnapshot,
    () => null
  );
  const hasHydrated = useSyncExternalStore(
    subscribeToHydrationState,
    () => true,
    () => false
  );
  const token = tokenOverride ?? storedToken;
  const isLoading = !hasHydrated;

  const login = useCallback((newToken: string) => {
    window.localStorage.setItem("token", newToken);
    setTokenOverride(newToken);
    router.push("/dashboard");
  }, [router]);

  const logout = useCallback(() => {
    window.localStorage.removeItem("token");
    setTokenOverride(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
      isAuthenticated: Boolean(token),
      isLoading,
    }),
    [token, login, logout, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
