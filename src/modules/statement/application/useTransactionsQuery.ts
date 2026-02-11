import { Transaction } from "@/modules/statement/domain/entities/Transaction";
import { useAuth } from "@/shared/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
// Importe do local correto onde seu hook está atualmente. 
// Baseado no seu TransactionForm, parece estar em modules, mas verifique se não está em hooks.
import { useAccountDataWithCache } from "@/modules/statement/application/useAccountDataWithCache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function useTransactionsQuery() {
  const { getToken } = useAuth();
  const { data: accountData } = useAccountDataWithCache();

  // Extrai o ID da conta. Ajuste a estrutura se sua API retornar diferente (ex: data.id)
  const accountId = accountData?.result?.cards?.[0]?.id;

  const query = useQuery({
    queryKey: ["statement", accountId],
    queryFn: async () => {
      const token = getToken();
      if (!token || !accountId) return [];

      const response = await fetch(`${API_URL}/account/${accountId}/statement`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar extrato");
      }

      const data = await response.json();
      // Garante que retorna um array, mesmo que a API retorne { results: [] }
      return (Array.isArray(data) ? data : data.results || []) as Transaction[];
    },
    // A query só roda quando tivermos o ID da conta e o token
    enabled: !!accountId && !!getToken(),
  });

  return {
    transactions: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ? String(query.error) : null,
    refetch: query.refetch,
  };
}
