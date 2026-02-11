import { Transaction, TransactionType } from '@/modules/statement/domain/entities/Transaction';

export interface CreateTransactionDTO {
  accountId: string;
  value: number;
  type: TransactionType;
  category: string;
  description: string;
  anexo?: string[];
}

export interface ITransactionRepository {
  getAccountData(): Promise<any>;
  create(data: CreateTransactionDTO): Promise<Transaction | null>;
  update(id: string, data: any): Promise<Transaction | null>;
  delete(id: string): Promise<boolean>;
}