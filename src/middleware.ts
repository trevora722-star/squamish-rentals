import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/api/operator/:path*", "/api/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!user || !password) {
    return new NextResponse(
      "Admin disabled. Set ADMIN_USER and ADMIN_PASSWORD env vars.",
      { status: 503 },
    );
  }

  const { pathname } = req.nextUrl;

  // The login page itself, and the auth-related API routes, must NOT be gated.
  const isPublic =
    pathname === "/admin/login" ||
    pathname === "/api/admin/auth/login" ||
    pathname === "/api/admin/auth/logout";
  if (isPublic) return NextResponse.next();

  const expectedToken = btoa(`${user}:${password}`);

  // Path 1: cookie-based auth (set by the /admin/login form)
  const cookie = req.cookies.get("sar_admin_auth")?.value;
  if (cookie && cookie === expectedToken) return NextResponse.next();

  // Path 2: HTTP Basic auth header (used by the operator app on /api/operator/*)
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    if (auth.slice(6) === expectedToken) return NextResponse.next();
  }

  // For browser /admin/* requests, redirect to login. For API routes, return 401.
  if (pathname.startsWith("/admin")) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return new NextResponse("Authorization required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Squamish Adventure Rentals admin"',
    },
  });
}
