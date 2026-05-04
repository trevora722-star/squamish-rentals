import Link from "next/link";

export function ClosingCTA() {
  return (
    <section className="container-x mx-auto max-w-7xl pb-24">
      <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground px-8 py-16 md:px-16 md:py-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(50% 50% at 100% 0%, rgba(234, 125, 44, 0.45) 0%, rgba(234, 125, 44, 0) 60%)",
          }}
        />
        <div className="relative max-w-2xl">
          <h2 className="text-primary-foreground">Ready to ride?</h2>
          <p className="mt-5 text-lg text-primary-foreground/85">
            Talk to our chat assistant — it'll handle quotes, availability, and
            booking end-to-end. Or call us. Or text. We're flexible.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/chat" className="btn-accent">Open chat</Link>
            <Link href="/fleet" className="inline-flex items-center justify-center rounded-md border border-primary-foreground/30 px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
              Browse the fleet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
