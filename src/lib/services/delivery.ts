import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { deliveryZones } from "@/db/schema";

export interface ValidateDeliveryResult {
  inZone: boolean;
  zoneId?: string;
  zoneName?: string;
  baseFee: number;
  estimatedTotal: number;
  notes?: string;
}

const KEYWORDS: Record<string, string[]> = {
  "Squamish Core": [
    "squamish",
    "brackendale",
    "garibaldi highlands",
    "valleycliffe",
    "downtown squamish",
    "v8b",
  ],
  "Sea-to-Sky North": [
    "whistler",
    "creekside",
    "pemberton",
    "mount currie",
    "function junction",
    "alpine meadows",
    "v0n 1b",
  ],
  "Sea-to-Sky South": [
    "britannia",
    "lions bay",
    "horseshoe bay",
    "furry creek",
    "porteau cove",
  ],
  "Greater Vancouver": [
    "vancouver",
    "north vancouver",
    "west vancouver",
    "burnaby",
    "richmond",
    "surrey",
    "coquitlam",
    "v5",
    "v6",
    "v7",
    "v3",
  ],
};

function matchZoneByKeyword(address: string): string | null {
  const lower = address.toLowerCase();
  for (const [zone, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return zone;
  }
  return null;
}

export async function validateDeliveryAddress(
  address: string,
): Promise<ValidateDeliveryResult> {
  const matched = matchZoneByKeyword(address);
  if (!matched) {
    return {
      inZone: false,
      baseFee: 0,
      estimatedTotal: 0,
      notes:
        "We couldn't match this address to one of our standard delivery zones. " +
        "A team member will need to provide a custom quote.",
    };
  }

  const [zone] = await db
    .select()
    .from(deliveryZones)
    .where(and(eq(deliveryZones.name, matched), eq(deliveryZones.active, true)))
    .limit(1);

  if (!zone) {
    return {
      inZone: false,
      baseFee: 0,
      estimatedTotal: 0,
      notes:
        "Matched zone is currently disabled. A team member will follow up with options.",
    };
  }

  const baseFee = Number(zone.baseFee);
  return {
    inZone: true,
    zoneId: zone.id,
    zoneName: zone.name,
    baseFee,
    estimatedTotal: baseFee,
    notes: zone.description ?? undefined,
  };
}

export async function getZoneById(id: string) {
  const [zone] = await db
    .select()
    .from(deliveryZones)
    .where(eq(deliveryZones.id, id))
    .limit(1);
  return zone ?? null;
}
