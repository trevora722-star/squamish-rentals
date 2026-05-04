import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createBookingHold } from "@/lib/services/holds";
import { createCheckoutSession } from "@/lib/services/payments";

export const runtime = "nodejs";

const Schema = z.object({
  items: z
    .array(
      z.object({
        atvSlug: z.string(),
        quantity: z.number().int().min(1).max(4),
      }),
    )
    .min(1),
  addons: z
    .array(
      z.object({
        addonSlug: z.string(),
        quantity: z.number().int().min(1),
      }),
    )
    .optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  deliveryAddress: z.string().min(2),
  deliveryWindow: z.string().optional(),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(7),
  }),
  notes: z.string().optional(),
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
    const hold = await createBookingHold(parsed.data);

    let paymentUrl: string | null = null;
    let stripeError: string | null = null;
    try {
      const session = await createCheckoutSession(hold.bookingNumber);
      paymentUrl = session.payment_url;
    } catch (err) {
      stripeError = err instanceof Error ? err.message : String(err);
      console.warn("[bookings] Stripe checkout failed:", stripeError);
    }

    return NextResponse.json({
      bookingNumber: hold.bookingNumber,
      expiresAt: hold.expiresAt,
      total: hold.total,
      depositTotal: hold.depositTotal,
      paymentUrl,
      stripeError,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
