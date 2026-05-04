const TRAILS = [
  {
    name: "Squamish Valley FSR",
    distance: "38 km",
    level: "Intermediate",
    body: "Wide forest service road climbing the river valley toward Elaho. Steady grades, mountain views, and dozens of side spurs to explore.",
  },
  {
    name: "Brandywine + Callaghan",
    distance: "55 km",
    level: "Intermediate",
    body: "Alpine meadows, lake-side stops, and access to Brandywine Falls. Best from late June through October.",
  },
  {
    name: "Indian Arm Backroads",
    distance: "70 km",
    level: "Advanced",
    body: "Technical climbs, water crossings, and serious elevation. For experienced riders only — we'll talk you through it before booking.",
  },
];

export function TrailHighlights() {
  return (
    <section className="container-x mx-auto max-w-7xl py-24" id="trails">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Where to ride
        </p>
        <h2 className="mt-3">Three of our favourite Sea-to-Sky routes.</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Tell our chat assistant where you're staying or what you want to see —
          it'll match the route to your group, the season, and current trail
          conditions.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {TRAILS.map((t) => (
          <article key={t.name} className="rounded-xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
              <span className="text-accent">{t.distance}</span>
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-primary">{t.level}</span>
            </div>
            <p className="mt-4 font-display text-xl font-semibold">{t.name}</p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
