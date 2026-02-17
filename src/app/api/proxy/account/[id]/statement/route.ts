import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Proxy seguro para buscar extrato da conta
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;
    const { id } = await params;

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/account/${id}/statement`, {
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
      console.error("Erro no proxy de extrato:", error);
    }
    return NextResponse.json(
      { error: "Erro ao buscar extrato" },
      { status: 500 }
    );
  }
}
