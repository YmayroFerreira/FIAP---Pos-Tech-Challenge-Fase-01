import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Headers de segurança
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/**
 * Middleware de autenticação e segurança
 * - Verifica o cookie HttpOnly em vez de localStorage
 * - Adiciona headers de segurança em todas as respostas
 * - Executa no servidor, não pode ser bypassado pelo cliente
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
  // Usa path relativo para manter o usuário no mesmo domínio (micro-frontend)
  if (!token && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/homepage";
    return NextResponse.redirect(url);
  }

  // Cria a resposta
  const requestHeaders = new Headers(request.headers);
  if (token) {
    requestHeaders.set("x-auth-token", token);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Adiciona headers de segurança
  securityHeaders.forEach(({ key, value }) => {
    response.headers.set(key, value);
  });

  return response;
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
