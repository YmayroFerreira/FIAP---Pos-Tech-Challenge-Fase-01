"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { createTransaction, createTransactionData, getAccount } from '../services/account';
import { loginAutomatically } from '../services/auth';

export type transactionType = "Credit" | "Debit";

interface Transaction {
  id: string;
  accountId: string;
  type: transactionType;
  value: number;
  date: string;
}

interface AccountInfo {
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

interface UserInfo {
  username: string;
  email: string;
  id: string;
}

interface StatementContextType {
  transactions: Transaction[];
  userInfo: UserInfo | null;
  accountInfo: AccountInfo | null;
  currentBalance: number;
  loading: boolean;
  error: string | null;
  addTransaction: (
    transaction: Pick<Transaction, "type" | "value"> & { from?: string; to?: string; anexo?: string }
  ) => void;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  updateTransaction: ( // Changed to match the type in the useCallback
    id: string,
    updatedTransaction: Omit<Transaction, "id">
  ) => void;
  deleteTransaction: (id: string) => void;
  getLatestTransactions: (count: number) => Transaction[];
  calculateBalance: (txns: Transaction[]) => number;
}
const StatementContext = createContext<StatementContextType | undefined>(
  undefined
);

// const MOCK_ACCOUNT_ID = "68bc78683f7249c643dca1d9";

const calculateBalance = (txns: Transaction[]): number => {
  return txns.reduce((total, transaction) => {
    return total + transaction.value;
  }, 0);
};

export const StatementProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await loginAutomatically();
      const accountData = await getAccount();

      if (accountData?.result) {
        setUserInfo({
          username: accountData.result.user?.username || "",
          email: accountData.result.user?.email || "",
          id: accountData.result.user?.id || "",
        });
        setAccountInfo(accountData.result.account[0]);
        setTransactions(accountData.result.transactions);
        setCurrentBalance(calculateBalance(accountData.result.transactions));
      } else {
        setError("Não foi possível carregar os dados da conta.");
      }
    } catch (err) {
      setError("Erro ao se conectar com a API."+ err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (
    transaction: Pick<Transaction, "type" | "value"> & { from?: string; to?: string; anexo?: string }
  ) => {
    if (accountInfo) {
      // Débitos devem ser negativos, Créditos positivos.
      const valueWithSign =
        transaction.type === "Debit"
          ? -Math.abs(transaction.value)
          : Math.abs(transaction.value);

      const transactionData: createTransactionData = {
        accountId: accountInfo.id,
        type: transaction.type,
        value: valueWithSign,
      };

      try {
        const response = await createTransaction(transactionData);
        if (response) {
          console.log("Transação criada com sucesso:", response);
          // Recarrega os dados após a transação
          await fetchData();
        }
      } catch (err) {
        console.error("Erro ao criar transação:", err);
      }
    }
  }, [accountInfo, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateTransaction = useCallback((id: string, updated: Omit<Transaction, "id">) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...updated, id } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getLatestTransactions = useCallback((count: number) => {
    return [...transactions]
      .sort((a, b) => parseInt(b.id) - parseInt(a.id))
      .slice(0, count);
  }, [transactions]);

  const value = useMemo(
    () => ({
      transactions,
      userInfo,
      accountInfo,
      currentBalance,
      loading,
      error,
      addTransaction,
      setTransactions,
      updateTransaction,
      deleteTransaction,
      getLatestTransactions,
      calculateBalance,
    }),
    [transactions, userInfo, accountInfo, currentBalance, loading, error, addTransaction, updateTransaction, deleteTransaction, getLatestTransactions]
  );
  return (
    <StatementContext.Provider
      value={value}
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

export type { Transaction, UserInfo };
