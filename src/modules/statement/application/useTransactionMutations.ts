import { TransactionType } from "@/modules/statement/domain/entities/Transaction";
import { useAuth } from "@/shared/hooks/useAuth";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Ajuste conforme env

export function useTransactionMutations() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  const createTransaction = useMutation({
    mutationFn: async (data: TransactionDTO) => {
      const response = await fetch(`${API_URL}/account/transaction`, {
        method: "POST",
        headers: getHeaders(),
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
      const response = await fetch(`${API_URL}/account/transaction/${id}`, {
        method: "PUT",
        headers: getHeaders(),
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
      const response = await fetch(`${API_URL}/account/transaction/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
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
