"use client";

import { useEffect, useState, Suspense } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard - Componente de proteção de rotas
 * 
 * SEGURANÇA:
 * - NÃO usa localStorage (vulnerável a XSS)
 * - NÃO recebe token via URL (vulnerável a leaks)
 * - Verifica autenticação via API que lê cookie HttpOnly
 * - Cookie HttpOnly não é acessível via JavaScript
 */
function AuthGuardContent({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verifica autenticação via API (que lê o cookie HttpOnly no servidor)
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include", // Importante: envia cookies
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            setIsChecking(false);
            return;
          }
        }

        // Não autenticado - redireciona para login
        const homepageUrl = process.env.NEXT_PUBLIC_HOMEPAGE_URL || "http://localhost:3001";
        window.location.href = `${homepageUrl}/homepage`;
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Erro ao verificar autenticação:", error);
        }
        // Em caso de erro, redireciona para login por segurança
        const homepageUrl = process.env.NEXT_PUBLIC_HOMEPAGE_URL || "http://localhost:3001";
        window.location.href = `${homepageUrl}/homepage`;
      }
    };

    checkAuth();
  }, []);

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
