import Link from "next/link";
import Image from "next/image";
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
    spec: { make: string; year: string; trans: string; gear: string };
    highlights: string[];
    bestFor: string[];
    notIdealFor: string[];
  }
> = {
  "kawasaki-atv": {
    name: "Kawasaki ATV",
    tagline: "Brand-new for 2026",
    skill: "Beginner-friendly",
    seats: 1,
    daily: 249,
    deposit: 1000,
    description:
      "We have four brand-new Kawasaki ATVs that are reliable, easy to ride, and well suited to local terrain. The same machine for everyone — no menu of options to puzzle over, just a proven Kawasaki ready for the trail.",
    spec: {
      make: "Kawasaki",
      year: "2026",
      trans: "Automatic",
      gear: "Helmet · goggles · gloves · fuel · briefing",
    },
    highlights: [
      "Brand-new for the 2026 season",
      "Easy and confidence-inspiring to ride",
      "Helmets, goggles, and gloves included for every rider",
      "Fuelled and ready for the day",
      "Hands-on safety briefing before you ride",
      "Roadside support from us if anything goes wrong on the trail",
    ],
    bestFor: [
      "First-time ATV riders",
      "Couples and small family groups (up to 4 riders)",
      "Half-day, full-day, and multi-day trips in the Sea-to-Sky",
    ],
    notIdealFor: [
      "Riders looking for two-up (passenger) machines — these are single-seat",
      "Heavy off-road technical riding requiring big-bore power",
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
              <Image
                src="/images/kawasaki-atv.webp"
                alt={`${atv.name} in the Sea-to-Sky backcountry`}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 700px, 100vw"
                priority
              />
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
              <Link href={`/chat?atv=${slug}`} className="btn-primary flex-1 text-center">
                Check availability
              </Link>
              <Link href={`/chat?atv=${slug}&action=quote`} className="btn-ghost flex-1 text-center">
                Get a quote
              </Link>
            </div>
          </div>
        </section>

        <section className="container-x mx-auto max-w-5xl py-12 grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">At a glance</p>
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
