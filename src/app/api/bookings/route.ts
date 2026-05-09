import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { createBookingHold } from "@/lib/services/holds";
import { createCheckoutSession } from "@/lib/services/payments";
import {
  applyGiftCardToBooking,
  validateGiftCard,
} from "@/lib/services/giftCards";

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
  giftCode: z.string().optional(),
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

    // Apply gift code if provided. We do this AFTER the hold is created so the
    // gift redemption is tied to a real booking record.
    let giftApplied = 0;
    let giftError: string | null = null;
    const giftCode = parsed.data.giftCode?.trim();
    if (giftCode) {
      try {
        const validation = await validateGiftCard(giftCode);
        if (!validation.valid || !validation.giftCard) {
          giftError = `Gift code is not redeemable (${validation.reason ?? "unknown"}).`;
        } else {
          giftApplied = await db.transaction(async (tx) => {
            const applied = await applyGiftCardToBooking(
              tx,
              validation.giftCard!.id,
              hold.bookingId,
              hold.total,
            );
            // Persist the credit on the booking row + reduce remaining due if fully paid
            await tx
              .update(bookings)
              .set({
                giftCreditApplied: applied.toFixed(2),
                ...(applied >= hold.total
                  ? { status: "confirmed", paidAt: new Date() }
                  : {}),
                updatedAt: new Date(),
              })
              .where(eq(bookings.id, hold.bookingId));
            return applied;
          });
        }
      } catch (err) {
        giftError = err instanceof Error ? err.message : String(err);
      }
    }

    const remainingDue = Math.max(0, hold.total - giftApplied);

    // If the gift fully covers the booking, no Stripe charge needed.
    if (giftApplied > 0 && remainingDue === 0) {
      return NextResponse.json({
        bookingNumber: hold.bookingNumber,
        expiresAt: hold.expiresAt,
        total: hold.total,
        giftApplied,
        remainingDue: 0,
        depositTotal: hold.depositTotal,
        paymentUrl: null,
        fullyCoveredByGift: true,
      });
    }

    let paymentUrl: string | null = null;
    let stripeError: string | null = null;
    try {
      const session = await createCheckoutSession(hold.bookingNumber, {
        amountOverrideCad: remainingDue,
      });
      paymentUrl = session.payment_url;
    } catch (err) {
      stripeError = err instanceof Error ? err.message : String(err);
      console.warn("[bookings] Stripe checkout failed:", stripeError);
    }

    return NextResponse.json({
      bookingNumber: hold.bookingNumber,
      expiresAt: hold.expiresAt,
      total: hold.total,
      giftApplied,
      giftError,
      remainingDue,
      depositTotal: hold.depositTotal,
      paymentUrl,
      stripeError,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
