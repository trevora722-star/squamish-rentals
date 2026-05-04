import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/site/ChatWidget";

export const metadata = {
  title: "The Fleet",
  description:
    "Every ATV in our Squamish rental lineup, with specs, daily rates, and the kind of rider each one is built for.",
};

const FLEET = [
  {
    slug: "trailblazer-500",
    name: "Trailblazer 500",
    tagline: "Beginner-friendly automatic",
    seats: 1,
    skill: "Beginner",
    daily: 199,
    description:
      "Forgiving throttle, low seat height, and stable handling. Our most-rented machine for first-timers and family trips.",
    spec: { engine: "567 cc", drive: "Selectable 2WD/4WD", trans: "Automatic" },
  },
  {
    slug: "backcountry-700",
    name: "Backcountry 700 4x4",
    tagline: "All-day forest service road weapon",
    seats: 1,
    skill: "Intermediate",
    daily: 269,
    description:
      "Selectable 4WD with serious low-end torque and a proper rack for coolers, fuel, and camp gear.",
    spec: { engine: "700 cc", drive: "Selectable 4WD", trans: "CVT automatic" },
  },
  {
    slug: "tandem-tourer",
    name: "Tandem Tourer",
    tagline: "Two-up sport-touring",
    seats: 2,
    skill: "Intermediate",
    daily: 299,
    description:
      "Long-travel suspension, a comfortable rear seat, and proper grab handles. Great for couples and parent-teen rides.",
    spec: { engine: "686 cc", drive: "On-demand 4WD", trans: "Automatic" },
  },
  {
    slug: "alpine-pro-1000",
    name: "Alpine Pro 1000",
    tagline: "Big-bore for experienced riders",
    seats: 1,
    skill: "Advanced",
    daily: 349,
    description:
      "Big power, tuneable ride modes, and the clearance you want for Indian Arm or the Brandywine alpine.",
    spec: { engine: "952 cc", drive: "Active descent control 4WD", trans: "Automatic" },
  },
];

export default function FleetPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container-x mx-auto max-w-7xl pt-16 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            The fleet
          </p>
          <h1 className="mt-3">Pick the machine that fits the trip.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Every quad below is delivered fully fuelled and serviced before each
            rental. Our chat assistant matches the right one to your group's
            experience and where you're riding.
          </p>
        </section>

        <section className="container-x mx-auto max-w-7xl pb-24 grid gap-6 md:grid-cols-2">
          {FLEET.map((atv) => (
            <article
              key={atv.slug}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]"
            >
              <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-primary to-secondary">
                <svg viewBox="0 0 400 220" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <path d="M0 160 L80 120 L160 150 L240 110 L320 140 L400 120 L400 220 L0 220 Z" fill="#0a3a37" opacity="0.7" />
                  <path d="M0 195 L100 175 L200 195 L300 165 L400 190 L400 220 L0 220 Z" fill="#072421" />
                </svg>
                <span className="absolute bottom-3 left-4 text-[11px] uppercase tracking-[0.18em] text-primary-foreground/65">
                  Photo placeholder · {atv.name}
                </span>
              </div>
              <div className="p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {atv.tagline}
                </p>
                <p className="mt-2 font-display text-2xl font-semibold">{atv.name}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{atv.description}</p>

                <dl className="mt-5 grid grid-cols-3 gap-3 text-xs border-y border-border py-4">
                  <div>
                    <dt className="text-muted-foreground">Engine</dt>
                    <dd className="mt-0.5 font-semibold">{atv.spec.engine}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Drive</dt>
                    <dd className="mt-0.5 font-semibold">{atv.spec.drive}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Trans</dt>
                    <dd className="mt-0.5 font-semibold">{atv.spec.trans}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Seats</dt>
                    <dd className="mt-0.5 font-semibold">{atv.seats}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Skill</dt>
                    <dd className="mt-0.5 font-semibold">{atv.skill}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">From</dt>
                    <dd className="mt-0.5 font-semibold">${atv.daily}/day</dd>
                  </div>
                </dl>

                <div className="mt-6 flex gap-2">
                  <Link href={`/chat?atv=${atv.slug}`} className="btn-primary text-sm flex-1 text-center">
                    Check availability
                  </Link>
                  <Link href={`/chat?atv=${atv.slug}&action=quote`} className="btn-ghost text-sm flex-1 text-center">
                    Get a quote
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
