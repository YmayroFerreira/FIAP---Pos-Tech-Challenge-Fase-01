import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Proxy seguro para a API de conta
 * - Obtém o token do cookie HttpOnly (não acessível ao JavaScript)
 * - Adiciona o token ao header Authorization
 * - Encaminha a requisição para a API externa
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/account`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Erro no proxy de conta:", error);
    }
    return NextResponse.json(
      { error: "Erro ao obter dados da conta" },
      { status: 500 }
    );
  }
}
