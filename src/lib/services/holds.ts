import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  bookings,
  bookingItems,
  bookingAddons,
  bookingHolds,
  customers,
  atvs,
  addons,
  deliveryZones,
} from "@/db/schema";
import { generateBookingNumber, daysBetween } from "@/lib/utils";
import { buildQuote } from "./pricing";

const HOLD_MINUTES = parseInt(process.env.BOOKING_HOLD_MINUTES ?? "15", 10);

export interface CreateHoldInput {
  items: Array<{ atvSlug: string; quantity: number }>;
  addons?: Array<{ addonSlug: string; quantity: number }>;
  startDate: string;
  endDate: string;
  deliveryAddress: string;
  deliveryWindow?: string;
  customer: { name: string; email: string; phone: string };
  notes?: string;
  chatSessionId?: string;
}

export interface CreateHoldResult {
  bookingId: string;
  bookingNumber: string;
  expiresAt: string;
  total: number;
  depositTotal: number;
}

export async function createBookingHold(
  input: CreateHoldInput,
): Promise<CreateHoldResult> {
  const quote = await buildQuote({
    items: input.items,
    addons: input.addons,
    startDate: input.startDate,
    endDate: input.endDate,
    deliveryAddress: input.deliveryAddress,
  });

  if (quote.outOfZone) {
    throw new Error(
      "Delivery address is out of our standard zones; a team member must quote this trip.",
    );
  }

  const numDays = daysBetween(input.startDate, input.endDate);
  const expiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);

  return db.transaction(async (tx) => {
    // Upsert customer by email
    const existing = await tx
      .select()
      .from(customers)
      .where(eq(customers.email, input.customer.email))
      .limit(1);

    let customerId: string;
    if (existing[0]) {
      customerId = existing[0].id;
      await tx
        .update(customers)
        .set({
          name: input.customer.name,
          phone: input.customer.phone,
        })
        .where(eq(customers.id, customerId));
    } else {
      const [created] = await tx
        .insert(customers)
        .values({
          email: input.customer.email,
          name: input.customer.name,
          phone: input.customer.phone,
        })
        .returning({ id: customers.id });
      customerId = created.id;
    }

    // Resolve delivery zone
    let deliveryZoneId: string | null = null;
    if (quote.deliveryZoneName) {
      const [zone] = await tx
        .select()
        .from(deliveryZones)
        .where(eq(deliveryZones.name, quote.deliveryZoneName))
        .limit(1);
      if (zone) deliveryZoneId = zone.id;
    }

    const bookingNumber = generateBookingNumber();
    const [booking] = await tx
      .insert(bookings)
      .values({
        bookingNumber,
        customerId,
        status: "hold",
        startDate: input.startDate,
        endDate: input.endDate,
        deliveryAddress: input.deliveryAddress,
        deliveryZoneId,
        deliveryWindow: input.deliveryWindow,
        deliveryFee: quote.deliveryFee.toFixed(2),
        atvSubtotal: quote.atvSubtotal.toFixed(2),
        addonsSubtotal: quote.addonsSubtotal.toFixed(2),
        taxAmount: quote.taxAmount.toFixed(2),
        totalAmount: quote.grandTotal.toFixed(2),
        depositTotal: quote.depositTotal.toFixed(2),
        notes: input.notes,
        chatSessionId: input.chatSessionId,
      })
      .returning();

    for (const it of input.items) {
      const [atv] = await tx
        .select()
        .from(atvs)
        .where(eq(atvs.slug, it.atvSlug))
        .limit(1);
      if (!atv) throw new Error(`Unknown ATV: ${it.atvSlug}`);
      const line = quote.itemLines.find((l) => l.label === atv.name);
      const unitRate = line?.unitPerDay ?? parseFloat(atv.dailyRate);
      const subtotal = line?.subtotal ?? unitRate * numDays * it.quantity;

      await tx.insert(bookingItems).values({
        bookingId: booking.id,
        atvId: atv.id,
        quantity: it.quantity,
        unitRate: unitRate.toFixed(2),
        numDays,
        subtotal: subtotal.toFixed(2),
      });

      await tx.insert(bookingHolds).values({
        atvId: atv.id,
        startDate: input.startDate,
        endDate: input.endDate,
        quantity: it.quantity,
        bookingId: booking.id,
        expiresAt,
      });
    }

    for (const a of input.addons ?? []) {
      const [addon] = await tx
        .select()
        .from(addons)
        .where(eq(addons.slug, a.addonSlug))
        .limit(1);
      if (!addon) continue;
      const line = quote.addonLines.find((l) => l.label === addon.name);
      const perDay = line?.unitPerDay ?? parseFloat(addon.pricePerDay);
      const subtotal = line?.subtotal ?? perDay * numDays * a.quantity;
      await tx.insert(bookingAddons).values({
        bookingId: booking.id,
        addonId: addon.id,
        quantity: a.quantity,
        unitPricePerDay: perDay.toFixed(2),
        numDays,
        subtotal: subtotal.toFixed(2),
      });
    }

    return {
      bookingId: booking.id,
      bookingNumber,
      expiresAt: expiresAt.toISOString(),
      total: quote.grandTotal,
      depositTotal: quote.depositTotal,
    };
  });
}

export async function lookupBooking(bookingNumber: string, verifyingEmail: string) {
  const rows = await db
    .select({
      booking: bookings,
      customer: customers,
    })
    .from(bookings)
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .where(eq(bookings.bookingNumber, bookingNumber))
    .limit(1);

  const row = rows[0];
  if (!row?.booking) return { found: false as const };
  if (
    !row.customer ||
    row.customer.email.toLowerCase() !== verifyingEmail.toLowerCase()
  ) {
    return { found: false as const, verificationFailed: true as const };
  }

  return { found: true as const, booking: row.booking, customer: row.customer };
}

export async function releaseExpiredHolds() {
  const now = new Date();
  await db
    .delete(bookingHolds)
    .where(and(eq(bookingHolds.bookingId, bookingHolds.bookingId)));
  // Also flip expired-hold bookings to cancelled
  await db
    .update(bookings)
    .set({ status: "cancelled", cancelledAt: now })
    .where(and(eq(bookings.status, "hold")));
}
