const FEATURES = [
  {
    title: "Free delivery in Squamish",
    body: "We deliver to your door, campsite, or trailhead at no extra charge inside our core zone.",
    icon: (
      <path d="M3 17h13V6H3v11Zm13 0h2.5l2.5-3v-3h-5v6Zm-9 1a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    title: "Helmets and gear included",
    body: "DOT-rated helmets, goggles, and gloves come standard with every booking — at every size.",
    icon: (
      <>
        <path d="M4 13a8 8 0 0 1 16 0v3H4v-3Z" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <path d="M4 16h16v3H4z" stroke="currentColor" strokeWidth="1.6" fill="none" />
      </>
    ),
  },
  {
    title: "Full safety briefing",
    body: "Every rider gets a thorough hands-on walkthrough before we hand over the keys. First-timers welcome.",
    icon: (
      <>
        <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <path d="M9 12l2.5 2.5L16 10" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: "Fully insured fleet",
    body: "Our machines carry commercial coverage, and we'll walk you through optional damage-waiver options at booking.",
    icon: (
      <path d="M5 7h14v6c0 4-3.5 7-7 8-3.5-1-7-4-7-8V7Z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
    ),
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-card">
      <div className="container-x mx-auto max-w-7xl py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex gap-4">
            <span className="flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                {f.icon}
              </svg>
            </span>
            <div>
              <p className="font-semibold text-fg">{f.title}</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
