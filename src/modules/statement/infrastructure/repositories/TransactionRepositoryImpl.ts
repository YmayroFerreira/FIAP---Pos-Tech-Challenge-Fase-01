import { Transaction } from "@/modules/statement/domain/entities/Transaction";
import { ITransactionRepository } from '@/modules/statement/domain/repositories/ITransactionRepository';

/**
 * TransactionRepositoryImpl - Repositório com Proxy Seguro
 * 
 * SEGURANÇA:
 * - Todas as chamadas passam pelo proxy em /api/proxy/*
 * - O proxy adiciona o token do cookie HttpOnly no servidor
 * - Token NUNCA é exposto ao JavaScript do cliente
 */
export class TransactionRepositoryImpl implements ITransactionRepository {
  /**
   * Fetch via proxy seguro - token é adicionado no servidor
   */
  private async fetchViaProxy(path: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`/api/proxy${path}`, {
        ...options,
        credentials: "include", // Importante: envia cookies
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      return response;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Erro ao fazer fetch:", error);
      }
      return null;
    }
  }

  async getAccountData() {
    const response = await this.fetchViaProxy("/account");
    return response ? response.json() : null;
  }

  async create(data: unknown): Promise<Transaction | null> {
    const response = await this.fetchViaProxy("/account/transaction", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response ? response.json() : null;
  }

  async update(id: string, data: unknown): Promise<Transaction | null> {
    const response = await this.fetchViaProxy(`/account/transaction/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response ? response.json() : null;
  }

  async delete(id: string): Promise<boolean> {
    const response = await this.fetchViaProxy(`/account/transaction/${id}`, {
      method: "DELETE",
    });
    return !!response;
  }
}
