const STEPS = [
  {
    num: "01",
    title: "Tell us your plan",
    body: "Open the chat, tell us your dates, how many riders, and where you want to ride. Our assistant figures out the right machine and quotes you in seconds — no forms, no phone tag.",
  },
  {
    num: "02",
    title: "We deliver",
    body: "On the morning of your trip we bring the ATVs, helmets, and gear to your address or trailhead. A quick walkthrough, a few signatures, and you're rolling.",
  },
  {
    num: "03",
    title: "Hit the trails",
    body: "Ride the Squamish Valley, Brandywine FSR, or anywhere your map takes you. When your trip ends, we come back and pick everything up. No drop-off detours.",
  },
];

export function HowItWorks() {
  return (
    <section className="container-x mx-auto max-w-7xl py-24" id="how-it-works">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          How it works
        </p>
        <h2 className="mt-3">From "let's go" to throttle in three steps.</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          We built the booking flow to feel like texting a friend who happens to
          own an ATV shop. Less paperwork, more saddle time.
        </p>
      </div>

      <ol className="mt-14 grid gap-8 md:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.num} className="relative rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
            <span className="font-display text-5xl text-primary/15 absolute right-6 top-4 select-none">{s.num}</span>
            <p className="font-display text-2xl font-semibold relative">{s.title}</p>
            <p className="mt-3 text-muted-foreground leading-relaxed relative">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
