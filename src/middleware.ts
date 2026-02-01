import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware de autenticação seguro
 * Verifica o cookie HttpOnly em vez de localStorage
 * Executa no servidor, não pode ser bypassado pelo cliente
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicPaths = ["/homepage", "/api/"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Arquivos estáticos não precisam de verificação
  const isStaticFile = pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2)$/);
  
  if (isStaticFile || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Se não tem token e não é rota pública, redireciona para login
  if (!token && !isPublicPath) {
    const homepageUrl = process.env.NEXT_PUBLIC_HOMEPAGE_URL || "http://localhost:3001";
    return NextResponse.redirect(`${homepageUrl}/homepage`);
  }

  // Se tem token, adiciona ao header para uso nas APIs (server-side)
  if (token) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-auth-token", token);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
