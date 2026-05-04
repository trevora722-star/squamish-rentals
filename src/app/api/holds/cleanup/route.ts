import { NextRequest, NextResponse } from "next/server";
import { and, eq, lt } from "drizzle-orm";
import { db } from "@/db";
import { bookingHolds, bookings } from "@/db/schema";

export const runtime = "nodejs";

/**
 * Releases expired booking holds. Designed to be hit by a cron service every
 * few minutes (Vercel Cron runs this every 5 minutes — see vercel.json).
 *
 * Auth: accepts either
 *   - Authorization: Bearer <CRON_SECRET>  (Vercel Cron default)
 *   - x-cron-secret: <CRON_SECRET>          (manual / GitHub Actions)
 *
 * If CRON_SECRET is unset, the endpoint returns 503.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 503 },
    );
  }

  const bearer = req.headers.get("authorization");
  const headerSecret = req.headers.get("x-cron-secret");
  const provided =
    bearer?.startsWith("Bearer ") ? bearer.slice(7) : headerSecret;

  if (provided !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const expiredHolds = await db
    .select({ bookingId: bookingHolds.bookingId })
    .from(bookingHolds)
    .where(lt(bookingHolds.expiresAt, now));

  const bookingIds = Array.from(
    new Set(
      expiredHolds.map((h) => h.bookingId).filter((id): id is string => Boolean(id)),
    ),
  );

  const deletedHolds = await db
    .delete(bookingHolds)
    .where(lt(bookingHolds.expiresAt, now));

  let cancelledBookings = 0;
  for (const id of bookingIds) {
    const updated = await db
      .update(bookings)
      .set({ status: "cancelled", cancelledAt: now })
      .where(and(eq(bookings.id, id), eq(bookings.status, "hold")));
    cancelledBookings += updated.length;
  }

  return NextResponse.json({
    ok: true,
    deletedHolds: deletedHolds.length,
    cancelledBookings,
    timestamp: now.toISOString(),
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
