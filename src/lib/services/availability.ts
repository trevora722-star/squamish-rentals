import { and, eq, gt, gte, inArray, lt, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  atvs,
  bookingHolds,
  bookingItems,
  bookings,
} from "@/db/schema";
import { addDays } from "date-fns";

export interface AvailabilityResult {
  available: boolean;
  atvSlug: string | null;
  unitsAvailable: number;
  unitsRequested: number;
  unitsOwned: number;
  alternativeDates?: { startDate: string; endDate: string }[];
}

const ACTIVE_BOOKING_STATUSES = [
  "hold",
  "confirmed",
  "in_progress",
] as const;

export async function getUnitsAvailable(
  atvId: string,
  startDate: string,
  endDate: string,
): Promise<number> {
  const [atvRow] = await db
    .select({ owned: atvs.quantityOwned })
    .from(atvs)
    .where(eq(atvs.id, atvId))
    .limit(1);
  if (!atvRow) return 0;

  // count booked units overlapping range
  const bookedRows = await db
    .select({
      qty: sql<number>`coalesce(sum(${bookingItems.quantity}), 0)::int`,
    })
    .from(bookingItems)
    .innerJoin(bookings, eq(bookingItems.bookingId, bookings.id))
    .where(
      and(
        eq(bookingItems.atvId, atvId),
        inArray(bookings.status, ACTIVE_BOOKING_STATUSES),
        // overlap: booking.start <= range.end AND booking.end >= range.start
        lte(bookings.startDate, endDate),
        gte(bookings.endDate, startDate),
      ),
    );

  // count active holds overlapping range
  const heldRows = await db
    .select({
      qty: sql<number>`coalesce(sum(${bookingHolds.quantity}), 0)::int`,
    })
    .from(bookingHolds)
    .where(
      and(
        eq(bookingHolds.atvId, atvId),
        gt(bookingHolds.expiresAt, new Date()),
        lte(bookingHolds.startDate, endDate),
        gte(bookingHolds.endDate, startDate),
      ),
    );

  const booked = Number(bookedRows[0]?.qty ?? 0);
  const held = Number(heldRows[0]?.qty ?? 0);
  return Math.max(0, atvRow.owned - booked - held);
}

export async function checkAvailability({
  atvSlug,
  startDate,
  endDate,
  quantity = 1,
}: {
  atvSlug?: string;
  startDate: string;
  endDate: string;
  quantity?: number;
}): Promise<AvailabilityResult[]> {
  const targets = await db
    .select({
      id: atvs.id,
      slug: atvs.slug,
      owned: atvs.quantityOwned,
    })
    .from(atvs)
    .where(
      atvSlug
        ? and(eq(atvs.active, true), eq(atvs.slug, atvSlug))
        : eq(atvs.active, true),
    );

  const results: AvailabilityResult[] = [];
  for (const t of targets) {
    const available = await getUnitsAvailable(t.id, startDate, endDate);
    results.push({
      atvSlug: t.slug,
      available: available >= quantity,
      unitsAvailable: available,
      unitsRequested: quantity,
      unitsOwned: t.owned,
    });
  }

  // For the requested ATV, suggest alternative dates if not available
  if (atvSlug && results[0] && !results[0].available) {
    const alternatives: { startDate: string; endDate: string }[] = [];
    const startD = new Date(startDate);
    const endD = new Date(endDate);
    const tripDays = Math.max(
      1,
      Math.round((endD.getTime() - startD.getTime()) / 86_400_000),
    );
    for (let offset = 1; offset <= 14 && alternatives.length < 3; offset++) {
      const candStart = addDays(startD, offset);
      const candEnd = addDays(candStart, tripDays);
      const csISO = candStart.toISOString().slice(0, 10);
      const ceISO = candEnd.toISOString().slice(0, 10);
      const target = targets[0];
      if (!target) break;
      const avail = await getUnitsAvailable(target.id, csISO, ceISO);
      if (avail >= quantity) {
        alternatives.push({ startDate: csISO, endDate: ceISO });
      }
    }
    results[0].alternativeDates = alternatives;
  }

  return results;
}
