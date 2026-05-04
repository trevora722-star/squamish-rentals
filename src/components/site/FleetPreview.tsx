import Link from "next/link";

const PLACEHOLDER_FLEET = [
  {
    slug: "trailblazer-500",
    name: "Trailblazer 500",
    tagline: "Beginner-friendly automatic",
    description:
      "Forgiving throttle, low seat height, and confidence-inspiring stability. The ride we hand to first-timers and family groups.",
    seats: 1,
    skill: "Beginner",
    dailyRate: 199,
  },
  {
    slug: "backcountry-700",
    name: "Backcountry 700 4x4",
    tagline: "All-day forest service road weapon",
    description:
      "Selectable 4WD, deep low-end torque, and a proper rack for coolers, fuel, and camp gear. Eats logging roads for breakfast.",
    seats: 1,
    skill: "Intermediate",
    dailyRate: 269,
  },
  {
    slug: "tandem-tourer",
    name: "Tandem Tourer",
    tagline: "Two-up sport-touring",
    description:
      "Designed for couples or a parent and teen — long-travel suspension, a comfortable rear seat, and grab handles that actually feel secure.",
    seats: 2,
    skill: "Intermediate",
    dailyRate: 299,
  },
];

export function FleetPreview() {
  return (
    <section className="bg-muted">
      <div className="container-x mx-auto max-w-7xl py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">The fleet</p>
            <h2 className="mt-3">Machines tuned for Sea-to-Sky terrain.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every quad in the lineup is serviced before each rental, fuelled
              up, and matched to your skill level by our chat assistant.
            </p>
          </div>
          <Link href="/fleet" className="btn-ghost">See the full lineup →</Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PLACEHOLDER_FLEET.map((atv) => (
            <article
              key={atv.slug}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-pop)]"
            >
              <FleetCardImage label={atv.name} />
              <div className="flex flex-col flex-1 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">{atv.tagline}</p>
                <p className="mt-2 font-display text-2xl font-semibold">{atv.name}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{atv.description}</p>

                <dl className="mt-5 grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Seats</dt>
                    <dd className="font-semibold mt-0.5">{atv.seats}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Skill</dt>
                    <dd className="font-semibold mt-0.5">{atv.skill}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">From</dt>
                    <dd className="font-semibold mt-0.5">${atv.dailyRate}/day</dd>
                  </div>
                </dl>

                <div className="mt-6 flex gap-2">
                  <Link href={`/fleet/${atv.slug}`} className="btn-ghost text-sm flex-1 text-center">
                    Details
                  </Link>
                  <Link href={`/chat?atv=${atv.slug}`} className="btn-primary text-sm flex-1 text-center">
                    Check availability
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FleetCardImage({ label }: { label: string }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-primary to-secondary">
      <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M0 180 L80 140 L160 170 L240 130 L320 160 L400 140 L400 250 L0 250 Z" fill="#0a3a37" opacity="0.7" />
        <path d="M0 215 L100 195 L200 215 L300 185 L400 210 L400 250 L0 250 Z" fill="#072421" />
      </svg>
      <span className="absolute bottom-3 left-4 text-[11px] uppercase tracking-[0.18em] text-primary-foreground/65">
        Photo placeholder · {label}
      </span>
    </div>
  );
}
