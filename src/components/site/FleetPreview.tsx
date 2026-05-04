import Link from "next/link";

export function FleetPreview() {
  return (
    <section className="bg-muted">
      <div className="container-x mx-auto max-w-7xl py-24 grid gap-12 md:grid-cols-12 items-center">
        <div className="md:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">The fleet</p>
          <h2 className="mt-3">Four brand-new Kawasaki ATVs.</h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            We have four brand-new Kawasaki ATVs that are reliable, easy to
            ride, and well suited to local terrain. Each one is serviced and
            fuelled before every rental.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/chat" className="btn-primary text-sm">
              Check availability
            </Link>
            <Link href="/fleet" className="btn-ghost text-sm">
              More on the fleet
            </Link>
          </div>
        </div>

        <div className="md:col-span-7">
          <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-pop)]">
            <FleetCardImage label="Kawasaki ATV" />
            <div className="flex flex-col flex-1 p-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Brand-new for 2026
              </p>
              <p className="mt-2 font-display text-2xl font-semibold">Kawasaki ATV</p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Reliable, easy to ride, and well suited to local terrain. Four
                of them, ready when you are.
              </p>

              <dl className="mt-5 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Available</dt>
                  <dd className="font-semibold mt-0.5">4 riders</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Skill</dt>
                  <dd className="font-semibold mt-0.5">Beginner</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">From</dt>
                  <dd className="font-semibold mt-0.5">$249/day</dd>
                </div>
              </dl>
            </div>
          </article>
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
