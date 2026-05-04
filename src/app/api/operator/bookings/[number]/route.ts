import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
  bookings,
  bookingItems,
  bookingAddons,
  customers,
  deliveryZones,
  atvs,
  addons,
} from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ number: string }> },
) {
  const { number } = await params;
  const [row] = await db
    .select({
      booking: bookings,
      customer: customers,
      zone: deliveryZones,
    })
    .from(bookings)
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .leftJoin(deliveryZones, eq(bookings.deliveryZoneId, deliveryZones.id))
    .where(eq(bookings.bookingNumber, number))
    .limit(1);

  if (!row?.booking) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const items = await db
    .select({
      qty: bookingItems.quantity,
      unitRate: bookingItems.unitRate,
      numDays: bookingItems.numDays,
      subtotal: bookingItems.subtotal,
      atvName: atvs.name,
      atvSlug: atvs.slug,
    })
    .from(bookingItems)
    .innerJoin(atvs, eq(bookingItems.atvId, atvs.id))
    .where(eq(bookingItems.bookingId, row.booking.id));

  const addonRows = await db
    .select({
      qty: bookingAddons.quantity,
      perDay: bookingAddons.unitPricePerDay,
      numDays: bookingAddons.numDays,
      subtotal: bookingAddons.subtotal,
      addonName: addons.name,
      addonSlug: addons.slug,
    })
    .from(bookingAddons)
    .innerJoin(addons, eq(bookingAddons.addonId, addons.id))
    .where(eq(bookingAddons.bookingId, row.booking.id));

  return NextResponse.json({
    booking: row.booking,
    customer: row.customer,
    zone: row.zone,
    items,
    addons: addonRows,
  });
}

const PatchSchema = z.object({
  status: z.enum([
    "pending",
    "hold",
    "confirmed",
    "in_progress",
    "completed",
    "cancelled",
    "refunded",
  ]),
  notes: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ number: string }> },
) {
  const { number } = await params;
  const body = await req.json();
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const updates: Partial<typeof bookings.$inferInsert> = {
    status: parsed.data.status,
    updatedAt: new Date(),
  };
  if (parsed.data.status === "cancelled") updates.cancelledAt = new Date();
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;

  const result = await db
    .update(bookings)
    .set(updates)
    .where(eq(bookings.bookingNumber, number))
    .returning();

  if (result.length === 0) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ booking: result[0] });
}
