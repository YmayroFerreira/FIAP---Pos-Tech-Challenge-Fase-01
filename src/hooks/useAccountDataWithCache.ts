import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccount } from "@/services/account";
import { setAuthToken } from "@/services/api-config";

/**
 * Hook: useAccountDataWithCache
 *
 * Integra React Query com StatementStore para caching automático.
 * Observa eventos de invalidação do store e revalida cache.
 *
 * Uso:
 * const { data, isLoading, error, invalidate } = useAccountDataWithCache();
 */

export function useAccountDataWithCache() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const authToken = localStorage.getItem("authToken") ?? "";
      await setAuthToken(authToken);
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
