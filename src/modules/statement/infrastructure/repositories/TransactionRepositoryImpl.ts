
import { Transaction } from "@/modules/statement/domain/entities/Transaction";
import { ITransactionRepository } from '@/modules/statement/domain/repositories/ITransactionRepository';
import { API_BASE_URL, authToken } from "@/shared/infrastructure/http/api-config";

export class TransactionRepositoryImpl implements ITransactionRepository {
  private async fetchAuthenticated(path: string, options: RequestInit = {}) {
    if (!authToken) {
      console.error("Erro: Token de autenticação não encontrado.");
      return null;
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
      });
      return response;
    } catch (error) {
      console.error("Erro ao fazer fetch:", error);
      return null;
    }
  }

  async getAccountData() {
    const response = await this.fetchAuthenticated("/account");
    return response ? response.json() : null;
  }

  async create(data: any): Promise<Transaction | null> {
    const response = await this.fetchAuthenticated("/account/transaction", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response ? response.json() : null;
  }

  async update(id: string, data: any): Promise<Transaction | null> {
    const response = await this.fetchAuthenticated(`/account/transaction/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response ? response.json() : null;
  }

  async delete(id: string): Promise<boolean> {
    const response = await this.fetchAuthenticated(`/account/transaction/${id}`, {
      method: "DELETE",
    });
    return !!response;
  }
}
