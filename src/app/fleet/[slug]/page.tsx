import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/site/ChatWidget";
import { formatCurrencyDetailed } from "@/lib/utils";

const FLEET_DETAIL: Record<
  string,
  {
    name: string;
    tagline: string;
    skill: string;
    seats: number;
    daily: number;
    deposit: number;
    description: string;
    spec: { engine: string; drive: string; trans: string; range: string };
    highlights: string[];
    bestFor: string[];
    notIdealFor: string[];
  }
> = {
  "trailblazer-500": {
    name: "Trailblazer 500",
    tagline: "Beginner-friendly automatic",
    skill: "Beginner",
    seats: 1,
    daily: 199,
    deposit: 1000,
    description:
      "Our most-rented machine, and for good reason. Forgiving throttle, low seat height, predictable handling. The Trailblazer is what we hand to first-time riders, family groups, and anyone who wants to enjoy the views instead of wrestling the machine.",
    spec: {
      engine: "567 cc single-cylinder",
      drive: "Selectable 2WD / 4WD",
      trans: "Fully automatic CVT",
      range: "~140 km on a tank",
    },
    highlights: [
      "Automatic transmission — no clutch, no shifting",
      "Selectable 4WD when the trail demands it",
      "Low seat height suits riders of any size",
      "Steady throttle response makes for confident riding",
    ],
    bestFor: [
      "First-time ATV riders",
      "Family rides on the Squamish Valley FSR",
      "Half-day and full-day trips",
    ],
    notIdealFor: [
      "Technical Indian Arm-style routes",
      "Two riders (this is a single-seat machine)",
    ],
  },
  "backcountry-700": {
    name: "Backcountry 700 4x4",
    tagline: "All-day forest service road weapon",
    skill: "Intermediate",
    seats: 1,
    daily: 269,
    deposit: 1500,
    description:
      "The 700 is our workhorse. Selectable 4WD, deep low-end torque, and a proper rack system for coolers, fuel, and camp gear. If you're heading up the Brandywine alpine or doing an overnight in the Squamish Valley, this is the machine.",
    spec: {
      engine: "700 cc V-twin",
      drive: "Selectable 4WD with diff lock",
      trans: "CVT automatic",
      range: "~160 km on a tank",
    },
    highlights: [
      "Front + rear cargo racks (300 lb rear capacity)",
      "1300 lb tow rating",
      "Long-range fuel tank for full-day rides",
      "Heated grips for spring/fall trips",
    ],
    bestFor: [
      "Riders with previous ATV or dirt-bike experience",
      "Overnight or multi-day trips",
      "Brandywine, Callaghan, Squamish Valley alpine",
    ],
    notIdealFor: [
      "Absolute beginners (the power is more than you need)",
      "Two-up riding (single seat)",
    ],
  },
  "tandem-tourer": {
    name: "Tandem Tourer",
    tagline: "Two-up sport-touring",
    skill: "Intermediate",
    seats: 2,
    daily: 299,
    deposit: 1500,
    description:
      "Built for couples or a parent and teen. Long-travel suspension, a comfortable rear seat, and grab handles that actually feel secure. The rear seat is a real seat — not the afterthought you find on most two-ups. Both riders need to be 19+.",
    spec: {
      engine: "686 cc twin",
      drive: "On-demand 4WD",
      trans: "Automatic with high/low range",
      range: "~130 km on a tank (loaded)",
    },
    highlights: [
      "Real two-up rear seat with backrest",
      "Power steering for low-speed control",
      "Heated grips on both sets of bars",
      "Independent passenger footrests",
    ],
    bestFor: [
      "Couples who want to ride together",
      "Parent-teen rides (passenger must be 19+)",
      "Squamish Valley FSR, Brandywine",
    ],
    notIdealFor: [
      "Solo riders (the Backcountry 700 is faster and cheaper)",
      "Indian Arm — too heavy on technical climbs",
    ],
  },
  "alpine-pro-1000": {
    name: "Alpine Pro 1000",
    tagline: "Big-bore for experienced riders",
    skill: "Advanced",
    seats: 1,
    daily: 349,
    deposit: 2000,
    description:
      "Big-bore power for experienced riders pushing into Indian Arm or the high alpine. Tuneable ride modes, serious clearance, and a high-output charging system that runs lights, GPS, and a heated jacket without breaking a sweat.",
    spec: {
      engine: "952 cc twin",
      drive: "Active descent control 4WD",
      trans: "Automatic with engine braking",
      range: "~150 km on a tank",
    },
    highlights: [
      "High-clearance suspension for technical terrain",
      "Selectable Sport / Standard / Work ride modes",
      "Heavy-duty 3500 lb winch standard",
      "12V accessory outlets for GPS, lights, heated gear",
    ],
    bestFor: [
      "Experienced riders only",
      "Indian Arm backroads, alpine route challenges",
      "Riders comfortable with power and weight",
    ],
    notIdealFor: [
      "Beginners or first-time riders (we'll politely steer you to the Trailblazer)",
      "Group rides where the slowest machine sets the pace",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(FLEET_DETAIL).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const atv = FLEET_DETAIL[slug];
  if (!atv) return { title: "Not found" };
  return {
    title: atv.name,
    description: `${atv.tagline} — ${atv.description.slice(0, 160)}`,
  };
}

export default async function FleetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const atv = FLEET_DETAIL[slug];
  if (!atv) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container-x mx-auto max-w-5xl pt-12 pb-6">
          <Link href="/fleet" className="text-sm text-muted-foreground hover:text-fg">
            ← Back to fleet
          </Link>
        </section>

        <section className="container-x mx-auto max-w-5xl pb-12 grid gap-10 md:grid-cols-12 items-start">
          <div className="md:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary">
              <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <path d="M0 220 L80 180 L160 210 L240 170 L320 200 L400 180 L400 300 L0 300 Z" fill="#0a3a37" opacity="0.7" />
                <path d="M0 250 L100 230 L200 250 L300 220 L400 245 L400 300 L0 300 Z" fill="#072421" />
              </svg>
              <span className="absolute bottom-4 left-5 text-xs uppercase tracking-[0.18em] text-primary-foreground/70">
                Photo placeholder · {atv.name}
              </span>
            </div>
          </div>

          <div className="md:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {atv.tagline}
            </p>
            <h1 className="mt-2">{atv.name}</h1>
            <p className="mt-5 text-muted-foreground leading-relaxed">{atv.description}</p>

            <dl className="mt-7 grid grid-cols-2 gap-4 text-sm border-y border-border py-5">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">From</dt>
                <dd className="mt-1 font-display text-2xl text-primary">
                  {formatCurrencyDetailed(atv.daily)}
                  <span className="text-sm text-fg/60 ml-1">/day</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Refundable deposit</dt>
                <dd className="mt-1 font-display text-2xl">
                  {formatCurrencyDetailed(atv.deposit)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Skill level</dt>
                <dd className="mt-1 font-medium">{atv.skill}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Seats</dt>
                <dd className="mt-1 font-medium">{atv.seats}</dd>
              </div>
            </dl>

            <div className="mt-7 flex gap-2">
              <Link
                href={`/chat?atv=${slug}`}
                className="btn-primary flex-1 text-center"
              >
                Check availability
              </Link>
              <Link
                href={`/chat?atv=${slug}&action=quote`}
                className="btn-ghost flex-1 text-center"
              >
                Get a quote
              </Link>
            </div>
          </div>
        </section>

        <section className="container-x mx-auto max-w-5xl py-12 grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Specs</p>
            <dl className="mt-4 divide-y divide-border border-y border-border">
              {Object.entries(atv.spec).map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 py-3 text-sm">
                  <dt className="text-muted-foreground capitalize">{k}</dt>
                  <dd className="font-medium text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Highlights</p>
            <ul className="mt-4 space-y-3">
              {atv.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="container-x mx-auto max-w-5xl py-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-primary-soft p-7">
            <p className="font-display text-lg font-semibold text-primary">Best for</p>
            <ul className="mt-3 space-y-2 text-sm">
              {atv.bestFor.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-7">
            <p className="font-display text-lg font-semibold">Probably not the right pick if…</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {atv.notIdealFor.map((b) => (
                <li key={b} className="flex gap-2">
                  <span>—</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="container-x mx-auto max-w-5xl py-12 text-center">
          <p className="font-display text-2xl">Want to lock in a date?</p>
          <Link href={`/chat?atv=${slug}`} className="btn-accent mt-6 inline-block">
            Check live availability
          </Link>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
