/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { create } from "zustand";

export type transactionType = "Credit" | "Debit";

export interface Transaction {
  id: string;
  type: transactionType;
  value: number;
  date: string;
  description: string;
  category: string;
  anexo: string[];
}

export interface AccountInfo {
  id: string;
  type: transactionType;
  is_blocked: boolean;
  number: string;
  dueDate: string;
  functions: string;
  cvc: string;
  paymentDate: string | null;
  name: string;
}

export interface UserInfo {
  username: string;
  email: string;
  accountId: string;
}

export interface CreateTransactionData {
  accountId: string;
  id: string;
  value: number;
  type: "Credit" | "Debit";
  from?: string;
  to?: string;
  anexo?: string[];
  category: string;
  description: string;
}

interface StatementState {
  transactions: Transaction[];
  userInfo: UserInfo | null;
  accountInfo: AccountInfo | null;
  currentBalance: number;
  loading: boolean;
  error: string | null;

  fetchData: () => Promise<void>;
  addTransaction: (
    transaction: Pick<Transaction, "type" | "value"> & {
      id: string;
      from?: string;
      to?: string;
      anexo?: string[];
      category: string;
      description: string;
    },
  ) => Promise<void>;
  updateTransaction: (id: string, updated: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  calculateBalance: (txns: Transaction[]) => number;
}

/**
 * StatementStore - Gerenciamento de estado seguro
 * 
 * SEGURANÇA:
 * - NÃO usa localStorage para tokens
 * - Todas as chamadas à API passam pelo proxy seguro
 * - O proxy adiciona o token do cookie HttpOnly no servidor
 * - Token nunca é exposto ao JavaScript do cliente
 */
export const useStatementStore = create<StatementState>((set, get) => ({
  transactions: [],
  userInfo: null,
  accountInfo: null,
  currentBalance: 0,
  loading: true,
  error: null,

  calculateBalance: (txns) => {
    return txns.reduce((total, transaction) => total + transaction.value, 0);
  },

  fetchData: async () => {
    try {
      set({ loading: true, error: null });

      // Usa proxy seguro - token é adicionado no servidor via cookie HttpOnly
      const response = await fetch("/api/proxy/account", {
        method: "GET",
        credentials: "include", // Importante: envia cookies
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Não autenticado - redireciona para login
          const homepageUrl = process.env.NEXT_PUBLIC_HOMEPAGE_URL || "http://localhost:3001";
          window.location.href = `${homepageUrl}/homepage`;
          return;
        }
        throw new Error("Erro ao carregar dados");
      }

      const accountData = await response.json();

      if (accountData?.result) {
        console.log(accountData);
        const transactions = accountData.result.transactions;
        const balance = get().calculateBalance(transactions);

        set({
          userInfo: {
            username: accountData.result.user?.username || "",
            email: accountData.result.user?.email || "",
            accountId: accountData.result.user?.id || "",
          },
          accountInfo: accountData.result.account[0],
          transactions,
          currentBalance: balance,
          loading: false,
          error: null,
        });
      } else {
        set({
          error: "Não foi possível carregar os dados da conta.",
          loading: false,
        });
      }
    } catch (err) {
      set({ error: "Erro ao se conectar com a API. " + err, loading: false });
    }
  },

  addTransaction: async (transaction) => {
    const accountInfo = get().accountInfo;
    if (accountInfo) {
      const valueWithSign = Math.abs(transaction.value);

      const transactionData: CreateTransactionData = {
        id: transaction.id,
        accountId: accountInfo.id,
        type: transaction.type,
        value: valueWithSign,
        category: transaction.category,
        description: transaction.description,
        anexo: transaction.anexo,
      };

      try {
        // Usa proxy seguro para criar transação
        const response = await fetch("/api/proxy/account/transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(transactionData),
        });

        if (response.ok) {
          await get().fetchData();
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Erro ao criar transação:", err);
        }
      }
    }
  },

  updateTransaction: async (id, updated) => {
    if (id) {
      const payload = {
        value: updated.value,
        type: updated.type,
        from: (updated as any).from,
        to: (updated as any).to,
        anexo: updated.anexo,
        urlAnexo: (updated as any).urlAnexo,
      };

      try {
        // Usa proxy seguro para atualizar transação
        const response = await fetch(`/api/proxy/account/transaction/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          await get().fetchData();
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Erro ao editar transação:", err);
        }
      }
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      // Usa proxy seguro para deletar transação
      const response = await fetch(`/api/proxy/account/transaction/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await get().fetchData();
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Erro ao deletar transação:", err);
      }
    }
  },
}));
