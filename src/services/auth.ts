import {
  authenticateUser,
  authUserData,
  createUser,
  createUserData,
} from "./api";
import { setAuthToken } from "./api-config";

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
    let authResponse = await authenticateUser(authData);

    if (authResponse && authResponse.result && authResponse.result.token) {
      setAuthToken(authResponse.result.token);
      console.log("Login automático bem-sucedido na primeira tentativa.");
      return authResponse.result.token;
    }

    console.log(
      "Primeira tentativa de login falhou, tentando criar o usuário..."
    );
    await createUser(newUserData);

    console.log("Tentando autenticar novamente após a criação do usuário...");
    authResponse = await authenticateUser(authData);

    if (authResponse && authResponse.result && authResponse.result.token) {
      setAuthToken(authResponse.result.token);
      console.log("Login automático bem-sucedido após a criação do usuário.");
      return authResponse.result.token;
    } else {
      console.error(
        "Falha no login automático após tentativa de criação:",
        authResponse.message || "Resposta de autenticação inválida"
      );
      return null;
    }
  } catch (error) {
    console.error("Erro inesperado durante o login automático:", error);
    return null;
  }
};
