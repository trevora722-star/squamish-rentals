import Link from "next/link";
import Image from "next/image";

const NAV = [
  { href: "/fleet", label: "Fleet" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/trails", label: "Trails" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/75">
      <div className="container-x mx-auto flex h-24 md:h-32 max-w-7xl items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="Squamish Adventure Rentals — Home"
          className="flex items-center"
        >
          <Image
            src="/images/logo.png"
            alt="Squamish Adventure Rentals"
            width={300}
            height={300}
            priority
            className="h-16 md:h-28 w-auto"
          />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-fg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/chat" className="hidden sm:inline-flex btn-ghost text-sm">
            Chat with us
          </Link>
          <Link href="/book" className="btn-accent text-sm">
            Book now
          </Link>
        </div>
      </div>
    </header>
  );
}
