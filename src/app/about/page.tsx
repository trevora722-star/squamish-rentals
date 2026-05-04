import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/site/ChatWidget";

export const metadata = {
  title: "About us",
  description:
    "Meet Adam, the guy behind Squamish Adventure Rentals. ATVs, backcountry, and a mission to make Sea-to-Sky adventures accessible to everyone.",
};

const VALUES = [
  {
    title: "Local before anything else",
    body: "I live and ride here. Every recommendation is based on a route I've actually run — not a Google search.",
  },
  {
    title: "Small and simple",
    body: "Four ATVs. One model. One delivery van. I'd rather be the easiest rental in the corridor than the biggest.",
  },
  {
    title: "Safety isn't optional",
    body: "Every ride starts with a hands-on briefing — not a video, not a checklist. An actual conversation with a real person who's ridden the trail you're about to ride.",
  },
  {
    title: "No surprises at checkout",
    body: "The price you see is the price you pay. Helmets, gear, fuel, briefing — included. Free delivery in Squamish. No mystery fees.",
  },
];

const STATS = [
  { value: "4", label: "ATVs in the fleet" },
  { value: "100%", label: "Delivered, never picked up" },
  { value: "0", label: "Hidden fees, ever" },
  { value: "24/7", label: "Booking via chat" },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero — "Hey, I'm Adam" */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(60% 60% at 80% 0%, rgba(13, 79, 74, 0.15) 0%, rgba(13, 79, 74, 0) 60%)",
            }}
          />
          <div className="container-x mx-auto max-w-6xl pt-16 pb-20 grid gap-10 md:gap-14 md:grid-cols-12 items-center">
            <div className="md:col-span-6">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-[var(--shadow-pop)]">
                {/* Drop the photo at /public/images/adam-about.jpg and it
                    appears here. Until then, we render a placeholder. */}
                <Image
                  src="/images/adam-about.jpg"
                  alt="Adam, founder of Squamish Adventure Rentals, with a Kawasaki ATV in the BC backcountry"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority
                />
                <div className="absolute bottom-3 left-4 text-[11px] uppercase tracking-[0.18em] text-primary-foreground/65 pointer-events-none mix-blend-difference">
                  Photo: replace at /public/images/adam-about.jpg
                </div>
              </div>
            </div>

            <div className="md:col-span-6">
              <p className="text-sm font-semibold italic text-muted-foreground">
                Meet the guy behind the gears
              </p>
              <h1 className="mt-2">Hey, I&apos;m Adam</h1>

              <div className="mt-6 space-y-5 text-lg text-muted-foreground leading-relaxed">
                <p>
                  I started Squamish Adventure Rentals because I wanted to
                  share the part of BC that makes me feel alive.
                </p>
                <p>
                  There&apos;s something uniquely special about being in the
                  backcountry that&apos;s unlike any other feeling. This
                  typically has a high cost of entry in order to do safely and
                  responsibly, and Squamish Adventure Rentals is here to lower
                  that barrier and unlock some new terrain for adventurers of
                  all walks of life.
                </p>
                <p>
                  Whether it&apos;s your first ride or you grew up on a farm
                  riding ATVs, I&apos;m here to make sure you&apos;re safe,
                  stoked, and have an unforgettable adventure in all the right
                  ways.
                </p>
              </div>

              <ul className="mt-8 space-y-1.5 text-fg">
                <li className="flex gap-2">
                  <span className="text-accent">→</span>
                  <span>Let&apos;s ride.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">→</span>
                  <span>Let&apos;s explore.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">→</span>
                  <span>Let&apos;s make some damn good memories.</span>
                </li>
              </ul>

              <Link href="/book" className="btn-accent mt-8 inline-block">
                Book Your Ride
              </Link>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-muted">
          <div className="container-x mx-auto max-w-5xl py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              What we stand for
            </p>
            <h2 className="mt-3">Four things, no slogans.</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="rounded-xl border border-border bg-card p-7 shadow-[var(--shadow-card)]"
                >
                  <p className="font-display text-xl font-semibold">{v.title}</p>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-primary text-primary-foreground">
          <div className="container-x mx-auto max-w-6xl py-20">
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-center">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-5xl">{s.value}</p>
                  <p className="mt-2 text-sm uppercase tracking-wider opacity-80">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Where we ride */}
        <section className="container-x mx-auto max-w-3xl py-20 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Where we ride
          </p>
          <h2>The corridor I know best.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I service Britannia Beach in the south up to Pemberton in the
            north, with custom delivery options into Greater Vancouver. The
            sweet spot is the Squamish Valley, Brandywine and Callaghan, and
            Cheakamus — wide forest service roads that suit beginners and
            experienced riders alike, with options to push deeper if you&apos;ve
            got the chops.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Want my trail recommendations?{" "}
            <Link href="/trails" className="text-primary underline underline-offset-2">
              Take a look at the trail guide
            </Link>{" "}
            or open a chat and I&apos;ll match a route to your group, your
            machine, and the current conditions.
          </p>
        </section>

        {/* CTA */}
        <section className="container-x mx-auto max-w-7xl pb-24">
          <div className="rounded-2xl bg-primary text-primary-foreground px-8 py-14 md:px-14 md:py-16 text-center">
            <h2 className="text-primary-foreground">Come ride with me.</h2>
            <p className="mt-4 text-primary-foreground/85 max-w-xl mx-auto">
              Book online, talk to the chat assistant, or just call. Whatever
              works for you, I&apos;ll meet you there.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/book" className="btn-accent">
                Book Your Ride
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-md border border-primary-foreground/30 px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              >
                Open chat
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
