"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/fleet", label: "Fleet" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/trails", label: "Trails" },
  { href: "/about", label: "About" },
  { href: "/gift", label: "Gift" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu whenever route changes (covers Link navigations cleanly).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

          {/* Mobile hamburger toggle — hidden on md+ */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-fg ml-1"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              {open ? (
                <path
                  d="M6 6l12 12M18 6l-12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="md:hidden fixed inset-0 top-24 z-30 bg-black/40 backdrop-blur-sm"
          />
          {/* Panel */}
          <div
            id="mobile-nav"
            className="md:hidden absolute left-0 right-0 top-full z-40 border-b border-border bg-bg shadow-[var(--shadow-pop)] animate-pop-in"
          >
            <nav
              aria-label="Mobile primary"
              className="container-x mx-auto max-w-7xl py-3 flex flex-col"
            >
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-3.5 rounded-md text-base font-medium border-b border-border last:border-b-0 ${
                      active
                        ? "text-primary"
                        : "text-fg hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-3 pt-3 border-t border-border flex gap-2">
                <Link
                  href="/chat"
                  className="btn-ghost flex-1 text-center text-sm"
                >
                  Chat with us
                </Link>
                <Link
                  href="/book"
                  className="btn-accent flex-1 text-center text-sm"
                >
                  Book now
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
