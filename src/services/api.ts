import { API_BASE_URL, authToken } from "./api-config";

export interface createUserData {
  username: string;
  email: string;
  password: string;
}

export interface authUserData {
  email: string;
  password: string;
}

// Função para criar um usuário
export const createUser = async (userData: createUserData) => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// Função para autenticar um usuário
export const authenticateUser = async (authData: authUserData) => {
  const response = await fetch(`${API_BASE_URL}/user/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });
  return response.json();
};

// Função para buscar a conta com autenticação
export const getAccount = async () => {
  const response = await fetch(`${API_BASE_URL}/account`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.json();
};

// Função para buscar o extrato
export const getStatement = async (accountId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/statement`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  return response.json();
};
