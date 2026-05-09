import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary text-secondary-foreground">
      <div className="container-x mx-auto max-w-7xl py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 max-w-sm">
          <p className="font-display text-2xl font-semibold tracking-tight">
            Squamish Adventure Rentals
          </p>
          <p className="mt-3 text-sm leading-relaxed text-secondary-foreground/75">
            ATV rentals delivered anywhere in the Sea-to-Sky corridor. Family
            owned, locally operated, and built around getting you on the trail
            faster.
          </p>
          <p className="mt-6 text-sm text-secondary-foreground/75">
            Squamish, BC · Service area: Britannia Beach to Pemberton
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground/60">
            Explore
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/fleet" className="hover:text-accent">The fleet</Link></li>
            <li><Link href="/how-it-works" className="hover:text-accent">How it works</Link></li>
            <li><Link href="/trails" className="hover:text-accent">Trail guide</Link></li>
            <li><Link href="/about" className="hover:text-accent">About us</Link></li>
            <li><Link href="/gift" className="hover:text-accent">Gift a ride</Link></li>
            <li><Link href="/faq" className="hover:text-accent">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground/60">
            Get in touch
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="mailto:info@squamishadventurerentals.com" className="hover:text-accent">
                info@squamishadventurerentals.com
              </a>
            </li>
            <li>
              <a href="tel:+18886827545" className="hover:text-accent">
                1-888-682-7545
              </a>
            </li>
            <li>
              <Link href="/chat" className="hover:text-accent">
                Chat 24/7
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-secondary-foreground/10">
        <div className="container-x mx-auto max-w-7xl py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-secondary-foreground/60">
          <p>© {new Date().getFullYear()} Squamish Adventure Rentals. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/legal/terms" className="hover:text-accent">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-accent">Privacy</Link>
            <Link href="/legal/waiver" className="hover:text-accent">Rental waiver</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
