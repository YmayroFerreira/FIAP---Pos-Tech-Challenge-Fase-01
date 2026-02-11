export type TransactionType = "Credit" | "Debit";

export interface Transaction {
  id: string;
  type: TransactionType;
  value: number;
  date: string;
  description: string;
  category: string;
  anexo: string[];
}

export interface AccountInfo {
  id: string;
  type: TransactionType;
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