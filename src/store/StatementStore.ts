/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { create } from "zustand";
import {
  createTransaction,
  createTransactionData,
  deleteTransaction,
  getAccount,
  updateTransaction,
} from "../services/account";
import { setAuthToken } from "@/services/api-config";

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
      const authToken = localStorage.getItem("authToken") ?? "";

      await setAuthToken(authToken);
      const accountData = await getAccount();

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

      const transactionData: createTransactionData = {
        id: transaction.id,
        accountId: accountInfo.id,
        type: transaction.type,
        value: valueWithSign,
        category: transaction.category,
        description: transaction.description,
        anexo: transaction.anexo,
      };

      try {
        const response = await createTransaction(transactionData);
        if (response) {
          console.log("Transação criada com sucesso:", response);
          await get().fetchData();
        }
      } catch (err) {
        console.error("Erro ao criar transação:", err);
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
        const response = await updateTransaction(id, payload);
        if (response) {
          console.log("Transação editada com sucesso:", response);
          await get().fetchData();
        }
      } catch (err) {
        console.error("Erro ao editar transação:", err);
      }
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      const response = await deleteTransaction(id);
      if (response) {
        console.log("Transação deletada com sucesso:", response);
        await get().fetchData();
      }
    } catch (err) {
      console.error("Erro ao deletar transação:", err);
    }
  },
}));
