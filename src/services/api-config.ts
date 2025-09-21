export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// armazena o token
export let authToken: string | null = null;

// define o token
export const setAuthToken = (token: string) => {
  authToken = token;
};
