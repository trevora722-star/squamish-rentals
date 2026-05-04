import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildQuote } from "@/lib/services/pricing";

export const runtime = "nodejs";

const Schema = z.object({
  items: z
    .array(
      z.object({
        atvSlug: z.string(),
        quantity: z.number().int().min(1).max(4),
      }),
    )
    .min(1),
  addons: z
    .array(
      z.object({
        addonSlug: z.string(),
        quantity: z.number().int().min(1),
      }),
    )
    .optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  deliveryAddress: z.string().min(2),
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
    const quote = await buildQuote(parsed.data);
    return NextResponse.json(quote);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
