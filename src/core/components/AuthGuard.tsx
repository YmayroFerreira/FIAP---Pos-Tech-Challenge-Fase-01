"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = () => {
      // 1. Verifica se veio token pela URL
      const encodedToken = searchParams.get("auth");

      if (encodedToken) {
        try {
          const token = atob(encodedToken);

          console.log("🔑 Token recebido pela URL");
          localStorage.setItem("authToken", token);

          // Remove token da URL
          const url = new URL(window.location.href);
          url.searchParams.delete("auth");
          window.history.replaceState({}, "", url.pathname);

          setIsAuthenticated(true);
          setIsChecking(false);
          return;
        } catch (error) {
          console.error("❌ Erro ao decodificar token:", error);
        }
      }

      // 2. Verifica localStorage
      const storedToken = localStorage.getItem("authToken");

      console.log("🔍 Verificando auth... Token:", storedToken ? "✅" : "❌");

      if (!storedToken) {
        console.log("❌ Redirecionando para /homepage");
        window.location.href = "/homepage";
        return;
      }

      console.log("✅ Autenticado!");
      setIsAuthenticated(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [searchParams]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
