"use client";

import { createContext, useState, ReactNode, useContext } from "react";

export type Transaction = {
  type: "Entry" | "Exit";
  amount: string;
  description: string;
  date: string;
};

type StatementContextType = {
  transactions: Transaction[] | null;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[] | null>>;
};

const StatementContext = createContext<StatementContextType | undefined>(
  undefined
);

export const StatementProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);

  return (
    <StatementContext.Provider value={{ transactions, setTransactions }}>
      {children}
    </StatementContext.Provider>
  );
};

export const useStatement = () => {
  const context = useContext(StatementContext);
  if (!context) {
    throw new Error("useStatement must be used within a StatementProvider");
  }
  return context;
};
