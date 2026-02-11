import { useCallback } from "react";

export function useAuth() {
  const getToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }, []);

  const setToken = useCallback((token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  }, []);

  const removeToken = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    window.location.href = "/homepage";
  }, [removeToken]);

  return { getToken, setToken, removeToken, logout };
}
