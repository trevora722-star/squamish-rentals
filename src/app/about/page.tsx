import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/site/ChatWidget";

export const metadata = {
  title: "About us",
  description:
    "Squamish Adventure Rentals is a small, locally owned ATV rental company delivering anywhere in the Sea-to-Sky corridor.",
};

const VALUES = [
  {
    title: "Local before anything else",
    body: "We live and ride here. Every recommendation we make is based on a route we've actually run — not a Google search.",
  },
  {
    title: "Small and simple",
    body: "Four ATVs. One model. One delivery van. We'd rather be the easiest rental in the corridor than the biggest.",
  },
  {
    title: "Safety isn't optional",
    body: "Every ride starts with a hands-on briefing. Not a video, not a checklist — an actual conversation with a real person who's ridden the trail you're about to ride.",
  },
  {
    title: "No surprises at checkout",
    body: "The price you see is the price you pay. Helmets, gear, fuel, briefing — included. Free delivery in Squamish. No mystery fees.",
  },
];

const TEAM = [
  {
    name: "[Owner name — edit]",
    role: "Founder & lead guide",
    bio: "Born and raised in the Sea-to-Sky. Spent fifteen years guiding before deciding the rental model in BC could be a lot friendlier — so we made it. [Friends to edit with real bio.]",
  },
  {
    name: "[Co-owner name — edit]",
    role: "Operations & deliveries",
    bio: "The reason your ATV is on time, fuelled, and ready when you open the door. Knows every backroad between Britannia and Pemberton. [Friends to edit with real bio.]",
  },
  {
    name: "[Mechanic name — edit]",
    role: "Lead mechanic",
    bio: "Inspects every machine before every rental. The reason \"brand-new condition\" actually means brand-new condition. [Friends to edit with real bio.]",
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
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(60% 60% at 80% 0%, rgba(13, 79, 74, 0.18) 0%, rgba(13, 79, 74, 0) 60%)",
            }}
          />
          <div className="container-x mx-auto max-w-4xl pt-20 pb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              About us
            </p>
            <h1 className="mt-3">
              Built by people who actually
              <span className="block text-primary">love this corridor.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Squamish Adventure Rentals is a small, family-run ATV rental
              company based in Squamish, British Columbia. We deliver anywhere
              in the Sea-to-Sky corridor, we keep the fleet small and the
              service personal, and we've built our entire booking flow around
              the idea that renting an ATV should feel like texting a friend
              who happens to own a few.
            </p>
          </div>
        </section>

        {/* The story */}
        <section className="container-x mx-auto max-w-3xl py-16 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Our story
          </p>
          <h2>How this started.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            <span className="rounded bg-accent-soft px-1 text-fg/80">
              [Friends — replace this paragraph with your real founding story.]
            </span>{" "}
            We started Squamish Adventure Rentals in [year] because the
            existing rental options in the Sea-to-Sky corridor felt the same:
            drive to a shop, fill out a stack of forms, watch a generic safety
            video, hope your machine has fuel. We wanted something simpler. We
            wanted to deliver a rented ATV to a customer's doorstep the same
            way you'd lend a friend your truck for the weekend — fuelled,
            briefed, ready to go.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            <span className="rounded bg-accent-soft px-1 text-fg/80">
              [Edit me.]
            </span>{" "}
            We started with two machines and a van. Now it's four brand-new
            Kawasaki ATVs and a chat assistant that can book the whole trip in
            five minutes. The corridor is still the same — endless forest
            service roads, alpine lakes, rivers that make you stop and just
            look at them — and we still take every customer up the trail in
            our heads before they ride. That part won't change.
          </p>
        </section>

        {/* Values */}
        <section className="bg-muted">
          <div className="container-x mx-auto max-w-5xl py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              What we believe
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

        {/* Team */}
        <section className="container-x mx-auto max-w-5xl py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            The team
          </p>
          <h2 className="mt-3">The people behind the keys.</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            <span className="rounded bg-accent-soft px-1">
              [Friends — replace these placeholders with real names, photos,
              and bios.]
            </span>
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TEAM.map((t) => (
              <article
                key={t.name}
                className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
              >
                <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-primary-foreground/70 text-xs uppercase tracking-[0.18em]">
                    Photo placeholder
                  </span>
                </div>
                <p className="mt-5 font-display text-lg font-semibold">{t.name}</p>
                <p className="text-xs uppercase tracking-wider text-accent mt-0.5">
                  {t.role}
                </p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.bio}</p>
              </article>
            ))}
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
          <h2>The corridor we know best.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We service Britannia Beach in the south up to Pemberton in the
            north, with custom delivery options into Greater Vancouver. The
            sweet spot is the Squamish Valley, Brandywine and Callaghan,
            and Cheakamus — wide forest service roads that suit beginners and
            experienced riders alike, with options to push deeper if you've
            got the chops.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Want our trail recommendations? Take a look at the{" "}
            <Link href="/trails" className="text-primary underline underline-offset-2">
              trail guide
            </Link>{" "}
            — or open a chat and we'll match a route to your group, your
            machine, and the current conditions.
          </p>
        </section>

        {/* CTA */}
        <section className="container-x mx-auto max-w-7xl pb-24">
          <div className="rounded-2xl bg-primary text-primary-foreground px-8 py-14 md:px-14 md:py-16 text-center">
            <h2 className="text-primary-foreground">Come ride with us.</h2>
            <p className="mt-4 text-primary-foreground/85 max-w-xl mx-auto">
              Book online, talk to our chat assistant, or just call us. Whatever
              works for you, we'll meet you there.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/book" className="btn-accent">
                Book online
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
