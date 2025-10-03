import { API_BASE_URL, authToken } from "./api-config";

export interface createTransactionData {
  accountId: string;
  value: number;
  type: "Credit" | "Debit";
  from?: string;
  to?: string;
  anexo?: string;
  category: string;
  description: string;
}

const fetchAuthenticated = async (path: string, options: RequestInit = {}) => {
  if (!authToken) {
    console.error(
      "Erro: Token de autenticação não encontrado. Faça o login primeiro."
    );
    return null;
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return response;
};

export const getAccount = async () => {
  const response = await fetchAuthenticated("/account");
  return response ? response.json() : null;
};

export const createTransaction = async (
  transactionData: createTransactionData
) => {
  const response = await fetchAuthenticated("/account/transaction", {
    method: "POST",
    body: JSON.stringify(transactionData),
  });
  return response ? response.json() : null;
};

export const getStatement = async (accountId: string) => {
  const response = await fetchAuthenticated(`/account/${accountId}/statement`);
  return response ? response.json() : null;
};
