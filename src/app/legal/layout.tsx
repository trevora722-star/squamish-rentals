import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const NAV = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/waiver", label: "Rental waiver" },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container-x mx-auto max-w-3xl pt-14 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Legal
          </p>
          <nav className="mt-4 flex gap-5 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-muted-foreground hover:text-fg"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </section>
        <section className="container-x mx-auto max-w-3xl pb-20 prose-legal">
          {children}
        </section>
      </main>
      <Footer />
    </>
  );
}
