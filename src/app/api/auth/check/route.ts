import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Endpoint para verificar se o usuário está autenticado
 * Usado pelo AuthGuard para verificação client-side
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: "Não autenticado" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      message: "Autenticado",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Erro ao verificar autenticação:", error);
    }
    return NextResponse.json(
      { authenticated: false, message: "Erro ao verificar autenticação" },
      { status: 500 }
    );
  }
}
