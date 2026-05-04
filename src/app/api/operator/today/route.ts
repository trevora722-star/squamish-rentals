import { NextResponse } from "next/server";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings, customers, deliveryZones } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns bookings for today (delivery day) for the operator app.
 * Auth is enforced by middleware (HTTP Basic on /api/operator/*).
 */
export async function GET() {
  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);

  const rows = await db
    .select({
      id: bookings.id,
      bookingNumber: bookings.bookingNumber,
      status: bookings.status,
      startDate: bookings.startDate,
      endDate: bookings.endDate,
      deliveryAddress: bookings.deliveryAddress,
      deliveryWindow: bookings.deliveryWindow,
      totalAmount: bookings.totalAmount,
      paidAt: bookings.paidAt,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      zoneName: deliveryZones.name,
    })
    .from(bookings)
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .leftJoin(deliveryZones, eq(bookings.deliveryZoneId, deliveryZones.id))
    .where(
      and(
        lte(bookings.startDate, todayISO),
        gte(bookings.endDate, todayISO),
        sql`${bookings.status} in ('confirmed','in_progress')`,
      ),
    );

  return NextResponse.json({ today: todayISO, bookings: rows });
}
