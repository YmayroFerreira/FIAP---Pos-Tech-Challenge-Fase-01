import { getAccount } from "@/modules/statement/infrastructure/api/accountApi";
import { useAuth } from "@/shared/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * Hook: useAccountDataWithCache
 *
 * SEGURANÇA:
 * - NÃO usa localStorage para token
 * - Usa proxy seguro que obtém token do cookie HttpOnly
 * - Token nunca é exposto ao JavaScript
 *
 * Integra React Query com StatementStore para caching automático.
 * Observa eventos de invalidação do store e revalida cache.
 *
 * Uso:
 * const { data, isLoading, error, invalidate } = useAccountDataWithCache();
 */

export function useAccountDataWithCache() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const query = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      // Token é adicionado automaticamente via cookie HttpOnly no proxy
      return await getAccount();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const handleInvalidate = () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
    };

    window.addEventListener("invalidate-account", handleInvalidate);
    return () => {
      window.removeEventListener("invalidate-account", handleInvalidate);
    };
  }, [queryClient]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    invalidate: () => queryClient.invalidateQueries({ queryKey: ["account"] }),
    refetch: query.refetch,
  };
}
