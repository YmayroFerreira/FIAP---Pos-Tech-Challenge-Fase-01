/**
 * Account Services - Proxy Seguro
 * 
 * SEGURANÇA:
 * - Todas as chamadas passam pelo proxy em /api/proxy/*
 * - O proxy adiciona o token do cookie HttpOnly no servidor
 * - Token NUNCA é exposto ao JavaScript do cliente
 */

export interface createTransactionData {
  accountId: string;
  id: string;
  value: number;
  type: "Credit" | "Debit";
  from?: string;
  to?: string;
  anexo?: string[];
  category: string;
  description: string;
}

/**
 * Fetch via proxy seguro - token é adicionado no servidor
 */
const fetchViaProxy = async (path: string, options: RequestInit = {}) => {
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
};

export const getAccount = async () => {
  const response = await fetchViaProxy("/account");
  return response ? response.json() : null;
};

export const createTransaction = async (
  transactionData: createTransactionData
) => {
  const response = await fetchViaProxy("/account/transaction", {
    method: "POST",
    body: JSON.stringify(transactionData),
  });
  return response ? response.json() : null;
};

export const updateTransaction = async (
  id: string,
  transactionData: unknown
) => {
  const response = await fetchViaProxy(`/account/transaction/${id}`, {
    method: "PUT",
    body: JSON.stringify(transactionData),
  });
  return response ? response.json() : null;
};

export const deleteTransaction = async (id: string) => {
  const response = await fetchViaProxy(`/account/transaction/${id}`, {
    method: "DELETE",
  });
  return response;
};

export const getStatement = async (accountId: string) => {
  const response = await fetchViaProxy(`/account/${accountId}/statement`);
  return response ? response.json() : null;
};
