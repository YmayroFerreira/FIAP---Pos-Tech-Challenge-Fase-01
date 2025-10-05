// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  if (!token && request.nextUrl.pathname.startsWith("/store")) {
    return NextResponse.redirect(new URL("/homepage", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/store/:path*"],
};
