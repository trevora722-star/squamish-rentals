import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <BackgroundDecor />

      <div className="container-x mx-auto max-w-7xl pt-20 pb-24 md:pt-28 md:pb-32 grid gap-12 md:grid-cols-12 items-center">
        <div className="md:col-span-7 relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Now booking the 2026 season · Sea-to-Sky, BC
          </span>
          <h1 className="mt-5">
            ATVs delivered to your trail.
            <span className="block text-primary">Throttle ready.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            Premium quad rentals in Squamish and the Sea-to-Sky corridor. We bring
            the machines to your doorstep, your campsite, or the trailhead — gear,
            fuel, and a thorough safety briefing included.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/chat" className="btn-accent inline-flex items-center gap-2">
              <ChatIcon className="h-4 w-4" />
              Book through chat
            </Link>
            <Link href="/fleet" className="btn-ghost">Browse the fleet</Link>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            {[
              { k: "150+", v: "Riders served / year" },
              { k: "4.9★", v: "Average review" },
              { k: "0", v: "Pickup detours" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-3xl text-primary">{s.k}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="md:col-span-5 relative">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 80% 0%, rgba(13, 79, 74, 0.18) 0%, rgba(13, 79, 74, 0) 60%), radial-gradient(40% 40% at 0% 80%, rgba(234, 125, 44, 0.15) 0%, rgba(234, 125, 44, 0) 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[120%]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent 50%, var(--color-bg))",
        }}
      />
    </>
  );
}

function HeroVisual() {
  return (
    <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-[var(--shadow-pop)] bg-gradient-to-br from-primary via-[#0b3e3a] to-secondary">
      <svg
        viewBox="0 0 400 500"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ridge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d4f4a" stopOpacity="0" />
            <stop offset="100%" stopColor="#0a2e2b" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path
          d="M0 280 L60 230 L110 260 L180 200 L240 240 L300 180 L360 220 L400 200 L400 500 L0 500 Z"
          fill="url(#ridge)"
        />
        <path
          d="M0 360 L80 320 L150 350 L220 300 L290 340 L360 310 L400 330 L400 500 L0 500 Z"
          fill="#072421"
          opacity="0.85"
        />
        <circle cx="320" cy="100" r="40" fill="#fff8eb" opacity="0.85" />
        {Array.from({ length: 30 }).map((_, i) => (
          <circle
            key={i}
            cx={(i * 47) % 400}
            cy={(i * 31) % 200}
            r={Math.random() * 1.2 + 0.4}
            fill="white"
            opacity={Math.random() * 0.7 + 0.2}
          />
        ))}
      </svg>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
        <p className="text-xs uppercase tracking-[0.18em] opacity-70">Trail of the week</p>
        <p className="font-display text-2xl mt-1">Squamish Valley FSR</p>
        <p className="text-sm opacity-80 mt-1">38 km of intermediate forest service road</p>
      </div>

      <div className="absolute top-4 right-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
        Photos coming soon
      </div>
    </div>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12c0 4.418-4.03 8-9 8a9.9 9.9 0 0 1-3.8-.74L3 20l.94-3.6A7.9 7.9 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
