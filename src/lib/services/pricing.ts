import { daysBetween } from "@/lib/utils";
import { getAtvBySlug, getAddonBySlug } from "./inventory";
import { validateDeliveryAddress } from "./delivery";

export interface QuoteInput {
  items: Array<{ atvSlug: string; quantity: number }>;
  addons?: Array<{ addonSlug: string; quantity: number }>;
  startDate: string;
  endDate: string;
  deliveryAddress: string;
}

export interface QuoteLine {
  label: string;
  quantity: number;
  numDays: number;
  unitPerDay: number;
  subtotal: number;
}

export interface Quote {
  numDays: number;
  itemLines: QuoteLine[];
  addonLines: QuoteLine[];
  atvSubtotal: number;
  addonsSubtotal: number;
  deliveryFee: number;
  deliveryZoneId?: string;
  deliveryZoneName?: string;
  preTaxSubtotal: number;
  gstAmount: number;
  pstAmount: number;
  taxAmount: number;
  grandTotal: number;
  depositTotal: number;
  outOfZone: boolean;
  notes?: string;
}

const GST_RATE = parseFloat(process.env.TAX_RATE_GST ?? "0.05");
const PST_RATE = parseFloat(process.env.TAX_RATE_PST ?? "0.07");

function multiDayDiscountFactor(days: number): number {
  if (days >= 7) return 0.85; // 15% off weekly
  if (days >= 3) return 0.92; // 8% off 3+ days
  return 1.0;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function buildQuote(input: QuoteInput): Promise<Quote> {
  const numDays = daysBetween(input.startDate, input.endDate);
  const discount = multiDayDiscountFactor(numDays);

  const itemLines: QuoteLine[] = [];
  let depositTotal = 0;
  for (const it of input.items) {
    const atv = await getAtvBySlug(it.atvSlug);
    if (!atv) {
      throw new Error(`Unknown ATV: ${it.atvSlug}`);
    }
    const dailyRate = parseFloat(atv.dailyRate);
    const effectiveRate = round2(dailyRate * discount);
    const subtotal = round2(effectiveRate * numDays * it.quantity);
    itemLines.push({
      label: atv.name,
      quantity: it.quantity,
      numDays,
      unitPerDay: effectiveRate,
      subtotal,
    });
    depositTotal += parseFloat(atv.depositAmount) * it.quantity;
  }
  const atvSubtotal = round2(itemLines.reduce((a, l) => a + l.subtotal, 0));

  const addonLines: QuoteLine[] = [];
  for (const a of input.addons ?? []) {
    const addon = await getAddonBySlug(a.addonSlug);
    if (!addon) continue;
    const perDay = parseFloat(addon.pricePerDay);
    const subtotal = round2(perDay * numDays * a.quantity);
    addonLines.push({
      label: addon.name,
      quantity: a.quantity,
      numDays,
      unitPerDay: perDay,
      subtotal,
    });
  }
  const addonsSubtotal = round2(addonLines.reduce((a, l) => a + l.subtotal, 0));

  const delivery = await validateDeliveryAddress(input.deliveryAddress);
  const deliveryFee = delivery.inZone ? round2(delivery.baseFee) : 0;

  const preTaxSubtotal = round2(atvSubtotal + addonsSubtotal + deliveryFee);
  const gstAmount = round2(preTaxSubtotal * GST_RATE);
  const pstAmount = round2(preTaxSubtotal * PST_RATE);
  const taxAmount = round2(gstAmount + pstAmount);
  const grandTotal = round2(preTaxSubtotal + taxAmount);

  return {
    numDays,
    itemLines,
    addonLines,
    atvSubtotal,
    addonsSubtotal,
    deliveryFee,
    deliveryZoneId: delivery.zoneId,
    deliveryZoneName: delivery.zoneName,
    preTaxSubtotal,
    gstAmount,
    pstAmount,
    taxAmount,
    grandTotal,
    depositTotal: round2(depositTotal),
    outOfZone: !delivery.inZone,
    notes: delivery.notes,
  };
}
