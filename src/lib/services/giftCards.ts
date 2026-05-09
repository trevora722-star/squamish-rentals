import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { giftCards, giftCardRedemptions, bookings } from "@/db/schema";
import type { GiftCard } from "@/db/schema";

const DEFAULT_EXPIRY_MONTHS = 24;

function generateCode(): string {
  // Format: SAR-GIFT-XXXX-XXXX (10 random chars from a friendly alphabet)
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no I/L/O/0/1
  let raw = "";
  for (let i = 0; i < 8; i++) {
    raw += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `SAR-GIFT-${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}

export interface CreateGiftCardInput {
  amountCad: number;
  purchaserName: string;
  purchaserEmail: string;
  recipientName?: string;
  recipientEmail?: string;
  message?: string;
}

export interface CreateGiftCardResult {
  giftCardId: string;
  code: string;
  amountCad: number;
  expiresAt: string;
}

export async function createPendingGiftCard(
  input: CreateGiftCardInput,
): Promise<CreateGiftCardResult> {
  // Generate a unique code with a small retry loop in the (very unlikely)
  // event of a collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + DEFAULT_EXPIRY_MONTHS);

    try {
      const [created] = await db
        .insert(giftCards)
        .values({
          code,
          amountCad: input.amountCad.toFixed(2),
          status: "pending",
          purchaserName: input.purchaserName,
          purchaserEmail: input.purchaserEmail,
          recipientName: input.recipientName,
          recipientEmail: input.recipientEmail,
          message: input.message,
          expiresAt,
        })
        .returning();
      return {
        giftCardId: created.id,
        code: created.code,
        amountCad: parseFloat(created.amountCad),
        expiresAt: created.expiresAt.toISOString(),
      };
    } catch (err) {
      // Likely a unique-constraint collision on `code` — retry.
      if (attempt === 4) throw err;
    }
  }
  throw new Error("Could not generate a unique gift code after retries.");
}

export async function markGiftCardPaid(
  stripeSessionId: string,
  stripePaymentIntentId: string | null,
): Promise<GiftCard | null> {
  const [updated] = await db
    .update(giftCards)
    .set({
      status: "active",
      paidAt: new Date(),
      stripePaymentIntentId,
      updatedAt: new Date(),
    })
    .where(eq(giftCards.stripeSessionId, stripeSessionId))
    .returning();
  return updated ?? null;
}

export async function lookupGiftCard(code: string): Promise<{
  giftCard: GiftCard;
  remainingBalance: number;
} | null> {
  const [row] = await db
    .select()
    .from(giftCards)
    .where(eq(giftCards.code, code.trim().toUpperCase()))
    .limit(1);
  if (!row) return null;

  const remaining =
    parseFloat(row.amountCad) - parseFloat(row.redeemedCad);
  return { giftCard: row, remainingBalance: Math.max(0, remaining) };
}

export interface ValidateGiftCardResult {
  valid: boolean;
  reason?: string;
  giftCard?: GiftCard;
  remainingBalance?: number;
}

export async function validateGiftCard(code: string): Promise<ValidateGiftCardResult> {
  const result = await lookupGiftCard(code);
  if (!result) return { valid: false, reason: "not_found" };
  const { giftCard, remainingBalance } = result;

  if (giftCard.status === "pending") {
    return {
      valid: false,
      reason: "pending_payment",
      giftCard,
      remainingBalance,
    };
  }
  if (giftCard.status === "cancelled") {
    return { valid: false, reason: "cancelled", giftCard, remainingBalance };
  }
  if (giftCard.status === "fully_redeemed" || remainingBalance <= 0) {
    return {
      valid: false,
      reason: "fully_redeemed",
      giftCard,
      remainingBalance,
    };
  }
  if (new Date(giftCard.expiresAt) < new Date()) {
    return { valid: false, reason: "expired", giftCard, remainingBalance };
  }
  return { valid: true, giftCard, remainingBalance };
}

/**
 * Atomically reserves gift-card credit and links it to a booking. Returns the
 * exact amount applied (capped at booking total and remaining balance).
 *
 * Must run inside a transaction so balance + booking update stay consistent.
 */
export async function applyGiftCardToBooking(
  tx: typeof db,
  giftCardId: string,
  bookingId: string,
  requestedAmount: number,
): Promise<number> {
  const [card] = await tx
    .select()
    .from(giftCards)
    .where(
      and(
        eq(giftCards.id, giftCardId),
        eq(giftCards.status, "active"),
        gt(giftCards.expiresAt, new Date()),
      ),
    )
    .for("update")
    .limit(1);

  if (!card) throw new Error("Gift card is not active or has expired.");

  const remaining = parseFloat(card.amountCad) - parseFloat(card.redeemedCad);
  const applied = Math.min(remaining, requestedAmount);
  if (applied <= 0) throw new Error("Gift card has no remaining balance.");

  const newRedeemed = parseFloat(card.redeemedCad) + applied;
  const fullyRedeemed = newRedeemed >= parseFloat(card.amountCad);

  await tx
    .update(giftCards)
    .set({
      redeemedCad: newRedeemed.toFixed(2),
      status: fullyRedeemed ? "fully_redeemed" : "active",
      updatedAt: new Date(),
    })
    .where(eq(giftCards.id, card.id));

  await tx.insert(giftCardRedemptions).values({
    giftCardId: card.id,
    bookingId,
    amountAppliedCad: applied.toFixed(2),
  });

  return applied;
}

export async function listAllGiftCards() {
  return db
    .select()
    .from(giftCards)
    .orderBy(sql`${giftCards.createdAt} desc`)
    .limit(200);
}

export async function listRedemptionsForGiftCard(giftCardId: string) {
  return db
    .select({
      redemption: giftCardRedemptions,
      booking: bookings,
    })
    .from(giftCardRedemptions)
    .innerJoin(bookings, eq(giftCardRedemptions.bookingId, bookings.id))
    .where(eq(giftCardRedemptions.giftCardId, giftCardId))
    .orderBy(sql`${giftCardRedemptions.redeemedAt} desc`);
}
