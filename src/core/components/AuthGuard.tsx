"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

// Componente interno que usa useSearchParams
function AuthGuardContent({ children }: AuthGuardProps) {
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
        console.log(`❌ Redirecionando para ${process.env.NEXT_PUBLIC_HOMEPAGE_URL}/homepage`);
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
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-lg text-gray-700">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

// Componente wrapper com Suspense
export default function AuthGuard({ children }: AuthGuardProps) {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="text-lg text-gray-700">Carregando...</p>
          </div>
        </div>
      }
    >
      <AuthGuardContent>{children}</AuthGuardContent>
    </Suspense>
  );
}
