// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_BASE_URL = 'https://backend-392021924812.southamerica-east1.run.app';

// armazena o token
export let authToken: string | null = null;

// define o token
export const setAuthToken = (token: string) => {
  authToken = token;
};
