import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, bookingItems, atvs, bookingAddons, addons } from "@/db/schema";

const stripeSecret = process.env.STRIPE_SECRET_KEY;

let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeSecret) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to your .env.local before generating payment links.",
    );
  }
  if (!stripeClient) {
    stripeClient = new Stripe(stripeSecret);
  }
  return stripeClient;
}

export async function createCheckoutSession(bookingNumber: string) {
  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.bookingNumber, bookingNumber))
    .limit(1);
  if (!booking) {
    throw new Error(`Booking ${bookingNumber} not found.`);
  }

  const items = await db
    .select({
      qty: bookingItems.quantity,
      subtotal: bookingItems.subtotal,
      atvName: atvs.name,
    })
    .from(bookingItems)
    .innerJoin(atvs, eq(bookingItems.atvId, atvs.id))
    .where(eq(bookingItems.bookingId, booking.id));

  const addonRows = await db
    .select({
      qty: bookingAddons.quantity,
      subtotal: bookingAddons.subtotal,
      name: addons.name,
    })
    .from(bookingAddons)
    .innerJoin(addons, eq(bookingAddons.addonId, addons.id))
    .where(eq(bookingAddons.bookingId, booking.id));

  const stripe = getStripe();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Derive the line-item type from the Stripe create() signature so we're not
  // reliant on a specific namespace path (which has shifted between Stripe SDK
  // versions and breaks Netlify's stricter type resolution).
  // create()'s first param is overloaded as optional → strip undefined first.
  type CreateParams = NonNullable<
    Parameters<typeof stripe.checkout.sessions.create>[0]
  >;
  type LineItem = NonNullable<CreateParams["line_items"]>[number];

  const lineItems: LineItem[] = items.map((it) => ({
    quantity: it.qty,
    price_data: {
      currency: "cad",
      unit_amount: Math.round((parseFloat(it.subtotal) / it.qty) * 100),
      product_data: { name: it.atvName },
    },
  }));
  for (const ad of addonRows) {
    lineItems.push({
      quantity: ad.qty,
      price_data: {
        currency: "cad",
        unit_amount: Math.round((parseFloat(ad.subtotal) / ad.qty) * 100),
        product_data: { name: ad.name },
      },
    });
  }
  if (parseFloat(booking.deliveryFee) > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "cad",
        unit_amount: Math.round(parseFloat(booking.deliveryFee) * 100),
        product_data: { name: "Delivery" },
      },
    });
  }
  if (parseFloat(booking.taxAmount) > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "cad",
        unit_amount: Math.round(parseFloat(booking.taxAmount) * 100),
        product_data: { name: "GST + PST" },
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    metadata: { booking_id: booking.id, booking_number: booking.bookingNumber },
    success_url: `${siteUrl}/bookings/${booking.bookingNumber}?paid=1`,
    cancel_url: `${siteUrl}/chat?booking=${booking.bookingNumber}&cancelled=1`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  await db
    .update(bookings)
    .set({ stripeSessionId: session.id })
    .where(eq(bookings.id, booking.id));

  return {
    booking_number: booking.bookingNumber,
    payment_url: session.url,
    expires_at: new Date((session.expires_at ?? 0) * 1000).toISOString(),
  };
}

export async function fulfillBookingFromSession(sessionId: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const bookingNumber = session.metadata?.booking_number;
  if (!bookingNumber) return;

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.bookingNumber, bookingNumber))
    .limit(1);
  if (!booking) return;

  if (session.payment_status === "paid") {
    await db
      .update(bookings)
      .set({
        status: "confirmed",
        paidAt: new Date(),
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent?.id ?? null),
      })
      .where(eq(bookings.id, booking.id));
  }
}

export { getStripe };
