import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { blackoutDates } from "@/db/schema";

export const runtime = "nodejs";

const BodySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().max(200).nullable().optional(),
  atvId: z.string().uuid().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const [created] = await db
    .insert(blackoutDates)
    .values({
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
      reason: parsed.data.reason ?? null,
      atvId: parsed.data.atvId ?? null,
    })
    .returning();
  return NextResponse.json({ blackout: created });
}
