import { eq } from "drizzle-orm";
import { db } from "@/db";
import { giftCards } from "@/db/schema";
import { getStripe } from "./payments";

export async function createGiftCheckoutSession(
  giftCardId: string,
): Promise<{ paymentUrl: string | null; expiresAt: string | null }> {
  const stripe = getStripe();
  const [card] = await db
    .select()
    .from(giftCards)
    .where(eq(giftCards.id, giftCardId))
    .limit(1);
  if (!card) throw new Error(`Gift card ${giftCardId} not found.`);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const amountCents = Math.round(parseFloat(card.amountCad) * 100);
  const recipientNote = card.recipientName
    ? ` for ${card.recipientName}`
    : "";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "cad",
          unit_amount: amountCents,
          product_data: {
            name: `Squamish Adventure Rentals gift card${recipientNote}`,
            description:
              "A gift toward an ATV rental. Redeemable at booking. Valid for 24 months.",
          },
        },
      },
    ],
    customer_email: card.purchaserEmail,
    metadata: {
      gift_card_id: card.id,
      gift_card_code: card.code,
    },
    success_url: `${siteUrl}/gift/success?code=${encodeURIComponent(card.code)}`,
    cancel_url: `${siteUrl}/gift?cancelled=1`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  await db
    .update(giftCards)
    .set({ stripeSessionId: session.id })
    .where(eq(giftCards.id, card.id));

  return {
    paymentUrl: session.url,
    expiresAt: session.expires_at
      ? new Date(session.expires_at * 1000).toISOString()
      : null,
  };
}
