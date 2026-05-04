import { config } from "dotenv";

// Load env vars BEFORE importing anything that reads process.env at module load.
// Static imports are hoisted, so we use dynamic imports inside main() instead.
config({ path: ".env.local" });
config({ path: ".env" });

const FLEET = [
  {
    slug: "kawasaki-atv",
    name: "Kawasaki ATV",
    make: "Kawasaki",
    model: "(model — friends to confirm)",
    year: 2026,
    engineCc: null,
    seats: 1,
    skillLevel: "beginner" as const,
    description:
      "We have four brand-new Kawasaki ATVs that are reliable, easy to ride, and well suited to local terrain.",
    highlights: [
      "Brand-new for the 2026 season",
      "Easy and confidence-inspiring to ride",
      "Helmets, goggles, gloves, and a safety briefing included",
      "Fuelled and ready for the day",
    ],
    dailyRate: "249.00",
    weeklyRate: "1399.00",
    depositAmount: "1000.00",
    minAge: 19,
    quantityOwned: 4,
  },
];

const ADDONS = [
  {
    slug: "extra-helmet",
    name: "Extra DOT helmet",
    description: "Helmets are included for every rider. Add one if you want a backup.",
    pricePerDay: "0.00",
    flatFee: "15.00",
  },
  {
    slug: "gas-can",
    name: "Spare 10L gas can",
    description: "Fuel for longer routes. Refill on return.",
    pricePerDay: "10.00",
    flatFee: null,
  },
  {
    slug: "gps-unit",
    name: "Handheld GPS",
    description: "Pre-loaded with FSR maps and our recommended routes.",
    pricePerDay: "20.00",
    flatFee: null,
  },
  {
    slug: "cooler",
    name: "Cooler with ice",
    description: "55-quart cooler stocked with ice — bring your own snacks.",
    pricePerDay: "15.00",
    flatFee: null,
  },
  {
    slug: "guided-intro",
    name: "Guided intro ride (1 hr)",
    description: "Optional 60-minute guided lap to build confidence before you head out alone.",
    pricePerDay: "0.00",
    flatFee: "120.00",
  },
];

const ZONES = [
  {
    name: "Squamish Core",
    description: "Free delivery anywhere in Squamish proper, Brackendale, and Garibaldi Highlands.",
    baseFee: "0.00",
    perKmFee: "0.00",
    maxDistanceKm: 25,
    coverage: { type: "city" as const, values: ["squamish", "brackendale", "garibaldi"] },
  },
  {
    name: "Sea-to-Sky North",
    description: "Whistler, Pemberton, and Mount Currie.",
    baseFee: "80.00",
    perKmFee: "0.00",
    maxDistanceKm: 90,
    coverage: { type: "city" as const, values: ["whistler", "pemberton", "mount currie"] },
  },
  {
    name: "Sea-to-Sky South",
    description: "Britannia Beach, Lions Bay, Furry Creek, and Horseshoe Bay.",
    baseFee: "60.00",
    perKmFee: "0.00",
    maxDistanceKm: 60,
    coverage: { type: "city" as const, values: ["britannia", "lions bay", "horseshoe bay"] },
  },
  {
    name: "Greater Vancouver",
    description: "Vancouver, North/West Van, Burnaby, Richmond, Surrey.",
    baseFee: "150.00",
    perKmFee: "0.00",
    maxDistanceKm: 90,
    coverage: { type: "city" as const, values: ["vancouver", "burnaby", "richmond", "surrey"] },
  },
];

const KB = [
  {
    slug: "what-to-bring",
    title: "What should I bring on the ride?",
    category: "before-you-ride",
    body:
      "Closed-toe boots that cover the ankle, long pants (denim or riding pants), a long-sleeved shirt or jacket, and gloves if you have them. We supply DOT-rated helmets, goggles, and gloves at no extra cost. Bring water (we recommend 2L per rider), sunscreen, snacks, and a small backpack. Phone reception is patchy in the valleys — let someone know your route before you leave.",
    tags: ["preparation", "gear"],
  },
  {
    slug: "license-and-age",
    title: "Age and licensing requirements",
    category: "rules",
    body:
      "All riders must be 19 or older with a valid driver's license. We don't offer rentals to riders under 19 even with a parent or guardian present — this is a strict insurance requirement. ID is checked at delivery.",
    tags: ["legal", "rules"],
  },
  {
    slug: "weather-and-cancellations",
    title: "What if the weather turns?",
    category: "policies",
    body:
      "We rarely cancel for rain — the trails handle it well. We will reschedule for free if there's an active road closure, lightning warning, or extreme heat advisory. If conditions are unsafe and we cancel, you get a full refund or a no-cost reschedule.",
    tags: ["weather", "cancellations"],
  },
  {
    slug: "fuel-and-range",
    title: "How far can I ride on a tank?",
    category: "before-you-ride",
    body:
      "Most of our quads have a real-world range of 110–160 km on a tank, depending on terrain and how hard you ride. Big-bore machines and steep climbs eat fuel faster. The Squamish Valley and Brandywine loops are easily round-trip on one tank. For longer trips, add a spare 10L can.",
    tags: ["range", "fuel"],
  },
];

async function main() {
  // Dynamic imports — these run AFTER config() above has populated process.env
  const { db } = await import("./index");
  const {
    atvs,
    addons,
    deliveryZones,
    kbArticles,
    bookingHolds,
    bookingItems,
    bookingAddons,
    bookings,
  } = await import("./schema");

  // Reset (dev only). This wipes test bookings so we can change inventory cleanly.
  console.log("Resetting tables (dev-only)…");
  await db.delete(bookingHolds);
  await db.delete(bookingItems);
  await db.delete(bookingAddons);
  await db.delete(bookings);
  await db.delete(atvs);
  await db.delete(addons);
  await db.delete(deliveryZones);

  console.log("Seeding ATVs…");
  for (const a of FLEET) {
    await db.insert(atvs).values(a);
  }
  console.log("Seeding add-ons…");
  for (const ad of ADDONS) {
    await db.insert(addons).values(ad);
  }
  console.log("Seeding delivery zones…");
  for (const z of ZONES) {
    await db.insert(deliveryZones).values(z);
  }
  console.log("Seeding KB articles…");
  for (const k of KB) {
    await db.insert(kbArticles).values(k).onConflictDoNothing({ target: kbArticles.slug });
  }
  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
