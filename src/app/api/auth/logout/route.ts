import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Endpoint de logout seguro
 * Remove o cookie de autenticação HttpOnly
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Remove o cookie de autenticação
    cookieStore.delete("authToken");

    return NextResponse.json({
      success: true,
      message: "Logout realizado com sucesso",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Erro no logout:", error);
    }
    return NextResponse.json(
      { message: "Erro ao realizar logout" },
      { status: 500 }
    );
  }
}
