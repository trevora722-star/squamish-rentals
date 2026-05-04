import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/site/ChatWidget";

export const metadata = {
  title: "How it works",
  description:
    "Step-by-step: how to book an ATV rental with Squamish Adventure Rentals through our chat assistant.",
};

const STEPS = [
  {
    num: "01",
    title: "Open the chat",
    body: "Tap the chat bubble or head to /chat. Tell our assistant your dates, group size, riding experience, and where you want to ride. No forms, no phone tag.",
  },
  {
    num: "02",
    title: "Get a quote",
    body: "The assistant suggests a fitting machine, checks live availability, and reads back a clear quote — including delivery, taxes, and a refundable damage deposit.",
  },
  {
    num: "03",
    title: "Pay securely",
    body: "Once you confirm, we hold the gear for 15 minutes and send a Stripe payment link. Pay with any major card. You'll get a confirmation email immediately.",
  },
  {
    num: "04",
    title: "We deliver",
    body: "On the morning of your trip, the team arrives with the ATVs, helmets, and gear. We walk you through the machine, do a quick safety briefing, and help you load up.",
  },
  {
    num: "05",
    title: "Ride",
    body: "Hit the trails. Call us anytime if anything comes up — flats, mechanical issues, getting turned around. We'll get you sorted.",
  },
  {
    num: "06",
    title: "We pick everything up",
    body: "End of trip, we come back to your address. No drop-off detours, no cleaning fees if it's reasonably tidy, no fuss.",
  },
];

const POLICIES = [
  {
    title: "Age & licensing",
    body: "Riders and passengers must be 19 or older with a valid driver's license. ID checked at delivery.",
  },
  {
    title: "Weather",
    body: "We rarely cancel for rain. We do reschedule for free if there's a road closure, lightning warning, or extreme heat advisory.",
  },
  {
    title: "Damage deposit",
    body: "A refundable hold goes on your card before delivery: $1,000–$2,000 depending on the machine. Released back when the ATV comes home in the same shape.",
  },
  {
    title: "Modifications & cancellations",
    body: "Free changes 48+ hours out. Inside 48 hours: $50 change fee, 50% refund. Inside 24 hours: non-refundable. Reach out via chat — a human handles these.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container-x mx-auto max-w-4xl pt-16 pb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            How it works
          </p>
          <h1 className="mt-3">From "let's go" to throttle, in six steps.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            We built the booking flow to feel like texting a friend who happens
            to own an ATV shop. Here's exactly what happens.
          </p>
        </section>

        <section className="container-x mx-auto max-w-4xl pb-20">
          <ol className="grid gap-5 md:grid-cols-2">
            {STEPS.map((s) => (
              <li key={s.num} className="rounded-xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
                <span className="font-display text-3xl text-primary/30">{s.num}</span>
                <p className="mt-2 font-display text-xl font-semibold">{s.title}</p>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-muted">
          <div className="container-x mx-auto max-w-4xl py-20">
            <h2>The fine print, plain English.</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {POLICIES.map((p) => (
                <div key={p.title} className="rounded-xl border border-border bg-card p-6">
                  <p className="font-display text-lg font-semibold">{p.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-x mx-auto max-w-4xl py-20 text-center">
          <h2>Ready when you are.</h2>
          <Link href="/chat" className="btn-primary mt-6 inline-block">Open chat</Link>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
