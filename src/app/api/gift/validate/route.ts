import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateGiftCard } from "@/lib/services/giftCards";

export const runtime = "nodejs";

const Schema = z.object({
  code: z.string().min(4).max(40),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }
  const result = await validateGiftCard(parsed.data.code);
  if (!result.valid) {
    return NextResponse.json({
      valid: false,
      reason: result.reason,
      remainingBalance: result.remainingBalance ?? 0,
    });
  }
  return NextResponse.json({
    valid: true,
    code: result.giftCard?.code,
    remainingBalance: result.remainingBalance,
    expiresAt: result.giftCard?.expiresAt,
  });
}
