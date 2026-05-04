import Link from "next/link";

const NAV = [
  { href: "/fleet", label: "Fleet" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/trails", label: "Trails" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/65">
      <div className="container-x mx-auto flex h-16 max-w-7xl items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <Logo className="h-8 w-8" />
          <span className="hidden sm:inline">Squamish Adventure Rentals</span>
          <span className="sm:hidden">SAR</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-fg transition-colors">
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

function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="19" fill="var(--color-primary)" />
      <path
        d="M8 26 L14 18 L20 22 L26 14 L32 26"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="29" r="2.5" fill="var(--color-primary-foreground)" />
      <circle cx="26" cy="29" r="2.5" fill="var(--color-primary-foreground)" />
    </svg>
  );
}
