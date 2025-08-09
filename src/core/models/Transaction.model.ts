import type { Transaction } from "@/context/StatementContext";

interface TransactionModel {
  editingTransaction?: Transaction;
  onCancel?: () => void;
  isModal?: boolean;
}

export type { TransactionModel };
