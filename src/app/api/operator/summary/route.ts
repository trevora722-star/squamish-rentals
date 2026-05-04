import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lightweight summary for the operator app dashboard header:
 * - today's deliveries count
 * - upcoming (next 7 days) count
 * - in-progress (active rentals) count
 * - new (paid in the last 24h) count
 */
export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAhead = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [stats] = await db
    .select({
      todayCount: sql<number>`count(*) filter (where start_date = ${today} and status in ('confirmed','in_progress'))::int`,
      upcomingCount: sql<number>`count(*) filter (where start_date > ${today} and start_date <= ${sevenDaysAhead} and status in ('confirmed','hold'))::int`,
      inProgressCount: sql<number>`count(*) filter (where status = 'in_progress')::int`,
      newPaidCount: sql<number>`count(*) filter (where paid_at > now() - interval '24 hours')::int`,
    })
    .from(bookings);

  return NextResponse.json({
    today: stats?.todayCount ?? 0,
    upcoming: stats?.upcomingCount ?? 0,
    inProgress: stats?.inProgressCount ?? 0,
    newPaid: stats?.newPaidCount ?? 0,
  });
}
