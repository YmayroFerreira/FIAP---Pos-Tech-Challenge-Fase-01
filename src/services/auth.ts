import {
  authenticateUser,
  authUserData,
  createUser,
  createUserData,
} from "./api";
import { setAuthToken } from "./api-config";

// Função de login automática
export const loginAutomatically = async () => {
  const newUserData: createUserData = {
    username: "teste",
    email: "teste@gmail.com",
    password: "testes",
  };
  const authData: authUserData = {
    email: "teste@gmail.com",
    password: "testes",
  };

  try {
    // Tenta autenticar primeiro. Se o usuário já existir e a senha estiver correta,
    // isso deve funcionar e evitar a criação desnecessária.
    let authResponse = await authenticateUser(authData);

    // Se a primeira tentativa de autenticação for bem-sucedida, armazena o token e retorna.
    if (authResponse && authResponse.result && authResponse.result.token) {
      setAuthToken(authResponse.result.token);
      console.log("Login automático bem-sucedido na primeira tentativa.");
      return authResponse.result.token;
    }

    // Se a primeira tentativa falhar, assume que o usuário pode não existir e tenta criá-lo.
    // O erro de "usuário já existe" será ignorado e a lógica continuará.
    console.log(
      "Primeira tentativa de login falhou, tentando criar o usuário...",
    );
    await createUser(newUserData);

    // Após a tentativa de criação, tenta autenticar novamente.
    console.log("Tentando autenticar novamente após a criação do usuário...");
    authResponse = await authenticateUser(authData);

    if (authResponse && authResponse.result && authResponse.result.token) {
      setAuthToken(authResponse.result.token);
      console.log("Login automático bem-sucedido após a criação do usuário.");
      return authResponse.result.token;
    } else {
      // Se a segunda tentativa também falhar, registra o erro.
      console.error(
        "Falha no login automático após tentativa de criação:",
        authResponse.message || "Resposta de autenticação inválida",
      );
      return null;
    }
  } catch (error) {
    console.error("Erro inesperado durante o login automático:", error);
    return null;
  }
};
