import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/site/ChatWidget";
import { PageBanner } from "@/components/site/PageBanner";

export const metadata = {
  title: "The Fleet",
  description:
    "Four brand-new Kawasaki ATVs delivered anywhere in the Sea-to-Sky corridor.",
};

export default function FleetPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageBanner
          imageSrc="/images/kawasaki-atv.webp"
          eyebrow="The fleet"
          headline="Four brand-new Kawasaki ATVs."
          subhead="Reliable, easy to ride, and well suited to local terrain. Serviced and fuelled before every rental, then delivered straight to your address or trailhead."
        />

        <section className="container-x mx-auto max-w-4xl py-16">
          <article className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-primary to-secondary">
              <Image
                src="/images/kawasaki-atv.webp"
                alt="Kawasaki ATV in the Sea-to-Sky backcountry"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 800px, 100vw"
              />
            </div>
            <div className="p-7 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Brand-new for 2026
              </p>
              <p className="mt-2 font-display text-3xl font-semibold">Kawasaki ATV</p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Reliable, easy to ride, and well suited to local terrain. We've got
                four of them — perfect for a couple, a small group, or a family ride
                out into the Sea-to-Sky.
              </p>

              <ul className="mt-6 grid gap-2 sm:grid-cols-2 text-sm">
                <li className="flex gap-2"><span className="text-primary">✓</span> Brand-new for the 2026 season</li>
                <li className="flex gap-2"><span className="text-primary">✓</span> Easy and confidence-inspiring to ride</li>
                <li className="flex gap-2"><span className="text-primary">✓</span> Helmets, goggles, and gloves included</li>
                <li className="flex gap-2"><span className="text-primary">✓</span> Fuelled and ready for the day</li>
                <li className="flex gap-2"><span className="text-primary">✓</span> Hands-on safety briefing included</li>
                <li className="flex gap-2"><span className="text-primary">✓</span> Free delivery within Squamish</li>
              </ul>

              <dl className="mt-7 grid grid-cols-3 gap-4 text-sm border-y border-border py-5">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">From</dt>
                  <dd className="mt-1 font-display text-2xl text-primary">$249<span className="text-sm text-fg/60 ml-1">/day</span></dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Available</dt>
                  <dd className="mt-1 font-medium">Up to 4 riders</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Skill</dt>
                  <dd className="mt-1 font-medium">Beginner-friendly</dd>
                </div>
              </dl>

              <div className="mt-7 flex flex-wrap gap-2">
                <Link href="/book" className="btn-primary text-sm">
                  Book online
                </Link>
                <Link href="/chat" className="btn-ghost text-sm">
                  Ask in chat
                </Link>
                <Link href="/fleet/kawasaki-atv" className="btn-ghost text-sm">
                  More details
                </Link>
              </div>
            </div>
          </article>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
