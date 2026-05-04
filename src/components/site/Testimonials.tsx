const TESTIMONIALS = [
  {
    quote:
      "We went ATVing as a family and it was fantastic! Most of us were first-timers, but Adam made everything easy with clear instructions and patience. We rode up the Shannon Falls path and the views were unreal — quiet access roads, fun 4×4 trails, and incredible scenery. Of all the activities on our vacation, this was the best.",
    author: "Amanda H.",
  },
  {
    quote:
      "If you don't want to go all the way to Whistler, definitely book with Adam. Everything was so easy — affordable, seamless booking, and we felt less like customers and more like friends riding with a local who wanted us to have the best time. We even got brand-new helmets!",
    author: "Hill W.",
  },
  {
    quote:
      "Absolutely incredible experience! The ATVs were in excellent condition and easy to handle, and Adam made sure we felt comfortable before heading out. The Squamish trails were breathtaking — mountains, forest paths, and the perfect mix of scenery and adventure. Safe, well-organized, and unforgettable.",
    author: "Cameron W.",
  },
];

export function Testimonials() {
  return (
    <section className="container-x mx-auto max-w-7xl py-24">
      <div className="text-center max-w-3xl mx-auto">
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Stars />
          <span>5/5 on Google</span>
        </p>
        <h2 className="mt-3">What riders are saying</h2>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={i}
            className="rounded-xl border border-border bg-card p-7 shadow-[var(--shadow-card)] flex flex-col"
          >
            <Quote className="h-7 w-7 text-fg/30" />
            <div className="mt-5 text-center">
              <Stars size="lg" />
            </div>
            <blockquote className="mt-5 text-fg leading-relaxed flex-1">
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 pt-5 border-t border-border">
              <div className="font-semibold">— {t.author}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Stars({ size = "sm" }: { size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <span className="inline-flex items-center gap-0.5 text-accent" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} className={cls} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 1.5l2.6 5.7 6.2.6-4.7 4.2 1.4 6.1L10 14.9l-5.5 3.2 1.4-6.1L1.2 7.8l6.2-.6L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

function Quote({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M9.5 21.5h-4.5q0-3.7 1.4-6.1 1.5-2.5 4.5-4.4l1.6 2.4q-2 1.3-2.9 2.5-.9 1.2-1.1 2.6h2.6q1.3 0 2.1.7t.8 2v0q0 1.3-.8 2.1t-2 .8q-1.3 0-2.1-.8t-.8-2zm12 0h-4.5q0-3.7 1.4-6.1 1.5-2.5 4.5-4.4l1.6 2.4q-2 1.3-2.9 2.5-.9 1.2-1.1 2.6h2.6q1.3 0 2.1.7t.8 2v0q0 1.3-.8 2.1t-2 .8q-1.3 0-2.1-.8t-.8-2z" />
    </svg>
  );
}
