import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, customers } from "@/db/schema";
import { getStripe, fulfillBookingFromSession } from "@/lib/services/payments";
import { sendBookingConfirmation } from "@/lib/services/email";
import { markGiftCardPaid } from "@/lib/services/giftCards";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return new Response("Stripe webhook not configured.", { status: 503 });
  }

  const rawBody = await req.text();
  let event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      id: string;
      payment_intent?: string | null;
      metadata?: Record<string, string>;
    };

    // Gift card purchase fulfilment
    const giftCardId = session.metadata?.gift_card_id;
    if (giftCardId) {
      await markGiftCardPaid(
        session.id,
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
      ).catch((err) =>
        console.error("[stripe webhook] gift card fulfilment failed", err),
      );
      // (Optional) send a "your gift card is ready" email here.
      return new Response("ok", { status: 200 });
    }

    const bookingNumber = session.metadata?.booking_number;
    if (bookingNumber) {
      await fulfillBookingFromSession(session.id);
      const [row] = await db
        .select({
          booking: bookings,
          customer: customers,
        })
        .from(bookings)
        .leftJoin(customers, eq(bookings.customerId, customers.id))
        .where(eq(bookings.bookingNumber, bookingNumber))
        .limit(1);
      if (row?.booking && row.customer) {
        await sendBookingConfirmation({
          to: row.customer.email,
          customerName: row.customer.name,
          bookingNumber: row.booking.bookingNumber,
          startDate: row.booking.startDate,
          endDate: row.booking.endDate,
          deliveryAddress: row.booking.deliveryAddress,
          deliveryWindow: row.booking.deliveryWindow,
          totalCad: parseFloat(row.booking.totalAmount),
        }).catch((err) =>
          console.error("[stripe webhook] confirmation email failed", err),
        );
      }
    }
  }

  return new Response("ok", { status: 200 });
}
