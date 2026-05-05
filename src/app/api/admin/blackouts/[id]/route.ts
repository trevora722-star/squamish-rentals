import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { blackoutDates } from "@/db/schema";

export const runtime = "nodejs";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await db
    .delete(blackoutDates)
    .where(eq(blackoutDates.id, id))
    .returning();
  if (result.length === 0) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ deleted: true });
}
