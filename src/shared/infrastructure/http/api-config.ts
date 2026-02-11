/**
 * Configuração da API
 * 
 * SEGURANÇA:
 * - Token NÃO é mais armazenado em variável global
 * - Token é gerenciado via cookies HttpOnly no servidor
 * - Todas as chamadas à API externa passam pelo proxy em /api/proxy/*
 * - Isso evita exposição do token ao JavaScript do cliente
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * @deprecated Token não deve mais ser usado diretamente.
 * Use os endpoints de proxy em /api/proxy/* que adicionam o token automaticamente.
 */
export const authToken: string | null = null;

/**
 * @deprecated Não é mais necessário setar o token manualmente.
 * O token é gerenciado via cookies HttpOnly pelo servidor.
 */
export const setAuthToken = (_token: string): void => {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "setAuthToken está obsoleto. O token agora é gerenciado via cookies HttpOnly."
    );
  }
};
