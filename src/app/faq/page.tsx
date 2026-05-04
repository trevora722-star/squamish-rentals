import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/site/ChatWidget";
import Link from "next/link";

export const metadata = {
  title: "Frequently asked questions",
  description:
    "How delivery works, what's included, age and licensing requirements, weather policy, and more.",
};

const FAQ = [
  {
    q: "Do you deliver?",
    a: "Yes — and only delivery. We don't have a shop you can pick up from. We deliver to your address, your campsite, or directly to a trailhead. Free inside Squamish; flat fees for the rest of the Sea-to-Sky and Greater Vancouver. Out-of-zone trips get a custom quote.",
  },
  {
    q: "What's included with every rental?",
    a: "DOT-rated helmets, goggles, and gloves for every rider, in any size. A full tank of fuel. A thorough hands-on safety briefing before you ride. Roadside support from us if anything goes wrong on the trail.",
  },
  {
    q: "How old do I need to be?",
    a: "All riders must be 19 or older with a valid driver's license. This applies to passengers on two-up machines as well. We check ID at delivery — no exceptions.",
  },
  {
    q: "I've never ridden before. Is that okay?",
    a: "Absolutely. We rent to first-timers all the time. Our beginner machines (Trailblazer 500) are forgiving, and the safety briefing covers everything you need. We can also add a 60-minute guided intro ride for $120.",
  },
  {
    q: "What does it cost?",
    a: "Daily rates start at $199. Multi-day discounts kick in at 3 days (8% off) and 7+ days (15% off). Delivery is free in Squamish, $60–80 in the Sea-to-Sky corridor, and $150 for Greater Vancouver. A refundable damage deposit is pre-authorized on your card.",
  },
  {
    q: "What if it rains?",
    a: "We rarely cancel for rain — the trails handle it well, and the gear keeps you dry enough. We will reschedule for free if there's an active road closure, lightning warning, or heat advisory. If conditions are unsafe and we cancel, you get a full refund or a free reschedule.",
  },
  {
    q: "How does the chat booking work?",
    a: "Open a chat, tell our assistant your dates, group size, experience level, and where you want to ride. It checks availability, gives you a quote, and books the trip end-to-end. You'll get a Stripe payment link in the chat — pay it within 15 minutes to lock the booking.",
  },
  {
    q: "Can I modify or cancel a booking?",
    a: "Yes. Free changes up to 48 hours before your trip. Inside 48 hours, modifications are subject to availability and a $50 change fee. Cancellations within 48 hours are 50% refundable; within 24 hours, non-refundable. Reach out via chat or email and a team member will handle it.",
  },
  {
    q: "Where can I actually ride?",
    a: "Public Forest Service Roads (FSR) anywhere your delivery covers — including Squamish Valley FSR, Brandywine, Callaghan, and Indian Arm. We don't allow riding on private property without owner permission, on highways, or inside provincial parks where ATV use isn't permitted. Our briefing covers the rules.",
  },
];

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container-x mx-auto max-w-3xl py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Questions
          </p>
          <h1 className="mt-3">The things people ask us most.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            If your question isn't here, open the chat — our assistant probably
            has the answer, and if it doesn't, it'll loop in a human.
          </p>

          <div className="mt-12 divide-y divide-border border-y border-border">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                  <span className="font-display text-lg font-semibold pr-8">{item.q}</span>
                  <span className="mt-1.5 inline-block flex-shrink-0 text-primary group-open:rotate-45 transition-transform">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-14 rounded-xl bg-primary-soft px-6 py-7">
            <p className="font-display text-xl font-semibold text-primary">Still wondering?</p>
            <p className="mt-2 text-fg/80">
              Drop your question in the chat. If our assistant can't answer, it'll forward to the team.
            </p>
            <Link href="/chat" className="btn-primary mt-5 inline-block">Open chat</Link>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
