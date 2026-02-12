import { TransactionType } from "@/modules/statement/domain/entities/Transaction";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// DTOs
interface TransactionDTO {
  id?: string;
  accountId: string;
  type: TransactionType;
  value: number;
  description: string;
  category: string;
  date: string;
  anexo?: string[];
}

/**
 * Hook para mutations de transações
 * 
 * SEGURANÇA:
 * - Usa proxy seguro em /api/proxy/* 
 * - Token é adicionado no servidor via cookie HttpOnly
 * - Token NUNCA é exposto ao JavaScript
 */
export function useTransactionMutations() {
  const queryClient = useQueryClient();

  const createTransaction = useMutation({
    mutationFn: async (data: TransactionDTO) => {
      const response = await fetch("/api/proxy/account/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Falha ao criar transação");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });

  const updateTransaction = useMutation({
    mutationFn: async ({ id, ...data }: TransactionDTO) => {
      const response = await fetch(`/api/proxy/account/transaction/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Falha ao atualizar transação");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/proxy/account/transaction/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Falha ao deletar transação");
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });

  return { createTransaction, updateTransaction, deleteTransaction };
}
