import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!user || !password) {
    return new NextResponse(
      "Admin disabled. Set ADMIN_USER and ADMIN_PASSWORD in .env.local.",
      { status: 503 },
    );
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return basicAuthChallenge();
  }

  const decoded = atob(auth.slice(6));
  const [u, p] = decoded.split(":", 2);
  if (u !== user || p !== password) return basicAuthChallenge();

  return NextResponse.next();
}

function basicAuthChallenge() {
  return new NextResponse("Authorization required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Squamish Adventure Rentals admin"',
    },
  });
}
