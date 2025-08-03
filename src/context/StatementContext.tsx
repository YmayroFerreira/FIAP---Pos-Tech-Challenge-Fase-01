"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Unified transaction type
type Transaction = {
  id: string;
  type: "Entry" | "Exit";
  amount: number; // Changed to number for consistency
  description: string;
  date: string;
};

type StatementContextType = {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (
    id: string,
    updatedTransaction: Omit<Transaction, "id">
  ) => void;
  deleteTransaction: (id: string) => void;
  getLatestTransactions: (count: number) => Transaction[];
};

// Mock data - you can move this to a separate file
const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "Entry",
    amount: 2500.0,
    description: "Salário",
    date: "2025-07-01",
  },
  {
    id: "2",
    type: "Exit",
    amount: 150.5,
    description: "Conta de luz",
    date: "2025-07-02",
  },
  {
    id: "3",
    type: "Exit",
    amount: 89.9,
    description: "Internet",
    date: "2025-07-03",
  },
  {
    id: "4",
    type: "Entry",
    amount: 500.0,
    description: "Freelance",
    date: "2025-07-05",
  },
  {
    id: "5",
    type: "Exit",
    amount: 75.3,
    description: "Supermercado",
    date: "2025-07-06",
  },
  {
    id: "6",
    type: "Exit",
    amount: 45.0,
    description: "Transporte",
    date: "2025-07-07",
  },
];

const StatementContext = createContext<StatementContextType | undefined>(
  undefined
);

export const StatementProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initialize with mock data
  useEffect(() => {
    setTransactions(mockTransactions);
  }, []);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(), // Simple ID generation
    };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, updated: Omit<Transaction, "id">) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...updated, id } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const getLatestTransactions = (count: number) => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  };

  return (
    <StatementContext.Provider
      value={{
        transactions,
        setTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getLatestTransactions,
      }}
    >
      {children}
    </StatementContext.Provider>
  );
};

export const useStatement = () => {
  const context = useContext(StatementContext);
  if (!context)
    throw new Error("useStatement must be used within a StatementProvider");
  return context;
};

export type { Transaction };
