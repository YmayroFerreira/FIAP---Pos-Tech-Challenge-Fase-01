import { TransactionType } from "@/modules/statement/domain/entities/Transaction";

export interface CreateTransactionDTO {
  id?: string;
  type: string;
  value: number;
  description: string;
  category: string;
  date?: string;
  anexo?: string[];
}

export class TransactionEntity {
  static validate(data: CreateTransactionDTO): { valid: boolean; message?: string } {
    if (!data.type || !data.value || data.value <= 0) {
      return { valid: false, message: "Preencha todos os campos corretamente." };
    }

    if (!data.description.trim()) {
      return { valid: false, message: "Por favor, adicione uma descrição para a transação." };
    }

    return { valid: true };
  }

  static create(data: CreateTransactionDTO) {
    // Regra de Negócio: Normalização do valor baseado no tipo
    const finalValue =
      data.type === "Debit"
        ? -Math.abs(data.value)
        : Math.abs(data.value);

    return {
      id: data.id ?? "",
      type: data.type as TransactionType,
      value: finalValue,
      description: data.description,
      category: data.category,
      date: data.date || new Date().toISOString().split("T")[0],
      anexo: data.anexo || [],
    };
  }
}