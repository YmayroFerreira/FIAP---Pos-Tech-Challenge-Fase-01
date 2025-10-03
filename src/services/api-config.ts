export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
};
