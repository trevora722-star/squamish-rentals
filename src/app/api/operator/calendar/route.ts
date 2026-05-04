import { NextRequest, NextResponse } from "next/server";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings, customers, deliveryZones } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns upcoming bookings for the next N days (default 30) for the calendar view.
 */
export async function GET(req: NextRequest) {
  const days = parseInt(req.nextUrl.searchParams.get("days") ?? "30", 10);
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
      customerName: customers.name,
      customerPhone: customers.phone,
      zoneName: deliveryZones.name,
    })
    .from(bookings)
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .leftJoin(deliveryZones, eq(bookings.deliveryZoneId, deliveryZones.id))
    .where(
      and(
        gte(bookings.startDate, todayISO),
        sql`${bookings.status} in ('confirmed','hold','in_progress')`,
      ),
    )
    .orderBy(bookings.startDate);

  // Group by start date for the calendar grid
  const byDay: Record<string, typeof rows> = {};
  for (const r of rows) {
    if (!byDay[r.startDate]) byDay[r.startDate] = [];
    byDay[r.startDate].push(r);
  }

  return NextResponse.json({ todayISO, days, byDay });
}
