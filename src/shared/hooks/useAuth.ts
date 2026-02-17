import { useCallback } from "react";

/**
 * Hook de autenticação seguro
 * 
 * SEGURANÇA:
 * - NÃO usa localStorage (vulnerável a XSS)
 * - Token é gerenciado via cookies HttpOnly no servidor
 * - Logout chama API para remover cookie
 */
export function useAuth() {
  /**
   * @deprecated Token não é mais acessível via JavaScript
   * Use o proxy em /api/proxy/* que adiciona o token automaticamente
   */
  const getToken = useCallback(() => {
    // Token agora é gerenciado via cookie HttpOnly - não acessível via JS
    return null;
  }, []);

  /**
   * @deprecated Token é setado pelo servidor via cookie HttpOnly
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setToken = useCallback((_token: string) => {
    // Token agora é setado pelo servidor via cookie HttpOnly
    if (process.env.NODE_ENV === "development") {
      console.warn("setToken está obsoleto. Token é gerenciado via cookies HttpOnly.");
    }
  }, []);

  /**
   * @deprecated Use logout() que chama a API
   */
  const removeToken = useCallback(() => {
    // Token é removido via API /api/auth/logout
  }, []);

  /**
   * Logout seguro via API
   * Remove o cookie HttpOnly no servidor
   */
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Erro no logout:", error);
      }
    } finally {
      // Redireciona para login no mesmo domínio (micro-frontend via rewrite)
      window.location.href = "/homepage";
    }
  }, []);

  return { getToken, setToken, removeToken, logout };
}
