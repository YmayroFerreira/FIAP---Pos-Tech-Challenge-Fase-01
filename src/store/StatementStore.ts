"use client";

import { create } from "zustand";
import {
  createTransaction,
  createTransactionData,
  getAccount,
} from "../services/account";
import { loginAutomatically } from "../services/auth";

export type transactionType = "Credit" | "Debit";

export interface Transaction {
  id: string;
  type: transactionType;
  value: number;
  date: string;
  description: string;
  category: string;
  attachments: string[];
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
  id: string;
}

interface StatementState {
  transactions: Transaction[];
  userInfo: UserInfo | null;
  accountInfo: AccountInfo | null;
  currentBalance: number;
  loading: boolean;
  error: string | null;
  // actions
  fetchData: () => Promise<void>;
  addTransaction: (
    transaction: Pick<Transaction, "type" | "value"> & {
      from?: string;
      to?: string;
      anexo?: string;
      category: string;
      description: string;
    }
  ) => Promise<void>;
  setTransactions: (txns: Transaction[]) => void;
  updateTransaction: (id: string, updated: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  getLatestTransactions: (count: number) => Transaction[];
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

      await loginAutomatically();
      const accountData = await getAccount();

      if (accountData?.result) {
        const transactions = accountData.result.transactions;
        const balance = get().calculateBalance(transactions);

        set({
          userInfo: {
            username: accountData.result.user?.username || "",
            email: accountData.result.user?.email || "",
            id: accountData.result.user?.id || "",
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
        accountId: accountInfo.id,
        type: transaction.type,
        value: valueWithSign,
        category: transaction.category,
        description: transaction.description,
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

  setTransactions: (txns) => {
    set({
      transactions: txns,
      currentBalance: get().calculateBalance(txns),
    });
  },

  updateTransaction: (id, updated) => {
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...updated, id } : t
      ),
    }));
  },

  deleteTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },

  getLatestTransactions: (count) => {
    return [...get().transactions]
      .sort((a, b) => parseInt(b.id) - parseInt(a.id))
      .slice(0, count);
  },
}));
