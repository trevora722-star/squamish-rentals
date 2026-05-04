import "dotenv/config";
import { db } from "./index";
import { atvs, addons, deliveryZones, kbArticles } from "./schema";

const FLEET = [
  {
    slug: "trailblazer-500",
    name: "Trailblazer 500",
    make: "Polaris",
    model: "Sportsman 570",
    year: 2024,
    engineCc: 567,
    seats: 1,
    skillLevel: "beginner" as const,
    description:
      "Forgiving throttle, low seat height, and confidence-inspiring stability. The ride we hand to first-timers and family groups.",
    highlights: [
      "Automatic transmission",
      "Selectable 2WD/4WD",
      "Friendly for new riders",
    ],
    dailyRate: "199.00",
    weeklyRate: "1099.00",
    depositAmount: "1000.00",
    minAge: 19,
    quantityOwned: 4,
  },
  {
    slug: "backcountry-700",
    name: "Backcountry 700 4x4",
    make: "Can-Am",
    model: "Outlander 700",
    year: 2024,
    engineCc: 700,
    seats: 1,
    skillLevel: "intermediate" as const,
    description:
      "Selectable 4WD, deep low-end torque, and a proper rack for coolers, fuel, and camp gear. Eats logging roads for breakfast.",
    highlights: [
      "Front + rear cargo racks",
      "Tow rating 1300 lb",
      "Long-range fuel tank",
    ],
    dailyRate: "269.00",
    weeklyRate: "1499.00",
    depositAmount: "1500.00",
    minAge: 19,
    quantityOwned: 3,
  },
  {
    slug: "tandem-tourer",
    name: "Tandem Tourer",
    make: "Yamaha",
    model: "Grizzly 700 EPS 2-up",
    year: 2024,
    engineCc: 686,
    seats: 2,
    skillLevel: "intermediate" as const,
    description:
      "Designed for couples or a parent and teen — long-travel suspension, a comfortable rear seat, and grab handles that actually feel secure.",
    highlights: [
      "Two-up rear seat",
      "Power steering",
      "Heated grips",
    ],
    dailyRate: "299.00",
    weeklyRate: "1699.00",
    depositAmount: "1500.00",
    minAge: 19,
    quantityOwned: 2,
  },
  {
    slug: "alpine-pro-1000",
    name: "Alpine Pro 1000",
    make: "Polaris",
    model: "Sportsman XP 1000",
    year: 2024,
    engineCc: 952,
    seats: 1,
    skillLevel: "advanced" as const,
    description:
      "Big-bore power for experienced riders pushing into Indian Arm or the Brandywine alpine. Tuneable ride modes and serious clearance.",
    highlights: [
      "High-clearance suspension",
      "Selectable ride modes",
      "Heavy-duty winch",
    ],
    dailyRate: "349.00",
    weeklyRate: "1999.00",
    depositAmount: "2000.00",
    minAge: 19,
    quantityOwned: 2,
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
  console.log("Seeding ATVs…");
  for (const a of FLEET) {
    await db.insert(atvs).values(a).onConflictDoNothing({ target: atvs.slug });
  }
  console.log("Seeding add-ons…");
  for (const ad of ADDONS) {
    await db.insert(addons).values(ad).onConflictDoNothing({ target: addons.slug });
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
