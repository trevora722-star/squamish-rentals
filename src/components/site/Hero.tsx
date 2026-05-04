import Link from "next/link";
import { PageBanner } from "@/components/site/PageBanner";

export function Hero() {
  return (
    <>
      <PageBanner
        imageSrc="/images/kawasaki-atv.webp"
        eyebrow="Now booking the 2026 season · Sea-to-Sky, BC"
        headline="ATVs delivered to your trail. Throttle ready."
        subhead="Premium quad rentals in Squamish and the Sea-to-Sky corridor. We bring the machines to your doorstep, your campsite, or the trailhead — gear, fuel, and a thorough safety briefing included."
        height="xl"
      />

      {/* CTAs below the banner */}
      <section className="container-x mx-auto max-w-5xl py-14">
        <div className="flex flex-wrap gap-3">
          <Link href="/book" className="btn-accent inline-flex items-center gap-2">
            Book online
          </Link>
          <Link href="/chat" className="btn-primary inline-flex items-center gap-2">
            <ChatIcon className="h-4 w-4" />
            Chat with us
          </Link>
          <Link href="/fleet" className="btn-ghost">Browse the fleet</Link>
        </div>
      </section>
    </>
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
