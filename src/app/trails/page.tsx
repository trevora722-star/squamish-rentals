import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/site/ChatWidget";
import { PageBanner } from "@/components/site/PageBanner";

export const metadata = {
  title: "Trails",
  description:
    "Our favourite ATV-friendly routes in the Sea-to-Sky — from beginner-friendly forest service roads to advanced backcountry rides.",
};

const TRAILS = [
  {
    slug: "squamish-valley-fsr",
    name: "Squamish Valley FSR",
    distance: "38 km return",
    elevation: "Low — gentle valley climb",
    level: "Beginner / Intermediate",
    season: "Late May to October",
    body: "The wide forest service road that climbs the Squamish River valley toward Elaho. Steady grades, good sightlines, and dozens of side spurs to explore. Mountain views the whole way. A great first ride for new riders.",
    tips: [
      "Watch for logging trucks midweek — pull off and let them pass.",
      "Two river crossings (bridged) about 12 km in.",
      "Round-trip is easy on one tank.",
    ],
  },
  {
    slug: "brandywine-callaghan",
    name: "Brandywine + Callaghan",
    distance: "55 km loop options",
    elevation: "Moderate — alpine meadows up to ~1500m",
    level: "Intermediate",
    season: "Late June to October",
    body: "Some of the best alpine views in the corridor. Climb up the Callaghan side, ride across to Brandywine, drop in toward the falls. Dozens of camp spots and small lakes. Best ridden mid-summer once the snow's off.",
    tips: [
      "Carry an extra layer — temps drop fast above the treeline.",
      "Check the BC Recreation Sites map for current closures.",
      "Worth pairing with a 60-minute guided intro if you're newer.",
    ],
  },
  {
    slug: "indian-arm-backroads",
    name: "Indian Arm Backroads",
    distance: "70 km technical",
    elevation: "Significant — multiple steep climbs",
    level: "Advanced",
    season: "Late June to mid-October",
    body: "Technical climbs, water crossings, and serious elevation changes. The classic challenge ride for experienced riders. Beautiful viewpoints once you earn them. Not appropriate as a first ride.",
    tips: [
      "Ride with at least one other person — patches have no cell service.",
      "Tell us your route at delivery so we know roughly where to look.",
      "Big-bore machines handle this best.",
    ],
  },
  {
    slug: "powder-mountain",
    name: "Powder Mountain catchment",
    distance: "30 km out-and-back",
    elevation: "Moderate — high-elevation glacial views",
    level: "Intermediate",
    season: "July to mid-September",
    body: "Shorter than the others but the payoff is dramatic glacier viewpoints. The road has been improved in recent years and is now manageable on a stock ATV. Best on a clear day.",
    tips: [
      "Earlier is better — afternoon clouds roll in fast.",
      "No water sources up high; bring 3L per person minimum.",
      "Sunscreen — the reflection off the glacier is no joke.",
    ],
  },
];

export default function TrailsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageBanner
          imageSrc="/images/kawasaki-atv.webp"
          eyebrow="Trails"
          headline="Where to ride in the Sea-to-Sky."
          subhead="A short list of the routes I recommend most. Tell our chat assistant where you're staying and what kind of ride you want — it'll match the right route to your group, your machine, and current conditions."
        />

        <section className="container-x mx-auto max-w-4xl py-20 grid gap-6">
          {TRAILS.map((t) => (
            <article
              key={t.slug}
              className="rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <p className="font-display text-2xl font-semibold">{t.name}</p>
                <span className="text-xs font-semibold uppercase tracking-wider rounded-full bg-primary-soft px-3 py-1 text-primary">
                  {t.level}
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-4 text-xs border-y border-border py-4">
                <div>
                  <dt className="text-muted-foreground">Distance</dt>
                  <dd className="mt-0.5 font-semibold">{t.distance}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Elevation</dt>
                  <dd className="mt-0.5 font-semibold">{t.elevation}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Best season</dt>
                  <dd className="mt-0.5 font-semibold">{t.season}</dd>
                </div>
              </dl>
              <p className="mt-4 text-muted-foreground leading-relaxed">{t.body}</p>
              <div className="mt-5 rounded-lg bg-muted px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-fg">Tips from us</p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  {t.tips.map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <Link
                  href={`/chat?route=${t.slug}`}
                  className="btn-primary text-sm inline-block"
                >
                  Plan a trip on this route
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
