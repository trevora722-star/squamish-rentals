import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAvailability } from "@/lib/services/availability";

export const runtime = "nodejs";

const Schema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  atvSlug: z.string().optional(),
  quantity: z.number().int().min(1).max(4).default(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  try {
    const results = await checkAvailability(parsed.data);
    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
