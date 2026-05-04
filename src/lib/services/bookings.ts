import { and, eq, gte, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  bookings,
  bookingHolds,
  bookingItems,
  customers,
} from "@/db/schema";
import { daysBetween } from "@/lib/utils";
import { getUnitsAvailable } from "./availability";

export interface CancelBookingInput {
  bookingNumber: string;
  verifyingEmail: string;
  reason?: string;
}

export type CancelBookingResult =
  | { ok: true; status: string; refundPolicy: string }
  | { ok: false; reason: string };

const HOURS = 60 * 60 * 1000;

function refundPolicyForHoursOut(hoursOut: number): {
  refundPercent: number;
  description: string;
} {
  if (hoursOut >= 48) {
    return {
      refundPercent: 100,
      description: "Full refund (cancelled more than 48 hours before trip).",
    };
  }
  if (hoursOut >= 24) {
    return {
      refundPercent: 50,
      description: "50% refund (cancelled 24–48 hours before trip).",
    };
  }
  return {
    refundPercent: 0,
    description: "Non-refundable (cancelled within 24 hours of trip start).",
  };
}

export async function cancelBooking(
  input: CancelBookingInput,
): Promise<CancelBookingResult> {
  const rows = await db
    .select({ booking: bookings, customer: customers })
    .from(bookings)
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .where(eq(bookings.bookingNumber, input.bookingNumber))
    .limit(1);

  const row = rows[0];
  if (!row?.booking) return { ok: false, reason: "booking_not_found" };
  if (
    !row.customer ||
    row.customer.email.toLowerCase() !== input.verifyingEmail.toLowerCase()
  ) {
    return { ok: false, reason: "verification_failed" };
  }

  const status = row.booking.status;
  if (status === "cancelled" || status === "completed" || status === "refunded") {
    return { ok: false, reason: `already_${status}` };
  }

  const startMs = new Date(`${row.booking.startDate}T00:00:00Z`).getTime();
  const hoursOut = (startMs - Date.now()) / HOURS;
  const policy = refundPolicyForHoursOut(hoursOut);

  await db.transaction(async (tx) => {
    await tx
      .update(bookings)
      .set({
        status: "cancelled",
        cancelledAt: new Date(),
        notes: input.reason
          ? `${row.booking.notes ? row.booking.notes + "\n" : ""}Cancelled: ${input.reason}`
          : row.booking.notes,
      })
      .where(eq(bookings.id, row.booking.id));
    await tx.delete(bookingHolds).where(eq(bookingHolds.bookingId, row.booking.id));
  });

  return { ok: true, status: "cancelled", refundPolicy: policy.description };
}

export interface ModifyBookingDatesInput {
  bookingNumber: string;
  verifyingEmail: string;
  newStartDate: string;
  newEndDate: string;
}

export type ModifyBookingDatesResult =
  | {
      ok: true;
      newNumDays: number;
      changeFee: number;
      message: string;
    }
  | { ok: false; reason: string; conflicts?: string[] };

export async function modifyBookingDates(
  input: ModifyBookingDatesInput,
): Promise<ModifyBookingDatesResult> {
  const rows = await db
    .select({ booking: bookings, customer: customers })
    .from(bookings)
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .where(eq(bookings.bookingNumber, input.bookingNumber))
    .limit(1);

  const row = rows[0];
  if (!row?.booking) return { ok: false, reason: "booking_not_found" };
  if (
    !row.customer ||
    row.customer.email.toLowerCase() !== input.verifyingEmail.toLowerCase()
  ) {
    return { ok: false, reason: "verification_failed" };
  }

  const status = row.booking.status;
  if (status !== "hold" && status !== "confirmed") {
    return { ok: false, reason: `cannot_modify_${status}` };
  }

  // Pull the booking items so we know which ATVs to check
  const items = await db
    .select()
    .from(bookingItems)
    .where(eq(bookingItems.bookingId, row.booking.id));

  // Check availability for the new range against ALL atvs in the booking,
  // ignoring the existing booking's reservations (otherwise we'd self-conflict).
  // For simplicity, we add back the existing units before checking.
  const conflicts: string[] = [];
  for (const it of items) {
    // available units for new range (excluding current booking)
    const avail = await getUnitsAvailable(
      it.atvId,
      input.newStartDate,
      input.newEndDate,
    );
    // current booking already counts as `it.quantity` reserved against itself for the new range only if dates overlap;
    // for the simple case (no overlap), we need at least it.quantity available.
    if (avail < it.quantity) {
      conflicts.push(it.atvId);
    }
  }
  if (conflicts.length > 0) {
    return { ok: false, reason: "no_availability", conflicts };
  }

  const startMs = new Date(`${row.booking.startDate}T00:00:00Z`).getTime();
  const hoursOut = (startMs - Date.now()) / HOURS;
  const changeFee = hoursOut < 48 ? 50 : 0;

  const newNumDays = daysBetween(input.newStartDate, input.newEndDate);

  await db.transaction(async (tx) => {
    await tx
      .update(bookings)
      .set({
        startDate: input.newStartDate,
        endDate: input.newEndDate,
        notes:
          (row.booking.notes ? row.booking.notes + "\n" : "") +
          `Dates modified ${row.booking.startDate}→${input.newStartDate}, ${row.booking.endDate}→${input.newEndDate}` +
          (changeFee > 0 ? ` (change fee $${changeFee})` : ""),
      })
      .where(eq(bookings.id, row.booking.id));
    // Move associated holds to new dates
    await tx
      .update(bookingHolds)
      .set({
        startDate: input.newStartDate,
        endDate: input.newEndDate,
      })
      .where(eq(bookingHolds.bookingId, row.booking.id));
    // Update booking_items numDays to reflect new trip length
    await tx
      .update(bookingItems)
      .set({ numDays: newNumDays })
      .where(eq(bookingItems.bookingId, row.booking.id));
  });

  return {
    ok: true,
    newNumDays,
    changeFee,
    message:
      changeFee > 0
        ? `Dates updated. A $${changeFee} change fee applies because the trip starts within 48 hours.`
        : "Dates updated. No change fee — booked outside the 48-hour window.",
  };
}

export async function listUpcomingBookings(daysAhead = 60) {
  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);
  return db
    .select({ booking: bookings, customer: customers })
    .from(bookings)
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .where(
      and(
        gte(bookings.startDate, todayISO),
        inArray(bookings.status, ["confirmed", "hold", "in_progress"] as const),
      ),
    );
}
