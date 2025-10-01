import { Transaction } from "@/store/StatementStore";

interface TransactionModel {
  editingTransaction?: Transaction;
  onCancel?: () => void;
  isModal?: boolean;
}

export type { TransactionModel };
