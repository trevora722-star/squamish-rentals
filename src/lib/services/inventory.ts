import { and, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { atvs, addons, type Atv } from "@/db/schema";

export interface InventoryFilter {
  skillLevel?: "beginner" | "intermediate" | "advanced";
  minSeats?: number;
}

export async function listInventory(filter: InventoryFilter = {}): Promise<Atv[]> {
  const conditions = [eq(atvs.active, true)];
  if (filter.skillLevel) {
    conditions.push(eq(atvs.skillLevel, filter.skillLevel));
  }
  if (filter.minSeats) {
    conditions.push(gte(atvs.seats, filter.minSeats));
  }
  return db.select().from(atvs).where(and(...conditions));
}

export async function getAtvBySlug(slug: string): Promise<Atv | null> {
  const rows = await db.select().from(atvs).where(eq(atvs.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function listAddons() {
  return db.select().from(addons).where(eq(addons.active, true));
}

export async function getAddonBySlug(slug: string) {
  const rows = await db.select().from(addons).where(eq(addons.slug, slug)).limit(1);
  return rows[0] ?? null;
}
