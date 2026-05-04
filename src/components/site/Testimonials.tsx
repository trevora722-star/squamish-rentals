const TESTIMONIALS = [
  {
    quote:
      "We rented two quads for a long weekend up the Squamish Valley FSR. The team showed up on time, the briefing was thorough, and the machines were dialled. Easiest rental I've ever booked.",
    author: "Mike R.",
    location: "North Vancouver, BC",
    placeholder: true,
  },
  {
    quote:
      "First time on an ATV. I was nervous, the chat assistant put me on the Trailblazer 500, and I had a blast. They even talked me through the route the morning of. Will be back.",
    author: "Priya S.",
    location: "Vancouver, BC",
    placeholder: true,
  },
  {
    quote:
      "Booked through the chat at 11pm the night before. Confirmation came in seconds. ATVs were at our Brandywine campsite by 9am. This is how rentals should work.",
    author: "Dave & Erin",
    location: "Whistler, BC",
    placeholder: true,
  },
];

export function Testimonials() {
  return (
    <section className="container-x mx-auto max-w-7xl py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          What riders say
        </p>
        <h2 className="mt-3">Real trips, real reviews.</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          From riders who&apos;ve spent a day on the trails with us.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={i}
            className="rounded-xl border border-border bg-card p-7 shadow-[var(--shadow-card)] flex flex-col"
          >
            <Quote className="h-7 w-7 text-primary/40" />
            <blockquote className="mt-4 text-fg leading-relaxed flex-1">
              "{t.quote}"
            </blockquote>
            <figcaption className="mt-5 pt-5 border-t border-border">
              <div className="font-semibold">{t.author}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t.location}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Quote({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M9.5 21.5h-4.5q0-3.7 1.4-6.1 1.5-2.5 4.5-4.4l1.6 2.4q-2 1.3-2.9 2.5-.9 1.2-1.1 2.6h2.6q1.3 0 2.1.7t.8 2v0q0 1.3-.8 2.1t-2 .8q-1.3 0-2.1-.8t-.8-2zm12 0h-4.5q0-3.7 1.4-6.1 1.5-2.5 4.5-4.4l1.6 2.4q-2 1.3-2.9 2.5-.9 1.2-1.1 2.6h2.6q1.3 0 2.1.7t.8 2v0q0 1.3-.8 2.1t-2 .8q-1.3 0-2.1-.8t-.8-2z" />
    </svg>
  );
}
