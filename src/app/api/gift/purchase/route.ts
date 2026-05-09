import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPendingGiftCard } from "@/lib/services/giftCards";
import { createGiftCheckoutSession } from "@/lib/services/giftPayments";

export const runtime = "nodejs";

const Schema = z.object({
  amountCad: z.number().min(50).max(5000),
  purchaserName: z.string().min(1).max(128),
  purchaserEmail: z.string().email(),
  recipientName: z.string().max(128).optional().or(z.literal("")),
  recipientEmail: z.string().email().optional().or(z.literal("")),
  message: z.string().max(500).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const card = await createPendingGiftCard({
      amountCad: parsed.data.amountCad,
      purchaserName: parsed.data.purchaserName,
      purchaserEmail: parsed.data.purchaserEmail,
      recipientName: parsed.data.recipientName?.trim() || undefined,
      recipientEmail: parsed.data.recipientEmail?.trim() || undefined,
      message: parsed.data.message?.trim() || undefined,
    });

    let paymentUrl: string | null = null;
    let stripeError: string | null = null;
    try {
      const session = await createGiftCheckoutSession(card.giftCardId);
      paymentUrl = session.paymentUrl;
    } catch (err) {
      stripeError = err instanceof Error ? err.message : String(err);
      console.warn("[gift purchase] Stripe checkout failed:", stripeError);
    }

    return NextResponse.json({
      giftCardId: card.giftCardId,
      code: card.code,
      paymentUrl,
      stripeError,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
