import { Transaction } from "@/modules/statement/domain/entities/Transaction";
import { useQuery } from "@tanstack/react-query";
import { useAccountDataWithCache } from "@/modules/statement/application/useAccountDataWithCache";

/**
 * Hook para buscar transações
 * 
 * SEGURANÇA:
 * - Usa proxy seguro em /api/proxy/*
 * - Token é adicionado no servidor via cookie HttpOnly
 * - Token NUNCA é exposto ao JavaScript
 */
export function useTransactionsQuery() {
  const { data: accountData } = useAccountDataWithCache();

  // Extrai o ID da conta
  const accountId = accountData?.result?.cards?.[0]?.id;

  const query = useQuery({
    queryKey: ["statement", accountId],
    queryFn: async () => {
      if (!accountId) return [];

      const response = await fetch(`/api/proxy/account/${accountId}/statement`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar extrato");
      }

      const data = await response.json();
      // Garante que retorna um array, mesmo que a API retorne { results: [] }
      return (Array.isArray(data) ? data : data.results || []) as Transaction[];
    },
    // A query só roda quando tivermos o ID da conta
    enabled: !!accountId,
  });

  return {
    transactions: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ? String(query.error) : null,
    refetch: query.refetch,
  };
}
