import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const Schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const SEVEN_DAYS = 7 * 24 * 60 * 60;

export async function POST(req: NextRequest) {
  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminUser || !adminPassword) {
    return NextResponse.json(
      { error: "Admin auth is not configured on this deploy." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Username and password required." },
      { status: 400 },
    );
  }

  const { username, password } = parsed.data;
  if (username !== adminUser || password !== adminPassword) {
    return NextResponse.json(
      { error: "Username or password is incorrect." },
      { status: 401 },
    );
  }

  const token = btoa(`${adminUser}:${adminPassword}`);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("sar_admin_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
  return res;
}
