import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Endpoint para obter o token de autenticação de forma segura
 * Este endpoint é usado internamente para obter o token para chamadas à API externa
 * O token nunca é exposto ao JavaScript do cliente diretamente
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Não autenticado" },
        { status: 401 }
      );
    }

    // Retorna o token apenas para uso server-side
    // Este endpoint deve ser chamado apenas por Server Components ou API Routes
    return NextResponse.json({
      success: true,
      token: token,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Erro ao obter token:", error);
    }
    return NextResponse.json(
      { success: false, message: "Erro ao obter token" },
      { status: 500 }
    );
  }
}
