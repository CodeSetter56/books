import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  if (token && pathname.startsWith("/authenticate")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/authenticate", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/authenticate/:path*", "/profile/:path*"],
};
