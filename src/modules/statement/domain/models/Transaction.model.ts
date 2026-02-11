import { Transaction } from "@/modules/statement/domain/entities/Transaction";

interface TransactionModel {
  editingTransaction?: Transaction;
  onCancel?: () => void;
  isModal?: boolean;
}

export type { TransactionModel };

